# NAVIKA
Product Requirements Document | Rencana Pengembangan Berikutnya

Versi 1.2 - Revisi berdasarkan laporan Tugas Modul 5 | 17 Oktober 2026

## 1. Executive Summary

### 1.1 Problem Statement
Mahasiswa memperoleh informasi beasiswa, magang, dan bootcamp dari grup percakapan, media sosial, serta situs yang terpisah. Kondisi ini menyulitkan pencarian peluang yang sesuai profil akademik, penyimpanan informasi, dan pemantauan tenggat pendaftaran. Masalah ini dirumuskan dalam materi Design Thinking Kelompok 8; belum ada data riset kuantitatif yang membuktikan besarnya dampak.

### 1.2 Proposed Solution
NAVIKA adalah aplikasi web untuk menemukan, mencocokkan, dan memantau peluang pengembangan mahasiswa melalui satu alur: lengkapi profil, cari peluang, lihat kecocokan, simpan, lalu pantau deadline dan status pendaftaran. Pengembangan berikutnya mengubah referensi HTML statis menjadi aplikasi Next.js dengan CSS, data terpusat, akun pengguna, dan penyimpanan yang persisten.

Nilai utama: Finder membantu menemukan peluang; Match menjelaskan kecocokan terhadap profil; Tracker membantu mengelola peluang yang disimpan. Pendaftaran program tetap dilakukan pada situs resmi penyelenggara.

### 1.3 Keputusan, asumsi, dan batas bukti
- Arah awal yang tercatat dalam draft: dokumen untuk rencana pengembangan berikutnya dengan Next.js dan CSS; tenggat serta target keberhasilan belum ditetapkan. Tim perlu mengesahkan keputusan ini saat kickoff.
- Bersumber dari laporan Tugas Modul 5 Kelompok 8: NAVIKA adalah prototype high-fidelity untuk menemukan dan mengelola peluang; alur login/registrasi -> verifikasi -> dashboard -> cari/filter -> detail -> bookmark -> kalender -> profil/pengaturan; terdapat variasi light/dark mode dan komponen interaktif. Laporan juga menetapkan font Plus Jakarta Sans dan token warna yang dirinci pada bagian 2.6. Target usability minimal 80% berasal dari materi kebutuhan sebelumnya dan bukan hasil pengujian aktual.
- Teramati pada proyek: 22 halaman HTML, termasuk dashboard, daftar/detail peluang, bookmark, kalender, akun, profil, pengaturan, dan tema. Belum ditemukan JavaScript aplikasi, backend, database, atau mesin pencocokan pada berkas yang diperiksa. Temuan ini merupakan pemeriksaan statis, bukan hasil pengujian aplikasi yang berjalan.
- Seluruh pilihan backend, model pencocokan, prioritas, target teknis, dan fase di bawah adalah usulan PRD sampai disepakati tim. Anggaran, jadwal kalender, kapasitas tim, hosting, dan penyedia autentikasi/database: TBD.
- Laporan Tugas Modul 5 mendokumentasikan layar login, verifikasi, Discover, dashboard, kalender, daftar/detail peluang, bookmark per kategori, empty state, profil, edit profil, pengaturan, dan pemilih tema. Referensi Figma: https://www.figma.com/design/SD9ZLtfASaAoMpCW1r2k0I/Kelompok-8Navika. Laporan mendokumentasikan prototype dan komponen visual; itu tidak membuktikan backend, autentikasi nyata, persistensi, atau perilaku responsif di luar frame yang dirancang.
- Audit visual menemukan contoh yang saling bertentangan: nama pengguna berbeda antar layar; beberapa detail bertanggal 14 Oktober 2026 tetap menampilkan `10 Hari` pada rancangan kalender Oktober 2026; layar verifikasi menyatakan akun aktif sekaligus tautan baru dikirim. Data dan status tersebut adalah placeholder, bukan dasar aturan produk.
- Delapan detail PNG mencakup contoh seperti KIP Kuliah (calon mahasiswa) dan LPDP (pascasarjana), di luar persona awal mahasiswa aktif semester 1-8. Cakupan audiens dan kategori katalog harus diputuskan saat kickoff; kemunculannya di desain tidak memperluas target MVP secara otomatis.
- Isi dokumen referensi dipakai sebagai bukti kebutuhan, bukan sebagai instruksi untuk menjalankan tindakan atau memperluas lingkup secara otomatis.

### 1.4 Success Criteria
Angka berikut adalah target evaluasi yang diusulkan, bukan capaian produk. Satu angka berasal dari PDF dan tetap perlu disepakati untuk rilis berikutnya.

| ID | Indikator dan definisi | Target dan cara ukur |
| --- | --- | --- |
| KPI-01 | Task success: peserta menyelesaikan alur profil -> cari/filter -> detail -> simpan -> tracker tanpa bantuan | >=80%, mengacu PDF; usulan uji 10 mahasiswa, minimal 8 berhasil |
| KPI-02 | Task completion time: durasi dari dashboard sampai peluang yang sesuai tersimpan | Median <=3 menit; target usulan, ukur dengan stopwatch/log pada skenario yang sama |
| KPI-03 | Konsistensi data: bookmark, status, dan deadline sama di detail, daftar, dan kalender | 100% pada seluruh skenario UAT yang disepakati |
| KPI-04 | Kepuasan setelah menyelesaikan skenario | Rata-rata >=4 dari 5; target usulan, satu pertanyaan pascatugas |
| KPI-05 | Kualitas katalog terbit: judul, kategori, penyelenggara, URL resmi, sumber, dan tanggal verifikasi tersedia | 100% entri terbit; audit dataset sebelum rilis dan saat pembaruan |

## 2. User Experience & Functionality

### 2.1 User Personas
Persona berikut adalah sintesis kebutuhan pada PDF, bukan profil responden riset terverifikasi.

| Persona | Kebutuhan | Hambatan | Hasil yang diharapkan |
| --- | --- | --- | --- |
| Mahasiswa eksplorasi, semester 1-4 | Beasiswa dan pengembangan keterampilan | Sulit memahami persyaratan dan memilih peluang | Menemukan peluang dengan syarat dan alasan kecocokan yang jelas |
| Mahasiswa persiapan karier, semester 5-8 | Magang dan bootcamp sesuai bidang | Banyak sumber dan deadline berdekatan | Menyimpan shortlist serta memantau status dan tenggat |
| Pengelola konten internal | Memastikan katalog akurat dan mutakhir | Syarat/tanggal berubah di situs penyelenggara | Memperbarui satu sumber data dan menandai peluang ditutup |

