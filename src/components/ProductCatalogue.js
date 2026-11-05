// PRINTORA Complete Product Catalogue Section
// Section 5, 6, 9: Full responsive catalogue, live search, sorting, category filtering, and honest verified pricing

import { renderProductCard } from './ProductCard.js';
import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { CATEGORIES } from '../data/products.js';

export function renderProductCatalogue() {
  const filteredProducts = store.getFilteredProducts();
  const totalCount = store.products.length;
  const userGender = store.getUserGender() || 'Unisex';

  let recommendedProducts = [];
  if (userGender === 'Male') {
    const maleIds = ['prn-app-03', 'prn-spt-01', 'prn-bag-02', 'prn-gft-03', 'prn-app-05', 'prn-spt-02', 'prn-drk-04', 'prn-app-01'];
    recommendedProducts = store.products.filter(p => maleIds.includes(p.id));
  } else if (userGender === 'Female') {
    const femaleIds = ['prn-bag-01', 'prn-gft-06', 'prn-drk-02', 'prn-gft-07', 'prn-app-03', 'prn-drk-03', 'prn-stn-02', 'prn-gft-01'];
    recommendedProducts = store.products.filter(p => femaleIds.includes(p.id));
  } else {
    const unisexIds = ['prn-app-01', 'prn-spt-01', 'prn-bag-01', 'prn-drk-01', 'prn-gft-01', 'prn-app-05', 'prn-drk-03', 'prn-stn-03'];
    recommendedProducts = store.products.filter(p => unisexIds.includes(p.id));
  }
  if (recommendedProducts.length === 0) {
    recommendedProducts = store.products.slice(0, 4);
  }

  return `
    <section id="catalogue" class="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      
      <!-- Catalogue Header & Filter Controls -->
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5DFD4]">
        <div>
          <span class="text-xs uppercase tracking-[0.2em] text-[#FF6B35] font-bold font-heading">Complete Merchandise Collection</span>
          <h2 class="font-heading text-3xl md:text-5xl font-black tracking-tight text-[#111111] mt-1">
            Product Catalogue
          </h2>
          <p class="text-xs text-[#777] mt-2 font-medium">
            Showing <strong class="text-black font-mono font-bold" id="cat-count-display">${filteredProducts.length}</strong> of ${totalCount} personalized merchandise • <span class="text-emerald-700 font-bold">Free Delivery on All Orders</span>
          </p>
        </div>

        <!-- Search Bar & Sorting Dropdown -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          
          <!-- Search Input -->
          <div class="relative flex-1 sm:w-64">
            <span class="absolute inset-y-0 left-3 flex items-center text-[#888] pointer-events-none">
              ${renderIcon('search', 'w-4 h-4')}
            </span>
            <input type="text" id="catalogue-search-input" value="${store.searchQuery}" placeholder="Search products, tees, mugs..." 
                   class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl pl-9 pr-8 py-2.5 text-xs outline-none transition-colors shadow-sm font-medium">
            ${store.searchQuery ? `
              <button id="catalogue-search-clear" class="absolute inset-y-0 right-2.5 flex items-center text-[#888] hover:text-black" title="Clear">
                ✕
              </button>
            ` : ''}
          </div>

          <!-- Sort Select -->
          <div class="relative sm:w-48">
            <select id="catalogue-sort-select" class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none appearance-none cursor-pointer shadow-sm text-[#333]">
              <option value="featured" ${store.sortBy === 'featured' ? 'selected' : ''}>Featured First</option>
              <option value="price-low" ${store.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-high" ${store.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
              <option value="name" ${store.sortBy === 'name' ? 'selected' : ''}>Alphabetical: A-Z</option>
            </select>
            <span class="absolute right-3.5 top-3 pointer-events-none text-xs text-[#888]">▼</span>
          </div>

        </div>
      </div>

      <!-- Personalized Gender-Based Recommendations Block -->
      <div id="gender-recommendations" class="mb-10 p-5 sm:p-7 bg-[#141414] text-white rounded-3xl border border-[#2A2A2A] shadow-xl">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div class="inline-flex items-center gap-1.5 bg-[#FF6B35]/20 text-[#FF6B35] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-heading mb-1">
              <span>✨ Tailored Recommendations</span>
            </div>
            <h3 class="font-heading text-xl sm:text-2xl font-bold text-white">
              ${userGender === 'Male' ? '🔥 Top Recommendations for Men' : userGender === 'Female' ? '🌸 Curated Picks for Women' : '🌟 Trending Custom Picks'}
            </h3>
            <p class="text-xs text-[#888] mt-0.5">
              ${userGender === 'Male' 
                ? 'High-performance team jerseys, heavyweight streetwear tees & rugged gym duffles.' 
                : userGender === 'Female' 
                ? 'Aesthetic relaxed fits, canvas totes, personalized pillows & memory frames.' 
                : 'Top customer favorites across personalized clothing and custom gift keepsakes.'}
            </p>
          </div>

          <!-- Quick Switcher -->
          <div class="flex items-center bg-[#222] p-1 rounded-xl border border-[#333] text-xs font-bold font-heading self-start sm:self-auto">
            <button type="button" class="gender-pill-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer ${userGender === 'Male' ? 'bg-[#FF6B35] text-white' : 'text-[#888] hover:text-white'}" data-gender="Male">
              👨 Men's
            </button>
            <button type="button" class="gender-pill-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer ${userGender === 'Female' ? 'bg-[#FF6B35] text-white' : 'text-[#888] hover:text-white'}" data-gender="Female">
              👩 Women's
            </button>
            <button type="button" class="gender-pill-btn px-3 py-1.5 rounded-lg transition-all cursor-pointer ${(userGender !== 'Male' && userGender !== 'Female') ? 'bg-[#FF6B35] text-white' : 'text-[#888] hover:text-white'}" data-gender="Unisex">
              🌟 All
            </button>
          </div>
        </div>

        <!-- 4 Recommended Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          ${recommendedProducts.slice(0, 4).map(p => renderProductCard(p)).join('')}
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none font-heading" id="catalogue-filter-bar">
        <button class="cat-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${store.activeCategory === 'all' ? 'bg-[#111] text-white shadow-md' : 'bg-white hover:bg-[#F0EAE1] text-[#444] border border-[#DDD4C4]'}" data-cat="all">
          All Products (${totalCount})
        </button>
        ${CATEGORIES.map(c => `
          <button class="cat-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${store.activeCategory === c.slug ? 'bg-[#111] text-white shadow-md' : 'bg-white hover:bg-[#F0EAE1] text-[#444] border border-[#DDD4C4]'}" data-cat="${c.slug}">
            ${c.name}
          </button>
        `).join('')}
      </div>

      <!-- Product Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" id="catalogue-products-grid">
        ${filteredProducts.length === 0 ? `
          <div class="col-span-full py-20 text-center bg-white rounded-3xl border border-[#DDD4C4] p-8">
            <div class="w-16 h-16 rounded-full bg-[#F0EAE1] flex items-center justify-center mx-auto mb-4 text-[#888]">
              ${renderIcon('search', 'w-8 h-8')}
            </div>
            <h3 class="font-heading text-2xl font-bold text-black">No products found</h3>
            <p class="text-xs text-[#777] mt-1 max-w-sm mx-auto">
              We couldn't find any products matching "${store.searchQuery}". Try searching for T-shirts, Jerseys, Mugs, or Bags.
            </p>
            <button onclick="document.getElementById('catalogue-search-input').value = ''; window.filterCategory('all');" class="mt-4 bg-[#111] text-white text-xs font-bold px-5 py-2.5 rounded-xl">
              Reset Filters
            </button>
          </div>
        ` : filteredProducts.map(p => renderProductCard(p)).join('')}
      </div>

    </section>
  `;
}

export function initProductCatalogueEvents() {
  const searchInput = document.getElementById('catalogue-search-input');
  const searchClear = document.getElementById('catalogue-search-clear');
  const sortSelect = document.getElementById('catalogue-sort-select');
  const filterBtns = document.querySelectorAll('.cat-filter-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      store.searchQuery = e.target.value;
      store.notify();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      store.searchQuery = '';
      store.notify();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      store.sortBy = e.target.value;
      store.notify();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      store.activeCategory = cat;
      store.notify();
    });
  });

  // Gender Switcher Pills
  document.querySelectorAll('.gender-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = btn.getAttribute('data-gender');
      store.setUserGender(g);
      store.showToast(`Displaying ${g} recommendations`, 'info');
      store.notify();
    });
  });
}
