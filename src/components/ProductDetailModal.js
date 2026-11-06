// PRINTORA Product Detail Modal with Clothing Customization, Customer Artwork Upload, 360° 3D Preview Link, PIN Checker & Reviews
// Complete clothing customization & customer artwork upload pipeline

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { generateWhatsAppUrl } from '../services/whatsapp.js';
import { openCheckoutModal } from './CheckoutModal.js';

export function renderProductDetailModal() {
  return `
    <div id="product-detail-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div class="relative w-full max-w-4xl bg-[#FAFAF7] border border-[#DDD4C4] rounded-3xl shadow-2xl overflow-hidden my-8 animate-fade-in text-[#111]">
        
        <!-- Modal Top Bar -->
        <button id="prod-modal-close-btn" class="absolute top-4 right-4 z-20 text-[#666] hover:text-black p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md transition-colors" aria-label="Close">
          ${renderIcon('close', 'w-5 h-5')}
        </button>

        <div class="grid grid-cols-1 md:grid-cols-12 max-h-[88vh] overflow-y-auto">
          
          <!-- Left: High-Resolution Product Gallery (Cols 1-6) -->
          <div class="md:col-span-6 bg-[#EFEAE0] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E5DFD4]">
            
            <!-- Main Hero Image -->
            <div class="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-md flex items-center justify-center border border-[#DDD4C4]">
              <img id="prod-modal-main-img" src="" alt="Product view" class="w-full h-full object-cover transition-all duration-300">
              
              <!-- Badges -->
              <span id="prod-modal-badge" class="absolute top-3 left-3 bg-[#111] text-[#FF6B35] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md font-heading">
                PRINTORA CUSTOM
              </span>

              <!-- Wishlist Floating Icon -->
              <button type="button" id="prod-modal-wishlist-btn" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110">
                ${renderIcon('heart', 'w-4 h-4 text-[#FF6B35]')}
              </button>
            </div>

            <!-- Thumbnail Switcher Strip -->
            <div class="flex items-center gap-2 mt-4 overflow-x-auto pb-1" id="prod-modal-thumbnails">
              <!-- Thumbnails populated dynamically -->
            </div>

            <!-- Free Delivery Ribbon & 3D Jump -->
            <div class="mt-5 space-y-2.5">
              <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>FREE SHIPPING ON ALL ORDERS – NO DELIVERY CHARGES!</span>
              </div>

              <a href="#studio-3d" onclick="document.getElementById('prod-modal-close-btn').click();" class="w-full p-2.5 bg-[#111] hover:bg-[#FF6B35] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 font-heading shadow-sm">
                <span>Launch 360° 3D Garment Studio →</span>
              </a>
            </div>

          </div>

          <!-- Right: Product Specs & Customization Options (Cols 7-12) -->
          <div class="md:col-span-6 p-6 md:p-8 space-y-5 bg-white">
            
            <div>
              <span id="prod-modal-cat" class="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#FF6B35] font-heading">CATEGORY</span>
              <h2 id="prod-modal-title" class="font-heading text-2xl md:text-3xl font-bold tracking-tight text-black mt-1">Product Title</h2>
              <p id="prod-modal-subtitle" class="text-xs text-[#777] mt-1 font-medium">Subtitle / GSM description</p>
            </div>

            <!-- Pricing Banner -->
            <div class="flex items-baseline gap-3 py-2 border-y border-[#EFECE4]">
              <span id="prod-modal-price" class="text-2xl font-black font-mono text-black">₹399</span>
              <span id="prod-modal-original-price" class="text-xs text-[#888] line-through font-mono">₹599</span>
              <span id="prod-modal-discount-tag" class="bg-[#F0EAE1] text-[#FF6B35] text-[10px] font-extrabold px-2 py-0.5 rounded font-heading">SAVE 28%</span>
            </div>

            <!-- Description -->
            <p id="prod-modal-desc" class="text-xs text-[#555] leading-relaxed">
              Detailed description...
            </p>

            <!-- Size Selector -->
            <div id="prod-modal-size-box">
              <div class="flex items-center justify-between mb-2">
                <label class="block text-[11px] uppercase tracking-wider font-bold text-[#444] font-heading">Select Size</label>
                <button type="button" id="open-size-chart-btn" class="text-[11px] font-bold text-[#FF6B35] hover:text-black hover:underline flex items-center gap-1 cursor-pointer">
                  <span>📏 Size Chart & Guide</span>
                </button>
              </div>
              <div class="flex flex-wrap gap-2" id="prod-modal-sizes">
                <!-- Size pills dynamically rendered -->
              </div>
            </div>

            <!-- Color Selector -->
            <div id="prod-modal-color-box">
              <label class="block text-[11px] uppercase tracking-wider font-bold text-[#444] mb-2 font-heading">Select Color</label>
              <div class="flex flex-wrap gap-2" id="prod-modal-colors">
                <!-- Color swatches dynamically rendered -->
              </div>
            </div>

            <!-- ======================================================== -->
            <!-- CLOTHING PRINTING & CUSTOMER UPLOAD SECTION (Apparel)     -->
            <!-- ======================================================== -->
            <div id="prod-modal-clothing-customization" class="hidden bg-[#FAF8F5] border-2 border-[#111] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div class="flex items-center justify-between border-b border-[#E5E0D5] pb-2.5">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#FF6B35]"></span>
                  <h4 class="font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-black">Clothing Printing & Customization</h4>
                </div>
                <span class="text-[10px] bg-[#111] text-[#FF6B35] px-2 py-0.5 rounded font-bold font-mono">PRINTORA LAB</span>
              </div>

              <!-- 1. Choose Printing Size -->
              <div class="space-y-2">
                <label class="block text-[11px] uppercase tracking-wider font-bold text-[#444] font-heading">
                  1. Choose Printing Size *
                </label>
                <div class="grid grid-cols-2 gap-2" id="clothing-print-size-options">
                  <button type="button" class="clothing-print-size-btn p-3 rounded-xl border-2 text-left transition-all cursor-pointer border-[#111] bg-[#111] text-white shadow-sm" data-size-key="small_logo">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-xs font-heading">Small Logo</span>
                      <span class="font-mono text-xs font-extrabold text-[#FF6B35]">+₹25</span>
                    </div>
                    <p class="text-[10px] text-gray-300 mt-0.5">Chest / pocket crest or sleeve</p>
                  </button>

                  <button type="button" class="clothing-print-size-btn p-3 rounded-xl border-2 text-left transition-all cursor-pointer border-[#DDD4C4] bg-white text-[#444] hover:border-[#111]" data-size-key="large_a4">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-xs font-heading">Large A4 Print</span>
                      <span class="font-mono text-xs font-extrabold text-[#FF6B35]">+₹60</span>
                    </div>
                    <p class="text-[10px] text-[#777] mt-0.5">Full front or back centerpiece</p>
                  </button>
                </div>
              </div>

              <!-- 2. Choose Printing Position -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="block text-[11px] uppercase tracking-wider font-bold text-[#444] font-heading">
                    2. Choose Printing Position *
                  </label>
                  <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">No extra charge</span>
                </div>
                <div class="grid grid-cols-2 gap-2" id="clothing-print-pos-options">
                  <button type="button" class="clothing-print-pos-btn py-2.5 px-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer border-[#111] bg-[#111] text-white shadow-sm" data-pos="Front">
                    <span>👕 Front</span>
                  </button>
                  <button type="button" class="clothing-print-pos-btn py-2.5 px-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer border-[#DDD4C4] bg-white text-[#444] hover:border-[#111]" data-pos="Back">
                    <span>🔄 Back</span>
                  </button>
                </div>
              </div>

              <!-- 3. Customer Design / Logo Upload -->
              <div class="space-y-2 pt-1 border-t border-[#E5E0D5]">
                <div class="flex items-center justify-between">
                  <label class="block text-[11px] uppercase tracking-wider font-bold text-[#444] font-heading">
                    3. Upload Your Design / Logo <span class="text-[#888] font-normal lowercase">(optional)</span>
                  </label>
                </div>
                <p class="text-[11px] text-[#666] leading-snug">
                  “Upload your own design or logo. We will use your uploaded artwork for your customized product.”
                </p>

                <!-- Idle State: Upload Button -->
                <div id="clothing-upload-idle-state" class="border-2 border-dashed border-[#DDD4C4] hover:border-[#FF6B35] bg-white rounded-xl p-3.5 text-center transition-all cursor-pointer relative">
                  <input type="file" id="clothing-artwork-input" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                  <div class="flex flex-col items-center justify-center gap-1 pointer-events-none">
                    <div class="w-8 h-8 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center">
                      ${renderIcon('upload', 'w-4 h-4')}
                    </div>
                    <span class="text-xs font-bold text-[#111] font-heading">Upload Your Design / Logo</span>
                    <span class="text-[10px] text-[#777]">JPG, JPEG, PNG or PDF (up to 15MB)</span>
                  </div>
                </div>

                <!-- Preview State (Shown when uploaded) -->
                <div id="clothing-upload-preview-state" class="hidden bg-white border border-[#DDD4C4] rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs">
                  <div class="flex items-center gap-3 min-w-0">
                    <div id="clothing-preview-thumb-box" class="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#E5E0D5] flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img id="clothing-preview-img" src="" class="w-full h-full object-cover hidden" alt="Artwork preview">
                      <span id="clothing-preview-pdf-icon" class="text-xl hidden">📄</span>
                    </div>
                    <div class="min-w-0">
                      <div id="clothing-preview-filename" class="text-xs font-bold text-black truncate font-heading">design.png</div>
                      <div id="clothing-preview-filesize" class="text-[10px] text-[#777] font-mono">1.2 MB</div>
                      <span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded inline-block mt-0.5">✓ Ready for printing</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <label for="clothing-artwork-input" class="text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer">Replace</label>
                    <button type="button" id="clothing-remove-file-btn" class="text-[11px] font-bold text-rose-600 hover:text-rose-800 p-1 cursor-pointer" title="Remove uploaded design">✕</button>
                  </div>
                </div>
              </div>

              <!-- 4. Automatic Price Calculation Breakdown -->
              <div class="bg-white border border-[#E5E0D5] rounded-xl p-3 space-y-1.5 text-xs">
                <div class="flex items-center justify-between text-[#555]">
                  <span>Base Product Price:</span>
                  <span class="font-mono font-bold text-black" id="clothing-calc-base">₹399</span>
                </div>
                <div class="flex items-center justify-between text-[#555]">
                  <span>Printing Charges (<span id="clothing-calc-type-label">Small Logo</span>):</span>
                  <span class="font-mono font-bold text-[#FF6B35]" id="clothing-calc-charge">+₹25</span>
                </div>
                <div class="flex items-center justify-between pt-1.5 border-t border-[#EFECE4] font-extrabold text-sm text-black">
                  <span class="font-heading">Final Unit Price:</span>
                  <span class="font-mono text-base text-[#111]" id="clothing-calc-final">₹424</span>
                </div>
                <div id="clothing-calc-qty-row" class="hidden flex items-center justify-between text-[11px] text-[#777] pt-1">
                  <span>Total (<span id="clothing-calc-qty-num">1</span> items):</span>
                  <span class="font-mono font-bold text-black" id="clothing-calc-total">₹424</span>
                </div>
              </div>
            </div>

            <!-- Standard Customization Form Fields (Non-Clothing) -->
            <div id="prod-modal-standard-customization" class="bg-[#FAF8F5] border border-[#DDD4C4] rounded-2xl p-4 space-y-3">
              <span class="text-[10px] uppercase tracking-wider font-extrabold text-[#FF6B35] block font-heading">Personalization Options</span>
              
              <div id="prod-modal-model-group" class="hidden">
                <label class="block text-[11px] font-bold text-[#FF6B35] mb-1">📱 Phone Model (e.g. iPhone 15 Pro, Samsung S24 Ultra) *</label>
                <input type="text" id="prod-modal-input-model" placeholder="Enter your exact mobile brand & model" 
                       class="w-full bg-white border-2 border-[#FF6B35]/40 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#FF6B35]">
              </div>

              <div id="prod-modal-name-group">
                <label class="block text-[11px] font-bold text-[#444] mb-1">Custom Name to Print</label>
                <input type="text" id="prod-modal-input-name" placeholder="e.g. RAHUL or TITANS" 
                       class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3 py-2 text-xs uppercase font-bold outline-none focus:border-black">
              </div>

              <div id="prod-modal-number-group">
                <label class="block text-[11px] font-bold text-[#444] mb-1">Jersey / Lucky Number (Optional)</label>
                <input type="text" id="prod-modal-input-number" maxlength="3" placeholder="e.g. 07" 
                       class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none focus:border-black">
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#444] mb-1">Special Printing Placement / Notes</label>
                <input type="text" id="prod-modal-input-notes" placeholder="e.g. Center chest print, back arch name" 
                       class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3 py-2 text-xs outline-none focus:border-black">
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#444] mb-1">Upload Logo / Photo (Optional)</label>
                <div class="border border-dashed border-[#DDD4C4] rounded-xl p-2.5 text-center bg-white relative cursor-pointer hover:border-black transition-colors">
                  <input type="file" id="prod-modal-file-upload" accept="image/*,.pdf" class="absolute inset-0 opacity-0 cursor-pointer">
                  <span id="prod-modal-file-text" class="text-xs text-[#777] flex items-center justify-center gap-1.5 font-medium">
                    ${renderIcon('upload', 'w-3 h-3 text-[#FF6B35]')} Select Graphic / Artwork
                  </span>
                </div>
              </div>
            </div>

            <!-- PIN Code Delivery Checker (Section 9 Requirement) -->
            <div class="p-3 bg-[#FAF7F2] border border-[#DDD4C4] rounded-xl space-y-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#555] font-heading block">Check Express Delivery PIN Code</span>
              <div class="flex gap-2">
                <input type="text" id="prod-modal-pincode-input" maxlength="6" placeholder="Enter 6-digit PIN" 
                       class="w-36 bg-white border border-[#DDD4C4] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold outline-none">
                <button type="button" id="prod-modal-pincode-check-btn" class="bg-[#111] hover:bg-[#FF6B35] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  Check
                </button>
              </div>
              <div id="prod-modal-pincode-result" class="text-[11px] font-semibold text-emerald-700 hidden">
                ✓ Free Express Delivery Available • Zero Delivery Charges
              </div>
            </div>

            <!-- Customer Reviews Summary -->
            <div class="pt-2.5 border-t border-[#EFECE4] space-y-2">
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5 text-amber-500">
                  <span class="font-bold">★★★★★</span>
                  <span class="text-black font-extrabold ml-1">4.9 / 5</span>
                </div>
                <span class="text-[#777] text-[11px] font-medium">Verified Delivery Ratings & Photos</span>
              </div>

              <!-- Customer Delivery Reviews & Photos -->
              <div id="prod-modal-customer-reviews" class="space-y-1.5">
                <!-- Dynamically loaded from store.reviews -->
              </div>
            </div>


            <!-- Quantity & Actions (Add to Cart & Buy Now) -->
            <div class="pt-2 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-[#444] font-heading">Quantity</span>
                <div class="flex items-center border border-[#DDD4C4] rounded-xl bg-[#FAFAF7]">
                  <button type="button" id="prod-modal-qty-minus" class="px-3 py-1 text-xs font-bold text-[#666] hover:text-black">-</button>
                  <span id="prod-modal-qty-val" class="px-2 text-xs font-bold text-black font-mono">1</span>
                  <button type="button" id="prod-modal-qty-plus" class="px-3 py-1 text-xs font-bold text-[#666] hover:text-black">+</button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button type="button" id="prod-modal-add-bag-btn" class="w-full bg-[#111] hover:bg-[#FF6B35] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md font-heading cursor-pointer">
                  ${renderIcon('shoppingBag', 'w-4 h-4')}
                  <span id="prod-modal-btn-label">Add to Bag</span>
                </button>

                <button type="button" id="prod-modal-buy-now-btn" class="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md font-heading cursor-pointer">
                  <span>Buy Now (Free Delivery)</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>

    <!-- Size Chart Modal Popup -->
    <div id="printora-size-chart-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div class="relative w-full max-w-lg bg-white border border-[#DDD4C4] rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 text-[#111] my-8">
        <div class="flex items-center justify-between pb-3 border-b border-[#EFECE4]">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35] bg-[#FF6B35]/10 px-2 py-0.5 rounded-full font-heading">Fit & Measurement Guide</span>
            <h3 class="font-heading text-xl font-bold text-black mt-1">Garment Size Chart (Inches)</h3>
          </div>
          <button id="close-size-chart-btn" type="button" class="text-[#888] hover:text-black p-1.5 rounded-full hover:bg-[#F0EAE1] text-lg cursor-pointer">✕</button>
        </div>

        <!-- Size Table -->
        <div class="overflow-x-auto rounded-2xl border border-[#DDD4C4]">
          <table class="w-full text-center text-xs">
            <thead class="bg-[#FAF7F2] font-bold text-[#444] border-b border-[#DDD4C4]">
              <tr>
                <th class="py-2.5 px-3">Size</th>
                <th class="py-2.5 px-3">Chest</th>
                <th class="py-2.5 px-3">Length</th>
                <th class="py-2.5 px-3">Shoulder</th>
                <th class="py-2.5 px-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EFECE4] font-medium">
              <tr class="hover:bg-[#FAF9F5]">
                <td class="py-2.5 px-3 font-bold text-black font-mono">XS</td>
                <td class="py-2.5 px-3 font-mono">36"</td>
                <td class="py-2.5 px-3 font-mono">26"</td>
                <td class="py-2.5 px-3 font-mono">16.5"</td>
                <td class="py-2.5 px-3 text-right pr-4">
                  <button type="button" class="quick-select-size-btn text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer" data-size="XS">Select XS</button>
                </td>
              </tr>
              <tr class="hover:bg-[#FAF9F5]">
                <td class="py-2.5 px-3 font-bold text-black font-mono">S</td>
                <td class="py-2.5 px-3 font-mono">38"</td>
                <td class="py-2.5 px-3 font-mono">27"</td>
                <td class="py-2.5 px-3 font-mono">17.5"</td>
                <td class="py-2.5 px-3 text-right pr-4">
                  <button type="button" class="quick-select-size-btn text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer" data-size="S">Select S</button>
                </td>
              </tr>
              <tr class="hover:bg-[#FAF9F5]">
                <td class="py-2.5 px-3 font-bold text-black font-mono">M</td>
                <td class="py-2.5 px-3 font-mono">40"</td>
                <td class="py-2.5 px-3 font-mono">28"</td>
                <td class="py-2.5 px-3 font-mono">18.5"</td>
                <td class="py-2.5 px-3 text-right pr-4">
                  <button type="button" class="quick-select-size-btn text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer" data-size="M">Select M</button>
                </td>
              </tr>
              <tr class="hover:bg-[#FAF9F5]">
                <td class="py-2.5 px-3 font-bold text-black font-mono">L</td>
                <td class="py-2.5 px-3 font-mono">42"</td>
                <td class="py-2.5 px-3 font-mono">29"</td>
                <td class="py-2.5 px-3 font-mono">19.5"</td>
                <td class="py-2.5 px-3 text-right pr-4">
                  <button type="button" class="quick-select-size-btn text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer" data-size="L">Select L</button>
                </td>
              </tr>
              <tr class="hover:bg-[#FAF9F5]">
                <td class="py-2.5 px-3 font-bold text-black font-mono">XL</td>
                <td class="py-2.5 px-3 font-mono">44"</td>
                <td class="py-2.5 px-3 font-mono">30"</td>
                <td class="py-2.5 px-3 font-mono">20.5"</td>
                <td class="py-2.5 px-3 text-right pr-4">
                  <button type="button" class="quick-select-size-btn text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer" data-size="XL">Select XL</button>
                </td>
              </tr>
              <tr class="hover:bg-[#FAF9F5]">
                <td class="py-2.5 px-3 font-bold text-black font-mono">XXL</td>
                <td class="py-2.5 px-3 font-mono">46"</td>
                <td class="py-2.5 px-3 font-mono">31"</td>
                <td class="py-2.5 px-3 font-mono">21.5"</td>
                <td class="py-2.5 px-3 text-right pr-4">
                  <button type="button" class="quick-select-size-btn text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer" data-size="XXL">Select XXL</button>
                </td>
              </tr>
              <tr class="hover:bg-[#FAF9F5]">
                <td class="py-2.5 px-3 font-bold text-black font-mono">3XL</td>
                <td class="py-2.5 px-3 font-mono">48"</td>
                <td class="py-2.5 px-3 font-mono">32"</td>
                <td class="py-2.5 px-3 font-mono">22.5"</td>
                <td class="py-2.5 px-3 text-right pr-4">
                  <button type="button" class="quick-select-size-btn text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer" data-size="3XL">Select 3XL</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end pt-1">
          <button type="button" id="size-chart-got-it-btn" class="bg-[#111] hover:bg-[#FF6B35] text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer">
            Got it!
          </button>
        </div>
      </div>
    </div>
  `;
}

