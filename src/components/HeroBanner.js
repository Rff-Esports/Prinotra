// PRINTORA Luxury Hero Banner Component
import { renderIcon } from '../utils/icons.js';
import { CATEGORIES } from '../data/products.js';

export function renderHeroBanner() {
  return `
    <header class="relative bg-[#FAFAF7] border-b border-[#E5DFD4] overflow-hidden">
      <!-- Luxury Editorial Hero -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left: Editorial Headlines & CTAs (Cols 1-7) -->
          <div class="lg:col-span-7 space-y-6 text-left">
            <div class="inline-flex items-center gap-2 bg-[#EFEAE0] border border-[#DDD4C4] px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-[#111] uppercase tracking-[0.2em]">
              <span class="w-2 h-2 rounded-full bg-[#C5A880]"></span>
              <span>Personalized Products & Corporate Merchandise</span>
            </div>

            <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#0A0A0A] leading-[1.05]">
              Bespoke Craftsmanship.<br>
              <span class="italic font-light text-[#997A52]">Make It Yours.</span>
            </h1>

            <p class="text-sm md:text-base text-[#666663] max-w-xl leading-relaxed">
              Printora transforms premium combed apparel, high-performance sublimation team jerseys, executive corporate merchandise, and customized keepsakes into reflections of your unique identity.
            </p>

            <!-- Primary Action Buttons -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <a href="#catalogue" class="bg-[#0A0A0A] hover:bg-[#C5A880] text-white hover:text-black font-semibold text-xs uppercase tracking-widest px-7 py-4 rounded-xl transition-all duration-300 shadow-md flex items-center gap-2">
                <span>Shop Catalogue</span>
                ${renderIcon('arrowRight', 'w-4 h-4')}
              </a>

              <a href="#custom-jersey" class="bg-[#EFEAE0] hover:bg-[#DDD4C4] text-[#0A0A0A] font-semibold text-xs uppercase tracking-widest px-7 py-4 rounded-xl transition-all duration-300 border border-[#DDD4C4] flex items-center gap-2">
                ${renderIcon('shirt', 'w-4 h-4 text-[#997A52]')}
                <span>Custom Jersey Studio (₹499)</span>
              </a>

              <a href="#bulk-orders" class="text-xs font-semibold text-[#787673] hover:text-black underline underline-offset-4 py-2 px-3 transition-colors">
                Bulk / Institutional Orders →
              </a>
            </div>

            <!-- Value Props Badges -->
            <div class="pt-6 border-t border-[#E5DFD4] grid grid-cols-3 gap-4 text-xs text-[#555]">
              <div>
                <strong class="text-black block font-semibold text-sm">₹499</strong>
                <span class="text-[11px] text-[#777]">Custom Team Jerseys</span>
              </div>
              <div>
                <strong class="text-black block font-semibold text-sm">100% Bio-Washed</strong>
                <span class="text-[11px] text-[#777]">Combed Cotton Luxury</span>
              </div>
              <div>
                <strong class="text-black block font-semibold text-sm">Pan-India</strong>
                <span class="text-[11px] text-[#777]">Free Shipping Over ₹999</span>
              </div>
            </div>

          </div>

          <!-- Right: Visual Editorial Showcase (Cols 8-12) -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              
              <!-- Luxury Image Collage Frame -->
              <div class="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80" 
                     alt="Printora Custom T-shirt & Apparel" 
                     class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <!-- Floating Editorial Badge -->
                <div class="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E5DFD4] shadow-lg flex items-center justify-between">
                  <div>
                    <span class="text-[9px] uppercase tracking-widest text-[#997A52] font-bold">Featured Showcase</span>
                    <h4 class="font-serif text-lg font-bold text-black">Pro Sublimation Jerseys</h4>
                    <p class="text-[11px] text-[#666]">Player Name & Number Included • ₹499</p>
                  </div>
                  <a href="#custom-jersey" class="bg-[#0A0A0A] text-white p-2.5 rounded-xl hover:bg-[#C5A880] hover:text-black transition-colors" title="Customize">
                    ${renderIcon('arrowRight', 'w-4 h-4')}
                  </a>
                </div>
              </div>

              <!-- Offset Accent Card -->
              <div class="hidden sm:block absolute -top-6 -left-6 bg-[#0A0A0A] text-white p-4 rounded-2xl shadow-xl border border-[#262626]">
                <span class="text-[9px] text-[#C5A880] uppercase tracking-widest font-bold">Signature Quality</span>
                <p class="font-serif text-sm font-semibold">100% Bio-Washed Cotton</p>
              </div>

            </div>
          </div>

        </div>

        <!-- Category Filter Carousel Pills -->
        <div class="mt-14 pt-8 border-t border-[#E5DFD4]">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-bold uppercase tracking-[0.25em] text-[#787673]">Explore Categories</span>
            <span class="text-xs text-[#997A52] font-semibold">8 Curated Lines</span>
          </div>

          <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none" id="hero-category-pills">
            <button class="hero-cat-btn whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold bg-[#0A0A0A] text-white transition-all shadow-sm" data-category="all">
              All Products
            </button>
            ${CATEGORIES.map(cat => `
              <button class="hero-cat-btn whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#EFEAE0] text-[#333] border border-[#DDD4C4] transition-all" data-category="${cat.slug}">
                ${cat.name} (${cat.itemCount})
              </button>
            `).join('')}
          </div>
        </div>

      </div>
    </header>
  `;
}

export function initHeroBannerEvents() {
  const catButtons = document.querySelectorAll('.hero-cat-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => {
        b.className = 'hero-cat-btn whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#EFEAE0] text-[#333] border border-[#DDD4C4] transition-all';
      });
      btn.className = 'hero-cat-btn whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold bg-[#0A0A0A] text-white transition-all shadow-sm';
      const cat = btn.getAttribute('data-category');
      if (window.filterCategory) {
        window.filterCategory(cat);
      }
    });
  });
}
