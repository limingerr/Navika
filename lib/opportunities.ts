import type { Locale } from "./i18n";

export type Category = "Beasiswa" | "Magang" | "Bootcamp";
export type CalendarFilter = "Beasiswa" | "Deadline" | "Bootcamp" | "Semua" | "Disimpan" | "Magang" | "Rekomendasi";
export const calendarFilters: CalendarFilter[] = ["Beasiswa", "Deadline", "Bootcamp", "Semua", "Disimpan", "Magang", "Rekomendasi"];

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: Category;
  alsoCategories?: Category[];
  recommended: boolean;
  referenceOnly?: boolean;
  field: string;
  summary: string;
  summaryEn: string;
  requirements: string[];
  requirementsEn: string[];
  benefits?: string[];
  benefitsEn?: string[];
  sourceUrl: string;
  demoDays: number;
};

// shortcut: dates are simulated relative to today until the catalog is verified.
export const opportunities: Opportunity[] = [
  {
    id: "djarum",
    title: "Djarum Beasiswa Plus",
    organization: "Djarum Foundation",
    category: "Beasiswa",
    recommended: true,
    field: "Umum",
    summary: "Program beasiswa untuk mahasiswa yang ingin mengembangkan potensi diri.",
    summaryEn: "A scholarship for students who want to develop their potential.",
    requirements: ["Mahasiswa aktif perguruan tinggi mitra Djarum Beasiswa Plus.", "Memenuhi ketentuan akademik program.", "Memiliki prestasi dan potensi pengembangan diri.", "Memenuhi persyaratan administrasi dan pendaftaran."],
    requirementsEn: ["An active student at a Djarum Beasiswa Plus partner university.", "Meets the program's academic requirements.", "Shows achievement and potential for personal growth.", "Meets the registration and document requirements."],
    benefits: ["Dukungan dana beasiswa.", "Pelatihan soft skills.", "Pengembangan karakter dan kepemimpinan."],
    benefitsEn: ["Scholarship funding.", "Soft skills training.", "Character and leadership development."],
    sourceUrl: "https://www.djarumbeasiswaplus.org/",
    demoDays: 10,
  },
  {
    id: "vinix7",
    title: "Web Dev & UI/UX",
    organization: "PT Vinix Seven Aurum",
    category: "Magang",
    recommended: true,
    field: "Informatika",
    summary: "Kesempatan untuk mengembangkan keterampilan web development dan UI/UX.",
    summaryEn: "An opportunity to develop web development and UI/UX skills.",
    requirements: ["Minat pada pengembangan website dan UI/UX.", "Bersedia mengikuti kegiatan berbasis proyek dan kolaborasi tim."],
    requirementsEn: ["Interest in website development and UI/UX.", "Willing to join project-based activities and team collaboration."],
    benefits: ["Pengalaman user research, prototyping, pengembangan website, dan testing."],
    benefitsEn: ["Experience with user research, prototyping, website development, and testing."],
    sourceUrl: "https://vinix7.com/",
    demoDays: 3,
  },
  {
    id: "kip-kuliah",
    title: "Beasiswa KIP Kuliah",
    organization: "Kemendikbudristek RI",
    category: "Beasiswa",
    recommended: true,
    field: "Umum",
    summary: "Program bantuan pendidikan bagi calon mahasiswa dari keluarga dengan keterbatasan ekonomi.",
    summaryEn: "Education assistance for prospective students from families with limited financial resources.",
    requirements: ["Lulusan SMA, SMK, atau sederajat yang akan melanjutkan pendidikan tinggi.", "Memenuhi kriteria ekonomi dan persyaratan akademik program."],
    requirementsEn: ["A high school or vocational school graduate planning to enter higher education.", "Meets the program's financial and academic requirements."],
    benefits: ["Bantuan biaya pendidikan dan biaya hidup sesuai ketentuan."],
    benefitsEn: ["Tuition and living cost assistance subject to program rules."],
    sourceUrl: "https://kip-kuliah.kemdikbud.go.id/",
    demoDays: 2,
  },
  {
    id: "hacktiv8",
    title: "AI-Enhanced Full Stack Developer",
    organization: "PT Hacktivate Teknologi Indonesia",
    category: "Bootcamp",
    recommended: true,
    field: "Teknologi",
    summary: "Kesempatan untuk mengembangkan keterampilan AI dan full stack developer.",
    summaryEn: "An opportunity to develop AI and full stack development skills.",
    requirements: ["Terbuka bagi pemula; pengalaman coding sebelumnya bukan persyaratan mutlak."],
    requirementsEn: ["Open to beginners; prior coding experience is not mandatory."],
    sourceUrl: "https://www.hacktiv8.com/",
    demoDays: 2,
  },
  {
    id: "magenta",
    title: "Magang Generasi Bertalenta",
    organization: "BUMN",
    category: "Magang",
    recommended: true,
    field: "Beragam bidang",
    summary: "Kesempatan untuk mengembangkan keterampilan dan pengalaman kerja di perusahaan BUMN.",
    summaryEn: "An opportunity to develop skills and gain work experience at a state-owned company.",
    requirements: ["Syarat akademik, jurusan, IPK, dan dokumen berbeda untuk setiap posisi.", "Periksa ketentuan posisi yang dipilih di situs resmi."],
    requirementsEn: ["Academic, major, GPA, and document requirements vary by role.", "Check the selected role's requirements on the official site."],
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
    summary: "Kesempatan mengembangkan keterampilan dalam bidang perbankan dan teknologi finansial.",
    summaryEn: "An opportunity to develop skills in banking and financial technology.",
    requirements: ["Warga Negara Indonesia berusia 18–24 tahun.", "Persyaratan pendidikan dan nilai mengikuti ketentuan program resmi."],
    requirementsEn: ["An Indonesian citizen aged 18–24.", "Education and grade requirements follow the official program rules."],
    sourceUrl: "https://karir.bca.co.id/",
    demoDays: 10,
  },
  {
    id: "beasiswa-bi",
    title: "Beasiswa Bank Indonesia",
    organization: "Bank Indonesia",
    category: "Beasiswa",
    recommended: true,
    field: "Umum",
    summary: "Kesempatan mendapatkan beasiswa dan mengikuti program pengembangan mahasiswa.",
    summaryEn: "An opportunity to receive a scholarship and join a student development program.",
    requirements: ["Mahasiswa aktif di perguruan tinggi mitra.", "Memenuhi ketentuan akademik dan administrasi periode seleksi."],
    requirementsEn: ["An active student at a partner university.", "Meets the academic and administrative rules for the application period."],
    sourceUrl: "https://www.bi.go.id/",
    demoDays: 10,
  },
  {
    id: "dts",
    title: "Digital Talent Scholarship (DTS)",
    organization: "Kementerian Komdigi RI",
    category: "Beasiswa",
    alsoCategories: ["Bootcamp"],
    recommended: true,
    field: "Teknologi",
    summary: "Program pelatihan talenta digital dengan berbagai jalur pembelajaran.",
    summaryEn: "A digital talent training program with several learning paths.",
    requirements: [],
    requirementsEn: [],
    sourceUrl: "https://digitalent.komdigi.go.id/",
    demoDays: 10,
  },
  {
    id: "revou",
    title: "RevoU",
    organization: "PT Revolusi Cita Edukasi",
    category: "Bootcamp",
    recommended: true,
    referenceOnly: true,
    field: "Teknologi",
    summary: "Pilihan bootcamp untuk mengembangkan keterampilan digital bersama RevoU.",
    summaryEn: "Bootcamp options for developing digital skills with RevoU.",
    requirements: [],
    requirementsEn: [],
    sourceUrl: "https://www.revou.co/",
    demoDays: 5,
  },
  {
    id: "dicoding-academy",
    title: "Dicoding Academy",
    organization: "Dicoding Indonesia",
    category: "Bootcamp",
    recommended: true,
    referenceOnly: true,
    field: "Teknologi",
    summary: "Kelas daring untuk mempelajari keterampilan teknologi melalui Dicoding Academy.",
    summaryEn: "Online classes for learning technology skills through Dicoding Academy.",
    requirements: [],
    requirementsEn: [],
    sourceUrl: "https://www.dicoding.com/",
    demoDays: 2,
  },
  {
    id: "dibimbing",
    title: "Dibimbing.id",
    organization: "PT Dibimbing Digital Indonesia",
    category: "Bootcamp",
    recommended: true,
    referenceOnly: true,
    field: "Teknologi",
    summary: "Pilihan bootcamp dengan pendampingan mentor dan proyek praktik.",
    summaryEn: "Bootcamp options with mentor guidance and practical projects.",
    requirements: [],
    requirementsEn: [],
    sourceUrl: "https://dibimbing.id/",
    demoDays: 3,
  },
  {
    id: "bangkit",
    title: "Bangkit Academy",
    organization: "Bangkit Academy",
    category: "Bootcamp",
    recommended: true,
    field: "Teknologi",
    summary: "Program pembelajaran teknologi untuk mahasiswa dengan jalur AI dan data.",
    summaryEn: "A technology learning program for students with AI and data paths.",
    requirements: [],
    requirementsEn: [],
    sourceUrl: "https://bangkit.academy/",
    demoDays: 10,
  },
  {
    id: "ppm-training",
    title: "PPM Manajemen Training",
    organization: "PPM Manajemen",
    category: "Bootcamp",
    alsoCategories: ["Beasiswa"],
    recommended: false,
    referenceOnly: true,
    field: "Manajemen",
    summary: "Pilihan pelatihan manajemen dari PPM Manajemen; periksa program dan jadwal resmi.",
    summaryEn: "Management training options from PPM Manajemen; check the official programs and schedules.",
    requirements: [],
    requirementsEn: [],
    sourceUrl: "https://www.ppm-manajemen.ac.id/ppm-ppe/",
    demoDays: 2,
  },
  {
    id: "pertamina-young-talent",
    title: "Pertamina Young Talent Internship",
    organization: "PT Pertamina (Persero)",
    category: "Beasiswa",
    recommended: false,
    referenceOnly: true,
    field: "Beragam bidang",
    summary: "Referensi peluang pengembangan talenta Pertamina; periksa pembukaan pada portal resminya.",
    summaryEn: "A reference for Pertamina talent opportunities; check openings on its official portal.",
    requirements: [],
    requirementsEn: [],
    sourceUrl: "https://recruitment.pertamina.com/",
    demoDays: 5,
  },
  {
    id: "unicef-internship",
    title: "UNICEF / UN Internship Program",
    organization: "UNICEF",
    category: "Magang",
    recommended: false,
    field: "Beragam bidang",
    summary: "Peluang magang internasional bagi mahasiswa dan lulusan baru di UNICEF.",
    summaryEn: "International internship opportunities for students and recent graduates at UNICEF.",
    requirements: [],
    requirementsEn: [],
    sourceUrl: "https://www.unicef.org/careers/internships",
    demoDays: 2,
  },
];