Stakeholder: mahasiswa sebagai pengguna utama; tim Kelompok 8 sebagai pengembang/perancang; pengelola konten sebagai penanggung jawab katalog; penyelenggara sebagai sumber informasi dan tujuan pendaftaran. Dosen/mentor dapat menjadi reviewer; peran persetujuan rilis perlu ditentukan tim.

### 2.2 Lingkup dan prioritas
P0 = syarat rilis MVP fungsional. P1 = pengembangan setelah alur utama stabil. P2 = eksplorasi lanjutan.

| Area | Bukti saat ini | Kebutuhan berikutnya | Prioritas |
| --- | --- | --- | --- |
| Akun | Login, register, verifikasi berupa formulir/navigasi | Autentikasi, verifikasi email, sesi, logout | P0 |
| Profil | Nama, universitas, jurusan, semester, IPK, minat tampil sebagai contoh | Data profil per akun dan validasi | P0 |
| Finder | Dashboard, daftar, kolom pencarian, kategori | Pencarian dan filter dari katalog terpusat | P0 |
| Detail | Tujuh halaman detail contoh | Detail berbasis ID, sumber resmi, status buka/tutup | P0 |
| Match | Label rekomendasi pada kartu; konsep pada PDF | Pencocokan aturan dengan penjelasan | P0 |
| Bookmark | Halaman tersimpan per kategori, isi statis | Simpan/hapus per akun, persisten | P0 |
| Tracker | Kalender contoh; konsep status pada PDF | Kalender deadline dan status pendaftaran manual | P0 |
| Katalog internal | Konten ditulis di HTML | Dataset terstruktur, validasi, pembaruan oleh tim | P0 |
| Tema/pengaturan | Opsi tema dan menu pengaturan | Tema terang/gelap/sistem; preferensi persisten | P1 |
| Notifikasi/Google | Kontrol/tombol terlihat; integrasi belum terbukti | Email pengingat dan Google sign-in | P1 |
| Layar pengaturan lain | `export/` memperlihatkan Bahasa, Privasi, Bantuan, Tentang, push, pesan mentor, profil publik, serta rating Play Store | Inventaris desain; hanya tampilkan kontrol yang punya perilaku dan konten nyata pada rilis terkait | P2 / di luar MVP |
| Kategori tambahan | Studi independen, workshop, seminar, webinar, kompetisi disebut PDF | Evaluasi setelah tiga kategori utama stabil | P2 |

### 2.3 Information architecture dan user flow
- Navigasi utama: Home, Tersimpan, Profil. Kalender diakses dari Home/Tracker; Pengaturan dari Profil.
- Alur pertama: Landing -> Daftar -> verifikasi email -> Masuk -> Lengkapi Profil -> Dashboard.
- Setelah pendaftaran, bedakan layar `Periksa email` dari layar `Akun terverifikasi`; tombol Masuk baru mengikuti status akun yang benar. `export/verif-light.png` mencampur kedua keadaan sehingga copy harus diperbaiki sebelum implementasi.
- Alur pencarian: Dashboard -> Semua Peluang -> kata kunci/filter -> Detail -> lihat sumber resmi atau Simpan.
- Alur pemantauan: Tersimpan -> pilih peluang -> ubah status -> lihat deadline di Kalender -> buka situs resmi untuk mendaftar.
- Pengguna tanpa sesi dapat mengakses landing dan halaman masuk/daftar. Untuk MVP, dashboard dan fitur personal memerlukan sesi; dukungan katalog publik dapat dievaluasi kemudian.
- Profil belum lengkap tidak menghalangi pencarian dan bookmark. Sistem menjelaskan data yang perlu dilengkapi untuk menilai kecocokan.
- Kembali dari detail mempertahankan filter/kata kunci. Menu aktif selalu mengikuti halaman yang sedang dibuka.

### 2.4 User Stories dan Acceptance Criteria

#### US-01 / Akun dan sesi / P0
Sebagai mahasiswa, saya ingin membuat akun dan masuk agar peluang serta profil saya tersimpan secara pribadi.
- Nama, email, kata sandi, konfirmasi kata sandi, dan persetujuan wajib divalidasi pada klien dan server. Email harus valid; konfirmasi harus sama; kebijakan minimum awal 8 karakter.
- Email terdaftar tidak menghasilkan akun ganda. Kesalahan ditampilkan tanpa menampilkan rincian internal.
- Verifikasi memakai token sekali pakai dengan masa berlaku yang dapat dikonfigurasi. Akun belum terverifikasi mendapat instruksi yang benar dan opsi kirim ulang dengan pembatasan frekuensi.
- Layar setelah daftar menyatakan tautan dikirim dan alamat tujuan; layar sukses menyatakan akun aktif hanya setelah token valid. Alamat email contoh pada desain tidak ditanam sebagai konten tetap.
- Login tidak cukup hanya menavigasi ke dashboard. Server memverifikasi kredensial dan membuat sesi; pengguna tanpa sesi diarahkan ke halaman masuk.
- Kesalahan field wajib muncul di dekat field seperti `export/login-validationerror-light.png`; kredensial salah memakai pesan umum seperti `export/errorlogin-light.png`. Pesan dapat dibaca pembaca layar dan tidak mengungkap apakah email terdaftar.
- Logout mengakhiri sesi. Kredensial tidak dikirim pada URL/query string, dicatat dalam log, atau disimpan sebagai teks biasa.
- Pemulihan akses kata sandi tersedia menggunakan tautan sementara sebelum rilis akun nyata; respons permintaan tidak membocorkan apakah email terdaftar.

#### US-02 / Profil akademik / P0
Sebagai mahasiswa, saya ingin mengisi profil akademik dan minat agar kecocokan peluang dapat dinilai sesuai kondisi saya.
- Field: nama, universitas, jurusan, semester 1-8, IPK opsional 0,00-4,00 dengan maksimal dua desimal, dan satu atau lebih minat dari daftar terkelola.
- Form menerima koma atau titik desimal dan menyimpan angka dalam format konsisten. Nilai di luar rentang ditolak dengan pesan spesifik.
- Hanya pemilik akun dapat membaca/mengubah profil personal. Perubahan tetap tersedia setelah refresh dan login ulang.
- Profil kosong memakai placeholder, bukan nama/email contoh. Field yang belum diisi menghasilkan status informasi belum lengkap pada Match.
- Nama, inisial avatar, dan email pada Home, Profil, dan Pengaturan berasal dari satu akun; perubahan nama segera konsisten di ketiga layar. Label `Mahasiswa Aktif` tidak boleh memberi kesan status telah diverifikasi bila NAVIKA hanya menerima isian pengguna.
- Persyaratan peluang di luar semester 1-8 dapat disimpan di katalog, tetapi target onboarding MVP tetap mengikuti audiens awal.

