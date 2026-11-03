// PRINTORA Professional Footer Component
import { renderIcon } from '../utils/icons.js';
import { CATEGORIES } from '../data/products.js';
import { BUSINESS_WHATSAPP_NUMBER } from '../services/whatsapp.js';

export function renderFooter() {
  return `
    <footer class="bg-[#0A0A0A] text-white pt-16 pb-12 border-t border-[#1C1C1C]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Main Footer Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1C1C1C]">
          
          <!-- Brand Column (Cols 1-4) -->
          <div class="lg:col-span-4 space-y-4">
            <div class="flex flex-col">
              <span class="brand-title text-2xl font-bold tracking-[0.2em] text-white">PRINTORA</span>
              <span class="text-[9px] tracking-[0.35em] text-[#C5A880] uppercase font-semibold">MAKE IT YOURS.</span>
            </div>
            
            <p class="text-xs text-[#888884] leading-relaxed max-w-sm">
              Printora is a personalized printing, customized gifts, apparel and corporate merchandise brand based in Nizamabad, Telangana. Delivering bespoke craftsmanship with direct factory partnerships across India.
            </p>

            <div class="text-xs text-[#AAA] space-y-1.5 pt-2">
              <div>📍 <strong>HQ:</strong> Nizamabad, Telangana 503001, India</div>
              <div>💬 <strong>WhatsApp:</strong> +91 8106992102</div>
              <div>✉️ <strong>Email:</strong> support@printoracustom.in</div>
            </div>

            <!-- Social Media Buttons -->
            <div class="flex items-center space-x-3 pt-3">
              <a href="https://wa.me/${BUSINESS_WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" 
                 class="w-9 h-9 rounded-full bg-[#181818] border border-[#2B2B2B] text-[#C5A880] hover:bg-[#25D366] hover:text-black hover:border-transparent flex items-center justify-center transition-all shadow-sm" aria-label="Official WhatsApp">
                ${renderIcon('whatsapp', 'w-4 h-4')}
              </a>
              <a href="https://instagram.com/printoracustom.in" target="_blank" rel="noopener noreferrer" 
                 class="w-9 h-9 rounded-full bg-[#181818] border border-[#2B2B2B] text-[#C5A880] hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-500 hover:text-white hover:border-transparent flex items-center justify-center transition-all shadow-sm" aria-label="Official Instagram">
                ${renderIcon('instagram', 'w-4 h-4')}
              </a>
            </div>
          </div>

          <!-- Product Categories Column (Cols 5-7) -->
          <div class="lg:col-span-3 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A880]">Product Catalogue</h4>
            <ul class="text-xs space-y-2 text-[#888884]">
              ${CATEGORIES.map(cat => `
                <li>
                  <a href="#catalogue" class="hover:text-white transition-colors flex items-center justify-between group" onclick="window.filterCategory('${cat.slug}')">
                    <span class="group-hover:translate-x-1 transition-transform">${cat.name}</span>
                    <span class="text-[10px] text-[#555] font-mono">(${cat.itemCount})</span>
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Legal & Policies Column (Cols 8-10) -->
          <div class="lg:col-span-3 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A880]">Legal & Policies</h4>
            <ul class="text-xs space-y-2 text-[#888884]">
              <li><a href="#privacy-policy" data-policy="privacy" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" data-policy="terms" class="hover:text-white transition-colors">Terms and Conditions</a></li>
              <li><a href="#shipping-policy" data-policy="shipping" class="hover:text-white transition-colors">Shipping & Delivery Policy</a></li>
              <li><a href="#refund-policy" data-policy="refund" class="hover:text-white transition-colors">Return and Refund Policy</a></li>
              <li><a href="#cancellation-policy" data-policy="cancellation" class="hover:text-white transition-colors">Cancellation Policy</a></li>
              <li><a href="#customization-policy" data-policy="customization" class="hover:text-white transition-colors">Customization Policy</a></li>
              <li><a href="#faq" data-policy="faq" class="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          <!-- Quick Institutional Links (Cols 11-12) -->
          <div class="lg:col-span-2 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A880]">Company</h4>
            <ul class="text-xs space-y-2 text-[#888884]">
              <li><a href="#about-us" data-policy="about" class="hover:text-white transition-colors">About Printora</a></li>
              <li><a href="#contact-us" data-policy="contact" class="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#bulk-orders" class="hover:text-white transition-colors">Institutional Orders</a></li>
              <li><a href="#custom-jersey" class="hover:text-white transition-colors">Custom Jersey Studio</a></li>
              <li><a href="#admin" class="hover:text-[#C5A880] transition-colors font-mono">Admin Portal</a></li>
            </ul>
          </div>

        </div>

        <!-- Bottom Copyright Strip -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#666663] gap-4">
          <p>© 2026 PRINTORA (printoracustom.in). All rights reserved. Registered in Nizamabad, Telangana.</p>
          <div class="flex items-center gap-4 text-[11px]">
            <span>100% Cotton Bio-Washed</span>
            <span>•</span>
            <span>Dry-Fit Sublimation</span>
            <span>•</span>
            <span>Pan-India Logistics</span>
          </div>
        </div>

      </div>
    </footer>

    <!-- Floating WhatsApp Instant Concierge Button (Requirement 14) -->
    <a href="https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello PRINTORA, I would like to enquire about personalizing a product.')}" 
       target="_blank" rel="noopener noreferrer" 
       class="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20BE5B] text-black p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group" 
       title="Chat with PRINTORA on WhatsApp" aria-label="Chat with PRINTORA on WhatsApp">
      ${renderIcon('whatsapp', 'w-6 h-6 text-black')}
      <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-xs text-black pl-0 group-hover:pl-2">
        Chat with Us
      </span>
    </a>
  `;
}