export const categories = ["Semua", "Beasiswa", "Magang", "Bootcamp"] as const;

export function categoryLabel(category: Category | "Semua", locale: Locale) {
  if (locale === "id") return category;
  return ({ Semua: "All", Beasiswa: "Scholarships", Magang: "Internships", Bootcamp: "Bootcamps" } as Record<string, string>)[category];
}

export function fieldLabel(field: string, locale: Locale) {
  if (locale === "id") return field;
  return ({ Umum: "General", Informatika: "Informatics", Teknologi: "Technology", "Beragam bidang": "Various fields", Perbankan: "Banking", Manajemen: "Management" } as Record<string, string>)[field] ?? field;
}

export function calendarFilterLabel(filter: CalendarFilter, locale: Locale) {
  if (locale === "id") return filter;
  return ({ Beasiswa: "Scholarships", Deadline: "Deadlines", Bootcamp: "Bootcamps", Semua: "All", Disimpan: "Saved", Magang: "Internships", Rekomendasi: "Featured" } as Record<string, string>)[filter];
}

export function demoDeadline(days: number, base = new Date()) {
  const date = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  date.setDate(date.getDate() + days);
  return date;
}

export function formatDate(date: Date, locale: Locale = "id") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function hasCategory(opportunity: Opportunity, category: Category) {
  return opportunity.category === category || opportunity.alsoCategories?.includes(category) === true;
}

export function filterCalendarOpportunities(filter: CalendarFilter, saved: string[], base = new Date()) {
  if (filter === "Semua") return opportunities;
  if (filter === "Rekomendasi") return opportunities.filter((item) => item.recommended);
  if (filter === "Disimpan") return opportunities.filter((item) => saved.includes(item.id));
  if (filter === "Deadline") return opportunities.filter((item) => item.demoDays <= 7 && demoDeadline(item.demoDays, base) >= new Date(base.getFullYear(), base.getMonth(), base.getDate()));
  return opportunities.filter((item) => hasCategory(item, filter));
}

export function demoReminders(saved: string[]) {
  return opportunities.filter((item) => saved.includes(item.id) && item.demoDays <= 3);
}
