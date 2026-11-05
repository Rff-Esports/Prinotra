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
            <div class="relative w-72 h-88 sm:w-80 sm:h-96 md:w-96 md:h-104 flex items-center justify-center my-auto rounded-2xl overflow-hidden bg-white/60 border border-[#E0DCD3] shadow-inner">
              
              <!-- Real Garment Mockup Image (Width 200%, Left 0% for Front, Left -100% for Back) -->
              <div class="relative w-full h-full overflow-hidden flex items-center justify-center pointer-events-none select-none">
                <img id="studio-real-mockup"
                     src="/assets/mockups/tshirt_crewneck.png"
                     alt="Real Garment Mockup"
                     class="absolute top-0 h-full w-[200%] max-w-none object-contain transition-all duration-300 pointer-events-none"
                     style="left: 0%; filter: none;">
              </div>

              <!-- Dynamic Personalization Text Overlay -->
              <div id="studio-preview-overlay" class="absolute flex flex-col items-center justify-center pointer-events-none select-none transition-all duration-300 z-10"
                   style="top: 26%; left: 50%; transform: translateX(-50%); width: 50%;">
                
                <!-- Uploaded Logo / Artwork -->
                <div id="studio-overlay-logo" class="hidden mb-2 max-w-[75px] max-h-[75px]">
                  <img id="studio-overlay-logo-img" src="" alt="Custom Logo" class="max-w-full max-h-full object-contain drop-shadow-md">
                </div>

                <!-- Custom Main Name / Text -->
                <div id="studio-overlay-text-wrapper" class="text-center transition-all duration-150 transform w-full">
                  <div id="studio-overlay-text" class="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white transition-all break-words leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
                       style="font-family: 'Space Grotesk', sans-serif; color: #FFFFFF;">
                    PRINTORA
                  </div>
                </div>

                <!-- Custom Number -->
                <div id="studio-overlay-number-wrapper" class="text-center mt-1.5 transition-all duration-150 w-full">
                  <div id="studio-overlay-number" class="text-4xl sm:text-5xl font-black text-white font-mono leading-none tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
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

              <!-- Garment Fabric Colors (7 Colors: White, Black, Red, Grey, Blue, Green, Yellow) -->
              <div class="mt-2">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-semibold text-[#555]">Garment Fabric Color</span>
                  <span id="studio-active-garment-color-name" class="text-[10px] font-bold text-[#FF6B35]">Black (#111111)</span>
                </div>
                <div class="flex items-center gap-2 flex-wrap" id="studio-garment-colors">
                  <button type="button" class="w-8 h-8 rounded-full border-2 border-black ring-2 ring-offset-2 ring-black shadow-sm bg-[#111111] studio-garment-color-btn transition-transform hover:scale-110" data-color="#111111" data-name="Black" title="Black"></button>
                  <button type="button" class="w-8 h-8 rounded-full border border-[#DDD] shadow-sm bg-[#FFFFFF] studio-garment-color-btn transition-transform hover:scale-110" data-color="#FFFFFF" data-name="White" title="White"></button>
                  <button type="button" class="w-8 h-8 rounded-full border border-transparent shadow-sm bg-[#DC2626] studio-garment-color-btn transition-transform hover:scale-110" data-color="#DC2626" data-name="Red" title="Red"></button>
                  <button type="button" class="w-8 h-8 rounded-full border border-transparent shadow-sm bg-[#9CA3AF] studio-garment-color-btn transition-transform hover:scale-110" data-color="#9CA3AF" data-name="Grey" title="Grey"></button>
                  <button type="button" class="w-8 h-8 rounded-full border border-transparent shadow-sm bg-[#2563EB] studio-garment-color-btn transition-transform hover:scale-110" data-color="#2563EB" data-name="Blue" title="Blue"></button>
                  <button type="button" class="w-8 h-8 rounded-full border border-transparent shadow-sm bg-[#16A34A] studio-garment-color-btn transition-transform hover:scale-110" data-color="#16A34A" data-name="Green" title="Green"></button>
                  <button type="button" class="w-8 h-8 rounded-full border border-transparent shadow-sm bg-[#EAB308] studio-garment-color-btn transition-transform hover:scale-110" data-color="#EAB308" data-name="Yellow" title="Yellow"></button>
                </div>
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

              <div>
                <label for="studio-input-number" class="block text-[11px] font-semibold text-[#555] mb-1">Number (Optional)</label>
                <input type="text" id="studio-input-number" maxlength="3" placeholder="e.g. 07" value="07"
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold outline-none transition-colors">
              </div>

              <!-- Dedicated Color Board for Text & Numbers -->
              <div class="pt-2 border-t border-[#E5DFD4]">
                <div class="flex items-center justify-between mb-1.5">
                  <label class="text-[11px] font-bold text-[#333] font-heading">Color Board for Text</label>
                  <span id="studio-active-print-color-name" class="text-[10px] text-[#FF6B35] font-mono font-bold">White (#FFFFFF)</span>
                </div>
                <div class="flex flex-wrap items-center gap-1.5" id="studio-text-color-board">
                  <button type="button" class="w-6 h-6 rounded-full border-2 border-black bg-[#FFFFFF] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#FFFFFF" data-name="White" title="White"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#111111] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#111111" data-name="Black" title="Black"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#DC2626] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#DC2626" data-name="Crimson Red" title="Red"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#F59E0B] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#F59E0B" data-name="Warm Gold" title="Gold"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#FF6B35] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#FF6B35" data-name="Printora Orange" title="Orange"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#10B981] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#10B981" data-name="Emerald Green" title="Green"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#2563EB] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#2563EB" data-name="Royal Blue" title="Blue"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#1E293B] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#1E293B" data-name="Navy" title="Navy"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#8B5CF6] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#8B5CF6" data-name="Purple" title="Purple"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#EC4899] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#EC4899" data-name="Hot Pink" title="Pink"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#06B6D4] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#06B6D4" data-name="Cyan Blue" title="Cyan"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#EAB308] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#EAB308" data-name="Canary Yellow" title="Yellow"></button>
                  <button type="button" class="w-6 h-6 rounded-full border border-[#DDD] bg-[#9CA3AF] shadow-sm studio-print-color-btn transition-transform hover:scale-110" data-color="#9CA3AF" data-name="Silver Grey" title="Grey"></button>
                  <!-- Custom Spectrum Color Picker -->
                  <div class="flex items-center gap-1 pl-1">
                    <input type="color" id="studio-custom-print-color" value="#FFFFFF" class="w-6 h-6 rounded-lg cursor-pointer border border-[#DDD] p-0 bg-transparent overflow-hidden" title="Custom Color Picker">
                    <span class="text-[9px] text-[#777] font-semibold">Custom</span>
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

            <!-- 5. Placement Selection (Left Chest & Right Chest & Center Chest & Full Front) -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#111] font-heading mb-1.5">
                5. Placement Zone
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5" id="studio-placement-options">
                <button type="button" class="studio-placement-btn py-2 px-2 rounded-lg border-2 border-black bg-white text-[11px] font-bold text-black transition-all" data-placement="center-chest">Center Chest</button>
                <button type="button" class="studio-placement-btn py-2 px-2 rounded-lg border border-[#DDD4C4] bg-white text-[11px] font-bold text-[#666] hover:text-black transition-all" data-placement="left-chest">Left Chest</button>
                <button type="button" class="studio-placement-btn py-2 px-2 rounded-lg border border-[#DDD4C4] bg-white text-[11px] font-bold text-[#666] hover:text-black transition-all" data-placement="right-chest">Right Chest</button>
                <button type="button" class="studio-placement-btn py-2 px-2 rounded-lg border border-[#DDD4C4] bg-white text-[11px] font-bold text-[#666] hover:text-black transition-all" data-placement="full-front">Full Front</button>
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

// Mockup images and color filter configurations
const MOCKUP_IMAGES = {
  'round-neck': '/assets/mockups/tshirt_crewneck.png',
  'oversized': '/assets/mockups/tshirt_oversized.png',
  'hoodie': '/assets/mockups/hoodie.png'
};

const GARMENT_COLOR_FILTERS = {
  '#111111': 'none',
  '#FFFFFF': 'invert(0.92) brightness(1.08) contrast(0.95)',
  '#DC2626': 'invert(0.22) sepia(1) saturate(650%) hue-rotate(330deg) brightness(0.88)',
  '#9CA3AF': 'invert(0.52) brightness(0.96) contrast(0.9)',
  '#2563EB': 'invert(0.25) sepia(1) saturate(550%) hue-rotate(195deg) brightness(0.92)',
  '#16A34A': 'invert(0.22) sepia(1) saturate(480%) hue-rotate(85deg) brightness(0.85)',
  '#EAB308': 'invert(0.72) sepia(1) saturate(550%) hue-rotate(12deg) brightness(1.08)'
};

// Studio State & History
let studioState = {
  currentView: 'front', // 'front' | 'back'
  productKey: 'round-neck', // 'round-neck' | 'oversized' | 'hoodie'
  selectedProduct: { id: 'prn-app-01', name: 'Round Neck T-shirt', price: 499 },
  garmentColor: '#111111',
  garmentColorName: 'Black',
  front: {
    text: 'PRINTORA',
    number: '07',
    font: "'Space Grotesk', sans-serif",
    textColor: '#FFFFFF',
    textColorName: 'White',
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
    textColorName: 'White',
    fontSize: 34,
    rotation: 0,
    alignment: 'center',
    placement: 'full-front',
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
  const previewOverlay = document.getElementById('studio-preview-overlay');
  const mockupImg = document.getElementById('studio-real-mockup');
  const viewLabel = document.getElementById('studio-active-view-label');

  function renderCurrentView() {
    const current = studioState[studioState.currentView];
    
    // 1. Update Real Mockup Image & Perspective Slice
    if (mockupImg) {
      const expectedSrc = MOCKUP_IMAGES[studioState.productKey] || MOCKUP_IMAGES['round-neck'];
      if (!mockupImg.src.includes(expectedSrc.replace(/^\//, ''))) {
        mockupImg.src = expectedSrc;
      }
      mockupImg.style.left = studioState.currentView === 'front' ? '0%' : '-100%';
      mockupImg.style.filter = GARMENT_COLOR_FILTERS[studioState.garmentColor] || 'none';
    }

    // 2. Update Placement Zone Position (Center Chest, Left Chest, Right Chest, Full Front)
    const placement = current.placement || 'center-chest';
    if (previewOverlay) {
      if (placement === 'left-chest') {
        // Wearer's Left Chest (Viewer's Right)
        previewOverlay.style.top = '22%';
        previewOverlay.style.left = '64%';
        previewOverlay.style.transform = 'translateX(-50%)';
        previewOverlay.style.width = '30%';
      } else if (placement === 'right-chest') {
        // Wearer's Right Chest (Viewer's Left)
        previewOverlay.style.top = '22%';
        previewOverlay.style.left = '36%';
        previewOverlay.style.transform = 'translateX(-50%)';
        previewOverlay.style.width = '30%';
      } else if (placement === 'full-front') {
        previewOverlay.style.top = '25%';
        previewOverlay.style.left = '50%';
        previewOverlay.style.transform = 'translateX(-50%)';
        previewOverlay.style.width = '62%';
      } else {
        // center-chest
        previewOverlay.style.top = '25%';
        previewOverlay.style.left = '50%';
        previewOverlay.style.transform = 'translateX(-50%)';
        previewOverlay.style.width = '50%';
      }
    }

    // 3. Update Text and Typography
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

    // 4. Update Number
    if (overlayNumber) {
      overlayNumber.textContent = current.number;
      overlayNumber.style.color = current.textColor;
      if (!current.number) overlayNumber.classList.add('hidden');
      else overlayNumber.classList.remove('hidden');
    }

    // 5. Logo
    if (overlayLogo && overlayLogoImg) {
      if (current.logoUrl) {
        overlayLogoImg.src = current.logoUrl;
        overlayLogo.classList.remove('hidden');
      } else {
        overlayLogo.classList.add('hidden');
      }
    }

    if (viewLabel) {
      viewLabel.textContent = `Currently Viewing: ${studioState.currentView === 'front' ? 'Front Side' : 'Back Side'} (${placement.replace('-', ' ').toUpperCase()})`;
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
      if (rotLabel) rotLabel.textContent = `${e.target.value}°`;
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

  // Color Board for Text & Numbers
  const activePrintColorLabel = document.getElementById('studio-active-print-color-name');
  const customColorInput = document.getElementById('studio-custom-print-color');

  document.querySelectorAll('.studio-print-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      pushHistory();
      const color = e.currentTarget.getAttribute('data-color');
      const name = e.currentTarget.getAttribute('data-name') || color;
      studioState[studioState.currentView].textColor = color;
      studioState[studioState.currentView].textColorName = name;

      document.querySelectorAll('.studio-print-color-btn').forEach(b => {
        b.classList.remove('border-2', 'border-black', 'ring-2', 'ring-offset-1', 'ring-black');
      });
      e.currentTarget.classList.add('border-2', 'border-black', 'ring-2', 'ring-offset-1', 'ring-black');

      if (activePrintColorLabel) activePrintColorLabel.textContent = `${name} (${color})`;
      if (customColorInput) customColorInput.value = color;

      renderCurrentView();
    });
  });

  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => {
      const color = e.target.value;
      studioState[studioState.currentView].textColor = color;
      studioState[studioState.currentView].textColorName = 'Custom';
      if (activePrintColorLabel) activePrintColorLabel.textContent = `Custom (${color})`;
      renderCurrentView();
    });
    customColorInput.addEventListener('change', () => pushHistory());
  }

  // Garment Fabric Color Buttons (7 Colors)
  const activeGarmentColorLabel = document.getElementById('studio-active-garment-color-name');
  document.querySelectorAll('.studio-garment-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      pushHistory();
      const color = e.currentTarget.getAttribute('data-color');
      const name = e.currentTarget.getAttribute('data-name') || color;
      studioState.garmentColor = color;
      studioState.garmentColorName = name;

      document.querySelectorAll('.studio-garment-color-btn').forEach(b => {
        b.classList.remove('border-2', 'border-black', 'ring-2', 'ring-offset-2', 'ring-black');
      });
      e.currentTarget.classList.add('border-2', 'border-black', 'ring-2', 'ring-offset-2', 'ring-black');

      if (activeGarmentColorLabel) activeGarmentColorLabel.textContent = `${name} (${color})`;

      renderCurrentView();
    });
  });

  // Placement Selection Buttons (Center Chest, Left Chest, Right Chest, Full Front)
  document.querySelectorAll('.studio-placement-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      pushHistory();
      const placement = e.currentTarget.getAttribute('data-placement');
      studioState[studioState.currentView].placement = placement;

      document.querySelectorAll('.studio-placement-btn').forEach(b => {
        b.classList.remove('border-2', 'border-black', 'text-black');
        b.classList.add('border-[#DDD4C4]', 'text-[#666]');
      });
      e.currentTarget.classList.add('border-2', 'border-black', 'text-black');
      e.currentTarget.classList.remove('border-[#DDD4C4]', 'text-[#666]');

      renderCurrentView();
    });
  });

  // Product Switcher (Round neck, Oversized, Hoodie)
  document.querySelectorAll('.studio-product-pick').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prod = e.currentTarget.getAttribute('data-product');
      const price = Number(e.currentTarget.getAttribute('data-price'));
      const name = e.currentTarget.getAttribute('data-name');
      
      studioState.productKey = prod;
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

      renderCurrentView();
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
      const mockupImgSrc = MOCKUP_IMAGES[studioState.productKey] || MOCKUP_IMAGES['round-neck'];
      const colorLabel = studioState.garmentColorName || 'Custom Color';

      const product = {
        id: studioState.selectedProduct.id,
        name: studioState.selectedProduct.name,
        price: studioState.selectedProduct.price,
        originalPrice: studioState.selectedProduct.price + 200,
        categoryName: 'Apparel',
        images: [mockupImgSrc],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [{ name: colorLabel, hex: studioState.garmentColor }]
      };

      store.addToCart(product, {
        size: 'L',
        color: colorLabel,
        quantity: 1,
        customName: studioState.front.text,
        customNumber: studioState.front.number,
        customNotes: `${studioState.selectedProduct.name} (${colorLabel}) | Zone: ${(studioState.front.placement || 'center-chest').replace('-', ' ')} | Front: "${studioState.front.text}" (${studioState.front.font}) | Back: "${studioState.back.text}"`,
        frontDesign: studioState.front,
        backDesign: studioState.back
      });

      const cartDrawer = document.getElementById('cart-drawer');
      if (cartDrawer) cartDrawer.classList.remove('hidden');
    });
  }
}
