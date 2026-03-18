/* ============================================================
   DETAIL.JS — Product Detail Page
   Image gallery, Tabs, Related products, Add to Cart
   ============================================================ */

let currentProduct = null;


/* --- Load Product from URL params --- */
function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  currentProduct = products.find(p => p.id === id) || products[0];
  const p = currentProduct;

  // Main image
  document.getElementById('mainImage').src = '../' + p.image;

  // Title & page title
  document.querySelector('.detail-title').textContent = p.name;
  document.title = p.name + ' — Ecommerce';

  // Price tiers
  const tiers = document.querySelectorAll('.tier-price');
  if (tiers[0]) tiers[0].textContent = '$' + p.price.toFixed(2);
  if (tiers[1]) tiers[1].textContent = '$' + (p.price * 0.92).toFixed(2);
  if (tiers[2]) tiers[2].textContent = '$' + (p.price * 0.80).toFixed(2);

  // Rating
  const ratingEl = document.querySelector('.rating-num');
  if (ratingEl) ratingEl.textContent = p.rating;

  // Specs table in main info
  const specsTable = document.querySelector('.detail-specs');
  if (specsTable && p.specs) {
    specsTable.innerHTML = Object.entries(p.specs)
      .map(([k, v]) => `<tr><td>${k}:</td><td>${v}</td></tr>`)
      .join('');
  }

  // Thumbnails — same category products
  const thumbContainer = document.querySelector('.detail-thumbnails');
  if (thumbContainer) {
    const related = products.filter(pr => pr.category === p.category).slice(0, 5);
    thumbContainer.innerHTML = related.map((pr, i) =>
      `<img src="../${pr.image}" alt="${pr.name}"
            class="thumb ${i === 0 ? 'active' : ''}"
            onclick="changeImage(this)">`
    ).join('');
  }

  // --- Populate Tab Contents ---
  populateDescriptionTab(p);
  populateReviewsTab(p);
  populateShippingTab(p);
  populateSellerTab(p);
}


/* --- Tab Content Generators --- */
function populateDescriptionTab(p) {
  const el = document.getElementById('tab-description');
  if (!el) return;
  el.innerHTML = `
    <p>${p.description}</p>
    <table class="specs-table">
      ${Object.entries(p.specs || {}).map(([k, v]) =>
        `<tr><td>${k}</td><td>${v}</td></tr>`
      ).join('')}
    </table>
    <div class="feature-checks">
      <p><i class="fa-solid fa-check"></i> High quality materials with durable construction</p>
      <p><i class="fa-solid fa-check"></i> 30-day money back guarantee included</p>
      <p><i class="fa-solid fa-check"></i> Fast worldwide shipping available</p>
      <p><i class="fa-solid fa-check"></i> 24/7 customer support</p>
    </div>`;
}

function populateReviewsTab(p) {
  const el = document.getElementById('tab-reviews');
  if (!el) return;
  const topicWord = p.category === 'Electronics' ? 'performance' : 'quality and fit';
  el.innerHTML = `
    <div style="margin-bottom:16px;">
      <strong>Overall: ${p.rating}/5</strong>
      <span class="stars-orange" style="margin-left:8px;">${getStars(p.rating)}</span>
      <span style="color:var(--text-gray);margin-left:8px;">(${p.orders} reviews)</span>
    </div>
    <div style="padding:16px;border:1px solid var(--border-color);border-radius:8px;margin-bottom:12px;">
      <strong>John D.</strong> <span class="stars-orange">★★★★★</span>
      <p style="margin-top:6px;color:var(--text-medium);">Excellent product! Exactly as described. Fast shipping and well packaged. Would buy again.</p>
    </div>
    <div style="padding:16px;border:1px solid var(--border-color);border-radius:8px;margin-bottom:12px;">
      <strong>Sarah M.</strong> <span class="stars-orange">★★★★☆</span>
      <p style="margin-top:6px;color:var(--text-medium);">Good ${topicWord} for the price. Quick delivery. Packaging could be slightly better.</p>
    </div>
    <div style="padding:16px;border:1px solid var(--border-color);border-radius:8px;">
      <strong>Ahmed K.</strong> <span class="stars-orange">★★★★★</span>
      <p style="margin-top:6px;color:var(--text-medium);">The ${topicWord} exceeded my expectations. Great value for money. Highly recommended!</p>
    </div>`;
}

