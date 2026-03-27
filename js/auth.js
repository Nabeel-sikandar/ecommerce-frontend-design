/* ============================================================
   AUTH.JS — Login, Signup, Profile, Checkout
   Uses localStorage for demo authentication
   ============================================================ */

/* === AUTH SYSTEM === */
var Auth = {
  getUser: function() { return JSON.parse(localStorage.getItem('currentUser') || 'null'); },
  getUsers: function() { return JSON.parse(localStorage.getItem('users') || '[]'); },

  signup: function(name, email, password, phone) {
    var users = this.getUsers();
    if (users.find(function(u) { return u.email === email; })) {
      return { success: false, message: 'Email already registered!' };
    }
    var user = { id: Date.now(), name: name, email: email, password: password, phone: phone || '', address: '', city: '', country: '', joinDate: new Date().toLocaleDateString() };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, message: 'Account created!' };
  },

  login: function(email, password) {
    var users = this.getUsers();
    var user = users.find(function(u) { return u.email === email && u.password === password; });
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid email or password!' };
  },

  logout: function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  },

  updateProfile: function(data) {
    var user = this.getUser();
    if (!user) return;
    Object.assign(user, data);
    localStorage.setItem('currentUser', JSON.stringify(user));
    var users = this.getUsers();
    var idx = users.findIndex(function(u) { return u.id === user.id; });
    if (idx !== -1) { users[idx] = user; localStorage.setItem('users', JSON.stringify(users)); }
  },

  isLoggedIn: function() { return this.getUser() !== null; }
};

/* === TOGGLE PASSWORD VISIBILITY === */
function togglePassword(btn) {
  var input = btn.parentElement.querySelector('input');
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="fa-regular fa-eye"></i>';
  }
}

/* === LOGIN PAGE === */
function handleLogin(e) {
  if (e) e.preventDefault();
  var email = document.getElementById('loginEmail').value.trim();
  var password = document.getElementById('loginPassword').value;

  if (!email || !password) { alert('Please fill in all fields.'); return; }

  var result = Auth.login(email, password);
  if (result.success) {
    alert('Welcome back!');
    window.location.href = '../index.html';
  } else {
    alert(result.message);
  }
}

