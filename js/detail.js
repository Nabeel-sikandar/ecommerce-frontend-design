/* ============================================================
   DETAIL.JS — Product Detail Page
   ============================================================ */

var currentProduct = null;

function loadProductDetail() {
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id')) || 1;
  currentProduct = products.find(function(p){return p.id===id;}) || products[0];
  var p = currentProduct;

  document.getElementById('mainImage').src = '../' + p.image;
  document.querySelector('.detail-title').textContent = p.name;
  document.title = p.name + ' — Ecommerce';

  var tiers = document.querySelectorAll('.tier-price');
  if(tiers[0]) tiers[0].textContent = formatPrice(getPrice(p));
  if(tiers[1]) tiers[1].textContent = formatPrice(getPrice(p) * 0.92);
  if(tiers[2]) tiers[2].textContent = formatPrice(getPrice(p) * 0.80);

  var ratingEl = document.querySelector('.rating-num');
  if(ratingEl) ratingEl.textContent = p.rating;

  var specsTable = document.querySelector('.detail-specs');
  if(specsTable && p.specs){
    specsTable.innerHTML = Object.entries(p.specs).map(function(entry){
      return '<tr><td>'+entry[0]+':</td><td>'+entry[1]+'</td></tr>';
    }).join('');
  }

  var thumbContainer = document.querySelector('.detail-thumbnails');
  if(thumbContainer){
    var related = products.filter(function(pr){return pr.category===p.category;}).slice(0,5);
    thumbContainer.innerHTML = related.map(function(pr,i){
      return '<img src="../'+pr.image+'" alt="'+pr.name+'" class="thumb '+(i===0?'active':'')+'" onclick="changeImage(this)">';
    }).join('');
  }

  populateDescriptionTab(p);
  populateReviewsTab(p);
  populateShippingTab(p);
  populateSellerTab(p);
}

function populateDescriptionTab(p) {
  var el = document.getElementById('tab-description');
  if(!el) return;
  el.innerHTML = '<p>'+p.description+'</p>' +
    '<table class="specs-table">'+Object.entries(p.specs||{}).map(function(e){return '<tr><td>'+e[0]+'</td><td>'+e[1]+'</td></tr>';}).join('')+'</table>' +
    '<div class="feature-checks"><p><i class="fa-solid fa-check"></i> High quality materials</p><p><i class="fa-solid fa-check"></i> 30-day money back guarantee</p><p><i class="fa-solid fa-check"></i> Fast worldwide shipping</p><p><i class="fa-solid fa-check"></i> 24/7 customer support</p></div>';
}

function populateReviewsTab(p) {
  var el = document.getElementById('tab-reviews');
  if(!el) return;
  var topic = p.category==='Electronics' ? 'performance' : 'quality and fit';
  el.innerHTML = '<div style="margin-bottom:16px;"><strong>Overall: '+p.rating+'/5</strong> <span class="stars-orange">'+getStars(p.rating)+'</span> <span style="color:#8B96A5;">('+p.orders+' reviews)</span></div>' +
    '<div style="padding:16px;border:1px solid #DEE2E7;border-radius:8px;margin-bottom:12px;"><strong>John D.</strong> <span class="stars-orange">★★★★★</span><p style="margin-top:6px;color:#505050;">Excellent product! Exactly as described. Fast shipping.</p></div>' +
    '<div style="padding:16px;border:1px solid #DEE2E7;border-radius:8px;margin-bottom:12px;"><strong>Sarah M.</strong> <span class="stars-orange">★★★★☆</span><p style="margin-top:6px;color:#505050;">Good '+topic+' for the price. Quick delivery.</p></div>' +
    '<div style="padding:16px;border:1px solid #DEE2E7;border-radius:8px;"><strong>Ahmed K.</strong> <span class="stars-orange">★★★★★</span><p style="margin-top:6px;color:#505050;">The '+topic+' exceeded my expectations. Highly recommended!</p></div>';
}