let currentSelectedProduct = null;
let currentSelectedSize = null;
let currentSelectedColor = null;
let currentModalQty = 1;
let currentUploadedFile = null;

// Clothing customization state
let currentPrintingSize = 'small_logo'; // 'small_logo' (+25), 'large_a4' (+60)
let currentPrintingPosition = 'Front'; // 'Front', 'Back'
let currentUploadedDesign = null; // { name, size, type, dataUrl, isPdf }

export function isClothingProduct(product) {
  if (!product) return false;
  return product.categoryId === 'apparel' ||
    ['prn-app-01', 'prn-app-02', 'prn-app-03', 'prn-app-04', 'prn-app-05', 'prn-app-06', 'prn-app-07', 'prn-app-08'].includes(product.id) ||
    product.name.toLowerCase().includes('t-shirt') || 
    product.name.toLowerCase().includes('hoodie') || 
    product.name.toLowerCase().includes('sweatshirt') || 
    product.name.toLowerCase().includes('polo') ||
    product.name.toLowerCase().includes('top') ||
    product.name.toLowerCase().includes('jersey');
}

export function updateClothingCustomizationUI() {
  if (!currentSelectedProduct) return;
  const isClothing = isClothingProduct(currentSelectedProduct);

  const clothingBox = document.getElementById('prod-modal-clothing-customization');
  const standardBox = document.getElementById('prod-modal-standard-customization');

  if (!isClothing) {
    if (clothingBox) clothingBox.classList.add('hidden');
    if (standardBox) standardBox.classList.remove('hidden');
    return;
  }

  if (clothingBox) clothingBox.classList.remove('hidden');
  if (standardBox) standardBox.classList.add('hidden');

  const basePrice = currentSelectedProduct.price;
  const printCharge = currentPrintingSize === 'small_logo' ? 25 : (currentPrintingSize === 'large_a4' ? 60 : 0);
  const finalUnitPrice = basePrice + printCharge;
  const totalPrice = finalUnitPrice * currentModalQty;

  const baseEl = document.getElementById('clothing-calc-base');
  const chargeEl = document.getElementById('clothing-calc-charge');
  const typeLabelEl = document.getElementById('clothing-calc-type-label');
  const finalEl = document.getElementById('clothing-calc-final');
  const totalRowEl = document.getElementById('clothing-calc-qty-row');
  const totalEl = document.getElementById('clothing-calc-total');
  const qtyNumEl = document.getElementById('clothing-calc-qty-num');
  const mainPriceEl = document.getElementById('prod-modal-price');

  if (baseEl) baseEl.textContent = `₹${basePrice}`;
  if (chargeEl) chargeEl.textContent = `+₹${printCharge}`;
  if (typeLabelEl) typeLabelEl.textContent = currentPrintingSize === 'small_logo' ? 'Small Logo' : 'Large A4 Print';
  if (finalEl) finalEl.textContent = `₹${finalUnitPrice}`;
  if (mainPriceEl) mainPriceEl.textContent = `₹${finalUnitPrice}`;

  if (totalRowEl && totalEl && qtyNumEl) {
    if (currentModalQty > 1) {
      totalRowEl.classList.remove('hidden');
      qtyNumEl.textContent = currentModalQty;
      totalEl.textContent = `₹${totalPrice}`;
    } else {
      totalRowEl.classList.add('hidden');
    }
  }

  // Update button active state for printing size
  document.querySelectorAll('.clothing-print-size-btn').forEach(btn => {
    const key = btn.getAttribute('data-size-key');
    if (key === currentPrintingSize) {
      btn.className = 'clothing-print-size-btn p-3 rounded-xl border-2 text-left transition-all cursor-pointer border-[#111] bg-[#111] text-white shadow-sm';
      const label = btn.querySelector('.font-heading');
      if (label) label.className = 'font-bold text-xs font-heading text-white';
      const desc = btn.querySelector('p');
      if (desc) desc.className = 'text-[10px] text-gray-300 mt-0.5';
    } else {
      btn.className = 'clothing-print-size-btn p-3 rounded-xl border-2 text-left transition-all cursor-pointer border-[#DDD4C4] bg-white text-[#444] hover:border-[#111]';
      const label = btn.querySelector('.font-heading');
      if (label) label.className = 'font-bold text-xs font-heading text-[#111]';
      const desc = btn.querySelector('p');
      if (desc) desc.className = 'text-[10px] text-[#777] mt-0.5';
    }
  });

  // Update button active state for printing position
  document.querySelectorAll('.clothing-print-pos-btn').forEach(btn => {
    const pos = btn.getAttribute('data-pos');
    if (pos === currentPrintingPosition) {
      btn.className = 'clothing-print-pos-btn py-2.5 px-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer border-[#111] bg-[#111] text-white shadow-sm';
    } else {
      btn.className = 'clothing-print-pos-btn py-2.5 px-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer border-[#DDD4C4] bg-white text-[#444] hover:border-[#111]';
    }
  });
}