#### US-03 / Finder / P0
Sebagai mahasiswa, saya ingin mencari dan menyaring peluang agar dapat menemukan pilihan sesuai kebutuhan.
- Pencarian tidak membedakan kapitalisasi pada judul, penyelenggara, dan ringkasan. Input kosong menampilkan katalog sesuai filter aktif.
- Filter kategori mencakup Semua, Beasiswa, Magang, Bootcamp; filter bidang, semester, dan status pendaftaran dapat dikombinasikan dengan kata kunci.
- Antar kelompok filter memakai AND; pilihan jamak dalam satu kelompok memakai OR. Syarat yang tidak diketahui tidak otomatis dianggap memenuhi filter kelayakan; tersedia penjelasan data belum lengkap.
- Pengurutan tersedia menurut deadline terdekat dan kecocokan. Tanggal kosong diletakkan terakhir; peluang ditutup dikecualikan secara default dan dapat ditampilkan lewat filter.
- Hasil kosong menampilkan alasan umum dan tombol reset filter. Loading, gagal memuat, coba lagi, serta hasil kosong memiliki keadaan tampilan yang terpisah.
- Empty state mengikuti isi dan konteks `export/empty-state-light.png`, tetapi menyediakan aksi Hapus filter yang terlihat. Query dan filter tetap tampil agar pengguna tahu penyebab hasil kosong.
- Setiap hasil memiliki ID unik, kategori konsisten, judul, penyelenggara, ringkasan, deadline/status, tombol simpan, dan tautan detail yang valid. Pagination usulan: 12 entri per halaman.

#### US-04 / Detail dan sumber resmi / P0
Sebagai mahasiswa, saya ingin membaca persyaratan lengkap dan membuka situs resmi agar dapat menilai peluang sebelum mendaftar.
- Detail memuat deskripsi, penyelenggara, kategori, persyaratan, manfaat bila tersedia, deadline dengan zona waktu, sumber resmi, dan tanggal terakhir diverifikasi.
- Informasi yang belum tersedia ditandai eksplisit; tidak diganti dengan nilai rekaan. ID tidak ditemukan menghasilkan halaman tidak ditemukan dengan tautan kembali.
- Tombol Kunjungi Website Resmi mengarah ke URL HTTP(S) yang telah diperiksa pengelola. Pengguna memahami bahwa proses pendaftaran berlanjut di situs lain.
- Label rekomendasi/kecocokan tidak menyatakan jaminan lolos. Pembatasan jurusan, semester, dan IPK tetap ditampilkan pada detail.
- Peluang ditutup tetap dapat dibuka dari bookmark, dengan status ditutup; pengguna tetap dapat melihat informasi dan sumber.
- Pola `export/detailpeluang1-light.png` sampai `detailpeluang8-light.png` menjadi acuan hierarki detail: kembali/simpan, kategori, judul, penyelenggara, deadline, deskripsi/persyaratan, lalu tautan resmi. Semua contoh tanggal dan syarat perlu diverifikasi ulang sebelum masuk katalog pilot; jangan menyalin badge `10 Hari` dari PNG sebagai data.

#### US-05 / Match yang transparan / P0
Sebagai mahasiswa, saya ingin melihat alasan kecocokan agar dapat memprioritaskan peluang tanpa mengira rekomendasi sebagai jaminan kelayakan.
- MVP memakai aturan deterministik; tidak membutuhkan AI. Dimensi awal: jurusan, semester, IPK minimum, dan minat/bidang. Aturan hanya mengevaluasi syarat yang benar-benar terstruktur pada katalog.
- Untuk setiap dimensi, tampilkan Sesuai, Tidak sesuai, Belum diketahui, atau Tidak dipersyaratkan. Syarat di luar profil seperti usia/kewarganegaraan ditampilkan sebagai Perlu pemeriksaan manual dan tidak diasumsikan terpenuhi.
- Status utama Tidak sesuai bila ada syarat wajib terstruktur yang gagal; Belum dapat dinilai bila data syarat/profil penting kurang; Sesuai profil bila seluruh syarat wajib terstruktur terpenuhi. Kesesuaian minat ditampilkan terpisah dan tidak menggugurkan kelayakan wajib.
- Bila skor ditampilkan, rumus usulan: jumlah dimensi relevan yang sesuai dibagi seluruh dimensi relevan yang dapat dinilai, dikali 100%. Data belum diketahui tidak dimasukkan pembagi dan wajib ditampilkan sebagai cakupan, misalnya 2 dari 4 dimensi dinilai; skor tidak ditampilkan bila tidak ada dimensi yang dapat dinilai.
- Semua dimensi Tidak dipersyaratkan menghasilkan status Tidak ada syarat terstruktur, bukan klaim kecocokan 100%. Hasil tetap menyebutkan pemeriksaan syarat lengkap pada sumber resmi.
- Urutan rekomendasi: Sesuai profil -> Belum dapat dinilai -> Tidak ada syarat terstruktur -> Tidak sesuai. Dalam kelompok gunakan relevansi minat, kemudian deadline, kemudian ID agar stabil.
- Perubahan profil atau persyaratan memperbarui hasil. Dataset uji mencakup tepat batas IPK/semester, nilai di bawah batas, syarat terbuka semua jurusan, dan data hilang.

#### US-06 / Bookmark / P0
Sebagai mahasiswa, saya ingin menyimpan dan menghapus peluang agar shortlist saya dapat dibuka kembali.
- Tombol simpan pada kartu/detail memperbarui status visual dan daftar Tersimpan untuk akun yang sama.
- Pasangan pengguna-peluang unik; klik ulang atau pengiriman ulang tidak menambah duplikasi. Hapus bookmark tidak menghapus katalog.
- Filter Semua/Magang/Beasiswa/Bootcamp hanya menampilkan bookmark akun aktif. Refresh/login ulang mempertahankan perubahan.
- Gagal menyimpan menampilkan pesan dan tombol coba lagi; UI tidak menyatakan sukses sebelum data tersimpan atau harus mengembalikan perubahan optimistis yang gagal.
- Menghapus bookmark dengan progres pendaftaran meminta konfirmasi yang menjelaskan bahwa catatan tracker terkait juga akan dihapus.

