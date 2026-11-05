// PRINTORA Master Checkout Modal
// Section 7 (₹0 Free Shipping), Section 14 (PIN Auto-Detection & GPS), Section 15 (Checkout Flow), Section 16 (WhatsApp Integration)

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { generateWhatsAppUrl, BUSINESS_WHATSAPP_NUMBER } from '../services/whatsapp.js';
import { openAuthModal } from './AuthModal.js';

let appliedCoupon = null;

export function renderCheckoutModal() {
  const cart = store.cart;
  const subtotal = store.getCartSubtotal();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = store.getCartTotal(discount);
  const user = store.currentUser;

  return `
    <div id="checkout-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div class="relative w-full max-w-3xl bg-[#FAFAF7] border border-[#DDD4C4] rounded-3xl shadow-2xl overflow-hidden my-8 animate-fade-in text-[#111]">
        
        <!-- Modal Top Bar -->
        <div class="bg-[#111111] text-white px-6 py-5 flex items-center justify-between border-b border-[#222]">
          <div>
            <div class="inline-flex items-center gap-1.5 bg-[#222] px-3 py-0.5 rounded-full text-[10px] text-[#FF6B35] uppercase font-bold tracking-widest font-heading mb-1">
              <span>Zero Delivery Charges</span>
            </div>
            <h3 class="font-heading text-2xl font-bold tracking-tight text-white">Express Checkout</h3>
          </div>
          <button id="checkout-close-btn" class="text-[#AAA] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors" aria-label="Close Checkout">
            ${renderIcon('close', 'w-5 h-5')}
          </button>
        </div>

        <!-- Checkout Form Body -->
        <form id="checkout-order-form" class="p-6 md:p-8 space-y-6">
          
          <!-- Order Summary Card -->
          <div class="bg-[#F0EAE1] border border-[#DDD4C4] rounded-2xl p-4">
            <div class="flex items-center justify-between font-bold text-xs text-[#555] uppercase tracking-wider mb-2 font-heading">
              <span>Order Summary (${store.getCartCount()} items)</span>
              <span class="font-mono text-black font-extrabold text-sm">₹${total}</span>
            </div>
            
            <div class="space-y-1.5 text-xs text-[#444] max-h-36 overflow-y-auto pr-1">
              ${cart.map(item => `
                <div class="flex justify-between items-center py-1.5 border-b border-[#E5DFD4] last:border-0">
                  <div class="truncate pr-2">
                    <strong class="text-black">${item.name}</strong> 
                    <span class="text-[#777]">(${item.selectedSize}${item.selectedColor ? ` / ${item.selectedColor}` : ''})</span>
                    ${item.customName ? ` • Name: <span class="uppercase font-bold text-black">${item.customName}</span>` : ''}
                    ${item.customNumber ? ` • #${item.customNumber}` : ''}
                    x${item.quantity}
                  </div>
                  <span class="font-mono font-bold text-black flex-shrink-0">₹${item.price * item.quantity}</span>
                </div>
              `).join('')}
            </div>

            <!-- Coupon Code Form Field -->
            <div class="mt-3 pt-3 border-t border-[#DDD4C4] space-y-2">
              <div class="flex items-center gap-2">
                <input type="text" id="chk-coupon-input" value="${appliedCoupon ? appliedCoupon.code : ''}" placeholder="Coupon Code (e.g. PRINTORA 25)" 
                       class="flex-1 bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3 py-2 text-xs uppercase font-mono font-bold outline-none">
                <button type="button" id="chk-apply-coupon-btn" class="bg-[#111] hover:bg-[#FF6B35] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                  ${appliedCoupon ? 'Applied ✓' : 'Apply'}
                </button>
              </div>

              <!-- Fast One-Click Apply Pill for PRINTORA 25 -->
              <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span class="text-[#777] font-medium">Available Offer:</span>
                <button type="button" id="quick-apply-printora25-btn" onclick="document.getElementById('chk-coupon-input').value = 'PRINTORA 25'; document.getElementById('chk-apply-coupon-btn').click();" class="inline-flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-[#FF6B35] hover:text-white border border-[#DDD4C4] text-black px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer shadow-sm">
                  <span>🏷️ PRINTORA 25</span>
                  <span class="text-[10px] text-[#FF6B35] group-hover:text-white font-sans font-semibold">• Flat ₹25 OFF</span>
                  <span class="text-[10px] text-[#111] underline font-sans ml-1">Tap to Apply</span>
                </button>
              </div>

              <div id="chk-coupon-msg" class="text-[11px] font-semibold mt-1.5 ${appliedCoupon ? 'text-emerald-700' : 'hidden'}">
                ${appliedCoupon ? appliedCoupon.message : ''}
              </div>
            </div>
          </div>

          <!-- Section 1: Customer Contact Details -->
          <div>
            <h4 class="text-xs uppercase tracking-widest text-[#777] font-bold mb-3 flex items-center gap-1.5 font-heading">
              ${renderIcon('user', 'w-4 h-4 text-[#FF6B35]')} 1. Contact Information
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label for="chk-name" class="block text-xs font-bold text-[#333] mb-1">Full Name *</label>
                <input type="text" id="chk-name" required value="${user?.name || ''}" placeholder="Rahul Varma" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium">
              </div>
              <div>
                <label for="chk-phone" class="block text-xs font-bold text-[#333] mb-1">Mobile / WhatsApp Number *</label>
                <div class="flex">
                  <span class="inline-flex items-center px-3.5 text-xs font-bold text-[#666] bg-[#EFEAE0] border border-r-0 border-[#DDD4C4] rounded-l-xl">+91</span>
                  <input type="tel" id="chk-phone" required pattern="[0-9]{10}" maxlength="10" value="${user?.phone ? user.phone.replace('+91', '').trim() : ''}" placeholder="9876543210" 
                         class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-r-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium">
                </div>
              </div>
              <div class="sm:col-span-2">
                <label for="chk-email" class="block text-xs font-bold text-[#333] mb-1">Email Address (For PDF Invoice & Tracking)</label>
                <input type="email" id="chk-email" value="${user?.email || ''}" placeholder="rahul@example.com" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium">
              </div>
            </div>
          </div>

          <!-- Section 2: Complete Indian Delivery Address with PIN Auto-Detect -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-xs uppercase tracking-widest text-[#777] font-bold flex items-center gap-1.5 font-heading">
                ${renderIcon('truck', 'w-4 h-4 text-[#FF6B35]')} 2. Indian Delivery Address
              </h4>
              <button type="button" id="chk-gps-location-btn" class="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF6B35] hover:underline bg-[#FF6B35]/10 px-2.5 py-1 rounded-lg">
                <span>📍 Use My Current Location</span>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <!-- PIN Code Field (Triggers Auto-Detect) -->
              <div>
                <label for="chk-pincode" class="block text-xs font-bold text-[#333] mb-1">Postal PIN Code *</label>
                <div class="relative">
                  <input type="text" id="chk-pincode" required pattern="[0-9]{6}" maxlength="6" placeholder="503001" 
                         class="w-full bg-white border border-[#DDD4C4] focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold outline-none transition-colors">
                  <span id="chk-pincode-status" class="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-600 hidden">✓ Auto-Detected</span>
                </div>
              </div>

              <!-- City / Town -->
              <div>
                <label for="chk-city" class="block text-xs font-bold text-[#333] mb-1">City / Town *</label>
                <input type="text" id="chk-city" required placeholder="City" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium">
              </div>

              <!-- District -->
              <div>
                <label for="chk-district" class="block text-xs font-bold text-[#333] mb-1">District *</label>
                <input type="text" id="chk-district" required placeholder="District" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium">
              </div>

              <!-- State -->
              <div class="sm:col-span-3">
                <label for="chk-state" class="block text-xs font-bold text-[#333] mb-1">State *</label>
                <input type="text" id="chk-state" required placeholder="e.g. Telangana, Maharashtra, Karnataka" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium">
              </div>

              <!-- House Number & Street -->
              <div class="sm:col-span-2">
                <label for="chk-house" class="block text-xs font-bold text-[#333] mb-1">Flat / House No. / Building / Street *</label>
                <input type="text" id="chk-house" required placeholder="Flat 402, Royal Residency, Subhash Road" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium">
              </div>

              <!-- Area / Landmark -->
              <div>
                <label for="chk-area" class="block text-xs font-bold text-[#333] mb-1">Area / Landmark *</label>
                <input type="text" id="chk-area" required placeholder="Near Shivaji Chowk" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium">
              </div>
            </div>
          </div>

          <!-- Section 3: Special Printing or Gift Instructions -->
          <div>
            <label for="chk-instructions" class="block text-xs font-bold text-[#333] mb-1">Special Packaging Instructions or Gift Note (Optional)</label>
            <textarea id="chk-instructions" rows="2" placeholder="e.g. Please deliver before Friday. Pack in Printora luxury gift box." 
                      class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl p-3 text-xs outline-none transition-colors resize-none"></textarea>
          </div>

          <!-- Section 4: Strict Zero-Shipping Breakdown & Payment Methods -->
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-5 space-y-4">
            
            <!-- Price Calculation Display (Strict Rule Compliant) -->
            <div class="space-y-1.5 text-xs text-[#555] pb-3 border-b border-[#EFECE4]">
              <div class="flex justify-between">
                <span>Items Subtotal:</span>
                <span class="font-mono font-bold text-black">₹${subtotal}</span>
              </div>
              <div class="flex justify-between text-emerald-700 font-semibold" id="chk-discount-row" style="${discount > 0 ? '' : 'display:none;'}">
                <span>Coupon Discount (${appliedCoupon?.code || ''}):</span>
                <span class="font-mono font-bold">-₹${discount}</span>
              </div>
              <div class="flex justify-between items-center text-emerald-700 font-bold">
                <span class="flex items-center gap-1.5">
                  ${renderIcon('check', 'w-3.5 h-3.5')} Shipping & Delivery Charges:
                </span>
                <span class="font-mono uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  FREE (₹0)
                </span>
              </div>
              <div class="flex justify-between items-baseline text-base font-extrabold text-black pt-2 border-t border-[#EFECE4]">
                <span>Total Payable:</span>
                <span class="font-mono text-xl text-[#FF6B35]">₹${total}</span>
              </div>
            </div>

            <!-- Payment Methods -->
            <div>
              <span class="text-xs uppercase tracking-widest text-[#777] font-bold block mb-2 font-heading">
                3. Select Payment Method
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="chk-payment-options">
                
                <!-- Option A: Razorpay Online (Cards / UPI) -->
                <label class="cursor-pointer border-2 border-black bg-[#FAF8F5] p-3.5 rounded-xl flex items-start gap-3 transition-all chk-pay-option" data-method="Online">
                  <input type="radio" name="payment_method" value="Online" checked class="mt-1 accent-black">
                  <div>
                    <strong class="text-xs font-bold text-black block">💳 Pay Online (UPI / Cards / NetBanking)</strong>
                    <p class="text-[11px] text-[#666] mt-0.5 leading-snug">Instant confirmation. Supports Google Pay, PhonePe, Paytm, Debit/Credit Cards & NetBanking.</p>
                  </div>
                </label>

                <!-- Option B: WhatsApp Order Integration -->
                <label class="cursor-pointer border-2 border-[#DDD4C4] hover:border-black bg-white p-3.5 rounded-xl flex items-start gap-3 transition-all chk-pay-option" data-method="WhatsApp">
                  <input type="radio" name="payment_method" value="WhatsApp" class="mt-1 accent-black">
                  <div>
                    <strong class="text-xs font-bold text-black block">💬 Order via Official WhatsApp</strong>
                    <p class="text-[11px] text-[#666] mt-0.5 leading-snug">Order is saved in Printora system, then sends full receipt & customization proof to +91 8106992102.</p>
                  </div>
                </label>

              </div>
            </div>

          </div>

          <!-- Final Checkout Submit Button -->
          <div class="space-y-3 pt-2">
            <button type="submit" id="checkout-submit-btn" class="w-full bg-[#111111] hover:bg-[#FF6B35] text-white font-extrabold py-4 px-6 rounded-2xl text-sm tracking-wider uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer">
              <span id="chk-btn-icon">${renderIcon('shieldCheck', 'w-5 h-5')}</span>
              <span id="chk-btn-text">Confirm Order • Total ₹${total} (Free Delivery)</span>
            </button>
            <p class="text-[11px] text-center text-[#777]">
              🔒 256-Bit SSL Encrypted • 100% Free Pan-India Delivery Guaranteed
            </p>
          </div>

        </form>

      </div>
    </div>
  `;
}

