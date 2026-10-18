export const calendarFilters = [
    "Rekomendasi",
    "Semua",
    "Beasiswa",
    "Magang",
    "Bootcamp",
    "Studi Independen",
    "Workshop",
    "Seminar / Webinar",
    "Kompetisi",
    "Deadline",
    "Disimpan"
];

export const categories = [
    "Semua",
    "Beasiswa",
    "Magang",
    "Bootcamp",
    "Studi Independen",
    "Workshop",
    "Seminar / Webinar",
    "Kompetisi"
];

export const opportunities = [
    // 1. BEASISWA
    {
        id: "djarum",
        title: "Djarum Beasiswa Plus",
        organization: "Djarum Foundation",
        category: "Beasiswa",
        recommended: true,
        field: "Umum",
        targetMajors: ["Semua Jurusan"],
        summary: "Program beasiswa prestasi bagi mahasiswa sarjana dan vokasi berprestasi tinggi dari seluruh perguruan tinggi mitra di Indonesia.",
        summaryEn: "Prestigious merit-based scholarship for undergraduate and vocational students across partner universities in Indonesia.",
        requirements: [
            "Sedang menempuh pendidikan S1 atau D4 di semester 4 pada perguruan tinggi mitra resmi.",
            "Memiliki IPK minimum 3,00 pada semester 3 dan dapat mempertahankannya hingga semester 4.",
            "Aktif mengikuti kegiatan organisasi kemahasiswaan intra maupun ekstra kampus.",
            "Tidak sedang menerima beasiswa dari institusi, lembaga, atau perusahaan lain.",
            "Melampirkan bukti prestasi akademik/non-akademik, transkrip nilai legalisir, dan pasfoto terbaru."
        ],
        requirementsEn: [
            "Currently enrolled in the 4th semester of an undergraduate (S1/D4) degree at an official partner university.",
            "Have a minimum GPA of 3.00 in the 3rd semester and maintain it through the 4th semester.",
            "Actively engaged in intra- or extra-curricular campus organizations.",
            "Not currently receiving any scholarship from other institutions or foundations.",
            "Submit proof of achievements, verified academic transcripts, and recent photograph."
        ],
        benefits: [
            "Dana beasiswa sebesar Rp1.000.000 per bulan selama satu tahun penuh.",
            "Pelatihan soft skills eksklusif meliputi Character Building, Leadership Development, dan Nation Building.",
            "Kesempatan bertanding di ajang Writing Competition dan International Exposure."
        ],
        benefitsEn: [
            "Scholarship allowance of IDR 1,000,000 per month for one full year.",
            "Exclusive soft skills training covering Character Building, Leadership, and Nation Building.",
            "Opportunities to compete in national Writing Competitions and international exposure."
        ],
        sourceUrl: "https://www.djarumbeasiswaplus.org/",
        demoDays: 10,
    },
    {
        id: "kip-kuliah",
        title: "Beasiswa KIP Kuliah",
        organization: "Kemendikbudristek RI",
        category: "Beasiswa",
        recommended: true,
        field: "Umum",
        targetMajors: ["Semua Jurusan"],
        summary: "Program bantuan pembiayaan pendidikan tinggi dan tunjangan hidup bagi calon mahasiswa dari keluarga prasejahtera.",
        summaryEn: "Higher education funding and living allowance assistance for outstanding prospective students from underprivileged families.",
        requirements: [
            "Lulusan SMA/SMK/MA atau sederajat yang lulus pada tahun berjalan atau maksimal 2 tahun sebelumnya.",
            "Telah lulus seleksi penerimaan mahasiswa baru pada PTN atau PTS dengan program studi terakreditasi.",
            "Memiliki potensi akademik baik dan keterbatasan ekonomi yang dibuktikan kepemilikan KIP, PKH, KKS, atau SKTM.",
            "Penghasilan kotor gabungan orang tua/wali paling banyak Rp4.000.000 per bulan atau Rp750.000 per anggota keluarga.",
            "Terdaftar secara resmi pada pangkalan data sistem KIP Kuliah Kemendikbudristek."
        ],
        requirementsEn: [
            "Senior high / vocational school graduate in the current year or at most 2 years prior.",
            "Accepted at a state or private university in an accredited study program.",
            "Demonstrate good academic potential with economic need evidenced by KIP, PKH, KKS, or income statements.",
            "Gross combined parental/guardian income not exceeding IDR 4,000,000 per month or IDR 750,000 per capita.",
            "Registered in the official KIP Kuliah Kemendikbudristek database system."
        ],
        benefits: [
            "Pembebasan biaya pendaftaran seleksi masuk perguruan tinggi.",
            "Pembebasan biaya kuliah (UKT/SPP) yang dibayarkan langsung ke rekening perguruan tinggi.",
            "Bantuan biaya hidup bulanan yang disesuaikan dengan klaster wilayah perguruan tinggi."
        ],
        benefitsEn: [
            "Exemption from entrance examination and admission registration fees.",
            "Full tuition fee waiver paid directly to the university account.",
            "Monthly living allowance adjusted according to the university regional economic cluster."
        ],
        sourceUrl: "https://kip-kuliah.kemdikbud.go.id/",
        demoDays: 2,
    },
    {
        id: "beasiswa-bi",
        title: "Beasiswa Bank Indonesia",
        organization: "Bank Indonesia",
        category: "Beasiswa",
        recommended: true,
        field: "Umum",
        targetMajors: ["Semua Jurusan", "Ekonomi", "Manajemen", "Akuntansi", "Hukum", "Informatika"],
        summary: "Dukungan dana pendidikan dan wadah pengembangan kepemimpinan Generasi Baru Indonesia (GenBI) dari Bank Indonesia.",
        summaryEn: "Educational grant and leadership community development through Generasi Baru Indonesia (GenBI) by Bank Indonesia.",
        requirements: [
            "Mahasiswa aktif jenjang S1/D4 reguler yang telah menyelesaikan sekurang-kurangnya 40 SKS.",
            "Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3,00 (skala 4,00) untuk PTN atau 3,25 untuk PTS.",
            "Maksimal berusia 23 tahun pada saat ditetapkan sebagai penerima beasiswa.",
            "Tidak sedang menerima beasiswa atau berada dalam status ikatan dinas dari instansi lain.",
            "Bersedia berperan aktif dalam kegiatan komunitas penerima beasiswa Bank Indonesia (GenBI)."
        ],
        requirementsEn: [
            "Active undergraduate (S1/D4) student with a minimum of 40 completed credit units (SKS).",
            "Minimum cumulative GPA of 3.00 (scale 4.00) for public universities or 3.25 for private universities.",
            "Maximum 23 years of age when selected as a recipient.",
            "Not receiving any other scholarships or tied to official government service contracts.",
            "Willing to participate actively in the Generasi Baru Indonesia (GenBI) community activities."
        ],
        benefits: [
            "Tunjangan biaya pendidikan sebesar Rp1.000.000 per bulan selama masa periode beasiswa.",
            "Pelatihan kepemimpinan, wawasan kebanksentralan, dan workshop entrepreneurship berkala.",
            "Akses jejaring nasional bersama ribuan mahasiswa berprestasi se-Indonesia."
        ],
        benefitsEn: [
            "Tuition grant of IDR 1,000,000 per month during the scholarship period.",
            "Regular leadership bootcamps, central banking insights, and entrepreneurship training.",
            "National networking opportunities with thousands of outstanding students across Indonesia."
        ],
        sourceUrl: "https://www.bi.go.id/",
        demoDays: 10,
    },
    {
        id: "beasiswa-unggulan",
        title: "Beasiswa Unggulan Masyarakat Berprestasi",
        organization: "Puslapdik Kemendikbudristek",
        category: "Beasiswa",
        recommended: true,
        field: "Umum",
        targetMajors: ["Semua Jurusan"],
        summary: "Beasiswa penuh pemerintah Republik Indonesia untuk mahasiswa berprestasi di tingkat nasional maupun internasional.",
        summaryEn: "Full Indonesian government scholarship for high-achieving undergraduate students with national/international awards.",
        requirements: [
            "Mahasiswa baru semester 1 dengan LoA Unconditional atau mahasiswa on-going maksimal semester 3.",
            "Memiliki sertifikat prestasi tingkat nasional (minimal juara 1-3) atau internasional (minimal finalis) 3 tahun terakhir.",
            "IPK minimal 3,25 (skala 4,00) bagi mahasiswa on-going program sarjana.",
            "Memiliki sertifikat kemahiran bahasa Indonesia (UKBI) dan sertifikat bahasa Inggris (TOEFL ITP/IELTS).",
            "Menulis esai personal statement dengan tema kontribusi untuk Indonesia."
        ],
        requirementsEn: [
            "First semester student with LoA Unconditional or on-going student up to semester 3.",
            "Hold proof of national awards (top 3) or international competition participation in the past 3 years.",
            "Minimum GPA of 3.25 for on-going undergraduate applicants.",
            "Hold valid Indonesian language proficiency (UKBI) and English proficiency (TOEFL/IELTS) certificates.",
            "Submit a structured personal contribution essay for Indonesia."
        ],
        benefits: [
            "Biaya pendidikan penuh (SPP/UKT) sampai semester 8.",
            "Biaya hidup bulanan sesuai standar biaya masukan pemerintah.",
            "Bantuan biaya buku dan tunjangan penelitian tugas akhir."
        ],
        benefitsEn: [
            "Full tuition fee coverage until the 8th semester.",
            "Monthly living stipend according to government standards.",
            "Book allowance and final thesis research grant."
        ],
        sourceUrl: "https://beasiswaunggulan.kemdikbud.go.id/",
        demoDays: 14,
    },
    {
        id: "beasiswa-tanoto",
        title: "Tanoto Foundation TELADAN Program",
        organization: "Tanoto Foundation",
        category: "Beasiswa",
        recommended: true,
        field: "Umum",
        targetMajors: ["Semua Jurusan", "Manajemen", "Informatika", "Teknik", "Hukum"],
        summary: "Program beasiswa dan kepemimpinan transformasional untuk melahirkan calon pemimpin masa depan Indonesia.",
        summaryEn: "Transformational leadership development and scholarship program shaping future leaders of Indonesia.",
        requirements: [
            "Warga Negara Indonesia terdaftar sebagai mahasiswa reguler semester 1 di perguruan tinggi mitra Tanoto Foundation.",
            "Memiliki prestasi akademik baik dan integritas kepemimpinan yang terbukti di organisasi.",
            "Berkomitmen mengikuti program pengembangan kepemimpinan terstruktur dari semester 2 hingga 8.",
            "Memiliki kemampuan komunikasi dan interpersonal yang kuat.",
            "Lulus seleksi berkas administrasi, tes asesmen potensi, dan wawancara panelis."
        ],
        requirementsEn: [
            "Indonesian citizen enrolled as a full-time 1st semester undergraduate student at partner universities.",
            "Demonstrated strong academic standing and proven leadership integrity in school/campus activities.",
            "Committed to completing structured leadership development modules from semester 2 to 8.",
            "Possess solid communication and interpersonal abilities.",
            "Pass administrative screening, online potential assessment, and panel interviews."
        ],
        benefits: [
            "Dukungan biaya kuliah penuh (UKT) dan uang saku bulanan hingga lulus (semester 8).",
            "Program kepemimpinan intensif terstruktur berstandar internasional.",
            "Dukungan magang profesional, dana pengembangan proyek sosial, dan jejaring alumni global."
        ],
        benefitsEn: [
            "Full tuition coverage and monthly living allowance until graduation (semester 8).",
            "Structured multi-year leadership masterclasses based on global leadership frameworks.",
            "Professional internship access, community action project sponsorship, and global alumni network."
        ],
        sourceUrl: "https://www.tanotofoundation.org/id/teladan/",
        demoDays: 16,
    },
    {
        id: "beasiswa-kemenkes",
        title: "Beasiswa Tenaga Kesehatan & Dokter",
        organization: "Kementerian Kesehatan RI",
        category: "Beasiswa",
        recommended: true,
        field: "Kesehatan",
        targetMajors: ["Kedokteran", "Keperawatan", "Farmasi", "Kesehatan Masyarakat", "Kebidanan"],
        summary: "Bantuan pendidikan untuk mempercepat pemenuhan dan pemerataan dokter dan tenaga kesehatan di seluruh pelosok Indonesia.",
        summaryEn: "Healthcare grant accelerating the distribution of medical doctors and allied health professionals throughout Indonesia.",
        requirements: [
            "Mahasiswa aktif program studi Kedokteran, Keperawatan, Farmasi, Gizi, atau Kesehatan Masyarakat.",
            "Indeks Prestasi Kumulatif (IPK) minimal 3,00 pada semester berjalan.",
            "Bersedia ditempatkan di fasilitas pelayanan kesehatan daerah Terdepan, Terluar, dan Tertinggal (3T) setelah lulus.",
            "Mendapat rekomendasi tertulis dari Dekan Fakultas Kedokteran/Kesehatan universitas asal.",
            "Surat pernyataan tidak sedang menerima beasiswa lain dan bebas catatan pidana."
        ],
        requirementsEn: [
            "Active undergraduate student majoring in Medicine, Nursing, Pharmacy, Nutrition, or Public Health.",
            "Minimum GPA of 3.00 in the current academic semester.",
            "Willing to serve in regional healthcare centers in remote and border regions (3T) post-graduation.",
            "Provide written recommendation letter from the Faculty Dean.",
            "Official statement of not receiving other funding and clean criminal record."
        ],
        benefits: [
            "Bantuan biaya operasional pendidikan penuh (UKT/SPP) hingga masa kepaniteraan klinik/profesi.",
            "Tunjangan biaya hidup dan bantuan buku teks medis tiap semester.",
            "Jaminan penempatan kerja resmi di rumah sakit atau puskesmas binaan Kemenkes RI."
        ],
        benefitsEn: [
            "Full tuition and clinical rotation fees covered until professional licensing.",
            "Monthly living stipend and medical textbook allowance each semester.",
            "Guaranteed clinical placement at Ministry of Health affiliated hospitals and clinics."
        ],
        sourceUrl: "https://beasiswasdmmk.kemkes.go.id/",
        demoDays: 8,
    },

    // 2. MAGANG
    {
        id: "vinix7",
        title: "Web Dev & UI/UX Internship",
        organization: "PT Vinix Seven Aurum",
        category: "Magang",
        recommended: true,
        field: "Informatika",
        targetMajors: ["Informatika", "Sistem Informasi", "Desain Komunikasi Visual (DKV)", "Teknik Komputer"],
        summary: "Magang berbasis proyek kolaboratif untuk membangun aplikasi web modern, design system, dan user interface interaktif.",
        summaryEn: "Project-based collaborative internship building modern web applications, design systems, and responsive user interfaces.",
        requirements: [
            "Mahasiswa aktif jurusan Informatika, Sistem Informasi, DKV, atau bidang ilmu serumpun.",
            "Memahami dasar HTML, CSS, JavaScript, atau pengoperasian software desain antarmuka Figma.",
            "Mampu bekerja sama dalam tim lintas fungsi dengan metode agile sprint.",
            "Menyertakan portofolio desain UI/UX atau tautan repositori GitHub proyek web yang pernah dikerjakan.",
            "Bersedia mengikuti durasi magang penuh waktu selama 3 sampai 6 bulan."
        ],
        requirementsEn: [
            "Active student in Informatics, Information Systems, Visual Communication Design, or related fields.",
            "Familiar with fundamentals of HTML, CSS, JavaScript, or Figma UI/UX design tools.",
            "Able to collaborate effectively in cross-functional agile sprint teams.",
            "Include UI/UX portfolio links or GitHub repositories of previously built projects.",
            "Available for full-time internship engagement for 3 to 6 months."
        ],
        benefits: [
            "Mentoring intensif one-on-one bersama Senior Software Engineer dan UI/UX Lead.",
            "Uang saku bulanan kompetitif dan sertifikat resmi pengalaman kerja industri.",
            "Kesempatan diangkat menjadi junior full-time engineer setelah lulus."
        ],
        benefitsEn: [
            "One-on-one intensive mentorship with Senior Software Engineers and UI/UX Leads.",
            "Competitive monthly stipend and official certificate of industrial internship completion.",
            "Direct opportunity for conversion to full-time junior positions upon graduation."
        ],
        sourceUrl: "https://vinix7.id/",
        demoDays: 3,
    },
    {
        id: "magenta",
        title: "Magang Generasi Bertalenta (MAGENTA)",
        organization: "Forum Human Capital Indonesia BUMN",
        category: "Magang",
        recommended: true,
        field: "Beragam bidang",
        targetMajors: ["Semua Jurusan", "Manajemen", "Akuntansi", "Informatika", "Hukum", "Teknik"],
        summary: "Program magang terpadu bagi mahasiswa untuk merasakan pengalaman bekerja nyata di ratusan perusahaan BUMN terkemuka.",
        summaryEn: "Integrated internship program giving students real-world work exposure across top Indonesian state-owned enterprises.",
        requirements: [
            "Mahasiswa aktif D3/D4/S1 minimal semester 5 atau fresh graduate maksimal 1 tahun kelulusan.",
            "IPK minimal 3,00 (skala 4,00) dari perguruan tinggi dengan akreditasi minimal B.",
            "Memiliki surat rekomendasi resmi atau surat pengantar magang dari universitas/fakultas.",
            "Melampirkan Curriculum Vitae (CV) format ATS, transkrip nilai terbaru, dan kartu tanda mahasiswa (KTM).",
            "Bersedia menjalani magang secara penuh waktu (onsite/hybrid) selama 1 hingga 6 bulan."
        ],
        requirementsEn: [
            "Active vocational or undergraduate student (min. 5th semester) or fresh graduate (max. 1 year post-grad).",
            "Minimum GPA of 3.00 from an accredited university program.",
            "Official recommendation letter from university or faculty dean.",
            "Upload ATS-friendly Curriculum Vitae, academic transcript, and student ID card.",
            "Committed to full-time internship (onsite or hybrid) for 1 to 6 months."
        ],
        benefits: [
            "Uang saku bulanan dan bantuan fasilitas kerja sesuai regulasi BUMN tempat magang.",
            "Sertifikat magang berstandar nasional yang ditandatangani oleh Kementerian BUMN dan FHCI.",
            "Poin nilai tambah khusus pada seleksi Rekrutmen Bersama BUMN (RBB)."
        ],
        benefitsEn: [
            "Monthly stipend and workspace facilities provided by the host state-owned enterprise.",
            "Nationally recognized internship certificate endorsed by the Ministry of SOEs and FHCI.",
            "Direct advantage and bonus evaluation points in official BUMN recruitment drives."
        ],
        sourceUrl: "https://magenta.fhcibumn.com/",
        demoDays: 10,
    },
    {
        id: "magang-bakti",
        title: "Magang Bakti BCA",
        organization: "PT Bank Central Asia Tbk",
        category: "Magang",
        recommended: true,
        field: "Perbankan",
        targetMajors: ["Semua Jurusan", "Manajemen", "Akuntansi", "Ilmu Komunikasi", "Ekonomi"],
        summary: "Pelatihan kerja profesional di bidang operasional perbankan, customer service, dan teknologi layanan nasabah.",
        summaryEn: "Professional banking operations and customer frontline training at Indonesia's leading private bank.",
        requirements: [
            "Warga Negara Indonesia pria/wanita dengan penampilan rapi, ramah, dan kemampuan komunikasi prima.",
            "Lulusan D1-D3 atau S1 minimal semester akhir dengan IPK minimum 2,50 (skala 4,00).",
            "Berusia 18 sampai 24 tahun pada saat mendaftar.",
            "Belum pernah menikah dan bersedia tidak menikah selama masa magang bakti.",
            "Bersedia ditempatkan di seluruh kantor cabang BCA di wilayah pendaftaran yang dipilih."
        ],
        requirementsEn: [
            "Indonesian citizen with polished professional presentation and strong communication skills.",
            "Diploma or undergraduate students/graduates with a minimum GPA of 2.50.",
            "Aged 18 to 24 years old at the time of application.",
            "Unmarried and willing to remain unmarried during the entire internship contract period.",
            "Willing to be assigned across BCA branch networks in the registered regional zone."
        ],
        benefits: [
            "Uang saku bulanan, tunjangan kesehatan, dan bonus kinerja berkala.",
            "Pelatihan komprehensif mengenai tata kelola transaksi perbankan modern dan etika customer service.",
            "Bantuan beasiswa dana pendidikan pada akhir periode masa magang bagi peserta terbaik."
        ],
        benefitsEn: [
            "Monthly allowance, health coverage benefits, and regular performance incentives.",
            "Comprehensive training in modern digital banking workflows and frontline service etiquette.",
            "Education grant scholarship upon successful completion of the full program tenure."
        ],
        sourceUrl: "https://karir.bca.co.id/",
        demoDays: 10,
    },
    {
        id: "magang-telkom",
        title: "Telkom DigiUp Intern",
        organization: "PT Telkom Indonesia (Persero) Tbk",
        category: "Magang",
        recommended: true,
        field: "Informatika",
        targetMajors: ["Informatika", "Sistem Informasi", "Teknik Telekomunikasi", "Teknik Komputer", "Bisnis Digital"],
        summary: "Kesempatan magang digital transformation di perusahaan telekomunikasi terbesar di Indonesia.",
        summaryEn: "Digital transformation internship opportunity at Indonesia's premier telecommunications conglomerate.",
        requirements: [
            "Mahasiswa aktif S1 semester 6 atau 7 dari jurusan Teknik Informatika, SI, atau Elektro.",
            "Menguasai setidaknya satu bahasa pemrograman utama (JavaScript, Python, Go, atau Java).",
            "Memiliki pemahaman dasar arsitektur REST API, Git version control, dan arsitektur microservices.",
            "Transkrip nilai dengan IPK minimal 3,20 dari skala 4,00.",
            "Menyelesaikan asesmen coding teknis dan wawancara kecocokan kultur."
        ],
        requirementsEn: [
            "Active undergraduate student (6th or 7th semester) in Computer Science, IS, or Telecommunication Engineering.",
            "Proficient in at least one modern language (JavaScript, Python, Go, or Java).",
            "Basic understanding of REST APIs, Git version control, and cloud-ready architectures.",
            "Academic transcript showing a minimum cumulative GPA of 3.20.",
            "Complete technical coding assessment and culture-fit interviews."
        ],
        benefits: [
            "Uang saku bulanan kompetitif dan fasilitas perangkat kerja digital.",
            "Pembimbingan langsung oleh lead engineer dan arsitek cloud enterprise Telkom.",
            "Akses gratis ke sertifikasi internasional Telkom Digital Talent."
        ],
        benefitsEn: [
            "Competitive monthly allowance and modern digital work equipment.",
            "Direct mentorship from senior enterprise engineers and cloud architects.",
            "Complimentary access to international Telkom Digital Talent certification exams."
        ],
        sourceUrl: "https://careers.telkom.co.id/",
        demoDays: 6,
    },
    {
        id: "magang-mandiri",
        title: "Mandiri Young Bankers Internship",
        organization: "PT Bank Mandiri (Persero) Tbk",
        category: "Magang",
        recommended: true,
        field: "Manajemen",
        targetMajors: ["Manajemen", "Akuntansi", "Ekonomi", "Bisnis Digital", "Statistika"],
        summary: "Program magang intensif di unit bisnis corporate banking, risk management, dan wealth advisory Bank Mandiri.",
        summaryEn: "Intensive internship in corporate banking, enterprise risk, and wealth advisory at Bank Mandiri.",
        requirements: [
            "Mahasiswa aktif minimal semester 6 jurusan Manajemen, Akuntansi, Ekonomi, atau Keuangan.",
            "IPK minimal 3,25 (skala 4,00) dari perguruan tinggi terakreditasi A.",
            "Kemampuan analisis data keuangan dan penguasaan Microsoft Excel tingkat lanjut.",
            "Kefasihan berbahasa Inggris aktif baik lisan maupun tulisan.",
            "Lulus psikotes daring dan interview bersama Head of Business Unit."
        ],
        requirementsEn: [
            "Undergraduate student (min. 6th semester) in Management, Accounting, Economics, or Finance.",
            "Minimum GPA of 3.25 from top accredited universities.",
            "Strong quantitative analytical skills and advanced Microsoft Excel proficiency.",
            "Fluent active verbal and written English communication.",
            "Pass online psychometric assessment and business unit head interviews."
        ],
        benefits: [
            "Uang saku bulanan dan asuransi kecelakaan kerja profesional.",
            "Pengalaman menganalisis portofolio kredit komersial dan studi kelayakan investasi nyata.",
            "Jalur prioritas seleksi Officer Development Program (ODP) Mandiri."
        ],
        benefitsEn: [
            "Monthly stipend and professional accident insurance coverage.",
            "Hands-on exposure to corporate credit analysis and real-world investment feasibility studies.",
            "Fast-track consideration for the prestigious Mandiri Officer Development Program (ODP)."
        ],
        sourceUrl: "https://www.bankmandiri.co.id/karir",
        demoDays: 7,
    },
    {
        id: "magang-lbh-legal",
        title: "Legal Practice & Human Rights Intern",
        organization: "Lembaga Bantuan Hukum (LBH) & Mitra Law Firm",
        category: "Magang",
        recommended: true,
        field: "Hukum",
        targetMajors: ["Hukum", "Ilmu Hukum"],
        summary: "Praktek advokasi hukum, penyusunan berkas perkara perdata dan pidana, serta riset kebijakan publik.",
        summaryEn: "Hands-on legal advocacy, case drafting, legal research, and public policy analysis practice.",
        requirements: [
            "Mahasiswa aktif S1 Fakultas Hukum minimal telah menempuh semester 6.",
            "Telah lulus mata kuliah Hukum Acara Pidana, Hukum Acara Perdata, dan Hukum Tata Negara.",
            "Memiliki kemampuan legal drafting dan analisis putusan pengadilan yang teliti.",
            "Komitmen tinggi terhadap penegakan keadilan sosial dan kode etik profesi hukum.",
            "Melampirkan contoh tulisan legal opinion atau esai hukum singkat."
        ],
        requirementsEn: [
            "Active undergraduate Law student currently in at least the 6th semester.",
            "Successfully completed courses in Criminal Procedure, Civil Procedure, and Constitutional Law.",
            "Demonstrated diligence in legal drafting and judicial decision analysis.",
            "Strong dedication to social justice, public defense, and legal professional ethics.",
            "Submit a short legal opinion sample or analytical jurisprudence essay."
        ],
        benefits: [
            "Pendampingan langsung oleh advokat senior dalam pendampingan perkara litigasi dan non-litigasi.",
            "Sertifikat magang profesi yang diakui untuk persyaratan calon advokat.",
            "Uang saku operasional dan akses ke database perpustakaan hukum nasional."
        ],
        benefitsEn: [
            "Direct apprenticeship with senior advocates in both litigation and corporate advisory cases.",
            "Accredited internship certificate fulfilling pre-advocate training prerequisites.",
            "Operational stipend and full access to premier national jurisprudence repositories."
        ],
        sourceUrl: "https://lbhjakarta.org/",
        demoDays: 9,
    },
    {
        id: "magang-narasi",
        title: "Creative Content & Graphic Design Intern",
        organization: "Narasi Media & Creative Hub",
        category: "Magang",
        recommended: true,
        field: "Desain",
        targetMajors: ["Desain Komunikasi Visual (DKV)", "Ilmu Komunikasi", "Multimedia", "Desain Grafis"],
        summary: "Magang produksi konten digital, visual branding, motion graphic, dan jurnalisme visual kreatif.",
        summaryEn: "Digital media production, visual branding, motion graphics, and creative visual journalism internship.",
        requirements: [
            "Mahasiswa aktif jurusan Desain Komunikasi Visual (DKV), Animasi, atau Ilmu Komunikasi.",
            "Mahir mengoperasikan Adobe Creative Suite (Illustrator, Photoshop, Premiere Pro, After Effects) atau Figma.",
            "Peka terhadap tren visual media sosial dan memiliki selera tata letak tipografi yang kuat.",
            "Wajib melampirkan portofolio visual interaktif (Behance, Google Drive, atau Website Pribadi).",
            "Mampu bekerja dinamis dengan tenggat waktu cepat di industri media."
        ],
        requirementsEn: [
            "Active student in Visual Communication Design (DKV), Animation, or Communications.",
            "Proficient in Adobe Creative Suite (Illustrator, Photoshop, After Effects) or Figma.",
            "High sensitivity to social media design trends and strong typography composition taste.",
            "Mandatory submission of creative visual portfolio (Behance, Drive, or personal site).",
            "Able to produce dynamic deliverables under fast-paced modern newsroom deadlines."
        ],
        benefits: [
            "Uang saku bulanan dan jatah makan siang harian kantor pusat Narasi.",
            "Karya visual dipublikasikan di kanal media nasional yang menjangkau jutaan audiens.",
            "Mentoring kreatif bersama Creative Director dan Produser Konten berpengalaman."
        ],
        benefitsEn: [
            "Monthly stipend and daily meal allowances at Narasi headquarters.",
            "Visual assets published across national digital platforms reaching millions of viewers.",
            "Creative mentorship directly from award-winning Creative Directors and Senior Producers."
        ],
        sourceUrl: "https://narasi.tv/",
        demoDays: 5,
    },
    {
        id: "magang-bpjs-kesehatan",
        title: "Healthcare Analytics & Service Intern",
        organization: "BPJS Kesehatan RI",
        category: "Magang",
        recommended: true,
        field: "Kesehatan",
        targetMajors: ["Kedokteran", "Kesehatan Masyarakat", "Farmasi", "Keperawatan", "Sistem Informasi"],
        summary: "Magang analisis data jaminan kesehatan nasional, manajemen mutu fasilitas klinis, dan pelayanan kesehatan publik.",
        summaryEn: "National health coverage analytics, clinical service quality management, and public health service internship.",
        requirements: [
            "Mahasiswa aktif semester 6-8 dari rumpun ilmu Kesehatan Masyarakat, Kedokteran, Farmasi, atau Manajemen.",
            "IPK minimal 3,00 dari perguruan tinggi berakreditasi baik.",
            "Memahami konsep dasar JKN, sistem rujukan kesehatan berjenjang, dan epidemiologi dasar.",
            "Mampu mengolah data kesehatan menggunakan spreadsheet atau aplikasi statistik.",
            "Surat rekomendasi resmi dari pimpinan dekanat fakultas."
        ],
        requirementsEn: [
            "Active undergraduate student (semesters 6-8) in Public Health, Medicine, Pharmacy, or Nursing.",
            "Minimum cumulative GPA of 3.00 from accredited universities.",
            "Familiar with universal health coverage frameworks and primary care referral workflows.",
            "Proficient in quantitative healthcare data processing using spreadsheet and statistical tools.",
            "Official recommendation letter signed by the faculty dean."
        ],
        benefits: [
            "Uang saku bulanan resmi dan perlindungan jaminan sosial ketenagakerjaan.",
            "Pengalaman mengolah data kesehatan skala nasional untuk perumusan kebijakan preventif.",
            "Sertifikat magang resmi instansi pemerintah untuk lampiran SKPI."
        ],
        benefitsEn: [
            "Official monthly stipend and full workplace insurance protection.",
            "Hands-on exposure to macro national health data for preventive healthcare policy design.",
            "Government accredited internship certificate valid for diploma supplement (SKPI)."
        ],
        sourceUrl: "https://www.bpjs-kesehatan.go.id/",
        demoDays: 8,
    },
    {
        id: "magang-wika-konstruksi",
        title: "Civil & Structural Engineering Intern",
        organization: "PT Wijaya Karya (Persero) Tbk",
        category: "Magang",
        recommended: true,
        field: "Teknik",
        targetMajors: ["Teknik Sipil", "Arsitektur", "Teknik Lingkungan", "Manajemen Konstruksi"],
        summary: "Praktik langsung pengawasan proyek infrastruktur strategis nasional dan pemodelan BIM konstruksi.",
        summaryEn: "On-site strategic infrastructure supervision and BIM structural construction modeling internship.",
        requirements: [
            "Mahasiswa aktif S1 Teknik Sipil atau Arsitektur minimal telah menyelesaikan 100 SKS.",
            "Menguasai software teknik AutoCAD, SAP2000, ETABS, atau Autodesk Revit BIM.",
            "Memahami prinsip K3 (Keselamatan dan Kesehatan Kerja) dan metode pelaksanaan konstruksi.",
            "Sehat jasmani dan bersedia ditempatkan di proyek lapangan konstruksi.",
            "Melampirkan CV dan transkrip nilai dengan IPK minimal 3,00."
        ],
        requirementsEn: [
            "Active Civil Engineering or Architecture student with at least 100 completed credits.",
            "Proficient in technical drafting tools including AutoCAD, SAP2000, ETABS, or Revit BIM.",
            "Sound understanding of occupational health & safety (K3) and building execution methodologies.",
            "Physically fit and prepared for active on-site infrastructure deployment.",
            "Submit CV and academic transcript showing a minimum GPA of 3.00."
        ],
        benefits: [
            "Uang saku bulanan, akomodasi mess proyek, dan asuransi perlindungan kerja lapangan.",
            "Sertifikasi penerapan Building Information Modeling (BIM) praktis.",
            "Kesempatan rekrutmen Management Trainee Jalur Prestasi WIKA."
        ],
        benefitsEn: [
            "Monthly allowance, on-site project housing accommodation, and occupational safety coverage.",
            "Practical Building Information Modeling (BIM) application certification.",
            "Direct pipeline eligibility for WIKA Management Trainee recruitment programs."
        ],
        sourceUrl: "https://www.wika.co.id/",
        demoDays: 11,
    },
    {
        id: "unicef-internship",
        title: "UNICEF Communication & Policy Intern",
        organization: "UNICEF Indonesia",
        category: "Magang",
        recommended: true,
        field: "Komunikasi",
        targetMajors: ["Ilmu Komunikasi", "Hubungan Internasional", "Hukum", "Psikologi", "Sosiologi"],
        summary: "Peluang magang internasional PBB di bidang advokasi hak anak, komunikasi publik, dan riset kebijakan sosial.",
        summaryEn: "UN international internship opportunity in child rights advocacy, strategic public communications, and social policy research.",
        requirements: [
            "Mahasiswa aktif tingkat sarjana minimal semester 6 atau master di bidang Komunikasi, HI, Hukum, atau Psikologi.",
            "Fasih berbahasa Inggris dan Indonesia secara lisan dan tulisan (skor TOEFL ITP min. 550 / IELTS 6.5).",
            "Mampu menyusun rilis pers, artikel advokasi, dan ringkasan data kebijakan anak.",
            "Memiliki kepekaan tinggi terhadap keberagaman dan prinsip perlindungan anak PBB.",
            "Mengunggah resume, cover letter motivasi bahasa Inggris, dan surat rekomendasi kampus."
        ],
        requirementsEn: [
            "Undergraduate student (min. 6th semester) or graduate student in Communications, IR, Law, or Psychology.",
            "Bilingual fluency in English and Indonesian (min. TOEFL 550 / IELTS 6.5 equivalent).",
            "Able to draft press statements, advocacy articles, and policy briefs accurately.",
            "High cultural sensitivity and adherence to United Nations child safeguarding principles.",
            "Upload CV, English statement of intent, and institutional recommendation letter."
        ],
        benefits: [
            "Monthly living stipend sesuai standar United Nations di Jakarta.",
            "Pengalaman kerja multilateral di lingkungan perwakilan badan PBB dunia.",
            "Sertifikat magang internasional resmi dari United Nations Children's Fund."
        ],
        benefitsEn: [
            "Monthly living stipend according to official United Nations Jakarta country rates.",
            "Direct multilateral operational experience in a premier global UN agency.",
            "Official United Nations Children's Fund international internship certificate."
        ],
        sourceUrl: "https://www.unicef.org/careers/internships",
        demoDays: 12,
    },

    // 3. BOOTCAMP
    {
        id: "hacktiv8",
        title: "AI-Enhanced Full Stack Developer",
        organization: "PT Hacktivate Teknologi Indonesia",
        category: "Bootcamp",
        recommended: true,
        field: "Informatika",
        targetMajors: ["Informatika", "Sistem Informasi", "Semua Jurusan"],
        summary: "Bootcamp coding intensif berstandar industri dengan kurikulum React, Node.js, dan integrasi Artificial Intelligence modern.",
        summaryEn: "Industry-standard coding bootcamp curriculum covering React, Node.js, and modern Artificial Intelligence integrations.",
        requirements: [
            "Terbuka bagi mahasiswa semua jurusan maupun pemula yang memiliki kemauan belajar coding tinggi.",
            "Memiliki laptop pribadi dengan spesifikasi prosesor minimal Intel Core i5/AMD Ryzen 5 dan RAM minimal 8 GB.",
            "Lulus tes logika dasar dan wawancara motivasi belajar intensif.",
            "Berkomitmen meluangkan waktu belajar intensif Senin-Jumat selama 16 minggu penuh.",
            "Memiliki koneksi internet stabil untuk mengikuti sesi live coding interaktif."
        ],
        requirementsEn: [
            "Open to all majors and coding beginners with high drive and grit.",
            "Possess a dedicated personal laptop with min. Core i5/Ryzen 5 specs and 8 GB RAM.",
            "Pass basic algorithmic logic screening and motivational interview.",
            "Committed to intensive full-time study Monday to Friday across 16 weeks.",
            "Stable high-speed broadband connection for interactive live coding sessions."
        ],
        benefits: [
            "Portfolio 5 aplikasi web skala produksi siap deploy ke server cloud.",
            "Akses program Career Coaching dan penyaluran kerja ke lebih dari 500+ hiring partner.",
            "Sertifikat kelulusan kompetensi Full Stack Software Engineering berstandar global."
        ],
        benefitsEn: [
            "Portfolio of 5 production-grade web applications deployed on live cloud infrastructure.",
            "Dedicated career coaching and hiring partner matching across 500+ companies.",
            "Global industry-standard Full Stack Software Engineering certificate of graduation."
        ],
        sourceUrl: "https://www.hacktiv8.com/",
        demoDays: 4,
    },
    {
        id: "dts",
        title: "Digital Talent Scholarship (DTS)",
        organization: "Kementerian Komdigi RI",
        category: "Bootcamp",
        alsoCategories: ["Beasiswa"],
        recommended: true,
        field: "Teknologi",
        targetMajors: ["Semua Jurusan", "Informatika", "Sistem Informasi", "Teknik Elektro"],
        summary: "Program pelatihan dan sertifikasi talenta digital nasional gratis dengan kurikulum teknologi terkini kerja sama mitra global.",
        summaryEn: "Free national digital talent training and certification program partnered with global tech giants.",
        requirements: [
            "Warga Negara Indonesia usia produktif, terbuka untuk mahasiswa aktif semester 4 ke atas.",
            "Memiliki ketertarikan kuat di bidang Cloud Computing, Cybersecurity, atau Data Analytics.",
            "Belum pernah menerima beasiswa program Digital Talent Scholarship pada tahun anggaran yang sama.",
            "Lulus tes substansi bidang dan verifikasi administrasi kependudukan.",
            "Sanggup menyelesaikan program sampai tuntas dan mengikuti ujian sertifikasi kompetensi."
        ],
        requirementsEn: [
            "Indonesian citizen of productive age, open to active students from semester 4 upwards.",
            "Strong interest in Cloud Computing, Cybersecurity, or Data Analytics domains.",
            "Not a recipient of other DTS training tracks in the same fiscal calendar year.",
            "Pass online domain knowledge assessment and administrative verification.",
            "Committed to 100% course completion and sitting for the official certification exam."
        ],
        benefits: [
            "Pelatihan teknologi intensif 100% gratis didanai penuh oleh pemerintah RI.",
            "Voucher ujian sertifikasi internasional resmi (Google, AWS, Microsoft, atau Cisco).",
            "Kesempatan terhubung dengan platform lowongan kerja Diploy Komdigi."
        ],
        benefitsEn: [
            "100% tuition-free intensive tech bootcamp fully funded by the Ministry of Communications.",
            "Free official international exam voucher (Google, AWS, Microsoft, or Cisco).",
            "Direct access to Diploy Komdigi national tech talent job matchmaking portal."
        ],
        sourceUrl: "https://digitalent.komdigi.go.id/",
        demoDays: 10,
    },
    {
        id: "bangkit",
        title: "Bangkit Academy by Google, GoTo, Traveloka",
        organization: "Kemendikbudristek & Google Indonesia",
        category: "Bootcamp",
        alsoCategories: ["Studi Independen"],
        recommended: true,
        field: "Informatika",
        targetMajors: ["Informatika", "Sistem Informasi", "Teknik Komputer", "Statistika", "Semua Jurusan"],
        summary: "Akademi talenta teknologi kelas dunia dengan tiga jalur spesialisasi: Machine Learning, Mobile Development, dan Cloud Computing.",
        summaryEn: "World-class technology academy with three learning paths: Machine Learning, Mobile Development, and Cloud Computing.",
        requirements: [
            "Mahasiswa aktif D4/S1 di perguruan tinggi Indonesia berstatus aktif di PDDikti minimal semester 5.",
            "Berasal dari jurusan teknologi/STEM atau non-STEM dengan kemampuan logika pemrograman memadai.",
            "Memiliki kemampuan bahasa Inggris pasif dan aktif untuk membaca materi kurikulum Google.",
            "Mendapat persetujuan dosen pembimbing dan pimpinan kampus untuk konversi 20 SKS.",
            "Menyelesaikan asesmen teknis dan tes kepribadian pada platform pendaftaran resmi."
        ],
        requirementsEn: [
            "Active undergraduate student (min. 5th semester) registered in the official PDDikti database.",
            "STEM or non-STEM majors possessing foundational algorithmic programming logic.",
            "Adequate English comprehension skills for studying official Google global curriculum.",
            "Official faculty approval letter granting 20 university credit (SKS) conversion.",
            "Complete online technical diagnostic test and situational judgement assessments."
        ],
        benefits: [
            "Konversi penuh hingga 20 SKS mata kuliah semester berjalan di universitas asal.",
            "Voucher sertifikasi global Google (Associate Android Developer / Cloud Engineer / TensorFlow).",
            "Dana inkubasi capstone project hingga Rp140 juta untuk tim proyek terbaik."
        ],
        benefitsEn: [
            "Full conversion of up to 20 academic credits (SKS) recognized by host universities.",
            "Complimentary Google Global Certification voucher (Android / Cloud Engineer / TensorFlow).",
            "Incubation seed funding up to IDR 140 million for winning top capstone project teams."
        ],
        sourceUrl: "https://bangkit.academy/",
        demoDays: 5,
    },
    {
        id: "revou",
        title: "RevoU Digital Career Accelerator",
        organization: "PT Revolusi Cita Edukasi",
        category: "Bootcamp",
        recommended: true,
        field: "Bisnis Digital",
        targetMajors: ["Semua Jurusan", "Manajemen", "Ilmu Komunikasi", "Informatika"],
        summary: "Akselerator karir digital di bidang Data Analytics, Digital Marketing, Product Management, dan Software Engineering.",
        summaryEn: "Career accelerator in Data Analytics, Digital Marketing, Product Management, and Software Engineering.",
        requirements: [
            "Terbuka untuk mahasiswa tingkat akhir dan lulusan baru yang ingin berkarir di industri startup dan tech.",
            "Lolos tes penalaran numerik, logika verbal, dan sesi admissions consultation.",
            "Menyediakan komitmen belajar 15-20 jam per minggu selama 3-6 bulan program.",
            "Memiliki laptop dan koneksi internet stabil untuk mengikuti real-time practical lab.",
            "Memiliki semangat belajar mandiri dan pengerjaan tugas proyek nyata."
        ],
        requirementsEn: [
            "Open to final-year students and fresh graduates seeking modern digital technology careers.",
            "Pass quantitative reasoning, verbal aptitude tests, and admissions consultation session.",
            "Dedicate 15 to 20 study hours per week across the 3 to 6 months curriculum duration.",
            "Functional laptop with reliable broadband for real-time practical laboratory assignments.",
            "Strong self-directed learning ethics and willingness to solve real client business briefs."
        ],
        benefits: [
            "Pengerjaan live real client project dengan anggaran promosi dan data analitik riil.",
            "Bimbingan karir intensif seumur hidup bersama Career Coach profesional.",
            "Akses komunitas alumni RevoU terbesar di Asia Tenggara."
        ],
        benefitsEn: [
            "Work on live client projects with actual marketing budgets and enterprise data warehouses.",
            "Dedicated personalized career coaching and lifelong job application mentorship.",
            "Access to the largest tech alumni network across Southeast Asia."
        ],
        sourceUrl: "https://www.revou.co/",
        demoDays: 7,
    },
    {
        id: "dicoding-academy",
        title: "Dicoding Web & Multiplatform Master",
        organization: "Dicoding Indonesia",
        category: "Bootcamp",
        recommended: true,
        field: "Informatika",
        targetMajors: ["Informatika", "Sistem Informasi", "Teknik Komputer"],
        summary: "Kurikulum terstruktur Google Developers Authorized Training Partner untuk pengembang aplikasi web dan multiplatform.",
        summaryEn: "Structured learning paths by a Google Developers Authorized Training Partner for web and cross-platform engineers.",
        requirements: [
            "Mahasiswa atau umum yang ingin menguasai arsitektur pengembangan web modern dan Flutter.",
            "Mampu belajar mandiri secara asynchronous dan menyelesaikan submission code review.",
            "Memahami dasar logika komputer dan algoritma percabangan/perulangan.",
            "Memiliki akun Dicoding aktif dan melengkapi profil pengembang.",
            "Memiliki komputer dengan instalasi Node.js, VS Code, atau Android Studio."
        ],
        requirementsEn: [
            "Students or individuals eager to master modern web architectures and Flutter multiplatform.",
            "Capable of self-paced asynchronous study and completing rigorous code review submissions.",
            "Basic grasp of computer logic, conditional statements, and iterative data structures.",
            "Active Dicoding student account with completed developer profile information.",
            "Computer with local development environment (Node.js, VS Code, or Android Studio)."
        ],
        benefits: [
            "Code review mendalam baris per baris oleh reviewer software engineer industri berlisensi.",
            "Sertifikat kompetensi kelulusan yang diakui luas oleh ekosistem startup teknologi Indonesia.",
            "Akses selamanya ke forum diskusi teknis dan pembaruan materi kurikulum."
        ],
        benefitsEn: [
            "Line-by-line detailed code reviews provided by licensed industry software engineering practitioners.",
            "Recognized competency certificates widely valued by Southeast Asian tech ecosystems.",
            "Lifetime access to developer discussion forums and periodic curriculum version updates."
        ],
        sourceUrl: "https://www.dicoding.com/",
        demoDays: 5,
    },
    {
        id: "dibimbing",
        title: "Dibimbing Career Bootcamp UI/UX & Data",
        organization: "PT Dibimbing Digital Indonesia",
        category: "Bootcamp",
        recommended: true,
        field: "Desain",
        targetMajors: ["Desain Komunikasi Visual (DKV)", "Sistem Informasi", "Psikologi", "Semua Jurusan"],
        summary: "Bootcamp intensif dengan bimbingan mentor 1-on-1 untuk merintis portofolio UI/UX Design dan Data Science unggulan.",
        summaryEn: "Intensive bootcamp featuring 1-on-1 mentorship to craft competitive UI/UX Design and Data portfolios.",
        requirements: [
            "Mahasiswa tingkat awal hingga akhir yang ingin memperdalam keahlian desain produk digital atau data.",
            "Komitmen mengikuti kelas tatap muka daring di akhir pekan dan mentoring berkala.",
            "Memiliki kemauan kuat dalam merancang solusi dari permasalahan pengguna nyata.",
            "Memiliki perangkat laptop untuk menjalankan software Figma atau Python Jupyter Notebook.",
            "Menyelesaikan form registrasi dan placement test diagnostik."
        ],
        requirementsEn: [
            "Undergraduate students at any level wishing to specialize in Product Design or Data science.",
            "Committed to attending weekend live virtual classrooms and scheduled 1-on-1 mentor sessions.",
            "Demonstrated passion for user-centered research and problem discovery.",
            "Laptop capable of smoothly executing Figma design files or Python Jupyter notebooks.",
            "Complete admissions registration form and diagnostic placement test."
        ],
        benefits: [
            "Mentoring 1-on-1 personal tak terbatas hingga peserta berhasil lulus dan mendapatkan portofolio.",
            "Penyaluran kerja dan magang ke jaringan ratusan perusahaan mitra Dibimbing.",
            "Jaminan uang kembali bersyarat bagi lulusan yang memenuhi kriteria program."
        ],
        benefitsEn: [
            "Unlimited personalized 1-on-1 mentorship sessions until portfolio completion.",
            "Direct job and internship placements into hundreds of vetted hiring partners.",
            "Conditional money-back guarantee for graduates fulfilling graduation criteria."
        ],
        sourceUrl: "https://dibimbing.id/",
        demoDays: 3,
    },
    {
        id: "ppm-training",
        title: "PPM Executive Management Training",
        organization: "PPM Manajemen",
        category: "Bootcamp",
        alsoCategories: ["Beasiswa"],
        recommended: false,
        field: "Manajemen",
        targetMajors: ["Manajemen", "Akuntansi", "Ekonomi", "Bisnis"],
        summary: "Pelatihan manajemen strategis, tata kelola organisasi modern, dan kepemimpinan bisnis profesional.",
        summaryEn: "Strategic management, enterprise governance, and professional corporate leadership executive training.",
        requirements: [
            "Mahasiswa tingkat akhir atau lulusan baru jurusan Manajemen, Bisnis, Akuntansi, atau Teknik Industri.",
            "Memiliki minat mendalam di bidang konsultansi bisnis, manajemen operasional, dan kepemimpinan.",
            "IPK minimal 3,00 dari perguruan tinggi terakreditasi.",
            "Menulis esai singkat tentang analisis tantangan model bisnis digital saat ini.",
            "Lolos evaluasi studi kasus bisnis kelompok."
        ],
        requirementsEn: [
            "Final-year students or recent graduates in Management, Business, Accounting, or Industrial Engineering.",
            "Deep interest in business consulting, operations strategy, and corporate leadership.",
            "Minimum cumulative GPA of 3.00 from an accredited university.",
            "Submit a short essay evaluating contemporary digital business model transformations.",
            "Pass collaborative business case study assessment."
        ],
        benefits: [
            "Sertifikat kompetensi manajemen resmi dari institusi manajemen pelopor di Indonesia.",
            "Bedah studi kasus nyata dari puluhan perusahaan konglomerasi dan BUMN nasional.",
            "Akses konsultasi karir manajerial bersama konsultan senior PPM Manajemen."
        ],
        benefitsEn: [
            "Accredited management competency credential from Indonesia's pioneer management institution.",
            "Hands-on case study deconstructions from leading conglomerates and state-owned enterprises.",
            "Executive career coaching access with seasoned PPM Management consultants."
        ],
        sourceUrl: "https://www.ppm-manajemen.ac.id/ppm-ppe/",
        demoDays: 2,
    },
    {
        id: "pertamina-young-talent",
        title: "Pertamina Energy Leadership Bootcamp",
        organization: "PT Pertamina (Persero)",
        category: "Bootcamp",
        alsoCategories: ["Beasiswa"],
        recommended: false,
        field: "Teknik",
        targetMajors: ["Teknik Mesin", "Teknik Elektro", "Teknik Kimia", "Teknik Perminyakan", "Teknik Industri"],
        summary: "Program pembekalan intensif transisi energi terbarukan dan inovasi teknologi industri energi masa depan.",
        summaryEn: "Intensive energy transition and renewable energy technology innovation bootcamp for future engineers.",
        requirements: [
            "Mahasiswa aktif S1 semester 6-8 jurusan Teknik Mesin, Kimia, Elektro, Perminyakan, atau Fisika.",
            "IPK minimal 3,25 (skala 4,00) dari perguruan tinggi terakreditasi Unggul.",
            "Memiliki gagasan atau proyek inovasi energi baru terbarukan (EBT).",
            "Mampu berkomunikasi bahasa Inggris teknis secara aktif.",
            "Lolos uji potensi akademik dan wawancara panelis Pertamina Corporate University."
        ],
        requirementsEn: [
            "Active engineering student (semesters 6-8) in Mechanical, Chemical, Electrical, or Petroleum Engineering.",
            "Minimum GPA of 3.25 from premier accredited universities.",
            "Present a renewable energy innovation concept or research capstone outline.",
            "Capable of effective technical verbal and written English communication.",
            "Pass academic potential tests and panel interviews by Pertamina Corporate University."
        ],
        benefits: [
            "Pembekalan langsung dari praktisi kilang energi dan pakar dekarbonisasi internasional.",
            "Kunjungan lapangan eksklusif ke fasilitas instalasi energi baru terbarukan Pertamina.",
            "Jalur fast-track seleksi Bimbingan Profesi Sarjana (BPS) Pertamina."
        ],
        benefitsEn: [
            "Direct insights from energy refinery operators and international decarbonization specialists.",
            "Exclusive site visits to Pertamina's cutting-edge renewable power facilities.",
            "Fast-track assessment priority for Pertamina Graduate Development Program (BPS)."
        ],
        sourceUrl: "https://recruitment.pertamina.com/",
        demoDays: 8,
    },

    // 4. STUDI INDEPENDEN
    {
        id: "msib-dicoding-ai",
        title: "Studi Independen: Pengembang AI & Machine Learning",
        organization: "Dicoding Indonesia & Kampus Merdeka",
        category: "Studi Independen",
        recommended: true,
        field: "Informatika",
        targetMajors: ["Informatika", "Sistem Informasi", "Statistika", "Matematika", "Teknik Komputer"],
        summary: "Program MSIB Kampus Merdeka intensif mempelajari machine learning terapan, computer vision, dan natural language processing.",
        summaryEn: "Certified MSIB independent study mastering applied machine learning, computer vision, and modern NLP architectures.",
        requirements: [
            "Mahasiswa aktif D4/S1 minimal semester 5 di perguruan tinggi di bawah Kemendikbudristek.",
            "Mendapatkan Surat Rekomendasi (SR) dan Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) bermeterai.",
            "Memiliki pemahaman dasar matematika diskrit, aljabar linear, dan pemrograman Python.",
            "Berkomitmen mendedikasikan waktu belajar penuh waktu selama 1 semester (20 SKS).",
            "Lulus asesmen seleksi logika dan matematika dasar pada portal Kampus Merdeka."
        ],
        requirementsEn: [
            "Active undergraduate student (min. 5th semester) registered under Kemendikbudristek.",
            "Hold stamped institutional Recommendation Letters and Responsibility Statements (SPTJM).",
            "Foundational comprehension of linear algebra, calculus, and Python coding basics.",
            "Committed to full-time asynchronous and synchronous participation converting to 20 SKS.",
            "Pass logic and quantitative diagnostics on the Kampus Merdeka national platform."
        ],
        benefits: [
            "Konversi setara 20 SKS penuh diakui resmi di transkrip akademik universitas.",
            "Sertifikasi kompetensi AI berstandar industri dan portofolio capstone beregu.",
            "Bantuan uang saku bulanan resmi (BBH) yang disalurkan oleh Kemendikbudristek RI."
        ],
        benefitsEn: [
            "Full 20 academic credits conversion recorded on official university transcripts.",
            "Industry-vetted AI certification and collaborative real-world capstone portfolio.",
            "Monthly government living allowance (BBH) disbursed directly by Kemendikbudristek."
        ],
        sourceUrl: "https://kampusmerdeka.kemdikbud.go.id/",
        demoDays: 6,
    },
    {
        id: "msib-ruangguru-business",
        title: "Studi Independen: Digital Business & Analytics",
        organization: "Ruangguru & Kampus Merdeka",
        category: "Studi Independen",
        recommended: true,
        field: "Manajemen",
        targetMajors: ["Manajemen", "Akuntansi", "Ekonomi", "Bisnis Digital", "Ilmu Komunikasi"],
        summary: "Pembelajaran komprehensif strategi pertumbuhan bisnis digital, analisis data pasar, dan product operations.",
        summaryEn: "Comprehensive curriculum in digital business expansion strategy, marketplace growth analytics, and product operations.",
        requirements: [
            "Mahasiswa aktif S1 minimal semester 5 dari jurusan Manajemen, Bisnis, Akuntansi, atau bidang relevan.",
            "IPK minimal 3,00 serta surat persetujuan konversi nilai dari ketua program studi.",
            "Kemampuan berpikir kritis dalam membedah studi kasus bisnis dan membaca metrik pertumbuhan.",
            "Aktif dalam diskusi kelompok dan presentasi proposal bisnis di hadapan mentor industri.",
            "Mengunggah berkas administrasi lengkap ke sistem Kampus Merdeka sebelum batas waktu."
        ],
        requirementsEn: [
            "Active student (min. 5th semester) in Business, Management, Economics, or related fields.",
            "Minimum GPA of 3.00 with department head approval letter for full credit conversion.",
            "Critical thinking skills in analyzing case studies and digital product growth metrics.",
            "Active engagement in group project discussions and live executive pitch presentations.",
            "Submit full verified documentation to the national Kampus Merdeka portal."
        ],
        benefits: [
            "Pengakuan konversi akademik 20 SKS mata kuliah semester berjalan.",
            "Penyusunan proyek bisnis riil yang dibimbing oleh VP dan Business Director Ruangguru.",
            "Sertifikat kelulusan berlisensi Kemendikbudristek dan kesempatan magang eksklusif."
        ],
        benefitsEn: [
            "Official 20 credit units (SKS) academic recognition on university study plans.",
            "Complete a real business project under direct guidance from Ruangguru Vice Presidents.",
            "Accredited Ministry completion certificate and exclusive internship access pipelines."
        ],
        sourceUrl: "https://kampusmerdeka.kemdikbud.go.id/",
        demoDays: 9,
    },
    {
        id: "msib-binar-uiux",
        title: "Studi Independen: UI/UX & Product Design Specialist",
        organization: "Binar Academy & Kampus Merdeka",
        category: "Studi Independen",
        recommended: true,
        field: "Desain",
        targetMajors: ["Desain Komunikasi Visual (DKV)", "Sistem Informasi", "Informatika", "Psikologi"],
        summary: "Praktek end-to-end user research, design thinking, prototyping Figma interaktif, dan usability testing.",
        summaryEn: "End-to-end hands-on training in user research, design thinking, interactive Figma prototyping, and usability testing.",
        requirements: [
            "Mahasiswa aktif minimal semester 5 dari perguruan tinggi negeri maupun swasta seluruh Indonesia.",
            "Tertarik pada perancangan antarmuka aplikasi digital dan pengalaman pengguna.",
            "Memiliki laptop dengan kemampuan menjalankan aplikasi peramban dan software desain grafis.",
            "Mendapatkan persetujuan konversi 20 SKS dari universitas asal.",
            "Lulus tes motivasi dan penugasan desain pemecahan masalah sederhana."
        ],
        requirementsEn: [
            "Active undergraduate student (min. 5th semester) from any accredited Indonesian university.",
            "Passionate about digital app interfaces and human-centered design research.",
            "Laptop capable of running modern web browsers and design authoring software smoothly.",
            "University approval for 20 academic credits conversion.",
            "Pass online motivational screening and a simple problem-solving design challenge."
        ],
        benefits: [
            "Konversi setara 20 SKS akademik di semester berjalan.",
            "Portofolio studi kasus UI/UX lengkap dari tahap riset hingga interactive prototype siap kerja.",
            "Sertifikat kompetensi UI/UX Specialist bertaraf nasional dan jejaring hiring partner."
        ],
        benefitsEn: [
            "Full 20 SKS credit conversion recognized by host educational institutions.",
            "Comprehensive UI/UX case study portfolio from user discovery to production-ready prototypes.",
            "Nationally accredited UI/UX Specialist certificate and hiring partner introductions."
        ],
        sourceUrl: "https://www.binaracademy.com/",
        demoDays: 7,
    },
    {
        id: "msib-greatnusa-hr",
        title: "Studi Independen: People Analytics & Strategic HR",
        organization: "GreatNusa by Binus & Kampus Merdeka",
        category: "Studi Independen",
        recommended: true,
        field: "Psikologi",
        targetMajors: ["Psikologi", "Manajemen", "Ilmu Komunikasi", "Hukum"],
        summary: "Kombinasi psikologi industri organisasi, people analytics berbasis data, dan manajemen talenta korporat.",
        summaryEn: "Blending organizational psychology, data-driven people analytics, and corporate talent management.",
        requirements: [
            "Mahasiswa aktif S1 minimal semester 5 jurusan Psikologi, Manajemen SDM, atau serumpun.",
            "IPK minimal 3,00 dengan minat mendalam pada pengembangan organisasi dan sumber daya manusia.",
            "Memahami konsep dasar evaluasi kinerja, talent mapping, dan psikometri dasar.",
            "Surat rekomendasi resmi perguruan tinggi untuk konversi 20 SKS.",
            "Sanggup mengikuti rangkaian pelatihan penuh waktu selama satu semester."
        ],
        requirementsEn: [
            "Active undergraduate (min. 5th semester) in Psychology, HR Management, or related social sciences.",
            "Minimum cumulative GPA of 3.00 with keen interest in organizational behavior.",
            "Basic understanding of performance management frameworks, talent mapping, and psychometrics.",
            "Formal university recommendation letter ensuring 20 credit hours recognition.",
            "Committed to full-time synchronous and team-based semester obligations."
        ],
        benefits: [
            "Pengakuan konversi akademik 20 SKS di pangkalan data pendidikan tinggi.",
            "Kemampuan mengoperasikan dashboard People Analytics untuk pengambilan keputusan HR strategis.",
            "Sertifikat keahlian Human Capital Management berskala nasional."
        ],
        benefitsEn: [
            "20 academic credits conversion acknowledged on university records.",
            "Mastery of People Analytics dashboards for strategic human capital decision making.",
            "Nationally recognized Human Capital Management competency credentials."
        ],
        sourceUrl: "https://greatnusa.com/",
        demoDays: 11,
    },
    {
        id: "msib-schneider-iot",
        title: "Studi Independen: Smart Factory & Industrial IoT",
        organization: "Schneider Electric Indonesia & Kampus Merdeka",
        category: "Studi Independen",
        recommended: true,
        field: "Teknik",
        targetMajors: ["Teknik Elektro", "Teknik Mesin", "Teknik Industri", "Informatika"],
        summary: "Pembelajaran otomatisasi industri 4.0, sensor IoT industri, dan efisiensi manajemen energi pintar pabrik.",
        summaryEn: "Industrial automation 4.0, industrial IoT sensors, and smart factory energy efficiency management.",
        requirements: [
            "Mahasiswa aktif semester 5-7 jurusan Teknik Elektro, Mesin, Mekatronika, atau Teknik Industri.",
            "Memiliki pemahaman dasar rangkaian listrik, PLC dasar, atau komunikasi data mikrokontroler.",
            "IPK minimal 3,20 dari perguruan tinggi dengan program studi terakreditasi.",
            "Mendapatkan persetujuan resmi konversi 20 SKS dari pihak dekanat kampus.",
            "Lulus tes pemahaman teknis elektro dan logika rekayasa."
        ],
        requirementsEn: [
            "Active engineering student (semesters 5-7) in Electrical, Mechanical, Mechatronics, or Industrial Engineering.",
            "Basic grasp of electric circuits, basic PLC ladder logic, or microcontroller communication.",
            "Minimum GPA of 3.20 from an accredited university department.",
            "Official faculty approval letter validating 20 academic credits equivalency.",
            "Pass online electrical engineering diagnostics and technical logic evaluation."
        ],
        benefits: [
            "Konversi penuh 20 SKS mata kuliah semester berjalan.",
            "Sertifikat resmi keahlian otomatisasi industri berskala global dari Schneider Electric.",
            "Kesempatan kunjungan industri ke Smart Factory Schneider Electric di Batam."
        ],
        benefitsEn: [
            "Full 20 academic credits equivalent on university transcripts.",
            "Official global industrial automation certification issued by Schneider Electric.",
            "Exclusive on-site industrial tour to Schneider Electric Smart Factory in Batam."
        ],
        sourceUrl: "https://www.se.com/id/id/",
        demoDays: 13,
    },

    // 5. WORKSHOP
    {
        id: "workshop-docker-k8s",
        title: "Workshop: Hands-on Docker & Kubernetes",
        organization: "Cloud Native Computing Foundation ID",
        category: "Workshop",
        recommended: true,
        field: "Informatika",
        targetMajors: ["Informatika", "Sistem Informasi", "Teknik Komputer"],
        summary: "Workshop praktis mengemas aplikasi ke container Docker dan orkestrasi cluster Kubernetes skala produksi.",
        summaryEn: "Hands-on workshop packaging microservices into Docker containers and orchestrating Kubernetes clusters.",
        requirements: [
            "Mahasiswa jurusan komputer atau pengembang yang memahami command line Linux dasar.",
            "Membawa laptop pribadi dengan sistem operasi Linux, macOS, atau Windows 11 (WSL2 aktif).",
            "Telah memasang Docker Desktop dan Git pada laptop sebelum sesi dimulai.",
            "Memiliki akun GitHub aktif untuk melakukan clone repository materi workshop.",
            "Terdaftar dan telah melakukan registrasi pada tautan resmi komunitas CNCF ID."
        ],
        requirementsEn: [
            "Computer science students or developers familiar with basic Linux command line.",
            "Personal laptop running Linux, macOS, or Windows 11 with WSL2 enabled.",
            "Pre-installed Docker Desktop and Git prior to workshop commencement.",
            "Active GitHub account for cloning workshop practice repositories.",
            "Registered via the official CNCF Indonesia chapter community portal."
        ],
        benefits: [
            "Akses lab cloud computing gratis selama 7 hari untuk latihan orkestrasi cluster.",
            "E-certificate of completion berlisensi CNCF Student Community.",
            "Source code template siap pakai untuk deployment aplikasi tugas akhir."
        ],
        benefitsEn: [
            "Free 7-day cloud sandbox lab access for live cluster deployment drills.",
            "Official e-certificate endorsed by CNCF Student Community Chapter.",
            "Production-ready deployment manifest templates for academic and capstone projects."
        ],
        sourceUrl: "https://community.cncf.io/indonesia/",
        demoDays: 3,
    },
    {
        id: "workshop-financial-modeling",
        title: "Workshop: Financial Modeling & Valuation Masterclass",
        organization: "CFA Society Indonesia & PPM",
        category: "Workshop",
        recommended: true,
        field: "Manajemen",
        targetMajors: ["Akuntansi", "Manajemen", "Ekonomi", "Bisnis"],
        summary: "Workshop simulasi pembuatan model proyeksi laba rugi, valuasi DCF, dan analisis kelayakan investasi merger.",
        summaryEn: "Financial modeling masterclass simulating cash flow projections, DCF corporate valuations, and M&A feasibility.",
        requirements: [
            "Mahasiswa aktif jurusan Akuntansi, Manajemen Keuangan, atau Ekonomi Pembangunan.",
            "Memiliki pemahaman dasar membaca Laporan Keuangan (Neraca, Laba Rugi, Arus Kas).",
            "Membawa laptop pribadi dengan aplikasi Microsoft Excel (versi 2016 ke atas terpasang).",
            "Melampirkan kartu tanda mahasiswa aktif pada formulir pendaftaran.",
            "Menyelesaikan lembar pra-tugas analisis rasio keuangan sebelum workshop."
        ],
        requirementsEn: [
            "Active students in Accounting, Financial Management, or Economics.",
            "Foundational capability in reading balance sheets, income statements, and cash flows.",
            "Laptop equipped with Microsoft Excel (version 2016 or newer installed).",
            "Valid student ID uploaded during workshop ticket registration.",
            "Complete a pre-workshop financial ratio calculation assignment."
        ],
        benefits: [
            "Template spreadsheet financial model standar investment banking institusional.",
            "Sertifikat keikutsertaan resmi yang diterbitkan oleh CFA Society Indonesia.",
            "Networking eksklusif dengan charterholder CFA dan praktisi analis ekuitas ternama."
        ],
        benefitsEn: [
            "Institutional investment-grade Excel financial modeling master templates.",
            "Official certificate of participation issued by CFA Society Indonesia.",
            "Direct networking opportunities with CFA charterholders and senior equity research analysts."
        ],
        sourceUrl: "https://www.cfasociety.org/indonesia/",
        demoDays: 4,
    },
    {
        id: "workshop-adobe-illustrator",
        title: "Workshop: Visual Branding & Typography Specialist",
        organization: "Asosiasi Desainer Grafis Indonesia (ADGI)",
        category: "Workshop",
        recommended: true,
        field: "Desain",
        targetMajors: ["Desain Komunikasi Visual (DKV)", "Desain Grafis", "Multimedia", "Arsitektur"],
        summary: "Eksplorasi pembuatan manual identitas visual merek, hierarki tipografi modern, dan vector craftmanship di Adobe Illustrator.",
        summaryEn: "Hands-on exploration in brand visual identity guidelines, modern typography hierarchy, and vector precision.",
        requirements: [
            "Mahasiswa jurusan DKV, Desain Produk, atau peminat desain grafis tingkat pemula-menengah.",
            "Membawa laptop dengan software Adobe Illustrator terpasang (Creative Cloud).",
            "Membawa mouse atau drawing pen tablet untuk pengerjaan detail vektor.",
            "Mengunggah satu karya desain buatan sendiri sebagai bahan kurasi sesi workshop.",
            "Berkomitmen hadir tepat waktu selama 2 hari penyelenggaraan workshop intensif."
        ],
        requirementsEn: [
            "Students in Graphic Design, DKV, Industrial Design, or intermediate creative practitioners.",
            "Laptop with active Adobe Illustrator Creative Cloud installation.",
            "Computer mouse or digital graphics tablet for precision bezier pen tool exercises.",
            "Upload one original design work for personalized critique during the masterclass.",
            "Committed to 100% attendance across the intensive 2-day live workshop schedule."
        ],
        benefits: [
            "Bedah portfolio dan kurasi karya langsung oleh desainer principal anggota kehormatan ADGI.",
            "Paket aset font komersial gratis dan palet warna terkurasi untuk proyek desain.",
            "Sertifikat pelatihan desain berskala profesional."
        ],
        benefitsEn: [
            "Live portfolio review and direct design critique from principal designers of ADGI.",
            "Curated commercial font licenses and professional brand palette design starter kits.",
            "Official professional development certificate endorsed by ADGI."
        ],
        sourceUrl: "https://adgi.or.id/",
        demoDays: 5,
    },
    {
        id: "workshop-riset-klinis",
        title: "Workshop: Metodologi Riset Medis & Publikasi Scopus",
        organization: "Ikatan Dokter Indonesia (IDI) & Medika",
        category: "Workshop",
        recommended: true,
        field: "Kesehatan",
        targetMajors: ["Kedokteran", "Farmasi", "Kesehatan Masyarakat", "Keperawatan"],
        summary: "Panduan praktis perancangan uji klinis, telaah kritis jurnal internasional, dan penulisan manuskrip standar Scopus.",
        summaryEn: "Practical guide to clinical trial design, critical appraisal, and medical manuscript preparation for Scopus journals.",
        requirements: [
            "Mahasiswa Fakultas Kedokteran (sarjana atau koas) atau mahasiswa rumpun kesehatan tingkat akhir.",
            "Memahami konsep dasar metodologi penelitian dan biostatistik kesehatan.",
            "Membawa draf proposal penelitian atau skripsi bagi yang sedang menyusun tugas akhir.",
            "Memiliki laptop untuk praktik software referensi (Mendeley/Zotero) dan SPSS/Stata.",
            "Mendaftarkan diri melalui portal resmi sekretariat PB IDI."
        ],
        requirementsEn: [
            "Medical students (pre-clinical or clinical clerks) or healthcare undergraduate seniors.",
            "Familiar with basic clinical research methodology and medical biostatistics.",
            "Bring thesis proposals or rough research manuscripts for live hands-on drafting.",
            "Laptop with reference managers (Mendeley/Zotero) and statistical software ready.",
            "Register through the official Indonesian Medical Association (IDI) portal."
        ],
        benefits: [
            "Poin Satuan Kredit Partisipasi (SKP) resmi dari Ikatan Dokter Indonesia.",
            "Template penulisan manuskrip jurnal internasional berstandar Q1/Q2 Scopus.",
            "Mentoring penulisan langsung bersama editor jurnal kedokteran terindeks internasional."
        ],
        benefitsEn: [
            "Official continuing professional education credits (SKP) accredited by IDI.",
            "Standardized manuscript submission templates for high-impact Q1/Q2 Scopus journals.",
            "Live writing clinic feedback from chief editors of indexed international medical journals."
        ],
        sourceUrl: "https://idionline.org/",
        demoDays: 6,
    },
    {
        id: "workshop-public-speaking",
        title: "Workshop: Executive Presentation & Public Speaking",
        organization: "Toastmasters International ID & Perhumas",
        category: "Workshop",
        recommended: true,
        field: "Komunikasi",
        targetMajors: ["Semua Jurusan", "Ilmu Komunikasi", "Manajemen", "Hukum"],
        summary: "Pelatihan teknik vokal, bahasa tubuh, retorika persuasi, dan cara menyajikan presentasi berbobot di depan publik.",
        summaryEn: "Vocal coaching, confident body language, persuasive rhetoric, and dynamic public keynote presentation training.",
        requirements: [
            "Mahasiswa aktif dari seluruh jurusan yang ingin meningkatkan rasa percaya diri berbicara di depan umum.",
            "Bersedia tampil melakukan praktik pidato singkat 3 menit di depan kelas workshop.",
            "Berpakaian rapi formal atau smart casual selama sesi berlangsung.",
            "Membawa materi presentasi 3 slide bebas sebagai bahan latihan simulasi panggung.",
            "Melakukan konfirmasi kehadiran paling lambat 2 hari sebelum acara."
        ],
        requirementsEn: [
            "Active students from all disciplines seeking to elevate stage presence and public speaking confidence.",
            "Willing to deliver a 3-minute impromptu presentation live in front of the workshop cohort.",
            "Dress code: neat formal or polished smart casual throughout the practical session.",
            "Prepare 3 presentation slides on any topic for on-stage vocal projection drills.",
            "Confirm seat reservation at least 2 days prior to the live workshop."
        ],
        benefits: [
            "Rekaman video penampilan personal beserta lembar evaluasi mendalam dari juri Toastmasters.",
            "Modul teknik persuasi elevator pitch untuk wawancara kerja dan kompetisi bisnis.",
            "Sertifikat workshop resmi kredensial kehumasan profesional."
        ],
        benefitsEn: [
            "Personalized high-definition stage recording accompanied by comprehensive evaluation rubrics.",
            "Elevator pitch framework toolkit for job interviews and competitive business presentations.",
            "Official communications workshop certificate accredited by Toastmasters and Perhumas."
        ],
        sourceUrl: "https://www.toastmasters.org/",
        demoDays: 4,
    },
    {
        id: "workshop-bim-revit",
        title: "Workshop: Autodesk Revit Building Information Modeling",
        organization: "Himpunan Ahli Konstruksi Indonesia (HAKI)",
        category: "Workshop",
        recommended: true,
        field: "Teknik",
        targetMajors: ["Teknik Sipil", "Arsitektur", "Manajemen Konstruksi"],
        summary: "Pemodelan struktur gedung bertingkat 3D, deteksi clash antardisiplin, dan ekspor bill of quantities berbasis BIM.",
        summaryEn: "3D multistory structural modeling, interdisciplinary clash detection, and BIM-driven bill of quantities takeoff.",
        requirements: [
            "Mahasiswa jurusan Teknik Sipil atau Arsitektur minimal semester 4.",
            "Membawa laptop dengan spesifikasi GPU diskrit dan terpasang Autodesk Revit (student license).",
            "Memahami dasar pembacaan gambar kerja struktur beton dan baja.",
            "Melampirkan kartu tanda mahasiswa aktif.",
            "Mengikuti pre-test pemahaman pemodelan koordinat bangunan."
        ],
        requirementsEn: [
            "Civil Engineering or Architecture students currently in at least the 4th semester.",
            "Laptop with dedicated graphics card and active Autodesk Revit educational license installed.",
            "Solid grasp of reading structural concrete and steel fabrication shop drawings.",
            "Upload valid active student identification card.",
            "Complete online diagnostic pre-test on building coordinate systems."
        ],
        benefits: [
            "Sertifikat pelatihan BIM bersertifikasi HAKI yang diakui kontraktor BUMN.",
            "Koleksi parameter library struktur dan material konstruksi SNI.",
            "Akses video rekaman tutorial praktik modeling selama 6 bulan."
        ],
        benefitsEn: [
            "HAKI-endorsed BIM practical training certificate recognized by top national contractors.",
            "Comprehensive library of structural components calibrated to Indonesian National Standards (SNI).",
            "6-month on-demand access to video tutorial walkthroughs and sample project files."
        ],
        sourceUrl: "https://haki.or.id/",
        demoDays: 7,
    },

    // 6. SEMINAR / WEBINAR
    {
        id: "webinar-cyber-law",
        title: "Webinar Nasional: UU PDP & Tantangan Hukum Siber AI",
        organization: "Fakultas Hukum Universitas Indonesia & Cyber Law ID",
        category: "Seminar / Webinar",
        recommended: true,
        field: "Hukum",
        targetMajors: ["Hukum", "Ilmu Hukum", "Sistem Informasi", "Ilmu Komunikasi"],
        summary: "Analisis kepatuhan perlindungan data pribadi, tanggung jawab hukum algoritma AI, dan mitigasi kejahatan siber.",
        summaryEn: "Analyzing personal data protection compliance, legal liability of autonomous AI, and cyber crime mitigation.",
        requirements: [
            "Terbuka bagi mahasiswa hukum, praktisi IT, pemerhati privasi data, dan masyarakat umum.",
            "Mendaftarkan diri secara daring melalui formulir webinar Zoom.",
            "Mengikuti seluruh sesi paparan narasumber dari Kementerian Komdigi dan akademisi FH UI.",
            "Mengisi kuesioner evaluasi dan presensi daring pada akhir acara.",
            "Memiliki koneksi internet stabil untuk streaming Zoom meeting."
        ],
        requirementsEn: [
            "Open to law students, IT practitioners, data privacy enthusiasts, and the general public.",
            "Register online via official Zoom webinar registration link.",
            "Attend full keynote addresses presented by Ministry officials and university law professors.",
            "Submit online evaluation feedback form and attendance confirmation at the event conclusion.",
            "Stable broadband internet connection for interactive live video conference."
        ],
        benefits: [
            "E-Sertifikat Nasional berbobot 4 Jam Pelajaran (JP) dengan nomor registrasi resmi.",
            "Materi slide presentasi eksklusif mengenai panduan audit kepatuhan UU PDP perusahaan.",
            "Kesempatan tanya jawab langsung bersama staf ahli kementerian dan konsultan hukum korporat."
        ],
        benefitsEn: [
            "Nationally accredited e-certificate verified with individual verifiable credential IDs.",
            "Exclusive slide decks on enterprise personal data protection compliance audit checklists.",
            "Direct Q&A opportunity with senior ministerial legal advisers and corporate tech counsels."
        ],
        sourceUrl: "https://law.ui.ac.id/",
        demoDays: 2,
    },
    {
        id: "webinar-investasi-ojk",
        title: "Webinar: Cerdas Berinvestasi & Karir di Pasar Modal",
        organization: "Otoritas Jasa Keuangan (OJK) & Bursa Efek Indonesia",
        category: "Seminar / Webinar",
        recommended: true,
        field: "Manajemen",
        targetMajors: ["Semua Jurusan", "Manajemen", "Akuntansi", "Ekonomi"],
        summary: "Edukasi literasi keuangan mahasiswa, pengenalan instrumen investasi legal, dan prospek karir di industri sekuritas.",
        summaryEn: "Student financial literacy education, legitimate investment instruments, and securities industry career paths.",
        requirements: [
            "Mahasiswa dari seluruh jenjang pendidikan dan jurusan di seluruh Indonesia.",
            "Melakukan pendaftaran melalui portal resmi Sekolah Pasar Modal (SPM) BEI.",
            "Memiliki kemauan untuk belajar mengelola keuangan pribadi secara sehat sejak bangku kuliah.",
            "Hadir di ruang seminar virtual 15 menit sebelum acara dimulai.",
            "Mengikuti kuis interaktif di akhir sesi pemaparan narasumber."
        ],
        requirementsEn: [
            "Undergraduate students from all disciplines across Indonesia.",
            "Register through the official IDX Capital Market School (SPM) portal.",
            "Committed to mastering personal budgeting, healthy savings, and legitimate equity investing.",
            "Join the virtual webinar room 15 minutes before scheduled opening remarks.",
            "Participate in the interactive quiz competition concluding the presentation session."
        ],
        benefits: [
            "E-Sertifikat Literasi Keuangan resmi dari Otoritas Jasa Keuangan (OJK).",
            "Pembukaan rekening efek saham gratis dengan modal investasi awal Rp100.000 bagi peserta terpilih.",
            "Buku panduan digital strategi investasi saham untuk pemula."
        ],
        benefitsEn: [
            "Official financial literacy e-certificate endorsed by the Financial Services Authority (OJK).",
            "Free brokerage account opening with complimentary IDR 100,000 seed balance for top attendees.",
            "Digital comprehensive handbook on value investing and stock screening for college students."
        ],
        sourceUrl: "https://www.idx.co.id/",
        demoDays: 5,
    },
    {
        id: "webinar-tren-media-ai",
        title: "Webinar: Transformasi AI dalam Jurnalisme & Media",
        organization: "Aliansi Jurnalis Independen (AJI) Indonesia",
        category: "Seminar / Webinar",
        recommended: true,
        field: "Komunikasi",
        targetMajors: ["Ilmu Komunikasi", "Jurnalistik", "Hubungan Internasional", "Sastra"],
        summary: "Menelaah etika penggunaan generative AI di ruang redaksi media, verifikasi misinformasi digital, dan masa depan jurnalisme.",
        summaryEn: "Examining generative AI ethics in newsrooms, digital misinformation fact-checking, and the future of journalism.",
        requirements: [
            "Mahasiswa Ilmu Komunikasi, Jurnalistik, Hubungan Masyarakat, atau pengelola media kampus.",
            "Mendaftarkan diri pada formulir registrasi daring AJI Indonesia.",
            "Tertarik pada isu kebebasan pers, etika peliputan berita digital, dan algoritma kecerdasan buatan.",
            "Mengikuti jalannya diskusi panel secara tertib di kanal konferensi video.",
            "Mengisi formulir umpan balik pascaacara."
        ],
        requirementsEn: [
            "Students in Communications, Journalism, Public Relations, or campus editorial board members.",
            "Complete online registration via AJI Indonesia official portal.",
            "Interested in press freedom, digital reporting ethics, and AI-driven news generation.",
            "Participate actively in panel discussions via the video conferencing platform.",
            "Complete post-event evaluation questionnaire."
        ],
        benefits: [
            "E-Sertifikat kepesertaan webinar dari Aliansi Jurnalis Independen Indonesia.",
            "Buku saku digital Panduan Etika Jurnalisme AI dan Verifikasi Berita Hoaks.",
            "Akses bergabung dalam kelompok kerja jurnalis mahasiswa AJI Muda Nasional."
        ],
        benefitsEn: [
            "Official certificate of participation issued by AJI Indonesia.",
            "Digital handbook on AI journalism ethics and digital media verification tools.",
            "Direct membership opportunity in the national AJI Youth student journalist network."
        ],
        sourceUrl: "https://aji.or.id/",
        demoDays: 8,
    },
    {
        id: "webinar-telemedicine",
        title: "Webinar: Transformasi Digital Kesehatan & Telemedicine",
        organization: "Kementerian Kesehatan RI & IDI",
        category: "Seminar / Webinar",
        recommended: true,
        field: "Kesehatan",
        targetMajors: ["Kedokteran", "Kesehatan Masyarakat", "Farmasi", "Sistem Informasi"],
        summary: "Perkembangan platform konsultasi medis daring, rekam medis elektronik terintegrasi SatuSehat, dan etika klinis digital.",
        summaryEn: "Advancements in digital consultation platforms, SatuSehat integrated electronic medical records, and digital bioethics.",
        requirements: [
            "Mahasiswa kedokteran, farmasi, keperawatan, dan pengembang teknologi kesehatan.",
            "Melakukan pendaftaran akun di platform pembelajaran Kemenkes Plataran Sehat.",
            "Mengikuti seluruh materi dari narasumber Pusat Data dan Teknologi Informasi Kemenkes RI.",
            "Menyelesaikan post-test kelulusan materi dengan skor minimum 70.",
            "Memiliki Nomor Induk Kependudukan (NIK) terdaftar untuk penerbitan sertifikat Kemenkes."
        ],
        requirementsEn: [
            "Medical, pharmacy, nursing students, and digital health technology innovators.",
            "Register on the Ministry of Health Plataran Sehat continuous learning portal.",
            "Complete all webinar lecture units delivered by Ministry Data and Information Center directors.",
            "Attain at least 70% passing grade on the post-webinar comprehension assessment.",
            "Valid national identity number (NIK) for official verified health credentials."
        ],
        benefits: [
            "Sertifikat resmi terakreditasi Kemenkes RI berbobot Satuan Kredit Profesi (SKP).",
            "Materi pemaparan arsitektur integrasi sistem SatuSehat standar HL7 FHIR.",
            "Wawasan peluang riset dan startup bidang health-tech di Indonesia."
        ],
        benefitsEn: [
            "Official Ministry of Health accredited certificate granting professional development points (SKP).",
            "Technical documentation slides detailing HL7 FHIR architecture on SatuSehat platforms.",
            "Deep strategic insights into health-tech venture creation and medical informatics research."
        ],
        sourceUrl: "https://kemkes.go.id/",
        demoDays: 6,
    },
    {
        id: "webinar-ielts-global",
        title: "Webinar: Tembus IELTS Band 7.5 & Beasiswa Global",
        organization: "British Council Indonesia & Mata Garuda LPDP",
        category: "Seminar / Webinar",
        recommended: true,
        field: "Umum",
        targetMajors: ["Semua Jurusan"],
        summary: "Strategi komprehensif menguasai modul IELTS Academic (Listening, Reading, Writing, Speaking) dan tips lolos seleksi beasiswa dunia.",
        summaryEn: "Comprehensive strategies mastering IELTS Academic modules and winning world-class postgraduate scholarships.",
        requirements: [
            "Mahasiswa dari seluruh jenjang dan jurusan yang berencana melanjutkan studi ke luar negeri.",
            "Melakukan registrasi online melalui tautan resmi British Council Indonesia.",
            "Menyiapkan alat tulis dan catatan selama pembedahan contoh soal esai Writing Task 2.",
            "Mengikuti sesi simulasi latihan listening interaktif.",
            "Mengisi daftar hadir resmi saat webinar berlangsung."
        ],
        requirementsEn: [
            "Undergraduate and postgraduate students planning study abroad pursuits.",
            "Register online via official British Council Indonesia event landing page.",
            "Pen and paper ready for dissecting sample band 8.0 Writing Task 2 essays.",
            "Participate actively in live interactive listening drill segments.",
            "Confirm real-time digital attendance during the streaming broadcast."
        ],
        benefits: [
            "E-Sertifikat partisipasi resmi dari British Council Indonesia.",
            "Akses latihan simulasi tes IELTS daring gratis selama 30 hari (Road to IELTS).",
            "Kumpulan contoh esai lolos beasiswa LPDP, Chevening, dan Fulbright dari para awardee."
        ],
        benefitsEn: [
            "Official certificate of participation issued by British Council Indonesia.",
            "Complimentary 30-day access to Road to IELTS full practice portal.",
            "Compendium of real winning scholarship personal statements (LPDP, Chevening, and Fulbright)."
        ],
        sourceUrl: "https://www.britishcouncil.id/",
        demoDays: 9,
    },

    // 7. KOMPETISI
    {
        id: "kompetisi-gemastik",
        title: "GEMASTIK XVII: Pagelaran Mahasiswa Nasional TIK",
        organization: "Puspresnas Kemendikbudristek RI",
        category: "Kompetisi",
        recommended: true,
        field: "Informatika",
        targetMajors: ["Informatika", "Sistem Informasi", "Teknik Komputer", "Desain Komunikasi Visual (DKV)"],
        summary: "Kompetisi TIK mahasiswa paling bergengsi tingkat nasional yang mempertandingkan 11 divisi teknologi dan pengembangan sistem.",
        summaryEn: "Indonesia's premier national student ICT competition featuring 11 technology and system development divisions.",
        requirements: [
            "Mahasiswa aktif program diploma atau sarjana yang terdaftar resmi di PDDikti.",
            "Membentuk tim beranggotakan 3 orang dari perguruan tinggi yang sama.",
            "Mendapatkan surat pengesahan resmi dari pimpinan perguruan tinggi bidang kemahasiswaan.",
            "Mengunggah proposal karya, tautan video demonstrasi, atau kode sumber sesuai divisi lomba.",
            "Tidak pernah menjadi juara 1 pada divisi lomba yang sama di penyelenggaraan GEMASTIK sebelumnya."
        ],
        requirementsEn: [
            "Active undergraduate or diploma students verified in official PDDikti records.",
            "Form a dedicated team of 3 students from the same university institution.",
            "Official endorsement letter issued by university student affairs vice rector.",
            "Upload project proposal, video demo links, and source code according to division guidelines.",
            "Have not previously won 1st prize in the exact same contest division in earlier years."
        ],
        benefits: [
            "Medali resmi Kemendikbudristek, piala bergilir, dan sertifikat prestasi pencatatan SIMKATMAWA.",
            "Total hadiah uang pembinaan ratusan juta rupiah bagi para pemenang.",
            "Akses langsung program rekrutmen talenta teknologi unggulan nasional."
        ],
        benefitsEn: [
            "Official Ministry medals, prestigious rolling trophy, and verified national SIMKATMAWA achievement records.",
            "Substantial development cash prize pool distributed across all podium winners.",
            "Direct recruitment pipeline into premier national technology talent networks."
        ],
        sourceUrl: "https://pusatprestasinasional.kemdikbud.go.id/",
        demoDays: 14,
    },
    {
        id: "kompetisi-bcc-ui",
        title: "National Business Case Competition",
        organization: "Management Student Society FEB UI",
        category: "Kompetisi",
        recommended: true,
        field: "Manajemen",
        targetMajors: ["Manajemen", "Bisnis", "Akuntansi", "Ekonomi", "Teknik Industri"],
        summary: "Kompetisi penyelesaian kasus bisnis korporat nyata di hadapan dewan juri konsultan manajemen dan eksekutif industri.",
        summaryEn: "Prestigious national business case challenge resolving real corporate dilemmas before industry executive panels.",
        requirements: [
            "Mahasiswa aktif S1 atau diploma dari perguruan tinggi di seluruh Indonesia.",
            "Satu tim terdiri dari 3 orang mahasiswa (diperbolehkan lintas jurusan dalam satu kampus).",
            "Mengunggah executive summary pemecahan kasus bisnis tahap penyisihan.",
            "Mempresentasikan strategi solusi bisnis dalam bahasa Inggris pada babak final.",
            "Melampirkan kartu tanda mahasiswa aktif dan bukti pembayaran registrasi tim."
        ],
        requirementsEn: [
            "Active undergraduate or diploma students from any Indonesian university.",
            "Teams of 3 students (interdisciplinary members from the same campus allowed).",
            "Submit structured executive summary resolving the preliminary business case brief.",
            "Deliver a live analytical business pitch in English during the national final round.",
            "Attach active student ID cards and official team registration credentials."
        ],
        benefits: [
            "Hadiah uang tunai bernilai puluhan juta rupiah dan piala bergengsi FEB UI.",
            "Sertifikat prestasi tingkat nasional untuk portofolio Management Trainee.",
            "Kesempatan wawancara magang langsung di perusahaan sponsor utama kasus."
        ],
        benefitsEn: [
            "Cash awards worth tens of millions of rupiah and prestigious FEB UI challenge trophies.",
            "Nationally accredited award certificates ideal for competitive Management Trainee resumes.",
            "Direct internship interview opportunities with the headline corporate case sponsor."
        ],
        sourceUrl: "https://feb.ui.ac.id/",
        demoDays: 12,
    },
    {
        id: "kompetisi-moot-court",
        title: "National Moot Court Competition Piala Mahkamah Agung",
        organization: "Mahkamah Agung RI & ALSA Indonesia",
        category: "Kompetisi",
        recommended: true,
        field: "Hukum",
        targetMajors: ["Hukum", "Ilmu Hukum"],
        summary: "Kompetisi peradilan semu hukum pidana dan perdata tingkat nasional memperebutkan Piala Bergilir Mahkamah Agung RI.",
        summaryEn: "Premier national moot court trial competition competing for the Supreme Court Justice rotating trophy.",
        requirements: [
            "Mahasiswa aktif Fakultas Hukum dari perguruan tinggi negeri maupun swasta se-Indonesia.",
            "Mendelegasikan satu kontingen resmi kampus yang terdiri dari majelis hakim, penuntut umum, penasihat hukum, dan panitera.",
            "Menyusun berkas perkara hukum otentik (surat dakwaan, eksepsi, replik, duplik, putusan).",
            "Memperagakan persidangan simulasi peradilan semu di hadapan dewan juri hakim agung dan jaksa senior.",
            "Mendapat surat mandat resmi dari dekan fakultas hukum kampus pengirim."
        ],
        requirementsEn: [
            "Active law students from public or private faculties of law nationwide.",
            "Deploy an official institutional delegation comprising judges, prosecutors, defense counsels, and clerks.",
            "Draft authentic case dossiers (indictments, motions, closing arguments, and formal verdicts).",
            "Enact full procedural court trials before panels of real Supreme Court judges and senior prosecutors.",
            "Hold a formal delegation mandate letter signed by the faculty dean."
        ],
        benefits: [
            "Piala Bergilir Ketua Mahkamah Agung RI dan piagam kejuaraan nasional.",
            "Pengakuan bergengsi tinggi di kalangan firma hukum (law firm) terkemuka di Indonesia.",
            "Hadiah pembinaan delegasi dan piagam penghargaan advokat muda terbaik."
        ],
        benefitsEn: [
            "Prestigious rotating trophy from the Chief Justice of the Supreme Court and national honors.",
            "High distinction recognized across top-tier corporate litigation law firms in Indonesia.",
            "Delegation development grants and individual best oralist and advocate awards."
        ],
        sourceUrl: "https://mahkamahagung.go.id/",
        demoDays: 15,
    },
    {
        id: "kompetisi-compfest-uiux",
        title: "COMPFEST UI/UX Design Challenge",
        organization: "Fakultas Ilmu Komputer Universitas Indonesia",
        category: "Kompetisi",
        recommended: true,
        field: "Desain",
        targetMajors: ["Desain Komunikasi Visual (DKV)", "Informatika", "Sistem Informasi", "Semua Jurusan"],
        summary: "Kompetisi desain produk digital dan user experience bergengsi untuk memecahkan permasalahan sosial perkotaan.",
        summaryEn: "Prestigious digital product and UX design challenge solving critical urban community problems.",
        requirements: [
            "Mahasiswa aktif jenjang D3/D4/S1 di seluruh perguruan tinggi di Indonesia.",
            "Tim terdiri dari 2 hingga 3 orang mahasiswa.",
            "Menyusun laporan proses design thinking lengkap dari empati, perumusan persona, hingga user journey map.",
            "Membuat prototype Figma interaktif dengan interaksi mikro dan desain responsif.",
            "Mengunggah portofolio desain dan video presentasi solusi produk."
        ],
        requirementsEn: [
            "Active undergraduate or diploma students enrolled in any Indonesian tertiary institution.",
            "Teams consisting of 2 to 3 collaborative members.",
            "Submit comprehensive design thinking report from empathy research to user journey maps.",
            "Build an interactive high-fidelity Figma prototype complete with micro-interactions.",
            "Upload design system portfolio sheets and a concise solution walkthrough video."
        ],
        benefits: [
            "Total hadiah tunai puluhan juta rupiah dan plakat penghargaan COMPFEST UI.",
            "Sesi review desain mendalam bersama Product Design Lead dari startup unicorn Indonesia.",
            "Peluang magang langsung di tim produk digital perusahaan sponsor kompetisi."
        ],
        benefitsEn: [
            "Substantial cash prize pool and official COMPFEST award plaques.",
            "Comprehensive live design critique by Product Design Leads from Southeast Asian tech unicorns.",
            "Direct internship opportunities within digital product teams of event sponsors."
        ],
        sourceUrl: "https://compfest.id/",
        demoDays: 9,
    },
    {
        id: "kompetisi-kji-puspresnas",
        title: "Kompetisi Jembatan Indonesia (KJI) & Bangunan Gedung",
        organization: "Balai Pengembangan Talenta Indonesia Kemendikbudristek",
        category: "Kompetisi",
        recommended: true,
        field: "Teknik",
        targetMajors: ["Teknik Sipil", "Arsitektur", "Teknik Mesin"],
        summary: "Ajang unjuk kemampuan perancangan, analisis kekuatan struktur, dan perakitan model jembatan rangka baja presisi tinggi.",
        summaryEn: "Engineering showcase evaluating structural optimization, load-bearing efficiency, and rapid bridge assembly.",
        requirements: [
            "Mahasiswa aktif S1 atau D4 program studi Teknik Sipil atau Arsitektur.",
            "Membentuk tim perancang jembatan beranggotakan 3 mahasiswa dan 1 dosen pembimbing.",
            "Menyerahkan proposal desain lengkap dengan simulasi beban struktur (SAP2000/Midas Civil).",
            "Bagi tim finalis, wajib melakukan perakitan model fisik jembatan di arena kompetisi sesuai batas waktu.",
            "Surat penugasan resmi dari pimpinan perguruan tinggi."
        ],
        requirementsEn: [
            "Active undergraduate students in Civil Engineering or Architecture disciplines.",
            "Form an engineering design team of 3 students supervised by 1 faculty mentor.",
            "Submit structural calculation proposals including finite element load analysis models.",
            "Finalist teams must execute live physical scale-model bridge assembly within strict time limits.",
            "Hold formal institutional delegation appointment letters from university management."
        ],
        benefits: [
            "Piala Bergilir KJI Kemendikbudristek dan medali kejuaraan nasional rekayasa sipil.",
            "Pengakuan prestasi di sistem Pusat Prestasi Nasional untuk beasiswa lanjutan.",
            "Bantuan dana fabrikasi model dan hadiah uang pembinaan tim juara."
        ],
        benefitsEn: [
            "Prestigious rotating Kemendikbudristek Trophy and national engineering championship medals.",
            "Official achievement credential registered with Puspresnas for postgraduate funding advantages.",
            "Model fabrication reimbursement allowances and substantial team cash prizes."
        ],
        sourceUrl: "https://bpti.kemdikbud.go.id/",
        demoDays: 16,
    },
    {
        id: "kompetisi-pimnas-pkm",
        title: "Program Kreativitas Mahasiswa (PKM) & PIMNAS",
        organization: "Ditjen Diktiristek Kemendikbudristek RI",
        category: "Kompetisi",
        recommended: true,
        field: "Umum",
        targetMajors: ["Semua Jurusan"],
        summary: "Ajang puncak kompetisi ilmiah mahasiswa Indonesia terbesar yang mendanai riset eksakta, sosial humaniora, kewirausahaan, dan karsa cipta.",
        summaryEn: "Indonesia's largest national student scientific innovation competition funding research, social humanities, and tech prototypes.",
        requirements: [
            "Mahasiswa aktif program diploma atau sarjana perguruan tinggi di lingkungan Kemendikbudristek.",
            "Membentuk tim 3-5 mahasiswa dengan keanggotaan lintas angkatan atau lintas program studi.",
            "Menyusun proposal ilmiah sesuai pedoman resmi PKM (Riset, Kewirausahaan, Pengabdian, Karsa Cipta).",
            "Mendapatkan persetujuan dosen pendamping dan pengesahan pimpinan perguruan tinggi di SIMBELMAWA.",
            "Lolos seleksi pendanaan nasional dan penilaian kemajuan pelaksanaan PKM (PKP2)."
        ],
        requirementsEn: [
            "Active vocational or undergraduate student enrolled in Kemendikbudristek affiliated institutions.",
            "Form collaborative teams of 3 to 5 students with interdisciplinary memberships strongly encouraged.",
            "Author scientific research proposals following official guidelines (STEM, Social, Venture, Prototype).",
            "Attain faculty advisor endorsement and university leadership validation on SIMBELMAWA.",
            "Win national government execution funding and successfully pass mid-term progress reviews."
        ],
        benefits: [
            "Pendanaan hibah pelaksanaan proyek riset hingga Rp10.000.000 per judul yang lolos.",
            "Tiket berlaga di Pekan Ilmiah Mahasiswa Nasional (PIMNAS) memperebutkan Piala Adhidaya Kertawidya.",
            "Ekuivalensi pembebasan skripsi/tugas akhir di sebagian besar perguruan tinggi di Indonesia."
        ],
        benefitsEn: [
            "Direct government research and project execution grant funding up to IDR 10,000,000 per project.",
            "Official ticket to compete at PIMNAS for the prestigious Adhidaya Kertawidya national trophy.",
            "Undergraduate thesis or capstone project exemption equivalency across most major Indonesian universities."
        ],
        sourceUrl: "https://simbelmawa.kemdikbud.go.id/",
        demoDays: 20,
    },
];

