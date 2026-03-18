/* ============================================================
   COMMON.JS — Shared functions across all pages
   Cart, Wishlist, Search, Newsletter, Helpers
   ============================================================ */

/* --- Helper: get correct image path from pages/ --- */
function getImagePath(imageSrc) {
  return window.location.pathname.includes('/pages/') ? '../' + imageSrc : imageSrc;
}

/* --- Navigation Helpers --- */
function goToProduct(id) {
  const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  window.location.href = prefix + 'product-detail.html?id=' + id;
}

function goToCategory(slug) {
  const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  window.location.href = prefix + 'product-listing.html?category=' + encodeURIComponent(slug);
}

/* --- Star Rating Helper --- */
function getStars(rating) {
  const full = Math.floor(rating);
  const half = (rating % 1) >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '★' : '') + '☆'.repeat(empty);
}


/* ============================================================
   CART SYSTEM (localStorage)
   ============================================================ */
const Cart = {
  getItems() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  },

  addItem(product, qty = 1) {
    const items = this.getItems();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty
      });
    }
    localStorage.setItem('cart', JSON.stringify(items));
    this.updateBadge();
  },

  removeItem(id) {
    const filtered = this.getItems().filter(i => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(filtered));
    this.updateBadge();
  },

  updateQty(id, qty) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.qty = parseInt(qty);
      if (item.qty <= 0) {
        this.removeItem(id);
        return;
      }
    }
    localStorage.setItem('cart', JSON.stringify(items));
    this.updateBadge();
  },

  getTotal() {
    return this.getItems().reduce((sum, i) => sum + (i.price * i.qty), 0);
  },

  getCount() {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },

  clear() {
    localStorage.removeItem('cart');
    this.updateBadge();
  },

  updateBadge() {
    const count = this.getCount();
    document.querySelectorAll('.header-icon-item').forEach(item => {
      const label = item.querySelector('span');
      if (label && label.textContent.includes('My cart')) {
        label.textContent = count > 0 ? `My cart (${count})` : 'My cart';
      }
    });
  }
};


/* ============================================================
   WISHLIST SYSTEM (localStorage)
   ============================================================ */
const Wishlist = {
  getItems() {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  },

  toggle(productId) {
    let items = this.getItems();
    if (items.includes(productId)) {
      items = items.filter(id => id !== productId);
    } else {
      items.push(productId);
    }
    localStorage.setItem('wishlist', JSON.stringify(items));
    return items.includes(productId);
  },

  has(productId) {
    return this.getItems().includes(productId);
  }
};

function toggleWishlist(el, productId) {
  window.event?.stopPropagation();
  const added = Wishlist.toggle(productId);
  el.classList.toggle('fa-regular', !added);
  el.classList.toggle('fa-solid', added);
  el.style.color = added ? '#FA3434' : '';
}


/* ============================================================
   SEARCH BAR
   ============================================================ */
function initSearch() {
  const input = document.querySelector('.header-search input');
  const bar = document.querySelector('.header-search');
  const btn = document.querySelector('.search-btn');

  if (input && bar) {
    input.addEventListener('focus', () => {
      bar.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.15)';
    });
    input.addEventListener('blur', () => {
      bar.style.boxShadow = 'none';
    });
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const query = input?.value.trim();
      if (query) {
        const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
        window.location.href = prefix + 'product-listing.html?search=' + encodeURIComponent(query);
      }
    });
  }

  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') btn?.click();
    });
  }
}


/* ============================================================
   NEWSLETTER FORM
   ============================================================ */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  const btn = form.querySelector('button');
  const input = form.querySelector('input');

  btn?.addEventListener('click', e => {
    e.preventDefault();
    const email = input?.value.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Thanks for subscribing! You will receive offers at ' + email);
      input.value = '';
    } else {
      alert('Please enter a valid email address.');
    }
  });
}


/* ============================================================
   INIT — runs on every page
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initNewsletter();
  Cart.updateBadge();
});
