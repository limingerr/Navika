/* script/kalender.js
   Grid kalender bulanan dan panel agenda kalender.html.
   Bergantung pada script/agenda-data.js yang dimuat lebih dulu. */

(function () {
  "use strict";

  var D = NAVIKA_AGENDA;

  var tampilTahun = 2026;
  var tampilBulan = 9; /* Oktober */
  var tanggalPilih = 18;

  var elJudul = document.getElementById("bulan-kalender");
  var elBadan = document.getElementById("badan-kalender");
  var elJudulAgenda = document.getElementById("judul-agenda");
  var elAgenda = document.getElementById("isi-agenda");

  if (!elJudul || !elBadan || !elJudulAgenda) return;

  /* ---- Render grid kalender ---- */

  function render() {
    elJudul.textContent = D.NAMA_BULAN[tampilBulan] + ", " + tampilTahun;

    var awal = new Date(tampilTahun, tampilBulan, 1).getDay();
    var total = D.jumlahHari(tampilTahun, tampilBulan);
    var hariIni = new Date();
    var adaHariIni =
      hariIni.getFullYear() === tampilTahun &&
      hariIni.getMonth() === tampilBulan;

    var html = "";
    var tgl = 1 - awal;

    for (var baris = 0; baris < 6; baris++) {
      if (tgl > total) break;
      html += "<tr>";
      for (var kol = 0; kol < 7; kol++, tgl++) {
        if (tgl < 1 || tgl > total) {
          var tglLain = tgl < 1
            ? new Date(tampilTahun, tampilBulan, tgl).getDate()
            : tgl - total;
          html += '<td><button class="sel-hari redup" tabindex="-1" aria-hidden="true">' + tglLain + '</button></td>';
        } else {
          var aktif = tgl === tanggalPilih ? " terpilih" : "";
          var ini = adaHariIni && tgl === hariIni.getDate() && !aktif ? " hari-ini" : "";
          var isi = D.isiAgenda(tampilTahun, tampilBulan, tgl);
          var dots = "";
          if (isi) {
            for (var i = 0; i < isi.length; i++) {
              dots += '<span class="titik titik-' + isi[i].warna + '" aria-hidden="true"></span>';
            }
          }
          var barisTitik = dots ? '<span class="titik-baris">' + dots + '</span>' : '';
          html += '<td>' +
            '<button class="sel-hari' + aktif + ini + '"' +
            ' data-tgl="' + tgl + '"' +
            ' aria-label="' + D.labelAgenda(tampilTahun, tampilBulan, tgl) + '"' +
            ' aria-pressed="' + (tgl === tanggalPilih) + '">' +
            tgl + barisTitik +
            '</button></td>';
        }
      }
      html += "</tr>";
    }

    elBadan.innerHTML = html;

    elBadan.querySelectorAll(".sel-hari[data-tgl]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        tanggalPilih = parseInt(this.dataset.tgl, 10);
        render();
        elJudulAgenda.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    renderAgenda();
  }

  /* ---- Render panel agenda ---- */

  function renderAgenda() {
    var hariIni = new Date();
    var adaHariIni =
      hariIni.getFullYear() === tampilTahun &&
      hariIni.getMonth() === tampilBulan &&
      hariIni.getDate() === tanggalPilih;

    elJudulAgenda.textContent = adaHariIni
      ? "Agenda Hari Ini"
      : tanggalPilih + " " + D.NAMA_BULAN[tampilBulan] + " " + tampilTahun;

    if (!elAgenda) return;
    elAgenda.textContent = "";

    var isi = D.isiAgenda(tampilTahun, tampilBulan, tanggalPilih);
    if (!isi) {
      var p = document.createElement("p");
      p.className = "agenda-kosong";
      p.textContent = D.teksKosong(tampilTahun, tampilBulan, tanggalPilih);
      elAgenda.appendChild(p);
      return;
    }

    /* Kartu dibungkus daftar vertikal ke bawah */
    var wadah = document.createElement("div");
    wadah.className = "agenda-daftar-kartu";

    for (var i = 0; i < isi.length; i++) {
      var item = isi[i];
      var art = document.createElement("article");
      art.className = "kartu-agenda";
      art.innerHTML =
        '<div class="meta-atas">' +
        '<span class="badge badge-rekomendasi">' +
        '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 2.5c.6 4.7 4.8 8.9 9.5 9.5-4.7.6-8.9 4.8-9.5 9.5-.6-4.7-4.8-8.9-9.5-9.5 4.7-.6 8.9-4.8 9.5-9.5Z"/>' +
        '</svg> REKOMENDASI' +
        '</span>' +
        '<span class="badge ' + kelasBadge(item.warna) + '">' + D.KATEGORI[item.warna] + '</span>' +
        '<span class="badge badge-tenggat">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v4.5l3 2"/>' +
        '</svg>1 Hari' +
        '</span>' +
        '</div>' +
        '<h3 class="judul-peluang">' + item.judul + '</h3>' +
        '<p class="organisasi">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18"/>' +
        '</svg>' + item.jenis +
        '</p>' +
        '<div class="aksi-kartu">' +
        '<a href="bookmark.html" class="simpan" aria-label="Simpan ' + item.judul + '">' +
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 20.3C10 18.6 3.5 13.9 3.5 9.2a4.7 4.7 0 0 1 8.5-2.9 4.7 4.7 0 0 1 8.5 2.9c0 4.7-6.5 9.4-8.5 11.1Z"/>' +
        '</svg>' +
        '</a>' +
        '<a href="#" class="tombol-detail">' +
        'Cek detail' +
        '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
        '<circle cx="10" cy="10" r="10" fill="currentColor"/>' +
        '<path d="m8 5.8 4.2 4.2L8 14.2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
        '</a>' +
        '</div>';
      wadah.appendChild(art);
    }

    elAgenda.appendChild(wadah);
  }

  function kelasBadge(warna) {
    var peta = {
      hijau: "kat-beasiswa", oranye: "kat-magang", pink: "kat-bootcamp",
      merah: "kat-deadline", ungu: "kat-ekstra", hitam: "kat-umum"
    };
    return peta[warna] || "";
  }

  /* ---- Navigasi bulan ---- */

  document.getElementById("btn-prev").addEventListener("click", function () {
    tampilBulan--;
    if (tampilBulan < 0) { tampilBulan = 11; tampilTahun--; }
    tanggalPilih = 1;
    render();
  });

  document.getElementById("btn-next").addEventListener("click", function () {
    tampilBulan++;
    if (tampilBulan > 11) { tampilBulan = 0; tampilTahun++; }
    tanggalPilih = 1;
    render();
  });

  render();
})();
