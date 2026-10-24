-- ============================================================
-- NAVIKA Initial Seed Data
-- 7 Kategori Awal & 46 Peluang Terverifikasi
-- Sesuai PRD-BACKEND-NAVIKA.md §4.2 & §4.4
-- ============================================================

-- 1. SEED 7 KATEGORI AWAL
INSERT INTO public.categories (name) VALUES
  ('Beasiswa'),
  ('Magang'),
  ('Bootcamp'),
  ('Studi Independen'),
  ('Workshop'),
  ('Seminar / Webinar'),
  ('Kompetisi')
ON CONFLICT (name) DO NOTHING;

-- 2. SEED 46 KATALOG PELUANG DENGAN DEADLINE & SYARAT MATCH
DO $$
DECLARE
  v_cat_beasiswa UUID;
  v_cat_magang UUID;
  v_cat_bootcamp UUID;
  v_cat_studi UUID;
  v_cat_workshop UUID;
  v_cat_seminar UUID;
  v_cat_kompetisi UUID;
  v_opp_id UUID;
  v_today DATE := CURRENT_DATE;
BEGIN
  SELECT id INTO v_cat_beasiswa FROM public.categories WHERE name = 'Beasiswa';
  SELECT id INTO v_cat_magang FROM public.categories WHERE name = 'Magang';
  SELECT id INTO v_cat_bootcamp FROM public.categories WHERE name = 'Bootcamp';
  SELECT id INTO v_cat_studi FROM public.categories WHERE name = 'Studi Independen';
  SELECT id INTO v_cat_workshop FROM public.categories WHERE name = 'Workshop';
  SELECT id INTO v_cat_seminar FROM public.categories WHERE name = 'Seminar / Webinar';
  SELECT id INTO v_cat_kompetisi FROM public.categories WHERE name = 'Kompetisi';

  -- Peluang: Djarum Beasiswa Plus
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'djarum', 'Djarum Beasiswa Plus', 'Djarum Foundation', v_cat_beasiswa, 'Umum', 'https://www.djarumbeasiswaplus.org/',
    'Program beasiswa prestasi bagi mahasiswa sarjana dan vokasi berprestasi tinggi dari seluruh perguruan tinggi mitra di Indonesia.', 'Prestigious merit-based scholarship for undergraduate and vocational students across partner universities in Indonesia.', ARRAY['Sedang menempuh pendidikan S1 atau D4 di semester 4 pada perguruan tinggi mitra resmi.', 'Memiliki IPK minimum 3,00 pada semester 3 dan dapat mempertahankannya hingga semester 4.', 'Aktif mengikuti kegiatan organisasi kemahasiswaan intra maupun ekstra kampus.', 'Tidak sedang menerima beasiswa dari institusi, lembaga, atau perusahaan lain.', 'Melampirkan bukti prestasi akademik/non-akademik, transkrip nilai legalisir, dan pasfoto terbaru.']::text[], ARRAY['Currently enrolled in the 4th semester of an undergraduate (S1/D4) degree at an official partner university.', 'Have a minimum GPA of 3.00 in the 3rd semester and maintain it through the 4th semester.', 'Actively engaged in intra- or extra-curricular campus organizations.', 'Not currently receiving any scholarship from other institutions or foundations.', 'Submit proof of achievements, verified academic transcripts, and recent photograph.']::text[], ARRAY['Dana beasiswa sebesar Rp1.000.000 per bulan selama satu tahun penuh.', 'Pelatihan soft skills eksklusif meliputi Character Building, Leadership Development, dan Nation Building.', 'Kesempatan bertanding di ajang Writing Competition dan International Exposure.']::text[], ARRAY['Scholarship allowance of IDR 1,000,000 per month for one full year.', 'Exclusive soft skills training covering Character Building, Leadership, and Nation Building.', 'Opportunities to compete in national Writing Competitions and international exposure.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan']::text[], 'Program beasiswa prestasi bagi mahasiswa sarjana dan vokasi berprestasi tinggi dari seluruh perguruan tinggi mitra di Indonesia.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '10 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Beasiswa KIP Kuliah
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'kip-kuliah', 'Beasiswa KIP Kuliah', 'Kemendikbudristek RI', v_cat_beasiswa, 'Umum', 'https://kip-kuliah.kemdikbud.go.id/',
    'Program bantuan pembiayaan pendidikan tinggi dan tunjangan hidup bagi calon mahasiswa dari keluarga prasejahtera.', 'Higher education funding and living allowance assistance for outstanding prospective students from underprivileged families.', ARRAY['Lulusan SMA/SMK/MA atau sederajat yang lulus pada tahun berjalan atau maksimal 2 tahun sebelumnya.', 'Telah lulus seleksi penerimaan mahasiswa baru pada PTN atau PTS dengan program studi terakreditasi.', 'Memiliki potensi akademik baik dan keterbatasan ekonomi yang dibuktikan kepemilikan KIP, PKH, KKS, atau SKTM.', 'Penghasilan kotor gabungan orang tua/wali paling banyak Rp4.000.000 per bulan atau Rp750.000 per anggota keluarga.', 'Terdaftar secara resmi pada pangkalan data sistem KIP Kuliah Kemendikbudristek.']::text[], ARRAY['Senior high / vocational school graduate in the current year or at most 2 years prior.', 'Accepted at a state or private university in an accredited study program.', 'Demonstrate good academic potential with economic need evidenced by KIP, PKH, KKS, or income statements.', 'Gross combined parental/guardian income not exceeding IDR 4,000,000 per month or IDR 750,000 per capita.', 'Registered in the official KIP Kuliah Kemendikbudristek database system.']::text[], ARRAY['Pembebasan biaya pendaftaran seleksi masuk perguruan tinggi.', 'Pembebasan biaya kuliah (UKT/SPP) yang dibayarkan langsung ke rekening perguruan tinggi.', 'Bantuan biaya hidup bulanan yang disesuaikan dengan klaster wilayah perguruan tinggi.']::text[], ARRAY['Exemption from entrance examination and admission registration fees.', 'Full tuition fee waiver paid directly to the university account.', 'Monthly living allowance adjusted according to the university regional economic cluster.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan']::text[], 'Program bantuan pembiayaan pendidikan tinggi dan tunjangan hidup bagi calon mahasiswa dari keluarga prasejahtera.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '2 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Beasiswa Bank Indonesia
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'beasiswa-bi', 'Beasiswa Bank Indonesia', 'Bank Indonesia', v_cat_beasiswa, 'Umum', 'https://www.bi.go.id/',
    'Dukungan dana pendidikan dan wadah pengembangan kepemimpinan Generasi Baru Indonesia (GenBI) dari Bank Indonesia.', 'Educational grant and leadership community development through Generasi Baru Indonesia (GenBI) by Bank Indonesia.', ARRAY['Mahasiswa aktif jenjang S1/D4 reguler yang telah menyelesaikan sekurang-kurangnya 40 SKS.', 'Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3,00 (skala 4,00) untuk PTN atau 3,25 untuk PTS.', 'Maksimal berusia 23 tahun pada saat ditetapkan sebagai penerima beasiswa.', 'Tidak sedang menerima beasiswa atau berada dalam status ikatan dinas dari instansi lain.', 'Bersedia berperan aktif dalam kegiatan komunitas penerima beasiswa Bank Indonesia (GenBI).']::text[], ARRAY['Active undergraduate (S1/D4) student with a minimum of 40 completed credit units (SKS).', 'Minimum cumulative GPA of 3.00 (scale 4.00) for public universities or 3.25 for private universities.', 'Maximum 23 years of age when selected as a recipient.', 'Not receiving any other scholarships or tied to official government service contracts.', 'Willing to participate actively in the Generasi Baru Indonesia (GenBI) community activities.']::text[], ARRAY['Tunjangan biaya pendidikan sebesar Rp1.000.000 per bulan selama masa periode beasiswa.', 'Pelatihan kepemimpinan, wawasan kebanksentralan, dan workshop entrepreneurship berkala.', 'Akses jejaring nasional bersama ribuan mahasiswa berprestasi se-Indonesia.']::text[], ARRAY['Tuition grant of IDR 1,000,000 per month during the scholarship period.', 'Regular leadership bootcamps, central banking insights, and entrepreneurship training.', 'National networking opportunities with thousands of outstanding students across Indonesia.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan', 'Ekonomi', 'Manajemen', 'Akuntansi', 'Hukum', 'Informatika']::text[], 'Dukungan dana pendidikan dan wadah pengembangan kepemimpinan Generasi Baru Indonesia (GenBI) dari Bank Indonesia.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '10 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Beasiswa Unggulan Masyarakat Berprestasi
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'beasiswa-unggulan', 'Beasiswa Unggulan Masyarakat Berprestasi', 'Puslapdik Kemendikbudristek', v_cat_beasiswa, 'Umum', 'https://beasiswaunggulan.kemdikbud.go.id/',
    'Beasiswa penuh pemerintah Republik Indonesia untuk mahasiswa berprestasi di tingkat nasional maupun internasional.', 'Full Indonesian government scholarship for high-achieving undergraduate students with national/international awards.', ARRAY['Mahasiswa baru semester 1 dengan LoA Unconditional atau mahasiswa on-going maksimal semester 3.', 'Memiliki sertifikat prestasi tingkat nasional (minimal juara 1-3) atau internasional (minimal finalis) 3 tahun terakhir.', 'IPK minimal 3,25 (skala 4,00) bagi mahasiswa on-going program sarjana.', 'Memiliki sertifikat kemahiran bahasa Indonesia (UKBI) dan sertifikat bahasa Inggris (TOEFL ITP/IELTS).', 'Menulis esai personal statement dengan tema kontribusi untuk Indonesia.']::text[], ARRAY['First semester student with LoA Unconditional or on-going student up to semester 3.', 'Hold proof of national awards (top 3) or international competition participation in the past 3 years.', 'Minimum GPA of 3.25 for on-going undergraduate applicants.', 'Hold valid Indonesian language proficiency (UKBI) and English proficiency (TOEFL/IELTS) certificates.', 'Submit a structured personal contribution essay for Indonesia.']::text[], ARRAY['Biaya pendidikan penuh (SPP/UKT) sampai semester 8.', 'Biaya hidup bulanan sesuai standar biaya masukan pemerintah.', 'Bantuan biaya buku dan tunjangan penelitian tugas akhir.']::text[], ARRAY['Full tuition fee coverage until the 8th semester.', 'Monthly living stipend according to government standards.', 'Book allowance and final thesis research grant.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan']::text[], 'Beasiswa penuh pemerintah Republik Indonesia untuk mahasiswa berprestasi di tingkat nasional maupun internasional.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '14 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Tanoto Foundation TELADAN Program
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'beasiswa-tanoto', 'Tanoto Foundation TELADAN Program', 'Tanoto Foundation', v_cat_beasiswa, 'Umum', 'https://www.tanotofoundation.org/id/teladan/',
    'Program beasiswa dan kepemimpinan transformasional untuk melahirkan calon pemimpin masa depan Indonesia.', 'Transformational leadership development and scholarship program shaping future leaders of Indonesia.', ARRAY['Warga Negara Indonesia terdaftar sebagai mahasiswa reguler semester 1 di perguruan tinggi mitra Tanoto Foundation.', 'Memiliki prestasi akademik baik dan integritas kepemimpinan yang terbukti di organisasi.', 'Berkomitmen mengikuti program pengembangan kepemimpinan terstruktur dari semester 2 hingga 8.', 'Memiliki kemampuan komunikasi dan interpersonal yang kuat.', 'Lulus seleksi berkas administrasi, tes asesmen potensi, dan wawancara panelis.']::text[], ARRAY['Indonesian citizen enrolled as a full-time 1st semester undergraduate student at partner universities.', 'Demonstrated strong academic standing and proven leadership integrity in school/campus activities.', 'Committed to completing structured leadership development modules from semester 2 to 8.', 'Possess solid communication and interpersonal abilities.', 'Pass administrative screening, online potential assessment, and panel interviews.']::text[], ARRAY['Dukungan biaya kuliah penuh (UKT) dan uang saku bulanan hingga lulus (semester 8).', 'Program kepemimpinan intensif terstruktur berstandar internasional.', 'Dukungan magang profesional, dana pengembangan proyek sosial, dan jejaring alumni global.']::text[], ARRAY['Full tuition coverage and monthly living allowance until graduation (semester 8).', 'Structured multi-year leadership masterclasses based on global leadership frameworks.', 'Professional internship access, community action project sponsorship, and global alumni network.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan', 'Manajemen', 'Informatika', 'Teknik', 'Hukum']::text[], 'Program beasiswa dan kepemimpinan transformasional untuk melahirkan calon pemimpin masa depan Indonesia.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '16 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Beasiswa Tenaga Kesehatan & Dokter
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'beasiswa-kemenkes', 'Beasiswa Tenaga Kesehatan & Dokter', 'Kementerian Kesehatan RI', v_cat_beasiswa, 'Kesehatan', 'https://beasiswasdmmk.kemkes.go.id/',
    'Bantuan pendidikan untuk mempercepat pemenuhan dan pemerataan dokter dan tenaga kesehatan di seluruh pelosok Indonesia.', 'Healthcare grant accelerating the distribution of medical doctors and allied health professionals throughout Indonesia.', ARRAY['Mahasiswa aktif program studi Kedokteran, Keperawatan, Farmasi, Gizi, atau Kesehatan Masyarakat.', 'Indeks Prestasi Kumulatif (IPK) minimal 3,00 pada semester berjalan.', 'Bersedia ditempatkan di fasilitas pelayanan kesehatan daerah Terdepan, Terluar, dan Tertinggal (3T) setelah lulus.', 'Mendapat rekomendasi tertulis dari Dekan Fakultas Kedokteran/Kesehatan universitas asal.', 'Surat pernyataan tidak sedang menerima beasiswa lain dan bebas catatan pidana.']::text[], ARRAY['Active undergraduate student majoring in Medicine, Nursing, Pharmacy, Nutrition, or Public Health.', 'Minimum GPA of 3.00 in the current academic semester.', 'Willing to serve in regional healthcare centers in remote and border regions (3T) post-graduation.', 'Provide written recommendation letter from the Faculty Dean.', 'Official statement of not receiving other funding and clean criminal record.']::text[], ARRAY['Bantuan biaya operasional pendidikan penuh (UKT/SPP) hingga masa kepaniteraan klinik/profesi.', 'Tunjangan biaya hidup dan bantuan buku teks medis tiap semester.', 'Jaminan penempatan kerja resmi di rumah sakit atau puskesmas binaan Kemenkes RI.']::text[], ARRAY['Full tuition and clinical rotation fees covered until professional licensing.', 'Monthly living stipend and medical textbook allowance each semester.', 'Guaranteed clinical placement at Ministry of Health affiliated hospitals and clinics.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Kedokteran', 'Keperawatan', 'Farmasi', 'Kesehatan Masyarakat', 'Kebidanan']::text[], 'Bantuan pendidikan untuk mempercepat pemenuhan dan pemerataan dokter dan tenaga kesehatan di seluruh pelosok Indonesia.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '8 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Web Dev & UI/UX Internship
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'vinix7', 'Web Dev & UI/UX Internship', 'PT Vinix Seven Aurum', v_cat_magang, 'Informatika', 'https://vinix7.id/',
    'Magang berbasis proyek kolaboratif untuk membangun aplikasi web modern, design system, dan user interface interaktif.', 'Project-based collaborative internship building modern web applications, design systems, and responsive user interfaces.', ARRAY['Mahasiswa aktif jurusan Informatika, Sistem Informasi, DKV, atau bidang ilmu serumpun.', 'Memahami dasar HTML, CSS, JavaScript, atau pengoperasian software desain antarmuka Figma.', 'Mampu bekerja sama dalam tim lintas fungsi dengan metode agile sprint.', 'Menyertakan portofolio desain UI/UX atau tautan repositori GitHub proyek web yang pernah dikerjakan.', 'Bersedia mengikuti durasi magang penuh waktu selama 3 sampai 6 bulan.']::text[], ARRAY['Active student in Informatics, Information Systems, Visual Communication Design, or related fields.', 'Familiar with fundamentals of HTML, CSS, JavaScript, or Figma UI/UX design tools.', 'Able to collaborate effectively in cross-functional agile sprint teams.', 'Include UI/UX portfolio links or GitHub repositories of previously built projects.', 'Available for full-time internship engagement for 3 to 6 months.']::text[], ARRAY['Mentoring intensif one-on-one bersama Senior Software Engineer dan UI/UX Lead.', 'Uang saku bulanan kompetitif dan sertifikat resmi pengalaman kerja industri.', 'Kesempatan diangkat menjadi junior full-time engineer setelah lulus.']::text[], ARRAY['One-on-one intensive mentorship with Senior Software Engineers and UI/UX Leads.', 'Competitive monthly stipend and official certificate of industrial internship completion.', 'Direct opportunity for conversion to full-time junior positions upon graduation.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Informatika', 'Sistem Informasi', 'Desain Komunikasi Visual (DKV)', 'Teknik Komputer']::text[], 'Magang berbasis proyek kolaboratif untuk membangun aplikasi web modern, design system, dan user interface interaktif.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '3 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Magang Generasi Bertalenta (MAGENTA)
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'magenta', 'Magang Generasi Bertalenta (MAGENTA)', 'Forum Human Capital Indonesia BUMN', v_cat_magang, 'Beragam bidang', 'https://magenta.fhcibumn.com/',
    'Program magang terpadu bagi mahasiswa untuk merasakan pengalaman bekerja nyata di ratusan perusahaan BUMN terkemuka.', 'Integrated internship program giving students real-world work exposure across top Indonesian state-owned enterprises.', ARRAY['Mahasiswa aktif D3/D4/S1 minimal semester 5 atau fresh graduate maksimal 1 tahun kelulusan.', 'IPK minimal 3,00 (skala 4,00) dari perguruan tinggi dengan akreditasi minimal B.', 'Memiliki surat rekomendasi resmi atau surat pengantar magang dari universitas/fakultas.', 'Melampirkan Curriculum Vitae (CV) format ATS, transkrip nilai terbaru, dan kartu tanda mahasiswa (KTM).', 'Bersedia menjalani magang secara penuh waktu (onsite/hybrid) selama 1 hingga 6 bulan.']::text[], ARRAY['Active vocational or undergraduate student (min. 5th semester) or fresh graduate (max. 1 year post-grad).', 'Minimum GPA of 3.00 from an accredited university program.', 'Official recommendation letter from university or faculty dean.', 'Upload ATS-friendly Curriculum Vitae, academic transcript, and student ID card.', 'Committed to full-time internship (onsite or hybrid) for 1 to 6 months.']::text[], ARRAY['Uang saku bulanan dan bantuan fasilitas kerja sesuai regulasi BUMN tempat magang.', 'Sertifikat magang berstandar nasional yang ditandatangani oleh Kementerian BUMN dan FHCI.', 'Poin nilai tambah khusus pada seleksi Rekrutmen Bersama BUMN (RBB).']::text[], ARRAY['Monthly stipend and workspace facilities provided by the host state-owned enterprise.', 'Nationally recognized internship certificate endorsed by the Ministry of SOEs and FHCI.', 'Direct advantage and bonus evaluation points in official BUMN recruitment drives.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan', 'Manajemen', 'Akuntansi', 'Informatika', 'Hukum', 'Teknik']::text[], 'Program magang terpadu bagi mahasiswa untuk merasakan pengalaman bekerja nyata di ratusan perusahaan BUMN terkemuka.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '10 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Magang Bakti BCA
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'magang-bakti', 'Magang Bakti BCA', 'PT Bank Central Asia Tbk', v_cat_magang, 'Perbankan', 'https://karir.bca.co.id/',
    'Pelatihan kerja profesional di bidang operasional perbankan, customer service, dan teknologi layanan nasabah.', 'Professional banking operations and customer frontline training at Indonesia''s leading private bank.', ARRAY['Warga Negara Indonesia pria/wanita dengan penampilan rapi, ramah, dan kemampuan komunikasi prima.', 'Lulusan D1-D3 atau S1 minimal semester akhir dengan IPK minimum 2,50 (skala 4,00).', 'Berusia 18 sampai 24 tahun pada saat mendaftar.', 'Belum pernah menikah dan bersedia tidak menikah selama masa magang bakti.', 'Bersedia ditempatkan di seluruh kantor cabang BCA di wilayah pendaftaran yang dipilih.']::text[], ARRAY['Indonesian citizen with polished professional presentation and strong communication skills.', 'Diploma or undergraduate students/graduates with a minimum GPA of 2.50.', 'Aged 18 to 24 years old at the time of application.', 'Unmarried and willing to remain unmarried during the entire internship contract period.', 'Willing to be assigned across BCA branch networks in the registered regional zone.']::text[], ARRAY['Uang saku bulanan, tunjangan kesehatan, dan bonus kinerja berkala.', 'Pelatihan komprehensif mengenai tata kelola transaksi perbankan modern dan etika customer service.', 'Bantuan beasiswa dana pendidikan pada akhir periode masa magang bagi peserta terbaik.']::text[], ARRAY['Monthly allowance, health coverage benefits, and regular performance incentives.', 'Comprehensive training in modern digital banking workflows and frontline service etiquette.', 'Education grant scholarship upon successful completion of the full program tenure.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan', 'Manajemen', 'Akuntansi', 'Ilmu Komunikasi', 'Ekonomi']::text[], 'Pelatihan kerja profesional di bidang operasional perbankan, customer service, dan teknologi layanan nasabah.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '10 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Telkom DigiUp Intern
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'magang-telkom', 'Telkom DigiUp Intern', 'PT Telkom Indonesia (Persero) Tbk', v_cat_magang, 'Informatika', 'https://careers.telkom.co.id/',
    'Kesempatan magang digital transformation di perusahaan telekomunikasi terbesar di Indonesia.', 'Digital transformation internship opportunity at Indonesia''s premier telecommunications conglomerate.', ARRAY['Mahasiswa aktif S1 semester 6 atau 7 dari jurusan Teknik Informatika, SI, atau Elektro.', 'Menguasai setidaknya satu bahasa pemrograman utama (JavaScript, Python, Go, atau Java).', 'Memiliki pemahaman dasar arsitektur REST API, Git version control, dan arsitektur microservices.', 'Transkrip nilai dengan IPK minimal 3,20 dari skala 4,00.', 'Menyelesaikan asesmen coding teknis dan wawancara kecocokan kultur.']::text[], ARRAY['Active undergraduate student (6th or 7th semester) in Computer Science, IS, or Telecommunication Engineering.', 'Proficient in at least one modern language (JavaScript, Python, Go, or Java).', 'Basic understanding of REST APIs, Git version control, and cloud-ready architectures.', 'Academic transcript showing a minimum cumulative GPA of 3.20.', 'Complete technical coding assessment and culture-fit interviews.']::text[], ARRAY['Uang saku bulanan kompetitif dan fasilitas perangkat kerja digital.', 'Pembimbingan langsung oleh lead engineer dan arsitek cloud enterprise Telkom.', 'Akses gratis ke sertifikasi internasional Telkom Digital Talent.']::text[], ARRAY['Competitive monthly allowance and modern digital work equipment.', 'Direct mentorship from senior enterprise engineers and cloud architects.', 'Complimentary access to international Telkom Digital Talent certification exams.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Informatika', 'Sistem Informasi', 'Teknik Telekomunikasi', 'Teknik Komputer', 'Bisnis Digital']::text[], 'Kesempatan magang digital transformation di perusahaan telekomunikasi terbesar di Indonesia.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '6 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Mandiri Young Bankers Internship
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'magang-mandiri', 'Mandiri Young Bankers Internship', 'PT Bank Mandiri (Persero) Tbk', v_cat_magang, 'Manajemen', 'https://www.bankmandiri.co.id/karir',
    'Program magang intensif di unit bisnis corporate banking, risk management, dan wealth advisory Bank Mandiri.', 'Intensive internship in corporate banking, enterprise risk, and wealth advisory at Bank Mandiri.', ARRAY['Mahasiswa aktif minimal semester 6 jurusan Manajemen, Akuntansi, Ekonomi, atau Keuangan.', 'IPK minimal 3,25 (skala 4,00) dari perguruan tinggi terakreditasi A.', 'Kemampuan analisis data keuangan dan penguasaan Microsoft Excel tingkat lanjut.', 'Kefasihan berbahasa Inggris aktif baik lisan maupun tulisan.', 'Lulus psikotes daring dan interview bersama Head of Business Unit.']::text[], ARRAY['Undergraduate student (min. 6th semester) in Management, Accounting, Economics, or Finance.', 'Minimum GPA of 3.25 from top accredited universities.', 'Strong quantitative analytical skills and advanced Microsoft Excel proficiency.', 'Fluent active verbal and written English communication.', 'Pass online psychometric assessment and business unit head interviews.']::text[], ARRAY['Uang saku bulanan dan asuransi kecelakaan kerja profesional.', 'Pengalaman menganalisis portofolio kredit komersial dan studi kelayakan investasi nyata.', 'Jalur prioritas seleksi Officer Development Program (ODP) Mandiri.']::text[], ARRAY['Monthly stipend and professional accident insurance coverage.', 'Hands-on exposure to corporate credit analysis and real-world investment feasibility studies.', 'Fast-track consideration for the prestigious Mandiri Officer Development Program (ODP).']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Manajemen', 'Akuntansi', 'Ekonomi', 'Bisnis Digital', 'Statistika']::text[], 'Program magang intensif di unit bisnis corporate banking, risk management, dan wealth advisory Bank Mandiri.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '7 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Legal Practice & Human Rights Intern
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'magang-lbh-legal', 'Legal Practice & Human Rights Intern', 'Lembaga Bantuan Hukum (LBH) & Mitra Law Firm', v_cat_magang, 'Hukum', 'https://lbhjakarta.org/',
    'Praktek advokasi hukum, penyusunan berkas perkara perdata dan pidana, serta riset kebijakan publik.', 'Hands-on legal advocacy, case drafting, legal research, and public policy analysis practice.', ARRAY['Mahasiswa aktif S1 Fakultas Hukum minimal telah menempuh semester 6.', 'Telah lulus mata kuliah Hukum Acara Pidana, Hukum Acara Perdata, dan Hukum Tata Negara.', 'Memiliki kemampuan legal drafting dan analisis putusan pengadilan yang teliti.', 'Komitmen tinggi terhadap penegakan keadilan sosial dan kode etik profesi hukum.', 'Melampirkan contoh tulisan legal opinion atau esai hukum singkat.']::text[], ARRAY['Active undergraduate Law student currently in at least the 6th semester.', 'Successfully completed courses in Criminal Procedure, Civil Procedure, and Constitutional Law.', 'Demonstrated diligence in legal drafting and judicial decision analysis.', 'Strong dedication to social justice, public defense, and legal professional ethics.', 'Submit a short legal opinion sample or analytical jurisprudence essay.']::text[], ARRAY['Pendampingan langsung oleh advokat senior dalam pendampingan perkara litigasi dan non-litigasi.', 'Sertifikat magang profesi yang diakui untuk persyaratan calon advokat.', 'Uang saku operasional dan akses ke database perpustakaan hukum nasional.']::text[], ARRAY['Direct apprenticeship with senior advocates in both litigation and corporate advisory cases.', 'Accredited internship certificate fulfilling pre-advocate training prerequisites.', 'Operational stipend and full access to premier national jurisprudence repositories.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Hukum', 'Ilmu Hukum']::text[], 'Praktek advokasi hukum, penyusunan berkas perkara perdata dan pidana, serta riset kebijakan publik.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '9 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Creative Content & Graphic Design Intern
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'magang-narasi', 'Creative Content & Graphic Design Intern', 'Narasi Media & Creative Hub', v_cat_magang, 'Desain', 'https://narasi.tv/',
    'Magang produksi konten digital, visual branding, motion graphic, dan jurnalisme visual kreatif.', 'Digital media production, visual branding, motion graphics, and creative visual journalism internship.', ARRAY['Mahasiswa aktif jurusan Desain Komunikasi Visual (DKV), Animasi, atau Ilmu Komunikasi.', 'Mahir mengoperasikan Adobe Creative Suite (Illustrator, Photoshop, Premiere Pro, After Effects) atau Figma.', 'Peka terhadap tren visual media sosial dan memiliki selera tata letak tipografi yang kuat.', 'Wajib melampirkan portofolio visual interaktif (Behance, Google Drive, atau Website Pribadi).', 'Mampu bekerja dinamis dengan tenggat waktu cepat di industri media.']::text[], ARRAY['Active student in Visual Communication Design (DKV), Animation, or Communications.', 'Proficient in Adobe Creative Suite (Illustrator, Photoshop, After Effects) or Figma.', 'High sensitivity to social media design trends and strong typography composition taste.', 'Mandatory submission of creative visual portfolio (Behance, Drive, or personal site).', 'Able to produce dynamic deliverables under fast-paced modern newsroom deadlines.']::text[], ARRAY['Uang saku bulanan dan jatah makan siang harian kantor pusat Narasi.', 'Karya visual dipublikasikan di kanal media nasional yang menjangkau jutaan audiens.', 'Mentoring kreatif bersama Creative Director dan Produser Konten berpengalaman.']::text[], ARRAY['Monthly stipend and daily meal allowances at Narasi headquarters.', 'Visual assets published across national digital platforms reaching millions of viewers.', 'Creative mentorship directly from award-winning Creative Directors and Senior Producers.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Desain Komunikasi Visual (DKV)', 'Ilmu Komunikasi', 'Multimedia', 'Desain Grafis']::text[], 'Magang produksi konten digital, visual branding, motion graphic, dan jurnalisme visual kreatif.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '5 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Healthcare Analytics & Service Intern
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'magang-bpjs-kesehatan', 'Healthcare Analytics & Service Intern', 'BPJS Kesehatan RI', v_cat_magang, 'Kesehatan', 'https://www.bpjs-kesehatan.go.id/',
    'Magang analisis data jaminan kesehatan nasional, manajemen mutu fasilitas klinis, dan pelayanan kesehatan publik.', 'National health coverage analytics, clinical service quality management, and public health service internship.', ARRAY['Mahasiswa aktif semester 6-8 dari rumpun ilmu Kesehatan Masyarakat, Kedokteran, Farmasi, atau Manajemen.', 'IPK minimal 3,00 dari perguruan tinggi berakreditasi baik.', 'Memahami konsep dasar JKN, sistem rujukan kesehatan berjenjang, dan epidemiologi dasar.', 'Mampu mengolah data kesehatan menggunakan spreadsheet atau aplikasi statistik.', 'Surat rekomendasi resmi dari pimpinan dekanat fakultas.']::text[], ARRAY['Active undergraduate student (semesters 6-8) in Public Health, Medicine, Pharmacy, or Nursing.', 'Minimum cumulative GPA of 3.00 from accredited universities.', 'Familiar with universal health coverage frameworks and primary care referral workflows.', 'Proficient in quantitative healthcare data processing using spreadsheet and statistical tools.', 'Official recommendation letter signed by the faculty dean.']::text[], ARRAY['Uang saku bulanan resmi dan perlindungan jaminan sosial ketenagakerjaan.', 'Pengalaman mengolah data kesehatan skala nasional untuk perumusan kebijakan preventif.', 'Sertifikat magang resmi instansi pemerintah untuk lampiran SKPI.']::text[], ARRAY['Official monthly stipend and full workplace insurance protection.', 'Hands-on exposure to macro national health data for preventive healthcare policy design.', 'Government accredited internship certificate valid for diploma supplement (SKPI).']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Kedokteran', 'Kesehatan Masyarakat', 'Farmasi', 'Keperawatan', 'Sistem Informasi']::text[], 'Magang analisis data jaminan kesehatan nasional, manajemen mutu fasilitas klinis, dan pelayanan kesehatan publik.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '8 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Civil & Structural Engineering Intern
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'magang-wika-konstruksi', 'Civil & Structural Engineering Intern', 'PT Wijaya Karya (Persero) Tbk', v_cat_magang, 'Teknik', 'https://www.wika.co.id/',
    'Praktik langsung pengawasan proyek infrastruktur strategis nasional dan pemodelan BIM konstruksi.', 'On-site strategic infrastructure supervision and BIM structural construction modeling internship.', ARRAY['Mahasiswa aktif S1 Teknik Sipil atau Arsitektur minimal telah menyelesaikan 100 SKS.', 'Menguasai software teknik AutoCAD, SAP2000, ETABS, atau Autodesk Revit BIM.', 'Memahami prinsip K3 (Keselamatan dan Kesehatan Kerja) dan metode pelaksanaan konstruksi.', 'Sehat jasmani dan bersedia ditempatkan di proyek lapangan konstruksi.', 'Melampirkan CV dan transkrip nilai dengan IPK minimal 3,00.']::text[], ARRAY['Active Civil Engineering or Architecture student with at least 100 completed credits.', 'Proficient in technical drafting tools including AutoCAD, SAP2000, ETABS, or Revit BIM.', 'Sound understanding of occupational health & safety (K3) and building execution methodologies.', 'Physically fit and prepared for active on-site infrastructure deployment.', 'Submit CV and academic transcript showing a minimum GPA of 3.00.']::text[], ARRAY['Uang saku bulanan, akomodasi mess proyek, dan asuransi perlindungan kerja lapangan.', 'Sertifikasi penerapan Building Information Modeling (BIM) praktis.', 'Kesempatan rekrutmen Management Trainee Jalur Prestasi WIKA.']::text[], ARRAY['Monthly allowance, on-site project housing accommodation, and occupational safety coverage.', 'Practical Building Information Modeling (BIM) application certification.', 'Direct pipeline eligibility for WIKA Management Trainee recruitment programs.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Teknik Sipil', 'Arsitektur', 'Teknik Lingkungan', 'Manajemen Konstruksi']::text[], 'Praktik langsung pengawasan proyek infrastruktur strategis nasional dan pemodelan BIM konstruksi.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '11 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: UNICEF Communication & Policy Intern
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'unicef-internship', 'UNICEF Communication & Policy Intern', 'UNICEF Indonesia', v_cat_magang, 'Komunikasi', 'https://www.unicef.org/careers/internships',
    'Peluang magang internasional PBB di bidang advokasi hak anak, komunikasi publik, dan riset kebijakan sosial.', 'UN international internship opportunity in child rights advocacy, strategic public communications, and social policy research.', ARRAY['Mahasiswa aktif tingkat sarjana minimal semester 6 atau master di bidang Komunikasi, HI, Hukum, atau Psikologi.', 'Fasih berbahasa Inggris dan Indonesia secara lisan dan tulisan (skor TOEFL ITP min. 550 / IELTS 6.5).', 'Mampu menyusun rilis pers, artikel advokasi, dan ringkasan data kebijakan anak.', 'Memiliki kepekaan tinggi terhadap keberagaman dan prinsip perlindungan anak PBB.', 'Mengunggah resume, cover letter motivasi bahasa Inggris, dan surat rekomendasi kampus.']::text[], ARRAY['Undergraduate student (min. 6th semester) or graduate student in Communications, IR, Law, or Psychology.', 'Bilingual fluency in English and Indonesian (min. TOEFL 550 / IELTS 6.5 equivalent).', 'Able to draft press statements, advocacy articles, and policy briefs accurately.', 'High cultural sensitivity and adherence to United Nations child safeguarding principles.', 'Upload CV, English statement of intent, and institutional recommendation letter.']::text[], ARRAY['Monthly living stipend sesuai standar United Nations di Jakarta.', 'Pengalaman kerja multilateral di lingkungan perwakilan badan PBB dunia.', 'Sertifikat magang internasional resmi dari United Nations Children''s Fund.']::text[], ARRAY['Monthly living stipend according to official United Nations Jakarta country rates.', 'Direct multilateral operational experience in a premier global UN agency.', 'Official United Nations Children''s Fund international internship certificate.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Ilmu Komunikasi', 'Hubungan Internasional', 'Hukum', 'Psikologi', 'Sosiologi']::text[], 'Peluang magang internasional PBB di bidang advokasi hak anak, komunikasi publik, dan riset kebijakan sosial.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '12 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: AI-Enhanced Full Stack Developer
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'hacktiv8', 'AI-Enhanced Full Stack Developer', 'PT Hacktivate Teknologi Indonesia', v_cat_bootcamp, 'Informatika', 'https://www.hacktiv8.com/',
    'Bootcamp coding intensif berstandar industri dengan kurikulum React, Node.js, dan integrasi Artificial Intelligence modern.', 'Industry-standard coding bootcamp curriculum covering React, Node.js, and modern Artificial Intelligence integrations.', ARRAY['Terbuka bagi mahasiswa semua jurusan maupun pemula yang memiliki kemauan belajar coding tinggi.', 'Memiliki laptop pribadi dengan spesifikasi prosesor minimal Intel Core i5/AMD Ryzen 5 dan RAM minimal 8 GB.', 'Lulus tes logika dasar dan wawancara motivasi belajar intensif.', 'Berkomitmen meluangkan waktu belajar intensif Senin-Jumat selama 16 minggu penuh.', 'Memiliki koneksi internet stabil untuk mengikuti sesi live coding interaktif.']::text[], ARRAY['Open to all majors and coding beginners with high drive and grit.', 'Possess a dedicated personal laptop with min. Core i5/Ryzen 5 specs and 8 GB RAM.', 'Pass basic algorithmic logic screening and motivational interview.', 'Committed to intensive full-time study Monday to Friday across 16 weeks.', 'Stable high-speed broadband connection for interactive live coding sessions.']::text[], ARRAY['Portfolio 5 aplikasi web skala produksi siap deploy ke server cloud.', 'Akses program Career Coaching dan penyaluran kerja ke lebih dari 500+ hiring partner.', 'Sertifikat kelulusan kompetensi Full Stack Software Engineering berstandar global.']::text[], ARRAY['Portfolio of 5 production-grade web applications deployed on live cloud infrastructure.', 'Dedicated career coaching and hiring partner matching across 500+ companies.', 'Global industry-standard Full Stack Software Engineering certificate of graduation.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Informatika', 'Sistem Informasi', 'Semua Jurusan']::text[], 'Bootcamp coding intensif berstandar industri dengan kurikulum React, Node.js, dan integrasi Artificial Intelligence modern.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '4 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Digital Talent Scholarship (DTS)
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'dts', 'Digital Talent Scholarship (DTS)', 'Kementerian Komdigi RI', v_cat_bootcamp, 'Teknologi', 'https://digitalent.komdigi.go.id/',
    'Program pelatihan dan sertifikasi talenta digital nasional gratis dengan kurikulum teknologi terkini kerja sama mitra global.', 'Free national digital talent training and certification program partnered with global tech giants.', ARRAY['Warga Negara Indonesia usia produktif, terbuka untuk mahasiswa aktif semester 4 ke atas.', 'Memiliki ketertarikan kuat di bidang Cloud Computing, Cybersecurity, atau Data Analytics.', 'Belum pernah menerima beasiswa program Digital Talent Scholarship pada tahun anggaran yang sama.', 'Lulus tes substansi bidang dan verifikasi administrasi kependudukan.', 'Sanggup menyelesaikan program sampai tuntas dan mengikuti ujian sertifikasi kompetensi.']::text[], ARRAY['Indonesian citizen of productive age, open to active students from semester 4 upwards.', 'Strong interest in Cloud Computing, Cybersecurity, or Data Analytics domains.', 'Not a recipient of other DTS training tracks in the same fiscal calendar year.', 'Pass online domain knowledge assessment and administrative verification.', 'Committed to 100% course completion and sitting for the official certification exam.']::text[], ARRAY['Pelatihan teknologi intensif 100% gratis didanai penuh oleh pemerintah RI.', 'Voucher ujian sertifikasi internasional resmi (Google, AWS, Microsoft, atau Cisco).', 'Kesempatan terhubung dengan platform lowongan kerja Diploy Komdigi.']::text[], ARRAY['100% tuition-free intensive tech bootcamp fully funded by the Ministry of Communications.', 'Free official international exam voucher (Google, AWS, Microsoft, or Cisco).', 'Direct access to Diploy Komdigi national tech talent job matchmaking portal.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan', 'Informatika', 'Sistem Informasi', 'Teknik Elektro']::text[], 'Program pelatihan dan sertifikasi talenta digital nasional gratis dengan kurikulum teknologi terkini kerja sama mitra global.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '10 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.opportunity_additional_categories (opportunity_id, category_id)
  VALUES (v_opp_id, v_cat_beasiswa)
  ON CONFLICT DO NOTHING;

  -- Peluang: Bangkit Academy by Google, GoTo, Traveloka
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'bangkit', 'Bangkit Academy by Google, GoTo, Traveloka', 'Kemendikbudristek & Google Indonesia', v_cat_bootcamp, 'Informatika', 'https://bangkit.academy/',
    'Akademi talenta teknologi kelas dunia dengan tiga jalur spesialisasi: Machine Learning, Mobile Development, dan Cloud Computing.', 'World-class technology academy with three learning paths: Machine Learning, Mobile Development, and Cloud Computing.', ARRAY['Mahasiswa aktif D4/S1 di perguruan tinggi Indonesia berstatus aktif di PDDikti minimal semester 5.', 'Berasal dari jurusan teknologi/STEM atau non-STEM dengan kemampuan logika pemrograman memadai.', 'Memiliki kemampuan bahasa Inggris pasif dan aktif untuk membaca materi kurikulum Google.', 'Mendapat persetujuan dosen pembimbing dan pimpinan kampus untuk konversi 20 SKS.', 'Menyelesaikan asesmen teknis dan tes kepribadian pada platform pendaftaran resmi.']::text[], ARRAY['Active undergraduate student (min. 5th semester) registered in the official PDDikti database.', 'STEM or non-STEM majors possessing foundational algorithmic programming logic.', 'Adequate English comprehension skills for studying official Google global curriculum.', 'Official faculty approval letter granting 20 university credit (SKS) conversion.', 'Complete online technical diagnostic test and situational judgement assessments.']::text[], ARRAY['Konversi penuh hingga 20 SKS mata kuliah semester berjalan di universitas asal.', 'Voucher sertifikasi global Google (Associate Android Developer / Cloud Engineer / TensorFlow).', 'Dana inkubasi capstone project hingga Rp140 juta untuk tim proyek terbaik.']::text[], ARRAY['Full conversion of up to 20 academic credits (SKS) recognized by host universities.', 'Complimentary Google Global Certification voucher (Android / Cloud Engineer / TensorFlow).', 'Incubation seed funding up to IDR 140 million for winning top capstone project teams.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Informatika', 'Sistem Informasi', 'Teknik Komputer', 'Statistika', 'Semua Jurusan']::text[], 'Akademi talenta teknologi kelas dunia dengan tiga jalur spesialisasi: Machine Learning, Mobile Development, dan Cloud Computing.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '5 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.opportunity_additional_categories (opportunity_id, category_id)
  VALUES (v_opp_id, v_cat_studi)
  ON CONFLICT DO NOTHING;

  -- Peluang: RevoU Digital Career Accelerator
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'revou', 'RevoU Digital Career Accelerator', 'PT Revolusi Cita Edukasi', v_cat_bootcamp, 'Bisnis Digital', 'https://www.revou.co/',
    'Akselerator karir digital di bidang Data Analytics, Digital Marketing, Product Management, dan Software Engineering.', 'Career accelerator in Data Analytics, Digital Marketing, Product Management, and Software Engineering.', ARRAY['Terbuka untuk mahasiswa tingkat akhir dan lulusan baru yang ingin berkarir di industri startup dan tech.', 'Lolos tes penalaran numerik, logika verbal, dan sesi admissions consultation.', 'Menyediakan komitmen belajar 15-20 jam per minggu selama 3-6 bulan program.', 'Memiliki laptop dan koneksi internet stabil untuk mengikuti real-time practical lab.', 'Memiliki semangat belajar mandiri dan pengerjaan tugas proyek nyata.']::text[], ARRAY['Open to final-year students and fresh graduates seeking modern digital technology careers.', 'Pass quantitative reasoning, verbal aptitude tests, and admissions consultation session.', 'Dedicate 15 to 20 study hours per week across the 3 to 6 months curriculum duration.', 'Functional laptop with reliable broadband for real-time practical laboratory assignments.', 'Strong self-directed learning ethics and willingness to solve real client business briefs.']::text[], ARRAY['Pengerjaan live real client project dengan anggaran promosi dan data analitik riil.', 'Bimbingan karir intensif seumur hidup bersama Career Coach profesional.', 'Akses komunitas alumni RevoU terbesar di Asia Tenggara.']::text[], ARRAY['Work on live client projects with actual marketing budgets and enterprise data warehouses.', 'Dedicated personalized career coaching and lifelong job application mentorship.', 'Access to the largest tech alumni network across Southeast Asia.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan', 'Manajemen', 'Ilmu Komunikasi', 'Informatika']::text[], 'Akselerator karir digital di bidang Data Analytics, Digital Marketing, Product Management, dan Software Engineering.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '7 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Dicoding Web & Multiplatform Master
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'dicoding-academy', 'Dicoding Web & Multiplatform Master', 'Dicoding Indonesia', v_cat_bootcamp, 'Informatika', 'https://www.dicoding.com/',
    'Kurikulum terstruktur Google Developers Authorized Training Partner untuk pengembang aplikasi web dan multiplatform.', 'Structured learning paths by a Google Developers Authorized Training Partner for web and cross-platform engineers.', ARRAY['Mahasiswa atau umum yang ingin menguasai arsitektur pengembangan web modern dan Flutter.', 'Mampu belajar mandiri secara asynchronous dan menyelesaikan submission code review.', 'Memahami dasar logika komputer dan algoritma percabangan/perulangan.', 'Memiliki akun Dicoding aktif dan melengkapi profil pengembang.', 'Memiliki komputer dengan instalasi Node.js, VS Code, atau Android Studio.']::text[], ARRAY['Students or individuals eager to master modern web architectures and Flutter multiplatform.', 'Capable of self-paced asynchronous study and completing rigorous code review submissions.', 'Basic grasp of computer logic, conditional statements, and iterative data structures.', 'Active Dicoding student account with completed developer profile information.', 'Computer with local development environment (Node.js, VS Code, or Android Studio).']::text[], ARRAY['Code review mendalam baris per baris oleh reviewer software engineer industri berlisensi.', 'Sertifikat kompetensi kelulusan yang diakui luas oleh ekosistem startup teknologi Indonesia.', 'Akses selamanya ke forum diskusi teknis dan pembaruan materi kurikulum.']::text[], ARRAY['Line-by-line detailed code reviews provided by licensed industry software engineering practitioners.', 'Recognized competency certificates widely valued by Southeast Asian tech ecosystems.', 'Lifetime access to developer discussion forums and periodic curriculum version updates.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Informatika', 'Sistem Informasi', 'Teknik Komputer']::text[], 'Kurikulum terstruktur Google Developers Authorized Training Partner untuk pengembang aplikasi web dan multiplatform.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '5 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Dibimbing Career Bootcamp UI/UX & Data
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'dibimbing', 'Dibimbing Career Bootcamp UI/UX & Data', 'PT Dibimbing Digital Indonesia', v_cat_bootcamp, 'Desain', 'https://dibimbing.id/',
    'Bootcamp intensif dengan bimbingan mentor 1-on-1 untuk merintis portofolio UI/UX Design dan Data Science unggulan.', 'Intensive bootcamp featuring 1-on-1 mentorship to craft competitive UI/UX Design and Data portfolios.', ARRAY['Mahasiswa tingkat awal hingga akhir yang ingin memperdalam keahlian desain produk digital atau data.', 'Komitmen mengikuti kelas tatap muka daring di akhir pekan dan mentoring berkala.', 'Memiliki kemauan kuat dalam merancang solusi dari permasalahan pengguna nyata.', 'Memiliki perangkat laptop untuk menjalankan software Figma atau Python Jupyter Notebook.', 'Menyelesaikan form registrasi dan placement test diagnostik.']::text[], ARRAY['Undergraduate students at any level wishing to specialize in Product Design or Data science.', 'Committed to attending weekend live virtual classrooms and scheduled 1-on-1 mentor sessions.', 'Demonstrated passion for user-centered research and problem discovery.', 'Laptop capable of smoothly executing Figma design files or Python Jupyter notebooks.', 'Complete admissions registration form and diagnostic placement test.']::text[], ARRAY['Mentoring 1-on-1 personal tak terbatas hingga peserta berhasil lulus dan mendapatkan portofolio.', 'Penyaluran kerja dan magang ke jaringan ratusan perusahaan mitra Dibimbing.', 'Jaminan uang kembali bersyarat bagi lulusan yang memenuhi kriteria program.']::text[], ARRAY['Unlimited personalized 1-on-1 mentorship sessions until portfolio completion.', 'Direct job and internship placements into hundreds of vetted hiring partners.', 'Conditional money-back guarantee for graduates fulfilling graduation criteria.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Desain Komunikasi Visual (DKV)', 'Sistem Informasi', 'Psikologi', 'Semua Jurusan']::text[], 'Bootcamp intensif dengan bimbingan mentor 1-on-1 untuk merintis portofolio UI/UX Design dan Data Science unggulan.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '3 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: PPM Executive Management Training
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'ppm-training', 'PPM Executive Management Training', 'PPM Manajemen', v_cat_bootcamp, 'Manajemen', 'https://www.ppm-manajemen.ac.id/ppm-ppe/',
    'Pelatihan manajemen strategis, tata kelola organisasi modern, dan kepemimpinan bisnis profesional.', 'Strategic management, enterprise governance, and professional corporate leadership executive training.', ARRAY['Mahasiswa tingkat akhir atau lulusan baru jurusan Manajemen, Bisnis, Akuntansi, atau Teknik Industri.', 'Memiliki minat mendalam di bidang konsultansi bisnis, manajemen operasional, dan kepemimpinan.', 'IPK minimal 3,00 dari perguruan tinggi terakreditasi.', 'Menulis esai singkat tentang analisis tantangan model bisnis digital saat ini.', 'Lolos evaluasi studi kasus bisnis kelompok.']::text[], ARRAY['Final-year students or recent graduates in Management, Business, Accounting, or Industrial Engineering.', 'Deep interest in business consulting, operations strategy, and corporate leadership.', 'Minimum cumulative GPA of 3.00 from an accredited university.', 'Submit a short essay evaluating contemporary digital business model transformations.', 'Pass collaborative business case study assessment.']::text[], ARRAY['Sertifikat kompetensi manajemen resmi dari institusi manajemen pelopor di Indonesia.', 'Bedah studi kasus nyata dari puluhan perusahaan konglomerasi dan BUMN nasional.', 'Akses konsultasi karir manajerial bersama konsultan senior PPM Manajemen.']::text[], ARRAY['Accredited management competency credential from Indonesia''s pioneer management institution.', 'Hands-on case study deconstructions from leading conglomerates and state-owned enterprises.', 'Executive career coaching access with seasoned PPM Management consultants.']::text[],
    'terbit', false, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Manajemen', 'Akuntansi', 'Ekonomi', 'Bisnis']::text[], 'Pelatihan manajemen strategis, tata kelola organisasi modern, dan kepemimpinan bisnis profesional.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '2 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.opportunity_additional_categories (opportunity_id, category_id)
  VALUES (v_opp_id, v_cat_beasiswa)
  ON CONFLICT DO NOTHING;

  -- Peluang: Pertamina Energy Leadership Bootcamp
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'pertamina-young-talent', 'Pertamina Energy Leadership Bootcamp', 'PT Pertamina (Persero)', v_cat_bootcamp, 'Teknik', 'https://recruitment.pertamina.com/',
    'Program pembekalan intensif transisi energi terbarukan dan inovasi teknologi industri energi masa depan.', 'Intensive energy transition and renewable energy technology innovation bootcamp for future engineers.', ARRAY['Mahasiswa aktif S1 semester 6-8 jurusan Teknik Mesin, Kimia, Elektro, Perminyakan, atau Fisika.', 'IPK minimal 3,25 (skala 4,00) dari perguruan tinggi terakreditasi Unggul.', 'Memiliki gagasan atau proyek inovasi energi baru terbarukan (EBT).', 'Mampu berkomunikasi bahasa Inggris teknis secara aktif.', 'Lolos uji potensi akademik dan wawancara panelis Pertamina Corporate University.']::text[], ARRAY['Active engineering student (semesters 6-8) in Mechanical, Chemical, Electrical, or Petroleum Engineering.', 'Minimum GPA of 3.25 from premier accredited universities.', 'Present a renewable energy innovation concept or research capstone outline.', 'Capable of effective technical verbal and written English communication.', 'Pass academic potential tests and panel interviews by Pertamina Corporate University.']::text[], ARRAY['Pembekalan langsung dari praktisi kilang energi dan pakar dekarbonisasi internasional.', 'Kunjungan lapangan eksklusif ke fasilitas instalasi energi baru terbarukan Pertamina.', 'Jalur fast-track seleksi Bimbingan Profesi Sarjana (BPS) Pertamina.']::text[], ARRAY['Direct insights from energy refinery operators and international decarbonization specialists.', 'Exclusive site visits to Pertamina''s cutting-edge renewable power facilities.', 'Fast-track assessment priority for Pertamina Graduate Development Program (BPS).']::text[],
    'terbit', false, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Teknik Mesin', 'Teknik Elektro', 'Teknik Kimia', 'Teknik Perminyakan', 'Teknik Industri']::text[], 'Program pembekalan intensif transisi energi terbarukan dan inovasi teknologi industri energi masa depan.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '8 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.opportunity_additional_categories (opportunity_id, category_id)
  VALUES (v_opp_id, v_cat_beasiswa)
  ON CONFLICT DO NOTHING;

  -- Peluang: Studi Independen: Pengembang AI & Machine Learning
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'msib-dicoding-ai', 'Studi Independen: Pengembang AI & Machine Learning', 'Dicoding Indonesia & Kampus Merdeka', v_cat_studi, 'Informatika', 'https://kampusmerdeka.kemdikbud.go.id/',
    'Program MSIB Kampus Merdeka intensif mempelajari machine learning terapan, computer vision, dan natural language processing.', 'Certified MSIB independent study mastering applied machine learning, computer vision, and modern NLP architectures.', ARRAY['Mahasiswa aktif D4/S1 minimal semester 5 di perguruan tinggi di bawah Kemendikbudristek.', 'Mendapatkan Surat Rekomendasi (SR) dan Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) bermeterai.', 'Memiliki pemahaman dasar matematika diskrit, aljabar linear, dan pemrograman Python.', 'Berkomitmen mendedikasikan waktu belajar penuh waktu selama 1 semester (20 SKS).', 'Lulus asesmen seleksi logika dan matematika dasar pada portal Kampus Merdeka.']::text[], ARRAY['Active undergraduate student (min. 5th semester) registered under Kemendikbudristek.', 'Hold stamped institutional Recommendation Letters and Responsibility Statements (SPTJM).', 'Foundational comprehension of linear algebra, calculus, and Python coding basics.', 'Committed to full-time asynchronous and synchronous participation converting to 20 SKS.', 'Pass logic and quantitative diagnostics on the Kampus Merdeka national platform.']::text[], ARRAY['Konversi setara 20 SKS penuh diakui resmi di transkrip akademik universitas.', 'Sertifikasi kompetensi AI berstandar industri dan portofolio capstone beregu.', 'Bantuan uang saku bulanan resmi (BBH) yang disalurkan oleh Kemendikbudristek RI.']::text[], ARRAY['Full 20 academic credits conversion recorded on official university transcripts.', 'Industry-vetted AI certification and collaborative real-world capstone portfolio.', 'Monthly government living allowance (BBH) disbursed directly by Kemendikbudristek.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Informatika', 'Sistem Informasi', 'Statistika', 'Matematika', 'Teknik Komputer']::text[], 'Program MSIB Kampus Merdeka intensif mempelajari machine learning terapan, computer vision, dan natural language processing.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '6 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Studi Independen: Digital Business & Analytics
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'msib-ruangguru-business', 'Studi Independen: Digital Business & Analytics', 'Ruangguru & Kampus Merdeka', v_cat_studi, 'Manajemen', 'https://kampusmerdeka.kemdikbud.go.id/',
    'Pembelajaran komprehensif strategi pertumbuhan bisnis digital, analisis data pasar, dan product operations.', 'Comprehensive curriculum in digital business expansion strategy, marketplace growth analytics, and product operations.', ARRAY['Mahasiswa aktif S1 minimal semester 5 dari jurusan Manajemen, Bisnis, Akuntansi, atau bidang relevan.', 'IPK minimal 3,00 serta surat persetujuan konversi nilai dari ketua program studi.', 'Kemampuan berpikir kritis dalam membedah studi kasus bisnis dan membaca metrik pertumbuhan.', 'Aktif dalam diskusi kelompok dan presentasi proposal bisnis di hadapan mentor industri.', 'Mengunggah berkas administrasi lengkap ke sistem Kampus Merdeka sebelum batas waktu.']::text[], ARRAY['Active student (min. 5th semester) in Business, Management, Economics, or related fields.', 'Minimum GPA of 3.00 with department head approval letter for full credit conversion.', 'Critical thinking skills in analyzing case studies and digital product growth metrics.', 'Active engagement in group project discussions and live executive pitch presentations.', 'Submit full verified documentation to the national Kampus Merdeka portal.']::text[], ARRAY['Pengakuan konversi akademik 20 SKS mata kuliah semester berjalan.', 'Penyusunan proyek bisnis riil yang dibimbing oleh VP dan Business Director Ruangguru.', 'Sertifikat kelulusan berlisensi Kemendikbudristek dan kesempatan magang eksklusif.']::text[], ARRAY['Official 20 credit units (SKS) academic recognition on university study plans.', 'Complete a real business project under direct guidance from Ruangguru Vice Presidents.', 'Accredited Ministry completion certificate and exclusive internship access pipelines.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Manajemen', 'Akuntansi', 'Ekonomi', 'Bisnis Digital', 'Ilmu Komunikasi']::text[], 'Pembelajaran komprehensif strategi pertumbuhan bisnis digital, analisis data pasar, dan product operations.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '9 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Studi Independen: UI/UX & Product Design Specialist
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'msib-binar-uiux', 'Studi Independen: UI/UX & Product Design Specialist', 'Binar Academy & Kampus Merdeka', v_cat_studi, 'Desain', 'https://www.binaracademy.com/',
    'Praktek end-to-end user research, design thinking, prototyping Figma interaktif, dan usability testing.', 'End-to-end hands-on training in user research, design thinking, interactive Figma prototyping, and usability testing.', ARRAY['Mahasiswa aktif minimal semester 5 dari perguruan tinggi negeri maupun swasta seluruh Indonesia.', 'Tertarik pada perancangan antarmuka aplikasi digital dan pengalaman pengguna.', 'Memiliki laptop dengan kemampuan menjalankan aplikasi peramban dan software desain grafis.', 'Mendapatkan persetujuan konversi 20 SKS dari universitas asal.', 'Lulus tes motivasi dan penugasan desain pemecahan masalah sederhana.']::text[], ARRAY['Active undergraduate student (min. 5th semester) from any accredited Indonesian university.', 'Passionate about digital app interfaces and human-centered design research.', 'Laptop capable of running modern web browsers and design authoring software smoothly.', 'University approval for 20 academic credits conversion.', 'Pass online motivational screening and a simple problem-solving design challenge.']::text[], ARRAY['Konversi setara 20 SKS akademik di semester berjalan.', 'Portofolio studi kasus UI/UX lengkap dari tahap riset hingga interactive prototype siap kerja.', 'Sertifikat kompetensi UI/UX Specialist bertaraf nasional dan jejaring hiring partner.']::text[], ARRAY['Full 20 SKS credit conversion recognized by host educational institutions.', 'Comprehensive UI/UX case study portfolio from user discovery to production-ready prototypes.', 'Nationally accredited UI/UX Specialist certificate and hiring partner introductions.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Desain Komunikasi Visual (DKV)', 'Sistem Informasi', 'Informatika', 'Psikologi']::text[], 'Praktek end-to-end user research, design thinking, prototyping Figma interaktif, dan usability testing.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '7 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Studi Independen: People Analytics & Strategic HR
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'msib-greatnusa-hr', 'Studi Independen: People Analytics & Strategic HR', 'GreatNusa by Binus & Kampus Merdeka', v_cat_studi, 'Psikologi', 'https://greatnusa.com/',
    'Kombinasi psikologi industri organisasi, people analytics berbasis data, dan manajemen talenta korporat.', 'Blending organizational psychology, data-driven people analytics, and corporate talent management.', ARRAY['Mahasiswa aktif S1 minimal semester 5 jurusan Psikologi, Manajemen SDM, atau serumpun.', 'IPK minimal 3,00 dengan minat mendalam pada pengembangan organisasi dan sumber daya manusia.', 'Memahami konsep dasar evaluasi kinerja, talent mapping, dan psikometri dasar.', 'Surat rekomendasi resmi perguruan tinggi untuk konversi 20 SKS.', 'Sanggup mengikuti rangkaian pelatihan penuh waktu selama satu semester.']::text[], ARRAY['Active undergraduate (min. 5th semester) in Psychology, HR Management, or related social sciences.', 'Minimum cumulative GPA of 3.00 with keen interest in organizational behavior.', 'Basic understanding of performance management frameworks, talent mapping, and psychometrics.', 'Formal university recommendation letter ensuring 20 credit hours recognition.', 'Committed to full-time synchronous and team-based semester obligations.']::text[], ARRAY['Pengakuan konversi akademik 20 SKS di pangkalan data pendidikan tinggi.', 'Kemampuan mengoperasikan dashboard People Analytics untuk pengambilan keputusan HR strategis.', 'Sertifikat keahlian Human Capital Management berskala nasional.']::text[], ARRAY['20 academic credits conversion acknowledged on university records.', 'Mastery of People Analytics dashboards for strategic human capital decision making.', 'Nationally recognized Human Capital Management competency credentials.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Psikologi', 'Manajemen', 'Ilmu Komunikasi', 'Hukum']::text[], 'Kombinasi psikologi industri organisasi, people analytics berbasis data, dan manajemen talenta korporat.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '11 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Studi Independen: Smart Factory & Industrial IoT
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'msib-schneider-iot', 'Studi Independen: Smart Factory & Industrial IoT', 'Schneider Electric Indonesia & Kampus Merdeka', v_cat_studi, 'Teknik', 'https://www.se.com/id/id/',
    'Pembelajaran otomatisasi industri 4.0, sensor IoT industri, dan efisiensi manajemen energi pintar pabrik.', 'Industrial automation 4.0, industrial IoT sensors, and smart factory energy efficiency management.', ARRAY['Mahasiswa aktif semester 5-7 jurusan Teknik Elektro, Mesin, Mekatronika, atau Teknik Industri.', 'Memiliki pemahaman dasar rangkaian listrik, PLC dasar, atau komunikasi data mikrokontroler.', 'IPK minimal 3,20 dari perguruan tinggi dengan program studi terakreditasi.', 'Mendapatkan persetujuan resmi konversi 20 SKS dari pihak dekanat kampus.', 'Lulus tes pemahaman teknis elektro dan logika rekayasa.']::text[], ARRAY['Active engineering student (semesters 5-7) in Electrical, Mechanical, Mechatronics, or Industrial Engineering.', 'Basic grasp of electric circuits, basic PLC ladder logic, or microcontroller communication.', 'Minimum GPA of 3.20 from an accredited university department.', 'Official faculty approval letter validating 20 academic credits equivalency.', 'Pass online electrical engineering diagnostics and technical logic evaluation.']::text[], ARRAY['Konversi penuh 20 SKS mata kuliah semester berjalan.', 'Sertifikat resmi keahlian otomatisasi industri berskala global dari Schneider Electric.', 'Kesempatan kunjungan industri ke Smart Factory Schneider Electric di Batam.']::text[], ARRAY['Full 20 academic credits equivalent on university transcripts.', 'Official global industrial automation certification issued by Schneider Electric.', 'Exclusive on-site industrial tour to Schneider Electric Smart Factory in Batam.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Teknik Elektro', 'Teknik Mesin', 'Teknik Industri', 'Informatika']::text[], 'Pembelajaran otomatisasi industri 4.0, sensor IoT industri, dan efisiensi manajemen energi pintar pabrik.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '13 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Workshop: Hands-on Docker & Kubernetes
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'workshop-docker-k8s', 'Workshop: Hands-on Docker & Kubernetes', 'Cloud Native Computing Foundation ID', v_cat_workshop, 'Informatika', 'https://community.cncf.io/indonesia/',
    'Workshop praktis mengemas aplikasi ke container Docker dan orkestrasi cluster Kubernetes skala produksi.', 'Hands-on workshop packaging microservices into Docker containers and orchestrating Kubernetes clusters.', ARRAY['Mahasiswa jurusan komputer atau pengembang yang memahami command line Linux dasar.', 'Membawa laptop pribadi dengan sistem operasi Linux, macOS, atau Windows 11 (WSL2 aktif).', 'Telah memasang Docker Desktop dan Git pada laptop sebelum sesi dimulai.', 'Memiliki akun GitHub aktif untuk melakukan clone repository materi workshop.', 'Terdaftar dan telah melakukan registrasi pada tautan resmi komunitas CNCF ID.']::text[], ARRAY['Computer science students or developers familiar with basic Linux command line.', 'Personal laptop running Linux, macOS, or Windows 11 with WSL2 enabled.', 'Pre-installed Docker Desktop and Git prior to workshop commencement.', 'Active GitHub account for cloning workshop practice repositories.', 'Registered via the official CNCF Indonesia chapter community portal.']::text[], ARRAY['Akses lab cloud computing gratis selama 7 hari untuk latihan orkestrasi cluster.', 'E-certificate of completion berlisensi CNCF Student Community.', 'Source code template siap pakai untuk deployment aplikasi tugas akhir.']::text[], ARRAY['Free 7-day cloud sandbox lab access for live cluster deployment drills.', 'Official e-certificate endorsed by CNCF Student Community Chapter.', 'Production-ready deployment manifest templates for academic and capstone projects.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Informatika', 'Sistem Informasi', 'Teknik Komputer']::text[], 'Workshop praktis mengemas aplikasi ke container Docker dan orkestrasi cluster Kubernetes skala produksi.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '3 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Workshop: Financial Modeling & Valuation Masterclass
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'workshop-financial-modeling', 'Workshop: Financial Modeling & Valuation Masterclass', 'CFA Society Indonesia & PPM', v_cat_workshop, 'Manajemen', 'https://www.cfasociety.org/indonesia/',
    'Workshop simulasi pembuatan model proyeksi laba rugi, valuasi DCF, dan analisis kelayakan investasi merger.', 'Financial modeling masterclass simulating cash flow projections, DCF corporate valuations, and M&A feasibility.', ARRAY['Mahasiswa aktif jurusan Akuntansi, Manajemen Keuangan, atau Ekonomi Pembangunan.', 'Memiliki pemahaman dasar membaca Laporan Keuangan (Neraca, Laba Rugi, Arus Kas).', 'Membawa laptop pribadi dengan aplikasi Microsoft Excel (versi 2016 ke atas terpasang).', 'Melampirkan kartu tanda mahasiswa aktif pada formulir pendaftaran.', 'Menyelesaikan lembar pra-tugas analisis rasio keuangan sebelum workshop.']::text[], ARRAY['Active students in Accounting, Financial Management, or Economics.', 'Foundational capability in reading balance sheets, income statements, and cash flows.', 'Laptop equipped with Microsoft Excel (version 2016 or newer installed).', 'Valid student ID uploaded during workshop ticket registration.', 'Complete a pre-workshop financial ratio calculation assignment.']::text[], ARRAY['Template spreadsheet financial model standar investment banking institusional.', 'Sertifikat keikutsertaan resmi yang diterbitkan oleh CFA Society Indonesia.', 'Networking eksklusif dengan charterholder CFA dan praktisi analis ekuitas ternama.']::text[], ARRAY['Institutional investment-grade Excel financial modeling master templates.', 'Official certificate of participation issued by CFA Society Indonesia.', 'Direct networking opportunities with CFA charterholders and senior equity research analysts.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Akuntansi', 'Manajemen', 'Ekonomi', 'Bisnis']::text[], 'Workshop simulasi pembuatan model proyeksi laba rugi, valuasi DCF, dan analisis kelayakan investasi merger.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '4 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Workshop: Visual Branding & Typography Specialist
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'workshop-adobe-illustrator', 'Workshop: Visual Branding & Typography Specialist', 'Asosiasi Desainer Grafis Indonesia (ADGI)', v_cat_workshop, 'Desain', 'https://adgi.or.id/',
    'Eksplorasi pembuatan manual identitas visual merek, hierarki tipografi modern, dan vector craftmanship di Adobe Illustrator.', 'Hands-on exploration in brand visual identity guidelines, modern typography hierarchy, and vector precision.', ARRAY['Mahasiswa jurusan DKV, Desain Produk, atau peminat desain grafis tingkat pemula-menengah.', 'Membawa laptop dengan software Adobe Illustrator terpasang (Creative Cloud).', 'Membawa mouse atau drawing pen tablet untuk pengerjaan detail vektor.', 'Mengunggah satu karya desain buatan sendiri sebagai bahan kurasi sesi workshop.', 'Berkomitmen hadir tepat waktu selama 2 hari penyelenggaraan workshop intensif.']::text[], ARRAY['Students in Graphic Design, DKV, Industrial Design, or intermediate creative practitioners.', 'Laptop with active Adobe Illustrator Creative Cloud installation.', 'Computer mouse or digital graphics tablet for precision bezier pen tool exercises.', 'Upload one original design work for personalized critique during the masterclass.', 'Committed to 100% attendance across the intensive 2-day live workshop schedule.']::text[], ARRAY['Bedah portfolio dan kurasi karya langsung oleh desainer principal anggota kehormatan ADGI.', 'Paket aset font komersial gratis dan palet warna terkurasi untuk proyek desain.', 'Sertifikat pelatihan desain berskala profesional.']::text[], ARRAY['Live portfolio review and direct design critique from principal designers of ADGI.', 'Curated commercial font licenses and professional brand palette design starter kits.', 'Official professional development certificate endorsed by ADGI.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Desain Komunikasi Visual (DKV)', 'Desain Grafis', 'Multimedia', 'Arsitektur']::text[], 'Eksplorasi pembuatan manual identitas visual merek, hierarki tipografi modern, dan vector craftmanship di Adobe Illustrator.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '5 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Workshop: Metodologi Riset Medis & Publikasi Scopus
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'workshop-riset-klinis', 'Workshop: Metodologi Riset Medis & Publikasi Scopus', 'Ikatan Dokter Indonesia (IDI) & Medika', v_cat_workshop, 'Kesehatan', 'https://idionline.org/',
    'Panduan praktis perancangan uji klinis, telaah kritis jurnal internasional, dan penulisan manuskrip standar Scopus.', 'Practical guide to clinical trial design, critical appraisal, and medical manuscript preparation for Scopus journals.', ARRAY['Mahasiswa Fakultas Kedokteran (sarjana atau koas) atau mahasiswa rumpun kesehatan tingkat akhir.', 'Memahami konsep dasar metodologi penelitian dan biostatistik kesehatan.', 'Membawa draf proposal penelitian atau skripsi bagi yang sedang menyusun tugas akhir.', 'Memiliki laptop untuk praktik software referensi (Mendeley/Zotero) dan SPSS/Stata.', 'Mendaftarkan diri melalui portal resmi sekretariat PB IDI.']::text[], ARRAY['Medical students (pre-clinical or clinical clerks) or healthcare undergraduate seniors.', 'Familiar with basic clinical research methodology and medical biostatistics.', 'Bring thesis proposals or rough research manuscripts for live hands-on drafting.', 'Laptop with reference managers (Mendeley/Zotero) and statistical software ready.', 'Register through the official Indonesian Medical Association (IDI) portal.']::text[], ARRAY['Poin Satuan Kredit Partisipasi (SKP) resmi dari Ikatan Dokter Indonesia.', 'Template penulisan manuskrip jurnal internasional berstandar Q1/Q2 Scopus.', 'Mentoring penulisan langsung bersama editor jurnal kedokteran terindeks internasional.']::text[], ARRAY['Official continuing professional education credits (SKP) accredited by IDI.', 'Standardized manuscript submission templates for high-impact Q1/Q2 Scopus journals.', 'Live writing clinic feedback from chief editors of indexed international medical journals.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Kedokteran', 'Farmasi', 'Kesehatan Masyarakat', 'Keperawatan']::text[], 'Panduan praktis perancangan uji klinis, telaah kritis jurnal internasional, dan penulisan manuskrip standar Scopus.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '6 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Workshop: Executive Presentation & Public Speaking
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'workshop-public-speaking', 'Workshop: Executive Presentation & Public Speaking', 'Toastmasters International ID & Perhumas', v_cat_workshop, 'Komunikasi', 'https://www.toastmasters.org/',
    'Pelatihan teknik vokal, bahasa tubuh, retorika persuasi, dan cara menyajikan presentasi berbobot di depan publik.', 'Vocal coaching, confident body language, persuasive rhetoric, and dynamic public keynote presentation training.', ARRAY['Mahasiswa aktif dari seluruh jurusan yang ingin meningkatkan rasa percaya diri berbicara di depan umum.', 'Bersedia tampil melakukan praktik pidato singkat 3 menit di depan kelas workshop.', 'Berpakaian rapi formal atau smart casual selama sesi berlangsung.', 'Membawa materi presentasi 3 slide bebas sebagai bahan latihan simulasi panggung.', 'Melakukan konfirmasi kehadiran paling lambat 2 hari sebelum acara.']::text[], ARRAY['Active students from all disciplines seeking to elevate stage presence and public speaking confidence.', 'Willing to deliver a 3-minute impromptu presentation live in front of the workshop cohort.', 'Dress code: neat formal or polished smart casual throughout the practical session.', 'Prepare 3 presentation slides on any topic for on-stage vocal projection drills.', 'Confirm seat reservation at least 2 days prior to the live workshop.']::text[], ARRAY['Rekaman video penampilan personal beserta lembar evaluasi mendalam dari juri Toastmasters.', 'Modul teknik persuasi elevator pitch untuk wawancara kerja dan kompetisi bisnis.', 'Sertifikat workshop resmi kredensial kehumasan profesional.']::text[], ARRAY['Personalized high-definition stage recording accompanied by comprehensive evaluation rubrics.', 'Elevator pitch framework toolkit for job interviews and competitive business presentations.', 'Official communications workshop certificate accredited by Toastmasters and Perhumas.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan', 'Ilmu Komunikasi', 'Manajemen', 'Hukum']::text[], 'Pelatihan teknik vokal, bahasa tubuh, retorika persuasi, dan cara menyajikan presentasi berbobot di depan publik.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '4 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Workshop: Autodesk Revit Building Information Modeling
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'workshop-bim-revit', 'Workshop: Autodesk Revit Building Information Modeling', 'Himpunan Ahli Konstruksi Indonesia (HAKI)', v_cat_workshop, 'Teknik', 'https://haki.or.id/',
    'Pemodelan struktur gedung bertingkat 3D, deteksi clash antardisiplin, dan ekspor bill of quantities berbasis BIM.', '3D multistory structural modeling, interdisciplinary clash detection, and BIM-driven bill of quantities takeoff.', ARRAY['Mahasiswa jurusan Teknik Sipil atau Arsitektur minimal semester 4.', 'Membawa laptop dengan spesifikasi GPU diskrit dan terpasang Autodesk Revit (student license).', 'Memahami dasar pembacaan gambar kerja struktur beton dan baja.', 'Melampirkan kartu tanda mahasiswa aktif.', 'Mengikuti pre-test pemahaman pemodelan koordinat bangunan.']::text[], ARRAY['Civil Engineering or Architecture students currently in at least the 4th semester.', 'Laptop with dedicated graphics card and active Autodesk Revit educational license installed.', 'Solid grasp of reading structural concrete and steel fabrication shop drawings.', 'Upload valid active student identification card.', 'Complete online diagnostic pre-test on building coordinate systems.']::text[], ARRAY['Sertifikat pelatihan BIM bersertifikasi HAKI yang diakui kontraktor BUMN.', 'Koleksi parameter library struktur dan material konstruksi SNI.', 'Akses video rekaman tutorial praktik modeling selama 6 bulan.']::text[], ARRAY['HAKI-endorsed BIM practical training certificate recognized by top national contractors.', 'Comprehensive library of structural components calibrated to Indonesian National Standards (SNI).', '6-month on-demand access to video tutorial walkthroughs and sample project files.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Teknik Sipil', 'Arsitektur', 'Manajemen Konstruksi']::text[], 'Pemodelan struktur gedung bertingkat 3D, deteksi clash antardisiplin, dan ekspor bill of quantities berbasis BIM.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '7 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Webinar Nasional: UU PDP & Tantangan Hukum Siber AI
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'webinar-cyber-law', 'Webinar Nasional: UU PDP & Tantangan Hukum Siber AI', 'Fakultas Hukum Universitas Indonesia & Cyber Law ID', v_cat_seminar, 'Hukum', 'https://law.ui.ac.id/',
    'Analisis kepatuhan perlindungan data pribadi, tanggung jawab hukum algoritma AI, dan mitigasi kejahatan siber.', 'Analyzing personal data protection compliance, legal liability of autonomous AI, and cyber crime mitigation.', ARRAY['Terbuka bagi mahasiswa hukum, praktisi IT, pemerhati privasi data, dan masyarakat umum.', 'Mendaftarkan diri secara daring melalui formulir webinar Zoom.', 'Mengikuti seluruh sesi paparan narasumber dari Kementerian Komdigi dan akademisi FH UI.', 'Mengisi kuesioner evaluasi dan presensi daring pada akhir acara.', 'Memiliki koneksi internet stabil untuk streaming Zoom meeting.']::text[], ARRAY['Open to law students, IT practitioners, data privacy enthusiasts, and the general public.', 'Register online via official Zoom webinar registration link.', 'Attend full keynote addresses presented by Ministry officials and university law professors.', 'Submit online evaluation feedback form and attendance confirmation at the event conclusion.', 'Stable broadband internet connection for interactive live video conference.']::text[], ARRAY['E-Sertifikat Nasional berbobot 4 Jam Pelajaran (JP) dengan nomor registrasi resmi.', 'Materi slide presentasi eksklusif mengenai panduan audit kepatuhan UU PDP perusahaan.', 'Kesempatan tanya jawab langsung bersama staf ahli kementerian dan konsultan hukum korporat.']::text[], ARRAY['Nationally accredited e-certificate verified with individual verifiable credential IDs.', 'Exclusive slide decks on enterprise personal data protection compliance audit checklists.', 'Direct Q&A opportunity with senior ministerial legal advisers and corporate tech counsels.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Hukum', 'Ilmu Hukum', 'Sistem Informasi', 'Ilmu Komunikasi']::text[], 'Analisis kepatuhan perlindungan data pribadi, tanggung jawab hukum algoritma AI, dan mitigasi kejahatan siber.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '2 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Webinar: Cerdas Berinvestasi & Karir di Pasar Modal
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'webinar-investasi-ojk', 'Webinar: Cerdas Berinvestasi & Karir di Pasar Modal', 'Otoritas Jasa Keuangan (OJK) & Bursa Efek Indonesia', v_cat_seminar, 'Manajemen', 'https://www.idx.co.id/',
    'Edukasi literasi keuangan mahasiswa, pengenalan instrumen investasi legal, dan prospek karir di industri sekuritas.', 'Student financial literacy education, legitimate investment instruments, and securities industry career paths.', ARRAY['Mahasiswa dari seluruh jenjang pendidikan dan jurusan di seluruh Indonesia.', 'Melakukan pendaftaran melalui portal resmi Sekolah Pasar Modal (SPM) BEI.', 'Memiliki kemauan untuk belajar mengelola keuangan pribadi secara sehat sejak bangku kuliah.', 'Hadir di ruang seminar virtual 15 menit sebelum acara dimulai.', 'Mengikuti kuis interaktif di akhir sesi pemaparan narasumber.']::text[], ARRAY['Undergraduate students from all disciplines across Indonesia.', 'Register through the official IDX Capital Market School (SPM) portal.', 'Committed to mastering personal budgeting, healthy savings, and legitimate equity investing.', 'Join the virtual webinar room 15 minutes before scheduled opening remarks.', 'Participate in the interactive quiz competition concluding the presentation session.']::text[], ARRAY['E-Sertifikat Literasi Keuangan resmi dari Otoritas Jasa Keuangan (OJK).', 'Pembukaan rekening efek saham gratis dengan modal investasi awal Rp100.000 bagi peserta terpilih.', 'Buku panduan digital strategi investasi saham untuk pemula.']::text[], ARRAY['Official financial literacy e-certificate endorsed by the Financial Services Authority (OJK).', 'Free brokerage account opening with complimentary IDR 100,000 seed balance for top attendees.', 'Digital comprehensive handbook on value investing and stock screening for college students.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan', 'Manajemen', 'Akuntansi', 'Ekonomi']::text[], 'Edukasi literasi keuangan mahasiswa, pengenalan instrumen investasi legal, dan prospek karir di industri sekuritas.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '5 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Webinar: Transformasi AI dalam Jurnalisme & Media
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'webinar-tren-media-ai', 'Webinar: Transformasi AI dalam Jurnalisme & Media', 'Aliansi Jurnalis Independen (AJI) Indonesia', v_cat_seminar, 'Komunikasi', 'https://aji.or.id/',
    'Menelaah etika penggunaan generative AI di ruang redaksi media, verifikasi misinformasi digital, dan masa depan jurnalisme.', 'Examining generative AI ethics in newsrooms, digital misinformation fact-checking, and the future of journalism.', ARRAY['Mahasiswa Ilmu Komunikasi, Jurnalistik, Hubungan Masyarakat, atau pengelola media kampus.', 'Mendaftarkan diri pada formulir registrasi daring AJI Indonesia.', 'Tertarik pada isu kebebasan pers, etika peliputan berita digital, dan algoritma kecerdasan buatan.', 'Mengikuti jalannya diskusi panel secara tertib di kanal konferensi video.', 'Mengisi formulir umpan balik pascaacara.']::text[], ARRAY['Students in Communications, Journalism, Public Relations, or campus editorial board members.', 'Complete online registration via AJI Indonesia official portal.', 'Interested in press freedom, digital reporting ethics, and AI-driven news generation.', 'Participate actively in panel discussions via the video conferencing platform.', 'Complete post-event evaluation questionnaire.']::text[], ARRAY['E-Sertifikat kepesertaan webinar dari Aliansi Jurnalis Independen Indonesia.', 'Buku saku digital Panduan Etika Jurnalisme AI dan Verifikasi Berita Hoaks.', 'Akses bergabung dalam kelompok kerja jurnalis mahasiswa AJI Muda Nasional.']::text[], ARRAY['Official certificate of participation issued by AJI Indonesia.', 'Digital handbook on AI journalism ethics and digital media verification tools.', 'Direct membership opportunity in the national AJI Youth student journalist network.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Ilmu Komunikasi', 'Jurnalistik', 'Hubungan Internasional', 'Sastra']::text[], 'Menelaah etika penggunaan generative AI di ruang redaksi media, verifikasi misinformasi digital, dan masa depan jurnalisme.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '8 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Webinar: Transformasi Digital Kesehatan & Telemedicine
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'webinar-telemedicine', 'Webinar: Transformasi Digital Kesehatan & Telemedicine', 'Kementerian Kesehatan RI & IDI', v_cat_seminar, 'Kesehatan', 'https://kemkes.go.id/',
    'Perkembangan platform konsultasi medis daring, rekam medis elektronik terintegrasi SatuSehat, dan etika klinis digital.', 'Advancements in digital consultation platforms, SatuSehat integrated electronic medical records, and digital bioethics.', ARRAY['Mahasiswa kedokteran, farmasi, keperawatan, dan pengembang teknologi kesehatan.', 'Melakukan pendaftaran akun di platform pembelajaran Kemenkes Plataran Sehat.', 'Mengikuti seluruh materi dari narasumber Pusat Data dan Teknologi Informasi Kemenkes RI.', 'Menyelesaikan post-test kelulusan materi dengan skor minimum 70.', 'Memiliki Nomor Induk Kependudukan (NIK) terdaftar untuk penerbitan sertifikat Kemenkes.']::text[], ARRAY['Medical, pharmacy, nursing students, and digital health technology innovators.', 'Register on the Ministry of Health Plataran Sehat continuous learning portal.', 'Complete all webinar lecture units delivered by Ministry Data and Information Center directors.', 'Attain at least 70% passing grade on the post-webinar comprehension assessment.', 'Valid national identity number (NIK) for official verified health credentials.']::text[], ARRAY['Sertifikat resmi terakreditasi Kemenkes RI berbobot Satuan Kredit Profesi (SKP).', 'Materi pemaparan arsitektur integrasi sistem SatuSehat standar HL7 FHIR.', 'Wawasan peluang riset dan startup bidang health-tech di Indonesia.']::text[], ARRAY['Official Ministry of Health accredited certificate granting professional development points (SKP).', 'Technical documentation slides detailing HL7 FHIR architecture on SatuSehat platforms.', 'Deep strategic insights into health-tech venture creation and medical informatics research.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Kedokteran', 'Kesehatan Masyarakat', 'Farmasi', 'Sistem Informasi']::text[], 'Perkembangan platform konsultasi medis daring, rekam medis elektronik terintegrasi SatuSehat, dan etika klinis digital.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '6 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Webinar: Tembus IELTS Band 7.5 & Beasiswa Global
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'webinar-ielts-global', 'Webinar: Tembus IELTS Band 7.5 & Beasiswa Global', 'British Council Indonesia & Mata Garuda LPDP', v_cat_seminar, 'Umum', 'https://www.britishcouncil.id/',
    'Strategi komprehensif menguasai modul IELTS Academic (Listening, Reading, Writing, Speaking) dan tips lolos seleksi beasiswa dunia.', 'Comprehensive strategies mastering IELTS Academic modules and winning world-class postgraduate scholarships.', ARRAY['Mahasiswa dari seluruh jenjang dan jurusan yang berencana melanjutkan studi ke luar negeri.', 'Melakukan registrasi online melalui tautan resmi British Council Indonesia.', 'Menyiapkan alat tulis dan catatan selama pembedahan contoh soal esai Writing Task 2.', 'Mengikuti sesi simulasi latihan listening interaktif.', 'Mengisi daftar hadir resmi saat webinar berlangsung.']::text[], ARRAY['Undergraduate and postgraduate students planning study abroad pursuits.', 'Register online via official British Council Indonesia event landing page.', 'Pen and paper ready for dissecting sample band 8.0 Writing Task 2 essays.', 'Participate actively in live interactive listening drill segments.', 'Confirm real-time digital attendance during the streaming broadcast.']::text[], ARRAY['E-Sertifikat partisipasi resmi dari British Council Indonesia.', 'Akses latihan simulasi tes IELTS daring gratis selama 30 hari (Road to IELTS).', 'Kumpulan contoh esai lolos beasiswa LPDP, Chevening, dan Fulbright dari para awardee.']::text[], ARRAY['Official certificate of participation issued by British Council Indonesia.', 'Complimentary 30-day access to Road to IELTS full practice portal.', 'Compendium of real winning scholarship personal statements (LPDP, Chevening, and Fulbright).']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan']::text[], 'Strategi komprehensif menguasai modul IELTS Academic (Listening, Reading, Writing, Speaking) dan tips lolos seleksi beasiswa dunia.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '9 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: GEMASTIK XVII: Pagelaran Mahasiswa Nasional TIK
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'kompetisi-gemastik', 'GEMASTIK XVII: Pagelaran Mahasiswa Nasional TIK', 'Puspresnas Kemendikbudristek RI', v_cat_kompetisi, 'Informatika', 'https://pusatprestasinasional.kemdikbud.go.id/',
    'Kompetisi TIK mahasiswa paling bergengsi tingkat nasional yang mempertandingkan 11 divisi teknologi dan pengembangan sistem.', 'Indonesia''s premier national student ICT competition featuring 11 technology and system development divisions.', ARRAY['Mahasiswa aktif program diploma atau sarjana yang terdaftar resmi di PDDikti.', 'Membentuk tim beranggotakan 3 orang dari perguruan tinggi yang sama.', 'Mendapatkan surat pengesahan resmi dari pimpinan perguruan tinggi bidang kemahasiswaan.', 'Mengunggah proposal karya, tautan video demonstrasi, atau kode sumber sesuai divisi lomba.', 'Tidak pernah menjadi juara 1 pada divisi lomba yang sama di penyelenggaraan GEMASTIK sebelumnya.']::text[], ARRAY['Active undergraduate or diploma students verified in official PDDikti records.', 'Form a dedicated team of 3 students from the same university institution.', 'Official endorsement letter issued by university student affairs vice rector.', 'Upload project proposal, video demo links, and source code according to division guidelines.', 'Have not previously won 1st prize in the exact same contest division in earlier years.']::text[], ARRAY['Medali resmi Kemendikbudristek, piala bergilir, dan sertifikat prestasi pencatatan SIMKATMAWA.', 'Total hadiah uang pembinaan ratusan juta rupiah bagi para pemenang.', 'Akses langsung program rekrutmen talenta teknologi unggulan nasional.']::text[], ARRAY['Official Ministry medals, prestigious rolling trophy, and verified national SIMKATMAWA achievement records.', 'Substantial development cash prize pool distributed across all podium winners.', 'Direct recruitment pipeline into premier national technology talent networks.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Informatika', 'Sistem Informasi', 'Teknik Komputer', 'Desain Komunikasi Visual (DKV)']::text[], 'Kompetisi TIK mahasiswa paling bergengsi tingkat nasional yang mempertandingkan 11 divisi teknologi dan pengembangan sistem.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '14 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: National Business Case Competition
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'kompetisi-bcc-ui', 'National Business Case Competition', 'Management Student Society FEB UI', v_cat_kompetisi, 'Manajemen', 'https://feb.ui.ac.id/',
    'Kompetisi penyelesaian kasus bisnis korporat nyata di hadapan dewan juri konsultan manajemen dan eksekutif industri.', 'Prestigious national business case challenge resolving real corporate dilemmas before industry executive panels.', ARRAY['Mahasiswa aktif S1 atau diploma dari perguruan tinggi di seluruh Indonesia.', 'Satu tim terdiri dari 3 orang mahasiswa (diperbolehkan lintas jurusan dalam satu kampus).', 'Mengunggah executive summary pemecahan kasus bisnis tahap penyisihan.', 'Mempresentasikan strategi solusi bisnis dalam bahasa Inggris pada babak final.', 'Melampirkan kartu tanda mahasiswa aktif dan bukti pembayaran registrasi tim.']::text[], ARRAY['Active undergraduate or diploma students from any Indonesian university.', 'Teams of 3 students (interdisciplinary members from the same campus allowed).', 'Submit structured executive summary resolving the preliminary business case brief.', 'Deliver a live analytical business pitch in English during the national final round.', 'Attach active student ID cards and official team registration credentials.']::text[], ARRAY['Hadiah uang tunai bernilai puluhan juta rupiah dan piala bergengsi FEB UI.', 'Sertifikat prestasi tingkat nasional untuk portofolio Management Trainee.', 'Kesempatan wawancara magang langsung di perusahaan sponsor utama kasus.']::text[], ARRAY['Cash awards worth tens of millions of rupiah and prestigious FEB UI challenge trophies.', 'Nationally accredited award certificates ideal for competitive Management Trainee resumes.', 'Direct internship interview opportunities with the headline corporate case sponsor.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Manajemen', 'Bisnis', 'Akuntansi', 'Ekonomi', 'Teknik Industri']::text[], 'Kompetisi penyelesaian kasus bisnis korporat nyata di hadapan dewan juri konsultan manajemen dan eksekutif industri.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '12 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: National Moot Court Competition Piala Mahkamah Agung
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'kompetisi-moot-court', 'National Moot Court Competition Piala Mahkamah Agung', 'Mahkamah Agung RI & ALSA Indonesia', v_cat_kompetisi, 'Hukum', 'https://mahkamahagung.go.id/',
    'Kompetisi peradilan semu hukum pidana dan perdata tingkat nasional memperebutkan Piala Bergilir Mahkamah Agung RI.', 'Premier national moot court trial competition competing for the Supreme Court Justice rotating trophy.', ARRAY['Mahasiswa aktif Fakultas Hukum dari perguruan tinggi negeri maupun swasta se-Indonesia.', 'Mendelegasikan satu kontingen resmi kampus yang terdiri dari majelis hakim, penuntut umum, penasihat hukum, dan panitera.', 'Menyusun berkas perkara hukum otentik (surat dakwaan, eksepsi, replik, duplik, putusan).', 'Memperagakan persidangan simulasi peradilan semu di hadapan dewan juri hakim agung dan jaksa senior.', 'Mendapat surat mandat resmi dari dekan fakultas hukum kampus pengirim.']::text[], ARRAY['Active law students from public or private faculties of law nationwide.', 'Deploy an official institutional delegation comprising judges, prosecutors, defense counsels, and clerks.', 'Draft authentic case dossiers (indictments, motions, closing arguments, and formal verdicts).', 'Enact full procedural court trials before panels of real Supreme Court judges and senior prosecutors.', 'Hold a formal delegation mandate letter signed by the faculty dean.']::text[], ARRAY['Piala Bergilir Ketua Mahkamah Agung RI dan piagam kejuaraan nasional.', 'Pengakuan bergengsi tinggi di kalangan firma hukum (law firm) terkemuka di Indonesia.', 'Hadiah pembinaan delegasi dan piagam penghargaan advokat muda terbaik.']::text[], ARRAY['Prestigious rotating trophy from the Chief Justice of the Supreme Court and national honors.', 'High distinction recognized across top-tier corporate litigation law firms in Indonesia.', 'Delegation development grants and individual best oralist and advocate awards.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Hukum', 'Ilmu Hukum']::text[], 'Kompetisi peradilan semu hukum pidana dan perdata tingkat nasional memperebutkan Piala Bergilir Mahkamah Agung RI.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '15 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: COMPFEST UI/UX Design Challenge
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'kompetisi-compfest-uiux', 'COMPFEST UI/UX Design Challenge', 'Fakultas Ilmu Komputer Universitas Indonesia', v_cat_kompetisi, 'Desain', 'https://compfest.id/',
    'Kompetisi desain produk digital dan user experience bergengsi untuk memecahkan permasalahan sosial perkotaan.', 'Prestigious digital product and UX design challenge solving critical urban community problems.', ARRAY['Mahasiswa aktif jenjang D3/D4/S1 di seluruh perguruan tinggi di Indonesia.', 'Tim terdiri dari 2 hingga 3 orang mahasiswa.', 'Menyusun laporan proses design thinking lengkap dari empati, perumusan persona, hingga user journey map.', 'Membuat prototype Figma interaktif dengan interaksi mikro dan desain responsif.', 'Mengunggah portofolio desain dan video presentasi solusi produk.']::text[], ARRAY['Active undergraduate or diploma students enrolled in any Indonesian tertiary institution.', 'Teams consisting of 2 to 3 collaborative members.', 'Submit comprehensive design thinking report from empathy research to user journey maps.', 'Build an interactive high-fidelity Figma prototype complete with micro-interactions.', 'Upload design system portfolio sheets and a concise solution walkthrough video.']::text[], ARRAY['Total hadiah tunai puluhan juta rupiah dan plakat penghargaan COMPFEST UI.', 'Sesi review desain mendalam bersama Product Design Lead dari startup unicorn Indonesia.', 'Peluang magang langsung di tim produk digital perusahaan sponsor kompetisi.']::text[], ARRAY['Substantial cash prize pool and official COMPFEST award plaques.', 'Comprehensive live design critique by Product Design Leads from Southeast Asian tech unicorns.', 'Direct internship opportunities within digital product teams of event sponsors.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Desain Komunikasi Visual (DKV)', 'Informatika', 'Sistem Informasi', 'Semua Jurusan']::text[], 'Kompetisi desain produk digital dan user experience bergengsi untuk memecahkan permasalahan sosial perkotaan.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '9 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Kompetisi Jembatan Indonesia (KJI) & Bangunan Gedung
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'kompetisi-kji-puspresnas', 'Kompetisi Jembatan Indonesia (KJI) & Bangunan Gedung', 'Balai Pengembangan Talenta Indonesia Kemendikbudristek', v_cat_kompetisi, 'Teknik', 'https://bpti.kemdikbud.go.id/',
    'Ajang unjuk kemampuan perancangan, analisis kekuatan struktur, dan perakitan model jembatan rangka baja presisi tinggi.', 'Engineering showcase evaluating structural optimization, load-bearing efficiency, and rapid bridge assembly.', ARRAY['Mahasiswa aktif S1 atau D4 program studi Teknik Sipil atau Arsitektur.', 'Membentuk tim perancang jembatan beranggotakan 3 mahasiswa dan 1 dosen pembimbing.', 'Menyerahkan proposal desain lengkap dengan simulasi beban struktur (SAP2000/Midas Civil).', 'Bagi tim finalis, wajib melakukan perakitan model fisik jembatan di arena kompetisi sesuai batas waktu.', 'Surat penugasan resmi dari pimpinan perguruan tinggi.']::text[], ARRAY['Active undergraduate students in Civil Engineering or Architecture disciplines.', 'Form an engineering design team of 3 students supervised by 1 faculty mentor.', 'Submit structural calculation proposals including finite element load analysis models.', 'Finalist teams must execute live physical scale-model bridge assembly within strict time limits.', 'Hold formal institutional delegation appointment letters from university management.']::text[], ARRAY['Piala Bergilir KJI Kemendikbudristek dan medali kejuaraan nasional rekayasa sipil.', 'Pengakuan prestasi di sistem Pusat Prestasi Nasional untuk beasiswa lanjutan.', 'Bantuan dana fabrikasi model dan hadiah uang pembinaan tim juara.']::text[], ARRAY['Prestigious rotating Kemendikbudristek Trophy and national engineering championship medals.', 'Official achievement credential registered with Puspresnas for postgraduate funding advantages.', 'Model fabrication reimbursement allowances and substantial team cash prizes.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Teknik Sipil', 'Arsitektur', 'Teknik Mesin']::text[], 'Ajang unjuk kemampuan perancangan, analisis kekuatan struktur, dan perakitan model jembatan rangka baja presisi tinggi.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '16 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  -- Peluang: Program Kreativitas Mahasiswa (PKM) & PIMNAS
  INSERT INTO public.opportunities (
    slug, title, organization, primary_category_id, field, source_url,
    summary, summary_en, requirements, requirements_en, benefits, benefits_en,
    publication_status, recommended, verified_at
  ) VALUES (
    'kompetisi-pimnas-pkm', 'Program Kreativitas Mahasiswa (PKM) & PIMNAS', 'Ditjen Diktiristek Kemendikbudristek RI', v_cat_kompetisi, 'Umum', 'https://simbelmawa.kemdikbud.go.id/',
    'Ajang puncak kompetisi ilmiah mahasiswa Indonesia terbesar yang mendanai riset eksakta, sosial humaniora, kewirausahaan, dan karsa cipta.', 'Indonesia''s largest national student scientific innovation competition funding research, social humanities, and tech prototypes.', ARRAY['Mahasiswa aktif program diploma atau sarjana perguruan tinggi di lingkungan Kemendikbudristek.', 'Membentuk tim 3-5 mahasiswa dengan keanggotaan lintas angkatan atau lintas program studi.', 'Menyusun proposal ilmiah sesuai pedoman resmi PKM (Riset, Kewirausahaan, Pengabdian, Karsa Cipta).', 'Mendapatkan persetujuan dosen pendamping dan pengesahan pimpinan perguruan tinggi di SIMBELMAWA.', 'Lolos seleksi pendanaan nasional dan penilaian kemajuan pelaksanaan PKM (PKP2).']::text[], ARRAY['Active vocational or undergraduate student enrolled in Kemendikbudristek affiliated institutions.', 'Form collaborative teams of 3 to 5 students with interdisciplinary memberships strongly encouraged.', 'Author scientific research proposals following official guidelines (STEM, Social, Venture, Prototype).', 'Attain faculty advisor endorsement and university leadership validation on SIMBELMAWA.', 'Win national government execution funding and successfully pass mid-term progress reviews.']::text[], ARRAY['Pendanaan hibah pelaksanaan proyek riset hingga Rp10.000.000 per judul yang lolos.', 'Tiket berlaga di Pekan Ilmiah Mahasiswa Nasional (PIMNAS) memperebutkan Piala Adhidaya Kertawidya.', 'Ekuivalensi pembebasan skripsi/tugas akhir di sebagian besar perguruan tinggi di Indonesia.']::text[], ARRAY['Direct government research and project execution grant funding up to IDR 10,000,000 per project.', 'Official ticket to compete at PIMNAS for the prestigious Adhidaya Kertawidya national trophy.', 'Undergraduate thesis or capstone project exemption equivalency across most major Indonesian universities.']::text[],
    'terbit', true, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    updated_at = now()
  RETURNING id INTO v_opp_id;

  INSERT INTO public.eligibility_rules (
    opportunity_id, allowed_majors, other_requirements
  ) VALUES (
    v_opp_id, ARRAY['Semua Jurusan']::text[], 'Ajang puncak kompetisi ilmiah mahasiswa Indonesia terbesar yang mendanai riset eksakta, sosial humaniora, kewirausahaan, dan karsa cipta.'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

  INSERT INTO public.deadlines (
    opportunity_id, local_date, precision
  ) VALUES (
    v_opp_id, v_today + INTERVAL '20 days', 'tanggal'
  ) ON CONFLICT (opportunity_id) DO NOTHING;

END $$;
