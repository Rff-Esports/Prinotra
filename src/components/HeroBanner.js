// PRINTORA Luxury Hero Banner Component
// Section 5: Exact Headline "YOUR IDEAS. YOUR STYLE. YOUR PRINT.", description, buttons SHOP NOW & CUSTOMIZE YOUR PRODUCT

import { renderIcon } from '../utils/icons.js';
import { CATEGORIES } from '../data/products.js';
import { store } from '../services/store.js';

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

              <!-- Primary Action Buttons -->
              <div class="flex flex-wrap items-center gap-3 pt-2">
                <a href="#catalogue" class="bg-[#111111] hover:bg-[#FF6B35] text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl flex items-center gap-2.5 font-heading">
                  <span>SHOP NOW</span>
                  ${renderIcon('arrowRight', 'w-4 h-4')}
                </a>

                <a href="#custom-jersey" class="bg-white hover:bg-[#FAF8F5] text-[#111111] hover:border-black font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all duration-300 border-2 border-[#DDD4C4] flex items-center gap-2.5 shadow-sm font-heading">
                  ${renderIcon('shirt', 'w-4 h-4 text-[#FF6B35]')}
                  <span>CUSTOM JERSEYS (₹499)</span>
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
                  <strong class="text-black block font-bold text-base">HD Prints</strong>
                  <span class="text-[11px] text-[#777]">300+ DPI Sublimation</span>
                </div>
              </div>

            </div>

            <!-- Right: Animated Diwali Festive Live Coupon Card -->
            <div class="lg:col-span-5 relative">
              <div class="relative mx-auto max-w-md lg:max-w-none">
                
                <!-- Diwali Festive Glow Container -->
                <div class="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#FFD166]/60 bg-gradient-to-br from-[#1F0A2E] via-[#2D0B44] to-[#140026] p-6 sm:p-8 text-center text-white group shadow-[0_10px_40px_rgba(255,107,53,0.25)]">
                  
                  <!-- Ambient Glowing Festive Fireworks / Diyas Background -->
                  <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#FFB703]/25 blur-3xl animate-pulse"></div>
                  <div class="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#FF6B35]/25 blur-3xl animate-pulse" style="animation-delay: 1.2s;"></div>
                  
                  <!-- Floating Sparkle Particles -->
                  <div class="absolute top-4 left-6 text-xl opacity-75 animate-bounce" style="animation-duration: 2.4s;">✨</div>
                  <div class="absolute top-8 right-8 text-xl opacity-75 animate-bounce" style="animation-duration: 3s; animation-delay: 0.5s;">🎆</div>
                  <div class="absolute bottom-16 right-6 text-xl opacity-75 animate-pulse" style="animation-duration: 2s;">🪔</div>
                  <div class="absolute bottom-20 left-6 text-xl opacity-75 animate-pulse" style="animation-duration: 2.2s; animation-delay: 0.8s;">✨</div>

                  <!-- Diwali Festival Badge -->
                  <div class="relative z-10 inline-flex items-center gap-2 bg-[#FFD166]/15 border border-[#FFD166]/50 px-4 py-1.5 rounded-full text-[11px] font-extrabold text-[#FFD166] tracking-[0.2em] uppercase font-mono shadow-lg backdrop-blur-md mb-4">
                    <span class="animate-spin text-sm" style="animation-duration: 6s;">🪔</span>
                    <span>FESTIVAL OF LIGHTS SPECIAL</span>
                    <span class="animate-pulse">✨</span>
                  </div>

                  <!-- Grand Discount Headline -->
                  <div class="relative z-10 my-2">
                    <div class="text-[12px] font-bold uppercase tracking-[0.3em] text-[#FFB703] font-heading">
                      LIMITED TIME DIWALI OFFER
                    </div>
                    <div class="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] via-[#FFB703] to-[#FF6B35] font-heading drop-shadow-md py-1">
                      FLAT 10% OFF
                    </div>
                    <p class="text-xs text-[#E5D7F0] mt-1 font-medium max-w-xs mx-auto leading-relaxed">
                      Light up your wardrobe with custom prints! Get instant 10% discount on all custom apparel, oversized tees, hoodies & personalized gifts.
                    </p>
                  </div>

                  <!-- Interactive Golden Coupon Box -->
                  <div class="relative z-10 mt-5 mb-4 p-4 rounded-2xl bg-black/40 border-2 border-dashed border-[#FFD166]/70 backdrop-blur-md shadow-inner">
                    <div class="flex items-center justify-between text-[11px] font-semibold text-[#FFD166] mb-1.5 px-1">
                      <span>🎟️ OFFICIAL LIVE COUPON</span>
                      <span class="text-emerald-400 font-bold">● ACTIVE NOW</span>
                    </div>

                    <div class="flex items-center justify-between gap-2 bg-gradient-to-r from-[#2B1038] to-[#180524] border border-[#FFD166]/40 p-2.5 rounded-xl">
                      <div class="text-left pl-1">
                        <span class="text-[9px] uppercase tracking-wider text-[#CCC] block font-mono">COUPON CODE</span>
                        <span id="hero-diwali-code-text" class="text-xl sm:text-2xl font-black tracking-widest text-[#FFE600] font-mono select-all">DIWALI10</span>
                      </div>

                      <button type="button" id="hero-copy-diwali-btn" class="bg-gradient-to-r from-[#FFB703] to-[#FF6B35] hover:from-[#FFA200] hover:to-[#E55A2B] text-black font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md flex items-center gap-1.5 font-heading cursor-pointer">
                        <span id="hero-copy-diwali-icon">📋</span>
                        <span id="hero-copy-diwali-label">COPY CODE</span>
                      </button>
                    </div>

                    <div class="flex items-center justify-between text-[10px] text-[#D8C7E8] mt-2.5 px-1">
                      <span>✓ No Minimum Order Value</span>
                      <span class="text-[#FFD166] font-bold">100% Free Shipping</span>
                    </div>
                  </div>

                  <!-- Festive Action CTAs -->
                  <div class="relative z-10 grid grid-cols-2 gap-2 mt-2">
                    <a href="#custom-jersey" class="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1">
                      <span>🎽 Custom Jerseys</span>
                    </a>
                    <a href="#catalogue" class="bg-[#FFE600] hover:bg-[#FFD166] text-black font-black text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-lg">
                      <span>Claim 10% Off →</span>
                    </a>
                  </div>

                  <!-- Floating Bottom Diya Badges -->
                  <div class="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-around text-[11px] text-[#FFD166]">
                    <span class="flex items-center gap-1">🪔 <span>Pure Cotton Bio-Wash</span></span>
                    <span class="text-white/30">•</span>
                    <span class="flex items-center gap-1">✨ <span>Free Pan-India Delivery</span></span>
                  </div>

                </div>

                <!-- Offset Decorative Festive Badge -->
                <div class="hidden sm:flex absolute -top-4 -left-4 bg-[#FFE600] text-black px-3.5 py-2 rounded-2xl shadow-xl border-2 border-black font-heading items-center gap-1.5 z-20 animate-pulse">
                  <span class="text-base">🪔</span>
                  <div>
                    <span class="text-[9px] font-extrabold uppercase tracking-wider block leading-none">DIWALI SPECIAL</span>
                    <span class="text-xs font-black tracking-tight leading-tight">10% OFF LIVE</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <!-- How Printora Works Section -->
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
                <h4 class="font-heading text-base font-bold text-black">Personalize Your Order</h4>
                <p class="text-xs text-[#666] leading-relaxed">Add your name, number, custom artwork, or phone model directly when selecting your product or at checkout.</p>
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

  // Diwali Coupon Copy Handler
  const copyBtn = document.getElementById('hero-copy-diwali-btn');
  const codeText = document.getElementById('hero-diwali-code-text');
  const copyLabel = document.getElementById('hero-copy-diwali-label');
  const copyIcon = document.getElementById('hero-copy-diwali-icon');

  if (copyBtn && codeText) {
    copyBtn.addEventListener('click', () => {
      const code = 'DIWALI10';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
      if (copyLabel) copyLabel.textContent = 'COPIED! ✓';
      if (copyIcon) copyIcon.textContent = '🎉';
      copyBtn.classList.remove('from-[#FFB703]', 'to-[#FF6B35]');
      copyBtn.classList.add('from-emerald-400', 'to-emerald-500');

      store.showToast('🎉 Coupon "DIWALI10" copied! Flat 10% off will be applied at checkout.', 'success');

      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = 'COPY CODE';
        if (copyIcon) copyIcon.textContent = '📋';
        copyBtn.classList.remove('from-emerald-400', 'to-emerald-500');
        copyBtn.classList.add('from-[#FFB703]', 'to-[#FF6B35]');
      }, 3000);
    });
  }
}
