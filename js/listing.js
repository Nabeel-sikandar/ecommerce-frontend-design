/* ============================================================
   LISTING.JS — Filters, Grid/List, Sort, Pagination
   ============================================================ */

var currentView = 'grid';
var currentPage = 1;
var itemsPerPage = 10;

function renderListingProducts() {
  var container = document.getElementById('listingProducts');
  if (!container) return;
  var filtered = getFilteredProducts();
  var total = filtered.length;
  var start = (currentPage - 1) * itemsPerPage;
  var paged = filtered.slice(start, start + itemsPerPage);
  var countEl = document.getElementById('item-count');
  if(countEl) countEl.textContent = total.toLocaleString();

  if (!paged.length) {
    container.innerHTML = '<p style="padding:40px;text-align:center;color:#8B96A5;grid-column:1/-1;">No products found. Try adjusting your filters.</p>';
    renderPagination(0);
    return;
  }

  container.innerHTML = paged.map(function(p) {
    var isWished = Wishlist.has(p.id);
    var heartClass = isWished ? 'fa-solid' : 'fa-regular';
    var heartColor = isWished ? 'color:#FA3434;' : '';
    var price = formatPrice(getPrice(p));
    var oldPrice = getOldPrice(p) ? '<span class="plc-old-price">' + formatPrice(getOldPrice(p)) + '</span>' : '';

    return '<div class="product-listing-card" onclick="goToProduct(' + p.id + ')">' +
      '<div class="plc-img"><img src="../' + p.image + '" alt="' + p.name + '"></div>' +
      '<div class="plc-info">' +
        '<div class="plc-price">' + price + ' ' + oldPrice + '</div>' +
        '<div class="plc-rating"><span class="stars">' + getStars(p.rating) + '</span> ' + p.rating + '</div>' +
        '<div class="plc-name">' + p.name + '</div>' +
        '<div class="plc-details">' + p.orders + ' orders \u00B7 <span>Free Shipping</span></div>' +
        '<div class="plc-description">' + p.description + '</div>' +
        '<div class="plc-view"><a href="product-detail.html?id=' + p.id + '">View details</a></div>' +
      '</div>' +
      '<i class="' + heartClass + ' fa-heart plc-heart" style="' + heartColor + '" onclick="toggleWishlist(this,' + p.id + ')"></i>' +
    '</div>';
  }).join('');

  renderPagination(total);
}

function getFilteredProducts() {
  var filtered = products.slice();
  var params = new URLSearchParams(window.location.search);

  var urlCat = params.get('category');
  if (urlCat && urlCat !== 'all') {
    var catMap = { clothes:'Clothes', electronics:'Electronics', home:'Home' };
    var mapped = catMap[urlCat.toLowerCase()];
    if (mapped) filtered = filtered.filter(function(p){return p.category===mapped;});
  }

  var filterType = params.get('filter');
  if (filterType === 'deals') {
    filtered = filtered.filter(function(p){return p.oldPrice !== null;});
  }

  var searchQuery = params.get('search');
  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    filtered = filtered.filter(function(p){
      return p.name.toLowerCase().indexOf(q)!==-1 ||
        p.description.toLowerCase().indexOf(q)!==-1 ||
        p.brand.toLowerCase().indexOf(q)!==-1 ||
        p.category.toLowerCase().indexOf(q)!==-1;
    });
  }

  var brandChecks = document.querySelectorAll('[data-filter="brand"]:checked');
  var brands = [];
  brandChecks.forEach(function(c){brands.push(c.value);});
  if(brands.length) filtered = filtered.filter(function(p){return brands.indexOf(p.brand)!==-1;});

  var featureChecks = document.querySelectorAll('[data-filter="feature"]:checked');
  var features = [];
  featureChecks.forEach(function(c){features.push(c.value.toLowerCase());});
  if(features.length){
    filtered = filtered.filter(function(p){
      return features.some(function(f){
        return p.description.toLowerCase().indexOf(f)!==-1 || p.name.toLowerCase().indexOf(f)!==-1;
      });
    });
  }

  var minEl = document.getElementById('priceMin');
  var maxEl = document.getElementById('priceMax');
  var min = minEl ? parseFloat(minEl.value)||0 : 0;
  var max = maxEl ? parseFloat(maxEl.value)||999999 : 999999;
  filtered = filtered.filter(function(p){return p.price>=min && p.price<=max;});

  var condEl = document.querySelector('[name="condition"]:checked');
  var cond = condEl ? condEl.value : 'any';
  if(cond==='new') filtered = filtered.filter(function(p){return !p.oldPrice;});
  if(cond==='refurbished') filtered = filtered.filter(function(p){return p.oldPrice;});

  var ratingChecks = document.querySelectorAll('[data-filter="rating"]:checked');
  var ratings = [];
  ratingChecks.forEach(function(c){ratings.push(parseInt(c.value));});
  if(ratings.length){
    filtered = filtered.filter(function(p){
      return ratings.some(function(r){return Math.floor(p.rating)>=r;});
    });
  }

  var sortEl = document.getElementById('sortBy');
  var sort = sortEl ? sortEl.value : 'featured';
  if(sort==='price-low') filtered.sort(function(a,b){return a.price-b.price;});
  if(sort==='price-high') filtered.sort(function(a,b){return b.price-a.price;});
  if(sort==='rating') filtered.sort(function(a,b){return b.rating-a.rating;});

  var verEl = document.getElementById('verifiedOnly');
  if(verEl && verEl.checked) filtered = filtered.filter(function(p){return p.rating>=4.0;});

  return filtered;
}

