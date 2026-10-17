# Prompt Perbaikan Kalender dan Filter NAVIKA

Perbaiki bagian kalender horizontal dan filter kategori NAVIKA yang saat
ini masih tidak sesuai dengan desain Figma. **Jangan membuat ulang
dashboard dan jangan mengubah bagian lain yang sudah benar.** Langsung
edit file yang sudah ada.

## File yang harus diperiksa

-   `dashboard.html`
-   `style/dashboard.css`

Periksa struktur folder dan path CSS yang benar terlebih dahulu.
Pertahankan nama file, struktur project, konten peluang, header, dan
bottom navigation yang sudah ada.

## 1. Acuan desain

Gunakan screenshot Figma kalender/filter yang telah diberikan sebagai
acuan utama.

Bagian filter harus menampilkan urutan berikut:

1.  Beasiswa
2.  Deadline
3.  Bootcamp
4.  Semua
5.  Disimpan
6.  Magang
7.  Rekomendasi

Seluruh chip berada dalam satu baris horizontal dan dapat digulir ke
samping. Jangan mengecilkan chip secara paksa agar semuanya muat di
layar.

## 2. Design system dan kode warna HEX

Gunakan **Poppins untuk seluruh teks di seluruh halaman**, tanpa
pengecualian: heading, body text, tombol, label, kalender, chip filter,
nama pengguna, kartu peluang, bottom navigation, dan caption. Jangan
gunakan Plus Jakarta Sans, Arial, atau font lain sebagai font utama.

Muat Poppins melalui Google Fonts dengan bobot yang diperlukan (misalnya
400, 500, 600, dan 700). Terapkan secara global melalui
`font-family: 'Poppins', sans-serif;` pada `body` dan pastikan elemen
form/tombol juga mewarisi font tersebut.

Definisikan warna sebagai CSS custom properties di `:root`. Gunakan HEX
berikut:

### Warna dasar dan teks

-   Background halaman: `#FFFFFF`
-   Teks utama: `#090909`
-   Teks sekunder: `#85929E`
-   Border netral: `#E5E7EB`
-   Background kartu peluang: `#5AA4D8`
-   Warna utama NAVIKA: `#00A6E0`
-   Aksen biru gelap: `#0067A6`
-   Background tanggal aktif: `#5AA4D8`
-   Background menu navigasi aktif: `#C7DDF8`
-   Warna teks/ikon menu aktif: `#3769A5`

### Warna chip filter

-   Beasiswa: `#3E5145`, teks `#FFFFFF`
-   Deadline: `#C33228`, teks `#FFFFFF`
-   Bootcamp: `#D17AEF`, teks `#FFFFFF`
-   Semua: `#080808`, teks `#FFFFFF`
-   Disimpan: `#3217C9`, teks `#FFFFFF`
-   Magang: `#EC914A`, teks `#FFFFFF`
-   Rekomendasi: `#D9D9D9`, teks `#FFFFFF`

### Warna indikator agenda

-   Beasiswa: `#3E5145`
-   Deadline: `#C33228`
-   Bootcamp: `#D17AEF`
-   Magang: `#EC914A`
-   Disimpan/status ungu: `#3217C9`
-   Indikator hitam tambahan, hanya jika dibutuhkan oleh desain:
    `#080808`

Warna chip di atas diambil sebagai perkiraan visual dari screenshot
Figma. Gunakan warna tersebut untuk mencocokkan tampilan referensi.
Jangan mengganti warna kategori dengan warna lain tanpa alasan.

## 3. Kalender horizontal

Buat deretan tanggal seperti desain referensi. Setiap kartu
menampilkan: - Angka tanggal besar dan tebal. - Singkatan hari di bawah
angka. - Titik indikator agenda di bagian bawah. - Latar putih untuk
tanggal biasa. - Latar biru untuk tanggal yang dipilih. - Sudut membulat
dan garis tepi tipis.

Gunakan tanggal dan nama hari Oktober 2026 yang benar:

-   12 Sen
-   13 Sel
-   14 Rab
-   15 Kam
-   16 Jum
-   17 Sab
-   18 Min
-   19 Sen
-   20 Sel
-   21 Rab
-   22 Kam
-   23 Jum
-   24 Sab
-   25 Min

