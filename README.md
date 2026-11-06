# NAVIKA — Student Opportunity Finder

Aplikasi web modern untuk menemukan, mencocokkan, dan memantau peluang pengembangan akademik dan karier mahasiswa Indonesia (Beasiswa, Magang, Bootcamp, Studi Independen, Workshop, Seminar/Webinar, dan Kompetisi).

Dikembangkan menggunakan **Next.js 16 App Router**, **React 19**, **JavaScript ES Modules**, dan **Vanilla CSS**.

---

## 🔗 Tautan Penting

* **Repositori GitHub**: [https://github.com/limingerr/Navika](https://github.com/limingerr/Navika)
* **Desain Prototipe Figma (Kelompok 8)**: [https://www.figma.com/design/SD9ZLtfASaAoMpCW1r2k0I/Kelompok-8Navika](https://www.figma.com/design/SD9ZLtfASaAoMpCW1r2k0I/Kelompok-8Navika)
* **Product Requirements Document (PRD)**: [PRD-NAVIKA.md](PRD-NAVIKA.md)
* **Dokumen PRD (Format PDF)**: [PRD-NAVIKA.pdf](PRD-NAVIKA.pdf)

---

## ✨ Fitur Utama

1. **Onboarding Profil Mahasiswa Terpersonalisasi**
   - Setelah masuk/login demo, pengguna diarahkan untuk mengisi 5 data profil utama: **Nama**, **Universitas**, **Jurusan**, **Semester**, dan **IPK**.
   - Data profil disimpan secara persisten di penyimpanan peramban (*localStorage*) dan menjadi acuan kurasi peluang yang relevan.

2. **Rekomendasi Cerdas Berbasis Jurusan (*Smart Major Matching*)**
   - Algoritma pencocokan deterministik memprioritaskan peluang yang sesuai dengan program studi/jurusan pengguna di posisi teratas katalog dan dashboard.
   - Peluang berskala umum (*General / All Majors*) tetap ditampilkan secara inklusif.

3. **Katalog 46 Peluang Terverifikasi & Multi-Kategori**
   - Menyediakan 46 peluang dari penyelenggara resmi terpercaya (pemerintah, BUMN, institusi teknologi, dan korporasi terkemuka).
   - Mendukung 7 kategori peluang:
     - 🎓 **Beasiswa**: Djarum Beasiswa Plus, KIP Kuliah, Beasiswa Bank Indonesia, Pertamina Sobat Bumi, Tanoto Foundation, Paragon Scholarship, dll.
     - 💼 **Magang**: Vinix7 Web Dev, MAGENTA BUMN, Magang Bakti BCA, Telkom DigiUp, BPJS Kesehatan, WIKA, UNICEF Indonesia, dll.
     - 💻 **Bootcamp**: Hacktiv8, Digital Talent Scholarship Komdigi, Bangkit Academy Google/GoTo, RevoU, Dibimbing, Binar, dll.
     - 📚 **Studi Independen**: Dicoding AI/ML MSIB, Ruangguru Digital Business, Binar UI/UX, Alterra Flutter, dll.
     - 🛠️ **Workshop**: AWS Cloud Practitioner Day, UI/UX Design System Workshop, FinTech Analytics Bootcamp, dll.
     - 🌐 **Seminar / Webinar**: Google Developer Days, Mandiri Tech Talks, Karir AI Masa Depan, dll.
     - 🏆 **Kompetisi**: Gemastik, PKM Kemendikbudristek, BCA Finhacks, Hackathon Nasional, dll.

4. **Kalender Agenda & Tenggat Waktu (*Deadline Tracker*)**
   - Navigasi tanggal mingguan di dashboard serta tampilan bulanan penuh di halaman Kalender.
   - Chip filter **`✧ Rekomendasi`** berada di urutan terdepan, menyaring jadwal batas pendaftaran sesuai jurusan pengguna.
   - Dilengkapi *slim scrollbar* horizontal serta interaksi *mouse wheel scroll* dan *touch swipe* yang mulus.

5. **Halaman Detail Peluang & Floating Sticky CTA (Mobile)**
   - Menyajikan informasi lengkap: Ringkasan, Persyaratan Utama, Fasilitas/Manfaat, dan Disclaimer.
   - Pada perangkat mobile, tombol **"Kunjungi Website Resmi ↗"** dibuat melayang (*sticky / fixed*) tepat di atas navigasi bawah, sehingga pengguna dapat langsung mengunjungi situs resmi tanpa perlu menggulir ke dasar halaman.

6. **Tersimpan / Bookmark & Dukungan Mode Gelap (*Dark Mode*)**
   - Simpan peluang favorit dalam daftar pribadi.
   - Pilihan tema fleksibel: Terang (*Light*), Gelap (*Dark*), atau Mengikuti Pengaturan Perangkat (*System Default*), memenuhi standar kontras aksesibilitas WCAG AA.

---

## 🚀 Petunjuk Menjalankan Secara Lokal

### Prasyarat
* **Node.js**: Versi `18.18.0` atau yang lebih baru (disarankan Node.js 20 atau 22).
* **npm**: Versi 9 atau yang lebih baru (otomatis terpasang bersama Node.js).
* **Git**: Untuk mengunduh repositori.

### Langkah-langkah Instalasi

1. **Clone Repositori dari GitHub**
   ```bash
   git clone https://github.com/limingerr/Navika.git
   cd Navika
   ```

2. **Instal Dependensi Proyek**
   * Di Windows (PowerShell / Command Prompt):
     ```powershell
     npm.cmd install
     ```
   * Di Linux / macOS:
     ```bash
     npm install
     ```

3. **Jalankan Development Server**
   * Di Windows:
     ```powershell
     npm.cmd run dev
     ```
   * Di Linux / macOS:
     ```bash
     npm run dev
     ```

4. **Buka Aplikasi di Browser**
   Buka peramban web dan akses URL:
   ```
   http://localhost:3000
   ```

5. **Menjalankan Pengujian & Membangun Proyek**
   * Menjalankan unit test katalog & fungsi profil:
     ```powershell
     npm.cmd test
     ```
   * Membangun berkas produksi (*production build*):
     ```powershell
     npm.cmd run build
     ```
   * Menjalankan server produksi:
     ```powershell
     npm.cmd run start
     ```

### Login dengan Google

- Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` di `.env.local` untuk pengembangan dan di environment Production Vercel untuk situs utama. Jangan commit `.env.local`.
- Di Google Cloud, buat OAuth client web dengan origin `https://navika-pi.vercel.app` dan `http://localhost:3000`, serta redirect URI `https://rlmdzuzajibfnurkrwgj.supabase.co/auth/v1/callback`. Masukkan Client ID dan Client Secret ke pengaturan provider Google di Supabase, lalu aktifkan provider tersebut. Simpan Client Secret hanya di dashboard.
- Di Supabase Auth URL Configuration, gunakan Site URL `https://navika-pi.vercel.app` dan izinkan `https://navika-pi.vercel.app/auth/callback`. Tambahkan `http://localhost:3000/auth/callback` untuk pengembangan lokal.
- Setelah konfigurasi selesai, buka `/masuk` atau `/daftar` dan gunakan tombol Google. Kedua tombol membuat atau memakai akun Supabase yang sama. Kegagalan login kembali ke `/masuk`; `/dev/auth/status` hanya tersedia dalam mode development.

---

## 📁 Struktur Direktori Proyek

Prototipe HTML lama sudah dihapus. PRD tetap menyimpan konteks rancangan awal.

```text
Navika/
  app/                 # Halaman, layout, dan API Next.js
  src/
    components/        # Komponen dan layar React
    data/              # Katalog bawaan
    lib/               # Logika bersama dan klien Supabase
    services/          # Layanan data, email, push, dan scraper
  scripts/             # Perintah CLI
  tests/               # Tes Node.js
  style/               # CSS aplikasi
  supabase/            # Skema, seed, dan migrasi database
  public/asset/        # Gambar dan ikon yang dipakai aplikasi
  export/              # PNG acuan desain dalam PRD
  package.json
```

---

## 🛠️ Teknologi yang Digunakan

* **Framework Web**: [Next.js 16](https://nextjs.org/) (Turbopack, App Router)
* **Library Antarmuka**: [React 19](https://react.dev/)
* **Bahasa**: JavaScript (ES Modules murni, tanpa TypeScript tambahan)
* **Styling**: Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid, Media Queries, Dark Mode)
* **Test Runner**: Node.js Native Test Runner (`node --test`)
* **Desain & Prototipe**: [Figma (Kelompok 8 Navika)](https://www.figma.com/design/SD9ZLtfASaAoMpCW1r2k0I/Kelompok-8Navika)

---

## 👥 Kontributor

Proyek ini dikembangkan oleh **Kelompok 8 Web & UI/UX Developer** sebagai solusi pencarian dan pemantauan peluang pendidikan serta karier bagi mahasiswa.

