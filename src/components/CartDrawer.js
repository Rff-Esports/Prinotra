// PRINTORA Slide-Over Bag / Cart Drawer Component
// Section 7: Strict FREE DELIVERY ALWAYS (₹0 Shipping Fee across India)
// Active Promo Coupons & Intelligent 20% OFF Upsell Recommendation

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { openCheckoutModal } from './CheckoutModal.js';

export function renderCartDrawer() {
  const cart = store.cart;
  const subtotal = store.getCartSubtotal();
  const discount = store.getCouponDiscount();
  const total = store.getCartTotal();
  const appliedCoupon = store.appliedCoupon;
  const activeCoupons = store.coupons || [];

  // Recommended quick-add merchandise options to bridge cart value to ₹2,499+
  const quickAddCandidates = [
    { id: 'prn-gft-04', defaultName: 'Custom Keychain', defaultPrice: 199, icon: '🔑' },
    { id: 'prn-drk-01', defaultName: 'Coffee Mug', defaultPrice: 299, icon: '☕' },
    { id: 'prn-gft-05', defaultName: 'Custom Cushion', defaultPrice: 299, icon: '🛋️' },
    { id: 'prn-gft-03', defaultName: 'Personalized Wallet', defaultPrice: 399, icon: '👛' }
  ];

  const quickAddProducts = quickAddCandidates.map(c => {
    const found = store.products?.find(p => p.id === c.id);
    return {
      id: c.id,
      name: found?.name || c.defaultName,
      price: found?.price || c.defaultPrice,
      icon: c.icon
    };
  });

  const isBulk20Unlocked = subtotal >= 2499;
  const isNearBulk20 = subtotal >= 1500 && subtotal < 2499;
  const bulkNeeded = Math.max(0, 2499 - subtotal);
  const progressPct = Math.min(100, Math.round((subtotal / 2499) * 100));
  const potentialSavings = Math.round((Math.max(2499, subtotal)) * 0.20);

  return `
    <div id="cart-drawer-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300"></div>
    <aside id="cart-drawer" class="fixed top-0 right-0 z-50 w-full max-w-md h-full bg-[#FAFAF7] text-[#111111] shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300 ease-out border-l border-[#E5E0D5]">
      
      <!-- Drawer Header -->
      <div class="p-5 border-b border-[#E5E0D5] flex items-center justify-between bg-white flex-shrink-0">
        <div class="flex items-center gap-2">
          ${renderIcon('shoppingBag', 'w-5 h-5 text-[#111]')}
          <h3 class="font-heading text-xl sm:text-2xl font-bold tracking-tight text-black">Shopping Bag</h3>
          <span class="text-xs bg-[#FF6B35] text-white px-2 py-0.5 rounded-full font-bold ml-1 font-mono">
            ${store.getCartCount()}
          </span>
        </div>
        <button id="cart-close-btn" class="cart-close-trigger p-1.5 text-[#777] hover:text-black rounded-lg hover:bg-[#F0EAE1] transition-colors cursor-pointer" aria-label="Close Bag">
          ${renderIcon('close', 'w-5 h-5 pointer-events-none')}
        </button>
      </div>

      <!-- Free Delivery Banner (Strict Business Requirement) -->
      <div class="bg-emerald-50 px-5 py-2.5 border-b border-emerald-200 flex-shrink-0">
        <div class="flex items-center justify-between text-xs text-emerald-800 font-bold">
          <span class="flex items-center gap-1.5 font-heading">
            ${renderIcon('check', 'w-4 h-4 text-emerald-600')} FREE SHIPPING ON ALL ORDERS ACROSS INDIA
          </span>
          <span class="font-mono text-emerald-700 font-extrabold">₹0</span>
        </div>
      </div>

      <!-- Scrollable Center Area: Cart Items, Upsell Nudge, and Active Coupons -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        ${cart.length === 0 ? `
          <div class="h-full flex flex-col items-center justify-center text-center py-16 text-[#777]">
            <div class="w-16 h-16 rounded-full bg-[#EFECE4] flex items-center justify-center mb-4 text-[#A8A49C]">
              ${renderIcon('shoppingBag', 'w-8 h-8')}
            </div>
            <h4 class="font-heading text-xl font-bold text-black mb-1">Your bag is empty</h4>
            <p class="text-xs max-w-xs text-[#888] mb-6">Discover customized apparel, sports jerseys, personalized drinkware and corporate gifts.</p>
            <a href="#catalogue" onclick="document.getElementById('cart-close-btn').click();" class="inline-block bg-[#111111] text-white text-xs font-bold px-6 py-3 rounded-xl uppercase tracking-wider hover:bg-[#FF6B35] transition-colors font-heading">
              Explore Catalogue
            </a>
          </div>
        ` : `
          <!-- Cart Items List -->
          <div class="space-y-3 divide-y divide-[#EFECE4]">
            ${cart.map(item => `
              <div class="pt-3 first:pt-0 flex gap-3 sm:gap-4 items-start">
                <!-- Product Thumbnail (strictly unchanged) -->
                <div class="w-16 h-20 sm:w-20 sm:h-24 bg-[#EFEAE0] rounded-xl overflow-hidden flex-shrink-0 border border-[#E5E0D5] relative">
                  <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                </div>

                <!-- Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="text-xs sm:text-sm font-bold text-[#111] truncate font-heading">${item.name}</h4>
                    <button class="cart-remove-item-btn text-[#999] hover:text-rose-600 p-0.5 transition-colors cursor-pointer" data-cart-id="${item.cartItemId}" title="Remove item">
                      ${renderIcon('trash', 'w-4 h-4')}
                    </button>
                  </div>

                  <!-- Options pills -->
                  <div class="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-[#666]">
                    ${item.selectedSize ? `<span class="bg-[#EFEAE0] px-1.5 py-0.5 rounded-md text-[10px] font-bold text-black font-mono">Size: ${item.selectedSize}</span>` : ''}
                    ${item.selectedColor ? `<span class="bg-[#EFEAE0] px-1.5 py-0.5 rounded-md text-[10px] font-bold text-black">Color: ${item.selectedColor}</span>` : ''}
                    ${item.phoneModel ? `<span class="bg-[#FFF1E8] text-[#FF6B35] px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono">Model: ${item.phoneModel}</span>` : ''}
                  </div>

                  <!-- Printing Customization Badge -->
                  ${item.printingType ? `
                    <div class="mt-1 flex flex-wrap items-center gap-1">
                      <span class="bg-[#FFF1E8] border border-[#FF6B35]/30 text-[#FF6B35] px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                        🖨️ ${item.printingType} (${item.printingPosition || 'Front'})${item.printingCharge ? ` +₹${item.printingCharge}` : ''}
                      </span>
                      ${item.uploadedDesign ? `
                        <span class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                          📎 ${item.uploadedDesign.name.length > 14 ? item.uploadedDesign.name.slice(0, 14) + '...' : item.uploadedDesign.name}
                        </span>
                      ` : ''}
                    </div>
                  ` : ''}

                  <!-- Customization tag if present -->
                  ${item.customName || item.customNumber ? `
                    <div class="mt-1 bg-[#FAF7F2] border border-[#E5E0D5] rounded-lg p-1.5 text-[10px] text-[#555] space-y-0.5">
                      ${item.customName ? `<div>Custom Name: <strong class="text-black uppercase">${item.customName}</strong></div>` : ''}
                      ${item.customNumber ? `<div>Jersey #: <strong class="text-black font-mono">#${item.customNumber}</strong></div>` : ''}
                    </div>
                  ` : ''}

                  <!-- Pricing & Quantity Controls -->
                  <div class="mt-2.5 flex items-center justify-between">
                    <span class="text-xs sm:text-sm font-bold text-black font-mono">₹${item.price * item.quantity}</span>
                    <div class="flex items-center border border-[#DDD4C4] rounded-xl bg-white">
                      <button class="cart-qty-btn px-2.5 py-0.5 text-xs text-[#666] hover:text-black font-bold cursor-pointer" data-cart-id="${item.cartItemId}" data-delta="-1">-</button>
                      <span class="px-2 text-xs font-bold text-black font-mono">${item.quantity}</span>
                      <button class="cart-qty-btn px-2.5 py-0.5 text-xs text-[#666] hover:text-black font-bold cursor-pointer" data-cart-id="${item.cartItemId}" data-delta="1">+</button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- SMART 20% OFF BULK20 UPSELL RECOMMENDATION -->
          ${isNearBulk20 ? `
            <div class="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-2 border-dashed border-[#FF6B35] rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <div class="flex items-start gap-2.5">
                <span class="text-2xl animate-bounce">🔥</span>
                <div>
                  <div class="flex items-center gap-1.5">
                    <strong class="text-xs sm:text-sm font-extrabold text-[#111] font-heading">
                      Add ₹${bulkNeeded} more to get 20% OFF!
                    </strong>
                    <span class="text-[9px] bg-[#FF6B35] text-white font-mono font-bold px-1.5 py-0.2 rounded uppercase">BULK20</span>
                  </div>
                  <p class="text-[11px] text-[#666] mt-0.5">
                    Cart value near ₹2,000+! Unlock <strong>FLAT 20% OFF</strong> (Save ₹${potentialSavings}+) on your order.
                  </p>
                </div>
              </div>

              <!-- Progress towards ₹2,499 -->
              <div class="space-y-1">
                <div class="flex justify-between text-[10px] font-bold text-[#666]">
                  <span>Current: <strong class="text-black font-mono">₹${subtotal}</strong></span>
                  <span class="text-[#FF6B35] font-mono">Target: ₹2,499 (${progressPct}%)</span>
                </div>
                <div class="w-full bg-white/80 border border-orange-200 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-gradient-to-r from-[#FF6B35] to-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${progressPct}%"></div>
                </div>
              </div>

              <!-- Quick Add Merchandise Options -->
              <div class="pt-1 border-t border-orange-200/60">
                <span class="text-[10px] uppercase font-bold tracking-wider text-[#666] block mb-1.5 font-heading">
                  ⚡ Recommended to add & unlock 20% OFF:
                </span>
                <div class="grid grid-cols-2 gap-1.5">
                  ${quickAddProducts.map(p => `
                    <button type="button" class="cart-quick-add-btn text-left p-1.5 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 transition-all flex items-center justify-between gap-1 group cursor-pointer shadow-xs" data-prod-id="${p.id}">
                      <div class="truncate">
                        <span class="text-[11px] font-bold text-black block truncate group-hover:text-[#FF6B35]">${p.icon} ${p.name}</span>
                        <span class="text-[10px] font-mono text-[#666]">₹${p.price}</span>
                      </div>
                      <span class="text-[10px] bg-[#111] group-hover:bg-[#FF6B35] text-white font-bold px-1.5 py-0.5 rounded-md font-mono flex-shrink-0">
                        + Add
                      </span>
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : isBulk20Unlocked ? `
            <div class="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3 flex items-center justify-between shadow-sm">
              <div class="flex items-center gap-2.5">
                <span class="text-2xl">🎉</span>
                <div>
                  <strong class="text-xs font-bold text-emerald-900 block font-heading">20% OFF UNLOCKED!</strong>
                  <span class="text-[11px] text-emerald-700">Orders above ₹2,499 qualify for coupon <strong>BULK20</strong> (Save ₹${Math.round(subtotal * 0.20)})</span>
                </div>
              </div>
              ${appliedCoupon?.code === 'BULK20' ? `
                <span class="text-[10px] bg-emerald-600 text-white font-bold px-2.5 py-1.5 rounded-xl font-mono uppercase tracking-wider flex-shrink-0">
                  APPLIED ✓
                </span>
              ` : `
                <button type="button" class="cart-apply-coupon-btn bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold font-mono px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow flex-shrink-0" data-coupon="BULK20">
                  Apply BULK20
                </button>
              `}
            </div>
          ` : `
            <div class="bg-[#FAF7F2] border border-[#DDD4C4] rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="text-base">💡</span>
                <span class="text-[11px] text-[#555]">
                  Order above <strong>₹2,499</strong> to get <strong>20% OFF</strong> with coupon <strong>BULK20</strong>
                </span>
              </div>
            </div>
          `}

          <!-- ACTIVE PROMO COUPONS SECTION -->
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-3.5 space-y-2.5 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="text-sm">🏷️</span>
                <span class="text-xs font-bold uppercase tracking-wider text-[#333] font-heading">
                  Active Coupons (${activeCoupons.length})
                </span>
              </div>
              ${appliedCoupon ? `
                <button type="button" class="cart-remove-coupon-btn text-[10px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer">
                  Remove (${appliedCoupon.code})
                </button>
              ` : ''}
            </div>

            <div class="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              ${activeCoupons.map(c => {
                const normInput = (c.code || '').toUpperCase().replace(/\s+/g, '');
                const normApplied = (appliedCoupon?.code || '').toUpperCase().replace(/\s+/g, '');
                const isApplied = appliedCoupon && normApplied === normInput;
                const isEligible = subtotal >= (c.minOrder || 0);
                const needed = (c.minOrder || 0) - subtotal;

                return `
                  <div class="p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs ${isApplied ? 'bg-emerald-50 border-emerald-400' : 'bg-[#FAF8F5] border-[#E8E2D8] hover:border-black/30'}">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-1.5">
                        <span class="font-mono font-extrabold text-[10px] px-1.5 py-0.5 rounded tracking-wide ${isApplied ? 'bg-emerald-600 text-white' : 'bg-[#111] text-[#FF6B35]'}">
                          ${c.code}
                        </span>
                        <span class="font-bold text-[11px] text-black">${c.discountType === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}</span>
                      </div>
                      <p class="text-[10px] text-[#666] truncate mt-0.5">${c.description || (c.minOrder > 0 ? `Min. order ₹${c.minOrder}` : 'No minimum order')}</p>
                    </div>

                    <div class="flex-shrink-0">
                      ${isApplied ? `
                        <span class="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg">
                          Applied ✓
                        </span>
                      ` : isEligible ? `
                        <button type="button" class="cart-apply-coupon-btn bg-[#111] hover:bg-[#FF6B35] text-white text-[11px] font-bold font-mono px-3 py-1 rounded-lg transition-colors cursor-pointer shadow-xs" data-coupon="${c.code}">
                          Apply
                        </button>
                      ` : `
                        <span class="text-[9px] font-bold text-[#888] bg-[#EFECE4] px-2 py-0.5 rounded block text-center" title="Add ₹${needed} more to qualify">
                          Add ₹${needed}
                        </span>
                      `}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `}
      </div>

      <!-- Drawer Footer with Pricing Breakdown & Checkout Trigger -->
      ${cart.length > 0 ? `
        <div class="p-5 border-t border-[#E5E0D5] bg-white space-y-3 flex-shrink-0">
          <div class="space-y-1.5 text-xs text-[#666]">
            <div class="flex justify-between">
              <span>Items Subtotal:</span>
              <span class="font-mono text-black font-bold">₹${subtotal}</span>
            </div>
            ${discount > 0 ? `
              <div class="flex justify-between text-emerald-700 font-bold">
                <span class="flex items-center gap-1">
                  <span>Coupon Discount</span>
                  <span class="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-300">(${appliedCoupon?.code})</span>:
                </span>
                <span class="font-mono text-emerald-700">-₹${discount}</span>
              </div>
            ` : ''}
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-1 text-emerald-700 font-bold">
                ${renderIcon('truck', 'w-3.5 h-3.5')} Pan-India Shipping Fee:
              </span>
              <span class="font-mono uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                FREE (₹0)
              </span>
            </div>
            <div class="flex justify-between text-base font-extrabold text-black pt-2 border-t border-[#EFECE4]">
              <span>Total Payable:</span>
              <span class="font-mono text-xl text-[#FF6B35]">₹${total}</span>
            </div>
          </div>

          <!-- Checkout Trigger Button -->
          <button id="cart-proceed-checkout-btn" class="w-full bg-[#111111] hover:bg-[#FF6B35] text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-xl font-heading cursor-pointer">
            <span>Proceed to Checkout</span>
            ${renderIcon('arrowRight', 'w-4 h-4')}
          </button>

          <p class="text-[10px] text-center text-[#888]">
            🔒 Official PRINTORA Guarantee • Free Express Delivery Across India
          </p>
        </div>
      ` : ''}

    </aside>
  `;
}

export function initCartDrawerEvents() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');

  const openDrawer = () => {
    const d = document.getElementById('cart-drawer');
    const b = document.getElementById('cart-drawer-backdrop');
    if (d && b) {
      b.classList.remove('hidden');
      b.classList.remove('pointer-events-none');
      requestAnimationFrame(() => {
        b.classList.remove('opacity-0');
        d.classList.remove('translate-x-full');
      });
    }
  };

  const closeDrawer = () => {
    const d = document.getElementById('cart-drawer');
    const b = document.getElementById('cart-drawer-backdrop');
    if (d && b) {
      b.classList.add('opacity-0');
      b.classList.add('pointer-events-none');
      d.classList.add('translate-x-full');
      setTimeout(() => b.classList.add('hidden'), 300);
    }
  };

  window.openCartDrawer = openDrawer;
  window.closeCartDrawer = closeDrawer;

  // Delegated close listener on document ensures cross button & backdrop ALWAYS work even after innerHTML re-renders
  document.addEventListener('click', (e) => {
    if (e.target.closest('#cart-close-btn') || e.target.closest('.cart-close-trigger') || e.target.id === 'cart-close-btn') {
      e.preventDefault();
      closeDrawer();
      return;
    }
    if (e.target.id === 'cart-drawer-backdrop') {
      e.preventDefault();
      closeDrawer();
      return;
    }
  });

  if (drawer) {
    drawer.addEventListener('click', (e) => {
      // 0. Close Drawer cross button inside drawer
      if (e.target.closest('#cart-close-btn') || e.target.closest('.cart-close-trigger')) {
        e.preventDefault();
        closeDrawer();
        return;
      }

      // 1. Quantity modification
      const qtyBtn = e.target.closest('.cart-qty-btn');
      if (qtyBtn) {
        const id = qtyBtn.getAttribute('data-cart-id');
        const delta = parseInt(qtyBtn.getAttribute('data-delta'), 10);
        store.updateCartQuantity(id, delta);
        return;
      }

      // 2. Remove item
      const removeBtn = e.target.closest('.cart-remove-item-btn');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-cart-id');
        store.removeFromCart(id);
        return;
      }

      // 3. Quick-Add recommendation to reach ₹2,499 for 20% OFF
      const quickAddBtn = e.target.closest('.cart-quick-add-btn');
      if (quickAddBtn) {
        const prodId = quickAddBtn.getAttribute('data-prod-id');
        const prod = store.products?.find(p => p.id === prodId) || store.products?.[0];
        if (prod) {
          store.addToCart(prod, {
            size: prod.sizes?.[0] || 'Standard',
            color: prod.colors?.[0]?.name || 'Standard',
            quantity: 1
          });
          store.showToast(`Added ${prod.name} (+₹${prod.price}) to bag!`, 'success');
        }
        return;
      }

      // 4. Apply coupon
      const applyCouponBtn = e.target.closest('.cart-apply-coupon-btn');
      if (applyCouponBtn) {
        const code = applyCouponBtn.getAttribute('data-coupon');
        if (code) {
          store.applyCoupon(code);
        }
        return;
      }

      // 5. Remove coupon
      const removeCouponBtn = e.target.closest('.cart-remove-coupon-btn');
      if (removeCouponBtn) {
        store.removeCoupon();
        return;
      }

      // 6. Proceed to Checkout
      const checkoutBtn = e.target.closest('#cart-proceed-checkout-btn');
      if (checkoutBtn) {
        closeDrawer();
        openCheckoutModal();
      }
    });
  }

  const navCartBtn = document.getElementById('nav-cart-btn');
  if (navCartBtn) {
    navCartBtn.addEventListener('click', openDrawer);
  }
}