#### US-07 / Tracker dan kalender / P0
Sebagai mahasiswa, saya ingin memantau deadline dan status peluang tersimpan agar dapat mengatur tindak lanjut pendaftaran.
- Saat disimpan, status awal Tertarik. Pengguna dapat mengubahnya menjadi Sedang disiapkan, Sudah mendaftar, Diterima, Ditolak, atau Tidak dilanjutkan; status dapat dikoreksi dan waktu perubahan dicatat.
- Status pendaftaran adalah catatan manual pengguna; NAVIKA tidak mengklaim sudah mengirim aplikasi atau menerima hasil dari penyelenggara.
- Kalender menampilkan deadline bookmark berdasarkan tanggal pilihan, mendukung bulan sebelumnya/berikutnya, dan membuka detail yang sesuai. Tampilan daftar menjadi alternatif aksesibel.
- Strip tanggal pada Home dan kalender bulanan penuh pada `export/kalender-light.png` memakai sumber data dan status seleksi yang sama. Memilih tanggal menampilkan agenda tanggal tersebut; tanggal tanpa agenda menampilkan pesan kosong yang jelas. Indikator kategori tetap memiliki teks/label, bukan hanya titik warna.
- Deadline lewat tidak otomatis berarti pengguna ditolak. Kalender menandai tenggat lewat secara terpisah dari status pendaftaran.
- Countdown memakai satu sumber waktu yang sama dengan detail. Setelah deadline, tampilkan Ditutup; tepat pada tanggal tenggat tampilkan Hari ini bila batas waktunya belum lewat.
- Tanggal tanpa jam tidak diasumsikan memiliki jam penutupan resmi. Untuk tampilan tanggal, gunakan zona tampilan pengguna (default Asia/Jakarta); untuk data tanggal saja pertahankan tanggal sumber dan tampilkan Jam penutupan belum tersedia. Jangan mengirim pengingat berbasis jam tanpa aturan yang dinyatakan.
- Jika deadline tidak diketahui, tampilkan Belum diumumkan dan masukkan ke daftar tanpa tanggal, bukan hari kalender rekaan.

#### US-08 / Pemeliharaan katalog / P0
Sebagai pengelola konten, saya ingin memperbarui data peluang agar informasi pengguna konsisten dengan sumber yang diperiksa.
- MVP dapat menggunakan seed/import terkontrol oleh tim; dashboard admin khusus belum diwajibkan. Mekanisme perubahan harus membatasi hak tulis ke pengelola dan memvalidasi seluruh entri sebelum terbit.
- Data terbit wajib memiliki ID stabil, kategori valid, penyelenggara, URL sumber, waktu verifikasi, serta deadline atau penanda deadline belum diumumkan.
- Pengelola dapat mengubah status Draft, Terbit, Ditutup, atau Diarsipkan. Entitas yang sudah dibookmark diarsipkan dengan penjelasan, bukan menghilang tanpa konteks.
- Perubahan satu entri tercermin pada daftar, detail, match, bookmark, dan kalender. Catatan perubahan menyimpan pelaku/waktu serta bagian yang berubah.
- Sebelum pilot, tinjau seluruh entri; selama pilot usulkan tinjauan mingguan dan pemeriksaan tambahan pada peluang yang mendekati deadline. Pemilik proses perlu ditetapkan.

#### US-09 / Preferensi dan pengingat / P1
Sebagai mahasiswa, saya ingin mengatur tampilan dan pengingat agar nyaman menggunakan NAVIKA dan dapat menindaklanjuti tenggat.
- Tema Terang/Gelap/Ikut Sistem diterapkan ke seluruh halaman dan tersimpan; mode sistem mengikuti preferensi perangkat bila tidak ada pilihan manual.
- Email pengingat bersifat opt-in, hanya untuk bookmark aktif yang belum berstatus final. Usulan awal H-3 mengikuti label `Deadline Terdekat` pada `export/notifikasi-light.png`; frekuensi dan kanal akhir disepakati setelah pilot. Pengguna dapat mematikan pengingat setiap saat. Push, ringkasan mingguan, dan pesan mentor belum menjadi komitmen P1.
- Job pengingat tidak menghasilkan pengiriman ganda untuk kombinasi akun, peluang, jenis pengingat, dan versi deadline. Jika deadline berubah, antrean lama dibatalkan/dijadwalkan ulang.
- Peluang ditutup, diarsipkan, atau tanpa deadline yang dapat dijadwalkan tidak dikirimi pengingat; kesalahan pengiriman dapat dicoba ulang dan dipantau.

### 2.5 Pemetaan layar `export/` ke kebutuhan

Nama di bawah merujuk berkas PNG dalam `export/`; akhiran `-light` dan `-dark` adalah dua varian visual dari layar yang sama. Prioritas mengacu pada perilaku yang harus dibangun, bukan jumlah mockup.

| Layar acuan | Perilaku yang harus dipenuhi | Prioritas / keputusan |
| --- | --- | --- |
| `discover`, `register`, `login`, `verif`, `login-validationerror`, `errorlogin` | Masuk/daftar, validasi, dan status verifikasi yang benar | P0; Google sign-in P1 |
| `dashboard`, `lihat-semua`, `empty-state` | Ringkasan agenda, daftar, pencarian/filter, kartu, dan hasil kosong | P0; badge rekomendasi harus punya dasar Match |
| `detailpeluang1`-`detailpeluang8` | Delapan contoh konten memakai satu template detail dan URL resmi | P0; setiap entri diaudit sebelum terbit |
| `bookmark`, `bookmark-magang`, `bookmark-beasiswa`, `bookmark-bootcamp` | Daftar simpan dan filter kategori dari data akun yang sama | P0 |
| `kalender` | Kalender bulanan dan agenda tanggal yang dipilih | P0; status manual dilengkapi pada alur tracker meski belum tampak di PNG |
| `profile`, `editprofile`, `pengaturan` | Data akun konsisten, edit profil, akses keluar | P0 untuk profil/keluar; menu lain sesuai fase fitur |
| `changemode`, `notifikasi` | Pilihan Terang/Gelap/Ikut Sistem dan preferensi pengingat | P1; pratinjau dan toggle harus mencerminkan status nyata |
| `privasi`, `bahasa`, `bantuan`, `tentang` | Rancangan pengaturan/dukungan tambahan | P2/TBD; jangan tampilkan klaim 2FA, mentor, CV upload, profil publik, dukungan, versi, atau Play Store tanpa layanan nyata |

Pratinjau utama: [Home terang](export/dashboard-light.png), [Home gelap](export/dashboard-dark.png), [pencarian](export/lihat-semua-light.png), [hasil kosong](export/empty-state-light.png), [detail](export/detailpeluang1-light.png), [Tersimpan](export/bookmark-light.png), [Kalender](export/kalender-light.png), [Profil](export/profile-light.png), dan [Pengaturan](export/pengaturan-light.png). Pasangan tema dan variasi detail lain tersedia dengan pola nama yang sama di `export/`.