function setView(view) {
  currentView = view;
  var container = document.getElementById('listingProducts');
  container.classList.remove('grid-view','list-view');
  container.classList.add(view+'-view');
  document.getElementById('gridViewBtn').classList.toggle('active',view==='grid');
  document.getElementById('listViewBtn').classList.toggle('active',view==='list');
}

function applyFilters() { currentPage=1; renderListingProducts(); renderActiveFilters(); }

function renderActiveFilters() {
  var container = document.getElementById('activeFilters');
  var checked = document.querySelectorAll('.filter-check input:checked');
  if(!checked.length){container.innerHTML='';return;}
  var html='';
  checked.forEach(function(c){
    html+='<span class="filter-tag" onclick="removeFilter(\''+c.dataset.filter+'\',\''+c.value+'\')">'+c.value+' <i class="fa-solid fa-xmark"></i></span>';
  });
  html+='<span class="clear-filters" onclick="clearAllFilters()">Clear all filter</span>';
  container.innerHTML=html;
}

function removeFilter(type,value) {
  var cb = document.querySelector('[data-filter="'+type+'"][value="'+value+'"]');
  if(cb) cb.checked=false;
  applyFilters();
}

function clearAllFilters() {
  document.querySelectorAll('.filter-check input').forEach(function(c){c.checked=false;});
  document.querySelectorAll('.filter-radio input').forEach(function(c){c.checked=false;});
  var anyR = document.querySelector('[name="condition"][value="any"]');
  if(anyR) anyR.checked=true;
  var minEl = document.getElementById('priceMin'); if(minEl) minEl.value=0;
  var maxEl = document.getElementById('priceMax'); if(maxEl) maxEl.value=999999;
  var verEl = document.getElementById('verifiedOnly'); if(verEl) verEl.checked=false;
  applyFilters();
}

function renderPagination(total) {
  var totalPages = Math.ceil(total/itemsPerPage);
  var el = document.querySelector('.page-numbers');
  if(!el) return;
  if(totalPages<=1){el.innerHTML='<button class="page-btn active">1</button>';return;}
  var html='<button class="page-btn" onclick="changePage('+(currentPage-1)+')" '+(currentPage===1?'disabled style="opacity:0.4"':'')+'><i class="fa-solid fa-chevron-left"></i></button>';
  for(var i=1;i<=totalPages;i++){
    html+='<button class="page-btn '+(i===currentPage?'active':'')+'" onclick="changePage('+i+')">'+i+'</button>';
  }
  html+='<button class="page-btn" onclick="changePage('+(currentPage+1)+')" '+(currentPage===totalPages?'disabled style="opacity:0.4"':'')+'><i class="fa-solid fa-chevron-right"></i></button>';
  el.innerHTML=html;
}

function changePage(page) {
  var total = getFilteredProducts().length;
  var totalPages = Math.ceil(total/itemsPerPage);
  if(page<1||page>totalPages) return;
  currentPage=page;
  renderListingProducts();
  window.scrollTo({top:0,behavior:'smooth'});
}

document.addEventListener('DOMContentLoaded', function(){
  var params = new URLSearchParams(window.location.search);
  var search = params.get('search');
  if(search){
    var input = document.querySelector('.header-search input');
    if(input) input.value=search;
  }
  var showCount = document.getElementById('showCount');
  if(showCount) showCount.addEventListener('change', function(){itemsPerPage=parseInt(this.value);currentPage=1;renderListingProducts();});
  document.querySelectorAll('.filter-check input').forEach(function(cb){cb.addEventListener('change',applyFilters);});
  document.querySelectorAll('.filter-radio input').forEach(function(rb){rb.addEventListener('change',applyFilters);});
  var sortBy = document.getElementById('sortBy');
  if(sortBy) sortBy.addEventListener('change',applyFilters);
  var verOnly = document.getElementById('verifiedOnly');
  if(verOnly) verOnly.addEventListener('change',applyFilters);
  renderListingProducts();
});