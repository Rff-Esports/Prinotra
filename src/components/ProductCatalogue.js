// PRINTORA Complete Product Catalogue Section
import { renderProductCard } from './ProductCard.js';
import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { CATEGORIES } from '../data/products.js';

export function renderProductCatalogue() {
  const filteredProducts = store.getFilteredProducts();
  const totalCount = store.products.length;

  return `
    <section id="catalogue" class="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Catalogue Header & Filter Controls -->
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5DFD4]">
        <div>
          <span class="text-xs uppercase tracking-[0.25em] text-[#997A52] font-semibold">Bespoke Collection</span>
          <h2 class="font-serif text-3xl md:text-5xl font-normal tracking-tight text-[#0A0A0A] mt-1">
            Product Catalogue
          </h2>
          <p class="text-xs text-[#787673] mt-2">
            Showing <strong class="text-black font-mono font-semibold" id="cat-count-display">${filteredProducts.length}</strong> of ${totalCount} customized items
          </p>
        </div>

        <!-- Search Bar & Sorting Dropdown -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          
          <!-- Search Input -->
          <div class="relative flex-1 sm:w-64">
            <span class="absolute inset-y-0 left-3 flex items-center text-[#888] pointer-events-none">
              ${renderIcon('search', 'w-4 h-4')}
            </span>
            <input type="text" id="catalogue-search-input" value="${store.searchQuery}" placeholder="Search products, fabric..." 
                   class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl pl-9 pr-8 py-2.5 text-xs outline-none transition-colors shadow-soft">
            ${store.searchQuery ? `
              <button id="catalogue-search-clear" class="absolute inset-y-0 right-2.5 flex items-center text-[#888] hover:text-black" title="Clear">
                ✕
              </button>
            ` : ''}
          </div>

          <!-- Sort Select -->
          <div class="relative sm:w-48">
            <select id="catalogue-sort-select" class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none appearance-none cursor-pointer shadow-soft text-[#333]">
              <option value="featured" ${store.sortBy === 'featured' ? 'selected' : ''}>Featured First</option>
              <option value="price-low" ${store.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-high" ${store.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
              <option value="name" ${store.sortBy === 'name' ? 'selected' : ''}>Alphabetical: A-Z</option>
            </select>
            <span class="absolute right-3.5 top-3 pointer-events-none text-xs text-[#888]">▼</span>
          </div>

        </div>
      </div>

      <!-- Category Filter Pills (Desktop & Tablet) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none" id="catalogue-filter-bar">
        <button class="cat-filter-btn px-4 py-2 rounded-xl text-xs font-semibold transition-all ${store.activeCategory === 'all' ? 'bg-black text-white shadow-md' : 'bg-white hover:bg-[#F0EAE1] text-[#444] border border-[#DDD4C4]'}" data-cat="all">
          All Products (${totalCount})
        </button>
        ${CATEGORIES.map(c => `
          <button class="cat-filter-btn px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${store.activeCategory === c.slug ? 'bg-black text-white shadow-md' : 'bg-white hover:bg-[#F0EAE1] text-[#444] border border-[#DDD4C4]'}" data-cat="${c.slug}">
            ${c.name}
          </button>
        `).join('')}
      </div>

      <!-- Product Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" id="catalogue-products-grid">
        ${filteredProducts.length === 0 ? `
          <div class="col-span-full py-20 text-center bg-white rounded-2xl border border-[#DDD4C4] p-8">
            <div class="w-16 h-16 rounded-full bg-[#F0EAE1] flex items-center justify-center mx-auto mb-4 text-[#888]">
              ${renderIcon('search', 'w-8 h-8')}
            </div>
            <h3 class="font-serif text-2xl font-medium text-black">No products found</h3>
            <p class="text-xs text-[#787673] mt-1 max-w-sm mx-auto">
              We couldn't find any products matching "${store.searchQuery}". Try searching for T-shirts, Jerseys, Mugs, or Bags.
            </p>
            <button onclick="document.getElementById('catalogue-search-input').value = ''; window.filterCategory('all');" class="mt-4 bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-lg">
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
}