### 2.6 UI/UX, design system, dan aksesibilitas

#### Design system acuan dari laporan Tugas Modul 5

Design system berikut diambil langsung dari laporan prototype Kelompok 8 (halaman 5-6). Terapkan sebagai token terpusat agar semua halaman dan komponen konsisten. Jika token pada file Figma sumber berbeda dari tabel laporan, tim harus menyelesaikan perbedaan melalui review bersama sebelum implementasi final.

**Typography**
| Elemen | Ketentuan |
| --- | --- |
| Font family | Poppins |
| Heading utama | 26px |
| Heading/subheading | 24px |
| Body/informasi utama | 16px |
| Caption/label/informasi kecil | 10px |

**Color tokens — Light Mode**
| Token/penggunaan | Hex |
| --- | --- |
| Background / Primary | `#FFFFFF` |
| Primary / Theme Blue | `#00A6E0` |
| Primary Dark / Accent | `#0067A6` |
| Bootcamp | `#E37EFD` |
| Magang | `#FF8A3D` |
| Beasiswa | `#228F51` |
| Purple / Status | `#230DC5` |
| Danger / Deadline | `#FF0105` |
| Text Dark | `#090909` |
| Secondary Text | `#85929E` |

**Color tokens — Dark Mode**
| Token/penggunaan | Hex |
| --- | --- |
| Background / Primary | `#0D1317` |
| Primary / Theme Dark Blue | `#1A4960` |
| Primary Accent | `#0067A6` |
| Bootcamp | `#E37EFD` |
| Magang | `#FF8A3D` |
| Beasiswa | `#228F51` |
| Purple / Status | `#230DC5` |
| Danger / Deadline | `#FF0105` |
| Text / Primary | `#FFFFFF` |
| Text / Secondary | `#D9D9D9` |

Catatan: laporan menyertakan visual reference tambahan pada halaman 7 yang memperlihatkan token seperti `#1D242B`, `#2DC9FF`, `#BBDEFB`, `#F8FAFC`, dan beberapa warna lain. Karena nilai tersebut tidak dipetakan secara eksplisit ke seluruh token semantik dalam tabel laporan, jangan menambahkannya sebagai token resmi tanpa memeriksa file Figma sumber.

#### Komponen interaktif yang menjadi acuan

Laporan Tugas Modul 5 (halaman 8) secara eksplisit mencantumkan:
- Button untuk Masuk, Daftar, Cek detail, Simpan, dan Kunjungi Website Resmi.
- Search untuk mencari peluang berdasarkan kata kunci.
- Filter dan category chip untuk Semua, Beasiswa, Magang, dan Bootcamp.
- Bookmark untuk menyimpan/menghapus peluang.
- Calendar navigation untuk berpindah tanggal/minggu dan melihat agenda.
- Bottom navigation untuk Home, Tersimpan, dan Profile.
- Theme selector untuk Terang, Gelap, atau Ikut Sistem.
- Form/input untuk Login dan Edit Profile.

Komponen tersebut adalah acuan desain prototype. Fungsionalitas produksi tetap harus memenuhi acceptance criteria pada bagian 2.4; tampilan komponen dalam Figma tidak dengan sendirinya membuktikan fungsi sudah berjalan.

- Bangun komponen bersama: navigasi, kartu peluang, badge kategori/status, filter, search, form, kalender, notifikasi hasil aksi, serta empty/error/loading state.
- Laporan Tugas Modul 5 dan frame Figma adalah acuan visual utama. Gunakan token typography dan warna pada bagian design system di atas, bukan menebak warna/font dari piksel PNG. Prototype sudah mendokumentasikan light dan dark mode; karena itu, tema terang/gelap/ikut sistem harus diperlakukan sebagai bagian dari konsistensi desain. Untuk implementasi produksi, prioritas rilis perilaku tema tetap mengikuti keputusan P1 pada backlog kecuali tim mengubah prioritas tersebut.
- Target usulan: lebar layar 360, 768, dan 1440 piksel tanpa scroll horizontal halaman. Kartu dapat disusun satu kolom di ponsel dan beberapa kolom di layar besar.
- Semua aksi utama bisa dijangkau keyboard, memiliki fokus terlihat, label form, serta nama aksesibel. Informasi status tidak disampaikan hanya melalui warna.
- Usulan ukuran target sentuh minimal 44 x 44 CSS piksel dan rasio kontras teks normal minimal 4,5:1. Kalender memiliki label tanggal dan alternatif daftar.
- Gunakan satu nama akun dari data sesi/profil. Hilangkan ketidakkonsistenan nama contoh, kategori program, dan menu aktif pada referensi HTML.
- Footer navigasi Home/Tersimpan/Profile memperlihatkan tab aktif pada halaman terkait. Pada layar panjang, konten terakhir tetap bisa digulir hingga terlihat di atas footer tetap; filter horizontal punya petunjuk dan akses keyboard.
- Untuk setiap layar P0, review keadaan default, loading, kosong, validasi, gagal jaringan, dan sukses bila relevan. Bandingkan tangkapan layar implementasi dengan PNG mode terang pada lebar mobile yang sama; catat penyimpangan yang disengaja, terutama perbaikan data/status yang keliru pada mockup. Uji juga 768/1440 piksel karena tidak ada acuan ekspor untuk ukuran tersebut.

### 2.7 Non-Goals
MVP tidak mencakup pembayaran, pengiriman lamaran/CV di NAVIKA, penilaian peluang lolos, chatbot, rekomendasi machine learning, scraping otomatis banyak situs, aplikasi native, portal penyelenggara, ataupun integrasi status seleksi real-time. Perbandingan peluang berdampingan dan kategori tambahan dievaluasi setelah alur utama teruji. Google sign-in, email pengingat, dan tema masuk P1. Fitur mentor/pesan, profil publik untuk rekruter, verifikasi dua langkah, sinkronisasi perangkat, multi-bahasa, push, dan rating toko aplikasi yang tampak pada PNG tidak termasuk janji MVP.

