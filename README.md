# NAVIKA

NAVIKA adalah prototipe web untuk mencari informasi beasiswa, magang, dan bootcamp. Proyek ini masih fokus pada frontend, jadi belum memakai database atau sistem akun sungguhan.

## Menjalankan proyek

Pastikan Node.js sudah terpasang. Jalankan perintah berikut dari folder proyek:

```powershell
npm.cmd install
npm.cmd run dev
```

Buka `http://localhost:3000` di browser.

## Fitur yang sudah ada

- Halaman daftar dan masuk untuk mencoba alur aplikasi.
- Dashboard, pencarian peluang, halaman detail, dan daftar peluang tersimpan.
- Kalender untuk melihat tenggat contoh.
- Profil dan pengaturan tema, bahasa, serta pengingat di dalam aplikasi.

Data profil, peluang tersimpan, dan pengaturan disimpan di `localStorage` browser. Form daftar dan masuk hanya untuk demo; tidak ada email verifikasi atau pemeriksaan kata sandi di server. Tanggal peluang juga masih contoh, bukan jadwal resmi penyelenggara.

Aplikasi utama ada di folder `app/`. File HTML di akar repositori adalah versi awal, sedangkan gambar di `export/` dipakai sebagai referensi desain.

Untuk memeriksa proyek, jalankan `npm.cmd test`, `npm.cmd run typecheck`, dan `npm.cmd run build`.