export function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    // If not signed in, prompt OTP authentication first!
    if (!store.currentUser) {
      openAuthModal((user) => {
        openCheckoutModal();
      });
      return;
    }

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
  const closeBtn = document.getElementById('checkout-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCheckoutModal);

  // Payment Option selection styling
  document.querySelectorAll('.chk-pay-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.chk-pay-option').forEach(o => {
        o.classList.remove('border-black', 'bg-[#FAF8F5]');
        o.classList.add('border-[#DDD4C4]', 'bg-white');
      });
      opt.classList.add('border-black', 'bg-[#FAF8F5]');
      opt.classList.remove('border-[#DDD4C4]', 'bg-white');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // PIN Code Auto-Detection via Indian Postal API
  const pincodeInput = document.getElementById('chk-pincode');
  const pincodeStatus = document.getElementById('chk-pincode-status');
  const cityInput = document.getElementById('chk-city');
  const districtInput = document.getElementById('chk-district');
  const stateInput = document.getElementById('chk-state');

  if (pincodeInput) {
    pincodeInput.addEventListener('input', async (e) => {
      const pin = e.target.value.trim();
      if (pin.length === 6 && /^[1-9][0-9]{5}$/.test(pin)) {
        try {
          if (pincodeStatus) {
            pincodeStatus.textContent = 'Detecting...';
            pincodeStatus.classList.remove('hidden');
          }

          const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await response.json();

          if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            const office = data[0].PostOffice[0];
            if (cityInput && !cityInput.value) cityInput.value = office.Division || office.Name;
            if (districtInput) districtInput.value = office.District;
            if (stateInput) stateInput.value = office.State;

            if (pincodeStatus) {
              pincodeStatus.textContent = '✓ Auto-Detected';
              pincodeStatus.classList.remove('text-rose-600');
              pincodeStatus.classList.add('text-emerald-600');
            }
          }
        } catch (err) {
          console.warn("Pincode API lookup warning:", err);
          if (pincodeStatus) {
            pincodeStatus.textContent = 'Manual entry';
          }
        }
      }
    });
  }

  // GPS "Use My Current Location" button
  const gpsBtn = document.getElementById('chk-gps-location-btn');
  if (gpsBtn) {
    gpsBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      gpsBtn.textContent = "📍 Detecting location...";

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const locData = await res.json();
            
            if (locData && locData.address) {
              const addr = locData.address;
              if (cityInput) cityInput.value = addr.city || addr.town || addr.village || '';
              if (districtInput) districtInput.value = addr.state_district || addr.county || '';
              if (stateInput) stateInput.value = addr.state || '';
              if (pincodeInput && addr.postcode) {
                pincodeInput.value = addr.postcode.replace(/\s/g, '').slice(0, 6);
                if (pincodeStatus) {
                  pincodeStatus.textContent = '✓ GPS Detected';
                  pincodeStatus.classList.remove('hidden');
                }
              }
              const houseInput = document.getElementById('chk-house');
              if (houseInput && !houseInput.value) {
                houseInput.value = [addr.house_number, addr.road, addr.suburb].filter(Boolean).join(', ');
              }
            }
            gpsBtn.textContent = "📍 Location Applied ✓";
          } catch (e) {
            console.warn("Reverse geocode failed:", e);
            gpsBtn.textContent = "📍 GPS Auto-Fill";
          }
        },
        (err) => {
          console.warn("GPS error:", err);
          gpsBtn.textContent = "📍 GPS Permission Denied";
        },
        { timeout: 10000 }
      );
    });
  }

  // Coupon Code Validation
  const couponInput = document.getElementById('chk-coupon-input');
  const applyCouponBtn = document.getElementById('chk-apply-coupon-btn');
  const couponMsg = document.getElementById('chk-coupon-msg');
  const discountRow = document.getElementById('chk-discount-row');

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim();
      const subtotal = store.getCartSubtotal();
      const res = store.validateCoupon(code, subtotal);

      if (couponMsg) {
        couponMsg.textContent = res.message;
        couponMsg.classList.remove('hidden');
        couponMsg.className = `text-[11px] font-semibold mt-1.5 ${res.valid ? 'text-emerald-700' : 'text-rose-600'}`;
      }

      if (res.valid) {
        appliedCoupon = res;
        // Refresh modal view to update total
        openCheckoutModal();
      }
    });
  }

  // Order Submission Form Handler
  const form = document.getElementById('checkout-order-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('checkout-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Saving Order & Securing Free Delivery...</span>`;
      }

      const name = document.getElementById('chk-name').value;
      const phone = document.getElementById('chk-phone').value;
      const email = document.getElementById('chk-email').value;
      const pincode = document.getElementById('chk-pincode').value;
      const house = document.getElementById('chk-house').value;
      const area = document.getElementById('chk-area').value;
      const city = document.getElementById('chk-city').value;
      const district = document.getElementById('chk-district').value;
      const state = document.getElementById('chk-state').value;
      const instructions = document.getElementById('chk-instructions').value;
      
      const selectedPayRadio = document.querySelector('input[name="payment_method"]:checked');
      const paymentMethod = selectedPayRadio ? selectedPayRadio.value : 'Online';

      try {
        // Submit order in Store & Supabase FIRST so it's never lost
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
          paymentMethod,
          paymentStatus: paymentMethod === 'Online' ? 'Payment Confirmed' : 'WhatsApp Verification',
          discount: appliedCoupon ? appliedCoupon.discount : 0
        });

        // Trigger celebratory confetti
        if (typeof window.confetti === 'function') {
          window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }

        // Close checkout modal
        closeCheckoutModal();
        store.showToast(`Order ${order.orderCode} Confirmed! Free Shipping Applied.`, 'success');

        // Always generate full WhatsApp prefilled message URL
        const waUrl = generateWhatsAppUrl(order);

        // Open WhatsApp directly
        window.open(waUrl, '_blank');

      } catch (err) {
        alert("Failed to place order: " + err.message);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Retry Order Confirmation</span>`;
        }
      }
    });
  }
}