### 2.8 Rencana validasi
- Uji terarah dengan usulan 10 mahasiswa lintas semester: daftar/masuk, isi profil, cari magang sesuai profil, baca detail, simpan, ubah status, dan temukan deadline pada kalender.
- Ukur KPI-01/02/04, jumlah kesalahan, jumlah bantuan, dan titik kebingungan. Siapkan satu dataset serta skenario yang sama agar hasil dapat dibandingkan.
- UAT mencakup akun berbeda, sesi kedaluwarsa, email belum terverifikasi, profil kosong, hasil kosong, deadline lewat, tanggal tanpa jam, data katalog berubah, dan kegagalan penyimpanan.
- Uji visual khusus `export/`: validasi field dan kredensial salah, layar tautan dikirim versus akun aktif, filter hasil kosong, konsistensi nama/profil, tab aktif, kalender/agenda, dan kartu panjang di atas footer. Pastikan tanggal detail, badge countdown, strip Home, serta kalender menampilkan hasil yang sama untuk satu entri.
- Pengujian integrasi membuktikan isolasi data akun serta persistensi. Uji end-to-end memeriksa satu alur lengkap; unit test berfokus pada aturan match, deadline, validasi, dan transisi data yang berisiko.
- Rilis MVP hanya bila seluruh AC P0 lulus, tidak ada bug yang menghambat alur utama, katalog pilot lolos audit, serta target usability telah dinilai. Jika hasil di bawah target, iterasi masalah utama sebelum memperluas pengguna.

## 3. AI System Requirements (If Applicable)

### 3.1 Keputusan MVP
AI tidak diperlukan. Match adalah evaluasi aturan yang dapat dijelaskan, sesuai data profil dan persyaratan terstruktur. Tidak ada kebutuhan API model, embedding, pelatihan model, atau anggaran token pada MVP.

### 3.2 Tool Requirements dan Evaluation Strategy
Tool/API yang diperlukan adalah autentikasi, akses katalog, profil, bookmark, tracker, serta layanan email transaksional untuk verifikasi/pemulihan akses; penyedianya TBD. Evaluasi Match memakai fixture input-output yang ditinjau tim: 100% kasus aturan yang disepakati harus memberikan status dan alasan yang benar. Ketepatan data sumber diperiksa terpisah dari ketepatan algoritma.

AI pada fase lanjut hanya dipertimbangkan jika pengujian menunjukkan aturan tidak mencukupi. Sebelum memasukkannya ke scope, tetapkan manfaat terukur, dataset evaluasi, persetujuan penggunaan data, biaya, dan fallback; keluaran tidak boleh dipakai sebagai keputusan kelayakan resmi.

## 4. Technical Specifications

### 4.1 Architecture Overview
Stack dikonfirmasi: Next.js + CSS. Usulan implementasi memakai App Router dan CSS Modules untuk komponen dengan global CSS untuk token/reset. TypeScript bersifat usulan; versi framework/runtime, penyedia hosting, database, dan autentikasi ditetapkan saat kickoff tanpa mengasumsikan versi terbaru tertentu.

Aliran data: Browser -> halaman/komponen Next.js -> lapisan server yang memeriksa sesi dan validasi -> database -> layanan Match -> respons UI. Situs penyelenggara diakses melalui tautan resmi. Layanan email dipanggil dari server; pengingat P1 dijalankan oleh scheduler.

- Rendering dan pembacaan data dipilih per halaman; operasi personal berada di server dan selalu memeriksa kepemilikan akun.
- Komponen client dipakai untuk interaksi filter, form, bookmark, dan kalender seperlunya. Rahasia/integrasi server tidak masuk bundle browser.
- Satu modul katalog dan satu modul perhitungan deadline/match dipakai bersama agar halaman tidak memiliki salinan data/aturan yang berbeda.
- PostgreSQL adalah kandidat penyimpanan relasional, bukan keputusan final. Penyedia autentikasi terkelola dapat dipilih setelah menilai kebutuhan email, sesi, dan pemulihan akses.
- Frontend-only dengan localStorage dapat dipakai untuk demonstrasi sementara; belum memenuhi AC akun, persistensi lintas perangkat, dan isolasi data MVP fungsional.

### 4.2 Model data usulan

| Entitas | Data inti dan aturan |
| --- | --- |
| User/Auth | ID, email unik, status verifikasi, metadata sesi; kredensial ditangani penyedia auth atau penyimpanan hash yang sesuai |
| Profile | user_id unik, nama, universitas, jurusan, semester, IPK nullable, minat, updated_at |
| Opportunity | ID stabil, judul, penyelenggara, kategori, ringkasan, deskripsi, manfaat, source_url, verified_at, status terbit |
| EligibilityRule | opportunity_id, jurusan diizinkan/semua, rentang semester, IPK minimum, tag bidang, teks syarat lain; bedakan tidak disyaratkan dan tidak diketahui |
| Deadline | opportunity_id, tanggal sumber, jam nullable, zona sumber nullable, instant UTC bila diketahui, presisi tanggal/jam, status belum diumumkan |
| SavedOpportunity | user_id + opportunity_id unik, saved_at, application_status, status_updated_at; peluang yang diarsipkan tetap dapat dirujuk |
| Preference | user_id, tema, pilihan pengingat; hanya aktif ketika fitur terkait dirilis |
| AuditEvent | pengelola, entitas, tindakan, waktu, ringkasan perubahan; tidak memuat kredensial atau profil lengkap |

Skema persyaratan perlu mendukung informasi tidak lengkap tanpa menghasilkan rekomendasi palsu. Migrasi skema dan seed contoh terpisah dari data produksi. Jangan memakai data profil contoh di HTML sebagai data pengguna nyata.

### 4.3 Integration Points dan kontrak logis
Berikut kontrak logis; dapat diwujudkan melalui Route Handlers atau Server Actions. Nama endpoint bukan keputusan final.

| Operasi | Input | Hasil dan aturan |
| --- | --- | --- |
| List/detail peluang | q, kategori, bidang, semester, status, sort, page / ID | Data terbit, pagination, informasi sumber; ID hilang menghasilkan 404 |
| Read/update profil | Sesi dan field tervalidasi | Profil akun aktif; field/ID akun lain dari klien tidak dipercaya |
| Evaluate match | Profil pemilik sesi + aturan peluang | Status, alasan per dimensi, cakupan evaluasi; aturan yang sama di daftar/detail |
| Save/remove bookmark | Sesi + opportunity_id | Idempoten; tidak membuat duplikasi; hapus mematuhi AC konfirmasi progres |
| Update tracker | Sesi + saved ID + status valid | Hanya milik akun; status enum; waktu pembaruan dari server |
| Kalender | Sesi + rentang tanggal | Deadline bookmark akun aktif; peluang tanpa tanggal dipisahkan |
| Publish/update katalog | Hak pengelola + data tervalidasi | Pembaruan atomik, audit, invalidasi cache yang relevan |

Kode respons/logika kesalahan membedakan belum masuk, tidak berhak, data tidak valid, tidak ditemukan, dan gangguan server. UI menampilkan pesan yang dapat ditindaklanjuti serta opsi coba lagi bila sesuai. Operasi tulis tidak menggunakan GET.

