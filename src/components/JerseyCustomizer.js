// PRINTORA Interactive Custom Jersey Studio
// Section 12: Player name, number, team name, logos, front & back, sleeve design, collar styles, athletic fonts & multi-jersey roster builder
// Exact Price: ₹499 (Zero Delivery Charges)

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';

export function renderJerseyStudio() {
  return `
    <section id="custom-jersey" class="py-16 md:py-24 bg-[#111111] text-white relative overflow-hidden border-t border-[#222222] font-sans">
      <!-- Ambient Glow -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-[#FF6B35]/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FF6B35]/15 rounded-full blur-[130px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 bg-[#202020] border border-[#333] px-3.5 py-1.5 rounded-full mb-3">
            <span class="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse"></span>
            <span class="text-[11px] font-bold text-white uppercase tracking-widest font-heading">Pro Sports Customizer</span>
          </div>
          <h2 class="text-3xl md:text-5xl font-black font-heading tracking-tight text-white">
            Design Your Custom Pro Team Jersey
          </h2>
          <p class="text-[#AAAAAA] text-xs md:text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Engineered with lightweight dry-fit honeycomb fabric, thermal sublimation and reinforced flatlock stitching. Personalize individually or create a complete team roster.
          </p>
          <div class="mt-4 flex items-center justify-center gap-2">
            <span class="text-xs uppercase tracking-wider text-[#888]">Fixed Customer Price:</span>
            <span class="text-2xl font-black text-[#FF6B35] tracking-tight font-mono">₹499</span>
            <span class="line-through text-xs text-[#666] ml-1 font-mono">₹799</span>
            <span class="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md ml-2 border border-emerald-500/30">FREE DELIVERY</span>
          </div>
        </div>

        <!-- Studio Grid: Visualizer + Controls -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <!-- Left: Live Interactive Jersey Mockup (Cols 1-7) -->
          <div class="lg:col-span-7 bg-[#181818] border border-[#2B2B2B] rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center shadow-2xl relative">
            
            <!-- Front / Back Switcher -->
            <div class="flex items-center gap-2 bg-[#0C0C0C] p-1.5 rounded-2xl border border-[#333] mb-8">
              <button id="jersey-view-front-btn" class="px-5 py-2 text-xs font-bold rounded-xl bg-[#FF6B35] text-white transition-all font-heading">
                Front View
              </button>
              <button id="jersey-view-back-btn" class="px-5 py-2 text-xs font-bold rounded-xl text-[#888] hover:text-white transition-all font-heading">
                Back View
              </button>
            </div>

            <!-- SVG Vector Visualizer Stage -->
            <div class="relative w-72 h-80 sm:w-88 sm:h-96 md:w-96 md:h-104 flex items-center justify-center">
              
              <!-- Front Side SVG -->
              <div id="jersey-front-display" class="relative w-full h-full flex items-center justify-center transition-all duration-300">
                <svg id="jersey-front-svg" class="w-full h-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)]" viewBox="0 0 300 320" fill="none">
                  <!-- Base Silhouette -->
                  <path id="front-base-color" d="M 100 40 C 115 56 185 56 200 40 L 280 75 C 288 78 290 88 285 95 L 250 148 C 245 155 235 156 228 150 L 215 140 L 215 295 C 215 303 208 310 200 310 L 100 310 C 92 310 85 303 85 295 L 85 140 L 72 150 C 65 156 55 155 50 148 L 15 95 C 10 88 12 78 20 75 Z" 
                        fill="#151515" stroke="#333333" stroke-width="2" />
                  
                  <!-- Shoulder Stripes Accent -->
                  <path id="front-accent-stripes" d="M 100 40 L 40 100 M 110 40 L 50 100 M 200 40 L 260 100 M 190 40 L 250 100" stroke="#FF6B35" stroke-width="3.5" stroke-linecap="round" opacity="0.9" />
                  
                  <!-- Ribbed Collar -->
                  <path id="jersey-collar-path" d="M 100 40 C 120 62 180 62 200 40 C 185 52 115 52 100 40 Z" fill="#0A0A0A" stroke="#FF6B35" stroke-width="2" />
                  
                  <!-- Team Badge Placeholder -->
                  <g id="jersey-crest-group" transform="translate(122, 115)">
                    <circle cx="0" cy="0" r="14" fill="#0A0A0A" stroke="#FF6B35" stroke-width="1.5" />
                    <text id="jersey-crest-abbr" x="0" y="4" text-anchor="middle" fill="#FF6B35" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="9" letter-spacing="1">FC</text>
                  </g>

                  <!-- Front Number -->
                  <text id="jersey-front-number-text" x="150" y="175" text-anchor="middle" fill="#FFFFFF" font-family="'Bebas Neue', 'Anton', sans-serif" font-weight="900" font-size="42" letter-spacing="2">07</text>

                  <!-- Front Sponsor Text -->
                  <g transform="translate(150, 220)">
                    <text id="jersey-front-sponsor-text" x="0" y="0" text-anchor="middle" fill="#FF6B35" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="13" letter-spacing="3">PRINTORA</text>
                    <line x1="-32" y1="8" x2="32" y2="8" stroke="#FF6B35" stroke-width="1.5" opacity="0.8" />
                  </g>
                </svg>
              </div>

              <!-- Back Side SVG -->
              <div id="jersey-back-display" class="hidden relative w-full h-full flex items-center justify-center transition-all duration-300">
                <svg id="jersey-back-svg" class="w-full h-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)]" viewBox="0 0 300 320" fill="none">
                  <!-- Base Silhouette Back -->
                  <path id="back-base-color" d="M 100 40 C 120 46 180 46 200 40 L 280 75 C 288 78 290 88 285 95 L 250 148 C 245 155 235 156 228 150 L 215 140 L 215 295 C 215 303 208 310 200 310 L 100 310 C 92 310 85 303 85 295 L 85 140 L 72 150 C 65 156 55 155 50 148 L 15 95 C 10 88 12 78 20 75 Z" 
                        fill="#151515" stroke="#333333" stroke-width="2" />
                  
                  <!-- Shoulder Stripes Accent Back -->
                  <path id="back-accent-stripes" d="M 100 40 L 40 100 M 110 40 L 50 100 M 200 40 L 260 100 M 190 40 L 250 100" stroke="#FF6B35" stroke-width="3.5" stroke-linecap="round" opacity="0.9" />
                  
                  <!-- High Arch Player Name -->
                  <text id="jersey-back-name-text" x="150" y="115" text-anchor="middle" fill="#FFFFFF" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="22" letter-spacing="4">VARMA</text>

                  <!-- Giant Back Number -->
                  <text id="jersey-back-number-text" x="150" y="215" text-anchor="middle" fill="#FFFFFF" font-family="'Bebas Neue', 'Anton', sans-serif" font-weight="900" font-size="88" letter-spacing="3">07</text>

                  <!-- Lower Hem Tagline -->
                  <text x="150" y="280" text-anchor="middle" fill="#FF6B35" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="8" letter-spacing="3">PRINTORA PRO-FIT</text>
                </svg>
              </div>

            </div>

            <!-- Dynamic Indicator -->
            <div class="mt-6 flex items-center gap-2 text-xs text-[#888]">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Instant SVG vector rendering • Zero pixelation</span>
            </div>

          </div>

          <!-- Right: Controls & Team Roster Builder (Cols 8-12) -->
          <div class="lg:col-span-5 bg-[#181818] border border-[#2B2B2B] rounded-3xl p-6 md:p-8 space-y-6">
            
            <!-- 1. Colorway Selection -->
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#FF6B35] font-bold mb-2.5 font-heading">1. Select Jersey Colorway</label>
              <div class="grid grid-cols-2 gap-2" id="jersey-color-picker">
                <button type="button" data-bg="#151515" data-accent="#FF6B35" data-name="Stealth Black & Orange" class="jersey-color-opt flex items-center gap-2.5 p-2 rounded-xl border-2 border-[#FF6B35] bg-[#222] text-left text-xs font-bold text-white transition-all">
                  <span class="w-4 h-4 rounded-full bg-[#151515] border border-[#FF6B35]"></span>
                  <span>Black & Orange</span>
                </button>
                <button type="button" data-bg="#0047AB" data-accent="#FFFFFF" data-name="Royal Navy & White" class="jersey-color-opt flex items-center gap-2.5 p-2 rounded-xl border border-[#333] hover:border-[#666] bg-[#141414] text-left text-xs font-bold text-[#CCC] transition-all">
                  <span class="w-4 h-4 rounded-full bg-[#0047AB] border border-white"></span>
                  <span>Royal Blue</span>
                </button>
                <button type="button" data-bg="#8B0000" data-accent="#FFFFFF" data-name="Crimson Red & White" class="jersey-color-opt flex items-center gap-2.5 p-2 rounded-xl border border-[#333] hover:border-[#666] bg-[#141414] text-left text-xs font-bold text-[#CCC] transition-all">
                  <span class="w-4 h-4 rounded-full bg-[#8B0000] border border-white"></span>
                  <span>Crimson Red</span>
                </button>
                <button type="button" data-bg="#0B5345" data-accent="#FF6B35" data-name="Emerald & Orange" class="jersey-color-opt flex items-center gap-2.5 p-2 rounded-xl border border-[#333] hover:border-[#666] bg-[#141414] text-left text-xs font-bold text-[#CCC] transition-all">
                  <span class="w-4 h-4 rounded-full bg-[#0B5345] border border-[#FF6B35]"></span>
                  <span>Emerald Green</span>
                </button>
              </div>
            </div>

            <!-- 2. Collar Style Selection -->
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#FF6B35] font-bold mb-2 font-heading">2. Collar Style</label>
              <div class="grid grid-cols-3 gap-2">
                <button type="button" class="jersey-collar-opt py-2 rounded-xl border-2 border-[#FF6B35] bg-[#222] text-xs font-bold text-white text-center" data-collar="round">Round Rib</button>
                <button type="button" class="jersey-collar-opt py-2 rounded-xl border border-[#333] hover:border-[#666] bg-[#141414] text-xs font-bold text-[#888] text-center" data-collar="vneck">Athletic V</button>
                <button type="button" class="jersey-collar-opt py-2 rounded-xl border border-[#333] hover:border-[#666] bg-[#141414] text-xs font-bold text-[#888] text-center" data-collar="polo">Pro Polo</button>
              </div>
            </div>

            <!-- 3. Size & Player Customization -->
            <div class="p-4 bg-[#202020] border border-[#333] rounded-2xl space-y-3">
              <span class="text-xs uppercase tracking-wider text-[#FF6B35] font-bold block font-heading">3. Player Personalization</span>
              
              <!-- Size -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-semibold text-[#CCC]">Size (Chest Inches)</span>
                  <span class="text-[10px] text-[#888]">S:38" M:40" L:42" XL:44" XXL:46"</span>
                </div>
                <div class="flex gap-1.5" id="jersey-size-picker">
                  ${['S', 'M', 'L', 'XL', 'XXL'].map((sz, idx) => `
                    <button type="button" data-size="${sz}" class="jersey-size-opt flex-1 py-1.5 rounded-lg border ${idx === 2 ? 'border-[#FF6B35] bg-[#FF6B35] text-white font-bold' : 'border-[#333] text-[#CCC]'} text-xs font-bold transition-all">
                      ${sz}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Name -->
              <div>
                <label for="jersey-input-name" class="block text-[11px] font-semibold text-[#CCC] mb-1">Player Name on Back</label>
                <input type="text" id="jersey-input-name" maxlength="15" placeholder="e.g. VARMA or RONALDO" value="VARMA" 
                       class="w-full bg-[#111] border border-[#444] focus:border-[#FF6B35] text-white px-3 py-2 rounded-xl text-xs uppercase font-bold outline-none transition-all">
              </div>

              <!-- Number & Team/Sponsor -->
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label for="jersey-input-number" class="block text-[11px] font-semibold text-[#CCC] mb-1">Jersey Number</label>
                  <input type="text" id="jersey-input-number" maxlength="2" placeholder="07" value="07" 
                         class="w-full bg-[#111] border border-[#444] focus:border-[#FF6B35] text-white px-3 py-2 rounded-xl text-xs font-mono font-bold outline-none transition-all text-center">
                </div>
                <div>
                  <label for="jersey-input-sponsor" class="block text-[11px] font-semibold text-[#CCC] mb-1">Front Team / Sponsor</label>
                  <input type="text" id="jersey-input-sponsor" maxlength="20" placeholder="PRINTORA" value="PRINTORA" 
                         class="w-full bg-[#111] border border-[#444] focus:border-[#FF6B35] text-white px-3 py-2 rounded-xl text-xs uppercase font-bold outline-none transition-all">
                </div>
              </div>
            </div>

            <!-- Team Logo Upload -->
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#FF6B35] font-bold mb-1.5 font-heading">4. Team Crest / Logo (Optional)</label>
              <div class="border border-dashed border-[#444] hover:border-[#FF6B35] rounded-xl p-3 text-center cursor-pointer transition-all relative bg-[#141414]">
                <input type="file" id="jersey-logo-upload" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
                <div class="flex items-center justify-center gap-2 text-xs text-[#AAA]">
                  ${renderIcon('upload', 'w-4 h-4 text-[#FF6B35]')}
                  <span id="jersey-logo-label">Upload PNG / JPEG Team Badge</span>
                </div>
              </div>
            </div>

            <!-- Price & Add to Bag -->
            <div class="pt-3 border-t border-[#333] space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-[#888] block">Price per Jersey</span>
                  <span class="text-2xl font-black text-white font-mono">₹499 <span class="text-xs text-emerald-400 font-sans font-bold">(Free Shipping)</span></span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-[#888]">Qty:</span>
                  <div class="flex items-center border border-[#444] rounded-xl bg-[#111]">
                    <button type="button" id="jersey-qty-minus" class="px-3 py-1 text-white hover:text-[#FF6B35] font-bold">-</button>
                    <span id="jersey-qty-display" class="px-2 text-xs font-bold font-mono">1</span>
                    <button type="button" id="jersey-qty-plus" class="px-3 py-1 text-white hover:text-[#FF6B35] font-bold">+</button>
                  </div>
                </div>
              </div>

              <button type="button" id="jersey-add-to-bag-btn" class="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-extrabold py-4 px-6 rounded-2xl text-xs tracking-wider uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2 font-heading cursor-pointer">
                ${renderIcon('shoppingBag', 'w-4 h-4')}
                <span id="jersey-btn-label">Add Custom Jersey to Bag — ₹499</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}

export function initJerseyCustomizerEvents() {
  let selectedColor = { bg: "#151515", accent: "#FF6B35", name: "Stealth Black & Orange" };
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
      frontBtn.className = "px-5 py-2 text-xs font-bold rounded-xl bg-[#FF6B35] text-white transition-all font-heading";
      backBtn.className = "px-5 py-2 text-xs font-bold rounded-xl text-[#888] hover:text-white transition-all font-heading";
      frontDisplay.classList.remove('hidden');
      backDisplay.classList.add('hidden');
    });

    backBtn.addEventListener('click', () => {
      backBtn.className = "px-5 py-2 text-xs font-bold rounded-xl bg-[#FF6B35] text-white transition-all font-heading";
      frontBtn.className = "px-5 py-2 text-xs font-bold rounded-xl text-[#888] hover:text-white transition-all font-heading";
      backDisplay.classList.remove('hidden');
      frontDisplay.classList.add('hidden');
    });
  }

  // Live Name updates
  const nameInput = document.getElementById('jersey-input-name');
  const backNameText = document.getElementById('jersey-back-name-text');
  if (nameInput && backNameText) {
    nameInput.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase().trim() || "VARMA";
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
  const crestAbbr = document.getElementById('jersey-crest-abbr');
  if (sponsorInput && frontSponsorText) {
    sponsorInput.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase().trim() || "PRINTORA";
      frontSponsorText.textContent = val;
      if (crestAbbr) crestAbbr.textContent = val.slice(0, 2);
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
        b.classList.remove('border-2', 'border-[#FF6B35]', 'bg-[#222]', 'text-white');
        b.classList.add('border-[#333]', 'bg-[#141414]', 'text-[#CCC]');
      });
      btn.classList.add('border-2', 'border-[#FF6B35]', 'bg-[#222]', 'text-white');
      btn.classList.remove('border-[#333]', 'bg-[#141414]', 'text-[#CCC]');

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
        b.className = 'jersey-size-opt flex-1 py-1.5 rounded-lg border border-[#333] text-[#CCC] text-xs font-bold transition-all';
      });
      btn.className = 'jersey-size-opt flex-1 py-1.5 rounded-lg border border-[#FF6B35] bg-[#FF6B35] text-white font-bold text-xs transition-all';
      selectedSize = btn.getAttribute('data-size');
    });
  });

  // Quantity controls
  const minusBtn = document.getElementById('jersey-qty-minus');
  const plusBtn = document.getElementById('jersey-qty-plus');
  const qtyDisplay = document.getElementById('jersey-qty-display');
  const addToBagBtn = document.getElementById('jersey-add-to-bag-btn');
  const btnLabel = document.getElementById('jersey-btn-label');

  if (minusBtn && plusBtn && qtyDisplay) {
    minusBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        qtyDisplay.textContent = quantity;
        if (btnLabel) btnLabel.textContent = `Add Custom Jersey to Bag — ₹${499 * quantity}`;
      }
    });
    plusBtn.addEventListener('click', () => {
      quantity++;
      qtyDisplay.textContent = quantity;
      if (btnLabel) btnLabel.textContent = `Add Custom Jersey to Bag — ₹${499 * quantity}`;
    });
  }

  // Logo file upload handler
  let customLogoDesign = null;
  const logoInput = document.getElementById('jersey-logo-upload');
  const logoLabel = document.getElementById('jersey-logo-label');
  if (logoInput && logoLabel) {
    logoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        customLogoFile = e.target.files[0];
        logoLabel.textContent = `✓ ${customLogoFile.name.slice(0, 16)}...`;
        
        const reader = new FileReader();
        reader.onload = function(evt) {
          customLogoDesign = {
            name: customLogoFile.name,
            size: (customLogoFile.size / 1024).toFixed(1) + ' KB',
            type: customLogoFile.type || 'image/png',
            dataUrl: evt.target.result,
            isPdf: false
          };
        };
        reader.readAsDataURL(customLogoFile);
      }
    });
  }

  // Add to Bag action
  if (addToBagBtn) {
    addToBagBtn.addEventListener('click', () => {
      const jerseyProduct = store.products.find(p => p.id === 'prn-spt-01') || {
        id: 'prn-spt-01',
        name: 'Custom Jersey',
        price: 499,
        originalPrice: 799,
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
        artworkFile: customLogoFile ? customLogoFile.name : null,
        uploadedDesign: customLogoDesign
      });

      if (success) {
        const cartDrawer = document.getElementById('cart-drawer');
        if (cartDrawer) {
          const navCartBtn = document.getElementById('nav-cart-btn');
          if (navCartBtn) navCartBtn.click();
        }
      }
    });
  }
}
