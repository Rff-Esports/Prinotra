// PRINTORA Master 3-Step Compact Mobile-Friendly Checkout Modal
// Step 1: Customization & Items Review (Coupons)
// Step 2: Indian Delivery Address with Auto PIN Village/Locality Dropdown
// Step 3: Payment & Redirection to WhatsApp Desk (+91 8106992102)

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { generateWhatsAppUrl, BUSINESS_WHATSAPP_NUMBER } from '../services/whatsapp.js';
import { openAuthModal } from './AuthModal.js';
import { sendBrevoOtpEmail, generate6DigitOtp } from '../services/brevo.js';

let checkoutOtpCode = null;
let isCheckoutOtpVerified = false;
let currentStep = 1; // 1: Items, 2: Address, 3: WhatsApp
let detectedVillages = [];

export function renderCheckoutModal() {
  const cart = store.cart;
  const subtotal = store.getCartSubtotal();
  const appliedCoupon = store.appliedCoupon;
  const discount = store.getCouponDiscount();
  const total = store.getCartTotal();
  const user = store.currentUser;
  const activeCoupons = store.coupons || [];

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
          <div id="chk-step-pill-1" class="flex items-center gap-1.5 step-indicator ${currentStep === 1 ? 'text-[#FF6B35] font-extrabold' : currentStep > 1 ? 'text-emerald-700 font-bold' : 'text-[#888]'}">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 1 ? 'bg-[#FF6B35] text-white' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-[#DDD4C4] text-[#666]'}">
              ${currentStep > 1 ? '✓' : '1'}
            </span>
            <span class="text-[11px]">1. Items</span>
          </div>
          <span class="text-[#CCC] text-xs">→</span>
          <div id="chk-step-pill-2" class="flex items-center gap-1.5 step-indicator ${currentStep === 2 ? 'text-[#FF6B35] font-extrabold' : currentStep > 2 ? 'text-emerald-700 font-bold' : 'text-[#888]'}">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 2 ? 'bg-[#FF6B35] text-white' : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-[#DDD4C4] text-[#666]'}">
              ${currentStep > 2 ? '✓' : '2'}
            </span>
            <span class="text-[11px]">2. Address</span>
          </div>
          <span class="text-[#CCC] text-xs">→</span>
          <div id="chk-step-pill-3" class="flex items-center gap-1.5 step-indicator ${currentStep === 3 ? 'text-[#FF6B35] font-extrabold' : 'text-[#888]'}">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 3 ? 'bg-[#FF6B35] text-white' : 'bg-[#DDD4C4] text-[#666]'}">
              3
            </span>
            <span class="text-[11px]">3. Payment</span>
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
                        ${item.printingType ? ` • <strong class="text-[#FF6B35]">🖨️ ${item.printingType} (${item.printingPosition || 'Front'})</strong>` : ''}
                        ${item.uploadedDesign ? ` • <span class="text-emerald-700 font-bold">📎 ${item.uploadedDesign.name}</span>` : ''}
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

                <!-- Quick Add Options -->
                <div class="pt-1 border-t border-orange-200/60">
                  <span class="text-[10px] uppercase font-bold tracking-wider text-[#666] block mb-1.5 font-heading">
                    ⚡ Quick Add to reach ₹2,499 & get 20% OFF:
                  </span>
                  <div class="grid grid-cols-2 gap-1.5">
                    ${quickAddProducts.map(p => `
                      <button type="button" class="chk-quick-add-btn text-left p-1.5 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 transition-all flex items-center justify-between gap-1 group cursor-pointer shadow-xs" data-prod-id="${p.id}">
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
                  <button type="button" class="chk-quick-apply-coupon-btn bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold font-mono px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow flex-shrink-0" data-coupon="BULK20">
                    Apply BULK20
                  </button>
                `}
              </div>
            ` : ''}

            <!-- ACTIVE PROMO COUPONS SECTION -->
            <div class="p-3.5 bg-white border border-[#DDD4C4] rounded-2xl space-y-2.5 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-[#333] font-heading flex items-center gap-1.5">
                  🏷️ Active Coupons (${activeCoupons.length})
                </span>
                ${appliedCoupon ? `
                  <button type="button" class="chk-remove-coupon-btn text-[10px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer">
                    Remove (${appliedCoupon.code})
                  </button>
                ` : ''}
              </div>

              <!-- Available Coupons List -->
              <div class="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                ${activeCoupons.map(c => {
                  const normInput = (c.code || '').toUpperCase().replace(/\s+/g, '');
                  const normApplied = (appliedCoupon?.code || '').toUpperCase().replace(/\s+/g, '');
                  const isApplied = appliedCoupon && normApplied === normInput;
                  const isEligible = subtotal >= (c.minOrder || 0);
                  const needed = (c.minOrder || 0) - subtotal;

                  return `
                    <div class="p-2 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs ${isApplied ? 'bg-emerald-50 border-emerald-400' : 'bg-[#FAF8F5] border-[#E8E2D8] hover:border-black/30'}">
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
                          <button type="button" class="chk-quick-apply-coupon-btn bg-[#111] hover:bg-[#FF6B35] text-white text-[10px] font-bold font-mono px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-xs" data-coupon="${c.code}">
                            Apply
                          </button>
                        ` : `
                          <span class="text-[9px] font-bold text-[#888] bg-[#EFECE4] px-1.5 py-0.5 rounded block text-center" title="Add ₹${needed} more to qualify">
                            Add ₹${needed}
                          </span>
                        `}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Manual Code Entry Box -->
              <div class="pt-2 border-t border-[#EFECE4]">
                <label for="chk-coupon-input" class="block text-[10px] uppercase font-bold text-[#777] mb-1 font-heading">Or enter custom promo code</label>
                <div class="flex items-center gap-2">
                  <input type="text" id="chk-coupon-input" value="${appliedCoupon ? appliedCoupon.code : ''}" placeholder="Coupon code" 
                         class="flex-1 bg-[#FAF8F5] border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs uppercase font-mono font-bold outline-none">
                  <button type="button" id="chk-apply-coupon-btn" class="bg-[#111] hover:bg-[#FF6B35] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                    ${appliedCoupon ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>
                <div id="chk-coupon-msg" class="text-[11px] font-semibold mt-1 ${appliedCoupon ? 'text-emerald-700' : 'hidden'}">
                  ${appliedCoupon ? appliedCoupon.message : ''}
                </div>
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
              <div class="sm:col-span-2">
                <label for="chk-email" class="block text-[11px] font-bold text-[#444] mb-1">Email Address * (For invoice & delivery updates)</label>
                <input type="email" id="chk-email" required value="${user?.email || ''}" placeholder="name@example.com" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs font-medium outline-none">
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
               STEP 3: SECURE PAYMENT GATEWAY (RAZORPAY LIVE)
               ========================================== -->
          <div id="checkout-step-3" class="${currentStep === 3 ? 'block' : 'hidden'} space-y-4 animate-fade-in">
            <div>
              <span class="text-xs uppercase tracking-widest text-[#777] font-bold block mb-1 font-heading">
                Step 3: Secure Payment & Order Placement
              </span>
              <p class="text-[11px] text-[#777]">Pay securely using UPI (Google Pay, PhonePe, Paytm), Cards or NetBanking. Instant automated confirmation.</p>
            </div>

            <!-- Order Recipient Snapshot Card -->
            <div class="p-3.5 bg-white border border-[#DDD4C4] rounded-2xl space-y-2 text-xs">
              <div class="flex items-center justify-between pb-2 border-b border-[#EFECE4]">
                <strong class="text-black font-heading">Delivery Address</strong>
                <button type="button" onclick="window.setCheckoutStep(2)" class="text-[#FF6B35] font-bold text-[11px] hover:underline cursor-pointer">Edit Address</button>
              </div>
              <div class="space-y-1 text-[#555]">
                <p>👤 <strong class="text-black" id="step3-name-display">—</strong> (<span id="step3-phone-display">—</span>)</p>
                <p>📧 <span id="step3-email-display">—</span></p>
                <p>📍 <span id="step3-address-display">—</span></p>
              </div>
            </div>

            <!-- Razorpay Payment Methods Selection Card -->
            <div class="p-4 bg-white border-2 border-black rounded-2xl space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-lg">💳</span>
                  <div>
                    <strong class="text-xs font-bold text-black block font-heading">Online Payment (Razorpay Live)</strong>
                    <span class="text-[10px] text-[#666]">UPI, Cards, NetBanking, Wallets</span>
                  </div>
                </div>
                <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono uppercase">LIVE</span>
              </div>

              <!-- Payment Icons Grid -->
              <div class="bg-[#FAF8F5] border border-[#DDD4C4] rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#444]">
                <span class="inline-flex items-center gap-1">📱 Google Pay</span>
                <span class="inline-flex items-center gap-1">🟣 PhonePe</span>
                <span class="inline-flex items-center gap-1">💙 Paytm</span>
                <span class="inline-flex items-center gap-1">💳 Cards / NetBanking</span>
              </div>

              <!-- Security Assurance -->
              <div class="flex items-center gap-2 text-[10px] text-[#777] pt-1">
                <span class="text-emerald-600 font-bold">🔒 256-bit SSL Encrypted</span>
                <span>•</span>
                <span>Official Razorpay Partner</span>
                <span>•</span>
                <span class="text-emerald-700 font-bold">₹0 Delivery Fee</span>
              </div>
            </div>

            <!-- WhatsApp Support Info Pill (Strictly for support, not a checkout redirect) -->
            <div class="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center justify-between text-xs text-[#166534]">
              <div class="flex items-center gap-2">
                <span class="text-base">💬</span>
                <span class="text-[11px] leading-tight">Need assistance or custom design help? Our WhatsApp desk is active for support.</span>
              </div>
              <a href="https://wa.me/918106992102?text=Hi%20Printora%20Support%2C%20I%20have%20a%20question%20about%20my%20order." target="_blank" rel="noopener noreferrer" class="text-[10px] font-bold text-emerald-700 underline flex-shrink-0 ml-2">Chat Desk</a>
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

          <button type="button" id="chk-pay-razorpay-btn" class="flex-1 bg-[#111] hover:bg-[#FF6B35] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${currentStep === 3 ? '' : 'hidden'}">
            <span>🔒 Pay ₹${total} via Razorpay / UPI</span>
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
    const payRazorpayBtn = document.getElementById('chk-pay-razorpay-btn');
    const backLabel = document.getElementById('checkout-back-label');

    // Dynamically update 3-Step Stepper Header pills
    const pill1 = document.getElementById('chk-step-pill-1');
    const pill2 = document.getElementById('chk-step-pill-2');
    const pill3 = document.getElementById('chk-step-pill-3');

    if (pill1) {
      if (step === 1) {
        pill1.className = 'flex items-center gap-1.5 step-indicator text-[#FF6B35] font-extrabold';
        pill1.innerHTML = `<span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#FF6B35] text-white">1</span><span class="text-[11px]">1. Items</span>`;
      } else {
        pill1.className = 'flex items-center gap-1.5 step-indicator text-emerald-700 font-bold';
        pill1.innerHTML = `<span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-emerald-600 text-white">✓</span><span class="text-[11px]">1. Items</span>`;
      }
    }

    if (pill2) {
      if (step === 2) {
        pill2.className = 'flex items-center gap-1.5 step-indicator text-[#FF6B35] font-extrabold';
        pill2.innerHTML = `<span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#FF6B35] text-white">2</span><span class="text-[11px]">2. Address</span>`;
      } else if (step > 2) {
        pill2.className = 'flex items-center gap-1.5 step-indicator text-emerald-700 font-bold';
        pill2.innerHTML = `<span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-emerald-600 text-white">✓</span><span class="text-[11px]">2. Address</span>`;
      } else {
        pill2.className = 'flex items-center gap-1.5 step-indicator text-[#888] font-normal';
        pill2.innerHTML = `<span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#DDD4C4] text-[#666]">2</span><span class="text-[11px]">2. Address</span>`;
      }
    }

    if (pill3) {
      if (step === 3) {
        pill3.className = 'flex items-center gap-1.5 step-indicator text-[#FF6B35] font-extrabold';
        pill3.innerHTML = `<span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#FF6B35] text-white">3</span><span class="text-[11px]">3. Payment</span>`;
      } else {
        pill3.className = 'flex items-center gap-1.5 step-indicator text-[#888] font-normal';
        pill3.innerHTML = `<span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#DDD4C4] text-[#666]">3</span><span class="text-[11px]">3. Payment</span>`;
      }
    }

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

    if (payRazorpayBtn) {
      if (step === 3) {
        payRazorpayBtn.classList.remove('hidden');
        payRazorpayBtn.innerHTML = `<span>🔒 Pay ₹${store.getCartTotal()} via Razorpay / UPI</span>`;
      } else {
        payRazorpayBtn.classList.add('hidden');
      }
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

  // Delegated Event Listeners for Step 1 (Quick-Add, 1-Click Coupon Apply, Remove, and Manual Apply)
  const step1Container = document.getElementById('checkout-step-1');
  const refreshCheckoutStep1 = () => {
    const s1 = document.getElementById('checkout-step-1');
    if (s1) {
      const temp = document.createElement('div');
      temp.innerHTML = renderCheckoutModal();
      const newS1 = temp.querySelector('#checkout-step-1');
      if (newS1) {
        s1.innerHTML = newS1.innerHTML;
      }
    }
  };

  if (step1Container) {
    step1Container.addEventListener('click', (e) => {
      // 1. Quick add merchandise to reach 20% off
      const quickAddBtn = e.target.closest('.chk-quick-add-btn');
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
          refreshCheckoutStep1();
        }
        return;
      }

      // 2. Quick 1-click apply coupon from active list or celebration
      const applyCouponBtn = e.target.closest('.chk-quick-apply-coupon-btn');
      if (applyCouponBtn) {
        const code = applyCouponBtn.getAttribute('data-coupon');
        if (code) {
          store.applyCoupon(code);
          refreshCheckoutStep1();
        }
        return;
      }

      // 3. Remove coupon
      const removeCouponBtn = e.target.closest('.chk-remove-coupon-btn');
      if (removeCouponBtn) {
        store.removeCoupon();
        refreshCheckoutStep1();
        return;
      }

      // 4. Manual apply button
      const manualApplyBtn = e.target.closest('#chk-apply-coupon-btn');
      if (manualApplyBtn) {
        const input = document.getElementById('chk-coupon-input');
        const code = input?.value.trim();
        if (!code) {
          store.showToast("Please enter a coupon code", "info");
          return;
        }
        store.applyCoupon(code);
        refreshCheckoutStep1();
        return;
      }
    });
  }

  // Save user contact updates reactively
  const nameInput = document.getElementById('chk-name');
  const emailInput = document.getElementById('chk-email');
  const phoneInput = document.getElementById('chk-phone');

  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        const firstName = val.split(' ')[0];
        const greetingEl = document.getElementById('nav-user-greeting');
        if (greetingEl) greetingEl.textContent = `Hi, ${firstName}`;
        const topGreetingEl = document.getElementById('top-announcement-greeting');
        if (topGreetingEl) topGreetingEl.textContent = `Hi, ${firstName}!`;
      }
    });
  }


  // Step 3 Razorpay Live Online Payment Handler
  const payRazorpayBtn = document.getElementById('chk-pay-razorpay-btn');
  if (payRazorpayBtn) {
    payRazorpayBtn.addEventListener('click', async () => {
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

      if (!name) {
        alert("Please enter your name.");
        window.setCheckoutStep(2);
        return;
      }
      if (!phone || phone.length !== 10) {
        alert("Please enter a valid 10-digit mobile number.");
        window.setCheckoutStep(2);
        return;
      }
      if (!email || !email.includes('@')) {
        alert("Please enter a valid email address.");
        window.setCheckoutStep(2);
        return;
      }
      if (!pincode || pincode.length !== 6) {
        alert("Please enter a valid 6-digit postal PIN code.");
        window.setCheckoutStep(2);
        return;
      }

      const total = store.getCartTotal();
      if (total <= 0) {
        alert("Your cart total is ₹0. Please add products to checkout.");
        return;
      }

      payRazorpayBtn.disabled = true;
      payRazorpayBtn.innerHTML = `<span>⏳ Initiating Secure Razorpay Gateway...</span>`;

      // Helper to launch Razorpay Modal
      const launchRazorpayModal = (serverOrderId = null) => {
        if (typeof window.Razorpay !== 'function') {
          alert("Razorpay checkout is loading. Please verify your connection and try again.");
          payRazorpayBtn.disabled = false;
          payRazorpayBtn.innerHTML = `<span>🔒 Pay ₹${total} via Razorpay / UPI</span>`;
          return;
        }

        const razorpayKey = store.settings.razorpayKeyId || 'rzp_live_TwnbxHtTo3019C';
        const options = {
          key: razorpayKey,
          amount: Math.round(total * 100), // In paise
          currency: 'INR',
          name: 'PRINTORA',
          description: `Custom Merchandise Order (${store.cart.length} item${store.cart.length > 1 ? 's' : ''})`,
          image: '/assets/logo.png',
          prefill: {
            name: name,
            email: email,
            contact: phone
          },
          notes: {
            customer_name: name,
            customer_phone: phone,
            shipping_pincode: pincode,
            brand: 'PRINTORA'
          },
          theme: {
            color: '#FF6B35'
          },
          modal: {
            ondismiss: function() {
              payRazorpayBtn.disabled = false;
              payRazorpayBtn.innerHTML = `<span>🔒 Pay ₹${total} via Razorpay / UPI</span>`;
              store.showToast('Payment window closed. You can retry when ready.', 'info');
            }
          },
          handler: async function (response) {
            try {
              payRazorpayBtn.innerHTML = `<span>⏳ Verifying Payment & Creating Order...</span>`;

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
                paymentMethod: 'Razorpay Online (UPI / Card / NetBanking)',
                paymentStatus: 'Payment Confirmed',
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id || serverOrderId || '',
                razorpaySignature: response.razorpay_signature || '',
                status: 'Payment Confirmed',
                discount: store.getCouponDiscount()
              });

              // Trigger confetti celebration
              if (typeof window.confetti === 'function') {
                window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
              }

              // Save last order
              try {
                localStorage.setItem('printora_last_order', JSON.stringify(order));
              } catch (e) {}

              // Send transactional confirmation email if Brevo is configured
              try {
                const brevoKey = store.settings.brevoApiKey || localStorage.getItem('printora_brevo_api_key');
                if (brevoKey && email) {
                  sendPaymentConfirmedEmail({
                    apiKey: brevoKey,
                    toEmail: email,
                    toName: name,
                    orderCode: order.orderCode,
                    totalAmount: total,
                    items: order.items || []
                  }).catch(() => {});
                }
              } catch (e) {}

              // Clear cart
              store.clearCart();

              // Render In-Modal Order Confirmation Screen
              renderOrderSuccessView(order, response.razorpay_payment_id);

            } catch (err) {
              console.error("Order processing error:", err);
              alert("Payment received, but error recording order: " + err.message);
              payRazorpayBtn.disabled = false;
              payRazorpayBtn.innerHTML = `<span>🔒 Pay ₹${total} via Razorpay / UPI</span>`;
            }
          }
        };

        if (serverOrderId) {
          options.order_id = serverOrderId;
        }

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          console.error("Payment failed:", resp.error);
          alert(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
          payRazorpayBtn.disabled = false;
          payRazorpayBtn.innerHTML = `<span>🔒 Pay ₹${total} via Razorpay / UPI</span>`;
        });
        rzp.open();
      };

      // Create Razorpay standard order via server API
      try {
        const res = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            currency: 'INR',
            receipt: 'rcpt_' + Date.now(),
            notes: {
              customer_name: name,
              customer_phone: phone,
              customer_email: email
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.order && data.order.id) {
            launchRazorpayModal(data.order.id);
            return;
          }
        }
        // Fallback to client standard checkout
        launchRazorpayModal(null);
      } catch (err) {
        console.warn("Server order creation fallback:", err);
        launchRazorpayModal(null);
      }
    });
  }
}

