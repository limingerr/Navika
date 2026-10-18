/* script/dashboard.js
   Strip tanggal dan panel agenda dashboard.html.
   Bergantung pada script/agenda-data.js yang dimuat lebih dulu. */
(function () {
  "use strict";

  var D = NAVIKA_AGENDA;

  /* Tanggal terpilih awal: 13 Oktober 2026 (contoh prototipe). */
  var TERPILIH = { tahun: 2026, bulan: 9, tanggal: 13 };

  var scroller    = document.querySelector(".strip-hari");
  var judul       = document.getElementById("judul-bulan");
  var panelAgenda = document.getElementById("agenda-tanggal");
  var tombolLalu  = document.querySelector('[data-arah="-1"]');
  var tombolDepan = document.querySelector('[data-arah="1"]');

  if (!scroller || !judul || !tombolLalu || !tombolDepan) return;

  var bulanPertama = null;
  var bulanTerakhir = null;
  var posisi = [];
  var judulTeks = "";
  var sedangPindah = false;
  var batasWaktuPindah = 0;
  var menungguFrame = false;
  var AMBANG = 700;

  function kurangiGerak() {
    return typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---- Bangun elemen tombol tanggal ---- */

  function buatSpan(kelas, teks) {
    var s = document.createElement("span");
    s.className = kelas;
    if (teks !== undefined) s.textContent = teks;
    return s;
  }

  function elemenHari(tahun, bulan, tanggal) {
    var li = document.createElement("li");
    li.dataset.bulan   = D.kunciBulan(tahun, bulan);
    li.dataset.tanggal = D.kunciTanggal(tahun, bulan, tanggal);
    if (tanggal === 1) li.className = "awal-bulan";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hari";
    btn.dataset.tanggal = D.kunciTanggal(tahun, bulan, tanggal);
    btn.setAttribute("aria-label", D.labelAgenda(tahun, bulan, tanggal));

    if (tahun === TERPILIH.tahun && bulan === TERPILIH.bulan && tanggal === TERPILIH.tanggal) {
      btn.classList.add("terpilih");
      btn.setAttribute("aria-current", "date");
    }

    btn.appendChild(buatSpan("angka", String(tanggal)));
    btn.appendChild(buatSpan("nama-hari", D.labelSingkat(tahun, bulan, tanggal)));

    var titikBaris = buatSpan("titik-baris");
    titikBaris.setAttribute("aria-hidden", "true");
    var isi = D.isiAgenda(tahun, bulan, tanggal);
    if (isi) {
      for (var i = 0; i < isi.length; i++) {
        titikBaris.appendChild(buatSpan("titik titik-" + isi[i].warna));
      }
    }
    btn.appendChild(titikBaris);
    li.appendChild(btn);
    return li;
  }

  function elemenBulan(tahun, bulan) {
    var frag  = document.createDocumentFragment();
    var total = D.jumlahHari(tahun, bulan);
    for (var tgl = 1; tgl <= total; tgl++) {
      frag.appendChild(elemenHari(tahun, bulan, tgl));
    }
    return frag;
  }

  /* ---- Posisi dan gulir ---- */

  function segarkanPosisi() {
    posisi = [];
    var dasar = scroller.getBoundingClientRect().left - scroller.scrollLeft;
    var anak  = scroller.children;
    for (var i = 0; i < anak.length; i++) {
      posisi.push({ el: anak[i], kiri: anak[i].getBoundingClientRect().left - dasar });
    }
  }

  function cariPosisi(x) {
    var lo = 0, hi = posisi.length - 1, hasil = 0;
    while (lo <= hi) {
      var tengah = (lo + hi) >> 1;
      if (posisi[tengah].kiri <= x) { hasil = tengah; lo = tengah + 1; }
      else hi = tengah - 1;
    }
    return posisi[hasil];
  }

  function geserKe(li, halus) {
    var kiri = scroller.scrollLeft +
      li.getBoundingClientRect().left - scroller.getBoundingClientRect().left;
    scroller.scrollTo({ left: kiri, behavior: (halus && !kurangiGerak()) ? "smooth" : "auto" });
  }

  function perbaruiJudul() {
    if (!posisi.length) return;
    var bagian = cariPosisi(scroller.scrollLeft + 20).el.dataset.bulan.split("-");
    var teks   = D.NAMA_BULAN[Number(bagian[1]) - 1] + ", " + bagian[0];
    if (teks !== judulTeks) { judulTeks = teks; judul.textContent = teks; }
  }

  function tambahBulan(bln, diKiri) {
    var frag = elemenBulan(bln.tahun, bln.bulan);
    if (diKiri && bulanPertama) {
      var lebar = scroller.scrollWidth;
      scroller.insertBefore(frag, scroller.firstChild);
      scroller.scrollLeft += scroller.scrollWidth - lebar;
      bulanPertama = bln;
    } else {
      scroller.appendChild(frag);
      bulanTerakhir = bln;
      if (!bulanPertama) bulanPertama = bln;
    }
    segarkanPosisi();
  }

  function perpanjang() {
    if (sedangPindah || !posisi.length) return;
    if (scroller.scrollLeft < AMBANG && bulanPertama) {
      tambahBulan(D.geserBulan(bulanPertama.tahun, bulanPertama.bulan, -1), true);
      return;
    }
    var sisaKanan = scroller.scrollWidth - scroller.scrollLeft - scroller.clientWidth;
    if (sisaKanan < AMBANG && bulanTerakhir) {
      tambahBulan(D.geserBulan(bulanTerakhir.tahun, bulanTerakhir.bulan, 1), false);
    }
  }

  function saatGulir() {
    if (menungguFrame) return;
    menungguFrame = true;
    window.requestAnimationFrame(function () {
      menungguFrame = false;
      perbaruiJudul();
      perpanjang();
    });
  }

  function bersihkanPindah() {
    window.clearTimeout(batasWaktuPindah);
    batasWaktuPindah = window.setTimeout(function () { sedangPindah = false; }, 900);
  }

  function keBulan(langkah) {
    if (!posisi.length) return;
    var bagian = cariPosisi(scroller.scrollLeft + 20).el.dataset.bulan.split("-");
    var tujuan = D.geserBulan(Number(bagian[0]), Number(bagian[1]) - 1, langkah);

    while (bulanPertama && D.nomorBulan(tujuan) < D.nomorBulan(bulanPertama)) {
      tambahBulan(D.geserBulan(bulanPertama.tahun, bulanPertama.bulan, -1), true);
    }
    while (bulanTerakhir && D.nomorBulan(tujuan) > D.nomorBulan(bulanTerakhir)) {
      tambahBulan(D.geserBulan(bulanTerakhir.tahun, bulanTerakhir.bulan, 1), false);
    }

    var sel = scroller.querySelector('[data-bulan="' + D.kunciBulan(tujuan.tahun, tujuan.bulan) + '"]');
    if (!sel) return;
    sedangPindah = true;
    geserKe(sel, true);
    bersihkanPindah();
  }

  /* ---- Panel agenda ---- */

  function perbaruiAgenda(tahun, bulan, tanggal) {
    if (!panelAgenda) return;
    panelAgenda.textContent = "";
    var isi = D.isiAgenda(tahun, bulan, tanggal);
    if (!isi) {
      var p = document.createElement("p");
      p.className = "agenda-kosong";
      p.textContent = D.teksKosong(tahun, bulan, tanggal);
      panelAgenda.appendChild(p);
      return;
    }
    var ul = document.createElement("ul");
    ul.className = "agenda-daftar";
    for (var i = 0; i < isi.length; i++) {
      var li = document.createElement("li");
      li.className = "agenda-baris";

      var titik = document.createElement("span");
      titik.className = "titik titik-" + isi[i].warna;
      titik.setAttribute("aria-hidden", "true");

      var teks   = document.createElement("span");
      teks.className = "agenda-teks";

      var jdl = document.createElement("span");
      jdl.className   = "agenda-judul";
      jdl.textContent = isi[i].judul;

      var meta = document.createElement("span");
      meta.className   = "agenda-meta";
      meta.textContent = D.KATEGORI[isi[i].warna] + " · " + isi[i].jenis;

      teks.appendChild(jdl);
      teks.appendChild(meta);
      li.appendChild(titik);
      li.appendChild(teks);
      ul.appendChild(li);
    }
    panelAgenda.appendChild(ul);
  }

  function pilih(tahun, bulan, tanggal) {
    var lama = scroller.querySelector(".hari.terpilih");
    if (lama) { lama.classList.remove("terpilih"); lama.removeAttribute("aria-current"); }
    var baru = scroller.querySelector('.hari[data-tanggal="' + D.kunciTanggal(tahun, bulan, tanggal) + '"]');
    if (baru) { baru.classList.add("terpilih"); baru.setAttribute("aria-current", "date"); }
    perbaruiAgenda(tahun, bulan, tanggal);
  }

  /* ---- Inisialisasi ---- */

  function mulai() {
    scroller.textContent = "";
    bulanPertama = bulanTerakhir = null;
    posisi = [];

    var bAwal = { tahun: TERPILIH.tahun, bulan: TERPILIH.bulan };
    tambahBulan(D.geserBulan(bAwal.tahun, bAwal.bulan, -1), false);
    tambahBulan(bAwal, false);
    tambahBulan(D.geserBulan(bAwal.tahun, bAwal.bulan,  1), false);

    var awalTampil = scroller.querySelector(
      '[data-tanggal="' + D.kunciTanggal(TERPILIH.tahun, TERPILIH.bulan, 12) + '"]'
    );
    if (awalTampil) geserKe(awalTampil, false);

    pilih(TERPILIH.tahun, TERPILIH.bulan, TERPILIH.tanggal);
    judulTeks = "";
    perbaruiJudul();
  }

  tombolLalu.addEventListener("click", function () { keBulan(-1); });
  tombolDepan.addEventListener("click", function () { keBulan(1); });

  scroller.addEventListener("click", function (e) {
    var btn = e.target.closest(".hari");
    if (!btn || !btn.dataset.tanggal) return;
    var b = btn.dataset.tanggal.split("-");
    pilih(Number(b[0]), Number(b[1]) - 1, Number(b[2]));
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
