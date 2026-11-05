// PRINTORA Customer Checkout & WhatsApp Notification System
// Complies with Requirements 7, 8, 14, 15

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { generateWhatsAppUrl, BUSINESS_WHATSAPP_NUMBER } from '../services/whatsapp.js';

export function renderCheckoutModal() {
  const cart = store.cart;
  const subtotal = store.getCartSubtotal();
  const shippingCharge = store.getShippingCharge();
  const total = store.getCartTotal();

  return `
    <div id="checkout-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div class="relative w-full max-w-3xl bg-[#FAFAF7] border border-[#DDD4C4] rounded-2xl shadow-2xl overflow-hidden my-8 animate-fade-in text-[#111]">
        
        <!-- Modal Header -->
        <div class="bg-[#111111] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-[#C5A880] uppercase tracking-[0.25em] font-semibold">Printora Secure Checkout</span>
            <h3 class="font-serif text-2xl font-medium tracking-tight">Complete Your Order</h3>
          </div>
          <button id="checkout-close-btn" class="text-[#AAA] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors" aria-label="Close Checkout">
            ${renderIcon('close', 'w-5 h-5')}
          </button>
        </div>

        <!-- Checkout Form Body -->
        <form id="checkout-order-form" class="p-6 md:p-8 space-y-6">
          
          <!-- Order Summary Collapsible -->
          <div class="bg-[#F0EAE1] border border-[#DDD4C4] rounded-xl p-4">
            <div class="flex items-center justify-between font-medium text-xs text-[#555] uppercase tracking-wider mb-2">
              <span>Order Summary (${store.getCartCount()} items)</span>
              <span class="font-mono text-black font-bold">Total: ₹${total}</span>
            </div>
            <div class="space-y-1.5 text-xs text-[#444] max-h-36 overflow-y-auto pr-1">
              ${cart.map(item => `
                <div class="flex justify-between items-center py-1 border-b border-[#E5DFD4] last:border-0">
                  <span class="truncate pr-2">
                    <strong>${item.name}</strong> 
                    (${item.selectedSize}${item.selectedColor ? ` / ${item.selectedColor}` : ''})
                    ${item.customName ? ` • Name: <span class="uppercase">${item.customName}</span>` : ''}
                    ${item.customNumber ? ` • #${item.customNumber}` : ''}
                    x${item.quantity}
                  </span>
                  <span class="font-mono font-semibold text-black flex-shrink-0">₹${item.price * item.quantity}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section 1: Customer Contact Information -->
          <div>
            <h4 class="text-xs uppercase tracking-widest text-[#787673] font-bold mb-3 flex items-center gap-1.5">
              ${renderIcon('user', 'w-3.5 h-3.5 text-[#C5A880]')} 1. Contact Details
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="chk-name" class="block text-xs font-semibold text-[#333] mb-1.5">Full Name *</label>
                <input type="text" id="chk-name" required placeholder="e.g. Rahul Varma" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors">
              </div>
              <div>
                <label for="chk-phone" class="block text-xs font-semibold text-[#333] mb-1.5">WhatsApp / Mobile Number *</label>
                <div class="flex">
                  <span class="inline-flex items-center px-3 text-xs font-semibold text-[#666] bg-[#EFEAE0] border border-r-0 border-[#DDD4C4] rounded-l-lg">+91</span>
                  <input type="tel" id="chk-phone" required pattern="[0-9]{10}" maxlength="10" placeholder="9876543210" 
                         class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-r-lg px-3.5 py-2.5 text-sm outline-none transition-colors">
                </div>
              </div>
              <div class="sm:col-span-2">
                <label for="chk-email" class="block text-xs font-semibold text-[#333] mb-1.5">Email Address (Optional, for digital receipt)</label>
                <input type="email" id="chk-email" placeholder="rahul@example.com" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors">
              </div>
            </div>
          </div>

          <!-- Section 2: Complete Delivery Address -->
          <div>
            <h4 class="text-xs uppercase tracking-widest text-[#787673] font-bold mb-3 flex items-center gap-1.5">
              ${renderIcon('truck', 'w-3.5 h-3.5 text-[#C5A880]')} 2. Delivery Address (Pan-India)
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label for="chk-house" class="block text-xs font-semibold text-[#333] mb-1.5">House / Flat / Street Address *</label>
                <input type="text" id="chk-house" required placeholder="Flat 402, Royal Residency, Subhash Road" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors">
              </div>
              <div>
                <label for="chk-area" class="block text-xs font-semibold text-[#333] mb-1.5">Area / Landmark / Locality *</label>
                <input type="text" id="chk-area" required placeholder="Near Shivaji Chowk" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors">
              </div>
              <div>
                <label for="chk-city" class="block text-xs font-semibold text-[#333] mb-1.5">City *</label>
                <input type="text" id="chk-city" required value="Nizamabad" placeholder="Nizamabad / Hyderabad / Mumbai" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors">
              </div>
              <div>
                <label for="chk-state" class="block text-xs font-semibold text-[#333] mb-1.5">State *</label>
                <select id="chk-state" required class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors">
                  <option value="Telangana" selected>Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Other">Other Indian State</option>
                </select>
              </div>
              <div>
                <label for="chk-pincode" class="block text-xs font-semibold text-[#333] mb-1.5">Postal PIN Code *</label>
                <input type="text" id="chk-pincode" required pattern="[0-9]{6}" maxlength="6" placeholder="503001" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors">
              </div>
            </div>
          </div>

          <!-- Section 3: Special Delivery & Packaging Instructions -->
          <div>
            <label for="chk-instructions" class="block text-xs font-semibold text-[#333] mb-1.5">Special Instructions or Gift Notes (Optional)</label>
            <textarea id="chk-instructions" rows="2" placeholder="e.g. Please deliver before weekend. Handle delicate mugs with extra bubble wrap." 
                      class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg p-3 text-sm outline-none transition-colors resize-none"></textarea>
          </div>

          <!-- Section 4: Billing Breakdown & Payment Method Notice -->
          <div class="bg-white border border-[#DDD4C4] rounded-xl p-4 space-y-2">
            <div class="flex justify-between text-xs text-[#666]">
              <span>Items Subtotal:</span>
              <span class="font-mono font-semibold text-black">₹${subtotal}</span>
            </div>
            <div class="flex justify-between text-xs text-[#666]">
              <span>Pan-India Shipping Fee:</span>
              <span class="font-mono font-semibold ${shippingCharge === 0 ? 'text-emerald-700' : 'text-black'}">
                ${shippingCharge === 0 ? 'FREE (Orders over ₹999)' : `₹${shippingCharge}`}
              </span>
            </div>
            <div class="flex justify-between text-base font-bold text-black pt-2 border-t border-[#DDD4C4]">
              <span>Order Amount Due:</span>
              <span class="font-mono text-lg text-black">₹${total}</span>
            </div>

          <!-- Section 4: Payment Method Selection -->
          <div class="bg-white border border-[#DDD4C4] rounded-xl p-4 space-y-3">
            <span class="text-xs uppercase tracking-widest text-[#787673] font-bold block">
              3. Choose Payment Method
            </span>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="chk-payment-methods">
              <label class="cursor-pointer border-2 border-black bg-[#FAF7F2] p-3.5 rounded-xl flex items-start gap-3 transition-all chk-pay-option" data-method="razorpay">
                <input type="radio" name="payment_method" value="razorpay" checked class="mt-1 text-black">
                <div>
                  <strong class="text-xs font-bold text-black flex items-center gap-1.5">
                    💳 Pay Online (UPI / GPay / Card)
                  </strong>
                  <p class="text-[11px] text-[#666] mt-0.5 leading-snug">Instant confirmation via Razorpay. Accepts PhonePe, Google Pay, Paytm, Cards & NetBanking.</p>
                </div>
              </label>

              <label class="cursor-pointer border-2 border-[#DDD4C4] hover:border-black bg-white p-3.5 rounded-xl flex items-start gap-3 transition-all chk-pay-option" data-method="whatsapp">
                <input type="radio" name="payment_method" value="whatsapp" class="mt-1 text-black">
                <div>
                  <strong class="text-xs font-bold text-black flex items-center gap-1.5">
                    💬 Verify & Pay on WhatsApp
                  </strong>
                  <p class="text-[11px] text-[#666] mt-0.5 leading-snug">Review digital proof with our team (+91 8106992102) and pay via UPI QR code upon approval.</p>
                </div>
              </label>
            </div>

            <!-- Total Price Summary -->
            <div class="pt-2 border-t border-[#EFECE4] space-y-1">
              <div class="flex justify-between text-xs text-[#666]">
                <span>Items Subtotal:</span>
                <span class="font-mono font-semibold text-black">₹${subtotal}</span>
              </div>
              <div class="flex justify-between text-xs text-[#666]">
                <span>Pan-India Shipping:</span>
                <span class="font-mono font-semibold ${shippingCharge === 0 ? 'text-emerald-700' : 'text-black'}">
                  ${shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                </span>
              </div>
              <div class="flex justify-between text-base font-bold text-black pt-1">
                <span>Final Amount Due:</span>
                <span class="font-mono text-lg text-black">₹${total}</span>
              </div>
            </div>
          </div>

          <!-- Submission Action Buttons -->
          <div class="space-y-3 pt-2">
            <button type="submit" id="checkout-submit-btn" class="w-full bg-[#111111] hover:bg-[#C5A880] text-white hover:text-black font-extrabold py-4 px-6 rounded-xl text-sm tracking-wider uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer">
              <span id="chk-btn-icon">${renderIcon('shieldCheck', 'w-5 h-5')}</span>
              <span id="chk-btn-text">Pay Now via UPI / Cards (₹${total})</span>
            </button>
            <p class="text-[11px] text-center text-[#787673]">
              🔒 256-bit encrypted secure checkout • Official PRINTORA verification
            </p>
          </div>

        </form>

      </div>
    </div>

    <!-- Order Success Modal (Shown after submission) -->
    <div id="order-success-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="relative w-full max-w-lg bg-white rounded-2xl p-6 md:p-8 text-center shadow-2xl border border-[#DDD4C4] animate-fade-in">
        
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          ${renderIcon('check', 'w-8 h-8')}
        </div>

        <span class="text-xs uppercase tracking-widest text-[#C5A880] font-bold">Order Confirmed</span>
        <h3 class="font-serif text-3xl font-medium text-black mt-1">Thank You!</h3>
        <p class="text-xs text-[#666] mt-1" id="success-order-code-text">Order ID: PRN-20261104-XXXX</p>

        <div class="my-6 p-4 bg-[#F7F4EE] rounded-xl text-left text-xs space-y-2 border border-[#E5E0D5]">
          <div class="flex justify-between">
            <span class="text-[#666]">Customer Name:</span>
            <span id="success-cust-name" class="font-semibold text-black"></span>
          </div>
          <div class="flex justify-between">
            <span class="text-[#666]">Phone:</span>
            <span id="success-cust-phone" class="font-semibold text-black font-mono"></span>
          </div>
          <div class="flex justify-between">
            <span class="text-[#666]">Delivery City:</span>
            <span id="success-cust-city" class="font-semibold text-black"></span>
          </div>
          <div class="flex justify-between font-bold text-sm text-black pt-2 border-t border-[#DDD4C4]">
            <span>Total Payable:</span>
            <span id="success-cust-total" class="font-mono"></span>
          </div>
        </div>

        <p class="text-xs text-[#555] mb-6 leading-relaxed">
          Your order has been recorded in the PRINTORA system. Please click below to send the prefilled order summary to our official business WhatsApp (+91 8106992102) to finalize printing.
        </p>

        <div class="space-y-3">
          <a id="success-whatsapp-send-btn" href="#" target="_blank" rel="noopener noreferrer" 
             class="w-full bg-[#25D366] hover:bg-[#20BE5B] text-black font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2">
            ${renderIcon('whatsapp', 'w-4 h-4')}
            <span>Send Order via WhatsApp Now</span>
          </a>
          <button type="button" id="success-modal-close-btn" class="w-full bg-[#EFEAE0] hover:bg-[#DDD4C4] text-black font-semibold py-3 px-6 rounded-xl text-xs transition-colors">
            Return to Store
          </button>
        </div>

      </div>
    </div>
  `;
}

export function initCheckoutModalEvents() {
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('checkout-close-btn');
  const form = document.getElementById('checkout-order-form');
  const successModal = document.getElementById('order-success-modal');
  const successCloseBtn = document.getElementById('success-modal-close-btn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (successCloseBtn && successModal) {
    successCloseBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      window.location.hash = '#catalogue';
    });
  }

  // Payment method selection toggle
  const payOptions = document.querySelectorAll('.chk-pay-option');
  const submitBtn = document.getElementById('checkout-submit-btn');
  const btnIcon = document.getElementById('chk-btn-icon');
  const btnText = document.getElementById('chk-btn-text');

  payOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      payOptions.forEach(o => {
        o.classList.remove('border-black', 'bg-[#FAF7F2]');
        o.classList.add('border-[#DDD4C4]', 'bg-white');
      });
      opt.classList.remove('border-[#DDD4C4]', 'bg-white');
      opt.classList.add('border-black', 'bg-[#FAF7F2]');

      const method = opt.getAttribute('data-method');
      const total = store.getCartTotal();

      if (method === 'razorpay') {
        if (submitBtn) submitBtn.className = "w-full bg-[#111111] hover:bg-[#C5A880] text-white hover:text-black font-extrabold py-4 px-6 rounded-xl text-sm tracking-wider uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer";
        if (btnIcon) btnIcon.innerHTML = renderIcon('shieldCheck', 'w-5 h-5');
        if (btnText) btnText.textContent = `Pay Now via UPI / Cards (₹${total})`;
      } else {
        if (submitBtn) submitBtn.className = "w-full bg-[#25D366] hover:bg-[#20BE5B] text-black font-extrabold py-4 px-6 rounded-xl text-sm tracking-wider uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer";
        if (btnIcon) btnIcon.innerHTML = renderIcon('whatsapp', 'w-5 h-5 text-black');
        if (btnText) btnText.textContent = `Place Order & Send via WhatsApp (₹${total})`;
      }
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('chk-name')?.value;
      const phone = document.getElementById('chk-phone')?.value;
      const email = document.getElementById('chk-email')?.value;
      const house = document.getElementById('chk-house')?.value;
      const area = document.getElementById('chk-area')?.value;
      const city = document.getElementById('chk-city')?.value;
      const state = document.getElementById('chk-state')?.value;
      const pincode = document.getElementById('chk-pincode')?.value;
      const instructions = document.getElementById('chk-instructions')?.value;
      const chosenMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'razorpay';

      try {
        const order = await store.submitOrder({
          name,
          phone,
          email,
          house,
          area,
          city,
          state,
          pincode,
          specialInstructions: instructions
        });

        // If Razorpay chosen and Razorpay SDK + Key available
        const razorpayKey = store.settings.razorpayKeyId;
        if (chosenMethod === 'razorpay' && window.Razorpay && razorpayKey) {
          const rzpOptions = {
            key: razorpayKey,
            amount: Math.round(order.totalAmount * 100), // in paise
            currency: "INR",
            name: "PRINTORA",
            description: `Custom Order #${order.orderCode}`,
            image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
            prefill: {
              name: order.customerName,
              email: order.customerEmail || "",
              contact: `+91${order.customerPhone}`
            },
            theme: {
              color: "#0A0A0A"
            },
            handler: function (response) {
              // Payment Successful
              order.status = "Confirmed";
              order.paymentId = response.razorpay_payment_id;
              order.internalNotes = `Paid online via Razorpay (Payment ID: ${response.razorpay_payment_id})`;
              store.saveOrders();

              if (typeof window.confetti === 'function') {
                window.confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
              }

              showOrderSuccess(order, response.razorpay_payment_id);
            },
            modal: {
              ondismiss: function () {
                // Customer cancelled or closed payment popup -> fallback to WhatsApp order
                showOrderSuccess(order);
              }
            }
          };

          const rzp = new window.Razorpay(rzpOptions);
          rzp.open();
          if (modal) modal.classList.add('hidden');
          return;
        }

        // WhatsApp direct flow or fallback
        if (modal) modal.classList.add('hidden');
        showOrderSuccess(order);

      } catch (err) {
        alert(err.message);
      }
    });
  }

  function showOrderSuccess(order, paymentId = null) {
    const waUrl = generateWhatsAppUrl(order);
    const codeEl = document.getElementById('success-order-code-text');
    const nameEl = document.getElementById('success-cust-name');
    const phoneEl = document.getElementById('success-cust-phone');
    const cityEl = document.getElementById('success-cust-city');
    const totalEl = document.getElementById('success-cust-total');
    const waBtn = document.getElementById('success-whatsapp-send-btn');

    if (codeEl) codeEl.textContent = `Order ID: ${order.orderCode}${paymentId ? ` • Paid: ${paymentId}` : ''}`;
    if (nameEl) nameEl.textContent = order.customerName;
    if (phoneEl) phoneEl.textContent = `+91 ${order.customerPhone}`;
    if (cityEl) cityEl.textContent = `${order.shippingCity}, ${order.shippingState}`;
    if (totalEl) totalEl.textContent = `₹${order.totalAmount}${paymentId ? ' (PAID ONLINE)' : ''}`;
    if (waBtn) waBtn.href = waUrl;

    if (paymentId) {
      alert(`🎉 Payment Successful! Razorpay ID: ${paymentId}\nYour order has been confirmed.`);
    }

    // Automatically open WhatsApp with pre-filled details
    window.open(waUrl, '_blank');

    // Show confirmation modal
    if (successModal) successModal.classList.remove('hidden');
  }
}
