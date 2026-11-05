// PRINTORA Bulk & Corporate Order Enquiry System
// Section 6 & 21: Institutional and Wholesale Quotation Form

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { generateBulkWhatsAppUrl, BUSINESS_WHATSAPP_NUMBER } from '../services/whatsapp.js';

export function renderBulkOrderSection() {
  return `
    <section id="bulk-orders" class="py-16 md:py-24 bg-[#FAFAF7] border-t border-[#E5DFD4] relative font-sans">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span class="inline-block text-[#FF6B35] text-xs font-bold uppercase tracking-[0.25em] mb-2 font-heading">Institutional & Wholesale Supply</span>
          <h2 class="text-3xl md:text-5xl font-black font-heading tracking-tight text-[#111111]">Bulk & Corporate Merchandise</h2>
          <p class="text-[#666] text-xs md:text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            From university sports tournaments and college fests to corporate onboarding kits and tech startup merchandise. Factory-direct quotation with guaranteed Printora luxury finish.
          </p>
        </div>

        <!-- Target Sectors Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-12">
          ${[
            { title: "Colleges & Unis", icon: "shirt" },
            { title: "Sports Squads", icon: "sparkles" },
            { title: "Gyms & Fitness", icon: "truck" },
            { title: "Tech Startups", icon: "palette" },
            { title: "Corporate Kits", icon: "shieldCheck" },
            { title: "Festivals & Events", icon: "shoppingBag" },
          ].map(sect => `
            <div class="bg-white border border-[#DDD4C4] rounded-2xl p-4 text-center shadow-sm hover:border-black transition-colors">
              <div class="w-9 h-9 rounded-full bg-[#F0EAE1] text-[#FF6B35] flex items-center justify-center mx-auto mb-2">
                ${renderIcon(sect.icon, 'w-4 h-4')}
              </div>
              <h4 class="text-xs font-bold text-black font-heading">${sect.title}</h4>
            </div>
          `).join('')}
        </div>

        <!-- Two Column Layout: Enquiry Form + Perks/Direct WhatsApp Callout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <!-- Bulk Enquiry Form (Cols 1-7) -->
          <div class="lg:col-span-7 bg-white border border-[#DDD4C4] rounded-3xl p-6 md:p-10 shadow-xl">
            <h3 class="font-heading text-2xl font-bold text-black mb-1">Request a Bulk Quote</h3>
            <p class="text-xs text-[#777] mb-6">Receive a custom factory price breakdown and digital mockup within 2 business hours.</p>

            <form id="bulk-enquiry-form" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="bulk-name" class="block text-xs font-bold text-[#333] mb-1">Your Full Name *</label>
                  <input type="text" id="bulk-name" required placeholder="e.g. Anand Rao" 
                         class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none">
                </div>
                <div>
                  <label for="bulk-org" class="block text-xs font-bold text-[#333] mb-1">Organization / College / Company *</label>
                  <input type="text" id="bulk-org" required placeholder="e.g. Telangana University Sports Dept" 
                         class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none">
                </div>
                <div>
                  <label for="bulk-phone" class="block text-xs font-bold text-[#333] mb-1">WhatsApp Phone Number *</label>
                  <div class="flex">
                    <span class="inline-flex items-center px-3 text-xs font-bold text-[#666] bg-[#EFEAE0] border border-r-0 border-[#DDD4C4] rounded-l-xl">+91</span>
                    <input type="tel" id="bulk-phone" required pattern="[0-9]{10}" maxlength="10" placeholder="9848012345" 
                           class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-r-xl px-3.5 py-2.5 text-xs outline-none font-mono">
                  </div>
                </div>
                <div>
                  <label for="bulk-email" class="block text-xs font-bold text-[#333] mb-1">Official Email Address *</label>
                  <input type="email" id="bulk-email" required placeholder="anand@company.in" 
                         class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none">
                </div>
                <div>
                  <label for="bulk-category" class="block text-xs font-bold text-[#333] mb-1">Product Category *</label>
                  <select id="bulk-category" required class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none font-medium">
                    <option value="Custom Sublimation Team Jerseys">Sportswear — Custom Team Jerseys (₹499 base)</option>
                    <option value="Round Neck / Oversized Apparel">Apparel — Round Neck / Oversized T-shirts</option>
                    <option value="Hoodies & Sweatshirts">Apparel — Hoodies & Winterwear</option>
                    <option value="Ceramic Mugs & Steel Tumblers">Drinkware — Mugs & Insulated Bottles</option>
                    <option value="Corporate Diaries & Notebooks">Stationery — Executive Diaries & Notebooks</option>
                    <option value="Corporate Gift Sets & Identity Badges">Corporate — Welcome Kits & Transparent ID Badges</option>
                  </select>
                </div>
                <div>
                  <label for="bulk-quantity" class="block text-xs font-bold text-[#333] mb-1">Estimated Quantity (Pcs) *</label>
                  <input type="number" id="bulk-quantity" min="10" required placeholder="50" value="50" 
                         class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none font-mono font-bold">
                </div>
              </div>

              <div>
                <label for="bulk-details" class="block text-xs font-bold text-[#333] mb-1">Customization Requirements & Specifications *</label>
                <textarea id="bulk-details" rows="3" required placeholder="Describe your required logo placements, color preferences, individual names/numbers, or special fabric requests..." 
                          class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-xl p-3 text-xs outline-none resize-none"></textarea>
              </div>

              <div>
                <label for="bulk-date" class="block text-xs font-bold text-[#333] mb-1">Target Delivery Deadline (Optional)</label>
                <input type="date" id="bulk-date" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs outline-none">
              </div>

              <div class="pt-2">
                <button type="submit" id="bulk-submit-btn" class="w-full bg-[#111] hover:bg-[#FF6B35] text-white font-extrabold py-4 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 font-heading cursor-pointer">
                  <span>Submit Enquiry & Open WhatsApp Quotation</span>
                  ${renderIcon('arrowRight', 'w-4 h-4')}
                </button>
              </div>
            </form>
          </div>

          <!-- Right Callout & Perks (Cols 8-12) -->
          <div class="lg:col-span-5 space-y-6">
            
            <div class="bg-[#111111] text-white rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl border border-[#222]">
              <span class="text-[10px] text-[#FF6B35] uppercase tracking-[0.25em] font-bold font-heading">Factory Direct Partner</span>
              <h3 class="font-heading text-2xl font-bold tracking-tight">Why Partner with PRINTORA for Bulk Supply?</h3>
              
              <ul class="space-y-3.5 text-xs text-[#AAA]">
                <li class="flex items-start gap-2.5">
                  <span class="text-[#FF6B35] font-bold text-sm">✓</span>
                  <span><strong>Zero MOQ Penalty:</strong> Competitive slab-based wholesale volume pricing starting from 10 units up to 10,000+ units.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-[#FF6B35] font-bold text-sm">✓</span>
                  <span><strong>Complimentary Digital Proof:</strong> 3D visual mockups provided prior to bulk printing execution.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-[#FF6B35] font-bold text-sm">✓</span>
                  <span><strong>Individual Personalization:</strong> Unique player names, squad numbers, or department titles at no extra hidden surcharge.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-[#FF6B35] font-bold text-sm">✓</span>
                  <span><strong>Express Pan-India Logistics:</strong> Priority surface and air cargo dispatch across India.</span>
                </li>
              </ul>

              <!-- WhatsApp Quick Escalation -->
              <div class="pt-4 border-t border-[#262626]">
                <span class="text-[11px] text-[#888] block mb-2">Need an immediate quotation for an urgent tournament or launch?</span>
                <a href="https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello PRINTORA, I need an urgent quotation for bulk custom jerseys / merchandise.')}" 
                   target="_blank" rel="noopener noreferrer" 
                   class="w-full bg-[#25D366] hover:bg-[#20BE5B] text-black font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-heading">
                  ${renderIcon('whatsapp', 'w-4 h-4 text-black')}
                  <span>Direct WhatsApp B2B Desk</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}

export function initBulkOrderEvents() {
  const form = document.getElementById('bulk-enquiry-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('bulk-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Submitting Request...</span>`;
      }

      const enquiryData = {
        fullName: document.getElementById('bulk-name')?.value,
        organization: document.getElementById('bulk-org')?.value,
        phone: document.getElementById('bulk-phone')?.value,
        email: document.getElementById('bulk-email')?.value,
        category: document.getElementById('bulk-category')?.value,
        quantity: document.getElementById('bulk-quantity')?.value,
        details: document.getElementById('bulk-details')?.value,
        targetDate: document.getElementById('bulk-date')?.value
      };

      try {
        const savedEnquiry = await store.submitBulkEnquiry(enquiryData);
        store.showToast("Bulk enquiry submitted! Opening WhatsApp quotation...", "success");

        // Open WhatsApp with prefilled bulk message
        const waUrl = generateBulkWhatsAppUrl(savedEnquiry);
        window.open(waUrl, '_blank');

        form.reset();
      } catch (err) {
        alert("Enquiry failed: " + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Submit Enquiry & Open WhatsApp Quotation</span>`;
        }
      }
    });
  }
}
