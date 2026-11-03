// PRINTORA Bulk & Corporate Order Enquiry System (Requirement 11)
import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { generateBulkWhatsAppUrl, BUSINESS_WHATSAPP_NUMBER } from '../services/whatsapp.js';

export function renderBulkOrderSection() {
  return `
    <section id="bulk-orders" class="py-16 md:py-24 bg-[#F7F4EE] border-t border-[#E5DFD4] relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span class="inline-block text-[#997A52] text-xs font-semibold uppercase tracking-[0.3em] mb-2">Institutional & Wholesale Supply</span>
          <h2 class="text-3xl md:text-5xl font-normal font-serif tracking-tight text-[#111]">Bulk & Corporate Merchandise</h2>
          <p class="text-[#666] text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            From university sports contingents and college fest merchandise to corporate onboarding welcome kits and startup team apparel. Direct factory pricing with guaranteed Printora finish.
          </p>
        </div>

        <!-- Target Sectors Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-12">
          ${[
            { title: "Colleges & Unis", icon: "shirt" },
            { title: "Sports Teams", icon: "sparkles" },
            { title: "Gyms & Fitness", icon: "truck" },
            { title: "Tech Startups", icon: "palette" },
            { title: "Corporate Kits", icon: "shieldCheck" },
            { title: "Festivals & Events", icon: "shoppingBag" },
          ].map(sect => `
            <div class="bg-white border border-[#DDD4C4] rounded-xl p-3.5 text-center shadow-soft hover:border-[#C5A880] transition-colors">
              <div class="w-8 h-8 rounded-full bg-[#F0EAE1] text-[#997A52] flex items-center justify-center mx-auto mb-2">
                ${renderIcon(sect.icon, 'w-4 h-4')}
              </div>
              <h4 class="text-xs font-semibold text-black">${sect.title}</h4>
            </div>
          `).join('')}
        </div>

        <!-- Two Column Layout: Enquiry Form + Perks/Direct WhatsApp Callout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <!-- Bulk Enquiry Form (Cols 1-7) -->
          <div class="lg:col-span-7 bg-white border border-[#DDD4C4] rounded-2xl p-6 md:p-10 shadow-premium">
            <h3 class="font-serif text-2xl font-medium text-black mb-1">Request a Bulk Quote</h3>
            <p class="text-xs text-[#787673] mb-6">Receive a custom factory price breakdown and digital 3D mockup within 2 business hours.</p>

            <form id="bulk-enquiry-form" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="bulk-name" class="block text-xs font-semibold text-[#333] mb-1">Your Full Name *</label>
                  <input type="text" id="bulk-name" required placeholder="e.g. Anand Rao" 
                         class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-xs outline-none">
                </div>
                <div>
                  <label for="bulk-org" class="block text-xs font-semibold text-[#333] mb-1">Organization / College / Company *</label>
                  <input type="text" id="bulk-org" required placeholder="e.g. Telangana University Sports Dept" 
                         class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-xs outline-none">
                </div>
                <div>
                  <label for="bulk-phone" class="block text-xs font-semibold text-[#333] mb-1">WhatsApp Phone Number *</label>
                  <div class="flex">
                    <span class="inline-flex items-center px-2.5 text-xs font-semibold text-[#666] bg-[#EFEAE0] border border-r-0 border-[#DDD4C4] rounded-l-lg">+91</span>
                    <input type="tel" id="bulk-phone" required pattern="[0-9]{10}" maxlength="10" placeholder="9848012345" 
                           class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-r-lg px-3.5 py-2.5 text-xs outline-none">
                  </div>
                </div>
                <div>
                  <label for="bulk-email" class="block text-xs font-semibold text-[#333] mb-1">Official Email Address *</label>
                  <input type="email" id="bulk-email" required placeholder="anand@company.in" 
                         class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-xs outline-none">
                </div>
                <div>
                  <label for="bulk-category" class="block text-xs font-semibold text-[#333] mb-1">Product Category *</label>
                  <select id="bulk-category" required class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-xs outline-none">
                    <option value="Custom Sublimation Team Jerseys">Sportswear — Custom Team Jerseys</option>
                    <option value="Round Neck / Oversized Apparel">Apparel — Round Neck / Oversized T-shirts</option>
                    <option value="Hoodies & Sweatshirts">Apparel — Hoodies & Winterwear</option>
                    <option value="Ceramic Mugs & Steel Tumblers">Drinkware — Mugs & Insulated Bottles</option>
                    <option value="Corporate Diaries & Notebooks">Stationery — Executive Diaries & Notebooks</option>
                    <option value="Corporate Gift Sets & Identity Badges">Corporate — Welcome Kits & Transparent ID Badges</option>
                    <option value="Canvas Bags & Tech Sleeves">Bags & Tech Accessories</option>
                  </select>
                </div>
                <div>
                  <label for="bulk-qty" class="block text-xs font-semibold text-[#333] mb-1">Estimated Quantity (Units) *</label>
                  <input type="number" id="bulk-qty" required min="10" max="50000" value="50" 
                         class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-xs outline-none font-mono">
                </div>
              </div>

              <div>
                <label for="bulk-target-date" class="block text-xs font-semibold text-[#333] mb-1">Target Delivery Date (Optional)</label>
                <input type="date" id="bulk-target-date" 
                       class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-xs outline-none">
              </div>

              <div>
                <label for="bulk-details" class="block text-xs font-semibold text-[#333] mb-1">Customization & Printing Details *</label>
                <textarea id="bulk-details" required rows="3" placeholder="Describe your required colors, logo placement (left chest, back), individual names/numbers if any, and material preference." 
                          class="w-full bg-[#FAFAF7] border border-[#DDD4C4] focus:border-black rounded-lg p-3 text-xs outline-none resize-none"></textarea>
              </div>

              <!-- Logo Upload Placeholder -->
              <div>
                <label class="block text-xs font-semibold text-[#333] mb-1">Upload Organization Logo / Artwork (Optional)</label>
                <div class="border border-dashed border-[#DDD4C4] hover:border-black rounded-lg p-3 text-center cursor-pointer transition-colors relative bg-[#FAFAF7]">
                  <input type="file" id="bulk-logo-upload" accept="image/*,.pdf,.ai,.svg" class="absolute inset-0 opacity-0 cursor-pointer">
                  <span id="bulk-logo-text" class="text-xs text-[#787673] flex items-center justify-center gap-1.5">
                    ${renderIcon('upload', 'w-3.5 h-3.5 text-[#C5A880]')} Click to upload vector AI / PDF / PNG artwork
                  </span>
                </div>
              </div>

              <button type="submit" class="w-full bg-[#111111] hover:bg-[#C5A880] text-white hover:text-black font-bold py-3.5 px-6 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2">
                <span>Submit Bulk Request & Get Quotation</span>
                ${renderIcon('arrowRight', 'w-4 h-4')}
              </button>

            </form>
          </div>

          <!-- Direct WhatsApp Fast-Track Callout (Cols 8-12) -->
          <div class="lg:col-span-5 space-y-6">
            
            <div class="bg-[#111111] text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-44 h-44 bg-[#C5A880]/15 rounded-full blur-2xl pointer-events-none"></div>
              
              <span class="text-[10px] text-[#C5A880] uppercase tracking-[0.25em] font-semibold">Priority Fast-Track</span>
              <h3 class="font-serif text-2xl font-normal mt-1 mb-3">Need an Urgent Quotation for an Upcoming Event?</h3>
              <p class="text-xs text-[#AAA] leading-relaxed mb-6">
                Connect directly with our dedicated B2B production lead on WhatsApp. Send sample photos, discuss custom GSM knits, and lock your delivery slot.
              </p>

              <a href="https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello PRINTORA, I would like to request an urgent quotation for a bulk / institutional order.')}" 
                 target="_blank" rel="noopener noreferrer" 
                 class="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BE5B] text-black font-bold px-5 py-3 rounded-lg text-xs uppercase tracking-wider transition-all shadow-md">
                ${renderIcon('whatsapp', 'w-4 h-4 text-black')}
                <span>Chat on WhatsApp (+91 8106992102)</span>
              </a>
            </div>

            <!-- Wholesale Guarantees Card -->
            <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-soft space-y-4">
              <h4 class="text-xs uppercase tracking-wider text-[#997A52] font-bold">Why Organizations Choose PRINTORA</h4>
              <ul class="text-xs text-[#555] space-y-3">
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-700 font-bold">✓</span>
                  <span><strong>Zero Sublimation Peeling:</strong> Non-fading heat-transfer and direct sublimation on athletic dry-fit knits.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-700 font-bold">✓</span>
                  <span><strong>Free Digital Proofing:</strong> 3D digital visualization approved before commencement of production.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-700 font-bold">✓</span>
                  <span><strong>Pan-India Express Dispatch:</strong> Coordinated tracking to Nizamabad, Hyderabad, Bangalore and Pan-India.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-700 font-bold">✓</span>
                  <span><strong>GST Invoicing:</strong> Official GST compliant billing provided for college committees and corporate tax records.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}

export function initBulkOrderEvents() {
  const form = document.getElementById('bulk-enquiry-form');
  const logoInput = document.getElementById('bulk-logo-upload');
  const logoText = document.getElementById('bulk-logo-text');

  if (logoInput && logoText) {
    logoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        logoText.textContent = `✓ Uploaded: ${e.target.files[0].name}`;
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('bulk-name')?.value;
      const organization = document.getElementById('bulk-org')?.value;
      const phone = document.getElementById('bulk-phone')?.value;
      const email = document.getElementById('bulk-email')?.value;
      const category = document.getElementById('bulk-category')?.value;
      const quantity = document.getElementById('bulk-qty')?.value;
      const targetDate = document.getElementById('bulk-target-date')?.value;
      const details = document.getElementById('bulk-details')?.value;

      try {
        const enquiry = await store.submitBulkEnquiry({
          fullName,
          organization,
          phone,
          email,
          category,
          quantity,
          targetDate,
          details
        });

        // Generate WhatsApp url
        const waUrl = generateBulkWhatsAppUrl(enquiry);
        window.open(waUrl, '_blank');

        alert(`Thank you ${fullName}! Your bulk enquiry for ${quantity} units of ${category} has been received. Opening WhatsApp to share your request with our production desk.`);
        form.reset();
      } catch (err) {
        alert(err.message);
      }
    });
  }
}
