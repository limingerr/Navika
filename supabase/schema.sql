-- ============================================================
-- NAVIKA Database Schema (Supabase PostgreSQL + RLS + RPC)
-- Acuan: PRD-BACKEND-NAVIKA.md §4.2, §4.3, §4.5
-- ============================================================

-- Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. TABEL KATEGORI (categories)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT categories_name_unique UNIQUE (name)
);

-- Indeks nama tanpa case-sensitive
CREATE UNIQUE INDEX IF NOT EXISTS categories_name_lower_idx ON public.categories (LOWER(name));

-- ------------------------------------------------------------
-- 2. TABEL PERAN PENGGUNA (user_roles)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'mahasiswa' CHECK (role IN ('mahasiswa', 'pengelola')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- 3. TABEL PROFIL MAHASISWA (profiles)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    university TEXT DEFAULT '',
    major TEXT DEFAULT '',
    semester INT CHECK (semester IS NULL OR (semester BETWEEN 1 AND 8)),
    gpa NUMERIC(3,2) CHECK (gpa IS NULL OR (gpa >= 0.00 AND gpa <= 4.00)),
    interests TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- 4. TABEL KATALOG PELUANG (opportunities)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    primary_category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    field TEXT DEFAULT 'Umum',
    source_url TEXT NOT NULL CHECK (source_url ~* '^https?://'),
    summary TEXT,
    summary_en TEXT,
    description TEXT,
    requirements TEXT[] DEFAULT '{}',
    requirements_en TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    benefits_en TEXT[] DEFAULT '{}',
    publication_status TEXT NOT NULL DEFAULT 'draf' CHECK (publication_status IN ('draf', 'terbit', 'ditutup', 'diarsipkan')),
    recommended BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS opportunities_status_idx ON public.opportunities (publication_status);
CREATE INDEX IF NOT EXISTS opportunities_category_idx ON public.opportunities (primary_category_id);
CREATE INDEX IF NOT EXISTS opportunities_field_idx ON public.opportunities (field);

-- ------------------------------------------------------------
-- 5. TABEL KATEGORI TAMBAHAN (opportunity_additional_categories)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunity_additional_categories (
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    PRIMARY KEY (opportunity_id, category_id)
);

-- ------------------------------------------------------------
-- 6. TABEL ATURAN KELAYAKAN / MATCH (eligibility_rules)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.eligibility_rules (
    opportunity_id UUID PRIMARY KEY REFERENCES public.opportunities(id) ON DELETE CASCADE,
    allowed_majors TEXT[] DEFAULT '{"Semua Jurusan"}',
    semester_min INT CHECK (semester_min IS NULL OR (semester_min BETWEEN 1 AND 8)),
    semester_max INT CHECK (semester_max IS NULL OR (semester_max BETWEEN 1 AND 8)),
    gpa_min NUMERIC(3,2) CHECK (gpa_min IS NULL OR (gpa_min >= 0.00 AND gpa_min <= 4.00)),
    interest_tags TEXT[] DEFAULT '{}',
    other_requirements TEXT
);

-- ------------------------------------------------------------
-- 7. TABEL DEADLINE / TENGGAT (deadlines)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deadlines (
    opportunity_id UUID PRIMARY KEY REFERENCES public.opportunities(id) ON DELETE CASCADE,
    local_date DATE,
    local_time TIME,
    source_timezone TEXT DEFAULT 'Asia/Jakarta',
    utc_instant TIMESTAMPTZ,
    precision TEXT NOT NULL DEFAULT 'tanggal' CHECK (precision IN ('tidak_diumumkan', 'tanggal', 'tanggal_jam'))
);

CREATE INDEX IF NOT EXISTS deadlines_local_date_idx ON public.deadlines (local_date);

-- ------------------------------------------------------------
-- 8. TABEL BOOKMARK & TRACKER (saved_opportunities)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE RESTRICT,
    application_status TEXT NOT NULL DEFAULT 'tertarik' CHECK (application_status IN ('tertarik', 'sedang_disiapkan', 'sudah_mendaftar', 'diterima', 'ditolak', 'tidak_dilanjutkan')),
    saved_at TIMESTAMPTZ DEFAULT now(),
    status_updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS saved_opportunities_user_idx ON public.saved_opportunities (user_id);

-- ------------------------------------------------------------
-- 9. TABEL AUDIT LOG ADMIN (audit_events)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES auth.users(id),
    entity_id UUID,
    action TEXT NOT NULL,
    changed_fields JSONB,
    occurred_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_events_actor_idx ON public.audit_events (actor_user_id);

-- ============================================================
-- KEBIJAKAN ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_additional_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Kategori: dapat dibaca oleh siapa saja
CREATE POLICY "Categories are readable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- User roles: hanya pemilik yang dapat membaca role miliknya
CREATE POLICY "Users can view own role"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- Profiles: pengguna hanya mengelola profil miliknya sendiri
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Opportunities:
-- Terbit dan Ditutup dapat dibaca publik/mahasiswa.
-- Draf dan Arsip hanya dibaca pengelola, kecuali entri arsip yang tersimpan di bookmark mahasiswa.
CREATE POLICY "Opportunities read policy"
    ON public.opportunities FOR SELECT
    USING (
        publication_status IN ('terbit', 'ditutup')
        OR (
            publication_status = 'diarsipkan'
            AND EXISTS (
                SELECT 1 FROM public.saved_opportunities
                WHERE user_id = auth.uid() AND opportunity_id = opportunities.id
            )
        )
        OR EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'pengelola'
        )
    );