function populateShippingTab(p) {
  const el = document.getElementById('tab-shipping');
  if (!el) return;
  el.innerHTML = `
    <p><strong>Standard Shipping:</strong> 7-15 business days — Free on orders over $50</p>
    <p><strong>Express Shipping:</strong> 3-5 business days — $12.99</p>
    <p><strong>Overnight Shipping:</strong> 1-2 business days — $24.99</p>
    <p style="margin-top:12px;"><strong>Returns:</strong> 30-day return policy. Items must be in original condition with tags attached.</p>
    <p><strong>Warranty:</strong> 1 year manufacturer warranty included.</p>`;
}

function populateSellerTab(p) {
  const el = document.getElementById('tab-seller');
  if (!el) return;
  const specialty = p.category === 'Electronics' ? 'consumer electronics and gadgets'
    : p.category === 'Home' ? 'home appliances and kitchenware'
    : 'fashion and accessories';
  el.innerHTML = `
    <p><strong>Guanjoi Trading LLC</strong> — Verified Seller since 2015</p>
    <p>Located in Berlin, Germany. Specializes in ${specialty}.</p>
    <p style="margin-top:8px;">
      <i class="fa-solid fa-star" style="color:var(--warning-orange);"></i>
      4.8/5 seller rating · 2,400+ transactions · 98% positive feedback
    </p>
    <p style="margin-top:8px;">
      <i class="fa-solid fa-shield-halved" style="color:var(--success-green);"></i>
      Trade Assurance protected · Verified business license
    </p>`;
}


/* --- Image Gallery --- */
function changeImage(thumb) {
  document.getElementById('mainImage').src = thumb.src;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}


/* --- Tab Switching --- */
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabId)?.classList.add('active');

  // Activate correct button
  document.querySelectorAll('.tab-btn').forEach(b => {
    if (b.textContent.toLowerCase().trim() === tabId ||
        b.textContent.toLowerCase().includes(tabId.substring(0, 4))) {
      b.classList.add('active');
    }
  });
}


/* --- Add to Cart --- */
function addToCartFromDetail() {
  if (!currentProduct) return;
  Cart.addItem({
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.image
  });
  alert(`"${currentProduct.name}" added to cart!`);
}


/* --- Save for Later --- */
function saveForLaterDetail() {
  if (!currentProduct) return;
  const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
  if (saved.find(s => s.id === currentProduct.id)) {
    alert('Already saved for later!');
    return;
  }
  saved.push({
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.image
  });
  localStorage.setItem('savedItems', JSON.stringify(saved));
  alert(`"${currentProduct.name}" saved for later!`);
}


/* --- You May Like Sidebar --- */
function renderYouMayLike() {
  const container = document.getElementById('youMayLike');
  if (!container || !currentProduct) return;

  const items = products
    .filter(p => p.id !== currentProduct.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  container.innerHTML = items.map(p => `
    <div class="like-item" onclick="goToProduct(${p.id})">
      <img src="../${p.image}" alt="${p.name}">
      <div class="like-item-info">
        <div>${p.name.length > 30 ? p.name.substring(0, 30) + '...' : p.name}</div>
        <div class="like-price">$${p.price.toFixed(2)} - $${(p.price * 1.3).toFixed(2)}</div>
      </div>
    </div>
  `).join('');
}


/* --- Related Products --- */
function renderRelatedProducts() {
  const container = document.getElementById('relatedProducts');
  if (!container || !currentProduct) return;

  let items = products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 6);

  // Fill remaining with random products
  while (items.length < 6) {
    const random = products[Math.floor(Math.random() * products.length)];
    if (!items.find(r => r.id === random.id)) items.push(random);
  }

  container.innerHTML = items.map(p => `
    <div class="related-card" onclick="goToProduct(${p.id})">
      <img src="../${p.image}" alt="${p.name}">
      <p>${p.name.length > 22 ? p.name.substring(0, 22) + '...' : p.name}</p>
      <small>$${p.price.toFixed(2)}</small>
    </div>
  `).join('');
}


/* --- Init Detail Page --- */
document.addEventListener('DOMContentLoaded', () => {
  loadProductDetail();
  renderYouMayLike();
  renderRelatedProducts();
});
