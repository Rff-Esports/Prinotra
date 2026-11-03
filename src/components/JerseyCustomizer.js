// PRINTORA Interactive Custom Jersey Studio
// Price: ₹499 | Sizes: S, M, L, XL, XXL | Front & Back Live Preview | Team Crest

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';

export function renderJerseyStudio() {
  return `
    <section id="custom-jersey" class="py-16 md:py-24 bg-[#0A0A0A] text-white relative overflow-hidden border-t border-[#1C1C1C]">
      <!-- Subtle Luxury Ambient Glow -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span class="inline-block text-[#C5A880] text-xs font-semibold uppercase tracking-[0.3em] mb-3">Live Customizer Studio</span>
          <h2 class="text-3xl md:text-5xl font-normal tracking-tight font-serif text-white">Create Your Pro Team Jersey</h2>
          <p class="text-[#999996] text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            High performance dry-fit honeycomb fabric with full thermal sublimation. Personalize with your name, number, team badge and front sponsor graphics.
          </p>
          <div class="mt-4 flex items-center justify-center gap-2">
            <span class="text-xs uppercase tracking-wider text-[#A3A3A0]">Starting at</span>
            <span class="text-2xl font-semibold text-white tracking-tight">₹499</span>
            <span class="line-through text-xs text-[#666663] ml-1">₹799</span>
            <span class="bg-[#C5A880]/20 text-[#C5A880] text-[10px] font-bold px-2 py-0.5 rounded ml-2">SAVE 38%</span>
          </div>
        </div>

        <!-- Studio Grid: Interactive Visualizer + Customization Controls -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <!-- Left: Live Interactive Jersey Visualizer (Cols 1-7) -->
          <div class="lg:col-span-7 bg-[#141414] border border-[#222222] rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center shadow-2xl relative">
            
            <!-- Front / Back Switcher Tabs -->
            <div class="flex items-center gap-2 bg-[#0A0A0A] p-1.5 rounded-full border border-[#262626] mb-8">
              <button id="jersey-view-front-btn" class="px-5 py-1.5 text-xs font-semibold rounded-full bg-[#C5A880] text-[#0A0A0A] transition-all">
                Front View
              </button>
              <button id="jersey-view-back-btn" class="px-5 py-1.5 text-xs font-semibold rounded-full text-[#999996] hover:text-white transition-all">
                Back View
              </button>
            </div>

            <!-- Jersey 3D/2D Canvas Display Box -->
            <div class="relative w-72 h-80 sm:w-88 sm:h-96 md:w-96 md:h-104 flex items-center justify-center">
              
              <!-- Live Front Visualizer -->
              <div id="jersey-front-display" class="relative w-full h-full flex items-center justify-center transition-all duration-300">
                <svg id="jersey-front-svg" class="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]" viewBox="0 0 300 320" fill="none">
                  <!-- Base Silhouette -->
                  <path id="front-base-color" d="M 100 40 C 115 56 185 56 200 40 L 280 75 C 288 78 290 88 285 95 L 250 148 C 245 155 235 156 228 150 L 215 140 L 215 295 C 215 303 208 310 200 310 L 100 310 C 92 310 85 303 85 295 L 85 140 L 72 150 C 65 156 55 155 50 148 L 15 95 C 10 88 12 78 20 75 Z" 
                        fill="#151515" stroke="#333333" stroke-width="2" />
                  
                  <!-- Shoulder Stripes Accent -->
                  <path id="front-accent-stripes" d="M 100 40 L 40 100 M 110 40 L 50 100 M 200 40 L 260 100 M 190 40 L 250 100" stroke="#C5A880" stroke-width="3" stroke-linecap="round" opacity="0.8" />
                  
                  <!-- Ribbed Collar -->
                  <path d="M 100 40 C 120 60 180 60 200 40 C 185 52 115 52 100 40 Z" fill="#0A0A0A" stroke="#C5A880" stroke-width="1.5" />
                  
                  <!-- Left Chest Team Crest Placeholder/Preview -->
                  <g id="jersey-crest-group" transform="translate(122, 115)">
                    <circle cx="0" cy="0" r="14" fill="#0A0A0A" stroke="#C5A880" stroke-width="1.5" />
                    <text x="0" y="4" text-anchor="middle" fill="#C5A880" font-family="'Cinzel', serif" font-weight="700" font-size="9" letter-spacing="1">FC</text>
                  </g>

                  <!-- Front Number Preview -->
                  <text id="jersey-front-number-text" x="150" y="175" text-anchor="middle" fill="#FFFFFF" font-family="'Cinzel', 'Impact', sans-serif" font-weight="800" font-size="38" letter-spacing="2">07</text>

                  <!-- Front Sponsor Text -->
                  <g transform="translate(150, 220)">
                    <text id="jersey-front-sponsor-text" x="0" y="0" text-anchor="middle" fill="#C5A880" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="12" letter-spacing="3">PRINTORA</text>
                    <line x1="-30" y1="8" x2="30" y2="8" stroke="#C5A880" stroke-width="1" opacity="0.6" />
                  </g>
                </svg>
              </div>

              <!-- Live Back Visualizer (Initially Hidden) -->
              <div id="jersey-back-display" class="hidden relative w-full h-full flex items-center justify-center transition-all duration-300">
                <svg id="jersey-back-svg" class="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]" viewBox="0 0 300 320" fill="none">
                  <!-- Base Silhouette Back -->
                  <path id="back-base-color" d="M 100 40 C 120 46 180 46 200 40 L 280 75 C 288 78 290 88 285 95 L 250 148 C 245 155 235 156 228 150 L 215 140 L 215 295 C 215 303 208 310 200 310 L 100 310 C 92 310 85 303 85 295 L 85 140 L 72 150 C 65 156 55 155 50 148 L 15 95 C 10 88 12 78 20 75 Z" 
                        fill="#151515" stroke="#333333" stroke-width="2" />
                  
                  <!-- Shoulder Stripes Accent Back -->
                  <path id="back-accent-stripes" d="M 100 40 L 40 100 M 110 40 L 50 100 M 200 40 L 260 100 M 190 40 L 250 100" stroke="#C5A880" stroke-width="3" stroke-linecap="round" opacity="0.8" />
                  
                  <!-- High Arch Player Name -->
                  <text id="jersey-back-name-text" x="150" y="115" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="20" letter-spacing="4">YOUR NAME</text>

                  <!-- Giant Back Number -->
                  <text id="jersey-back-number-text" x="150" y="215" text-anchor="middle" fill="#FFFFFF" font-family="'Cinzel', 'Impact', sans-serif" font-weight="800" font-size="82" letter-spacing="3">07</text>

                  <!-- Lower Hem Tagline -->
                  <text x="150" y="280" text-anchor="middle" fill="#C5A880" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="8" letter-spacing="2">PRINTORA PRO-FIT</text>
                </svg>
              </div>

            </div>

            <!-- Visualizer Helper Note -->
            <div class="mt-6 flex items-center gap-2 text-xs text-[#A3A3A0]">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live dynamic mockup updates as you type below</span>
            </div>

          </div>

          <!-- Right: Customization Controls (Cols 8-12) -->
          <div class="lg:col-span-5 bg-[#141414] border border-[#222222] rounded-2xl p-6 md:p-8 space-y-6">
            
            <!-- Color Selector -->
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#C5A880] font-semibold mb-3">1. Select Team Colorway</label>
              <div class="grid grid-cols-2 gap-2" id="jersey-color-picker">
                <button type="button" data-bg="#151515" data-accent="#C5A880" data-name="Stealth Black & Gold" class="jersey-color-opt flex items-center gap-2.5 p-2 rounded-lg border border-[#C5A880] bg-[#1E1E1E] text-left text-xs font-medium text-white transition-all">
                  <span class="w-4 h-4 rounded-full bg-[#151515] border border-[#C5A880]"></span>
                  <span>Black & Gold</span>
                </button>
                <button type="button" data-bg="#0047AB" data-accent="#FFFFFF" data-name="Royal Blue & White" class="jersey-color-opt flex items-center gap-2.5 p-2 rounded-lg border border-[#2B2B2B] hover:border-[#444] bg-[#1A1A1A] text-left text-xs font-medium text-[#CCC] transition-all">
                  <span class="w-4 h-4 rounded-full bg-[#0047AB] border border-white"></span>
                  <span>Royal Blue</span>
                </button>
                <button type="button" data-bg="#8B0000" data-accent="#FFFFFF" data-name="Crimson Red & White" class="jersey-color-opt flex items-center gap-2.5 p-2 rounded-lg border border-[#2B2B2B] hover:border-[#444] bg-[#1A1A1A] text-left text-xs font-medium text-[#CCC] transition-all">
                  <span class="w-4 h-4 rounded-full bg-[#8B0000] border border-white"></span>
                  <span>Crimson Red</span>
                </button>
                <button type="button" data-bg="#0B5345" data-accent="#C5A880" data-name="Emerald & Gold" class="jersey-color-opt flex items-center gap-2.5 p-2 rounded-lg border border-[#2B2B2B] hover:border-[#444] bg-[#1A1A1A] text-left text-xs font-medium text-[#CCC] transition-all">
                  <span class="w-4 h-4 rounded-full bg-[#0B5345] border border-[#C5A880]"></span>
                  <span>Emerald Green</span>
                </button>
              </div>
            </div>

            <!-- Size Selector: S, M, L, XL, XXL -->
            <div>
              <div class="flex items-center justify-between mb-2.5">
                <label class="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">2. Select Size</label>
                <span class="text-[11px] text-[#888] cursor-pointer hover:text-white" onclick="alert('PRINTORA Size Guide:\nS: Chest 38\"\nM: Chest 40\"\nL: Chest 42\"\nXL: Chest 44\"\nXXL: Chest 46\"')">Size Guide</span>
              </div>
              <div class="flex items-center gap-2" id="jersey-size-picker">
                ${['S', 'M', 'L', 'XL', 'XXL'].map((sz, idx) => `
                  <button type="button" data-size="${sz}" class="jersey-size-opt flex-1 py-2 rounded-lg border ${idx === 2 ? 'border-[#C5A880] bg-[#C5A880] text-black font-bold' : 'border-[#2A2A2A] text-white hover:border-[#444]'} text-xs font-medium transition-all">
                    ${sz}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Custom Name Printing -->
            <div>
              <label for="jersey-input-name" class="block text-xs uppercase tracking-wider text-[#C5A880] font-semibold mb-2">3. Player Name on Back</label>
              <input type="text" id="jersey-input-name" maxlength="15" placeholder="e.g. VARMA or RONALDO" value="VARMA" 
                     class="w-full bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#C5A880] text-white px-3.5 py-2.5 rounded-lg text-sm uppercase tracking-wider outline-none transition-all placeholder:text-[#555]">
            </div>

            <!-- Custom Jersey Number -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="jersey-input-number" class="block text-xs uppercase tracking-wider text-[#C5A880] font-semibold mb-2">4. Jersey Number</label>
                <input type="text" id="jersey-input-number" maxlength="2" placeholder="07" value="07" 
                       class="w-full bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#C5A880] text-white px-3.5 py-2.5 rounded-lg text-sm font-mono tracking-wider outline-none transition-all text-center">
              </div>
              <div>
                <label for="jersey-input-sponsor" class="block text-xs uppercase tracking-wider text-[#C5A880] font-semibold mb-2">5. Front Sponsor Text</label>
                <input type="text" id="jersey-input-sponsor" maxlength="20" placeholder="e.g. PRINTORA" value="PRINTORA" 
                       class="w-full bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#C5A880] text-white px-3.5 py-2.5 rounded-lg text-sm uppercase tracking-wider outline-none transition-all placeholder:text-[#555]">
              </div>
            </div>

            <!-- Team Logo Upload & Special Notes -->
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#C5A880] font-semibold mb-2">6. Team Crest / Logo (Optional)</label>
              <div class="border border-dashed border-[#333] hover:border-[#C5A880] rounded-lg p-3 text-center cursor-pointer transition-all relative">
                <input type="file" id="jersey-logo-upload" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
                <div class="flex items-center justify-center gap-2 text-xs text-[#AAA]">
                  ${renderIcon('upload', 'w-4 h-4 text-[#C5A880]')}
                  <span id="jersey-logo-label">Upload PNG / JPEG Logo</span>
                </div>
              </div>
            </div>

            <!-- Quantity & Total -->
            <div class="pt-4 border-t border-[#222] flex items-center justify-between">
              <div>
                <span class="text-xs text-[#888] block">Price per Unit</span>
                <span class="text-2xl font-bold text-white font-mono">₹499</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs text-[#888]">Qty:</span>
                <div class="flex items-center border border-[#333] rounded-lg bg-[#0A0A0A]">
                  <button type="button" id="jersey-qty-minus" class="px-2.5 py-1 text-white hover:text-[#C5A880] transition-colors">-</button>
                  <span id="jersey-qty-display" class="px-2 text-sm font-semibold">1</span>
                  <button type="button" id="jersey-qty-plus" class="px-2.5 py-1 text-white hover:text-[#C5A880] transition-colors">+</button>
                </div>
              </div>
            </div>

            <!-- Action CTA: Add to Bag -->
            <button type="button" id="jersey-add-to-bag-btn" class="w-full bg-[#C5A880] hover:bg-[#B5966B] text-black font-bold py-3.5 px-6 rounded-lg text-sm tracking-wider uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
              ${renderIcon('shoppingBag', 'w-4 h-4')}
              <span>Add Custom Jersey to Bag — ₹499</span>
            </button>

            <!-- Bulk Team Order Prompt -->
            <div class="text-center pt-2">
              <a href="#bulk-orders" class="text-xs text-[#C5A880] hover:underline flex items-center justify-center gap-1">
                <span>Ordering for a full team / squad (10+ jerseys)?</span>
                ${renderIcon('arrowRight', 'w-3 h-3')}
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}

export function initJerseyCustomizerEvents() {
  let selectedColor = { bg: "#151515", accent: "#C5A880", name: "Stealth Black & Gold" };
  let selectedSize = "L";
  let quantity = 1;
  let customLogoFile = null;

  // Front / Back View Switcher
  const frontBtn = document.getElementById('jersey-view-front-btn');
  const backBtn = document.getElementById('jersey-view-back-btn');
  const frontDisplay = document.getElementById('jersey-front-display');
  const backDisplay = document.getElementById('jersey-back-display');

  if (frontBtn && backBtn && frontDisplay && backDisplay) {
    frontBtn.addEventListener('click', () => {
      frontBtn.className = "px-5 py-1.5 text-xs font-semibold rounded-full bg-[#C5A880] text-[#0A0A0A] transition-all";
      backBtn.className = "px-5 py-1.5 text-xs font-semibold rounded-full text-[#999996] hover:text-white transition-all";
      frontDisplay.classList.remove('hidden');
      backDisplay.classList.add('hidden');
    });

    backBtn.addEventListener('click', () => {
      backBtn.className = "px-5 py-1.5 text-xs font-semibold rounded-full bg-[#C5A880] text-[#0A0A0A] transition-all";
      frontBtn.className = "px-5 py-1.5 text-xs font-semibold rounded-full text-[#999996] hover:text-white transition-all";
      backDisplay.classList.remove('hidden');
      frontDisplay.classList.add('hidden');
    });
  }

  // Live Name updates
  const nameInput = document.getElementById('jersey-input-name');
  const backNameText = document.getElementById('jersey-back-name-text');
  if (nameInput && backNameText) {
    nameInput.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase().trim() || "YOUR NAME";
      backNameText.textContent = val;
    });
  }

  // Live Number updates
  const numberInput = document.getElementById('jersey-input-number');
  const frontNumberText = document.getElementById('jersey-front-number-text');
  const backNumberText = document.getElementById('jersey-back-number-text');
  if (numberInput && frontNumberText && backNumberText) {
    numberInput.addEventListener('input', (e) => {
      const val = e.target.value.trim() || "07";
      frontNumberText.textContent = val;
      backNumberText.textContent = val;
    });
  }

  // Live Sponsor Text
  const sponsorInput = document.getElementById('jersey-input-sponsor');
  const frontSponsorText = document.getElementById('jersey-front-sponsor-text');
  if (sponsorInput && frontSponsorText) {
    sponsorInput.addEventListener('input', (e) => {
      frontSponsorText.textContent = e.target.value.toUpperCase().trim() || "PRINTORA";
    });
  }

  // Color Pickers
  const colorBtns = document.querySelectorAll('.jersey-color-opt');
  const frontBase = document.getElementById('front-base-color');
  const backBase = document.getElementById('back-base-color');
  const frontAccent = document.getElementById('front-accent-stripes');
  const backAccent = document.getElementById('back-accent-stripes');

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => {
        b.classList.remove('border-[#C5A880]', 'bg-[#1E1E1E]', 'text-white');
        b.classList.add('border-[#2B2B2B]', 'bg-[#1A1A1A]', 'text-[#CCC]');
      });
      btn.classList.remove('border-[#2B2B2B]', 'bg-[#1A1A1A]', 'text-[#CCC]');
      btn.classList.add('border-[#C5A880]', 'bg-[#1E1E1E]', 'text-white');

      selectedColor = {
        bg: btn.getAttribute('data-bg'),
        accent: btn.getAttribute('data-accent'),
        name: btn.getAttribute('data-name')
      };

      if (frontBase) frontBase.setAttribute('fill', selectedColor.bg);
      if (backBase) backBase.setAttribute('fill', selectedColor.bg);
      if (frontAccent) frontAccent.setAttribute('stroke', selectedColor.accent);
      if (backAccent) backAccent.setAttribute('stroke', selectedColor.accent);
    });
  });

  // Size Pickers
  const sizeBtns = document.querySelectorAll('.jersey-size-opt');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => {
        b.className = 'jersey-size-opt flex-1 py-2 rounded-lg border border-[#2A2A2A] text-white hover:border-[#444] text-xs font-medium transition-all';
      });
      btn.className = 'jersey-size-opt flex-1 py-2 rounded-lg border border-[#C5A880] bg-[#C5A880] text-black font-bold text-xs transition-all';
      selectedSize = btn.getAttribute('data-size');
    });
  });

  // Quantity controls
  const minusBtn = document.getElementById('jersey-qty-minus');
  const plusBtn = document.getElementById('jersey-qty-plus');
  const qtyDisplay = document.getElementById('jersey-qty-display');
  const addToBagBtn = document.getElementById('jersey-add-to-bag-btn');

  if (minusBtn && plusBtn && qtyDisplay) {
    minusBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        qtyDisplay.textContent = quantity;
        if (addToBagBtn) addToBagBtn.querySelector('span').textContent = `Add Custom Jersey to Bag — ₹${499 * quantity}`;
      }
    });
    plusBtn.addEventListener('click', () => {
      quantity++;
      qtyDisplay.textContent = quantity;
      if (addToBagBtn) addToBagBtn.querySelector('span').textContent = `Add Custom Jersey to Bag — ₹${499 * quantity}`;
    });
  }

  // Logo file upload handler
  const logoInput = document.getElementById('jersey-logo-upload');
  const logoLabel = document.getElementById('jersey-logo-label');
  if (logoInput && logoLabel) {
    logoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        customLogoFile = e.target.files[0];
        logoLabel.textContent = `✓ ${customLogoFile.name}`;
      }
    });
  }

  // Add to Bag action
  if (addToBagBtn) {
    addToBagBtn.addEventListener('click', () => {
      const jerseyProduct = store.products.find(p => p.id === 'prn-spt-01') || {
        id: 'prn-spt-01',
        name: 'Custom Jerseys',
        price: 499,
        categoryName: 'Sportswear',
        images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80']
      };

      const success = store.addToCart(jerseyProduct, {
        size: selectedSize,
        color: selectedColor.name,
        quantity: quantity,
        customName: (nameInput ? nameInput.value.toUpperCase().trim() : 'VARMA') || 'VARMA',
        customNumber: (numberInput ? numberInput.value.trim() : '07') || '07',
        customNotes: `Front Sponsor: ${sponsorInput ? sponsorInput.value.trim() : 'PRINTORA'}`,
        artworkFile: customLogoFile
      });

      if (success) {
        // Automatically open cart drawer
        const openCartBtn = document.getElementById('nav-cart-btn');
        if (openCartBtn) openCartBtn.click();
      }
    });
  }
}