export function isOpportunityRecommended(opportunity, userMajor) {
    if (!userMajor || typeof userMajor !== "string" || userMajor.trim() === "") {
        return opportunity.recommended === true;
    }
    const norm = userMajor.toLowerCase().trim();
    // Jika peluang umum atau terbuka semua jurusan, selalu cocok
    if (
        opportunity.field === "Umum" ||
        opportunity.field === "Beragam bidang" ||
        opportunity.targetMajors?.includes("Semua Jurusan") ||
        opportunity.targetMajors?.includes("Semua")
    ) {
        return true;
    }
    // Cocokkan dengan array targetMajors
    if (opportunity.targetMajors?.some((m) => {
        const targetNorm = m.toLowerCase();
        return norm.includes(targetNorm) || targetNorm.includes(norm);
    })) {
        return true;
    }
    // Cocokkan dengan field
    if (opportunity.field) {
        const fieldNorm = opportunity.field.toLowerCase();
        if (norm.includes(fieldNorm) || fieldNorm.includes(norm)) {
            return true;
        }
    }
    return false;
}

export function categoryLabel(category, locale) {
    if (locale === "id")
        return category;
    return {
        Semua: "All",
        Beasiswa: "Scholarships",
        Magang: "Internships",
        Bootcamp: "Bootcamps",
        "Studi Independen": "Certified Study",
        Workshop: "Workshops",
        "Seminar / Webinar": "Seminars & Webinars",
        Kompetisi: "Competitions",
    }[category] ?? category;
}

