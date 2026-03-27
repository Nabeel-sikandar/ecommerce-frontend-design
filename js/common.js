/* ============================================================
   COMMON.JS — Cart, Wishlist, Search, Dropdowns, Modals, Auth UI
   ============================================================ */

function getImagePath(imageSrc) { return window.location.pathname.includes('/pages/') ? '../' + imageSrc : imageSrc; }

function goToProduct(id) { var prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/'; window.location.href = prefix + 'product-detail.html?id=' + id; }

function goToCategory(slug) { var prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/'; window.location.href = prefix + 'product-listing.html?category=' + encodeURIComponent(slug); }

function getStars(rating) { var full=Math.floor(rating); var half=(rating%1)>=0.5?1:0; var empty=5-full-half; return '\u2605'.repeat(full)+(half?'\u2605':'')+'\u2606'.repeat(empty); }

/* === CART === */
var Cart = {
  getItems: function(){return JSON.parse(localStorage.getItem('cart')||'[]');},
  addItem: function(product,qty){qty=qty||1;var items=this.getItems();var ex=items.find(function(i){return i.id===product.id;});if(ex){ex.qty+=qty;}else{items.push({id:product.id,name:product.name,price:product.price,priceRS:product.priceRS||0,image:product.image,qty:qty});}localStorage.setItem('cart',JSON.stringify(items));this.updateBadge();},
  removeItem: function(id){localStorage.setItem('cart',JSON.stringify(this.getItems().filter(function(i){return i.id!==id;})));this.updateBadge();},
  updateQty: function(id,qty){var items=this.getItems();var item=items.find(function(i){return i.id===id;});if(item){item.qty=parseInt(qty);if(item.qty<=0){this.removeItem(id);return;}}localStorage.setItem('cart',JSON.stringify(items));this.updateBadge();},
  getTotal: function(){return this.getItems().reduce(function(s,i){var price=currentCurrency==='RS'?(i.priceRS||i.price*280):i.price;return s+(price*i.qty);},0);},
  getCount: function(){return this.getItems().reduce(function(s,i){return s+i.qty;},0);},
  clear: function(){localStorage.removeItem('cart');this.updateBadge();},
  updateBadge: function(){var count=this.getCount();document.querySelectorAll('.header-icon-item').forEach(function(item){var label=item.querySelector('span');if(label&&label.textContent.includes('My cart')){label.textContent=count>0?'My cart ('+count+')':'My cart';}});}
};

/* === WISHLIST === */
var Wishlist = {
  getItems: function(){return JSON.parse(localStorage.getItem('wishlist')||'[]');},
  toggle: function(productId){var items=this.getItems();var idx=items.indexOf(productId);if(idx!==-1)items.splice(idx,1);else items.push(productId);localStorage.setItem('wishlist',JSON.stringify(items));return items.indexOf(productId)!==-1;},
  has: function(productId){return this.getItems().indexOf(productId)!==-1;}
};

function toggleWishlist(el,productId){if(window.event)window.event.stopPropagation();var added=Wishlist.toggle(productId);el.classList.toggle('fa-regular',!added);el.classList.toggle('fa-solid',added);el.style.color=added?'#FA3434':'';}

/* === SEARCH === */
function handleSearch(){var input=document.getElementById('searchInput');var catSelect=document.getElementById('searchCategory');var query=input?input.value.trim():'';var category=catSelect?catSelect.value:'';var prefix=window.location.pathname.includes('/pages/')?'':'pages/';var url=prefix+'product-listing.html?';if(query)url+='search='+encodeURIComponent(query)+'&';if(category)url+='category='+encodeURIComponent(category);else url+='category=all';window.location.href=url;}

function initSearch(){var input=document.getElementById('searchInput');var bar=document.querySelector('.header-search');if(input&&bar){input.addEventListener('focus',function(){bar.style.boxShadow='0 0 0 3px rgba(13,110,253,.15)';});input.addEventListener('blur',function(){bar.style.boxShadow='none';});input.addEventListener('keydown',function(e){if(e.key==='Enter')handleSearch();});}}

/* === DROPDOWNS === */
function toggleDropdown(id,e){if(e){e.preventDefault();e.stopPropagation();}document.querySelectorAll('.dropdown-menu.show').forEach(function(m){if(m.id!==id)m.classList.remove('show');});var dd=document.getElementById(id);if(dd)dd.classList.toggle('show');}

function changeLang(lang,e){if(e)e.preventDefault();document.querySelectorAll('.lang-select span').forEach(function(el){el.textContent=lang;});if(lang.indexOf('RS')!==-1||lang.indexOf('PKR')!==-1){currentCurrency='RS';}else{currentCurrency='USD';}closeAllDropdowns();if(typeof renderRecommendedProducts==='function')renderRecommendedProducts();if(typeof renderListingProducts==='function')renderListingProducts();if(typeof renderCart==='function')renderCart();}

function changeShip(flagSrc,country,e){if(e)e.preventDefault();document.querySelectorAll('#shipFlag').forEach(function(flag){flag.src=flagSrc;});closeAllDropdowns();}

function closeAllDropdowns(){document.querySelectorAll('.dropdown-menu.show').forEach(function(m){m.classList.remove('show');});}
document.addEventListener('click',function(e){if(!e.target.closest('.nav-dropdown-wrap'))closeAllDropdowns();});

/* === MODALS === */
function openModal(id){if(window.event)window.event.preventDefault();var modal=document.getElementById(id);if(modal)modal.classList.add('show');}

function closeModal(id){var modal=document.getElementById(id);if(modal)modal.classList.remove('show');}

document.addEventListener('click',function(e){if(e.target.classList.contains('modal-overlay'))e.target.classList.remove('show');});

/* === NEWSLETTER === */
function initNewsletter(){var form=document.querySelector('.newsletter-form');if(!form)return;var btn=form.querySelector('button');var input=form.querySelector('input');if(btn){btn.addEventListener('click',function(e){e.preventDefault();var email=input?input.value.trim():'';if(email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alert('Thanks for subscribing! You will receive offers at '+email);input.value='';}else{alert('Please enter a valid email.');}});}}

/* === AUTH-AWARE UI UPDATE === */
function updateAuthUI(){
  var user = JSON.parse(localStorage.getItem('currentUser')||'null');
  var prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';

  // Update Profile modals — show user info if logged in
  var profileModals = document.querySelectorAll('#profileModal .modal-body');
  profileModals.forEach(function(body){
    if(user){
      body.innerHTML='<div class="modal-avatar" style="width:64px;height:64px;border-radius:50%;background:var(--primary-blue-light);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><i class="fa-regular fa-user" style="font-size:28px;color:var(--primary-blue);"></i></div>'+
        '<p style="font-weight:600;color:var(--text-dark);margin-bottom:4px;">'+user.name+'</p>'+
        '<p style="font-size:14px;color:var(--text-gray);margin-bottom:16px;">'+user.email+'</p>'+
        '<a href="'+prefix+'profile.html" class="btn-primary btn-block" style="display:block;margin-bottom:8px;text-align:center;">View Profile</a>'+
        '<button class="btn-outline btn-block" onclick="localStorage.removeItem(\'currentUser\');location.reload();">Log out</button>';
    } else {
      body.innerHTML='<div class="modal-avatar" style="width:64px;height:64px;border-radius:50%;background:var(--primary-blue-light);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><i class="fa-regular fa-user" style="font-size:28px;color:var(--primary-blue);"></i></div>'+
        '<p style="font-size:14px;color:var(--text-gray);margin-bottom:16px;">Welcome! Please log in to your account.</p>'+
        '<a href="'+prefix+'login.html" class="btn-primary btn-block" style="display:block;margin-bottom:8px;text-align:center;">Log in</a>'+
        '<a href="'+prefix+'signup.html" class="btn-outline btn-block" style="display:block;text-align:center;">Create Account</a>';
    }
  });

  // Update header Profile icon label
  document.querySelectorAll('.header-icon-item').forEach(function(item){
    var label=item.querySelector('span');
    if(label&&(label.textContent==='Profile'||label.textContent.trim()==='Profile')&&user){
      label.textContent=user.name.split(' ')[0];
    }
  });

  // Update hero card (home page)
  var heroGreet = document.querySelector('.hero-user-card p');
  var heroJoin = document.querySelector('.hero-user-card .btn-primary');
  var heroLogin = document.querySelector('.hero-user-card .btn-outline');
  if(heroGreet){
    if(user){
      heroGreet.innerHTML = 'Hi, <strong>'+user.name.split(' ')[0]+'</strong><br>Welcome back!';
      if(heroJoin){ heroJoin.textContent='View Profile'; heroJoin.href=prefix+'profile.html'; heroJoin.removeAttribute('onclick'); }
      if(heroLogin){ heroLogin.textContent='My Orders'; heroLogin.href='#'; heroLogin.setAttribute('onclick',"openModal('ordersModal')"); }
    } else {
      heroGreet.innerHTML = 'Hi, user<br>let\'s get started';
      if(heroJoin){ heroJoin.textContent='Join now'; heroJoin.href='#'; heroJoin.setAttribute('onclick',"openModal('profileModal')"); }
      if(heroLogin){ heroLogin.textContent='Log in'; heroLogin.href='#'; heroLogin.setAttribute('onclick',"openModal('profileModal')"); }
    }
  }
}

/* === INIT === */
document.addEventListener('DOMContentLoaded',function(){
  initSearch();
  initNewsletter();
  Cart.updateBadge();
  updateAuthUI();
});