/* === SIGNUP PAGE === */
function handleSignup(e) {
  if (e) e.preventDefault();
  var name = document.getElementById('signupName').value.trim();
  var email = document.getElementById('signupEmail').value.trim();
  var password = document.getElementById('signupPassword').value;
  var confirmPassword = document.getElementById('signupConfirm').value;
  var phone = document.getElementById('signupPhone') ? document.getElementById('signupPhone').value.trim() : '';

  if (!name || !email || !password) { alert('Please fill in all required fields.'); return; }
  if (password.length < 6) { alert('Password must be at least 6 characters.'); return; }
  if (password !== confirmPassword) { alert('Passwords do not match!'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email.'); return; }

  var result = Auth.signup(name, email, password, phone);
  if (result.success) {
    alert('Account created successfully! Welcome to NBL Store!');
    window.location.href = '../index.html';
  } else {
    alert(result.message);
  }
}

/* === PROFILE PAGE === */
function loadProfile() {
  var user = Auth.getUser();
  if (!user) { window.location.href = 'login.html'; return; }

  var nameEl = document.getElementById('profileName');
  var emailEl = document.getElementById('profileEmail');
  var phoneEl = document.getElementById('profilePhone');
  var addressEl = document.getElementById('profileAddress');
  var cityEl = document.getElementById('profileCity');
  var countryEl = document.getElementById('profileCountry');
  var joinEl = document.getElementById('profileJoinDate');
  var sidebarName = document.getElementById('sidebarName');
  var sidebarEmail = document.getElementById('sidebarEmail');

  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (phoneEl) phoneEl.textContent = user.phone || 'Not provided';
  if (addressEl) addressEl.textContent = user.address || 'Not provided';
  if (cityEl) cityEl.textContent = user.city || 'Not provided';
  if (countryEl) countryEl.textContent = user.country || 'Not provided';
  if (joinEl) joinEl.textContent = user.joinDate || 'N/A';
  if (sidebarName) sidebarName.textContent = user.name;
  if (sidebarEmail) sidebarEmail.textContent = user.email;
}

function editProfile() {
  var user = Auth.getUser();
  if (!user) return;
  document.getElementById('editName').value    = user.name    || '';
  document.getElementById('editPhone').value   = user.phone   || '';
  document.getElementById('editAddress').value = user.address || '';
  document.getElementById('editCity').value    = user.city    || '';
  document.getElementById('editCountry').value = user.country || '';
  openModal('editProfileModal');
}

function saveProfile() {
  var user = Auth.getUser();
  if (!user) return;
  var name    = document.getElementById('editName').value.trim();
  var phone   = document.getElementById('editPhone').value.trim();
  var address = document.getElementById('editAddress').value.trim();
  var city    = document.getElementById('editCity').value.trim();
  var country = document.getElementById('editCountry').value.trim();
  if (!name) { alert('Name cannot be empty.'); return; }
  Auth.updateProfile({ name: name, phone: phone, address: address, city: city, country: country });
  closeModal('editProfileModal');
  loadProfile();
  updateAuthUI();
  showToast('Profile updated successfully!');
}

function showToast(msg) {
  var t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#00B517;color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:500;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.15);';
  document.body.appendChild(t);
  setTimeout(function(){ t.remove(); }, 2800);
}

/* === CHECKOUT PAGE === */
function loadCheckout() {
  var items = Cart.getItems();
  var container = document.getElementById('orderItems');
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<p style="color:var(--text-gray);padding:16px;">No items in cart. <a href="product-listing.html?category=all" style="color:var(--primary-blue);">Shop now</a></p>';
    return;
  }

  container.innerHTML = items.map(function(item) {
    var price = currentCurrency === 'RS' ? (item.priceRS || item.price * 280) : item.price;
    return '<div class="order-item">' +
      '<img src="../' + item.image + '" alt="' + item.name + '">' +
      '<div class="order-item-info"><p>' + item.name + '</p><small>Qty: ' + item.qty + '</small></div>' +
      '<div class="order-item-price">' + formatPrice(price * item.qty) + '</div>' +
    '</div>';
  }).join('');

  var subtotal = Cart.getTotal();
  var shipping = subtotal > 50 ? 0 : 12.99;
  var tax = subtotal * 0.01;
  var total = subtotal + shipping + tax;

  document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
  document.getElementById('checkoutTax').textContent = formatPrice(tax);
  document.getElementById('checkoutTotal').textContent = formatPrice(total);
}

function placeOrder(e) {
  if (e) e.preventDefault();

  var items = Cart.getItems();
  if (!items.length) { alert('Your cart is empty!'); return; }

  var fname = document.getElementById('checkoutFname');
  var lname = document.getElementById('checkoutLname');
  var email = document.getElementById('checkoutEmail');
  var address = document.getElementById('checkoutAddress');
  var city = document.getElementById('checkoutCity');

  if (!fname.value.trim() || !lname.value.trim() || !email.value.trim() || !address.value.trim() || !city.value.trim()) {
    alert('Please fill in all shipping details.');
    return;
  }

  // Show success
  var formArea = document.querySelector('.checkout-layout');
  var successEl = document.getElementById('checkoutSuccess');
  if (formArea) formArea.style.display = 'none';
  if (successEl) {
    successEl.classList.add('show');
    document.getElementById('orderNumber').textContent = '#NBL-' + Date.now().toString().slice(-6);
  }

  // Save order to localStorage
  var user = Auth.getUser();
  var orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push({
    id: 'NBL-' + Date.now().toString().slice(-6),
    items: items,
    total: Cart.getTotal(),
    date: new Date().toLocaleDateString(),
    status: 'Processing',
    user: user ? user.email : 'guest'
  });
  localStorage.setItem('orders', JSON.stringify(orders));

  Cart.clear();
}

/* === UPDATE AUTH UI ON ALL PAGES === */
// updateAuthUI is defined in common.js — just call it here

document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
});