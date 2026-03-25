/* ============================================================
   HOME.JS — Countdown, Recommended Products, Quote Form
   ============================================================ */

function startCountdown() {
  if (!document.getElementById('days')) return;
  var end = new Date();
  end.setDate(end.getDate() + 4);
  end.setHours(end.getHours() + 13);
  function update() {
    var diff = end - new Date();
    if (diff <= 0) return;
    document.getElementById('days').textContent = String(Math.floor(diff/864e5)).padStart(2,'0');
    document.getElementById('hours').textContent = String(Math.floor((diff%864e5)/36e5)).padStart(2,'0');
    document.getElementById('mins').textContent = String(Math.floor((diff%36e5)/6e4)).padStart(2,'0');
    document.getElementById('secs').textContent = String(Math.floor((diff%6e4)/1e3)).padStart(2,'0');
  }
  update();
  setInterval(update, 1000);
}

function renderRecommendedProducts() {
  var container = document.getElementById('recommended-products');
  if (!container) return;
  container.innerHTML = products.slice(0, 10).map(function(p) {
    return '<div class="product-card" onclick="goToProduct(' + p.id + ')">' +
      '<div class="product-card-img"><img src="' + getImagePath(p.image) + '" alt="' + p.name + '"></div>' +
      '<div class="product-card-price">' + formatPrice(getPrice(p)) + '</div>' +
      '<div class="product-card-name">' + p.name + '</div>' +
    '</div>';
  }).join('');
}

function initQuoteForm() {
  var btn = document.querySelector('.quote-form .btn-primary');
  if (!btn) return;
  btn.addEventListener('click', function() {
    var form = document.querySelector('.quote-form');
    var item = form.querySelector('input[type="text"]').value.trim();
    var details = form.querySelector('textarea').value.trim();
    var qty = form.querySelector('input[type="number"]').value;
    if (!item) { alert('Please enter the item you need.'); return; }
    alert('Quote request sent!\n\nItem: ' + item + '\nDetails: ' + (details||'N/A') + '\nQuantity: ' + (qty||1) + ' pcs\n\nSuppliers will contact you shortly.');
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  startCountdown();
  renderRecommendedProducts();
  initQuoteForm();
});