export function renderOrderSuccessView(order, paymentId) {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  const waSupportUrl = `https://wa.me/918106992102?text=${encodeURIComponent(`Hi Printora Support! I just placed Order ${order.orderCode} with Payment ID ${paymentId}. Please confirm my order details.`)}`;

  modal.innerHTML = `
    <div class="relative w-full max-w-lg bg-[#FAF8F5] border border-[#DDD4C4] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#111] animate-fade-in font-sans">
      
      <!-- Top Success Header -->
      <div class="bg-[#111111] text-white px-5 py-4 flex items-center justify-between border-b border-[#222]">
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">✓</span>
          <span class="font-heading font-bold text-base text-white">Order Confirmed!</span>
        </div>
        <button type="button" id="chk-success-close-btn" class="text-xs text-[#AAA] hover:text-white font-bold p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" aria-label="Close">
          ✕
        </button>
      </div>

      <!-- Success Content Body -->
      <div class="flex-1 overflow-y-auto p-5 space-y-4">
        
        <!-- Big Celebration Banner -->
        <div class="text-center py-4 bg-white border border-[#DDD4C4] rounded-2xl p-5 shadow-sm space-y-2">
          <div class="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold shadow-inner">
            ✓
          </div>
          <h2 class="font-heading text-xl font-bold text-black mt-2">Payment Received & Confirmed!</h2>
          <p class="text-xs text-[#666] max-w-sm mx-auto">
            Thank you, <strong class="text-black">${order.customerName}</strong>! Your order has been placed into our production pipeline.
          </p>
          <div class="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#DDD4C4] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-black mt-1">
            <span>Order Code:</span>
            <span class="text-[#FF6B35] font-extrabold">${order.orderCode}</span>
          </div>
        </div>

        <!-- Payment & Delivery Badges -->
        <div class="grid grid-cols-2 gap-2.5 text-xs">
          <div class="p-3 bg-white border border-[#DDD4C4] rounded-xl space-y-0.5">
            <span class="text-[10px] uppercase font-bold text-[#777] block">Razorpay Payment ID</span>
            <span class="font-mono font-bold text-emerald-700 text-[11px] truncate block" title="${paymentId}">
              ✓ ${paymentId || 'Verified Live'}
            </span>
          </div>
          <div class="p-3 bg-white border border-[#DDD4C4] rounded-xl space-y-0.5">
            <span class="text-[10px] uppercase font-bold text-[#777] block">Delivery Charge</span>
            <span class="font-mono font-bold text-emerald-700 text-[11px] block">
              ₹0 (Free Pan-India)
            </span>
          </div>
        </div>

        <!-- Shipping Destination Summary -->
        <div class="p-3.5 bg-white border border-[#DDD4C4] rounded-xl text-xs space-y-1">
          <span class="text-[10px] uppercase tracking-wider font-bold text-[#777] block">Shipping Destination</span>
          <p class="font-semibold text-black">${order.customerName} (${order.customerPhone})</p>
          <p class="text-[#666] text-[11px] leading-relaxed">
            ${order.shippingHouse ? order.shippingHouse + ', ' : ''}${order.shippingArea ? order.shippingArea + ', ' : ''}${order.shippingCity ? order.shippingCity + ', ' : ''}${order.shippingState ? order.shippingState + ' - ' : ''}${order.shippingPincode}
          </p>
        </div>

        <!-- WhatsApp Support Desk (Optional assistance, NOT checkout redirect) -->
        <div class="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl flex items-center justify-between gap-3">
          <div class="space-y-0.5">
            <strong class="text-xs font-bold text-[#166534] block">💬 Need custom design assistance or modifications?</strong>
            <p class="text-[11px] text-[#15803D]">Our official WhatsApp support desk is active to assist with your order.</p>
          </div>
          <a href="${waSupportUrl}" target="_blank" rel="noopener noreferrer" class="bg-[#166534] hover:bg-[#14532D] text-white px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow transition-colors flex items-center gap-1.5 flex-shrink-0">
            <span>Open WhatsApp</span>
            <span>→</span>
          </a>
        </div>

      </div>

      <!-- Action Footer -->
      <div class="bg-white border-t border-[#DDD4C4] p-4 flex gap-3">
        <button type="button" id="chk-success-continue-btn" class="w-full bg-[#111] hover:bg-[#FF6B35] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors shadow cursor-pointer font-heading">
          Continue Shopping
        </button>
      </div>

    </div>
  `;

  // Attach close listeners
  const closeBtn = document.getElementById('chk-success-close-btn');
  const continueBtn = document.getElementById('chk-success-continue-btn');
  const handleClose = () => {
    closeCheckoutModal();
    // Re-render checkout modal template for next time
    const temp = document.createElement('div');
    temp.innerHTML = renderCheckoutModal();
    const newModal = temp.querySelector('#checkout-modal');
    if (newModal) modal.innerHTML = newModal.innerHTML;
  };
  if (closeBtn) closeBtn.addEventListener('click', handleClose);
  if (continueBtn) continueBtn.addEventListener('click', handleClose);
}
