// PRINTORA Professional Footer Component
// Section 4 & 24: Brand identity, Instagram @printora.gifts, WhatsApp +91 8106992102, Free Delivery notice, legal policies

import { renderIcon } from '../utils/icons.js';
import { CATEGORIES } from '../data/products.js';
import { BUSINESS_WHATSAPP_NUMBER } from '../services/whatsapp.js';

export function renderFooter() {
  return `
    <footer class="bg-[#111111] text-white pt-16 pb-12 border-t border-[#222222] font-sans">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Main Footer Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#222222]">
          
          <!-- Brand Column (Cols 1-4) -->
          <div class="lg:col-span-4 space-y-4">
            <div class="flex items-center gap-3">
              <img src="/assets/logo.png" alt="PRINTORA" class="h-12 w-auto object-contain rounded-xl bg-white p-1">
              <div class="flex flex-col">
                <span class="font-heading text-2xl font-black tracking-[0.15em] text-white">PRINTORA</span>
                <span class="text-[9px] tracking-[0.3em] text-[#FF6B35] uppercase font-bold font-heading">CUSTOMISED CLOTHING • WEAR YOUR STORY</span>
              </div>
            </div>
            
            <p class="text-xs text-[#AAAAAA] leading-relaxed max-w-sm">
              Printora is India's premium custom merchandise, personalized apparel, team jerseys and corporate gifting brand. High-definition vibrant prints, premium bio-washed cotton, and pro dry-fit fabrics delivered free across India.
            </p>

            <div class="text-xs text-[#CCC] space-y-1.5 pt-2">
              <div>📍 <strong>Domain:</strong> <a href="https://printoracustom.in" class="hover:underline text-[#FF6B35]">https://printoracustom.in</a></div>
              <div>💬 <strong>WhatsApp:</strong> +91 8106992102</div>
              <div>📸 <strong>Instagram:</strong> @printora.gifts</div>
              <div>✉️ <strong>Support:</strong> support@printoracustom.in</div>
              <div>🚚 <strong>Shipping:</strong> FREE SHIPPING ON ALL ORDERS ACROSS INDIA</div>
            </div>

            <!-- Social Media Buttons -->
            <div class="flex items-center space-x-3 pt-3">
              <a href="https://wa.me/${BUSINESS_WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" 
                 class="w-10 h-10 rounded-full bg-[#202020] border border-[#333] text-[#25D366] hover:bg-[#25D366] hover:text-black flex items-center justify-center transition-all shadow-sm" aria-label="Official WhatsApp">
                ${renderIcon('whatsapp', 'w-5 h-5')}
              </a>
              <a href="https://instagram.com/printora.gifts" target="_blank" rel="noopener noreferrer" 
                 class="w-10 h-10 rounded-full bg-[#202020] border border-[#333] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white flex items-center justify-center transition-all shadow-sm" aria-label="Official Instagram">
                ${renderIcon('instagram', 'w-5 h-5')}
              </a>
            </div>
          </div>

          <!-- Product Categories Column (Cols 5-7) -->
          <div class="lg:col-span-3 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-[0.25em] text-[#FF6B35] font-heading">Product Lines</h4>
            <ul class="text-xs space-y-2 text-[#AAAAAA]">
              ${CATEGORIES.map(cat => `
                <li>
                  <a href="#catalogue" class="hover:text-white transition-colors flex items-center justify-between group" onclick="window.filterCategory('${cat.slug}')">
                    <span class="group-hover:translate-x-1 transition-transform">${cat.name}</span>
                    <span class="text-[10px] text-[#666] font-mono">(${cat.itemCount})</span>
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Legal & Policies Column (Cols 8-10) -->
          <div class="lg:col-span-3 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-[0.25em] text-[#FF6B35] font-heading">Customer Care & Policies</h4>
            <ul class="text-xs space-y-2 text-[#AAAAAA]">
              <li><a href="#privacy-policy" data-policy="privacy" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" data-policy="terms" class="hover:text-white transition-colors">Terms and Conditions</a></li>
              <li><a href="#shipping-policy" data-policy="shipping" class="hover:text-white transition-colors">Shipping Policy (100% Free Shipping)</a></li>
              <li><a href="#refund-policy" data-policy="refund" class="hover:text-white transition-colors">Return and Refund Policy</a></li>
              <li><a href="#cancellation-policy" data-policy="cancellation" class="hover:text-white transition-colors">Cancellation Policy</a></li>
              <li><a href="#customization-policy" data-policy="customization" class="hover:text-white transition-colors">Customization Terms</a></li>
              <li><a href="#faq" data-policy="faq" class="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          <!-- Quick Navigation Links (Cols 11-12) -->
          <div class="lg:col-span-2 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-[0.25em] text-[#FF6B35] font-heading">Navigation</h4>
            <ul class="text-xs space-y-2 text-[#AAAAAA]">
              <li><a href="#catalogue" class="hover:text-white transition-colors">Shop All Products</a></li>
              <li><a href="#custom-jersey" class="hover:text-white transition-colors">Custom Jerseys (₹499)</a></li>
              <li><a href="#bulk-orders" class="hover:text-white transition-colors">Corporate Gifting</a></li>
            </ul>
          </div>

        </div>

        <!-- Bottom Copyright Strip -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777] gap-4">
          <p><a href="#admin" class="hover:text-[#999] transition-colors cursor-default" title="">©</a> 2026 PRINTORA (printoracustom.in). All rights reserved. Registered Indian Trademark.</p>
          <div class="flex items-center gap-4 text-[11px] font-medium">
            <span class="text-emerald-400 font-bold">✓ FREE Pan-India Shipping</span>
            <span>•</span>
            <span>Zero Delivery Charges</span>
            <span>•</span>
            <span>WhatsApp Verified</span>
          </div>
        </div>

      </div>
    </footer>

    <!-- Floating WhatsApp Instant Concierge Button -->
    <a href="https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello PRINTORA, I want to inquire about custom merchandise and orders.')}" 
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
