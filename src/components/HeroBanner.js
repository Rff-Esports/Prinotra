// PRINTORA Luxury Hero Banner Component
// Section 5: Exact Headline "YOUR IDEAS. YOUR STYLE. YOUR PRINT.", description, buttons SHOP NOW & CUSTOMIZE YOUR PRODUCT

import { renderIcon } from '../utils/icons.js';
import { CATEGORIES } from '../data/products.js';

export function renderHeroBanner() {
  return `
    <header class="relative bg-[#FAFAF7] border-b border-[#E5DFD4] overflow-hidden">
      
      <!-- Prominent Free Shipping Ribbon (Strict Business Requirement) -->
      <div class="bg-[#FF6B35] text-white py-2.5 px-4 text-center font-heading font-extrabold text-xs tracking-wider uppercase shadow-sm">
        <span>🚀 FREE SHIPPING ACROSS INDIA – NO DELIVERY CHARGES! 📦</span>
      </div>

      <!-- Luxury Editorial Hero -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <!-- Left: Editorial Headlines & CTAs (Cols 1-7) -->
          <div class="lg:col-span-7 space-y-6 text-left">
            <div class="inline-flex items-center gap-2 bg-[#EFEAE0] border border-[#DDD4C4] px-3.5 py-1.5 rounded-full text-[11px] font-bold text-[#111] uppercase tracking-[0.2em] font-heading">
              <span class="w-2 h-2 rounded-full bg-[#FF6B35]"></span>
              <span>Official Custom Merchandise & Gifting Platform</span>
            </div>

            <h1 class="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#111111] leading-[1.05]">
              YOUR IDEAS.<br>
              YOUR STYLE.<br>
              <span class="text-[#FF6B35]">YOUR PRINT.</span>
            </h1>

            <p class="text-sm md:text-base text-[#555555] max-w-xl leading-relaxed font-medium">
              Turn your imagination into personalized products. Custom apparel, jerseys and gifts made just for you.
            </p>

            <!-- Primary Action Buttons (Section 5 Spec) -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <a href="#catalogue" class="bg-[#111111] hover:bg-[#FF6B35] text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl flex items-center gap-2.5 font-heading">
                <span>SHOP NOW</span>
                ${renderIcon('arrowRight', 'w-4 h-4')}
              </a>

              <a href="#custom-studio" class="bg-white hover:bg-[#FAF8F5] text-[#111111] hover:border-black font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all duration-300 border-2 border-[#DDD4C4] flex items-center gap-2.5 shadow-sm font-heading">
                ${renderIcon('shirt', 'w-4 h-4 text-[#FF6B35]')}
                <span>CUSTOMIZE YOUR PRODUCT</span>
              </a>

              <a href="#studio-3d" class="bg-[#111] hover:bg-[#FF6B35] text-white font-extrabold text-xs uppercase tracking-widest px-6 py-4 rounded-2xl transition-all duration-300 flex items-center gap-2 font-heading shadow-md">
                <span>3D STUDIO (360°)</span>
              </a>
            </div>

            <!-- Value Props Badges -->
            <div class="pt-6 border-t border-[#E5DFD4] grid grid-cols-3 gap-4 text-xs text-[#555]">
              <div>
                <strong class="text-black block font-bold text-base font-mono">₹499</strong>
                <span class="text-[11px] text-[#777]">Custom Pro Jerseys</span>
              </div>
              <div>
                <strong class="text-black block font-bold text-base">FREE DELIVERY</strong>
                <span class="text-[11px] text-[#777]">₹0 On All Orders</span>
              </div>
              <div>
                <strong class="text-black block font-bold text-base">360° Studio</strong>
                <span class="text-[11px] text-[#777]">Interactive 3D Preview</span>
              </div>
            </div>

          </div>

          <!-- Right: Visual Editorial Showcase (Cols 8-12) -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              
              <!-- Luxury Image Showcase Frame -->
              <div class="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#EFEAE0]">
                <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80" 
                     alt="Printora Custom T-shirt & Apparel" 
                     class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                <!-- Floating Showcase Card -->
                <div class="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E5DFD4] shadow-xl flex items-center justify-between">
                  <div>
                    <span class="text-[9px] uppercase tracking-widest text-[#FF6B35] font-extrabold font-heading">Interactive Studio</span>
                    <h4 class="font-heading text-lg font-bold text-black">Live 3D Customizer</h4>
                    <p class="text-[11px] text-[#666]">Round Neck, Oversized, Polo & Jerseys</p>
                  </div>
                  <a href="#studio-3d" class="bg-[#111] text-white p-3 rounded-xl hover:bg-[#FF6B35] transition-colors" title="Launch 3D Studio">
                    ${renderIcon('arrowRight', 'w-4 h-4')}
                  </a>
                </div>
              </div>

              <!-- Offset Accent Badge -->
              <div class="hidden sm:block absolute -top-5 -left-5 bg-[#111111] text-white p-4 rounded-2xl shadow-xl border border-[#333]">
                <span class="text-[9px] text-[#FF6B35] uppercase tracking-widest font-bold font-heading">Zero Shipping Fee</span>
                <p class="font-heading text-sm font-bold">100% Free Shipping India</p>
              </div>

            </div>
          </div>

        </div>

        <!-- How Printora Works Section (Section 5 Requirement 11) -->
        <div class="mt-14 pt-8 border-t border-[#E5DFD4]">
          <div class="text-center max-w-2xl mx-auto mb-8">
            <span class="text-xs uppercase tracking-widest font-bold text-[#FF6B35] font-heading">Simple 3-Step Process</span>
            <h3 class="font-heading text-2xl font-bold text-black mt-1">How Printora Works</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-5 rounded-2xl border border-[#DDD4C4] shadow-sm space-y-2">
              <span class="w-8 h-8 rounded-full bg-[#111] text-[#FF6B35] flex items-center justify-center font-bold text-xs font-mono">01</span>
              <h4 class="font-heading text-base font-bold text-black">Choose Your Garment or Gift</h4>
              <p class="text-xs text-[#666] leading-relaxed">Pick from 100% bio-washed round neck tees, oversized hoodies, dry-fit jerseys, or ceramic mugs.</p>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#DDD4C4] shadow-sm space-y-2">
              <span class="w-8 h-8 rounded-full bg-[#111] text-[#FF6B35] flex items-center justify-center font-bold text-xs font-mono">02</span>
              <h4 class="font-heading text-base font-bold text-black">Personalize Live in 2D & 3D</h4>
              <p class="text-xs text-[#666] leading-relaxed">Enter your name, lucky number, pick from 12 Google fonts, or upload your team artwork with instant preview.</p>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#DDD4C4] shadow-sm space-y-2">
              <span class="w-8 h-8 rounded-full bg-[#111] text-[#FF6B35] flex items-center justify-center font-bold text-xs font-mono">03</span>
              <h4 class="font-heading text-base font-bold text-black">Free Pan-India Delivery</h4>
              <p class="text-xs text-[#666] leading-relaxed">Every order is custom printed and dispatched with 10-stage tracking and ₹0 delivery charges.</p>
            </div>
          </div>
        </div>

        <!-- Category Filter Carousel Pills -->
        <div class="mt-12 pt-8 border-t border-[#E5DFD4]">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-bold uppercase tracking-[0.2em] text-[#777] font-heading">Shop By Category</span>
            <span class="text-xs text-[#FF6B35] font-bold">Free Shipping Guaranteed</span>
          </div>

          <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none" id="hero-category-pills">
            <button class="hero-cat-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold bg-[#111111] text-white transition-all shadow-sm font-heading" data-category="all">
              All Products
            </button>
            ${CATEGORIES.map(cat => `
              <button class="hero-cat-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold bg-white hover:bg-[#EFEAE0] text-[#333] border border-[#DDD4C4] transition-all font-heading" data-category="${cat.slug}">
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
        b.className = 'hero-cat-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold bg-white hover:bg-[#EFEAE0] text-[#333] border border-[#DDD4C4] transition-all font-heading';
      });
      btn.className = 'hero-cat-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold bg-[#111111] text-white transition-all shadow-sm font-heading';
      const cat = btn.getAttribute('data-category');
      if (window.filterCategory) {
        window.filterCategory(cat);
      }
    });
  });
}