**Penting:** tanggal 12 Oktober 2026 adalah Senin dan tanggal 13 adalah
Selasa. Jangan menyalin pasangan tanggal/hari yang salah dari
implementasi lama atau screenshot.

## 4. Proporsi dan jarak

Sesuaikan kalender dengan referensi: - Semua kartu tanggal memiliki
lebar dan tinggi konsisten. - Angka tanggal besar, tebal, dan berada di
tengah. - Nama hari tepat di bawah angka dengan jarak konsisten. - Titik
indikator agenda berada di tengah bawah kartu. - Jarak horizontal
antarkartu seragam. - Kartu tanggal aktif tidak lebih besar atau lebih
kecil daripada kartu lainnya. - Kalender dapat digulir horizontal tanpa
membuat seluruh halaman melebar. - Hindari scrollbar besar atau dekorasi
scrollbar yang tidak ada di Figma.

Gunakan CSS responsif agar kalender tetap proporsional pada layar
360--430 px maupun desktop.

## 5. Warna indikator agenda

Gunakan warna indikator sesuai kategori yang sudah ditentukan pada
bagian HEX. Titik harus berbentuk lingkaran, berukuran konsisten, dan
memiliki jarak yang sama. Jika sebuah tanggal memiliki lebih dari satu
agenda, tampilkan titik-titik berdampingan dengan rapi.

## 6. Tanggal aktif dan hover

-   Tanggal aktif menggunakan latar `#5AA4D8` dan teks putih `#FFFFFF`.
-   Tanggal nonaktif menggunakan latar `#FFFFFF` dan teks `#090909`.
-   Hover pada tanggal nonaktif boleh memberikan latar biru muda
    `#EAF5FC`.
-   Hover tidak boleh mengalahkan tampilan tanggal aktif.
-   Tambahkan transisi halus sekitar 150--200 ms.
-   Jangan menggunakan transform yang membuat kartu tanggal bergeser
    atau mengubah ukuran layout.

## 7. Filter kategori dan hover

Gunakan warna chip sesuai HEX di bagian 2 dan urutan yang sudah
ditentukan.

Saat hover: - Berikan perubahan brightness yang halus. - Jangan mengubah
ukuran chip. - Jangan mengubah urutan chip. - Jangan menghilangkan warna
dasar kategori. - Gunakan `cursor: pointer` hanya pada elemen yang
memang berperan sebagai tautan atau kontrol.

## 8. Batasan teknis

-   Gunakan HTML5 dan CSS3 saja.
-   Jangan menambahkan JavaScript, framework, atau dependency.
-   Jangan membuat file kalender baru.
-   Jangan mengubah bagian dashboard lain yang tidak berkaitan dengan
    kalender/filter.
-   Pertahankan class yang sudah ada jika memungkinkan.
-   Jika perlu mengganti class, perbarui HTML dan CSS terkait secara
    konsisten.
-   Pastikan stylesheet menggunakan path yang benar.
-   Terapkan Poppins secara menyeluruh, termasuk tombol, input, select,
    dan elemen form.

## 9. Pemeriksaan akhir

Sebelum selesai: 1. Periksa urutan dan nama hari untuk semua tanggal. 2.
Pastikan filter memuat ketujuh chip dalam urutan yang ditentukan. 3.
Pastikan titik agenda berada di bawah tanggal dan rata tengah. 4.
Pastikan tidak ada overflow horizontal pada halaman utama; hanya baris
kalender dan filter yang boleh digulir horizontal. 5. Pastikan semua
teks memakai Poppins. 6. Periksa seluruh warna HEX dan pastikan
konsisten dengan variabel CSS. 7. Periksa tampilan mobile dan desktop.
8. Laporkan bagian HTML/CSS yang diubah.

**Langsung perbaiki `dashboard.html` dan `style/dashboard.css` yang
sudah ada. Jangan hanya memberi instruksi, jangan membuat ulang halaman,
dan jangan mengubah komponen lain yang sudah benar.**
