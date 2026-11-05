// PRINTORA Advanced Product Customization Studio
// Complies with Section 11: 12 Google fonts, live preview on product, front/back customization, undo/redo, save design

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';

export const FONT_LIBRARY = [
  { name: "Space Grotesk", family: "'Space Grotesk', sans-serif", label: "Space Grotesk (Modern Bold)" },
  { name: "Manrope", family: "'Manrope', sans-serif", label: "Manrope (Clean Minimal)" },
  { name: "Inter", family: "'Inter', sans-serif", label: "Inter (Technical Sharp)" },
  { name: "Poppins", family: "'Poppins', sans-serif", label: "Poppins (Geometric)" },
  { name: "Playfair Display", family: "'Playfair Display', serif", label: "Playfair Display (Luxury Serif)" },
  { name: "Montserrat", family: "'Montserrat', sans-serif", label: "Montserrat (Classic Editorial)" },
  { name: "Bebas Neue", family: "'Bebas Neue', sans-serif", label: "Bebas Neue (Athletic Display)" },
  { name: "Oswald", family: "'Oswald', sans-serif", label: "Oswald (Condensed Heavy)" },
  { name: "Roboto", family: "'Roboto', sans-serif", label: "Roboto (Balanced)" },
  { name: "Anton", family: "'Anton', sans-serif", label: "Anton (Impact Black)" },
  { name: "Dancing Script", family: "'Dancing Script', cursive", label: "Dancing Script (Elegant Script)" },
  { name: "Pacifico", family: "'Pacifico', cursive", label: "Pacifico (Vintage Retro)" }
];

