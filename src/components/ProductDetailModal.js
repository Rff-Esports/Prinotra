// PRINTORA Product Detail Modal with Customizer & Gallery
import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { generateWhatsAppUrl, BUSINESS_WHATSAPP_NUMBER } from '../services/whatsapp.js';

export function renderProductDetailModal() {
  return `
    <div id="product-detail-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div class="relative w-full max-w-4xl bg-[#FAFAF7] border border-[#DDD4C4] rounded-2xl shadow-2xl overflow-hidden my-8 animate-fade-in text-[#111]">
        
        <!-- Modal Top Bar -->
        <button id="prod-modal-close-btn" class="absolute top-4 right-4 z-20 text-[#666] hover:text-black p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md transition-colors" aria-label="Close">
          ${renderIcon('close', 'w-5 h-5')}
        </button>

        <div class="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          <!-- Left: High-Resolution Product Gallery (Cols 1-6) -->
          <div class="md:col-span-6 bg-[#EFEAE0] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E5DFD4]">
            
            <!-- Main Hero Image -->
            <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-white shadow-soft flex items-center justify-center border border-[#DDD4C4]">
              <img id="prod-modal-main-img" src="" alt="Product view" class="w-full h-full object-cover transition-all duration-300">
              <span id="prod-modal-badge" class="absolute top-3 left-3 bg-[#111] text-[#C5A880] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                PRINTORA EXCLUSIVE
              </span>
            </div>

            <!-- Thumbnail Switcher Strip -->
            <div class="flex items-center gap-2 mt-4 overflow-x-auto pb-1" id="prod-modal-thumbnails">
              <!-- Thumbnails populated dynamically -->
            </div>

            <!-- Quality Highlights -->
            <div class="mt-6 pt-4 border-t border-[#DDD4C4] grid grid-cols-2 gap-2 text-[11px] text-[#666]">
              <div class="flex items-center gap-1.5">
                ${renderIcon('shieldCheck', 'w-3.5 h-3.5 text-[#997A52]')}
                <span>Zero Color Fade Guarantee</span>
              </div>
              <div class="flex items-center gap-1.5">
                ${renderIcon('truck', 'w-3.5 h-3.5 text-[#997A52]')}
                <span>Pan-India Express Dispatch</span>
              </div>
            </div>

          </div>

          <!-- Right: Product Specs & Customization Options (Cols 7-12) -->
          <div class="md:col-span-6 p-6 md:p-8 space-y-5 bg-white">
            
            <div>
              <span id="prod-modal-cat" class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#997A52]">CATEGORY</span>
              <h2 id="prod-modal-title" class="font-serif text-2xl md:text-3xl font-medium tracking-tight text-black mt-1">Product Title</h2>
              <p id="prod-modal-subtitle" class="text-xs text-[#787673] mt-1 font-medium">Subtitle / GSM description</p>
            </div>

            <!-- Pricing Banner (Honest confirmed prices or "REQUEST A QUOTE") -->
            <div class="flex items-baseline gap-3 py-2 border-y border-[#EFECE4]">
              <span id="prod-modal-price" class="text-2xl font-bold font-mono text-black">₹499</span>
              <span id="prod-modal-original-price" class="text-xs text-[#888] line-through font-mono">₹699</span>
              <span id="prod-modal-discount-tag" class="bg-[#F0EAE1] text-[#997A52] text-[10px] font-bold px-2 py-0.5 rounded">SAVE 28%</span>
            </div>

            <!-- Description -->
            <p id="prod-modal-desc" class="text-xs text-[#555] leading-relaxed">
              Detailed description...
            </p>

            <!-- Size Selector -->
            <div id="prod-modal-size-box">
              <label class="block text-[11px] uppercase tracking-wider font-bold text-[#444] mb-2">Select Size</label>
              <div class="flex flex-wrap gap-2" id="prod-modal-sizes">
                <!-- Size pills dynamically rendered -->
              </div>
            </div>

            <!-- Color Selector -->
            <div id="prod-modal-color-box">
              <label class="block text-[11px] uppercase tracking-wider font-bold text-[#444] mb-2">Select Color</label>
              <div class="flex flex-wrap gap-2" id="prod-modal-colors">
                <!-- Color swatches dynamically rendered -->
              </div>
            </div>

            <!-- Customization Form Fields -->
            <div class="bg-[#FAFAF7] border border-[#DDD4C4] rounded-xl p-4 space-y-3">
              <span class="text-[10px] uppercase tracking-wider font-bold text-[#997A52] block">Customization Details</span>
              
              <div id="prod-modal-name-group">
                <label class="block text-[11px] font-semibold text-[#444] mb-1">Custom Name / Text to Print</label>
                <input type="text" id="prod-modal-input-name" placeholder="e.g. RAHUL or TEAM CAPTAIN" 
                       class="w-full bg-white border border-[#DDD4C4] rounded-lg px-3 py-2 text-xs uppercase outline-none focus:border-black">
              </div>

              <div id="prod-modal-number-group">
                <label class="block text-[11px] font-semibold text-[#444] mb-1">Jersey / Lucky Number</label>
                <input type="text" id="prod-modal-input-number" maxlength="3" placeholder="e.g. 07" 
                       class="w-full bg-white border border-[#DDD4C4] rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-black">
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-[#444] mb-1">Special Printing Instructions / Placement</label>
                <input type="text" id="prod-modal-input-notes" placeholder="e.g. Print on left chest / Back center" 
                       class="w-full bg-white border border-[#DDD4C4] rounded-lg px-3 py-2 text-xs outline-none focus:border-black">
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-[#444] mb-1">Upload Logo / Photo (Optional)</label>
                <div class="border border-dashed border-[#DDD4C4] rounded-lg p-2.5 text-center bg-white relative cursor-pointer hover:border-black transition-colors">
                  <input type="file" id="prod-modal-file-upload" accept="image/*,.pdf" class="absolute inset-0 opacity-0 cursor-pointer">
                  <span id="prod-modal-file-text" class="text-xs text-[#787673] flex items-center justify-center gap-1.5">
                    ${renderIcon('upload', 'w-3 h-3 text-[#C5A880]')} Select Image / Logo
                  </span>
                </div>
              </div>
            </div>

            <!-- Quantity & Actions -->
            <div class="pt-2 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-[#444]">Quantity</span>
                <div class="flex items-center border border-[#DDD4C4] rounded-lg bg-[#FAFAF7]">
                  <button type="button" id="prod-modal-qty-minus" class="px-3 py-1 text-xs font-bold text-[#666] hover:text-black">-</button>
                  <span id="prod-modal-qty-val" class="px-2 text-xs font-semibold text-black">1</span>
                  <button type="button" id="prod-modal-qty-plus" class="px-3 py-1 text-xs font-bold text-[#666] hover:text-black">+</button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button type="button" id="prod-modal-add-bag-btn" class="w-full bg-[#111] hover:bg-[#C5A880] text-white hover:text-black font-bold py-3.5 px-4 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md">
                  ${renderIcon('shoppingBag', 'w-4 h-4')}
                  <span id="prod-modal-btn-label">Add to Bag</span>
                </button>

                <button type="button" id="prod-modal-direct-wa-btn" class="w-full bg-[#25D366] hover:bg-[#20BE5B] text-black font-bold py-3.5 px-4 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md">
                  ${renderIcon('whatsapp', 'w-4 h-4 text-black')}
                  <span>Quick WhatsApp</span>
                </button>
              </div>
            </div>

          </div>

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

export function openProductDetail(productId) {
  const product = store.products.find(p => p.id === productId || p.slug === productId);
  if (!product) return;

  currentSelectedProduct = product;
  currentSelectedSize = product.sizes?.[0] || 'Standard';
  currentSelectedColor = product.colors?.[0]?.name || 'Standard';
  currentModalQty = 1;
  currentUploadedFile = null;

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
  const sizesContainer = document.getElementById('prod-modal-sizes');
  const colorsContainer = document.getElementById('prod-modal-colors');
  const qtyVal = document.getElementById('prod-modal-qty-val');
  const addBagBtn = document.getElementById('prod-modal-add-bag-btn');
  const btnLabel = document.getElementById('prod-modal-btn-label');
  const directWaBtn = document.getElementById('prod-modal-direct-wa-btn');
  const fileText = document.getElementById('prod-modal-file-text');

  if (catEl) catEl.textContent = product.categoryName;
  if (titleEl) titleEl.textContent = product.name;
  if (subEl) subEl.textContent = product.subtitle || "Premium Printora Finish";
  if (descEl) descEl.textContent = product.description;
  if (mainImg) mainImg.src = product.images?.[0] || '';
  if (qtyVal) qtyVal.textContent = '1';
  if (fileText) fileText.innerHTML = `${renderIcon('upload', 'w-3 h-3 text-[#C5A880]')} Select Image / Logo`;

  // Price formatting
  if (product.isQuoteOnly) {
    if (priceEl) priceEl.textContent = "REQUEST A QUOTE";
    if (origPriceEl) origPriceEl.classList.add('hidden');
    if (discountEl) discountEl.classList.add('hidden');
    if (btnLabel) btnLabel.textContent = "Request Quote via WhatsApp";
  } else {
    if (priceEl) priceEl.textContent = `₹${product.price}${product.isOnwards ? ' onwards' : ''}`;
    if (product.originalPrice) {
      if (origPriceEl) {
        origPriceEl.textContent = `₹${product.originalPrice}`;
        origPriceEl.classList.remove('hidden');
      }
      if (discountEl) {
        const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        discountEl.textContent = `SAVE ${discountPct}%`;
        discountEl.classList.remove('hidden');
      }
    } else {
      if (origPriceEl) origPriceEl.classList.add('hidden');
      if (discountEl) discountEl.classList.add('hidden');
    }
    if (btnLabel) btnLabel.textContent = `Add to Bag — ₹${product.price}`;
  }

  // Thumbnails
  if (thumbsContainer) {
    thumbsContainer.innerHTML = (product.images || []).map((img, idx) => `
      <button type="button" class="prod-thumb-btn w-12 h-12 rounded-lg overflow-hidden border-2 ${idx === 0 ? 'border-black' : 'border-transparent'} flex-shrink-0" data-img-url="${img}">
        <img src="${img}" class="w-full h-full object-cover">
      </button>
    `).join('');

    thumbsContainer.querySelectorAll('.prod-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        thumbsContainer.querySelectorAll('.prod-thumb-btn').forEach(b => b.className = 'prod-thumb-btn w-12 h-12 rounded-lg overflow-hidden border-2 border-transparent flex-shrink-0');
        btn.className = 'prod-thumb-btn w-12 h-12 rounded-lg overflow-hidden border-2 border-black flex-shrink-0';
        if (mainImg) mainImg.src = btn.getAttribute('data-img-url');
      });
    });
  }

  // Sizes
  if (sizesContainer) {
    const sizes = product.sizes || ['Standard'];
    sizesContainer.innerHTML = sizes.map((sz, idx) => `
      <button type="button" class="prod-modal-sz-btn px-3 py-1.5 text-xs font-semibold rounded-lg border ${idx === 0 ? 'border-black bg-black text-white' : 'border-[#DDD4C4] text-[#444] hover:border-black'} transition-colors" data-size="${sz}">
        ${sz}
      </button>
    `).join('');

    sizesContainer.querySelectorAll('.prod-modal-sz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sizesContainer.querySelectorAll('.prod-modal-sz-btn').forEach(b => b.className = 'prod-modal-sz-btn px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#DDD4C4] text-[#444] hover:border-black transition-colors');
        btn.className = 'prod-modal-sz-btn px-3 py-1.5 text-xs font-semibold rounded-lg border border-black bg-black text-white transition-colors';
        currentSelectedSize = btn.getAttribute('data-size');
      });
    });
  }

  // Colors
  if (colorsContainer) {
    const colors = product.colors || [{ name: "Standard", hex: "#111111" }];
    colorsContainer.innerHTML = colors.map((c, idx) => `
      <button type="button" class="prod-modal-col-btn flex items-center gap-1.5 px-3 py-1 rounded-lg border ${idx === 0 ? 'border-black bg-[#FAF7F2]' : 'border-[#DDD4C4]'} text-xs font-medium transition-colors" data-color="${c.name}">
        <span class="w-3.5 h-3.5 rounded-full border border-black/20" style="background-color: ${c.hex}"></span>
        <span>${c.name}</span>
      </button>
    `).join('');

    colorsContainer.querySelectorAll('.prod-modal-col-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        colorsContainer.querySelectorAll('.prod-modal-col-btn').forEach(b => b.className = 'prod-modal-col-btn flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#DDD4C4] text-xs font-medium transition-colors');
        btn.className = 'prod-modal-col-btn flex items-center gap-1.5 px-3 py-1 rounded-lg border border-black bg-[#FAF7F2] text-xs font-medium transition-colors';
        currentSelectedColor = btn.getAttribute('data-color');
      });
    });
  }

  // Direct WhatsApp Quick Order Link
  if (directWaBtn) {
    directWaBtn.onclick = () => {
      const msg = encodeURIComponent(`Hello PRINTORA, I would like to order or enquire about *${product.name}* (Size: ${currentSelectedSize}, Color: ${currentSelectedColor}). Price: ${product.price ? `₹${product.price}` : 'Requesting Quote'}.`);
      window.open(`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    };
  }

  if (modal) modal.classList.remove('hidden');
}