CREATE POLICY "Opportunity additional categories read policy"
    ON public.opportunity_additional_categories FOR SELECT
    USING (true);

CREATE POLICY "Eligibility rules read policy"
    ON public.eligibility_rules FOR SELECT
    USING (true);

CREATE POLICY "Deadlines read policy"
    ON public.deadlines FOR SELECT
    USING (true);

-- Saved Opportunities:
-- Mahasiswa hanya dapat membaca dan memodifikasi bookmark miliknya
CREATE POLICY "Users can view own saved opportunities"
    ON public.saved_opportunities FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save opportunities"
    ON public.saved_opportunities FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.opportunities
            WHERE id = opportunity_id AND publication_status IN ('terbit', 'ditutup')
        )
    );

CREATE POLICY "Users can update own bookmark status"
    ON public.saved_opportunities FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmark"
    ON public.saved_opportunities FOR DELETE
    USING (auth.uid() = user_id);

-- Audit Events: hanya dibaca oleh pengelola
CREATE POLICY "Audit events readable only by admin"
    ON public.audit_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'pengelola'
        )
    );

-- ============================================================
-- STORED PROCEDURES / RPC FUNCTIONS
-- ============================================================

-- ------------------------------------------------------------
-- A. MATCH DETERMINISTIK (match_opportunity)
-- Evaluasi jurusan, semester, dan IPK tanpa AI
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.match_opportunity(p_opportunity_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_profile RECORD;
    v_rule RECORD;
    v_major_status TEXT := 'tidak_dipersyaratkan';
    v_major_reason TEXT := 'Semua jurusan diperbolehkan';
    v_semester_status TEXT := 'tidak_dipersyaratkan';
    v_semester_reason TEXT := 'Tidak ada batasan semester';
    v_gpa_status TEXT := 'tidak_dipersyaratkan';
    v_gpa_reason TEXT := 'Tidak ada syarat IPK minimum';
    v_interest_relevant BOOLEAN := false;
    v_overall_status TEXT := 'sesuai_profil';
    v_matching_dims INT := 0;
    v_assessable_dims INT := 0;
    v_total_dims INT := 0;
    v_score NUMERIC := NULL;
BEGIN
    SELECT * INTO v_profile FROM public.profiles WHERE user_id = v_user_id;
    SELECT * INTO v_rule FROM public.eligibility_rules WHERE opportunity_id = p_opportunity_id;

    IF v_rule IS NULL THEN
        RETURN jsonb_build_object(
            'overall_status', 'tanpa_syarat_terstruktur',
            'score', NULL,
            'dimensions', jsonb_build_object()
        );
    END IF;

    -- 1. Evaluasi Jurusan
    IF v_rule.allowed_majors IS NOT NULL AND array_length(v_rule.allowed_majors, 1) > 0 AND NOT ('Semua Jurusan' = ANY(v_rule.allowed_majors)) THEN
        v_assessable_dims := v_assessable_dims + 1;
        v_total_dims := v_total_dims + 1;
        IF v_profile IS NULL OR v_profile.major IS NULL OR v_profile.major = '' THEN
            v_major_status := 'belum_diketahui';
            v_major_reason := 'Isi jurusan di profilmu untuk menilai kelayakan.';
        ELSIF v_profile.major = ANY(v_rule.allowed_majors) THEN
            v_major_status := 'sesuai';
            v_major_reason := 'Jurusan ' || v_profile.major || ' memenuhi syarat program.';
            v_matching_dims := v_matching_dims + 1;
        ELSE
            v_major_status := 'tidak_sesuai';
            v_major_reason := 'Program ini diperuntukkan bagi jurusan tertentu.';
        END IF;
    END IF;

    -- 2. Evaluasi Semester
    IF v_rule.semester_min IS NOT NULL OR v_rule.semester_max IS NOT NULL THEN
        v_assessable_dims := v_assessable_dims + 1;
        v_total_dims := v_total_dims + 1;
        IF v_profile IS NULL OR v_profile.semester IS NULL THEN
            v_semester_status := 'belum_diketahui';
            v_semester_reason := 'Isi semester di profilmu untuk menilai kelayakan.';
        ELSE
            IF (v_rule.semester_min IS NULL OR v_profile.semester >= v_rule.semester_min)
               AND (v_rule.semester_max IS NULL OR v_profile.semester <= v_rule.semester_max) THEN
                v_semester_status := 'sesuai';
                v_semester_reason := 'Semester ' || v_profile.semester || ' berada dalam rentang yang disyaratkan.';
                v_matching_dims := v_matching_dims + 1;
            ELSE
                v_semester_status := 'tidak_sesuai';
                v_semester_reason := 'Semester Anda berada di luar batas program.';
            END IF;
        END IF;
    END IF;

    -- 3. Evaluasi IPK
    IF v_rule.gpa_min IS NOT NULL THEN
        v_assessable_dims := v_assessable_dims + 1;
        v_total_dims := v_total_dims + 1;
        IF v_profile IS NULL OR v_profile.gpa IS NULL THEN
            v_gpa_status := 'belum_diketahui';
            v_gpa_reason := 'Isi IPK di profilmu untuk memeriksa syarat IPK minimum.';
        ELSIF v_profile.gpa >= v_rule.gpa_min THEN
            v_gpa_status := 'sesuai';
            v_gpa_reason := 'IPK ' || v_profile.gpa || ' memenuhi syarat minimum ' || v_rule.gpa_min || '.';
            v_matching_dims := v_matching_dims + 1;
        ELSE
            v_gpa_status := 'tidak_sesuai';
            v_gpa_reason := 'IPK minimum yang disyaratkan adalah ' || v_rule.gpa_min || '.';
        END IF;
    END IF;

    -- Minat (Relevansi)
    IF v_profile IS NOT NULL AND v_profile.interests IS NOT NULL AND v_rule.interest_tags IS NOT NULL THEN
        IF v_profile.interests && v_rule.interest_tags THEN
            v_interest_relevant := true;
        END IF;
    END IF;

    -- Status Akhir
    IF v_major_status = 'tidak_sesuai' OR v_semester_status = 'tidak_sesuai' OR v_gpa_status = 'tidak_sesuai' THEN
        v_overall_status := 'tidak_sesuai';
    ELSIF v_major_status = 'belum_diketahui' OR v_semester_status = 'belum_diketahui' OR v_gpa_status = 'belum_diketahui' THEN
        v_overall_status := 'belum_dapat_dinilai';
    ELSIF v_total_dims = 0 THEN
        v_overall_status := 'tanpa_syarat_terstruktur';
    ELSE
        v_overall_status := 'sesuai_profil';
    END IF;

    IF v_assessable_dims > 0 THEN
        v_score := ROUND((v_matching_dims::numeric / v_assessable_dims::numeric) * 100, 0);
    END IF;

    RETURN jsonb_build_object(
        'overall_status', v_overall_status,
        'score', v_score,
        'matching_dimensions', v_matching_dims,
        'assessable_dimensions', v_assessable_dims,
        'interest_relevant', v_interest_relevant,
        'dimensions', jsonb_build_object(
            'major', jsonb_build_object('status', v_major_status, 'reason', v_major_reason),
            'semester', jsonb_build_object('status', v_semester_status, 'reason', v_semester_reason),
            'gpa', jsonb_build_object('status', v_gpa_status, 'reason', v_gpa_reason)
        )
    );
END;
$$;

-- ------------------------------------------------------------
-- B. AGENDA KALENDER (calendar_agenda)
-- Mengambil jadwal deadline bookmark milik akun aktif
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calendar_agenda(p_from DATE, p_to DATE)
RETURNS TABLE (
    opportunity_id UUID,
    slug TEXT,
    title TEXT,
    category_name TEXT,
    local_date DATE,
    application_status TEXT
)
LANGUAGE sql
SECURITY INVOKER
AS $$
    SELECT 
        o.id AS opportunity_id,
        o.slug,
        o.title,
        c.name AS category_name,
        d.local_date,
        s.application_status
    FROM public.saved_opportunities s
    JOIN public.opportunities o ON o.id = s.opportunity_id
    JOIN public.categories c ON c.id = o.primary_category_id
    JOIN public.deadlines d ON d.opportunity_id = o.id
    WHERE s.user_id = auth.uid()
      AND d.local_date IS NOT NULL
      AND d.local_date BETWEEN p_from AND p_to
    ORDER BY d.local_date ASC;
$$;

-- ------------------------------------------------------------
-- C. PENGHAPUSAN BOOKMARK DENGAN KONFIRMASI (remove_bookmark)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.remove_bookmark(p_opportunity_id UUID, p_confirm BOOLEAN DEFAULT false)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_current_status TEXT;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: sesi tidak ditemukan';
    END IF;

    SELECT application_status INTO v_current_status
    FROM public.saved_opportunities
    WHERE user_id = v_user_id AND opportunity_id = p_opportunity_id;

    IF v_current_status IS NULL THEN
        RETURN jsonb_build_object('status', 'not_found');
    END IF;

    IF v_current_status <> 'tertarik' AND p_confirm IS NOT TRUE THEN
        RETURN jsonb_build_object(
            'status', 'confirmation_required',
            'current_progress', v_current_status
        );
    END IF;

    DELETE FROM public.saved_opportunities
    WHERE user_id = v_user_id AND opportunity_id = p_opportunity_id;

    RETURN jsonb_build_object('status', 'removed');
END;
$$;

-- ------------------------------------------------------------
-- D. ADMIN RPC: PENGELOLAAN KATEGORI & PELUANG
-- ------------------------------------------------------------

-- Tambah Kategori
CREATE OR REPLACE FUNCTION public.create_category(p_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_new_id UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'pengelola') THEN
        RAISE EXCEPTION 'Akses ditolak: khusus pengelola katalog';
    END IF;

    IF p_name IS NULL OR TRIM(p_name) = '' THEN
        RAISE EXCEPTION 'Nama kategori tidak boleh kosong';
    END IF;

    INSERT INTO public.categories (name)
    VALUES (TRIM(p_name))
    RETURNING id INTO v_new_id;

    INSERT INTO public.audit_events (actor_user_id, entity_id, action, changed_fields)
    VALUES (v_user_id, v_new_id, 'create_category', jsonb_build_object('name', p_name));

    RETURN jsonb_build_object('id', v_new_id, 'name', p_name);
END;
$$;

-- Hapus Kategori (Ditolak jika sedang dipakai)
CREATE OR REPLACE FUNCTION public.delete_category(p_category_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'pengelola') THEN
        RAISE EXCEPTION 'Akses ditolak: khusus pengelola katalog';
    END IF;

    -- Periksa apakah kategori dipakai sebagai kategori utama atau tambahan
    IF EXISTS (SELECT 1 FROM public.opportunities WHERE primary_category_id = p_category_id)
       OR EXISTS (SELECT 1 FROM public.opportunity_additional_categories WHERE category_id = p_category_id) THEN
        RETURN jsonb_build_object(
            'error', 'category_in_use',
            'message', 'Kategori tidak dapat dihapus karena masih digunakan oleh peluang aktif/arsip.'
        );
    END IF;

    DELETE FROM public.categories WHERE id = p_category_id;

    INSERT INTO public.audit_events (actor_user_id, entity_id, action, changed_fields)
    VALUES (v_user_id, p_category_id, 'delete_category', jsonb_build_object('deleted_category_id', p_category_id));

    RETURN jsonb_build_object('status', 'deleted');
END;
$$;

-- Arsipkan Peluang (Soft Delete)
CREATE OR REPLACE FUNCTION public.archive_opportunity(p_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'pengelola') THEN
        RAISE EXCEPTION 'Akses ditolak: khusus pengelola katalog';
    END IF;

    UPDATE public.opportunities
    SET publication_status = 'diarsipkan', updated_at = now()
    WHERE id = p_id;

    INSERT INTO public.audit_events (actor_user_id, entity_id, action, changed_fields)
    VALUES (v_user_id, p_id, 'archive_opportunity', jsonb_build_object('status', 'diarsipkan'));

    RETURN jsonb_build_object('status', 'diarsipkan');
END;
$$;