export function renderCustomizationStudioSection() {
  return `
    <section id="custom-studio" class="py-16 md:py-24 bg-[#FAFAF7] text-[#111111] relative overflow-hidden border-t border-[#DDD4C4]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 bg-[#F0EAE1] border border-[#DDD4C4] px-3.5 py-1.5 rounded-full mb-3">
            <span class="w-2 h-2 rounded-full bg-[#FF6B35]"></span>
            <span class="text-[11px] font-bold text-[#111] uppercase tracking-widest font-heading">Online Design Studio</span>
          </div>
          <h2 class="text-3xl md:text-5xl font-bold font-heading tracking-tight text-[#111]">
            Personalize Before You Buy
          </h2>
          <p class="text-xs md:text-sm text-[#666666] mt-3 max-w-xl mx-auto leading-relaxed">
            Type your custom name, choose from 12 curated typography styles, upload your logo and switch between front and back views with instant real-time visual proof.
          </p>
        </div>

        <!-- Studio Workstation Container -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white border border-[#E5DFD4] rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
          
          <!-- Left: Live Visual Canvas (Cols 1-7) -->
          <div class="lg:col-span-7 bg-[#F5F5F5] border border-[#E0DCD3] rounded-2xl p-6 flex flex-col items-center justify-between min-h-[520px] relative">
            
            <!-- Top View Tabs & History Actions -->
            <div class="w-full flex items-center justify-between gap-3 mb-4">
              <!-- Front / Back Switcher -->
              <div class="flex items-center bg-white p-1 rounded-xl border border-[#DDD4C4] shadow-sm">
                <button type="button" id="studio-view-front-btn" class="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#111111] text-white transition-all">
                  Front View
                </button>
                <button type="button" id="studio-view-back-btn" class="px-4 py-1.5 text-xs font-bold rounded-lg text-[#666] hover:text-black transition-all">
                  Back View
                </button>
              </div>

              <!-- Undo, Redo, Reset -->
              <div class="flex items-center gap-1.5">
                <button type="button" id="studio-undo-btn" class="p-2 rounded-lg bg-white border border-[#DDD4C4] hover:border-black text-[#555] hover:text-black transition-all shadow-sm" title="Undo">
                  ${renderIcon('arrowLeft', 'w-3.5 h-3.5')}
                </button>
                <button type="button" id="studio-redo-btn" class="p-2 rounded-lg bg-white border border-[#DDD4C4] hover:border-black text-[#555] hover:text-black transition-all shadow-sm" title="Redo">
                  ${renderIcon('arrowRight', 'w-3.5 h-3.5')}
                </button>
                <button type="button" id="studio-reset-btn" class="px-2.5 py-1.5 text-[11px] font-bold rounded-lg bg-white border border-[#DDD4C4] hover:border-rose-400 text-[#777] hover:text-rose-600 transition-all shadow-sm">
                  Reset
                </button>
              </div>
            </div>

            <!-- Garment Visualizer Stage -->
            <div class="relative w-72 h-88 sm:w-80 sm:h-96 md:w-96 md:h-104 flex items-center justify-center my-auto">
              
              <!-- Garment SVG Base -->
              <svg id="studio-garment-svg" class="w-full h-full drop-shadow-2xl transition-all duration-300" viewBox="0 0 320 340" fill="none">
                <!-- Shirt Base Contour -->
                <path id="studio-svg-base" d="M 105 35 C 125 55 195 55 215 35 L 295 72 C 302 75 305 85 300 92 L 265 145 C 260 152 250 153 243 147 L 228 135 L 228 310 C 228 318 221 325 213 325 L 107 325 C 99 325 92 318 92 310 L 92 135 L 77 147 C 70 153 60 152 55 145 L 20 92 C 15 85 18 75 25 72 Z"
                      fill="#111111" stroke="#333333" stroke-width="2" />
                
                <!-- Collar -->
                <path id="studio-svg-collar" d="M 105 35 C 125 60 195 60 215 35 C 195 48 125 48 105 35 Z" fill="#202020" stroke="#444444" stroke-width="1.5" />
                
                <!-- Sleeve Folds -->
                <path d="M 68 115 L 92 145 M 252 115 L 228 145" stroke="#262626" stroke-width="2" opacity="0.4" />
              </svg>

              <!-- Dynamic Personalization Text Overlay -->
              <div id="studio-preview-overlay" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 select-none">
                
                <!-- Uploaded Logo / Artwork -->
                <div id="studio-overlay-logo" class="hidden mb-3 max-w-[90px] max-h-[90px]">
                  <img id="studio-overlay-logo-img" src="" alt="Custom Logo" class="max-w-full max-h-full object-contain drop-shadow-md">
                </div>

                <!-- Custom Main Name / Text -->
                <div id="studio-overlay-text-wrapper" class="text-center transition-all duration-150 transform">
                  <div id="studio-overlay-text" class="text-2xl font-bold uppercase tracking-wider text-white transition-all break-words leading-tight"
                       style="font-family: 'Space Grotesk', sans-serif; color: #FFFFFF;">
                    PRINTORA
                  </div>
                </div>

                <!-- Custom Number -->
                <div id="studio-overlay-number-wrapper" class="text-center mt-2 transition-all duration-150">
                  <div id="studio-overlay-number" class="text-5xl font-black text-white font-mono leading-none tracking-widest"
                       style="font-family: 'Bebas Neue', sans-serif; color: #FFFFFF;">
                    07
                  </div>
                </div>

              </div>

            </div>

            <!-- Bottom Specs Bar -->
            <div class="w-full flex items-center justify-between text-[11px] text-[#777] pt-3 border-t border-[#E0DCD3]">
              <span id="studio-active-view-label">Currently Viewing: Front Chest</span>
              <span class="text-[#FF6B35] font-bold">100% Cotton Bio-Washed</span>
            </div>

          </div>

          <!-- Right: Controls & Typographic Inspector (Cols 8-12) -->
          <div class="lg:col-span-5 space-y-5">
            
            <!-- 1. Garment & Color Selection -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold uppercase tracking-wider text-[#111] font-heading">1. Garment & Color</label>
                <span id="studio-price-badge" class="font-mono text-xs font-bold text-[#FF6B35] bg-[#FF6B35]/10 px-2 py-0.5 rounded">₹499 (Free Delivery)</span>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-3">
                <button type="button" class="studio-product-pick p-2 rounded-xl border-2 border-black bg-[#FAF8F5] text-center text-xs font-bold text-black" data-product="round-neck" data-price="499" data-name="Round Neck T-shirt">
                  Round Neck (₹499)
                </button>
                <button type="button" class="studio-product-pick p-2 rounded-xl border border-[#DDD4C4] hover:border-black bg-white text-center text-xs font-bold text-[#555]" data-product="oversized" data-price="799" data-name="Oversized T-shirt">
                  Oversized (₹799)
                </button>
                <button type="button" class="studio-product-pick p-2 rounded-xl border border-[#DDD4C4] hover:border-black bg-white text-center text-xs font-bold text-[#555]" data-product="hoodie" data-price="949" data-name="Hoodie">
                  Hoodie (₹949)
                </button>
              </div>

              <!-- Garment Fabric Colors -->
              <div class="flex items-center gap-2" id="studio-garment-colors">
                <button type="button" class="w-7 h-7 rounded-full border-2 border-black shadow-sm bg-[#111111] studio-garment-color-btn" data-color="#111111" title="Black"></button>
                <button type="button" class="w-7 h-7 rounded-full border border-[#DDD] shadow-sm bg-[#FFFFFF] studio-garment-color-btn" data-color="#FFFFFF" title="White"></button>
                <button type="button" class="w-7 h-7 rounded-full border border-transparent shadow-sm bg-[#FF6B35] studio-garment-color-btn" data-color="#FF6B35" title="Orange"></button>
                <button type="button" class="w-7 h-7 rounded-full border border-transparent shadow-sm bg-[#1E2A38] studio-garment-color-btn" data-color="#1E2A38" title="Navy"></button>
                <button type="button" class="w-7 h-7 rounded-full border border-transparent shadow-sm bg-[#4A4A4A] studio-garment-color-btn" data-color="#4A4A4A" title="Grey"></button>
              </div>
            </div>

            <!-- 2. Personalized Text & Number -->
            <div class="space-y-3 bg-[#FAF8F5] border border-[#E5DFD4] p-4 rounded-2xl">
              <label class="text-xs font-bold uppercase tracking-wider text-[#111] font-heading block">2. Text & Numbers</label>
              
              <div>
                <label for="studio-input-name" class="block text-[11px] font-semibold text-[#555] mb-1">Enter Name or Custom Text</label>
                <input type="text" id="studio-input-name" maxlength="24" placeholder="e.g. PRINTORA or YOUR NAME" value="PRINTORA"
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase outline-none transition-colors">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="studio-input-number" class="block text-[11px] font-semibold text-[#555] mb-1">Number (Optional)</label>
                  <input type="text" id="studio-input-number" maxlength="3" placeholder="e.g. 07" value="07"
                         class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold outline-none transition-colors">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-[#555] mb-1">Print Color</label>
                  <div class="flex items-center gap-1.5 pt-1">
                    <button type="button" class="w-6 h-6 rounded-full border-2 border-black bg-white studio-print-color-btn" data-color="#FFFFFF"></button>
                    <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#111111] studio-print-color-btn" data-color="#111111"></button>
                    <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#FF6B35] studio-print-color-btn" data-color="#FF6B35"></button>
                    <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#C5A880] studio-print-color-btn" data-color="#C5A880"></button>
                    <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#00E5FF] studio-print-color-btn" data-color="#00E5FF"></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Typography Selector (12 Google Fonts) -->
            <div>
              <label for="studio-font-select" class="block text-xs font-bold uppercase tracking-wider text-[#111] font-heading mb-1.5">
                3. Typography Style (12 Live Fonts)
              </label>
              <select id="studio-font-select" class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none cursor-pointer">
                ${FONT_LIBRARY.map(f => `
                  <option value="${f.family}" style="font-family: ${f.family};">${f.label}</option>
                `).join('')}
              </select>

              <!-- Typographic Micro-Controls: Size, Alignment, Rotation -->
              <div class="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-[#EFECE4]">
                <!-- Size Slider -->
                <div>
                  <span class="block text-[10px] text-[#777] font-semibold mb-1">Size (<span id="studio-size-label">28px</span>)</span>
                  <input type="range" id="studio-font-size-slider" min="16" max="52" value="28" class="w-full accent-black cursor-pointer">
                </div>

                <!-- Rotation Slider -->
                <div>
                  <span class="block text-[10px] text-[#777] font-semibold mb-1">Angle (<span id="studio-rot-label">0°</span>)</span>
                  <input type="range" id="studio-rot-slider" min="-30" max="30" value="0" class="w-full accent-black cursor-pointer">
                </div>

                <!-- Alignment -->
                <div>
                  <span class="block text-[10px] text-[#777] font-semibold mb-1">Alignment</span>
                  <div class="flex rounded-lg border border-[#DDD4C4] overflow-hidden bg-white">
                    <button type="button" class="studio-align-btn flex-1 py-1 text-center text-xs hover:bg-black hover:text-white" data-align="left">L</button>
                    <button type="button" class="studio-align-btn flex-1 py-1 text-center text-xs bg-black text-white" data-align="center">C</button>
                    <button type="button" class="studio-align-btn flex-1 py-1 text-center text-xs hover:bg-black hover:text-white" data-align="right">R</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. Upload Artwork / Logo -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#111] font-heading mb-1.5">
                4. Upload Artwork / Logo
              </label>
              <div class="border border-dashed border-[#DDD4C4] hover:border-black rounded-xl p-3 bg-white text-center relative cursor-pointer transition-colors">
                <input type="file" id="studio-artwork-upload" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
                <div class="flex items-center justify-center gap-2 text-xs text-[#666]">
                  ${renderIcon('upload', 'w-4 h-4 text-[#FF6B35]')}
                  <span id="studio-upload-label">Select Logo / Graphic File</span>
                </div>
              </div>
            </div>

            <!-- 5. Placement Selection -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#111] font-heading mb-1.5">
                5. Placement Zone
              </label>
              <div class="grid grid-cols-3 gap-1.5" id="studio-placement-options">
                <button type="button" class="studio-placement-btn py-1.5 px-2 rounded-lg border-2 border-black bg-white text-[10px] font-bold text-black" data-placement="center-chest">Center Chest</button>
                <button type="button" class="studio-placement-btn py-1.5 px-2 rounded-lg border border-[#DDD4C4] bg-white text-[10px] font-bold text-[#666]" data-placement="left-chest">Left Chest</button>
                <button type="button" class="studio-placement-btn py-1.5 px-2 rounded-lg border border-[#DDD4C4] bg-white text-[10px] font-bold text-[#666]" data-placement="full-front">Full Front</button>
              </div>
            </div>

            <!-- Action Buttons: Save Design & Add to Cart -->
              <button type="button" id="studio-save-design-btn" class="w-full bg-white hover:bg-[#F5F5F5] border border-[#DDD4C4] hover:border-black text-black font-bold py-3 px-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm">
                ${renderIcon('save', 'w-3.5 h-3.5 text-[#FF6B35]')}
                <span>Save Custom Design</span>
              </button>

              <button type="button" id="studio-add-cart-btn" class="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                ${renderIcon('shoppingBag', 'w-4 h-4')}
                <span id="studio-cart-btn-label">Add Customized Product to Bag (₹499)</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}

// Studio State & History
let studioState = {
  currentView: 'front', // 'front' | 'back'
  selectedProduct: { id: 'prn-app-01', name: 'Round Neck T-shirt', price: 499 },
  garmentColor: '#111111',
  front: {
    text: 'PRINTORA',
    number: '07',
    font: "'Space Grotesk', sans-serif",
    textColor: '#FFFFFF',
    fontSize: 28,
    rotation: 0,
    alignment: 'center',
    placement: 'center-chest',
    logoUrl: null
  },
  back: {
    text: 'PRINTORA',
    number: '07',
    font: "'Space Grotesk', sans-serif",
    textColor: '#FFFFFF',
    fontSize: 34,
    rotation: 0,
    alignment: 'center',
    placement: 'full-back',
    logoUrl: null
  }
};

let undoStack = [];
let redoStack = [];

function pushHistory() {
  undoStack.push(JSON.parse(JSON.stringify(studioState)));
  redoStack = [];
  if (undoStack.length > 20) undoStack.shift();
}

export function initCustomizationStudioEvents() {
  const overlayText = document.getElementById('studio-overlay-text');
  const overlayNumber = document.getElementById('studio-overlay-number');
  const overlayLogo = document.getElementById('studio-overlay-logo');
  const overlayLogoImg = document.getElementById('studio-overlay-logo-img');
  const overlayTextWrapper = document.getElementById('studio-overlay-text-wrapper');
  const svgBase = document.getElementById('studio-svg-base');
  const viewLabel = document.getElementById('studio-active-view-label');

  function renderCurrentView() {
    const current = studioState[studioState.currentView];
    
    // Update texts
    if (overlayText) {
      overlayText.textContent = current.text;
      overlayText.style.fontFamily = current.font;
      overlayText.style.color = current.textColor;
      overlayText.style.fontSize = `${current.fontSize}px`;
      overlayText.style.textAlign = current.alignment;
      if (overlayTextWrapper) {
        overlayTextWrapper.style.transform = `rotate(${current.rotation}deg)`;
      }
    }

    if (overlayNumber) {
      overlayNumber.textContent = current.number;
      overlayNumber.style.color = current.textColor;
      if (!current.number) overlayNumber.classList.add('hidden');
      else overlayNumber.classList.remove('hidden');
    }

    // Logo
    if (overlayLogo && overlayLogoImg) {
      if (current.logoUrl) {
        overlayLogoImg.src = current.logoUrl;
        overlayLogo.classList.remove('hidden');
      } else {
        overlayLogo.classList.add('hidden');
      }
    }

    // Garment color
    if (svgBase) {
      svgBase.setAttribute('fill', studioState.garmentColor);
    }

    if (viewLabel) {
      viewLabel.textContent = `Currently Viewing: ${studioState.currentView === 'front' ? 'Front Side' : 'Back Side'}`;
    }
  }

  // Initial render
  renderCurrentView();

  // Front / Back View Switchers
  const frontBtn = document.getElementById('studio-view-front-btn');
  const backBtn = document.getElementById('studio-view-back-btn');

  if (frontBtn && backBtn) {
    frontBtn.addEventListener('click', () => {
      studioState.currentView = 'front';
      frontBtn.classList.add('bg-[#111111]', 'text-white');
      frontBtn.classList.remove('text-[#666]');
      backBtn.classList.remove('bg-[#111111]', 'text-white');
      backBtn.classList.add('text-[#666]');
      renderCurrentView();
    });

    backBtn.addEventListener('click', () => {
      studioState.currentView = 'back';
      backBtn.classList.add('bg-[#111111]', 'text-white');
      backBtn.classList.remove('text-[#666]');
      frontBtn.classList.remove('bg-[#111111]', 'text-white');
      frontBtn.classList.add('text-[#666]');
      renderCurrentView();
    });
  }

  // Name Input
  const nameInput = document.getElementById('studio-input-name');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      pushHistory();
      studioState[studioState.currentView].text = e.target.value;
      renderCurrentView();
    });
  }

  // Number Input
  const numberInput = document.getElementById('studio-input-number');
  if (numberInput) {
    numberInput.addEventListener('input', (e) => {
      pushHistory();
      studioState[studioState.currentView].number = e.target.value;
      renderCurrentView();
    });
  }

  // Font Selection
  const fontSelect = document.getElementById('studio-font-select');
  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      pushHistory();
      studioState[studioState.currentView].font = e.target.value;
      renderCurrentView();
    });
  }

  // Size Slider
  const sizeSlider = document.getElementById('studio-font-size-slider');
  const sizeLabel = document.getElementById('studio-size-label');
  if (sizeSlider) {
    sizeSlider.addEventListener('input', (e) => {
      studioState[studioState.currentView].fontSize = Number(e.target.value);
      if (sizeLabel) sizeLabel.textContent = `${e.target.value}px`;
      renderCurrentView();
    });
  }

  // Rotation Slider
  const rotSlider = document.getElementById('studio-rot-slider');
  const rotLabel = document.getElementById('studio-rot-label');
  if (rotSlider) {
    rotSlider.addEventListener('input', (e) => {
      studioState[studioState.currentView].rotation = Number(e.target.value);
      if (rotLabel) rotLabel.textContent = `${e.target.value}px`;
      renderCurrentView();
    });
  }

  // Alignment
  document.querySelectorAll('.studio-align-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      pushHistory();
      const align = e.currentTarget.getAttribute('data-align');
      studioState[studioState.currentView].alignment = align;
      document.querySelectorAll('.studio-align-btn').forEach(b => {
        b.classList.remove('bg-black', 'text-white');
      });
      e.currentTarget.classList.add('bg-black', 'text-white');
      renderCurrentView();
    });
  });

  // Print Color Buttons
  document.querySelectorAll('.studio-print-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      pushHistory();
      const color = e.currentTarget.getAttribute('data-color');
      studioState[studioState.currentView].textColor = color;
      document.querySelectorAll('.studio-print-color-btn').forEach(b => b.classList.remove('border-2', 'border-black'));
      e.currentTarget.classList.add('border-2', 'border-black');
      renderCurrentView();
    });
  });

  // Garment Color Buttons
  document.querySelectorAll('.studio-garment-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      pushHistory();
      const color = e.currentTarget.getAttribute('data-color');
      studioState.garmentColor = color;
      document.querySelectorAll('.studio-garment-color-btn').forEach(b => b.classList.remove('border-2', 'border-black'));
      e.currentTarget.classList.add('border-2', 'border-black');
      renderCurrentView();
    });
  });

  // Product Switcher
  document.querySelectorAll('.studio-product-pick').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prod = e.currentTarget.getAttribute('data-product');
      const price = Number(e.currentTarget.getAttribute('data-price'));
      const name = e.currentTarget.getAttribute('data-name');
      
      studioState.selectedProduct = { id: `prn-app-${prod}`, name, price };

      document.querySelectorAll('.studio-product-pick').forEach(b => {
        b.classList.remove('border-2', 'border-black', 'bg-[#FAF8F5]', 'text-black');
        b.classList.add('border-[#DDD4C4]', 'bg-white', 'text-[#555]');
      });
      e.currentTarget.classList.add('border-2', 'border-black', 'bg-[#FAF8F5]', 'text-black');
      e.currentTarget.classList.remove('border-[#DDD4C4]', 'bg-white', 'text-[#555]');

      const priceBadge = document.getElementById('studio-price-badge');
      const cartBtnLabel = document.getElementById('studio-cart-btn-label');
      if (priceBadge) priceBadge.textContent = `₹${price} (Free Delivery)`;
      if (cartBtnLabel) cartBtnLabel.textContent = `Add Customized Product to Bag (₹${price})`;
    });
  });

  // Logo Upload
  const uploadInput = document.getElementById('studio-artwork-upload');
  const uploadLabel = document.getElementById('studio-upload-label');
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          pushHistory();
          studioState[studioState.currentView].logoUrl = event.target.result;
          if (uploadLabel) uploadLabel.textContent = file.name.slice(0, 16) + '...';
          renderCurrentView();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Undo / Redo / Reset
  const undoBtn = document.getElementById('studio-undo-btn');
  const redoBtn = document.getElementById('studio-redo-btn');
  const resetBtn = document.getElementById('studio-reset-btn');

  if (undoBtn) {
    undoBtn.addEventListener('click', () => {
      if (undoStack.length > 0) {
        redoStack.push(JSON.parse(JSON.stringify(studioState)));
        studioState = undoStack.pop();
        renderCurrentView();
      }
    });
  }

  if (redoBtn) {
    redoBtn.addEventListener('click', () => {
      if (redoStack.length > 0) {
        undoStack.push(JSON.parse(JSON.stringify(studioState)));
        studioState = redoStack.pop();
        renderCurrentView();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      pushHistory();
      studioState[studioState.currentView].text = 'PRINTORA';
      studioState[studioState.currentView].number = '07';
      studioState[studioState.currentView].rotation = 0;
      studioState[studioState.currentView].logoUrl = null;
      renderCurrentView();
    });
  }

  // Save Design
  const saveDesignBtn = document.getElementById('studio-save-design-btn');
  if (saveDesignBtn) {
    saveDesignBtn.addEventListener('click', () => {
      store.saveCustomDesign({
        title: `${studioState.selectedProduct.name} - ${studioState.front.text}`,
        productName: studioState.selectedProduct.name,
        color: studioState.garmentColor,
        front: studioState.front,
        back: studioState.back
      });
    });
  }


  // Add to Bag
  const addCartBtn = document.getElementById('studio-add-cart-btn');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      const product = {
        id: studioState.selectedProduct.id,
        name: studioState.selectedProduct.name,
        price: studioState.selectedProduct.price,
        originalPrice: studioState.selectedProduct.price + 200,
        categoryName: 'Apparel',
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [{ name: 'Custom Color', hex: studioState.garmentColor }]
      };

      store.addToCart(product, {
        size: 'L',
        color: studioState.garmentColor,
        quantity: 1,
        customName: studioState.front.text,
        customNumber: studioState.front.number,
        customNotes: `Front: "${studioState.front.text}" (${studioState.front.font}) | Back: "${studioState.back.text}"`,
        frontDesign: studioState.front,
        backDesign: studioState.back
      });

      const cartDrawer = document.getElementById('cart-drawer');
      if (cartDrawer) cartDrawer.classList.remove('hidden');
    });
  }
}