function populateShippingTab(p) {
  var el = document.getElementById('tab-shipping');
  if(!el) return;
  el.innerHTML = '<p><strong>Standard:</strong> 7-15 days — Free on orders over '+getCurrencySymbol()+'50</p><p><strong>Express:</strong> 3-5 days — '+formatPrice(12.99)+'</p><p><strong>Overnight:</strong> 1-2 days — '+formatPrice(24.99)+'</p><p style="margin-top:12px;"><strong>Returns:</strong> 30-day return policy.</p><p><strong>Warranty:</strong> 1 year manufacturer warranty.</p>';
}

function populateSellerTab(p) {
  var el = document.getElementById('tab-seller');
  if(!el) return;
  var specialty = p.category==='Electronics' ? 'consumer electronics' : p.category==='Home' ? 'home appliances' : 'fashion and accessories';
  el.innerHTML = '<p><strong>Guanjoi Trading LLC</strong> — Verified Seller since 2015</p><p>Berlin, Germany. Specializes in '+specialty+'.</p><p style="margin-top:8px;"><i class="fa-solid fa-star" style="color:#FF9017;"></i> 4.8/5 rating · 2,400+ transactions · 98% positive</p><p style="margin-top:8px;"><i class="fa-solid fa-shield-halved" style="color:#00B517;"></i> Trade Assurance · Verified license</p>';
}

function changeImage(thumb) {
  document.getElementById('mainImage').src = thumb.src;
  document.querySelectorAll('.thumb').forEach(function(t){t.classList.remove('active');});
  thumb.classList.add('active');
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
  var tabEl = document.getElementById('tab-'+tabId);
  if(tabEl) tabEl.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(function(b){
    if(b.textContent.toLowerCase().indexOf(tabId.substring(0,4))!==-1) b.classList.add('active');
  });
}

function addToCartFromDetail() {
  if(!currentProduct) return;
  Cart.addItem({id:currentProduct.id, name:currentProduct.name, price:currentProduct.price, priceRS:currentProduct.priceRS, image:currentProduct.image});
  alert('"'+currentProduct.name+'" added to cart!');
}

function saveForLaterDetail() {
  if(!currentProduct) return;
  var saved = JSON.parse(localStorage.getItem('savedItems')||'[]');
  if(saved.find(function(s){return s.id===currentProduct.id;})){alert('Already saved!');return;}
  saved.push({id:currentProduct.id,name:currentProduct.name,price:currentProduct.price,priceRS:currentProduct.priceRS,image:currentProduct.image});
  localStorage.setItem('savedItems',JSON.stringify(saved));
  alert('"'+currentProduct.name+'" saved for later!');
}

function renderYouMayLike() {
  var container = document.getElementById('youMayLike');
  if(!container||!currentProduct) return;
  var items = products.filter(function(p){return p.id!==currentProduct.id;}).sort(function(){return Math.random()-0.5;}).slice(0,5);
  container.innerHTML = items.map(function(p){
    var name = p.name.length>30 ? p.name.substring(0,30)+'...' : p.name;
    return '<div class="like-item" onclick="goToProduct('+p.id+')"><img src="../'+p.image+'" alt="'+p.name+'"><div class="like-item-info"><div>'+name+'</div><div class="like-price">'+formatPrice(getPrice(p))+'</div></div></div>';
  }).join('');
}

function renderRelatedProducts() {
  var container = document.getElementById('relatedProducts');
  if(!container||!currentProduct) return;
  var items = products.filter(function(p){return p.category===currentProduct.category && p.id!==currentProduct.id;}).slice(0,6);
  while(items.length<6){
    var r = products[Math.floor(Math.random()*products.length)];
    if(!items.find(function(x){return x.id===r.id;})) items.push(r);
  }
  container.innerHTML = items.map(function(p){
    var name = p.name.length>22 ? p.name.substring(0,22)+'...' : p.name;
    return '<div class="related-card" onclick="goToProduct('+p.id+')"><img src="../'+p.image+'" alt="'+p.name+'"><p>'+name+'</p><small>'+formatPrice(getPrice(p))+'</small></div>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', function(){
  loadProductDetail();
  renderYouMayLike();
  renderRelatedProducts();
});