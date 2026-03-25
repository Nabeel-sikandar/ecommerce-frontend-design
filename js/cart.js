/* ============================================================
   CART.JS — Cart Page
   ============================================================ */
var couponDiscount = 0;

function renderCart() {
  var items = Cart.getItems();
  var container = document.getElementById('cartItems');
  var countEl = document.getElementById('cartCount');
  countEl.textContent = items.length;
  if (!items.length) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty. <a href="../index.html">Start shopping!</a></p>';
    updateSummary(0); return;
  }
  container.innerHTML = items.map(function(item) {
    var product = products.find(function(p){return p.id===item.id;});
    var desc = product ? product.category+' · '+product.brand : 'Product';
    var price = currentCurrency==='RS' ? (item.priceRS||item.price*280) : item.price;
    return '<div class="cart-item"><div class="cart-item-img"><img src="../'+item.image+'" alt="'+item.name+'"></div><div class="cart-item-info"><h4>'+item.name+'</h4><p>'+desc+'</p><p>Seller: Artel Market</p><div class="cart-item-actions"><button class="cart-item-remove" onclick="removeFromCart('+item.id+')">Remove</button><button class="cart-item-save" onclick="saveForLater('+item.id+')">Save for later</button></div></div><div class="cart-item-right"><div class="cart-item-price">'+formatPrice(price*item.qty)+'</div><div class="cart-item-qty"><select onchange="updateCartQty('+item.id+',this.value)">'+[1,2,3,4,5,6,7,8,9].map(function(n){return '<option value="'+n+'" '+(item.qty===n?'selected':'')+'>Qty: '+n+'</option>';}).join('')+'</select></div></div></div>';
  }).join('');
  updateSummary(Cart.getTotal());
}

function updateSummary(subtotal) {
  var tax = subtotal * 0.01;
  var total = subtotal - couponDiscount + tax;
  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('discount').textContent = '- ' + formatPrice(couponDiscount);
  document.getElementById('tax').textContent = '+ ' + formatPrice(tax);
  document.getElementById('total').textContent = formatPrice(Math.max(total, 0));
}

function removeFromCart(id) { Cart.removeItem(id); renderCart(); }
function updateCartQty(id, qty) { Cart.updateQty(id, parseInt(qty)); renderCart(); }

function saveForLater(id) {
  var items = Cart.getItems(); var item = items.find(function(i){return i.id===id;});
  if(!item) return;
  var saved = JSON.parse(localStorage.getItem('savedItems')||'[]');
  if(!saved.find(function(s){return s.id===item.id;})) { saved.push({id:item.id,name:item.name,price:item.price,priceRS:item.priceRS||0,image:item.image}); localStorage.setItem('savedItems',JSON.stringify(saved)); }
  Cart.removeItem(id); renderCart(); renderSavedItems();
}

function moveToCart(id) {
  var saved = JSON.parse(localStorage.getItem('savedItems')||'[]');
  var item = saved.find(function(s){return s.id===id;});
  if(!item) return;
  Cart.addItem({id:item.id,name:item.name,price:item.price,priceRS:item.priceRS||0,image:item.image},1);
  saved = saved.filter(function(s){return s.id!==id;});
  localStorage.setItem('savedItems',JSON.stringify(saved));
  renderCart(); renderSavedItems();
}

function applyCoupon() {
  var code = document.getElementById('couponInput').value.trim().toUpperCase();
  var coupons = {'SAVE60':60,'SAVE10':10,'DISCOUNT20':20};
  if(coupons[code]){couponDiscount=coupons[code];alert('Coupon applied! '+getCurrencySymbol()+couponDiscount+' discount.');}
  else{couponDiscount=0;alert('Invalid coupon.\nTry: SAVE60, SAVE10, or DISCOUNT20');}
  renderCart();
}

function clearCart() {
  if(!Cart.getItems().length){alert('Cart is already empty!');return;}
  if(confirm('Remove all items?')){Cart.clear();couponDiscount=0;renderCart();}
}

function checkout() {
  if(!Cart.getItems().length){alert('Your cart is empty!');return;}
  window.location.href = 'checkout.html';
}

function renderSavedItems() {
  var container = document.getElementById('savedItems'); if(!container) return;
  var saved = JSON.parse(localStorage.getItem('savedItems')||'[]');
  if(!saved.length){
    saved = products.filter(function(p){return p.category==='Electronics';}).slice(0,4).map(function(p){ return {id:p.id,name:p.name,price:p.price,priceRS:p.priceRS,image:p.image,isDefault:true}; });
  }
  container.innerHTML = saved.map(function(item){
    var escapedName = item.name.replace(/'/g,"\\'");
    var price = currentCurrency==='RS' ? (item.priceRS||item.price*280) : item.price;
    var action = item.isDefault ? "Cart.addItem({id:"+item.id+",name:'"+escapedName+"',price:"+item.price+",priceRS:"+(item.priceRS||0)+",image:'"+item.image+"'});alert('Added!');renderCart();" : "moveToCart("+item.id+")";
    return '<div class="saved-card"><div class="saved-card-img"><img src="../'+item.image+'" alt="'+item.name+'"></div><div class="saved-card-price">'+formatPrice(price)+'</div><div class="saved-card-name">'+item.name+'</div><button onclick="'+action+'"><i class="fa-solid fa-cart-shopping"></i> Move to cart</button></div>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', function(){ renderCart(); renderSavedItems(); });