export function initProductDetailModalEvents() {
  const modal = document.getElementById('product-detail-modal');
  const closeBtn = document.getElementById('prod-modal-close-btn');
  const minusBtn = document.getElementById('prod-modal-qty-minus');
  const plusBtn = document.getElementById('prod-modal-qty-plus');
  const qtyVal = document.getElementById('prod-modal-qty-val');
  const addBagBtn = document.getElementById('prod-modal-add-bag-btn');
  const btnLabel = document.getElementById('prod-modal-btn-label');
  const fileInput = document.getElementById('prod-modal-file-upload');
  const fileText = document.getElementById('prod-modal-file-text');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (minusBtn && plusBtn && qtyVal) {
    minusBtn.addEventListener('click', () => {
      if (currentModalQty > 1) {
        currentModalQty--;
        qtyVal.textContent = currentModalQty;
        if (currentSelectedProduct?.price && btnLabel) {
          btnLabel.textContent = `Add to Bag — ₹${currentSelectedProduct.price * currentModalQty}`;
        }
      }
    });

    plusBtn.addEventListener('click', () => {
      currentModalQty++;
      qtyVal.textContent = currentModalQty;
      if (currentSelectedProduct?.price && btnLabel) {
        btnLabel.textContent = `Add to Bag — ₹${currentSelectedProduct.price * currentModalQty}`;
      }
    });
  }

  if (fileInput && fileText) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        currentUploadedFile = e.target.files[0];
        fileText.textContent = `✓ Uploaded: ${currentUploadedFile.name}`;
      }
    });
  }

  if (addBagBtn) {
    addBagBtn.addEventListener('click', () => {
      if (!currentSelectedProduct) return;

      if (currentSelectedProduct.isQuoteOnly) {
        const msg = encodeURIComponent(`Hello PRINTORA, I am requesting a quotation for *${currentSelectedProduct.name}* (Qty: ${currentModalQty}, Size: ${currentSelectedSize}, Color: ${currentSelectedColor}).`);
        window.open(`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${msg}`, '_blank');
        if (modal) modal.classList.add('hidden');
        return;
      }

      const customName = document.getElementById('prod-modal-input-name')?.value || '';
      const customNumber = document.getElementById('prod-modal-input-number')?.value || '';
      const customNotes = document.getElementById('prod-modal-input-notes')?.value || '';

      const success = store.addToCart(currentSelectedProduct, {
        size: currentSelectedSize,
        color: currentSelectedColor,
        quantity: currentModalQty,
        customName,
        customNumber,
        customNotes,
        artworkFile: currentUploadedFile
      });

      if (success) {
        if (modal) modal.classList.add('hidden');
        const openCartBtn = document.getElementById('nav-cart-btn');
        if (openCartBtn) openCartBtn.click();
      }
    });
  }
}