export function renderClothingUploadState() {
  const idleState = document.getElementById('clothing-upload-idle-state');
  const previewState = document.getElementById('clothing-upload-preview-state');
  const imgEl = document.getElementById('clothing-preview-img');
  const pdfIconEl = document.getElementById('clothing-preview-pdf-icon');
  const nameEl = document.getElementById('clothing-preview-filename');
  const sizeEl = document.getElementById('clothing-preview-filesize');

  if (!currentUploadedDesign) {
    if (idleState) idleState.classList.remove('hidden');
    if (previewState) previewState.classList.add('hidden');
    return;
  }

  if (idleState) idleState.classList.add('hidden');
  if (previewState) previewState.classList.remove('hidden');
  if (nameEl) nameEl.textContent = currentUploadedDesign.name;
  if (sizeEl) sizeEl.textContent = currentUploadedDesign.size;

  if (currentUploadedDesign.isPdf) {
    if (imgEl) imgEl.classList.add('hidden');
    if (pdfIconEl) pdfIconEl.classList.remove('hidden');
  } else {
    if (pdfIconEl) pdfIconEl.classList.add('hidden');
    if (imgEl) {
      imgEl.src = currentUploadedDesign.dataUrl;
      imgEl.classList.remove('hidden');
    }
  }
}

