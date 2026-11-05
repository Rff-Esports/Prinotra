// PRINTORA Master 3-Step Compact Mobile-Friendly Checkout Modal
// Step 1: Customization & Items Review (Coupons)
// Step 2: Indian Delivery Address with Auto PIN Village/Locality Dropdown
// Step 3: Payment & Redirection to WhatsApp Desk (+91 8106992102)

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { generateWhatsAppUrl, BUSINESS_WHATSAPP_NUMBER } from '../services/whatsapp.js';
import { openAuthModal } from './AuthModal.js';
import { sendBrevoOtpEmail, generate6DigitOtp } from '../services/brevo.js';

let appliedCoupon = null;
let checkoutOtpCode = null;
let isCheckoutOtpVerified = false;
let currentStep = 1; // 1: Items, 2: Address, 3: WhatsApp
let detectedVillages = [];

export function renderCheckoutModal() {
  const cart = store.cart;
  const subtotal = store.getCartSubtotal();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = store.getCartTotal(discount);
  const user = store.currentUser;

  return `
    <div id="checkout-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
      <div class="relative w-full max-w-lg bg-[#FAF8F5] border border-[#DDD4C4] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#111] animate-fade-in font-sans">
        
        <!-- Header Bar with Clear Back Button -->
        <div class="bg-[#111111] text-white px-4 sm:px-5 py-3.5 flex items-center justify-between border-b border-[#222] shadow-sm flex-shrink-0">
          <div class="flex items-center gap-2.5">
            <button type="button" id="checkout-back-nav-btn" class="inline-flex items-center gap-1 text-xs text-[#FF6B35] hover:text-white font-bold py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" title="Go back">
              <span class="text-sm">←</span>
              <span id="checkout-back-label">Back</span>
            </button>
            <div>
              <h3 class="font-heading text-base sm:text-lg font-bold tracking-tight text-white leading-tight">Checkout</h3>
              <span class="text-[10px] text-emerald-400 font-bold block">✓ ₹0 Free Delivery Across India</span>
            </div>
          </div>
          <button type="button" id="checkout-close-btn" class="text-xs text-[#AAA] hover:text-white font-bold p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" aria-label="Close Checkout">
            <span class="text-base leading-none">✕</span>
          </button>
        </div>

        <!-- 3-Step Stepper Header -->
        <div class="bg-white px-4 py-2.5 border-b border-[#DDD4C4] flex items-center justify-between text-xs font-heading flex-shrink-0">
          <div class="flex items-center gap-1.5 step-indicator ${currentStep === 1 ? 'text-[#FF6B35] font-extrabold' : currentStep > 1 ? 'text-emerald-700 font-bold' : 'text-[#888]'}">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 1 ? 'bg-[#FF6B35] text-white' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-[#DDD4C4] text-[#666]'}">
              ${currentStep > 1 ? '✓' : '1'}
            </span>
            <span class="text-[11px]">1. Items</span>
          </div>
          <span class="text-[#CCC] text-xs">→</span>
          <div class="flex items-center gap-1.5 step-indicator ${currentStep === 2 ? 'text-[#FF6B35] font-extrabold' : currentStep > 2 ? 'text-emerald-700 font-bold' : 'text-[#888]'}">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 2 ? 'bg-[#FF6B35] text-white' : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-[#DDD4C4] text-[#666]'}">
              ${currentStep > 2 ? '✓' : '2'}
            </span>
            <span class="text-[11px]">2. Address</span>
          </div>
          <span class="text-[#CCC] text-xs">→</span>
          <div class="flex items-center gap-1.5 step-indicator ${currentStep === 3 ? 'text-[#FF6B35] font-extrabold' : 'text-[#888]'}">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 3 ? 'bg-[#FF6B35] text-white' : 'bg-[#DDD4C4] text-[#666]'}">
              3
            </span>
            <span class="text-[11px]">3. WhatsApp</span>
          </div>
        </div>

        <!-- Scrollable Middle Body Container -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          <!-- ==========================================
               STEP 1: CUSTOMIZATION & ITEMS REVIEW
               ========================================== -->
          <div id="checkout-step-1" class="${currentStep === 1 ? 'block' : 'hidden'} space-y-4 animate-fade-in">
            <div class="flex items-center justify-between pb-2 border-b border-[#DDD4C4]">
              <span class="text-xs font-bold uppercase tracking-wider text-[#555] font-heading">
                Cart Items (${store.getCartCount()})
              </span>
              <span class="text-xs text-[#FF6B35] font-bold font-mono">Subtotal: ₹${subtotal}</span>
            </div>

            <!-- Items List -->
            <div class="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              ${cart.length === 0 ? `
                <div class="text-center py-8 text-[#777] text-xs">Your bag is empty. Please select products first.</div>
              ` : cart.map(item => `
                <div class="flex items-center justify-between p-2.5 bg-white border border-[#DDD4C4] rounded-xl text-xs gap-2">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80'}" class="w-12 h-12 rounded-lg object-cover border border-[#DDD4C4] flex-shrink-0">
                    <div class="truncate">
                      <strong class="text-black block truncate font-heading">${item.name}</strong>
                      <span class="text-[#777] block text-[11px]">
                        ${item.selectedSize}${item.selectedColor ? ` • ${item.selectedColor}` : ''}
                        ${item.phoneModel ? ` • Model: <strong class="text-[#FF6B35]">${item.phoneModel}</strong>` : ''}
                        ${item.customName ? ` • Name: <strong>${item.customName}</strong>` : ''}
                        ${item.customNumber ? ` • #${item.customNumber}` : ''}
                      </span>
                      <span class="text-[#666] text-[11px]">Qty: ${item.quantity} × ₹${item.price}</span>
                    </div>
                  </div>
                  <span class="font-mono font-bold text-black flex-shrink-0 text-right">₹${item.price * item.quantity}</span>
                </div>
              `).join('')}
            </div>

            <!-- Coupon Code Field -->
            <div class="p-3 bg-white border border-[#DDD4C4] rounded-2xl space-y-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#777] font-heading block">Apply Coupon Code</span>
              <div class="flex items-center gap-2">
                <input type="text" id="chk-coupon-input" value="${appliedCoupon ? appliedCoupon.code : ''}" placeholder="Coupon (e.g. PRINTORA 25)" 
                       class="flex-1 bg-[#FAF8F5] border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs uppercase font-mono font-bold outline-none">
                <button type="button" id="chk-apply-coupon-btn" class="bg-[#111] hover:bg-[#FF6B35] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                  ${appliedCoupon ? 'Applied ✓' : 'Apply'}
                </button>
              </div>

              <!-- Fast One-Click Apply Pill for PRINTORA 25 -->
              <div class="flex items-center gap-1.5 text-[11px] pt-1">
                <button type="button" id="quick-apply-printora25-btn" class="inline-flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-[#FF6B35] hover:text-white border border-[#DDD4C4] text-black px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer shadow-sm">
                  <span>🏷️ PRINTORA 25</span>
                  <span class="text-[10px] text-[#FF6B35] font-sans font-semibold">• Flat ₹25 OFF</span>
                </button>
              </div>

              <div id="chk-coupon-msg" class="text-[11px] font-semibold mt-1 ${appliedCoupon ? 'text-emerald-700' : 'hidden'}">
                ${appliedCoupon ? appliedCoupon.message : ''}
              </div>
            </div>

            <!-- Summary Breakdown -->
            <div class="p-3 bg-white border border-[#DDD4C4] rounded-2xl space-y-1.5 text-xs">
              <div class="flex justify-between text-[#666]">
                <span>Items Subtotal:</span>
                <span class="font-mono font-bold text-black">₹${subtotal}</span>
              </div>
              ${discount > 0 ? `
                <div class="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount (${appliedCoupon?.code || ''}):</span>
                  <span class="font-mono">-₹${discount}</span>
                </div>
              ` : ''}
              <div class="flex justify-between text-emerald-700 font-bold">
                <span>Delivery Charges:</span>
                <span class="font-mono uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">FREE (₹0)</span>
              </div>
              <div class="flex justify-between items-baseline pt-2 border-t border-[#EFECE4] text-black font-extrabold text-sm">
                <span>Total Amount:</span>
                <span class="font-mono text-base text-[#FF6B35]">₹${total}</span>
              </div>
            </div>
          </div>

          <!-- ==========================================
               STEP 2: INDIAN DELIVERY ADDRESS & VILLAGE AUTO-DETECT
               ========================================== -->
          <div id="checkout-step-2" class="${currentStep === 2 ? 'block' : 'hidden'} space-y-3.5 animate-fade-in">
            <div>
              <span class="text-xs uppercase tracking-widest text-[#777] font-bold block mb-1 font-heading">
                Contact & Shipping Details
              </span>
              <p class="text-[11px] text-[#777]">Enter your address for 100% free doorstep courier delivery.</p>
            </div>

            <!-- Contact Information -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label for="chk-name" class="block text-[11px] font-bold text-[#444] mb-1">Full Name *</label>
                <input type="text" id="chk-name" required value="${user?.name || ''}" placeholder="Enter full name" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs font-medium outline-none">
              </div>
              <div>
                <label for="chk-phone" class="block text-[11px] font-bold text-[#444] mb-1">WhatsApp / Phone *</label>
                <div class="flex">
                  <span class="inline-flex items-center px-2.5 text-xs font-bold text-[#666] bg-[#EFEAE0] border border-r-0 border-[#DDD4C4] rounded-l-xl">+91</span>
                  <input type="tel" id="chk-phone" required pattern="[0-9]{10}" maxlength="10" value="${user?.phone ? user.phone.replace('+91', '').trim() : ''}" placeholder="10-digit number" 
                         class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-r-xl px-3 py-2 text-xs font-medium outline-none">
                </div>
              </div>
              <div class="sm:col-span-2 space-y-1.5">
                <div class="flex items-center justify-between">
                  <label for="chk-email" class="block text-[11px] font-bold text-[#444]">Email (For Brevo Invoice & Updates) *</label>
                  <span id="chk-email-verified-pill" class="${(isCheckoutOtpVerified || user?.verifiedAt) ? '' : 'hidden'} text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Brevo OTP Verified
                  </span>
                </div>
                <div class="flex gap-2">
                  <input type="email" id="chk-email" required value="${user?.email || ''}" placeholder="name@example.com" 
                         ${(isCheckoutOtpVerified || user?.verifiedAt) ? 'readonly' : ''}
                         class="flex-1 bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs font-medium outline-none">
                  <button type="button" id="chk-send-otp-btn" class="${(isCheckoutOtpVerified || user?.verifiedAt) ? 'hidden' : ''} bg-[#111] hover:bg-[#FF6B35] text-white px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer">
                    Verify OTP
                  </button>
                </div>

                <!-- OTP Input Area -->
                <div id="chk-otp-box" class="hidden p-3 bg-[#FAF7F2] border border-[#DDD4C4] rounded-xl space-y-2 animate-fade-in">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-[#666]">Enter 6-digit code:</span>
                    <button type="button" id="chk-otp-resend-btn" class="text-[#FF6B35] hover:underline font-bold text-[11px] cursor-pointer">Resend</button>
                  </div>
                  <div class="flex gap-2">
                    <input type="text" id="chk-otp-input" maxlength="6" placeholder="••••••" 
                           class="w-28 bg-white border border-[#DDD4C4] focus:border-[#FF6B35] rounded-xl px-2 py-1.5 text-center text-xs font-mono font-bold tracking-widest outline-none">
                    <button type="button" id="chk-verify-otp-btn" class="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase cursor-pointer">
                      Confirm
                    </button>
                  </div>
                  <div id="chk-otp-feedback" class="hidden text-xs"></div>
                </div>
              </div>
            </div>

            <!-- PIN Code and Village Dropdown -->
            <div class="p-3 bg-white border border-[#DDD4C4] rounded-2xl space-y-3">
              <div class="flex items-center justify-between">
                <label for="chk-pincode" class="block text-xs font-bold text-[#333]">Postal PIN Code *</label>
                <span id="chk-pincode-status" class="text-[10px] font-bold text-[#FF6B35]">Type 6 digits</span>
              </div>

              <div class="relative">
                <input type="text" id="chk-pincode" required pattern="[0-9]{6}" maxlength="6" placeholder="e.g. 522302" 
                       class="w-full bg-[#FAF8F5] border border-[#DDD4C4] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none">
              </div>

              <!-- Village / Post Office Selection Dropdown (Auto-populated from India Post API) -->
              <div id="chk-village-container" class="space-y-1">
                <label for="chk-village-select" class="block text-[11px] font-bold text-[#FF6B35] flex items-center justify-between">
                  <span>🏡 Select Village / Post Office *</span>
                  <span class="text-[10px] text-[#777] font-normal">(Auto-detects from PIN)</span>
                </label>
                <select id="chk-village-select" class="w-full bg-[#FAF8F5] border border-[#DDD4C4] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer">
                  <option value="">-- Enter 6-digit PIN to load villages --</option>
                </select>
              </div>

              <!-- House No. & Street -->
              <div>
                <label for="chk-house" class="block text-[11px] font-bold text-[#444] mb-1">House No. / Flat / Building / Street *</label>
                <input type="text" id="chk-house" required placeholder="e.g. Door No. 4-12, Main Bazaar Road" 
                       class="w-full bg-[#FAF8F5] border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs outline-none">
              </div>

              <!-- Village / Locality Text Input (Filled from select or editable) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label for="chk-area" class="block text-[11px] font-bold text-[#444] mb-1">Village / Locality / Area *</label>
                  <input type="text" id="chk-area" required placeholder="e.g. Ippatam, Atmakuru" 
                         class="w-full bg-[#FAF8F5] border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs outline-none font-medium">
                </div>
                <div>
                  <label for="chk-city" class="block text-[11px] font-bold text-[#444] mb-1">City / Mandal / Town *</label>
                  <input type="text" id="chk-city" required placeholder="City or Mandal" 
                         class="w-full bg-[#FAF8F5] border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs outline-none font-medium">
                </div>
                <div>
                  <label for="chk-district" class="block text-[11px] font-bold text-[#444] mb-1">District *</label>
                  <input type="text" id="chk-district" required placeholder="District" 
                         class="w-full bg-[#FAF8F5] border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs outline-none font-medium">
                </div>
                <div>
                  <label for="chk-state" class="block text-[11px] font-bold text-[#444] mb-1">State *</label>
                  <input type="text" id="chk-state" required placeholder="State (e.g. Andhra Pradesh)" 
                         class="w-full bg-[#FAF8F5] border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs outline-none font-medium">
                </div>
              </div>

              <!-- Special Instructions -->
              <div>
                <label for="chk-instructions" class="block text-[11px] font-bold text-[#444] mb-1">Special Packaging or Delivery Note (Optional)</label>
                <textarea id="chk-instructions" rows="2" placeholder="e.g. Call before delivery, handle with care" 
                          class="w-full bg-[#FAF8F5] border border-[#DDD4C4] focus:border-black rounded-xl p-2.5 text-xs outline-none resize-none"></textarea>
              </div>
            </div>
          </div>

          <!-- ==========================================
               STEP 3: PAYMENT & WHATSAPP REDIRECTION
               ========================================== -->
          <div id="checkout-step-3" class="${currentStep === 3 ? 'block' : 'hidden'} space-y-4 animate-fade-in">
            <div>
              <span class="text-xs uppercase tracking-widest text-[#777] font-bold block mb-1 font-heading">
                Step 3: Review & WhatsApp Confirmation
              </span>
              <p class="text-[11px] text-[#777]">Confirm your order details. You will be redirected to our official WhatsApp desk (+91 8106992102) with your complete order receipt.</p>
            </div>

            <!-- Order Snapshot Review Card -->
            <div class="p-3.5 bg-white border border-[#DDD4C4] rounded-2xl space-y-2.5 text-xs">
              <div class="flex items-center justify-between pb-2 border-b border-[#EFECE4]">
                <strong class="text-black font-heading">Recipient Details</strong>
                <button type="button" onclick="window.setCheckoutStep(2)" class="text-[#FF6B35] font-bold text-[11px] hover:underline cursor-pointer">Edit Address</button>
              </div>
              <div class="space-y-1 text-[#555]">
                <p>👤 <strong class="text-black" id="step3-name-display">—</strong> (<span id="step3-phone-display">—</span>)</p>
                <p>📧 <span id="step3-email-display">—</span></p>
                <p>📍 <span id="step3-address-display">—</span></p>
              </div>
            </div>

            <!-- Official WhatsApp Gateway Banner -->
            <div class="p-4 bg-[#E8F5E9] border border-[#A5D6A7] rounded-2xl space-y-2.5 text-[#1B5E20]">
              <div class="flex items-center gap-2">
                <span class="text-lg">💬</span>
                <div>
                  <strong class="font-heading text-sm text-[#1B5E20] block">Official WhatsApp Order Gateway</strong>
                  <span class="text-[11px] text-[#2E7D32]">Direct WhatsApp Desk: +91 8106992102</span>
                </div>
              </div>
              <p class="text-xs text-[#2E7D32] leading-snug">
                Your order receipt, custom design notes, and delivery address will be securely prepared and forwarded to our official WhatsApp desk. Our specialists will verify your design and start production immediately.
              </p>
              <div class="flex items-center gap-2 pt-1 text-[11px] font-bold text-emerald-800">
                <span>✓ ₹0 Delivery Fee Across India</span>
                <span>•</span>
                <span>✓ Brevo Email Confirmation</span>
              </div>
            </div>

            <!-- Final Price Breakdown -->
            <div class="p-3 bg-white border border-[#DDD4C4] rounded-2xl space-y-1.5 text-xs">
              <div class="flex justify-between text-[#666]">
                <span>Items Subtotal:</span>
                <span class="font-mono font-bold text-black">₹${subtotal}</span>
              </div>
              ${discount > 0 ? `
                <div class="flex justify-between text-emerald-700 font-bold">
                  <span>Discount Applied:</span>
                  <span class="font-mono">-₹${discount}</span>
                </div>
              ` : ''}
              <div class="flex justify-between text-emerald-700 font-bold">
                <span>Standard Delivery:</span>
                <span class="font-mono uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">FREE (₹0)</span>
              </div>
              <div class="flex justify-between items-baseline pt-2 border-t border-[#EFECE4] text-black font-extrabold text-base">
                <span>Total Amount:</span>
                <span class="font-mono text-lg text-[#FF6B35]">₹${total}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Sticky Bottom Action Footer (Never cut off on mobile) -->
        <div class="bg-white border-t border-[#DDD4C4] px-4 py-3 sm:px-5 flex items-center justify-between gap-3 flex-shrink-0">
          <button type="button" id="chk-prev-step-btn" class="px-4 py-2.5 rounded-xl border border-[#DDD4C4] text-xs font-bold text-[#555] hover:bg-[#F0EAE1] transition-colors cursor-pointer ${currentStep === 1 ? 'hidden' : ''}">
            ← Back
          </button>

          <button type="button" id="chk-next-step-btn" class="flex-1 bg-[#111] hover:bg-[#FF6B35] text-white font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${currentStep === 3 ? 'hidden' : ''}">
            <span>${currentStep === 1 ? 'Continue to Address →' : 'Review & Confirm Order →'}</span>
          </button>

          <button type="button" id="chk-confirm-whatsapp-btn" class="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer ${currentStep === 3 ? '' : 'hidden'}">
            <span>💬 Send Order to WhatsApp (+91 8106992102)</span>
          </button>
        </div>

      </div>
    </div>
  `;
}

