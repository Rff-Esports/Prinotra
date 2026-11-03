// PRINTORA Minimalist Luxury Product Card Component
import { renderIcon } from '../utils/icons.js';

export function renderProductCard(product) {
  const isQuote = product.isQuoteOnly;
  const isJersey = product.customization?.isJerseyCustomizer;

  return `
    <article class="luxury-card group bg-white border border-[#DDD4C4] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 relative" data-product-id="${product.id}">
      
      <!-- Top Image Container -->
      <div class="relative aspect-[4/5] bg-[#EFEAE0] overflow-hidden cursor-pointer" onclick="window.openProductDetail('${product.id}')">
        <img src="${product.images?.[0] || ''}" alt="${product.name}" 
             class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
             loading="lazy">

        <!-- Category & Special Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span class="bg-black/85 backdrop-blur-sm text-white text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded">
            ${product.categoryName}
          </span>
          ${isJersey ? `
            <span class="bg-[#C5A880] text-black text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded shadow">
              PRO JERSEYS
            </span>
          ` : ''}
          ${product.isFeatured ? `
            <span class="bg-white/90 text-black text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm">
              BESTSELLER
            </span>
          ` : ''}
        </div>

        <!-- Hover Quick Actions Pill -->
        <div class="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <button type="button" class="flex-1 bg-white/95 backdrop-blur-md hover:bg-black hover:text-white text-black py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-1.5" onclick="event.stopPropagation(); window.openProductDetail('${product.id}')">
            ${renderIcon('eye', 'w-3.5 h-3.5')}
            <span>${isQuote ? 'Quote Info' : 'Customize'}</span>
          </button>
        </div>
      </div>

      <!-- Card Info -->
      <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span class="text-[10px] text-[#787673] uppercase tracking-wider font-medium block">
            ${product.subtitle || product.categoryName}
          </span>
          <h3 class="font-serif text-lg font-normal text-[#0A0A0A] mt-0.5 group-hover:text-[#997A52] transition-colors leading-snug cursor-pointer" onclick="window.openProductDetail('${product.id}')">
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
              <span class="text-xs font-bold text-[#888] tracking-wider uppercase">REQUEST A QUOTE</span>
            ` : `
              <div class="flex items-baseline gap-1.5">
                <span class="text-base font-bold font-mono text-black">
                  ₹${product.price}
                </span>
                ${product.isOnwards ? `<span class="text-[10px] text-[#888] font-medium">onwards</span>` : ''}
                ${product.originalPrice ? `
                  <span class="text-[11px] text-[#999] line-through font-mono">₹${product.originalPrice}</span>
                ` : ''}
              </div>
            `}
          </div>

          <!-- Quick Action Button -->
          ${isJersey ? `
            <a href="#custom-jersey" class="bg-[#0A0A0A] hover:bg-[#C5A880] text-white hover:text-black p-2 rounded-lg transition-colors shadow-sm flex items-center gap-1 text-[11px] font-semibold px-3" title="Design Custom Jersey">
              ${renderIcon('palette', 'w-3.5 h-3.5')}
              <span>Design</span>
            </a>
          ` : isQuote ? `
            <button type="button" class="bg-[#F0EAE1] hover:bg-[#DDD4C4] text-black p-2 rounded-lg text-[11px] font-semibold px-3 transition-colors" onclick="window.openProductDetail('${product.id}')">
              Enquire
            </button>
          ` : `
            <button type="button" class="bg-[#0A0A0A] hover:bg-[#C5A880] text-white hover:text-black p-2 rounded-lg transition-colors shadow-sm flex items-center gap-1 text-[11px] font-semibold px-3" onclick="window.openProductDetail('${product.id}')">
              ${renderIcon('shoppingBag', 'w-3.5 h-3.5')}
              <span>Order</span>
            </button>
          `}
        </div>

      </div>

    </article>
  `;
}
