// PRINTORA Slide-Over Bag / Cart Drawer Component
import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';

export function renderCartDrawer() {
  const cart = store.cart;
  const subtotal = store.getCartSubtotal();
  const freeThreshold = store.settings.freeShippingThreshold;
  const shippingCharge = store.getShippingCharge();
  const total = store.getCartTotal();
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const diffForFree = Math.max(0, freeThreshold - subtotal);

  return `
    <div id="cart-drawer-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300"></div>
    <aside id="cart-drawer" class="fixed top-0 right-0 z-50 w-full max-w-md h-full bg-[#FAFAF7] text-[#111111] shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300 ease-out border-l border-[#E5E0D5]">
      
      <!-- Drawer Header -->
      <div class="p-6 border-b border-[#E5E0D5] flex items-center justify-between bg-white">
        <div class="flex items-center gap-2">
          ${renderIcon('shoppingBag', 'w-5 h-5 text-[#111]')}
          <h3 class="font-serif text-2xl font-medium tracking-tight">Shopping Bag</h3>
          <span class="text-xs bg-[#F0EAE1] text-[#787673] px-2 py-0.5 rounded-full font-medium ml-1">
            ${store.getCartCount()}
          </span>
        </div>
        <button id="cart-close-btn" class="p-1.5 text-[#787673] hover:text-black rounded-lg hover:bg-[#F0EAE1] transition-colors" aria-label="Close Bag">
          ${renderIcon('close', 'w-5 h-5')}
        </button>
      </div>

      <!-- Free Delivery Progress Bar -->
      <div class="bg-[#F7F4EE] px-6 py-3 border-b border-[#E5E0D5]">
        <div class="flex items-center justify-between text-xs mb-1.5">
          ${diffForFree === 0 ? `
            <span class="text-emerald-700 font-semibold flex items-center gap-1">
              ${renderIcon('check', 'w-3.5 h-3.5 text-emerald-600')} You've unlocked FREE Pan-India Shipping!
            </span>
          ` : `
            <span class="text-[#666]">Add <strong class="text-black">₹${diffForFree}</strong> more for <strong>FREE Pan-India Delivery</strong></span>
          `}
          <span class="font-mono text-[11px] font-semibold text-[#888]">${freeShippingProgress}%</span>
        </div>
        <div class="w-full h-1.5 bg-[#E5E0D5] rounded-full overflow-hidden">
          <div class="h-full ${diffForFree === 0 ? 'bg-emerald-600' : 'bg-[#C5A880]'} transition-all duration-500 rounded-full" style="width: ${freeShippingProgress}%"></div>
        </div>
      </div>

      <!-- Cart Items Scroll Area -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-[#EFECE4]">
        ${cart.length === 0 ? `
          <div class="h-full flex flex-col items-center justify-center text-center py-16 text-[#787673]">
            <div class="w-16 h-16 rounded-full bg-[#EFECE4] flex items-center justify-center mb-4 text-[#A8A49C]">
              ${renderIcon('shoppingBag', 'w-8 h-8')}
            </div>
            <h4 class="font-serif text-xl font-medium text-black mb-1">Your bag is empty</h4>
            <p class="text-xs max-w-xs text-[#888] mb-6">Discover customized apparel, sports jerseys, personalized drinkware and corporate gifts.</p>
            <a href="#catalogue" onclick="document.getElementById('cart-close-btn').click();" class="inline-block bg-[#111111] text-white text-xs font-semibold px-6 py-3 rounded-lg uppercase tracking-wider hover:bg-[#C5A880] hover:text-black transition-colors">
              Explore Catalogue
            </a>
          </div>
        ` : cart.map(item => `
          <div class="pt-4 first:pt-0 flex gap-4 items-start">
            <!-- Product Thumbnail -->
            <div class="w-20 h-24 bg-[#EFEAE0] rounded-lg overflow-hidden flex-shrink-0 border border-[#E5E0D5] relative">
              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <h4 class="text-sm font-semibold text-[#111] truncate">${item.name}</h4>
                <button class="cart-remove-item-btn text-[#999] hover:text-rose-600 p-0.5 transition-colors" data-cart-id="${item.cartItemId}" title="Remove item">
                  ${renderIcon('trash', 'w-4 h-4')}
                </button>
              </div>

              <!-- Options pills -->
              <div class="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-[#666]">
                ${item.selectedSize ? `<span class="bg-[#EFEAE0] px-1.5 py-0.5 rounded text-[10px] font-medium text-black">Size: ${item.selectedSize}</span>` : ''}
                ${item.selectedColor ? `<span class="bg-[#EFEAE0] px-1.5 py-0.5 rounded text-[10px] font-medium text-black">Color: ${item.selectedColor}</span>` : ''}
              </div>

              <!-- Customization tag if present -->
              ${item.customName || item.customNumber ? `
                <div class="mt-1.5 bg-[#FAF7F2] border border-[#E5E0D5] rounded p-1.5 text-[10px] text-[#555] space-y-0.5">
                  ${item.customName ? `<div>Custom Name: <strong class="text-black uppercase">${item.customName}</strong></div>` : ''}
                  ${item.customNumber ? `<div>Jersey #: <strong class="text-black font-mono">#${item.customNumber}</strong></div>` : ''}
                </div>
              ` : ''}

              <!-- Pricing & Quantity Controls -->
              <div class="mt-3 flex items-center justify-between">
                <span class="text-sm font-bold text-black font-mono">₹${item.price * item.quantity}</span>
                <div class="flex items-center border border-[#DDD4C4] rounded-lg bg-white">
                  <button class="cart-qty-btn px-2 py-0.5 text-xs text-[#666] hover:text-black font-bold" data-cart-id="${item.cartItemId}" data-delta="-1">-</button>
                  <span class="px-2 text-xs font-semibold text-black">${item.quantity}</span>
                  <button class="cart-qty-btn px-2 py-0.5 text-xs text-[#666] hover:text-black font-bold" data-cart-id="${item.cartItemId}" data-delta="1">+</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Drawer Footer -->
      ${cart.length > 0 ? `
        <div class="p-6 border-t border-[#E5E0D5] bg-white space-y-3">
          <div class="space-y-1.5 text-xs text-[#666]">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-mono text-black font-semibold">₹${subtotal}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Estimated Pan-India Shipping</span>
              <span class="font-mono ${shippingCharge === 0 ? 'text-emerald-700 font-bold' : 'text-black font-semibold'}">
                ${shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
              </span>
            </div>
            <div class="flex justify-between text-base font-bold text-black pt-2 border-t border-[#EFECE4]">
              <span>Final Total</span>
              <span class="font-mono text-lg text-black">₹${total}</span>
            </div>
          </div>

          <!-- Checkout Trigger Button -->
          <button id="cart-proceed-checkout-btn" class="w-full bg-[#111111] hover:bg-[#C5A880] text-white hover:text-black font-bold py-3.5 px-6 rounded-lg text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
            <span>Proceed to WhatsApp Checkout</span>
            ${renderIcon('arrowRight', 'w-4 h-4')}
          </button>

          <p class="text-[10px] text-center text-[#888]">
            🔒 Verified WhatsApp business notification • No upfront payment details required
          </p>
        </div>
      ` : ''}

    </aside>
  `;
}

export function initCartDrawerEvents() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const closeBtn = document.getElementById('cart-close-btn');

  const openDrawer = () => {
    if (drawer && backdrop) {
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      drawer.classList.remove('translate-x-full');
    }
  };

  const closeDrawer = () => {
    if (drawer && backdrop) {
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      drawer.classList.add('translate-x-full');
    }
  };

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Cart Qty & Remove buttons delegation
  if (drawer) {
    drawer.addEventListener('click', (e) => {
      const qtyBtn = e.target.closest('.cart-qty-btn');
      if (qtyBtn) {
        const id = qtyBtn.getAttribute('data-cart-id');
        const delta = parseInt(qtyBtn.getAttribute('data-delta'), 10);
        store.updateCartQuantity(id, delta);
        return;
      }

      const removeBtn = e.target.closest('.cart-remove-item-btn');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-cart-id');
        store.removeFromCart(id);
        return;
      }

      const checkoutBtn = e.target.closest('#cart-proceed-checkout-btn');
      if (checkoutBtn) {
        closeDrawer();
        const checkoutModal = document.getElementById('checkout-modal');
        if (checkoutModal) {
          checkoutModal.classList.remove('hidden');
        }
      }
    });
  }

  // Hook global nav cart button
  const navCartBtn = document.getElementById('nav-cart-btn');
  if (navCartBtn) {
    navCartBtn.addEventListener('click', openDrawer);
  }
}
