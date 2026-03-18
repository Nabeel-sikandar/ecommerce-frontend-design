/* ============================================================
   LISTING.JS — Product Listing Page
   Filters, Grid/List toggle, Sort, Pagination
   ============================================================ */

let currentView = 'grid';
let currentPage = 1;
let itemsPerPage = 10;


/* --- Render Products (grid or list) --- */
function renderListingProducts() {
  const container = document.getElementById('listingProducts');
  if (!container) return;

  const filtered = getFilteredProducts();
  const total = filtered.length;
  const start = (currentPage - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);

  document.getElementById('item-count').textContent = total.toLocaleString();

  if (!paged.length) {
    container.innerHTML = '<p style="padding:40px;text-align:center;color:var(--text-gray);grid-column:1/-1;">No products found. Try adjusting your filters.</p>';
    renderPagination(0);
    return;
  }

  container.innerHTML = paged.map(p => {
    const isWished = Wishlist.has(p.id);
    const heartClass = isWished ? 'fa-solid' : 'fa-regular';
    const heartColor = isWished ? 'color:#FA3434;' : '';

    return `
    <div class="product-listing-card" onclick="goToProduct(${p.id})">
      <div class="plc-img"><img src="../${p.image}" alt="${p.name}"></div>
      <div class="plc-info">
        <div class="plc-price">
          $${p.price.toFixed(2)}
          ${p.oldPrice ? `<span class="plc-old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="plc-rating">
          <span class="stars">${getStars(p.rating)}</span> ${p.rating}
        </div>
        <div class="plc-name">${p.name}</div>
        <div class="plc-details">
          ${p.orders} orders · <span>Free Shipping</span>
        </div>
        <div class="plc-description">${p.description}</div>
        <div class="plc-view">
          <a href="product-detail.html?id=${p.id}">View details</a>
        </div>
      </div>
      <i class="${heartClass} fa-heart plc-heart" style="${heartColor}"
         onclick="toggleWishlist(this, ${p.id})"></i>
    </div>`;
  }).join('');

  renderPagination(total);
}


/* --- Get Filtered Products --- */
function getFilteredProducts() {
  let filtered = [...products];
  const params = new URLSearchParams(window.location.search);

  // URL category filter
  const urlCat = params.get('category');
  if (urlCat && urlCat !== 'all') {
    const catMap = {
      clothes: 'Clothes',
      electronics: 'Electronics',
      home: 'Home'
    };
    const mapped = catMap[urlCat.toLowerCase()];
    if (mapped) filtered = filtered.filter(p => p.category === mapped);
  }

  // URL search filter
  const searchQuery = params.get('search');
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Brand checkboxes
  const brands = [...document.querySelectorAll('[data-filter="brand"]:checked')]
    .map(c => c.value);
  if (brands.length) {
    filtered = filtered.filter(p => brands.includes(p.brand));
  }

  // Feature filter (keyword match)
  const features = [...document.querySelectorAll('[data-filter="feature"]:checked')]
    .map(c => c.value.toLowerCase());
  if (features.length) {
    filtered = filtered.filter(p =>
      features.some(f =>
        p.description.toLowerCase().includes(f) ||
        p.name.toLowerCase().includes(f)
      )
    );
  }

  // Price range
  const min = parseFloat(document.getElementById('priceMin')?.value) || 0;
  const max = parseFloat(document.getElementById('priceMax')?.value) || 999999;
  filtered = filtered.filter(p => p.price >= min && p.price <= max);

  // Condition
  const condition = document.querySelector('[name="condition"]:checked')?.value;
  if (condition === 'new') filtered = filtered.filter(p => !p.oldPrice);
  if (condition === 'refurbished') filtered = filtered.filter(p => p.oldPrice);

  // Rating
  const ratings = [...document.querySelectorAll('[data-filter="rating"]:checked')]
    .map(c => parseInt(c.value));
  if (ratings.length) {
    filtered = filtered.filter(p =>
      ratings.some(r => Math.floor(p.rating) >= r)
    );
  }

  // Sort
  const sort = document.getElementById('sortBy')?.value;
  if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  // Verified only (rating >= 4.0)
  if (document.getElementById('verifiedOnly')?.checked) {
    filtered = filtered.filter(p => p.rating >= 4.0);
  }

  return filtered;
}


/* --- Grid / List View Toggle --- */
function setView(view) {
  currentView = view;
  const container = document.getElementById('listingProducts');
  container.classList.remove('grid-view', 'list-view');
  container.classList.add(view + '-view');

  document.getElementById('gridViewBtn')
    .classList.toggle('active', view === 'grid');
  document.getElementById('listViewBtn')
    .classList.toggle('active', view === 'list');
}


/* --- Apply Filters --- */
function applyFilters() {
  currentPage = 1;
  renderListingProducts();
  renderActiveFilters();
}


/* --- Active Filter Tags --- */
function renderActiveFilters() {
  const container = document.getElementById('activeFilters');
  const checked = [...document.querySelectorAll('.filter-check input:checked')];

  if (!checked.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = checked.map(c =>
    `<span class="filter-tag" onclick="removeFilter('${c.dataset.filter}', '${c.value}')">
      ${c.value} <i class="fa-solid fa-xmark"></i>
    </span>`
  ).join('') +
    `<span class="clear-filters" onclick="clearAllFilters()">Clear all filter</span>`;
}

function removeFilter(type, value) {
  const cb = document.querySelector(`[data-filter="${type}"][value="${value}"]`);
  if (cb) cb.checked = false;
  applyFilters();
}

function clearAllFilters() {
  document.querySelectorAll('.filter-check input').forEach(c => c.checked = false);
  document.querySelectorAll('.filter-radio input').forEach(c => c.checked = false);

  const anyRadio = document.querySelector('[name="condition"][value="any"]');
  if (anyRadio) anyRadio.checked = true;

  document.getElementById('priceMin').value = 0;
  document.getElementById('priceMax').value = 999999;
  document.getElementById('verifiedOnly').checked = false;

  applyFilters();
}


/* --- Pagination --- */
function renderPagination(total) {
  const totalPages = Math.ceil(total / itemsPerPage);
  const el = document.querySelector('.page-numbers');
  if (!el) return;

  if (totalPages <= 1) {
    el.innerHTML = '<button class="page-btn active">1</button>';
    return;
  }

  let html = `<button class="page-btn" onclick="changePage(${currentPage - 1})"
    ${currentPage === 1 ? 'disabled style="opacity:0.4"' : ''}>
    <i class="fa-solid fa-chevron-left"></i></button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}"
      onclick="changePage(${i})">${i}</button>`;
  }

  html += `<button class="page-btn" onclick="changePage(${currentPage + 1})"
    ${currentPage === totalPages ? 'disabled style="opacity:0.4"' : ''}>
    <i class="fa-solid fa-chevron-right"></i></button>`;

  el.innerHTML = html;
}

function changePage(page) {
  const total = getFilteredProducts().length;
  const totalPages = Math.ceil(total / itemsPerPage);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  renderListingProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* --- Init Listing Page --- */
document.addEventListener('DOMContentLoaded', () => {
  // Populate search bar if query present
  const params = new URLSearchParams(window.location.search);
  const search = params.get('search');
  if (search) {
    const input = document.querySelector('.header-search input');
    if (input) input.value = search;
  }

  // Items per page dropdown
  document.getElementById('showCount')?.addEventListener('change', function () {
    itemsPerPage = parseInt(this.value);
    currentPage = 1;
    renderListingProducts();
  });

  // Filter change listeners
  document.querySelectorAll('.filter-check input')
    .forEach(cb => cb.addEventListener('change', applyFilters));
  document.querySelectorAll('.filter-radio input')
    .forEach(rb => rb.addEventListener('change', applyFilters));

  document.getElementById('sortBy')?.addEventListener('change', applyFilters);
  document.getElementById('verifiedOnly')?.addEventListener('change', applyFilters);

  // Initial render
  renderListingProducts();
});