### 4.4 Security & Privacy
- Setiap akses profil, bookmark, dan tracker memverifikasi sesi serta kepemilikan pada server; ID dari browser tidak cukup sebagai otorisasi. Uji dua akun menjadi syarat rilis.
- Gunakan HTTPS saat deployment. Cookie sesi diberi pengaturan keamanan yang sesuai, masa berlaku jelas, dan perlindungan pemalsuan permintaan mengikuti mekanisme auth yang dipilih.
- Batasi percobaan login, verifikasi, dan reset. Validasi/sanitasi konten dan URL katalog; jangan merender HTML sumber tanpa penanganan aman.
- Simpan hanya data yang diperlukan. IPK bersifat opsional, profil tidak publik, dan data akademik tidak diberikan ke penyelenggara lewat tautan pendaftaran.
- Jangan menempatkan email/kata sandi pada query URL seperti navigasi formulir contoh. Jangan mencatat data sensitif dalam analitik/error log.
- Sebelum pilot akun nyata, sediakan penjelasan penggunaan data, kontak pengelola, serta mekanisme permintaan akses/perbaikan/penghapusan akun. Penghapusan menghapus profil, bookmark, dan tracker sesuai kebijakan retensi yang ditetapkan tim.
- Retensi data aktif, backup, log, lokasi penyimpanan, dan penanggung jawab privasi: TBD sebelum produksi. Bagian ini merupakan kebutuhan desain, bukan klaim sertifikasi/kepatuhan hukum.

### 4.5 Non-functional requirements
Target di bawah merupakan usulan baseline; sesuaikan setelah pengukuran dan keputusan hosting.

| Area | Target | Kondisi verifikasi |
| --- | --- | --- |
| Respons pencarian | p95 <=1 detik pada lapisan server | Dataset 1.000 peluang, 20 pengguna serentak, di lingkungan staging yang dicatat |
| Respons simpan/status | p95 <=1 detik dari permintaan hingga respons | Beban staging yang sama; kegagalan tidak menghilangkan data lama |
| Tampilan awal | Konten utama dashboard terlihat <=3 detik pada pengujian terkontrol | Catat perangkat, profil jaringan, cache, dan 5 kali pengukuran; bukan klaim hasil saat ini |
| Responsif | Tidak ada scroll horizontal halaman pada 360/768/1440 px | Uji kartu, form, navigasi, detail, dan kalender |
| Kompatibilitas | Alur utama lulus pada Chrome, Edge, Firefox desktop dan Chrome Android | Versi browser yang benar-benar diuji dicatat pada laporan rilis |
| Pemulihan | Backup otomatis dan satu simulasi restore staging berhasil | Frekuensi, retensi, dan sasaran kehilangan data ditentukan bersama penyedia sebelum produksi |
| Observabilitas | Error server, gagal login, serta gagal simpan dapat ditelusuri | Log memiliki waktu/request ID tanpa kata sandi atau profil akademik lengkap |

### 4.6 Migrasi dari referensi HTML
1. Inventarisasi halaman dan petakan ke route: /, /masuk, /daftar, /verifikasi, /dashboard, /peluang, /peluang/[id], /tersimpan, /kalender, /profil, /profil/edit, /pengaturan.
2. Satukan kartu, navigasi, dan form menjadi komponen; pindahkan isi contoh ke seed katalog terstruktur. Jangan menyamakan nama file dengan ID bisnis.
3. Normalisasi kategori dan penyelenggara; gabungkan entri duplikat. Audit delapan contoh detail pada `export/` terhadap tujuh halaman detail HTML, termasuk KIP Kuliah/LPDP yang berbeda audiens. Cek semua URL resmi serta tanggal aktual sebelum pilot; tanggal dan countdown contoh pada PNG tidak otomatis dianggap valid.
4. Implementasikan auth, profil, Finder, Match, bookmark, dan tracker secara bertahap. Hapus tautan placeholder serta tautan ke file yang belum ada dari jalur pengguna.
5. Cocokkan layar P0 terhadap PNG `export/` pada ukuran mobile, lalu validasi token dan komponen terhadap Figma saat tersedia. Jalankan UAT dan pengukuran KPI; perbedaan yang memperbaiki contoh keliru dicatat pada review desain.

## 5. Risks & Roadmap

### 5.1 Phased Rollout
Roadmap memakai gerbang hasil, bukan tanggal komitmen, karena kapasitas tim dan tenggat belum ditentukan.

| Fase | Hasil | Gerbang selesai |
| --- | --- | --- |
| Fondasi | Audit `export/` dan frame Figma, backlog P0, skema data, keputusan auth/DB/hosting, katalog pilot | Tim menyetujui cakupan audiens, layar acuan, pemilik konten, serta keputusan teknis yang masih TBD |
| MVP - Finder + Match + Tracker | Next.js/CSS, akun, profil, katalog, search/filter, detail, rule-based match, bookmark, kalender, status manual | Semua AC P0 lulus; isolasi akun dan persistensi terbukti; audit katalog selesai |
| Pilot dan iterasi | Uji mahasiswa, evaluasi KPI, perbaikan usability dan performa | Laporan hasil aktual tersedia dan penghambat alur utama diselesaikan |
| v1.1 | Tema, Google sign-in bila dibutuhkan, pengingat email opt-in, perbaikan pengelolaan konten | Keandalan pengiriman/preferensi diuji; prioritas dikonfirmasi dari temuan pilot |
| v2.0 | Kategori tambahan, perbandingan, integrasi sumber/portal penyelenggara bila layak | Bukti kebutuhan, izin integrasi, biaya, dan PRD tambahan disepakati; AI tetap opsional |

Urutan dependensi: katalog terstruktur + akun -> profil/Finder -> Match/bookmark -> tracker/kalender -> pengingat. Pekerjaan visual dapat berjalan setelah desain utama tervalidasi. Durasi dan penanggung jawab per fase diisi ketika tim menyepakati kapasitas; dokumen ini tidak menetapkan tanggal selesai.

### 5.2 Risks dan mitigasi