export function openProductDetail(productId) {
  const product = store.products.find(p => p.id === productId || p.slug === productId);
  if (!product) return;

  const isGarment = isClothingProduct(product);

  currentSelectedProduct = product;
  currentSelectedSize = isGarment ? 'M' : (product.sizes?.[0] || 'Standard');
  currentSelectedColor = product.colors?.[0]?.name || 'Standard';
  currentModalQty = 1;
  currentUploadedFile = null;

  // Reset clothing customization state
  currentPrintingSize = 'small_logo';
  currentPrintingPosition = 'Front';
  currentUploadedDesign = null;

  const modal = document.getElementById('product-detail-modal');
  const catEl = document.getElementById('prod-modal-cat');
  const titleEl = document.getElementById('prod-modal-title');
  const subEl = document.getElementById('prod-modal-subtitle');
  const priceEl = document.getElementById('prod-modal-price');
  const origPriceEl = document.getElementById('prod-modal-original-price');
  const discountEl = document.getElementById('prod-modal-discount-tag');
  const descEl = document.getElementById('prod-modal-desc');
  const mainImg = document.getElementById('prod-modal-main-img');
  const thumbsContainer = document.getElementById('prod-modal-thumbnails');
  const sizeBox = document.getElementById('prod-modal-size-box');
  const sizesContainer = document.getElementById('prod-modal-sizes');
  const colorsContainer = document.getElementById('prod-modal-colors');
  const qtyVal = document.getElementById('prod-modal-qty-val');
  const addBagBtn = document.getElementById('prod-modal-add-bag-btn');
  const btnLabel = document.getElementById('prod-modal-btn-label');
  const buyNowBtn = document.getElementById('prod-modal-buy-now-btn');
  const fileText = document.getElementById('prod-modal-file-text');

  if (catEl) catEl.textContent = product.categoryName;
  if (titleEl) titleEl.textContent = product.name;
  if (subEl) subEl.textContent = product.subtitle || "Premium Printora Finish";
  if (descEl) descEl.textContent = product.description;
  if (mainImg) mainImg.src = product.images?.[0] || '';
  if (qtyVal) qtyVal.textContent = '1';
  if (fileText) fileText.innerHTML = `${renderIcon('upload', 'w-3 h-3 text-[#FF6B35]')} Select Graphic / Artwork`;

  // Phone model input visibility: Strictly ONLY for phone cases
  const modelGroup = document.getElementById('prod-modal-model-group');
  const modelInput = document.getElementById('prod-modal-input-model');
  if (modelInput) modelInput.value = '';
  if (modelGroup) {
    if (product.id === 'prn-tch-01' && (product.slug?.includes('phone') || product.name?.toLowerCase().includes('phone'))) {
      modelGroup.classList.remove('hidden');
    } else {
      modelGroup.classList.add('hidden');
    }
  }

  // Price formatting
  if (product.isQuoteOnly) {
    if (priceEl) priceEl.textContent = "Contact for Price";
    if (origPriceEl) origPriceEl.classList.add('hidden');
    if (discountEl) discountEl.classList.add('hidden');
    if (btnLabel) btnLabel.textContent = "Request Quote via WhatsApp";
    if (buyNowBtn) buyNowBtn.classList.add('hidden');
  } else {
    if (priceEl) priceEl.textContent = `₹${product.price}`;
    if (origPriceEl) {
      if (product.originalPrice) {
        origPriceEl.textContent = `₹${product.originalPrice}`;
        origPriceEl.classList.remove('hidden');
      } else {
        origPriceEl.classList.add('hidden');
      }
    }
    if (discountEl) {
      const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
      if (discount > 0) {
        discountEl.textContent = `SAVE ${discount}%`;
        discountEl.classList.remove('hidden');
      } else {
        discountEl.classList.add('hidden');
      }
    }
    if (btnLabel) btnLabel.textContent = "Add to Bag";
    if (buyNowBtn) buyNowBtn.classList.remove('hidden');
  }

  // Gallery Thumbnails
  if (thumbsContainer) {
    if (product.images && product.images.length > 1) {
      thumbsContainer.innerHTML = product.images.map((img, i) => `
        <button type="button" class="w-14 h-14 rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-black' : 'border-[#DDD4C4]'} flex-shrink-0 transition-all hover:border-black cursor-pointer" onclick="document.getElementById('prod-modal-main-img').src='${img}';">
          <img src="${img}" class="w-full h-full object-cover">
        </button>
      `).join('');
    } else {
      thumbsContainer.innerHTML = '';
    }
  }

  // Sizes rendering with full XS to 3XL support
  if (sizesContainer) {
    let displaySizes = product.sizes;
    if (isGarment) {
      displaySizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
    }

    if (displaySizes && displaySizes.length > 0) {
      if (sizeBox) sizeBox.classList.remove('hidden');
      sizesContainer.innerHTML = displaySizes.map((s) => `
        <button type="button" class="prod-modal-size-btn px-3.5 py-1.5 rounded-xl border text-xs font-bold ${s === currentSelectedSize ? 'border-black bg-[#111] text-white shadow-sm' : 'border-[#DDD4C4] bg-white text-[#444] hover:border-black'} transition-all cursor-pointer" data-size="${s}">
          ${s}
        </button>
      `).join('');
    } else {
      if (sizeBox) sizeBox.classList.add('hidden');
    }
  }

  // Size Chart Button visibility: Show on garments
  const sizeChartBtn = document.getElementById('open-size-chart-btn');
  if (sizeChartBtn) {
    if (isGarment) {
      sizeChartBtn.classList.remove('hidden');
    } else {
      sizeChartBtn.classList.add('hidden');
    }
  }

  // Colors
  if (colorsContainer) {
    if (product.colors && product.colors.length > 0) {
      colorsContainer.innerHTML = product.colors.map((c, i) => `
        <button type="button" class="prod-modal-color-btn w-7 h-7 rounded-full border-2 ${i === 0 ? 'border-black' : 'border-transparent'} shadow-sm transition-transform hover:scale-110 cursor-pointer" style="background-color: ${c.hex || '#111'};" title="${c.name}" data-color="${c.name}">
        </button>
      `).join('');
    } else {
      colorsContainer.innerHTML = '<span class="text-xs text-[#777]">Standard Color</span>';
    }
  }

  // Populate verified delivery reviews & photos
  const reviewsContainer = document.getElementById('prod-modal-customer-reviews');
  if (reviewsContainer) {
    const list = store.reviews || [];
    if (list.length === 0) {
      reviewsContainer.innerHTML = '<p class="text-[11px] text-[#888] italic">No customer photos submitted yet. Be the first to review!</p>';
    } else {
      reviewsContainer.innerHTML = list.slice(0, 2).map(r => `
        <div class="p-2 bg-[#FAF8F5] rounded-xl border border-[#DDD4C4] text-[11px] space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-bold text-black font-heading">${r.customerName}</span>
            <span class="text-amber-500 font-bold text-[10px]">${'★'.repeat(r.rating || 5)}</span>
          </div>
          <p class="text-[#555] italic truncate">"${r.comment}"</p>
          ${r.photoUrl ? `
            <div class="flex items-center gap-2 pt-0.5">
              <img src="${r.photoUrl}" class="w-9 h-9 rounded-lg object-cover border border-[#CCC] shadow-xs">
              <span class="text-[10px] text-emerald-700 font-bold">✓ Verified Delivery Photo</span>
            </div>
          ` : ''}
        </div>
      `).join('');
    }
  }

  // Render and sync clothing customization UI
  updateClothingCustomizationUI();
  renderClothingUploadState();

  if (modal) {
    modal.classList.remove('hidden');
  }
}


