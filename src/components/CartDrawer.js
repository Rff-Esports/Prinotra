// PRINTORA Slide-Over Bag / Cart Drawer Component
// Section 7: Strict FREE DELIVERY ALWAYS (₹0 Shipping Fee across India)

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { openCheckoutModal } from './CheckoutModal.js';

export function renderCartDrawer() {
  const cart = store.cart;
  const subtotal = store.getCartSubtotal();
  const total = store.getCartTotal();

  return `
    <div id="cart-drawer-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300"></div>
    <aside id="cart-drawer" class="fixed top-0 right-0 z-50 w-full max-w-md h-full bg-[#FAFAF7] text-[#111111] shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300 ease-out border-l border-[#E5E0D5]">
      
      <!-- Drawer Header -->
      <div class="p-6 border-b border-[#E5E0D5] flex items-center justify-between bg-white">
        <div class="flex items-center gap-2">
          ${renderIcon('shoppingBag', 'w-5 h-5 text-[#111]')}
          <h3 class="font-heading text-2xl font-bold tracking-tight text-black">Shopping Bag</h3>
          <span class="text-xs bg-[#FF6B35] text-white px-2 py-0.5 rounded-full font-bold ml-1 font-mono">
            ${store.getCartCount()}
          </span>
        </div>
        <button id="cart-close-btn" class="p-1.5 text-[#777] hover:text-black rounded-lg hover:bg-[#F0EAE1] transition-colors" aria-label="Close Bag">
          ${renderIcon('close', 'w-5 h-5')}
        </button>
      </div>

      <!-- Free Delivery Banner (Strict Business Requirement) -->
      <div class="bg-emerald-50 px-6 py-3 border-b border-emerald-200">
        <div class="flex items-center justify-between text-xs text-emerald-800 font-bold">
          <span class="flex items-center gap-1.5 font-heading">
            ${renderIcon('check', 'w-4 h-4 text-emerald-600')} FREE SHIPPING ON ALL ORDERS ACROSS INDIA
          </span>
          <span class="font-mono text-emerald-700 font-extrabold">₹0</span>
        </div>
      </div>

      <!-- Cart Items Scroll Area -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-[#EFECE4]">
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
        ` : cart.map(item => `
          <div class="pt-4 first:pt-0 flex gap-4 items-start">
            <!-- Product Thumbnail -->
            <div class="w-20 h-24 bg-[#EFEAE0] rounded-xl overflow-hidden flex-shrink-0 border border-[#E5E0D5] relative">
              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <h4 class="text-sm font-bold text-[#111] truncate font-heading">${item.name}</h4>
                <button class="cart-remove-item-btn text-[#999] hover:text-rose-600 p-0.5 transition-colors" data-cart-id="${item.cartItemId}" title="Remove item">
                  ${renderIcon('trash', 'w-4 h-4')}
                </button>
              </div>

              <!-- Options pills -->
              <div class="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-[#666]">
                ${item.selectedSize ? `<span class="bg-[#EFEAE0] px-1.5 py-0.5 rounded-md text-[10px] font-bold text-black font-mono">Size: ${item.selectedSize}</span>` : ''}
                ${item.selectedColor ? `<span class="bg-[#EFEAE0] px-1.5 py-0.5 rounded-md text-[10px] font-bold text-black">Color: ${item.selectedColor}</span>` : ''}
              </div>

              <!-- Customization tag if present -->
              ${item.customName || item.customNumber ? `
                <div class="mt-1.5 bg-[#FAF7F2] border border-[#E5E0D5] rounded-lg p-1.5 text-[10px] text-[#555] space-y-0.5">
                  ${item.customName ? `<div>Custom Name: <strong class="text-black uppercase">${item.customName}</strong></div>` : ''}
                  ${item.customNumber ? `<div>Jersey #: <strong class="text-black font-mono">#${item.customNumber}</strong></div>` : ''}
                </div>
              ` : ''}

              <!-- Pricing & Quantity Controls -->
              <div class="mt-3 flex items-center justify-between">
                <span class="text-sm font-bold text-black font-mono">₹${item.price * item.quantity}</span>
                <div class="flex items-center border border-[#DDD4C4] rounded-xl bg-white">
                  <button class="cart-qty-btn px-2.5 py-0.5 text-xs text-[#666] hover:text-black font-bold" data-cart-id="${item.cartItemId}" data-delta="-1">-</button>
                  <span class="px-2 text-xs font-bold text-black font-mono">${item.quantity}</span>
                  <button class="cart-qty-btn px-2.5 py-0.5 text-xs text-[#666] hover:text-black font-bold" data-cart-id="${item.cartItemId}" data-delta="1">+</button>
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
              <span>Items Subtotal:</span>
              <span class="font-mono text-black font-bold">₹${subtotal}</span>
            </div>
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
          <button id="cart-proceed-checkout-btn" class="w-full bg-[#111111] hover:bg-[#FF6B35] text-white font-extrabold py-4 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-xl font-heading cursor-pointer">
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
  const closeBtn = document.getElementById('cart-close-btn');

  const openDrawer = () => {
    if (drawer && backdrop) {
      backdrop.classList.remove('hidden');
      requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        drawer.classList.remove('translate-x-full');
      });
    }
  };

  const closeDrawer = () => {
    if (drawer && backdrop) {
      backdrop.classList.add('opacity-0');
      drawer.classList.add('translate-x-full');
      setTimeout(() => backdrop.classList.add('hidden'), 300);
    }
  };

  window.openCartDrawer = openDrawer;
  window.closeCartDrawer = closeDrawer;

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

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
        openCheckoutModal();
      }
    });
  }

  const navCartBtn = document.getElementById('nav-cart-btn');
  if (navCartBtn) {
    navCartBtn.addEventListener('click', openDrawer);
  }
}
