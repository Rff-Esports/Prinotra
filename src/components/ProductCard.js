// PRINTORA Minimalist Luxury Product Card Component
// Section 6 (Prices), Section 7 (Free Delivery Badge), Section 21 (Wishlist Toggle)

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';

export function renderProductCard(product) {
  const isQuote = product.isQuoteOnly;
  const isJersey = product.customization?.isJerseyCustomizer;
  const inWishlist = store.isInWishlist(product.id);

  return `
    <article class="luxury-card group bg-white border border-[#DDD4C4] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 relative shadow-sm hover:shadow-xl hover:border-black" data-product-id="${product.id}">
      
      <!-- Top Image Container -->
      <div class="relative aspect-[4/5] bg-[#EFEAE0] overflow-hidden cursor-pointer" onclick="window.openProductDetail('${product.id}')">
        <img src="${product.images?.[0] || ''}" alt="${product.name}" 
             class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
             loading="lazy">

        <!-- Category & Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span class="bg-black/90 backdrop-blur-sm text-white text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded font-heading">
            ${product.categoryName}
          </span>
          ${isJersey ? `
            <span class="bg-[#FF6B35] text-white text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded shadow font-heading">
              PRO JERSEY
            </span>
          ` : ''}
          ${product.isFeatured ? `
            <span class="bg-white/95 text-black text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm">
              BESTSELLER
            </span>
          ` : ''}
        </div>

        <!-- Wishlist Button (Top Right) -->
        <button type="button" class="prod-wishlist-toggle-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110 z-10" 
                data-id="${product.id}" title="Add to Wishlist" onclick="event.stopPropagation(); window.toggleWishlist('${product.id}');">
          ${renderIcon('heart', `w-4 h-4 ${inWishlist ? 'text-[#FF6B35] fill-current' : 'text-[#555]'}`)}
        </button>

        <!-- Hover Quick Actions Pill -->
        <div class="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 z-10">
          <button type="button" class="flex-1 bg-white/95 backdrop-blur-md hover:bg-[#111] hover:text-white text-black py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-1.5 font-heading" onclick="event.stopPropagation(); window.openProductDetail('${product.id}')">
            ${renderIcon('eye', 'w-3.5 h-3.5')}
            <span>${isQuote ? 'Quote Info' : 'Customize & Preview'}</span>
          </button>
        </div>
      </div>

      <!-- Card Info -->
      <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-[#777] uppercase tracking-wider font-bold block font-heading">
              ${product.subtitle || product.categoryName}
            </span>
            <span class="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
              Free Delivery
            </span>
          </div>
          <h3 class="font-heading text-base font-bold text-[#111111] mt-1 group-hover:text-[#FF6B35] transition-colors leading-snug cursor-pointer" onclick="window.openProductDetail('${product.id}')">
            ${product.name}
          </h3>
          <p class="text-[11px] text-[#666] line-clamp-2 mt-1 leading-relaxed">
            ${product.description}
          </p>
        </div>

        <!-- Pricing & Action Row -->
        <div class="pt-3 border-t border-[#EFECE4] flex items-center justify-between">
          <div>
            ${isQuote ? `
              <span class="text-xs font-bold text-[#777] tracking-wider uppercase font-heading">Contact for Price</span>
            ` : `
              <div class="flex items-baseline gap-1.5">
                <span class="text-base font-bold font-mono text-black">
                  ₹${product.price}
                </span>
                ${product.isOnwards ? `<span class="text-[10px] text-[#777] font-medium">onwards</span>` : ''}
                ${product.originalPrice ? `
                  <span class="text-[11px] text-[#999] line-through font-mono">₹${product.originalPrice}</span>
                ` : ''}
              </div>
            `}
          </div>

          <!-- Quick Action Button -->
          ${isJersey ? `
            <a href="#custom-jersey" class="bg-[#111111] hover:bg-[#FF6B35] text-white p-2 rounded-xl transition-colors shadow-sm flex items-center gap-1 text-[11px] font-bold px-3 font-heading" title="Design Custom Jersey">
              ${renderIcon('palette', 'w-3.5 h-3.5')}
              <span>Customize</span>
            </a>
          ` : isQuote ? `
            <button type="button" class="bg-[#F0EAE1] hover:bg-[#DDD4C4] text-black p-2 rounded-xl text-[11px] font-bold px-3 transition-colors font-heading" onclick="window.openProductDetail('${product.id}')">
              Enquire
            </button>
          ` : `
            <button type="button" class="bg-[#111111] hover:bg-[#FF6B35] text-white p-2 rounded-xl transition-colors shadow-sm flex items-center gap-1 text-[11px] font-bold px-3 font-heading" onclick="window.openProductDetail('${product.id}')">
              ${renderIcon('shoppingBag', 'w-3.5 h-3.5')}
              <span>Order</span>
            </button>
          `}
        </div>

      </div>

    </article>
  `;
}