| Risiko | Dampak | Mitigasi dan bukti sebelum rilis |
| --- | --- | --- |
| Informasi sumber berubah | Pengguna memakai syarat/deadline lama | Tautan sumber, verified_at, review katalog terjadwal, status ditutup/diarsipkan |
| Match dianggap jaminan diterima | Keputusan pengguna keliru | Alasan per dimensi, data belum diketahui, batas cakupan, instruksi periksa syarat resmi |
| Bookmark hanya berganti halaman | Pengguna mengira data tersimpan | Mutasi persisten, feedback sukses/gagal, uji refresh/login ulang |
| Tanggal dan countdown tidak konsisten | Deadline terlewat | Satu model deadline, presisi tanggal/jam, zona sumber, uji batas hari dan tanggal lewat |
| Profil terbaca akun lain | Kebocoran data akademik | Otorisasi server dan uji dua akun pada semua operasi personal |
| Ketergantungan auth/email gagal | Pengguna tidak dapat mengakses akun | Penanganan error, kirim ulang terbatas, pemantauan penyedia, uji pemulihan |
| Token dan state Figma belum disepakati | Penyimpangan visual dan pengerjaan ulang | Review berkas sumber bersama sebelum menyepakati token serta acceptance visual |
| Mockup memuat data/status yang tidak konsisten | Countdown salah, verifikasi membingungkan, atau identitas pengguna berbeda | Gunakan satu sumber data; uji silang detail/Home/kalender; pisahkan status tautan dikirim dan akun aktif |
| Kontrol desain mendahului layanan | Pengguna mengira fitur mentor, push, 2FA, atau dukungan sudah tersedia | Sembunyikan/nonaktifkan sampai ada alur dan layanan nyata; tinjau setiap menu saat rilis |
| Scope membesar ke semua kategori/integrasi | MVP tertunda | Fokus tiga kategori dan alur P0; perlu persetujuan perubahan backlog |

### 5.3 Keputusan terbuka untuk kickoff
- Tentukan penyedia autentikasi, database, hosting, layanan email, dan versi Next.js/runtime; Next.js + CSS sudah dikonfirmasi.
- Tetapkan pengelola katalog, reviewer desain, penanggung jawab privasi, reviewer UAT, kapasitas tim, anggaran, dan tanggal target.
- Sepakati target KPI usulan, rumus/urutan Match, daftar minat, dataset pilot, kebijakan retensi, dan SLA pembaruan konten.
- Tinjau berkas Figma sumber bersama tim; sepakati token, frame mobile, dan perilaku tablet/desktop yang belum terlihat pada `export/`.
- Putuskan apakah peluang untuk calon mahasiswa (KIP Kuliah) dan pascasarjana (LPDP) masuk katalog pilot; selaraskan persona, filter, dan aturan Match dengan keputusan itu.
- Putuskan kanal/frekuensi pengingat P1. PNG menampilkan H-3, push, dan ringkasan mingguan; draft ini hanya mengusulkan email H-3 untuk bookmark.

### 5.4 Referensi dan traceability
R1 - Materi Design Thinking Kelompok 8: target pengguna, empathy map, problem statement, Finder + Match + Tracker, user flow, serta kriteria usability >=80%. Lokasi bersama: TBD.
Lokasi bersama: TBD; unggah ke penyimpanan tim dan tambahkan tautannya di sini.

R2 - Repositori NAVIKA, pemeriksaan statis 22 halaman HTML. `login.html` dan `register.html` menggunakan navigasi formulir GET; bookmark berisi kartu contoh; `dashboard.html` dan `lihatSemua.html` menyediakan tautan detail dan beberapa tujuan yang belum tersedia; kalender memakai tanggal contoh; profil/pengaturan/tema menyediakan rancangan struktur akun.
Lokasi: berkas HTML pada akar repositori ini.

R3 - Berkas Figma sumber `Kelompok 8 Navika.fig`: frame asli, prototipe, dan token desain masih perlu ditinjau dan disepakati tim. PNG ekspor pada R5 memberi bukti visual mobile yang dapat dipakai sementara.
Lokasi bersama: TBD; tambahkan tautan berkas sumber yang dapat diakses seluruh tim.

R4 - Arah awal pengembangan yang tercatat pada draft 16 Oktober 2026: Next.js dan CSS; target serta tenggat belum ditetapkan. Status: perlu pengesahan tim.

R5 - `export/`: PNG layar NAVIKA terang/gelap, termasuk alur akun, Home, daftar dan delapan detail peluang, bookmark, kalender, empty state, profil, dan pengaturan. Diperiksa sebagai referensi visual; teks, tanggal, identitas, serta kontrol contoh belum diverifikasi sebagai data atau fungsi produksi.

R6 - Laporan Tugas Modul 5 — Rancang Prototipe Siap Produksi, Kelompok 8 Web & UI/UX Developer, 8 halaman. Menjadi dasar untuk deskripsi proyek/tujuan (hal. 1), user flow dan inventaris layar (hal. 2), dokumentasi variasi light/dark (hal. 3-4), typography dan token warna (hal. 5-6), visual reference (hal. 7), serta interactive components (hal. 8). Link Figma yang dicantumkan dalam laporan: https://www.figma.com/design/SD9ZLtfASaAoMpCW1r2k0I/Kelompok-8Navika.
Lokasi: `export/` pada repositori ini. Matriks layar dan prioritas terdapat di bagian 2.5.

| Kebutuhan | Dasar | Status dalam PRD |
| --- | --- | --- |
| Akun/profil | R1 user flow; R2 halaman akun/profil | US-01/02; fungsionalitas persisten diusulkan |
| Finder/detail | R1 Finder; R2 dashboard/daftar/detail | US-03/04 |
| Match | R1 Match dan match score; R2 label rekomendasi | US-05; aturan dan rumus diusulkan |
| Bookmark/tracker | R1 simpan/deadline/status; R2 bookmark/kalender | US-06/07 |
| Katalog | R1 database peluang; R2 data berulang di HTML | US-08; proses pengelolaan diusulkan |
| Tema/pengingat | R1 reminder; R2 tema/pengaturan | US-09, P1 |
| Next.js + CSS | R4 | Keputusan stack; arsitektur rinci masih usulan |
| KPI usability >=80% | R1 | Target referensi, bukan hasil uji aktual |
| Hierarki layar dan state akun | R5 | US-01, pemetaan 2.5, kriteria visual 2.6 |
| Home, pencarian, detail, simpan, kalender | R5 | US-03/04/06/07; data contoh tetap perlu audit |
| Pengaturan di luar MVP | R5/R6 | US-09/P1, sisanya P2/TBD sesuai 2.7 |
| Design system typography dan warna | R6 halaman 5-6 | Token acuan ditambahkan ke bagian 2.6; cek silang dengan file Figma sumber |
| Komponen interaktif | R6 halaman 8 | Inventaris komponen ditambahkan ke bagian 2.6; fungsi produksi tetap mengikuti acceptance criteria |

Fokus review draft: prioritas P0/P1, kejelasan aturan Match, dan kesiapan pengelolaan katalog. Ketiganya menentukan ukuran MVP dan perlu ditinjau bersama tim sebelum estimasi pengerjaan.
