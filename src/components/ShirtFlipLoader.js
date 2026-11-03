// Signature PRINTORA Shirt Flip Loading Animation (Requirement 23.C)

export function renderShirtFlipLoader(isVisible = true) {
  return `
    <div id="printora-shirt-loader" class="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col items-center justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}" aria-live="polite" aria-label="Loading PRINTORA">
      <div class="perspective-1000 flex flex-col items-center justify-center p-8">
        
        <!-- 3D Flipping Shirt -->
        <div class="relative w-44 h-48 md:w-52 md:h-56 flex items-center justify-center">
          <div class="shirt-3d-box relative w-full h-full flex items-center justify-center">
            
            <!-- Realistic Luxury 3D T-Shirt Graphic -->
            <svg class="w-full h-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="shirtGrad" x1="20" y1="20" x2="180" y2="200" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#262626" />
                  <stop offset="40%" stop-color="#141414" />
                  <stop offset="100%" stop-color="#0A0A0A" />
                </linearGradient>
                <linearGradient id="goldAccent" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#EAD6B8" />
                  <stop offset="50%" stop-color="#C5A880" />
                  <stop offset="100%" stop-color="#997A52" />
                </linearGradient>
                <radialGradient id="specularHighlight" cx="30%" cy="20%" r="60%">
                  <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.18" />
                  <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
                </radialGradient>
              </defs>
              
              <!-- Shirt Body & Sleeves Outline -->
              <path d="M 68 28 C 76 38 124 38 132 28 L 182 48 C 187 50 188 56 185 61 L 165 98 C 162 103 156 104 151 101 L 142 95 L 142 198 C 142 203 138 207 133 207 L 67 207 C 62 207 58 203 58 198 L 58 95 L 49 101 C 44 104 38 103 35 98 L 15 61 C 12 56 13 50 18 48 Z" 
                    fill="url(#shirtGrad)" stroke="#383838" stroke-width="1.5" />
              
              <!-- Specular 3D Lighting Sheen -->
              <path d="M 68 28 C 76 38 124 38 132 28 L 182 48 C 187 50 188 56 185 61 L 165 98 C 162 103 156 104 151 101 L 142 95 L 142 198 C 142 203 138 207 133 207 L 67 207 C 62 207 58 203 58 198 L 58 95 L 49 101 C 44 104 38 103 35 98 L 15 61 C 12 56 13 50 18 48 Z" 
                    fill="url(#specularHighlight)" />

              <!-- Ribbed Collar -->
              <path d="M 68 28 C 80 42 120 42 132 28 C 122 36 78 36 68 28 Z" fill="#0A0A0A" stroke="#444444" stroke-width="1" />
              
              <!-- Refined PRINTORA Chest Emblem on Shirt -->
              <g transform="translate(100, 105)">
                <!-- Crest Line -->
                <line x1="-32" y1="-18" x2="32" y2="-18" stroke="url(#goldAccent)" stroke-width="1.2" stroke-linecap="round" opacity="0.85" />
                <text x="0" y="-3" text-anchor="middle" fill="#FFFFFF" font-family="'Cinzel', serif" font-weight="700" font-size="13" letter-spacing="3.5">PRINTORA</text>
                <text x="0" y="14" text-anchor="middle" fill="url(#goldAccent)" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="6.5" letter-spacing="2.2">MAKE IT YOURS.</text>
                <line x1="-20" y1="24" x2="20" y2="24" stroke="url(#goldAccent)" stroke-width="0.8" stroke-linecap="round" opacity="0.6" />
              </g>
            </svg>
            
          </div>
        </div>

        <!-- 3D Shadow Base -->
        <div class="shirt-shadow w-36 h-3 bg-black/60 rounded-[100%] blur-md mt-6"></div>

        <!-- Brand Typography -->
        <div class="mt-8 text-center">
          <h2 class="text-white text-xl md:text-2xl font-bold tracking-[0.25em] brand-title">PRINTORA</h2>
          <p class="text-[#C5A880] text-xs uppercase tracking-[0.3em] font-medium mt-1.5">MAKE IT YOURS.</p>
        </div>

        <!-- Subtle Loading Indicator -->
        <div class="w-32 h-[2px] bg-[#222222] rounded-full overflow-hidden mt-6">
          <div class="w-full h-full bg-[#C5A880] animate-[pulse_1.5s_ease-in-out_infinite]"></div>
        </div>

      </div>
    </div>
  `;
}

export function hideShirtLoader(delayMs = 800) {
  setTimeout(() => {
    const el = document.getElementById('printora-shirt-loader');
    if (el) {
      el.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => el.remove(), 700);
    }
  }, delayMs);
}