export function fieldLabel(field, locale) {
    if (locale === "id")
        return field;
    return {
        Umum: "General",
        Informatika: "Informatics",
        Teknologi: "Technology",
        "Beragam bidang": "Various fields",
        Perbankan: "Banking",
        Manajemen: "Management",
        Desain: "Design",
        Hukum: "Law",
        Kesehatan: "Healthcare",
        Komunikasi: "Communications",
        Teknik: "Engineering",
        Psikologi: "Psychology",
        "Bisnis Digital": "Digital Business",
    }[field] ?? field;
}

export function calendarFilterLabel(filter, locale) {
    if (locale === "id")
        return filter;
    return {
        Rekomendasi: "Featured",
        Semua: "All",
        Beasiswa: "Scholarships",
        Magang: "Internships",
        Bootcamp: "Bootcamps",
        "Studi Independen": "Certified Study",
        Workshop: "Workshops",
        "Seminar / Webinar": "Seminars & Webinars",
        Kompetisi: "Competitions",
        Deadline: "Deadlines",
        Disimpan: "Saved",
    }[filter] ?? filter;
}

export function demoDeadline(days, base = new Date()) {
    const date = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    date.setDate(date.getDate() + days);
    return date;
}

export function formatDate(date, locale = "id") {
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function hasCategory(opportunity, category) {
    return opportunity.category === category || opportunity.alsoCategories?.includes(category) === true;
}

export function filterCalendarOpportunities(filter, saved, base = new Date(), profile = null) {
    if (filter === "Semua")
        return opportunities;
    if (filter === "Rekomendasi")
        return opportunities.filter((item) => profile?.major ? isOpportunityRecommended(item, profile.major) : item.recommended);
    if (filter === "Disimpan")
        return opportunities.filter((item) => saved.includes(item.id));
    if (filter === "Deadline")
        return opportunities.filter((item) => item.demoDays <= 7 && demoDeadline(item.demoDays, base) >= new Date(base.getFullYear(), base.getMonth(), base.getDate()));
    return opportunities.filter((item) => hasCategory(item, filter));
}

export function demoReminders(saved) {
    return opportunities.filter((item) => saved.includes(item.id) && item.demoDays <= 3);
}
