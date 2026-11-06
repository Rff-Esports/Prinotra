// PRINTORA Progressive Web App (PWA) Install Manager
// Handles beforeinstallprompt, Service Worker registration, and iOS Add-to-HomeScreen guidance

let deferredInstallPrompt = null;

export function initPwa() {
  // 1. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('✅ [PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('⚠️ [PWA] Service Worker registration failed:', err);
        });
    });
  }

  // 2. Listen for beforeinstallprompt event (Chrome, Edge, Android)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;

    // Show install buttons in Navbar and Mobile Menu
    const navBtn = document.getElementById('pwa-install-nav-btn');
    if (navBtn) navBtn.classList.remove('hidden');

    const drawerBtn = document.getElementById('pwa-install-mobile-drawer-btn');
    if (drawerBtn) drawerBtn.classList.remove('hidden');

    // Show floating mobile bottom banner if not dismissed this session
    showPwaBottomBanner();
  });

  // 3. Listen for appinstalled event
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    hidePwaBottomBanner();
    const navBtn = document.getElementById('pwa-install-nav-btn');
    if (navBtn) navBtn.classList.add('hidden');
    console.log('🎉 [PWA] Printora app successfully installed!');
  });

  // 4. Attach event listeners to all install triggers
  document.addEventListener('click', (e) => {
    const installTrigger = e.target.closest('#pwa-install-nav-btn, #pwa-install-mobile-drawer-btn, #pwa-banner-install-btn');
    if (installTrigger) {
      triggerPwaInstall();
      return;
    }

    const dismissBtn = e.target.closest('#pwa-banner-dismiss-btn');
    if (dismissBtn) {
      hidePwaBottomBanner();
      try {
        sessionStorage.setItem('printora_pwa_dismissed', 'true');
      } catch (err) {}
      return;
    }

    const closeIosModal = e.target.closest('#pwa-ios-modal-close-btn');
    if (closeIosModal) {
      const modal = document.getElementById('pwa-ios-modal');
      if (modal) modal.remove();
      return;
    }
  });

  // Check if iOS Safari user hasn't installed yet
  setTimeout(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (!isStandalone) {
      const navBtn = document.getElementById('pwa-install-nav-btn');
      if (navBtn && !deferredInstallPrompt && isIosDevice()) {
        navBtn.classList.remove('hidden');
      }
    }
  }, 2000);
}

export function triggerPwaInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
        hidePwaBottomBanner();
      }
      deferredInstallPrompt = null;
    });
  } else if (isIosDevice()) {
    showIosInstallModal();
  } else {
    // If browser doesn't support beforeinstallprompt directly, offer instructions
    alert("To install PRINTORA on your device:\n\nTap your browser menu (⋮ or Share) and select 'Add to Home Screen' or 'Install App'.");
  }
}

function isIosDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function renderPwaBottomBanner() {
  const isDismissed = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('printora_pwa_dismissed') === 'true';
  const isStandalone = typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);

  if (isDismissed || isStandalone) return '';

  return `
    <div id="pwa-install-banner" class="hidden fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#111111] text-white border border-[#333] p-4 rounded-2xl shadow-2xl animate-fade-in flex items-center justify-between gap-3 font-sans">
      <div class="flex items-center gap-3 min-w-0">
        <img src="/assets/logo.png" alt="PRINTORA App" class="w-12 h-12 rounded-xl object-contain bg-white p-1 flex-shrink-0 shadow-md">
        <div class="truncate">
          <strong class="block text-xs font-heading font-bold text-white tracking-wide">Install PRINTORA App</strong>
          <span class="text-[11px] text-[#AAA] block truncate">1-tap shopping & instant tracking</span>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button type="button" id="pwa-banner-install-btn" class="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-xl shadow transition-colors cursor-pointer font-heading">
          Install
        </button>
        <button type="button" id="pwa-banner-dismiss-btn" class="text-[#777] hover:text-white p-1 rounded-lg transition-colors cursor-pointer" aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  `;
}

function showPwaBottomBanner() {
  const isDismissed = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('printora_pwa_dismissed') === 'true';
  if (isDismissed) return;
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.classList.remove('hidden');
  }
}

function hidePwaBottomBanner() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.classList.add('hidden');
  }
}

function showIosInstallModal() {
  const existing = document.getElementById('pwa-ios-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'pwa-ios-modal';
  modal.className = 'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in';
  modal.innerHTML = `
    <div class="w-full max-w-sm bg-[#1A1A1A] border border-[#333] rounded-3xl p-6 text-white shadow-2xl relative space-y-4">
      <button type="button" id="pwa-ios-modal-close-btn" class="absolute top-4 right-4 text-[#888] hover:text-white text-sm p-1">
        ✕
      </button>

      <div class="flex items-center gap-3">
        <img src="/assets/logo.png" alt="PRINTORA" class="w-12 h-12 rounded-xl bg-white p-1 shadow">
        <div>
          <h3 class="font-heading font-bold text-sm text-white">Install PRINTORA on iOS</h3>
          <p class="text-[11px] text-[#888]">Follow 2 quick steps to add to your Home Screen</p>
        </div>
      </div>

      <div class="space-y-3 bg-[#111] p-3.5 rounded-2xl border border-[#2A2A2A] text-xs">
        <div class="flex items-start gap-2.5">
          <span class="w-5 h-5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
          <p class="text-[#CCC]">Tap the <strong class="text-white">Share</strong> button <span class="text-sm">📤</span> at the bottom of Safari.</p>
        </div>
        <div class="flex items-start gap-2.5">
          <span class="w-5 h-5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
          <p class="text-[#CCC]">Scroll down and tap <strong class="text-white">Add to Home Screen ➕</strong>.</p>
        </div>
      </div>

      <button type="button" onclick="document.getElementById('pwa-ios-modal')?.remove()" class="w-full bg-[#FF6B35] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider font-heading">
        Got It
      </button>
    </div>
  `;
  document.body.appendChild(modal);
}