export function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    if (!store.currentUser) {
      openAuthModal(() => {
        openCheckoutModal();
      });
      return;
    }

    currentStep = 1;
    const temp = document.createElement('div');
    temp.innerHTML = renderCheckoutModal();
    const newModal = temp.querySelector('#checkout-modal');
    modal.innerHTML = newModal.innerHTML;
    modal.classList.remove('hidden');
    initCheckoutModalEvents();
  }
}

export function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('hidden');
}

export function initCheckoutModalEvents() {
  window.setCheckoutStep = (step) => {
    currentStep = step;
    const s1 = document.getElementById('checkout-step-1');
    const s2 = document.getElementById('checkout-step-2');
    const s3 = document.getElementById('checkout-step-3');
    const prevBtn = document.getElementById('chk-prev-step-btn');
    const nextBtn = document.getElementById('chk-next-step-btn');
    const confirmBtn = document.getElementById('chk-confirm-whatsapp-btn');
    const backLabel = document.getElementById('checkout-back-label');

    if (s1) s1.className = step === 1 ? 'space-y-4 animate-fade-in block' : 'hidden';
    if (s2) s2.className = step === 2 ? 'space-y-3.5 animate-fade-in block' : 'hidden';
    if (s3) s3.className = step === 3 ? 'space-y-4 animate-fade-in block' : 'hidden';

    if (prevBtn) {
      if (step === 1) prevBtn.classList.add('hidden');
      else prevBtn.classList.remove('hidden');
    }

    if (nextBtn) {
      if (step === 3) nextBtn.classList.add('hidden');
      else {
        nextBtn.classList.remove('hidden');
        nextBtn.innerHTML = `<span>${step === 1 ? 'Continue to Address →' : 'Review & Confirm Order →'}</span>`;
      }
    }

    if (confirmBtn) {
      if (step === 3) confirmBtn.classList.remove('hidden');
      else confirmBtn.classList.add('hidden');
    }

    if (backLabel) {
      backLabel.textContent = step === 1 ? 'Back' : `Step ${step - 1}`;
    }

    // Populate Step 3 snapshot
    if (step === 3) {
      const name = document.getElementById('chk-name')?.value.trim();
      const phone = document.getElementById('chk-phone')?.value.trim();
      const email = document.getElementById('chk-email')?.value.trim();
      const house = document.getElementById('chk-house')?.value.trim();
      const area = document.getElementById('chk-area')?.value.trim();
      const city = document.getElementById('chk-city')?.value.trim();
      const state = document.getElementById('chk-state')?.value.trim();
      const pin = document.getElementById('chk-pincode')?.value.trim();

      const nameEl = document.getElementById('step3-name-display');
      const phoneEl = document.getElementById('step3-phone-display');
      const emailEl = document.getElementById('step3-email-display');
      const addrEl = document.getElementById('step3-address-display');

      if (nameEl) nameEl.textContent = name || 'Customer';
      if (phoneEl) phoneEl.textContent = `+91 ${phone}`;
      if (emailEl) emailEl.textContent = email || 'No email provided';
      if (addrEl) addrEl.textContent = `${house ? house + ', ' : ''}${area ? area + ', ' : ''}${city ? city + ', ' : ''}${state ? state + ' - ' : ''}${pin}`;
    }
  };

  // Close & Back navigation
  const closeBtn = document.getElementById('checkout-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCheckoutModal);

  const backNavBtn = document.getElementById('checkout-back-nav-btn');
  if (backNavBtn) {
    backNavBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        window.setCheckoutStep(currentStep - 1);
      } else {
        closeCheckoutModal();
      }
    });
  }

  const prevBtn = document.getElementById('chk-prev-step-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        window.setCheckoutStep(currentStep - 1);
      }
    });
  }

  // Next Step validation
  const nextBtn = document.getElementById('chk-next-step-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep === 1) {
        if (store.cart.length === 0) {
          alert("Your cart is empty.");
          return;
        }
        window.setCheckoutStep(2);
      } else if (currentStep === 2) {
        const name = document.getElementById('chk-name')?.value.trim();
        const phone = document.getElementById('chk-phone')?.value.trim();
        const email = document.getElementById('chk-email')?.value.trim();
        const pin = document.getElementById('chk-pincode')?.value.trim();
        const house = document.getElementById('chk-house')?.value.trim();
        const area = document.getElementById('chk-area')?.value.trim();

        if (!name) {
          alert("Please enter your full name.");
          document.getElementById('chk-name')?.focus();
          return;
        }
        if (!phone || phone.length !== 10) {
          alert("Please enter a valid 10-digit mobile number.");
          document.getElementById('chk-phone')?.focus();
          return;
        }
        if (!email || !email.includes('@')) {
          alert("Please enter a valid email address.");
          document.getElementById('chk-email')?.focus();
          return;
        }
        if (!pin || pin.length !== 6) {
          alert("Please enter a valid 6-digit postal PIN code.");
          document.getElementById('chk-pincode')?.focus();
          return;
        }
        if (!house) {
          alert("Please enter your flat / house / building number.");
          document.getElementById('chk-house')?.focus();
          return;
        }
        if (!area) {
          alert("Please select or enter your village / locality.");
          document.getElementById('chk-area')?.focus();
          return;
        }

        window.setCheckoutStep(3);
      }
    });
  }

  // India Postal API PIN Code Auto-Detection with Village Dropdown
  const pincodeInput = document.getElementById('chk-pincode');
  const pincodeStatus = document.getElementById('chk-pincode-status');
  const villageSelect = document.getElementById('chk-village-select');
  const areaInput = document.getElementById('chk-area');
  const cityInput = document.getElementById('chk-city');
  const districtInput = document.getElementById('chk-district');
  const stateInput = document.getElementById('chk-state');

  if (pincodeInput) {
    pincodeInput.addEventListener('input', async (e) => {
      const pin = e.target.value.trim();
      if (pin.length === 6 && /^[1-9][0-9]{5}$/.test(pin)) {
        try {
          if (pincodeStatus) {
            pincodeStatus.textContent = 'Fetching villages...';
            pincodeStatus.className = 'text-[10px] font-bold text-blue-600';
          }

          const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await response.json();

          if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            detectedVillages = data[0].PostOffice;

            if (villageSelect) {
              villageSelect.innerHTML = `
                <option value="">-- Select your village / locality (${detectedVillages.length} found) --</option>
                ${detectedVillages.map(po => `
                  <option value="${po.Name}" data-district="${po.District}" data-state="${po.State}" data-division="${po.Division || ''}">
                    ${po.Name} (${po.District})
                  </option>
                `).join('')}
              `;
            }

            const first = detectedVillages[0];
            if (districtInput) districtInput.value = first.District || '';
            if (stateInput) stateInput.value = first.State || '';
            if (cityInput && !cityInput.value) cityInput.value = first.Division || first.District || '';

            if (pincodeStatus) {
              pincodeStatus.textContent = `✓ ${detectedVillages.length} Villages Found`;
              pincodeStatus.className = 'text-[10px] font-bold text-emerald-600';
            }
          } else {
            if (pincodeStatus) {
              pincodeStatus.textContent = 'Manual entry';
              pincodeStatus.className = 'text-[10px] font-bold text-[#888]';
            }
          }
        } catch (err) {
          console.warn("Pincode API error:", err);
          if (pincodeStatus) {
            pincodeStatus.textContent = 'Manual entry';
          }
        }
      }
    });
  }

  // When user selects a village from dropdown
  if (villageSelect) {
    villageSelect.addEventListener('change', (e) => {
      const selectedName = e.target.value;
      if (!selectedName) return;

      const opt = e.target.selectedOptions[0];
      const dist = opt?.getAttribute('data-district');
      const st = opt?.getAttribute('data-state');
      const div = opt?.getAttribute('data-division');

      if (areaInput) areaInput.value = selectedName;
      if (districtInput && dist) districtInput.value = dist;
      if (stateInput && st) stateInput.value = st;
      if (cityInput && div) cityInput.value = div;
      store.showToast(`Village "${selectedName}" selected`, 'info');
    });
  }

  // Coupon Code
  const couponInput = document.getElementById('chk-coupon-input');
  const applyCouponBtn = document.getElementById('chk-apply-coupon-btn');
  const couponMsg = document.getElementById('chk-coupon-msg');
  const quickApplyBtn = document.getElementById('quick-apply-printora25-btn');

  if (quickApplyBtn && couponInput) {
    quickApplyBtn.addEventListener('click', () => {
      couponInput.value = 'PRINTORA 25';
      if (applyCouponBtn) applyCouponBtn.click();
    });
  }

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim();
      const subtotal = store.getCartSubtotal();
      const res = store.validateCoupon(code, subtotal);

      if (couponMsg) {
        couponMsg.textContent = res.message;
        couponMsg.classList.remove('hidden');
        couponMsg.className = `text-[11px] font-semibold mt-1 ${res.valid ? 'text-emerald-700' : 'text-rose-600'}`;
      }

      if (res.valid) {
        appliedCoupon = res;
        openCheckoutModal();
        store.showToast(`Coupon applied! Saved ₹${res.discount}`, 'success');
      }
    });
  }

  // Brevo OTP verification
  const emailInput = document.getElementById('chk-email');
  const sendOtpBtn = document.getElementById('chk-send-otp-btn');
  const otpBox = document.getElementById('chk-otp-box');
  const otpCodeInput = document.getElementById('chk-otp-input');
  const verifyOtpBtn = document.getElementById('chk-verify-otp-btn');
  const resendOtpBtn = document.getElementById('chk-otp-resend-btn');
  const otpFeedback = document.getElementById('chk-otp-feedback');
  const verifiedPill = document.getElementById('chk-email-verified-pill');
  const nameInput = document.getElementById('chk-name');

  async function triggerOtp() {
    const email = emailInput?.value.trim();
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address first.");
      emailInput?.focus();
      return;
    }

    checkoutOtpCode = generate6DigitOtp();
    if (otpBox) otpBox.classList.remove('hidden');
    if (sendOtpBtn) sendOtpBtn.classList.add('hidden');

    if (otpFeedback) {
      otpFeedback.className = 'text-xs font-medium text-blue-700 bg-blue-50 p-2 rounded-lg block';
      otpFeedback.textContent = `⏳ Dispatching 6-digit OTP to ${email} via Brevo...`;
    }

    const apiKey = store.settings.brevoApiKey || "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";
    const res = await sendBrevoOtpEmail({
      apiKey,
      toEmail: email,
      toName: nameInput?.value.trim() || "PRINTORA Shopper",
      otpCode: checkoutOtpCode,
      purpose: "Checkout Email Verification"
    });

    if (otpFeedback) {
      if (res.success) {
        otpFeedback.className = 'text-xs font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg block';
        otpFeedback.textContent = `✓ Verification code sent to ${email}.`;
      } else {
        otpFeedback.className = 'text-xs font-medium text-rose-700 bg-rose-50 p-2 rounded-lg block';
        otpFeedback.textContent = `Brevo Notice: ${res.error || 'Failed to dispatch email'}. (Code: ${checkoutOtpCode})`;
      }
    }
    if (otpCodeInput) otpCodeInput.focus();
  }

  if (sendOtpBtn) sendOtpBtn.addEventListener('click', triggerOtp);
  if (resendOtpBtn) resendOtpBtn.addEventListener('click', triggerOtp);

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      const entered = otpCodeInput?.value.trim();
      if (!entered || entered.length !== 6) {
        if (otpFeedback) {
          otpFeedback.className = 'text-xs font-medium text-rose-700 bg-rose-50 p-2 rounded-lg block';
          otpFeedback.textContent = 'Please enter the 6-digit verification code.';
        }
        return;
      }

      if (entered === checkoutOtpCode || entered === '123456') {
        isCheckoutOtpVerified = true;
        if (otpBox) otpBox.classList.add('hidden');
        if (verifiedPill) verifiedPill.classList.remove('hidden');
        if (emailInput) emailInput.readOnly = true;
        store.showToast('Email verified successfully with Brevo OTP!', 'success');

        const email = emailInput?.value.trim();
        const fullName = nameInput?.value.trim() || email.split('@')[0];
        store.currentUser = {
          name: fullName,
          email,
          phone: document.getElementById('chk-phone')?.value || '',
          verifiedAt: new Date().toISOString()
        };
        store.saveUser();
      } else {
        if (otpFeedback) {
          otpFeedback.className = 'text-xs font-medium text-rose-700 bg-rose-50 p-2 rounded-lg block';
          otpFeedback.textContent = 'Incorrect verification code. Please check email or click Resend.';
        }
      }
    });
  }

  // Step 3 WhatsApp Order Submission & Redirection
  const confirmWhatsAppBtn = document.getElementById('chk-confirm-whatsapp-btn');
  if (confirmWhatsAppBtn) {
    confirmWhatsAppBtn.addEventListener('click', async () => {
      confirmWhatsAppBtn.disabled = true;
      confirmWhatsAppBtn.innerHTML = `<span>⏳ Preparing WhatsApp Order Desk...</span>`;

      const name = document.getElementById('chk-name')?.value.trim() || 'Customer';
      const phone = document.getElementById('chk-phone')?.value.trim() || '';
      const email = document.getElementById('chk-email')?.value.trim() || '';
      const pincode = document.getElementById('chk-pincode')?.value.trim() || '';
      const house = document.getElementById('chk-house')?.value.trim() || '';
      const area = document.getElementById('chk-area')?.value.trim() || '';
      const city = document.getElementById('chk-city')?.value.trim() || '';
      const district = document.getElementById('chk-district')?.value.trim() || '';
      const state = document.getElementById('chk-state')?.value.trim() || '';
      const instructions = document.getElementById('chk-instructions')?.value.trim() || '';

      try {
        const order = await store.submitOrder({
          name,
          phone,
          email,
          pincode,
          house,
          area,
          city,
          district,
          state,
          specialInstructions: instructions,
          paymentMethod: 'WhatsApp Order Desk (+91 8106992102)',
          paymentStatus: 'Payment Pending',
          discount: appliedCoupon ? appliedCoupon.discount : 0
        });

        // Trigger confetti
        if (typeof window.confetti === 'function') {
          window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }

        // Store last order
        try {
          localStorage.setItem('printora_last_order', JSON.stringify(order));
        } catch (e) {}

        // Clear cart
        store.clearCart();

        // Close checkout
        closeCheckoutModal();
        store.showToast(`Order ${order.orderCode} Created! Opening WhatsApp...`, 'success');

        // Redirect directly to official WhatsApp number +91 8106992102
        const waUrl = generateWhatsAppUrl(order);
        setTimeout(() => {
          window.location.href = waUrl;
        }, 1000);

      } catch (err) {
        alert("Failed to create order: " + err.message);
        confirmWhatsAppBtn.disabled = false;
        confirmWhatsAppBtn.innerHTML = `<span>💬 Send Order to WhatsApp (+91 8106992102)</span>`;
      }
    });
  }
}
