/* ============================================================
   NAVIKA - Dashboard: strip tanggal dan panel agenda.
   Tujuan:
   1. Tombol "Bulan sebelumnya / berikutnya" menggeser strip
      secara horizontal sampai tanggal 1 bulan tujuan. Strip
      tetap bisa digeser manual (usap, trackpad, shift+scroll)
      dan batang gesernya tetap disembunyikan oleh CSS.
   2. Klik tanggal memilih tanggal itu dan mengisi panel agenda
      di bawah strip; tanggal tanpa agenda menampilkan pesan
      kosong yang jelas (PRD-NAVIKA.md: strip tanggal dan
      kalender bulanan memakai sumber data yang sama).
   Tanpa JavaScript, strip tetap menampilkan 12-25 Oktober dan
   agenda contoh 13 Oktober seperti desain (markup statis di
   dashboard.html).
   Gulir halus dimatikan bila pengguna memilih
   prefers-reduced-motion; pergantian agenda tidak dianimasikan.
   Semua tanggal dan agenda di sini adalah contoh prototipe,
   bukan data nyata (lihat PRD-NAVIKA.md bagian 2.8).
   ============================================================ */
(function () {
  "use strict";

  var NAMA_HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  var NAMA_HARI_PANJANG = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  var NAMA_BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  /* Tanggal terpilih contoh: Selasa, 13 Oktober 2026. */
  var TERPILIH = { tahun: 2026, bulan: 9, tanggal: 13 };

  /* Isi agenda contoh per tanggal: satu entri per titik indikator di
     strip. "warna" mencocokkan kelas .titik-* di CSS sekaligus label
     kategorinya, "judul" memakai peluang contoh yang sama dengan kartu
     di halaman ini, "jenis" bentuk agendanya. Oktober memakai pola
     titik yang sudah ada di desain; bulan lain hanya contoh agar
     navigasi bulan terlihat hidup. Bukan data nyata. */
  var AGENDA = {
    "2026-09-08": [
      { warna: "hijau", judul: "Djarum Beasiswa Plus", jenis: "Buka pendaftaran" }
    ],
    "2026-09-17": [
      { warna: "merah", judul: "Beasiswa Bank Indonesia", jenis: "Batas pendaftaran" },
      { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Buka pendaftaran" }
    ],
    "2026-10-12": [
      { warna: "hijau", judul: "Beasiswa KIP Kuliah", jenis: "Buka pendaftaran" }
    ],
    "2026-10-13": [
      { warna: "merah", judul: "Magang Bakti BCA", jenis: "Batas pendaftaran" },
      { warna: "hitam", judul: "Djarum Beasiswa Plus", jenis: "Pengumuman" }
    ],
    "2026-10-14": [
      { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Seleksi berkas" }
    ],
    "2026-10-15": [
      { warna: "hijau", judul: "Beasiswa Bank Indonesia", jenis: "Seleksi berkas" }
    ],
    "2026-10-16": [
      { warna: "ungu", judul: "Magang Data Analyst", jenis: "Wawancara" }
    ],
    "2026-10-18": [
      { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Buka pendaftaran" }
    ],
    "2026-10-19": [
      { warna: "ungu", judul: "Magang Generasi Bertalenta", jenis: "Batas unggah berkas" },
      { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Pengumuman" }
    ],
    "2026-10-20": [
      { warna: "hitam", judul: "Beasiswa KIP Kuliah", jenis: "Pengumuman" },
      { warna: "ungu", judul: "Magang Bakti BCA", jenis: "Wawancara" }
    ],
    "2026-10-21": [
      { warna: "oranye", judul: "Magang Data Analyst", jenis: "Batas lamaran" }
    ],
    "2026-10-23": [
      { warna: "oranye", judul: "Magang Generasi Bertalenta", jenis: "Batas lamaran" },
      { warna: "merah", judul: "Web Dev & UI/UX", jenis: "Batas pendaftaran" },
      { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Batas pendaftaran" }
    ],
    "2026-10-25": [
      { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Mulai kegiatan" }
    ],
    "2026-11-05": [
      { warna: "oranye", judul: "Web Dev & UI/UX", jenis: "Batas lamaran" }
    ],
    "2026-11-12": [
      { warna: "hijau", judul: "Beasiswa KIP Kuliah", jenis: "Seleksi berkas" },
      { warna: "merah", judul: "Magang Bakti BCA", jenis: "Batas pendaftaran" }
    ],
    "2026-11-19": [
      { warna: "ungu", judul: "Magang Data Analyst", jenis: "Wawancara" }
    ],
    "2026-12-02": [
      { warna: "pink", judul: "AI-Enhanced Full Stack Developer", jenis: "Buka pendaftaran" }
    ],
    "2026-12-15": [
      { warna: "hijau", judul: "Djarum Beasiswa Plus", jenis: "Pengumuman" }
    ],
    "2026-12-31": [
      { warna: "hitam", judul: "Beasiswa Bank Indonesia", jenis: "Pengumuman" }
    ]
  };

  /* Label kategori per warna titik, supaya indikator warna di strip
     dan panel agenda selalu punya teks pendamping (PRD-NAVIKA.md). */
  var KATEGORI = {
    hijau: "Beasiswa",
    merah: "Deadline",
    pink: "Bootcamp",
    oranye: "Magang",
    ungu: "Disimpan",
    hitam: "Umum"
  };

  function jumlahHari(tahun, bulan) {
    return new Date(tahun, bulan + 1, 0).getDate();
  }

  function geserBulan(tahun, bulan, langkah) {
    var d = new Date(tahun, bulan + langkah, 1);
    return { tahun: d.getFullYear(), bulan: d.getMonth() };
  }

  function nomorBulan(b) {
    return b.tahun * 12 + b.bulan;
  }

  function dua(t) {
    return t < 10 ? "0" + t : String(t);
  }

  function kunciBulan(tahun, bulan) {
    return tahun + "-" + dua(bulan + 1);
  }

  function kunciTanggal(tahun, bulan, tanggal) {
    return kunciBulan(tahun, bulan) + "-" + dua(tanggal);
  }

  function labelSingkat(tahun, bulan, tanggal) {
    return NAMA_HARI[new Date(tahun, bulan, tanggal).getDay()];
  }

  function labelTanggal(tahun, bulan, tanggal) {
    return NAMA_HARI_PANJANG[new Date(tahun, bulan, tanggal).getDay()] +
      ", " + tanggal + " " + NAMA_BULAN[bulan];
  }

  function isiAgenda(tahun, bulan, tanggal) {
    return AGENDA[kunciTanggal(tahun, bulan, tanggal)] || null;
  }

  function teksKosongAgenda(tahun, bulan, tanggal) {
    return "Belum ada agenda pada " + tanggal + " " + NAMA_BULAN[bulan] + " " + tahun + ".";
  }

  /* Label aksesibilitas tombol tanggal: sebut agendanya bila ada
     supaya titik warna tidak jadi satu-satunya penanda. */
  function labelAgenda(tahun, bulan, tanggal) {
    var isi = isiAgenda(tahun, bulan, tanggal);
    if (!isi) {
      return labelTanggal(tahun, bulan, tanggal);
    }
    var kategori = [];
    for (var i = 0; i < isi.length; i++) {
      if (kategori.indexOf(KATEGORI[isi[i].warna]) === -1) {
        kategori.push(KATEGORI[isi[i].warna]);
      }
    }
    return labelTanggal(tahun, bulan, tanggal) + ". " + isi.length +
      " agenda: " + kategori.join(", ");
  }

  /* Ekspor untuk uji logika di Node tanpa DOM. */
  if (typeof document === "undefined") {
    if (typeof module !== "undefined" && module.exports) {
      module.exports = {
        KATEGORI: KATEGORI,
        NAMA_BULAN: NAMA_BULAN,
        isiAgenda: isiAgenda,
        jumlahHari: jumlahHari,
        geserBulan: geserBulan,
        kunciBulan: kunciBulan,
        kunciTanggal: kunciTanggal,
        labelAgenda: labelAgenda,
        labelSingkat: labelSingkat,
        labelTanggal: labelTanggal,
        teksKosongAgenda: teksKosongAgenda
      };
    }
    return;
  }

  var scroller = document.querySelector(".strip-hari");
  var judul = document.getElementById("judul-bulan");
  var panelAgenda = document.getElementById("agenda-tanggal");
  var tombolLalu = document.querySelector('[data-arah="-1"]');
  var tombolDepan = document.querySelector('[data-arah="1"]');
  if (!scroller || !judul || !tombolLalu || !tombolDepan) {
    return;
  }

  var bulanPertama = null;
  var bulanTerakhir = null;
  var posisi = [];
  var judulTeks = "";
  var sedangPindah = false;
  var batasWaktuPindah = 0;
  var menungguGambar = false;
  var AMBANG_SIAGA = 700;

  function kurangiGerak() {
    return typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function teksSpan(kelas, teks) {
    var s = document.createElement("span");
    s.className = kelas;
    s.textContent = teks;
    return s;
  }

  function elemenHari(tahun, bulan, tanggal) {
    var li = document.createElement("li");
    li.dataset.bulan = kunciBulan(tahun, bulan);
    li.dataset.tanggal = kunciTanggal(tahun, bulan, tanggal);
    if (tanggal === 1) {
      li.className = "awal-bulan";
    }

    /* Tombol tanggal: klik memilih tanggal dan mengisi panel agenda,
       jadi bukan tautan; kalender tetap dibuka lewat ikon kalender. */
    var tombol = document.createElement("button");
    tombol.type = "button";
    tombol.className = "hari";
    tombol.dataset.tanggal = kunciTanggal(tahun, bulan, tanggal);
    tombol.setAttribute("aria-label", labelAgenda(tahun, bulan, tanggal));
    if (tahun === TERPILIH.tahun && bulan === TERPILIH.bulan && tanggal === TERPILIH.tanggal) {
      tombol.className += " terpilih";
      tombol.setAttribute("aria-current", "date");
    }
    tombol.appendChild(teksSpan("angka", String(tanggal)));
    tombol.appendChild(teksSpan("nama-hari", labelSingkat(tahun, bulan, tanggal)));

    var titikBaris = document.createElement("span");
    titikBaris.className = "titik-baris";
    titikBaris.setAttribute("aria-hidden", "true");
    var isi = isiAgenda(tahun, bulan, tanggal);
    if (isi) {
      for (var i = 0; i < isi.length; i++) {
        var t = document.createElement("span");
        t.className = "titik titik-" + isi[i].warna;
        titikBaris.appendChild(t);
      }
    }
    tombol.appendChild(titikBaris);
    li.appendChild(tombol);
    return li;
  }

  function elemenBulan(tahun, bulan) {
    var frag = document.createDocumentFragment();
    var total = jumlahHari(tahun, bulan);
    for (var tanggal = 1; tanggal <= total; tanggal++) {
      frag.appendChild(elemenHari(tahun, bulan, tanggal));
    }
    return frag;
  }

  /* Simpan posisi kiri tiap tanggal (koordinat konten) untuk
     mencari bulan yang sedang tampil dan menargetkan geseran. */
  function segarkanPosisi() {
    posisi = [];
    var dasar = scroller.getBoundingClientRect().left - scroller.scrollLeft;
    var anak = scroller.children;
    for (var i = 0; i < anak.length; i++) {
      posisi.push({ el: anak[i], kiri: anak[i].getBoundingClientRect().left - dasar });
    }
  }

  function cariPosisi(x) {
    var lo = 0;
    var hi = posisi.length - 1;
    var hasil = 0;
    while (lo <= hi) {
      var tengah = (lo + hi) >> 1;
      if (posisi[tengah].kiri <= x) {
        hasil = tengah;
        lo = tengah + 1;
      } else {
        hi = tengah - 1;
      }
    }
    return posisi[hasil];
  }

  function perbaruiJudul() {
    if (!posisi.length) {
      return;
    }
    var bagian = cariPosisi(scroller.scrollLeft + 20).el.dataset.bulan.split("-");
    var teks = NAMA_BULAN[Number(bagian[1]) - 1] + ", " + bagian[0];
    if (teks !== judulTeks) {
      judulTeks = teks;
      judul.textContent = teks;
    }
  }

  /* Tambah satu bulan di kiri/kanan daftar. Saat menambah di kiri,
     scrollLeft digeser sebesar lebarnya supaya pandangan pengguna
     tidak meloncat. */
  function tambahBulan(bln, diKiri) {
    var frag = elemenBulan(bln.tahun, bln.bulan);
    if (diKiri && bulanPertama) {
      var lebarLama = scroller.scrollWidth;
      scroller.insertBefore(frag, scroller.firstChild);
      scroller.scrollLeft += scroller.scrollWidth - lebarLama;
      bulanPertama = bln;
    } else {
      scroller.appendChild(frag);
      bulanTerakhir = bln;
      if (!bulanPertama) {
        bulanPertama = bln;
      }
    }
    segarkanPosisi();
  }

  function geserKe(li, halus) {
    var kiri = scroller.scrollLeft + li.getBoundingClientRect().left -
      scroller.getBoundingClientRect().left;
    var mulus = halus && !kurangiGerak();
    scroller.scrollTo({ left: kiri, behavior: mulus ? "smooth" : "auto" });
  }

  /* Perpanjang daftar saat pengguna mendekati ujung kiri/kanan,
     mirip daftar tanggal aplikasi kalender. */
  function perpanjang() {
    if (sedangPindah || !posisi.length) {
      return;
    }
    if (scroller.scrollLeft < AMBANG_SIAGA && bulanPertama) {
      tambahBulan(geserBulan(bulanPertama.tahun, bulanPertama.bulan, -1), true);
      return;
    }
    var sisaKanan = scroller.scrollWidth - scroller.scrollLeft - scroller.clientWidth;
    if (sisaKanan < AMBANG_SIAGA && bulanTerakhir) {
      tambahBulan(geserBulan(bulanTerakhir.tahun, bulanTerakhir.bulan, 1), false);
    }
  }

  function saatGulir() {
    if (menungguGambar) {
      return;
    }
    menungguGambar = true;
    window.requestAnimationFrame(function () {
      menungguGambar = false;
      perbaruiJudul();
      perpanjang();
    });
  }

  function bersihkanPindah() {
    window.clearTimeout(batasWaktuPindah);
    batasWaktuPindah = window.setTimeout(function () {
      sedangPindah = false;
    }, 900);
  }

  function keBulan(langkah) {
    if (!posisi.length) {
      return;
    }
    var bagian = cariPosisi(scroller.scrollLeft + 20).el.dataset.bulan.split("-");
    var tujuan = geserBulan(Number(bagian[0]), Number(bagian[1]) - 1, langkah);

    while (bulanPertama && nomorBulan(tujuan) < nomorBulan(bulanPertama)) {
      tambahBulan(geserBulan(bulanPertama.tahun, bulanPertama.bulan, -1), true);
    }
    while (bulanTerakhir && nomorBulan(tujuan) > nomorBulan(bulanTerakhir)) {
      tambahBulan(geserBulan(bulanTerakhir.tahun, bulanTerakhir.bulan, 1), false);
    }

    var sel = scroller.querySelector('[data-bulan="' + kunciBulan(tujuan.tahun, tujuan.bulan) + '"]');
    if (!sel) {
      return;
    }
    /* Selama animasi, perluasan daftar ditahan dulu supaya target
       gulir tidak bergeser karena konten baru di kiri. */
    sedangPindah = true;
    geserKe(sel, true);
    bersihkanPindah();
  }

  /* Isi panel agenda: daftar baris contoh, atau pesan kosong yang
     jelas untuk tanggal tanpa agenda (PRD-NAVIKA.md). */
  function perbaruiAgenda(tahun, bulan, tanggal) {
    if (!panelAgenda) {
      return;
    }
    panelAgenda.textContent = "";
    var isi = isiAgenda(tahun, bulan, tanggal);
    if (!isi) {
      var kosong = document.createElement("p");
      kosong.className = "agenda-kosong";
      kosong.textContent = teksKosongAgenda(tahun, bulan, tanggal);
      panelAgenda.appendChild(kosong);
      return;
    }
    var daftar = document.createElement("ul");
    daftar.className = "agenda-daftar";
    for (var i = 0; i < isi.length; i++) {
      var item = document.createElement("li");
      item.className = "agenda-baris";

      var titik = document.createElement("span");
      titik.className = "titik titik-" + isi[i].warna;
      titik.setAttribute("aria-hidden", "true");

      var teks = document.createElement("span");
      teks.className = "agenda-teks";

      var judulItem = document.createElement("span");
      judulItem.className = "agenda-judul";
      judulItem.textContent = isi[i].judul;

      /* Kategori tampil sebagai teks, bukan hanya warna titik. */
      var meta = document.createElement("span");
      meta.className = "agenda-meta";
      meta.textContent = KATEGORI[isi[i].warna] + " \u00B7 " + isi[i].jenis;

      teks.appendChild(judulItem);
      teks.appendChild(meta);
      item.appendChild(titik);
      item.appendChild(teks);
      daftar.appendChild(item);
    }
    panelAgenda.appendChild(daftar);
  }

  /* Pilih tanggal: perbarui sorotan di strip dan isi panel agenda. */
  function pilih(tahun, bulan, tanggal) {
    var lama = scroller.querySelector(".hari.terpilih");
    if (lama) {
      lama.classList.remove("terpilih");
      lama.removeAttribute("aria-current");
    }
    var baru = scroller.querySelector(
      '.hari[data-tanggal="' + kunciTanggal(tahun, bulan, tanggal) + '"]'
    );
    if (baru) {
      baru.classList.add("terpilih");
      baru.setAttribute("aria-current", "date");
    }
    perbaruiAgenda(tahun, bulan, tanggal);
  }

  function mulai() {
    scroller.textContent = "";
    bulanPertama = null;
    bulanTerakhir = null;
    posisi = [];

    var bulanAwal = { tahun: TERPILIH.tahun, bulan: TERPILIH.bulan };
    tambahBulan(geserBulan(bulanAwal.tahun, bulanAwal.bulan, -1), false);
    tambahBulan(bulanAwal, false);
    tambahBulan(geserBulan(bulanAwal.tahun, bulanAwal.bulan, 1), false);

    var awalTampil = scroller.querySelector(
      '[data-tanggal="' + kunciTanggal(TERPILIH.tahun, TERPILIH.bulan, 12) + '"]'
    );
    if (awalTampil) {
      geserKe(awalTampil, false);
    }

    /* Panel agenda awal mengikuti tanggal terpilih. */
    pilih(TERPILIH.tahun, TERPILIH.bulan, TERPILIH.tanggal);

    judulTeks = "";
    perbaruiJudul();
  }

  tombolLalu.addEventListener("click", function () {
    keBulan(-1);
  });
  tombolDepan.addEventListener("click", function () {
    keBulan(1);
  });

  /* Klik tanggal: pilih tanggal dan tampilkan agendanya, tidak
     berpindah halaman (kalender tetap dibuka lewat ikon kalender). */
  scroller.addEventListener("click", function (event) {
    var tombol = event.target.closest(".hari");
    if (!tombol || !tombol.dataset.tanggal) {
      return;
    }
    var bagian = tombol.dataset.tanggal.split("-");
    pilih(Number(bagian[0]), Number(bagian[1]) - 1, Number(bagian[2]));
  });

  scroller.addEventListener("scroll", saatGulir, { passive: true });
  if ("onscrollend" in window) {
    scroller.addEventListener("scrollend", function () {
      window.clearTimeout(batasWaktuPindah);
      sedangPindah = false;
    });
  }
  mulai();
})();
