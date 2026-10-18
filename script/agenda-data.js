/* script/agenda-data.js
   Data agenda bersama untuk dashboard.js dan kalender.js.
   Semua tanggal dan entri adalah contoh prototipe, bukan data nyata
   (PRD-NAVIKA.md §2.8 dan §4.2). */

var NAVIKA_AGENDA = (function () {

  var NAMA_HARI   = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
  var NAMA_HARI_P = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  var NAMA_BULAN  = ["Januari","Februari","Maret","April","Mei","Juni",
                     "Juli","Agustus","September","Oktober","November","Desember"];

  /* warna → label kategori */
  var KATEGORI = {
    hijau:  "Beasiswa",
    merah:  "Deadline",
    pink:   "Bootcamp",
    oranye: "Magang",
    ungu:   "Disimpan",
    hitam:  "Umum"
  };

  /* Data agenda per tanggal. Kunci: "YYYY-MM-DD". */
  var DATA = {
    "2026-09-08": [
      { warna:"hijau",  judul:"Djarum Beasiswa Plus",            jenis:"Buka pendaftaran" }
    ],
    "2026-09-17": [
      { warna:"merah",  judul:"Beasiswa Bank Indonesia",          jenis:"Batas pendaftaran" },
      { warna:"pink",   judul:"AI-Enhanced Full Stack Developer", jenis:"Buka pendaftaran" }
    ],
    "2026-10-12": [
      { warna:"hijau",  judul:"Beasiswa KIP Kuliah",              jenis:"Buka pendaftaran" }
    ],
    "2026-10-13": [
      { warna:"merah",  judul:"Magang Bakti BCA",                 jenis:"Batas pendaftaran" },
      { warna:"hitam",  judul:"Djarum Beasiswa Plus",             jenis:"Pengumuman" }
    ],
    "2026-10-14": [
      { warna:"pink",   judul:"AI-Enhanced Full Stack Developer", jenis:"Seleksi berkas" }
    ],
    "2026-10-15": [
      { warna:"hijau",  judul:"Beasiswa Bank Indonesia",          jenis:"Seleksi berkas" }
    ],
    "2026-10-16": [
      { warna:"ungu",   judul:"Magang Data Analyst",              jenis:"Wawancara" }
    ],
    "2026-10-18": [
      { warna:"pink",   judul:"AI-Enhanced Full Stack Developer", jenis:"Buka pendaftaran" }
    ],
    "2026-10-19": [
      { warna:"ungu",   judul:"Magang Generasi Bertalenta",       jenis:"Batas unggah berkas" },
      { warna:"pink",   judul:"AI-Enhanced Full Stack Developer", jenis:"Pengumuman" }
    ],
    "2026-10-20": [
      { warna:"hitam",  judul:"Beasiswa KIP Kuliah",              jenis:"Pengumuman" },
      { warna:"ungu",   judul:"Magang Bakti BCA",                 jenis:"Wawancara" }
    ],
    "2026-10-21": [
      { warna:"oranye", judul:"Magang Data Analyst",              jenis:"Batas lamaran" }
    ],
    "2026-10-23": [
      { warna:"oranye", judul:"Magang Generasi Bertalenta",       jenis:"Batas lamaran" },
      { warna:"merah",  judul:"Web Dev & UI/UX",                  jenis:"Batas pendaftaran" },
      { warna:"pink",   judul:"AI-Enhanced Full Stack Developer", jenis:"Batas pendaftaran" }
    ],
    "2026-10-25": [
      { warna:"pink",   judul:"AI-Enhanced Full Stack Developer", jenis:"Mulai kegiatan" }
    ],
    "2026-11-05": [
      { warna:"oranye", judul:"Web Dev & UI/UX",                  jenis:"Batas lamaran" }
    ],
    "2026-11-12": [
      { warna:"hijau",  judul:"Beasiswa KIP Kuliah",              jenis:"Seleksi berkas" },
      { warna:"merah",  judul:"Magang Bakti BCA",                 jenis:"Batas pendaftaran" }
    ],
    "2026-11-19": [
      { warna:"ungu",   judul:"Magang Data Analyst",              jenis:"Wawancara" }
    ],
    "2026-12-02": [
      { warna:"pink",   judul:"AI-Enhanced Full Stack Developer", jenis:"Buka pendaftaran" }
    ],
    "2026-12-15": [
      { warna:"hijau",  judul:"Djarum Beasiswa Plus",             jenis:"Pengumuman" }
    ],
    "2026-12-31": [
      { warna:"hitam",  judul:"Beasiswa Bank Indonesia",          jenis:"Pengumuman" }
    ]
  };

  /* ---- helper ---- */

  function dua(n) { return n < 10 ? "0" + n : String(n); }

  function kunciTanggal(tahun, bulan, tanggal) {
    return tahun + "-" + dua(bulan + 1) + "-" + dua(tanggal);
  }

  function kunciBulan(tahun, bulan) {
    return tahun + "-" + dua(bulan + 1);
  }

  function jumlahHari(tahun, bulan) {
    return new Date(tahun, bulan + 1, 0).getDate();
  }

  function geserBulan(tahun, bulan, langkah) {
    var d = new Date(tahun, bulan + langkah, 1);
    return { tahun: d.getFullYear(), bulan: d.getMonth() };
  }

  function nomorBulan(b) { return b.tahun * 12 + b.bulan; }

  function labelSingkat(tahun, bulan, tanggal) {
    return NAMA_HARI[new Date(tahun, bulan, tanggal).getDay()];
  }

  function labelTanggal(tahun, bulan, tanggal) {
    return NAMA_HARI_P[new Date(tahun, bulan, tanggal).getDay()] +
      ", " + tanggal + " " + NAMA_BULAN[bulan];
  }

  function isiAgenda(tahun, bulan, tanggal) {
    return DATA[kunciTanggal(tahun, bulan, tanggal)] || null;
  }

  function teksKosong(tahun, bulan, tanggal) {
    return "Belum ada agenda pada " + tanggal + " " + NAMA_BULAN[bulan] + " " + tahun + ".";
  }

  function labelAgenda(tahun, bulan, tanggal) {
    var isi = isiAgenda(tahun, bulan, tanggal);
    if (!isi) return labelTanggal(tahun, bulan, tanggal);
    var kat = [];
    for (var i = 0; i < isi.length; i++) {
      var k = KATEGORI[isi[i].warna];
      if (kat.indexOf(k) === -1) kat.push(k);
    }
    return labelTanggal(tahun, bulan, tanggal) + ". " + isi.length + " agenda: " + kat.join(", ");
  }

  return {
    NAMA_BULAN:    NAMA_BULAN,
    KATEGORI:      KATEGORI,
    dua:           dua,
    kunciTanggal:  kunciTanggal,
    kunciBulan:    kunciBulan,
    jumlahHari:    jumlahHari,
    geserBulan:    geserBulan,
    nomorBulan:    nomorBulan,
    labelSingkat:  labelSingkat,
    labelTanggal:  labelTanggal,
    isiAgenda:     isiAgenda,
    teksKosong:    teksKosong,
    labelAgenda:   labelAgenda
  };
})();
