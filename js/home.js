/* ============================================================
   HOME.JS — Home page specific functionality
   Countdown timer, Recommended products, Quote form
   ============================================================ */

/* --- Countdown Timer --- */
function startCountdown() {
  if (!document.getElementById('days')) return;

  const end = new Date();
  end.setDate(end.getDate() + 4);
  end.setHours(end.getHours() + 13);

  function update() {
    const diff = end - new Date();
    if (diff <= 0) return;

    document.getElementById('days').textContent =
      String(Math.floor(diff / 864e5)).padStart(2, '0');
    document.getElementById('hours').textContent =
      String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0');
    document.getElementById('mins').textContent =
      String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0');
    document.getElementById('secs').textContent =
      String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}


/* --- Render Recommended Products Grid --- */
function renderRecommendedProducts() {
  const container = document.getElementById('recommended-products');
  if (!container) return;

  container.innerHTML = products.slice(0, 10).map(p => `
    <div class="product-card" onclick="goToProduct(${p.id})">
      <div class="product-card-img">
        <img src="${getImagePath(p.image)}" alt="${p.name}">
      </div>
      <div class="product-card-price">$${p.price.toFixed(2)}</div>
      <div class="product-card-name">${p.name}</div>
    </div>
  `).join('');
}


/* --- Quote / Inquiry Form --- */
function initQuoteForm() {
  const btn = document.querySelector('.quote-form .btn-primary');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const form = document.querySelector('.quote-form');
    const item = form.querySelector('input[type="text"]')?.value.trim();
    const details = form.querySelector('textarea')?.value.trim();
    const qty = form.querySelector('input[type="number"]')?.value;

    if (!item) {
      alert('Please enter the item you need.');
      return;
    }

    alert(
      `Quote request sent!\n\n` +
      `Item: ${item}\n` +
      `Details: ${details || 'N/A'}\n` +
      `Quantity: ${qty || 1} pcs\n\n` +
      `Suppliers will contact you shortly.`
    );
    form.reset();
  });
}


/* --- Init Home Page --- */
document.addEventListener('DOMContentLoaded', () => {
  startCountdown();
  renderRecommendedProducts();
  initQuoteForm();
});
