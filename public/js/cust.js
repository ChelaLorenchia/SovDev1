// Navbar
  document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;

    // Highlight nav-link biasa
    document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
      if (link.pathname === currentPath) {
        link.classList.add("active");
      }
    });

    // Highlight icon Profil
    const profilIcon = document.querySelector('a[href="Cust Profil.html"] i');
    if (profilIcon && profilIcon.parentElement.pathname === currentPath) {
      profilIcon.classList.add("active-icon");
    }

    // Highlight icon Cart
    const cartIcon = document.querySelector('a[href="Cart.html"] i');
    if (cartIcon && cartIcon.parentElement.pathname === currentPath) {
      cartIcon.classList.add("active-icon");
    }
    updateCartCount();
  });

// Tampilkan atau sembunyikan deskripsi saat gambar diklik
function toggleDeskripsi(id, showDeskripsi = true, presetQty = false) {
  const preview = document.getElementById("preview-" + id);
  const deskripsi = document.getElementById("deskripsi-" + id);

  if (preview && deskripsi) {
    if (showDeskripsi) {
      preview.classList.add("d-none");
      deskripsi.classList.remove("d-none");

      if (presetQty) {
        const qtySpan = deskripsi.querySelector(".qty");
        const priceSpan = deskripsi.querySelector(".price");
        const unitPrice = parseInt(priceSpan.getAttribute("data-unit-price"));

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemName = deskripsi.querySelector("h6.mb-0").textContent;
        const existing = cart.find((item) => item.name === itemName);

        let qty = existing ? existing.qty : 1;
        qtySpan.textContent = qty;
        priceSpan.textContent = unitPrice * qty;

        const button = deskripsi.querySelector(".btn-cart");
        if (existing) {
          button.innerHTML = `Perbarui Keranjang - Rp <span class="price" data-unit-price="${unitPrice}">${unitPrice * qty}</span>`;
          button.setAttribute("data-update", "true");
        } else {
          button.innerHTML = `Tambahkan ke Keranjang - Rp <span class="price" data-unit-price="${unitPrice}">${unitPrice * qty}</span>`;
          button.removeAttribute("data-update");
        }
      }
    } else {
      deskripsi.classList.add("d-none");
      preview.classList.remove("d-none");
    }
  }
}




function addToCart(event, productName, price, imageSrc) {
  event.stopPropagation();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.name === productName);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      name: productName,
      price: price,
      qty: 1,
      image: imageSrc,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount(); // <-- update jumlah ikon cart
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

  priceSpans.forEach((span) => {
    total += parseInt(span.textContent) || 0;
  });

  const totalDisplay = document.getElementById("total-price");
  if (totalDisplay) {
    totalDisplay.textContent = "Rp " + total.toLocaleString("id-ID");
  }
}

// button Bar
function showCategory(category) {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  let filtered = allProducts;
  if (keyword) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(keyword)
    );
  }
  if (category !== "all") {
    filtered = filtered.filter(product => product.category === category);
  }

  renderProducts(filtered);
  const asinSection = document.querySelector(".product-category.asin");
  const manisSection = document.querySelector(".product-category.manis");

  if (category === "all") {
    asinSection.style.display = "block";
    manisSection.style.display = "block";
  } else if (category === "asin") {
    asinSection.style.display = "block";
    manisSection.style.display = "none";
  } else if (category === "manis") {
    asinSection.style.display = "none";
    manisSection.style.display = "block";
  }
}

// 
function showCategory(category) {
  const buttons = document.querySelectorAll("#categoryButtons button");
  buttons.forEach((btn) => {
    if (btn.getAttribute("data-category") === category) {
      btn.classList.remove("btn-dark");
      btn.classList.add("btn-secondary", "active");
    } else {
      btn.classList.remove("btn-secondary", "active");
      btn.classList.add("btn-dark");
    }
  });

  const keyword = document.getElementById("searchInput").value.toLowerCase();

  let filtered = allProducts;
  if (keyword) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(keyword)
    );
  }

  if (category !== "all") {
    filtered = filtered.filter(product => product.category === category);
  }

  renderProducts(filtered);

  const asinSection = document.querySelector(".product-category.asin");
  const manisSection = document.querySelector(".product-category.manis");

  if (category === "all") {
    asinSection.style.display = "block";
    manisSection.style.display = "block";
  } else if (category === "asin") {
    asinSection.style.display = "block";
    manisSection.style.display = "none";
  } else if (category === "manis") {
    asinSection.style.display = "none";
    manisSection.style.display = "block";
  }
}

  const currentPage = location.pathname.split("/").pop();
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.qty, 0);
  const countElement = document.getElementById("cart-count");

  if (countElement) {
    countElement.textContent = count;
    countElement.style.display = count > 0 ? "inline-block" : "none";
  }
}

function addToCartFromDeskripsi(event, productName, price, imageSrc, id) {
  event.preventDefault();

  const deskripsi = document.getElementById("deskripsi-" + id);
  const qtySpan = deskripsi.querySelector(".qty");
  const qty = parseInt(qtySpan.textContent);
  if (qty === 0) return;

  const button = deskripsi.querySelector(".btn-cart");
  const isUpdate = button.hasAttribute("data-update");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.name === productName);

  if (isUpdate && existing) {
    existing.qty = qty;
    alert(`"${productName}" diperbarui ke jumlah ${qty}.`);
  } else {
    cart.push({
      name: productName,
      price: price,
      qty: qty,
      image: imageSrc,
    });
    alert(`"${productName}" telah ditambahkan ke keranjang!`);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// search
      function searchFromHome() {
        const query = document.getElementById("homeSearchInput").value;
        if (query.trim() !== "") {
          window.location.href = `Cust Menu.html?search=${encodeURIComponent(
            query
          )}`;
        }
      }