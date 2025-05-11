  // Tampilkan atau sembunyikan deskripsi saat gambar diklik
  function toggleDeskripsi(id, showDeskripsi = true) {
    const preview = document.getElementById("preview-" + id);
    const deskripsi = document.getElementById("deskripsi-" + id);
  
    if (preview && deskripsi) {
      if (showDeskripsi) {
        preview.classList.add("d-none");
        deskripsi.classList.remove("d-none");
      } else {
        deskripsi.classList.add("d-none");
        preview.classList.remove("d-none");
      }
    }
  }
  
  function addToCart(event, productName, price, imageSrc) {
    event.stopPropagation();
  
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    const existing = cart.find(item => item.name === productName);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        name: productName,
        price: price,
        qty: 1,
        image: imageSrc
      });
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = "keranjang.html";
  }

  // Fungsi untuk menyesuaikan jumlah produk dan total harganya
  function adjustQty(button, delta) {
    const card = button.closest(".product-card");
    const qtySpan = card.querySelector(".qty");
    const priceSpan = card.querySelector(".price");

    let qty = parseInt(qtySpan.textContent);
    const unitPrice = parseInt(priceSpan.getAttribute("data-unit-price"));

    qty = Math.max(0, qty + delta);
    qtySpan.textContent = qty;
    priceSpan.textContent = unitPrice * qty;

    updateTotalPrice();
  }

  // Hitung total semua produk yang sudah dipilih
  function updateTotalPrice() {
    const priceSpans = document.querySelectorAll(".price");
    let total = 0;

    priceSpans.forEach(span => {
      total += parseInt(span.textContent) || 0;
    });

    const totalDisplay = document.getElementById("total-price");
    if (totalDisplay) {
      totalDisplay.textContent = "Rp " + total.toLocaleString('id-ID');
    }
  }

  function showCategory(category) {
    document.querySelectorAll('.product-category').forEach(el => {
      el.style.display = el.classList.contains(category) ? 'block' : 'none';
    });
  }