export function processUploadedArtwork(file, onSuccess) {
  if (!file) return;
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (isPdf) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      onSuccess({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: 'application/pdf',
        dataUrl: evt.target.result,
        isPdf: true
      });
    };
    reader.readAsDataURL(file);
  } else {
    const img = new Image();
    img.onload = function() {
      const maxWidth = 1200;
      const maxHeight = 1200;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
      if (!isPng) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.88);
      onSuccess({
        name: file.name,
        size: (dataUrl.length * 0.75 / 1024).toFixed(1) + ' KB',
        type: isPng ? 'image/png' : 'image/jpeg',
        dataUrl: dataUrl,
        isPdf: false
      });
    };
    const tempReader = new FileReader();
    tempReader.onload = (e) => { img.src = e.target.result; };
    tempReader.readAsDataURL(file);
  }
}

export function initProductDetailModalEvents() {
  if (window.__prodDetailModalListenersInitialized) return;
  window.__prodDetailModalListenersInitialized = true;

  const modal = document.getElementById('product-detail-modal');

  // Delegated close product detail modal
  document.addEventListener('click', (e) => {
    if (e.target.closest('#prod-modal-close-btn') || e.target === modal) {
      if (modal) modal.classList.add('hidden');
    }
  });

  // Delegated Size Selection Click
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.prod-modal-size-btn');
    if (!btn) return;
    e.preventDefault();
    const size = btn.getAttribute('data-size');
    if (!size) return;
    currentSelectedSize = size;
    document.querySelectorAll('.prod-modal-size-btn').forEach(b => {
      b.className = 'prod-modal-size-btn px-3.5 py-1.5 rounded-xl border text-xs font-bold border-[#DDD4C4] bg-white text-[#444] hover:border-black transition-all cursor-pointer';
    });
    btn.className = 'prod-modal-size-btn px-3.5 py-1.5 rounded-xl border text-xs font-bold border-black bg-[#111] text-white shadow-sm transition-all cursor-pointer';
    store.showToast(`Selected size: ${size}`, 'info');
  });

  // Delegated Color Selection Click
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.prod-modal-color-btn');
    if (!btn) return;
    e.preventDefault();
    const color = btn.getAttribute('data-color');
    if (!color) return;
    currentSelectedColor = color;
    document.querySelectorAll('.prod-modal-color-btn').forEach(b => {
      b.classList.remove('border-black', 'scale-110');
      b.classList.add('border-transparent');
    });
    btn.classList.remove('border-transparent');
    btn.classList.add('border-black', 'scale-110');
    store.showToast(`Selected color: ${color}`, 'info');
  });

  // Printing Size selection (+25 / +60)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.clothing-print-size-btn');
    if (!btn) return;
    e.preventDefault();
    const key = btn.getAttribute('data-size-key');
    if (!key) return;
    currentPrintingSize = key;
    updateClothingCustomizationUI();
    const label = key === 'small_logo' ? 'Small Logo (+₹25)' : 'Large A4 Print (+₹60)';
    store.showToast(`Selected printing size: ${label}`, 'info');
  });

  // Printing Position selection (Front / Back)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.clothing-print-pos-btn');
    if (!btn) return;
    e.preventDefault();
    const pos = btn.getAttribute('data-pos');
    if (!pos) return;
    currentPrintingPosition = pos;
    updateClothingCustomizationUI();
    store.showToast(`Selected position: ${pos}`, 'info');
  });

  // Clothing Customer Artwork Upload (High-res canvas compression)
  document.addEventListener('change', (e) => {
    if (e.target.id === 'clothing-artwork-input') {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      processUploadedArtwork(file, (designData) => {
        currentUploadedDesign = designData;
        renderClothingUploadState();
        store.showToast(`Uploaded design: ${file.name}`, 'success');
      });
    }
  });

  // Remove uploaded clothing design
  document.addEventListener('click', (e) => {
    if (e.target.closest('#clothing-remove-file-btn')) {
      currentUploadedDesign = null;
      const input = document.getElementById('clothing-artwork-input');
      if (input) input.value = '';
      renderClothingUploadState();
      store.showToast('Uploaded design removed', 'info');
    }
  });

  // Delegated Open Size Chart Modal
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#open-size-chart-btn');
    if (!btn) return;
    e.preventDefault();
    const chartModal = document.getElementById('printora-size-chart-modal');
    if (chartModal) chartModal.classList.remove('hidden');
  });

  // Delegated Close Size Chart Modal
  document.addEventListener('click', (e) => {
    if (e.target.closest('#close-size-chart-btn') || e.target.closest('#size-chart-got-it-btn') || e.target.id === 'printora-size-chart-modal') {
      const chartModal = document.getElementById('printora-size-chart-modal');
      if (chartModal) chartModal.classList.add('hidden');
    }
  });

  // Delegated Quick Select Size inside Size Chart Table
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-select-size-btn');
    if (!btn) return;
    e.preventDefault();
    const size = btn.getAttribute('data-size');
    if (!size) return;
    currentSelectedSize = size;
    document.querySelectorAll('.prod-modal-size-btn').forEach(b => {
      if (b.getAttribute('data-size') === size) {
        b.className = 'prod-modal-size-btn px-3.5 py-1.5 rounded-xl border text-xs font-bold border-black bg-[#111] text-white shadow-sm transition-all cursor-pointer';
      } else {
        b.className = 'prod-modal-size-btn px-3.5 py-1.5 rounded-xl border text-xs font-bold border-[#DDD4C4] bg-white text-[#444] hover:border-black transition-all cursor-pointer';
      }
    });
    const chartModal = document.getElementById('printora-size-chart-modal');
    if (chartModal) chartModal.classList.add('hidden');
    store.showToast(`Selected size: ${size}`, 'success');
  });

  // PIN checker
  document.addEventListener('click', (e) => {
    if (e.target.closest('#prod-modal-pincode-check-btn')) {
      const pin = document.getElementById('prod-modal-pincode-input')?.value.trim();
      const pincodeResult = document.getElementById('prod-modal-pincode-result');
      if (pin && pin.length === 6 && /^\d{6}$/.test(pin)) {
        if (pincodeResult) pincodeResult.classList.remove('hidden');
      } else {
        alert("Please enter a valid 6-digit PIN code.");
      }
    }
  });

  // Qty +/-
  document.addEventListener('click', (e) => {
    const qtyVal = document.getElementById('prod-modal-qty-val');
    if (e.target.closest('#prod-modal-qty-minus')) {
      if (currentModalQty > 1) {
        currentModalQty--;
        if (qtyVal) qtyVal.textContent = currentModalQty;
        updateClothingCustomizationUI();
      }
    } else if (e.target.closest('#prod-modal-qty-plus')) {
      currentModalQty++;
      if (qtyVal) qtyVal.textContent = currentModalQty;
      updateClothingCustomizationUI();
    }
  });

  // Standard File Upload (Non-clothing) with Full Artwork Persistence
  document.addEventListener('change', (e) => {
    if (e.target.id === 'prod-modal-file-upload') {
      const fileText = document.getElementById('prod-modal-file-text');
      const file = e.target.files && e.target.files[0];
      if (file) {
        currentUploadedFile = file;
        if (fileText) fileText.textContent = `✓ ${file.name.slice(0, 18)}...`;
        processUploadedArtwork(file, (designData) => {
          currentUploadedDesign = designData;
          store.showToast(`Uploaded: ${file.name}`, 'success');
        });
      }
    }
  });

  // Common Add to Bag helper
  function buildCartOptions() {
    const isClothing = isClothingProduct(currentSelectedProduct);
    const phoneModel = document.getElementById('prod-modal-input-model')?.value.trim() || '';

    if (currentSelectedProduct.id === 'prn-tch-01' && (currentSelectedProduct.slug?.includes('phone') || currentSelectedProduct.name?.toLowerCase().includes('phone'))) {
      if (!phoneModel) {
        alert("Please enter your mobile phone model (e.g. iPhone 15, Samsung S24) so we print the exact fit.");
        document.getElementById('prod-modal-input-model')?.focus();
        return null;
      }
    }

    const customName = document.getElementById('prod-modal-input-name')?.value || '';
    const customNumber = document.getElementById('prod-modal-input-number')?.value || '';
    let customNotes = document.getElementById('prod-modal-input-notes')?.value || '';
    if (phoneModel) {
      customNotes = customNotes ? `Model: ${phoneModel} | ${customNotes}` : `Model: ${phoneModel}`;
    }

    if (isClothing) {
      const printCharge = currentPrintingSize === 'small_logo' ? 25 : (currentPrintingSize === 'large_a4' ? 60 : 0);
      const printType = currentPrintingSize === 'small_logo' ? 'Small Logo' : 'Large A4 Print';
      return {
        size: currentSelectedSize,
        color: currentSelectedColor,
        quantity: currentModalQty,
        customName,
        customNumber,
        customNotes,
        basePrice: currentSelectedProduct.price,
        printingCharge: printCharge,
        printingType: printType,
        printingPosition: currentPrintingPosition,
        uploadedDesign: currentUploadedDesign,
        artworkFile: currentUploadedDesign ? currentUploadedDesign.name : (currentUploadedFile ? currentUploadedFile.name : null)
      };
    } else {
      return {
        size: currentSelectedSize,
        color: currentSelectedColor,
        quantity: currentModalQty,
        customName,
        customNumber,
        customNotes,
        phoneModel,
        basePrice: currentSelectedProduct.price,
        printingCharge: 0,
        printingType: null,
        printingPosition: null,
        uploadedDesign: currentUploadedDesign,
        artworkFile: currentUploadedDesign ? currentUploadedDesign.name : (currentUploadedFile ? currentUploadedFile.name : null)
      };
    }
  }

  // Add to Bag
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#prod-modal-add-bag-btn')) return;
    if (!currentSelectedProduct) return;

    const options = buildCartOptions();
    if (!options) return;

    store.addToCart(currentSelectedProduct, options);

    if (modal) modal.classList.add('hidden');
    if (typeof window.openCartDrawer === 'function') {
      window.openCartDrawer();
    }
  });

  // Buy Now
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#prod-modal-buy-now-btn')) return;
    if (!currentSelectedProduct) return;

    const options = buildCartOptions();
    if (!options) return;

    store.addToCart(currentSelectedProduct, options);

    if (modal) modal.classList.add('hidden');
    openCheckoutModal();
  });
}
