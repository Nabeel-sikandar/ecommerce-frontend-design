/* ============================================================
   CART.JS — Cart Page
   Render items, Coupon, Summary, Checkout, Saved items
   ============================================================ */

let couponDiscount = 0;


/* --- Render Cart Items --- */
function renderCart() {
  const items = Cart.getItems();
  const container = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');

  countEl.textContent = items.length;

  if (!items.length) {
    container.innerHTML =
      '<p class="cart-empty">Your cart is empty. <a href="../index.html">Start shopping!</a></p>';
    updateSummary(0);
    return;
  }

  container.innerHTML = items.map(item => {
    const product = products.find(p => p.id === item.id);
    const desc = product
      ? `${product.category} · ${product.brand}`
      : 'Product';

    return `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="../${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${desc}</p>
        <p>Seller: Artel Market</p>
        <div class="cart-item-actions">
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
            Remove
          </button>
          <button class="cart-item-save" onclick="saveForLater(${item.id})">
            Save for later
          </button>
        </div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <select onchange="updateCartQty(${item.id}, this.value)">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n =>
              `<option value="${n}" ${item.qty === n ? 'selected' : ''}>Qty: ${n}</option>`
            ).join('')}
          </select>
        </div>
      </div>
    </div>`;
  }).join('');

  updateSummary(Cart.getTotal());
}


/* --- Update Price Summary --- */
function updateSummary(subtotal) {
  const tax = subtotal * 0.01;
  const total = subtotal - couponDiscount + tax;

  document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('discount').textContent = '- $' + couponDiscount.toFixed(2);
  document.getElementById('tax').textContent = '+ $' + tax.toFixed(2);
  document.getElementById('total').textContent = '$' + Math.max(total, 0).toFixed(2);
}


/* --- Cart Item Actions --- */
function removeFromCart(id) {
  Cart.removeItem(id);
  renderCart();
}

function updateCartQty(id, qty) {
  Cart.updateQty(id, parseInt(qty));
  renderCart();
}

function saveForLater(id) {
  const items = Cart.getItems();
  const item = items.find(i => i.id === id);
  if (!item) return;

  let saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
  if (!saved.find(s => s.id === item.id)) {
    saved.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    localStorage.setItem('savedItems', JSON.stringify(saved));
  }

  Cart.removeItem(id);
  renderCart();
  renderSavedItems();
}

function moveToCart(id) {
  let saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
  const item = saved.find(s => s.id === id);
  if (!item) return;

  Cart.addItem({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image
  }, 1);

  saved = saved.filter(s => s.id !== id);
  localStorage.setItem('savedItems', JSON.stringify(saved));

  renderCart();
  renderSavedItems();
}


/* --- Coupon System --- */
function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  const validCoupons = {
    'SAVE60': 60,
    'SAVE10': 10,
    'DISCOUNT20': 20
  };

  if (validCoupons[code]) {
    couponDiscount = validCoupons[code];
    alert(`Coupon applied! $${couponDiscount} discount.`);
  } else {
    couponDiscount = 0;
    alert('Invalid coupon code.\nTry: SAVE60, SAVE10, or DISCOUNT20');
  }
  renderCart();
}


/* --- Clear & Checkout --- */
function clearCart() {
  if (!Cart.getItems().length) {
    alert('Cart is already empty!');
    return;
  }
  if (confirm('Remove all items from cart?')) {
    Cart.clear();
    couponDiscount = 0;
    renderCart();
  }
}

function checkout() {
  const items = Cart.getItems();
  if (!items.length) {
    alert('Your cart is empty!');
    return;
  }

  const subtotal = Cart.getTotal();
  const total = subtotal - couponDiscount + (subtotal * 0.01);

  alert(
    `Order placed successfully!\n\n` +
    `Items: ${items.length}\n` +
    `Total: $${total.toFixed(2)}\n\n` +
    `Thank you for your purchase!`
  );

  Cart.clear();
  couponDiscount = 0;
  renderCart();
}


/* --- Saved for Later Section --- */
function renderSavedItems() {
  const container = document.getElementById('savedItems');
  if (!container) return;

  let saved = JSON.parse(localStorage.getItem('savedItems') || '[]');

  // Default suggestions if nothing saved
  if (!saved.length) {
    saved = products.filter(p => p.category === 'Electronics')
      .slice(0, 4)
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        isDefault: true
      }));
  }

  container.innerHTML = saved.map(item => {
    const escapedName = item.name.replace(/'/g, "\\'");
    const action = item.isDefault
      ? `Cart.addItem({id:${item.id},name:'${escapedName}',price:${item.price},image:'${item.image}'}); alert('Added to cart!'); renderCart();`
      : `moveToCart(${item.id})`;

    return `
    <div class="saved-card">
      <div class="saved-card-img">
        <img src="../${item.image}" alt="${item.name}">
      </div>
      <div class="saved-card-price">$${item.price.toFixed(2)}</div>
      <div class="saved-card-name">${item.name}</div>
      <button onclick="${action}">
        <i class="fa-solid fa-cart-shopping"></i> Move to cart
      </button>
    </div>`;
  }).join('');
}


/* --- Init Cart Page --- */
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  renderSavedItems();
});
