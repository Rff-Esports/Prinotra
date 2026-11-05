// PRINTORA Customer Account Dashboard & 10-Status Order Tracking System
// Sections 17 & 18: Profile, Saved Addresses, My Orders, 10-Status Timeline, Wishlist, Saved Designs

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { openAuthModal } from './AuthModal.js';

export const ORDER_STATUSES = [
  "Order Placed",
  "Payment Pending",
  "Payment Confirmed",
  "Artwork Verification",
  "In Production",
  "Quality Check",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

export function renderCustomerAccountModal() {
  const user = store.currentUser;
  const orders = store.orders;
  const wishlist = store.wishlist;
  const savedDesigns = store.savedDesigns;

  return `
    <div id="account-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div class="relative w-full max-w-4xl bg-[#FAFAF7] border border-[#DDD4C4] rounded-3xl shadow-2xl overflow-hidden my-8 animate-fade-in text-[#111]">
        
        <!-- Header -->
        <div class="bg-[#111111] text-white px-6 py-5 flex items-center justify-between border-b border-[#222]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white font-bold text-lg font-heading">
              ${user ? user.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <h3 class="font-heading text-lg font-bold text-white">${user ? user.name : 'Guest Account'}</h3>
              <p class="text-xs text-[#AAA]">${user ? (user.email || user.phone) : 'Sign in to sync your orders across devices'}</p>
            </div>
          </div>
          <button id="account-modal-close-btn" class="text-[#AAA] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors" aria-label="Close">
            ${renderIcon('close', 'w-5 h-5')}
          </button>
        </div>

        <!-- Dashboard Body with Sidebar Tabs -->
        <div class="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          
          <!-- Left Navigation Tabs (Cols 1-4) -->
          <div class="md:col-span-4 bg-[#F0EAE1] p-4 sm:p-5 border-b md:border-b-0 md:border-r border-[#DDD4C4] space-y-1 text-xs font-semibold">
            <button type="button" class="account-tab-btn w-full text-left px-3.5 py-2.5 rounded-xl bg-[#111] text-white transition-all flex items-center gap-2.5" data-tab="orders">
              ${renderIcon('shoppingBag', 'w-4 h-4 text-[#FF6B35]')}
              <span>My Orders & Tracking</span>
              <span class="ml-auto bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">${orders.length}</span>
            </button>
            
            <button type="button" class="account-tab-btn w-full text-left px-3.5 py-2.5 rounded-xl text-[#555] hover:bg-white hover:text-black transition-all flex items-center gap-2.5" data-tab="wishlist">
              ${renderIcon('heart', 'w-4 h-4 text-[#FF6B35]')}
              <span>My Wishlist</span>
              <span class="ml-auto bg-[#DDD4C4] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">${wishlist.length}</span>
            </button>

            <button type="button" class="account-tab-btn w-full text-left px-3.5 py-2.5 rounded-xl text-[#555] hover:bg-white hover:text-black transition-all flex items-center gap-2.5" data-tab="designs">
              ${renderIcon('star', 'w-4 h-4 text-[#FF6B35]')}
              <span>Saved Designs</span>
              <span class="ml-auto bg-[#DDD4C4] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">${savedDesigns.length}</span>
            </button>

            <button type="button" class="account-tab-btn w-full text-left px-3.5 py-2.5 rounded-xl text-[#555] hover:bg-white hover:text-black transition-all flex items-center gap-2.5" data-tab="addresses">
              ${renderIcon('truck', 'w-4 h-4 text-[#FF6B35]')}
              <span>Saved Addresses</span>
            </button>

            <button type="button" class="account-tab-btn w-full text-left px-3.5 py-2.5 rounded-xl text-[#555] hover:bg-white hover:text-black transition-all flex items-center gap-2.5" data-tab="support">
              ${renderIcon('messageSquare', 'w-4 h-4 text-[#FF6B35]')}
              <span>Support & WhatsApp</span>
            </button>

            <div class="pt-6">
              ${user ? `
                <button type="button" id="account-logout-btn" class="w-full text-left px-3.5 py-2.5 rounded-xl text-rose-700 hover:bg-rose-100 transition-all flex items-center gap-2 font-bold">
                  <span>Sign Out</span>
                </button>
              ` : `
                <button type="button" id="account-login-prompt-btn" class="w-full bg-[#111] hover:bg-[#FF6B35] text-white py-2.5 px-3 rounded-xl text-center font-bold text-xs transition-all">
                  Sign In with OTP
                </button>
              `}
            </div>
          </div>

          <!-- Right Content Panes (Cols 5-12) -->
          <div class="md:col-span-8 p-6 md:p-8 bg-white max-h-[580px] overflow-y-auto">
            
            <!-- Pane 1: Orders & 10-Status Tracking -->
            <div id="pane-orders" class="account-pane space-y-6">
              <div class="flex items-center justify-between pb-3 border-b border-[#EFECE4]">
                <div>
                  <h4 class="font-heading text-lg font-bold text-black">Your Order History</h4>
                  <p class="text-xs text-[#777]">Live 10-stage production and delivery tracker</p>
                </div>
              </div>

              ${orders.length === 0 ? `
                <div class="text-center py-12 bg-[#FAF8F5] rounded-2xl border border-[#DDD4C4] p-6">
                  <p class="text-sm font-bold text-[#444]">No orders placed yet.</p>
                  <p class="text-xs text-[#777] mt-1">Explore our product catalogue to create your first customized merchandise.</p>
                </div>
              ` : orders.map(ord => renderOrderTrackingCard(ord)).join('')}
            </div>

            <!-- Pane 2: Wishlist -->
            <div id="pane-wishlist" class="account-pane hidden space-y-4">
              <h4 class="font-heading text-lg font-bold text-black pb-2 border-b border-[#EFECE4]">My Wishlist (${wishlist.length})</h4>
              ${wishlist.length === 0 ? `
                <p class="text-xs text-[#777] py-8 text-center">Your wishlist is currently empty.</p>
              ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  ${wishlist.map(w => `
                    <div class="flex items-center gap-3 p-3 bg-[#FAF8F5] border border-[#DDD4C4] rounded-2xl">
                      <img src="${w.image}" alt="${w.name}" class="w-14 h-14 object-cover rounded-xl border border-[#DDD]">
                      <div class="flex-1 min-w-0">
                        <h5 class="text-xs font-bold text-black truncate">${w.name}</h5>
                        <p class="text-xs font-mono font-bold text-[#FF6B35]">₹${w.price}</p>
                        <button type="button" class="text-[10px] text-rose-600 hover:underline account-remove-wishlist" data-id="${w.id}">Remove</button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- Pane 3: Saved Designs -->
            <div id="pane-designs" class="account-pane hidden space-y-4">
              <h4 class="font-heading text-lg font-bold text-black pb-2 border-b border-[#EFECE4]">Saved Designs (${savedDesigns.length})</h4>
              ${savedDesigns.length === 0 ? `
                <p class="text-xs text-[#777] py-8 text-center">No saved designs found.</p>
              ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  ${savedDesigns.map(d => `
                    <div class="p-3 bg-[#FAF8F5] border border-[#DDD4C4] rounded-2xl flex flex-col justify-between">
                      <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">${d.productName}</span>
                        <h5 class="text-xs font-bold text-black mt-0.5">${d.title}</h5>
                        <p class="text-[11px] text-[#777] mt-1">Saved on ${d.date}</p>
                      </div>
                      <div class="flex items-center gap-2 mt-3 pt-2 border-t border-[#EFECE4]">
                        <button type="button" class="text-xs font-bold text-black hover:text-[#FF6B35] underline account-load-design-btn" data-id="${d.id}">Load in Studio</button>
                        <button type="button" class="text-xs text-rose-600 hover:underline ml-auto account-delete-design-btn" data-id="${d.id}">Delete</button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- Pane 4: Saved Addresses -->
            <div id="pane-addresses" class="account-pane hidden space-y-4">
              <h4 class="font-heading text-lg font-bold text-black pb-2 border-b border-[#EFECE4]">Delivery Addresses</h4>
              <div class="p-4 bg-[#FAF8F5] border border-[#DDD4C4] rounded-2xl space-y-1 text-xs">
                <span class="font-bold text-black block text-sm">Primary Address (India)</span>
                <p class="text-[#555]">House 42, Green Avenue, Subhash Nagar</p>
                <p class="text-[#555]">Nizamabad, Telangana – 503001</p>
                <span class="inline-block mt-2 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Default Pan-India Delivery (Free Shipping)
                </span>
              </div>
            </div>

            <!-- Pane 5: Support -->
            <div id="pane-support" class="account-pane hidden space-y-4">
              <h4 class="font-heading text-lg font-bold text-black pb-2 border-b border-[#EFECE4]">Printora Customer Care</h4>
              <div class="space-y-3 text-xs text-[#555]">
                <p>Have an inquiry regarding customization artwork, bulk team jerseys, or delivery?</p>
                <div class="p-4 bg-[#FAF8F5] border border-[#DDD4C4] rounded-2xl space-y-2">
                  <div class="flex items-center gap-2">
                    ${renderIcon('whatsapp', 'w-4 h-4 text-emerald-600')}
                    <span class="font-bold text-black">WhatsApp Priority Desk:</span>
                    <a href="https://wa.me/918106992102" target="_blank" class="text-emerald-700 font-mono font-bold underline">+91 8106992102</a>
                  </div>
                  <div class="flex items-center gap-2">
                    ${renderIcon('mail', 'w-4 h-4 text-[#FF6B35]')}
                    <span class="font-bold text-black">Support Email:</span>
                    <a href="mailto:support@printoracustom.in" class="underline">support@printoracustom.in</a>
                  </div>
                  <div class="flex items-center gap-2">
                    ${renderIcon('instagram', 'w-4 h-4 text-[#FF6B35]')}
                    <span class="font-bold text-black">Official Instagram:</span>
                    <a href="https://instagram.com/printora.gifts" target="_blank" class="underline">@printora.gifts</a>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  `;
}

// 10-Status Stepper Timeline Renderer
function renderOrderTrackingCard(order) {
  const currentIdx = ORDER_STATUSES.indexOf(order.status) !== -1 ? ORDER_STATUSES.indexOf(order.status) : 0;
  const isCancelled = order.status === 'Cancelled';

  return `
    <div class="p-4 sm:p-5 bg-[#FAF8F5] border border-[#DDD4C4] rounded-2xl space-y-4 shadow-sm">
      <!-- Top info bar -->
      <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EFECE4]">
        <div>
          <span class="text-[10px] uppercase font-bold text-[#777]">Order Reference</span>
          <h5 class="font-mono text-sm font-bold text-black">${order.orderCode}</h5>
        </div>
        <div class="text-right">
          <span class="text-[10px] uppercase font-bold text-[#777]">Amount Paid</span>
          <p class="font-mono text-sm font-bold text-[#FF6B35]">₹${order.totalAmount} <span class="text-[10px] text-emerald-600 font-sans font-semibold">(Free Shipping)</span></p>
        </div>
      </div>

      <!-- Items List -->
      <div class="space-y-1.5 text-xs text-[#555]">
        ${order.items.map(it => `
          <div class="flex justify-between items-center">
            <span><strong>${it.name}</strong> (${it.selectedSize || 'Std'}${it.selectedColor ? ` / ${it.selectedColor}` : ''}) x${it.quantity}</span>
            <span class="font-mono font-semibold">₹${it.price * it.quantity}</span>
          </div>
        `).join('')}
      </div>

      <!-- Visual 10-Stage Progress Stepper -->
      <div class="pt-3 border-t border-[#EFECE4]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-black">Live Order Status</span>
          <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${isCancelled ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}">
            ${order.status}
          </span>
        </div>

        ${isCancelled ? `
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            This order has been cancelled. If refund was initiated, it will reflect within 3-5 business days.
          </div>
        ` : `
          <!-- Horizontal Timeline Bar -->
          <div class="relative mt-4 mb-2">
            <!-- Background Line -->
            <div class="absolute top-3 left-2 right-2 h-1 bg-[#DDD4C4] -z-0"></div>
            <!-- Progress Filled Line -->
            <div class="absolute top-3 left-2 h-1 bg-[#FF6B35] transition-all duration-500 -z-0" style="width: ${(currentIdx / (ORDER_STATUSES.length - 2)) * 100}%"></div>

            <!-- Steps Nodes (Showing key 5 milestones visually for mobile responsiveness) -->
            <div class="flex justify-between items-start relative z-10 text-[10px]">
              ${[
                { label: "Placed", idx: 0 },
                { label: "Confirmed", idx: 2 },
                { label: "Production", idx: 4 },
                { label: "Shipped", idx: 6 },
                { label: "Delivered", idx: 8 }
              ].map(step => `
                <div class="flex flex-col items-center">
                  <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${currentIdx >= step.idx ? 'bg-[#FF6B35] text-white shadow-md' : 'bg-white border-2 border-[#CCC] text-[#888]'}">
                    ${currentIdx >= step.idx ? '✓' : ''}
                  </span>
                  <span class="mt-1 font-semibold ${currentIdx >= step.idx ? 'text-black font-bold' : 'text-[#888]'}">${step.label}</span>
                </div>
              `).join('')}
            </div>
          </div>

          ${order.supplierAssignment?.trackingNumber ? `
            <div class="mt-3 p-2.5 bg-white border border-[#DDD] rounded-xl flex items-center justify-between text-xs">
              <span>Courier: <strong>${order.supplierAssignment.courier || 'Express Post'}</strong></span>
              <span>AWB: <strong class="font-mono">${order.supplierAssignment.trackingNumber}</strong></span>
            </div>
          ` : ''}
        `}

        <!-- Customer Rating & Photo Attachment when Delivered -->
        ${order.status === 'Delivered' ? `
          <div class="mt-4 pt-3 border-t border-[#EFECE4]">
            ${order.review ? `
              <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-emerald-900">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-emerald-800 flex items-center gap-1">
                    <span>✓ Delivery Review Submitted</span>
                    <span class="text-amber-500">${'★'.repeat(order.review.rating || 5)}</span>
                  </span>
                  <span class="text-[10px] text-emerald-600">${order.review.date}</span>
                </div>
                <p class="italic text-[11px] text-[#444]">"${order.review.comment}"</p>
                ${order.review.photoUrl ? `
                  <div class="mt-2 flex items-center gap-2">
                    <img src="${order.review.photoUrl}" alt="Customer delivery photo" class="w-14 h-14 rounded-lg object-cover border border-emerald-300 shadow-sm">
                    <span class="text-[10px] font-bold text-emerald-700">Verified Customer Photo</span>
                  </div>
                ` : ''}
              </div>
            ` : `
              <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2.5 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-heading font-bold text-amber-950 flex items-center gap-1.5">
                    <span>⭐ Rate Your Delivery & Attach Photo</span>
                  </span>
                  <span class="text-[10px] bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full font-bold">Delivered</span>
                </div>
                
                <form class="order-review-form space-y-2.5" data-order-code="${order.orderCode}">
                  <div>
                    <label class="block text-[11px] font-bold text-[#555] mb-1">Your Rating *</label>
                    <div class="flex items-center gap-1.5 text-lg cursor-pointer star-rating-picker" data-order-code="${order.orderCode}">
                      <span class="star-btn text-amber-400 hover:scale-125 transition-transform" data-val="1">★</span>
                      <span class="star-btn text-amber-400 hover:scale-125 transition-transform" data-val="2">★</span>
                      <span class="star-btn text-amber-400 hover:scale-125 transition-transform" data-val="3">★</span>
                      <span class="star-btn text-amber-400 hover:scale-125 transition-transform" data-val="4">★</span>
                      <span class="star-btn text-amber-400 hover:scale-125 transition-transform" data-val="5">★</span>
                      <input type="hidden" class="review-star-input" value="5">
                    </div>
                  </div>

                  <div>
                    <label class="block text-[11px] font-bold text-[#555] mb-1">Review & Feedback</label>
                    <textarea class="review-comment-input w-full bg-white border border-[#DDD4C4] rounded-xl p-2 text-xs outline-none focus:border-[#FF6B35] resize-none" rows="2" placeholder="How was the print clarity, fabric, and delivery experience?"></textarea>
                  </div>

                  <div>
                    <label class="block text-[11px] font-bold text-[#555] mb-1">Attach Photo of Delivered Item 📷</label>
                    <input type="file" accept="image/*" class="review-photo-input w-full text-xs text-[#555] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#111] file:text-white hover:file:bg-[#FF6B35] file:cursor-pointer cursor-pointer border border-[#DDD4C4] rounded-xl p-1 bg-white">
                  </div>

                  <button type="submit" class="bg-[#111] hover:bg-[#FF6B35] text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm">
                    Submit Rating & Photo
                  </button>
                </form>
              </div>
            `}
          </div>
        ` : ''}
      </div>
    </div>
  `;

}

export function openCustomerAccountModal() {
  const modal = document.getElementById('account-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

export function closeCustomerAccountModal() {
  const modal = document.getElementById('account-modal');
  if (modal) modal.classList.add('hidden');
}

export function initCustomerAccountEvents() {
  const closeBtn = document.getElementById('account-modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCustomerAccountModal);

  // Tabs switching
  document.querySelectorAll('.account-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');
      document.querySelectorAll('.account-tab-btn').forEach(b => {
        b.classList.remove('bg-[#111]', 'text-white');
        b.classList.add('text-[#555]');
      });
      e.currentTarget.classList.add('bg-[#111]', 'text-white');
      e.currentTarget.classList.remove('text-[#555]');

      document.querySelectorAll('.account-pane').forEach(p => p.classList.add('hidden'));
      const activePane = document.getElementById(`pane-${tab}`);
      if (activePane) activePane.classList.remove('hidden');
    });
  });

  // Logout button
  const logoutBtn = document.getElementById('account-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.setUser(null);
      store.showToast('You have been signed out', 'info');
      closeCustomerAccountModal();
    });
  }

  // Star rating picker delegation
  document.addEventListener('click', (e) => {
    const starBtn = e.target.closest('.star-btn');
    if (!starBtn) return;
    const picker = starBtn.closest('.star-rating-picker');
    if (!picker) return;
    const val = Number(starBtn.getAttribute('data-val') || 5);
    const hiddenIn = picker.querySelector('.review-star-input');
    if (hiddenIn) hiddenIn.value = val;
    picker.querySelectorAll('.star-btn').forEach(s => {
      const sVal = Number(s.getAttribute('data-val'));
      s.className = `star-btn transition-transform ${sVal <= val ? 'text-amber-400 font-bold' : 'text-[#DDD4C4]'}`;
    });
  });

  // Delegated Review Form Submission
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('.order-review-form');
    if (!form) return;
    e.preventDefault();

    const orderCode = form.getAttribute('data-order-code');
    const rating = form.querySelector('.review-star-input')?.value || 5;
    const comment = form.querySelector('.review-comment-input')?.value || 'Loved the print quality!';
    const fileInput = form.querySelector('.review-photo-input');
    const file = fileInput?.files?.[0];

    const submitReview = (photoUrl = '') => {
      store.addReview({
        orderCode,
        rating: Number(rating),
        comment,
        photoUrl,
        customerName: store.currentUser?.name || 'Customer'
      });
      // Re-render account modal view
      const modal = document.getElementById('account-modal');
      if (modal) {
        const temp = document.createElement('div');
        temp.innerHTML = renderCustomerAccountModal();
        const newModal = temp.querySelector('#account-modal');
        if (newModal) modal.innerHTML = newModal.innerHTML;
        initCustomerAccountEvents();
      }
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEv) => submitReview(loadEv.target.result);
      reader.readAsDataURL(file);
    } else {
      submitReview('');
    }
  });
}

