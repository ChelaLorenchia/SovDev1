    document.querySelectorAll('#paymentTableBody tr').forEach(row => {
      row.addEventListener('click', () => {
        const nama = encodeURIComponent(row.dataset.nama);
        const kode = encodeURIComponent(row.dataset.kode);
        const total = encodeURIComponent(row.dataset.total);
        const tanggal = encodeURIComponent(row.dataset.tanggal);
        const jam = encodeURIComponent(row.dataset.jam);
        window.location.href = `Online Payment Detail.html?nama=${nama}&kode=${kode}&total=${total}&tanggal=${tanggal}&jam=${jam}`;
      });
    });

 function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }

    // Ambil data dari URL
    const nama = getQueryParam("nama");
    const kode = getQueryParam("kode");
    const total = getQueryParam("total");
    const tanggal = getQueryParam("tanggal");

    // Tampilkan datanya
    document.getElementById("namaKode").textContent = `${nama} | ${kode}`;
    document.getElementById("tanggal").textContent = tanggal;
    document.getElementById("totalBayar").textContent = total;