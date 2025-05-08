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

function updateTotalPrice() {
  const priceSpans = document.querySelectorAll(".price");
  let total = 0;

  priceSpans.forEach(span => {
    total += parseInt(span.textContent) || 0;
  });

  const totalDisplay = document.getElementById("total-price");
  if (totalDisplay) {
    totalDisplay.textContent = total;
  }
}
  
  function showCategory(category) {
    document.querySelectorAll('.product-category').forEach(el => {
      el.style.display = el.classList.contains(category) ? 'block' : 'none';
    });
  }

  
  