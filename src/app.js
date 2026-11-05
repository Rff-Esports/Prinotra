// PRINTORA Master Application Orchestrator
// Brand: PRINTORA | Tagline: "YOU IMAGINE. WE PRINT."
// Official Domain: https://printoracustom.in | WhatsApp: +91 8106992102

import { renderNavbar, initNavbarEvents } from './components/Navbar.js';
import { renderHeroBanner, initHeroBannerEvents } from './components/HeroBanner.js';
import { renderCustomizationStudioSection, initCustomizationStudioEvents } from './components/CustomizationStudio.js';
import { renderProductCatalogue, initProductCatalogueEvents } from './components/ProductCatalogue.js';
import { renderJerseyStudio, initJerseyCustomizerEvents } from './components/JerseyCustomizer.js';
import { renderBulkOrderSection, initBulkOrderEvents } from './components/BulkOrderSection.js';
import { renderFooter } from './components/Footer.js';
import { renderCartDrawer, initCartDrawerEvents } from './components/CartDrawer.js';
import { renderCheckoutModal, initCheckoutModalEvents } from './components/CheckoutModal.js';
import { renderProductDetailModal, openProductDetail, initProductDetailModalEvents } from './components/ProductDetailModal.js';
import { renderCustomerAccountModal, openCustomerAccountModal, initCustomerAccountEvents } from './components/CustomerAccountModal.js';
import { renderPolicyModal, openPolicy, initPolicyModalEvents } from './components/PolicyModal.js';
import { renderAuthModal, openAuthModal, initAuthModalEvents } from './components/AuthModal.js';
import { renderAdminDashboard, initAdminEvents } from './components/AdminDashboard.js';
import { renderShirtFlipLoader, hideShirtLoader } from './components/ShirtFlipLoader.js';
import { renderProductCard } from './components/ProductCard.js';
import { store } from './services/store.js';

// Expose global helper methods for inline click handlers
window.openProductDetail = openProductDetail;
window.openCustomerAccountModal = openCustomerAccountModal;
window.openAuthModal = openAuthModal;
window.openPolicy = openPolicy;
window.renderProductCard = renderProductCard;

window.filterCategory = (cat) => {
  store.activeCategory = cat;
  store.notify();
  const catSection = document.getElementById('catalogue');
  if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
};

window.toggleWishlist = (productId) => {
  const prod = store.products.find(p => p.id === productId);
  if (!prod) return;
  if (store.isInWishlist(productId)) {
    store.removeFromWishlist(productId);
  } else {
    store.addToWishlist(prod);
  }
  store.notify();
};

class PrintoraApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.currentHash = window.location.hash || '';
    
    // Subscribe to store updates
    store.subscribe(() => this.handleStoreUpdate());

    // Window navigation hash listener
    window.addEventListener('hashchange', () => {
      this.currentHash = window.location.hash;
      this.route();
    });

    this.init();
  }

  init() {
    // Smooth transition from initial boot loader
    const bootLoader = document.getElementById('printora-initial-boot');
    if (bootLoader) {
      bootLoader.style.transition = 'opacity 0.3s ease-out';
      bootLoader.style.opacity = '0';
      setTimeout(() => bootLoader.remove(), 300);
    }

    // Ensure no blocking overlays remain in the DOM
    const oldLoader = document.getElementById('printora-shirt-loader');
    if (oldLoader) oldLoader.remove();

    // Initialize Smooth Offline / Online Status Listener
    this.initNetworkStatusListener();

    // Route immediately on initial page mount (supports direct links like #admin or ?admin=1)
    this.route();

    // Global keyboard shortcut to open Admin Portal: Ctrl+Shift+A or Cmd+Shift+A
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.hash = '#admin';
        this.route();
      }
    });

    // Also listen to popstate for history navigation
    window.addEventListener('popstate', () => {
      this.currentHash = window.location.hash || '';
      this.route();
    });
  }

  initNetworkStatusListener() {
    const updateNetworkStatus = () => {
      let statusEl = document.getElementById('printora-network-status');
      if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'printora-network-status';
        statusEl.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none';
        document.body.appendChild(statusEl);
      }

      if (!navigator.onLine) {
        statusEl.innerHTML = `
          <div class="pointer-events-auto bg-[#1A1A1A]/95 text-white border border-amber-500/40 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-fade-in text-xs font-medium">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0"></span>
            <span><strong>Offline Mode:</strong> No internet connection. Your bag, designs & cart are safely saved locally.</span>
          </div>
        `;
        statusEl.classList.remove('hidden');
      } else {
        if (statusEl.innerHTML.includes('Offline Mode')) {
          statusEl.innerHTML = `
            <div class="pointer-events-auto bg-[#111]/95 text-white border border-emerald-500/40 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-fade-in text-xs font-medium">
              <span class="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
              <span><strong>Back Online!</strong> Reconnected to Printora.</span>
            </div>
          `;
          setTimeout(() => {
            if (statusEl) statusEl.classList.add('hidden');
          }, 3000);
        }
      }
    };

    window.addEventListener('offline', updateNetworkStatus);
    window.addEventListener('online', updateNetworkStatus);
    if (!navigator.onLine) updateNetworkStatus();
  }

  route() {
    this.currentHash = window.location.hash || '';
    const search = window.location.search || '';
    const hashLower = this.currentHash.toLowerCase();
    
    // Check if admin is requested via hash or query param
    const isNowAdmin = hashLower === '#admin' || 
                       hashLower.startsWith('#admin') || 
                       search.includes('admin=true') || 
                       search.includes('admin=1') ||
                       search.includes('admin=portal');
    const wasAdmin = this.isAdminView === true;

    if (isNowAdmin) {
      this.isAdminView = true;
      this.renderAdminOnly();
      window.scrollTo(0, 0);
      return;
    }

    if (wasAdmin && !isNowAdmin) {
      this.isAdminView = false;
      this.render();
      this.attachEventListeners();
    } else if (!this.appContainer.querySelector('#navbar')) {
      // First boot for storefront
      this.isAdminView = false;
      this.render();
      this.attachEventListeners();
    }

    if (this.currentHash.startsWith('#policy-')) {
      const key = this.currentHash.replace('#policy-', '');
      openPolicy(key);
    } else if (this.currentHash.startsWith('#product-')) {
      const id = this.currentHash.replace('#product-', '');
      openProductDetail(id);
    } else if (this.currentHash === '#account') {
      openCustomerAccountModal();
    } else if (this.currentHash && this.currentHash.length > 1) {
      const targetEl = document.querySelector(this.currentHash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  renderAdminOnly() {
    try {
      this.appContainer.innerHTML = `
        ${renderAdminDashboard()}
        ${renderPolicyModal()}
      `;
      initAdminEvents();
      initPolicyModalEvents();
    } catch (err) {
      console.error("Admin render failed:", err);
      this.appContainer.innerHTML = `
        <div class="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
          <h2 class="text-xl font-bold text-[#FF6B35] mb-2">Admin Loading Error</h2>
          <p class="text-xs text-[#AAA] mb-4">${err.message}</p>
          <a href="#catalogue" class="text-xs bg-[#222] px-4 py-2 rounded-lg text-white">Return to Store</a>
        </div>
      `;
    }
  }

  render() {
    this.appContainer.innerHTML = `
      <!-- Toast Notification Bar if active -->
      <div id="printora-toast-container" class="fixed top-5 right-5 z-50 pointer-events-none space-y-2">
        ${store.notification ? `
          <div class="pointer-events-auto bg-[#111111] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs flex items-center gap-3 border border-[#333] animate-fade-in font-medium">
            <span class="w-2 h-2 rounded-full ${store.notification.type === 'success' ? 'bg-emerald-400' : 'bg-[#FF6B35]'}"></span>
            <span>${store.notification.message}</span>
          </div>
        ` : ''}
      </div>

      <!-- Navigation -->
      ${renderNavbar()}

      <!-- Main Storefront Sections -->
      <main>
        ${renderHeroBanner()}
        ${renderCustomizationStudioSection()}
        ${renderProductCatalogue()}
        ${renderJerseyStudio()}
        ${renderBulkOrderSection()}
      </main>

      <!-- Footer & Floating WhatsApp -->
      ${renderFooter()}

      <!-- Global Modals & Drawers -->
      ${renderCartDrawer()}
      ${renderCheckoutModal()}
      ${renderProductDetailModal()}
      ${renderCustomerAccountModal()}
      ${renderPolicyModal()}
      ${renderAuthModal()}
    `;
  }

  attachEventListeners() {
    initNavbarEvents();
    initHeroBannerEvents();
    initCustomizationStudioEvents();
    initProductCatalogueEvents();
    initJerseyCustomizerEvents();
    initBulkOrderEvents();
    initCartDrawerEvents();
    initCheckoutModalEvents();
    initProductDetailModalEvents();
    initCustomerAccountEvents();
    initPolicyModalEvents();
    initAuthModalEvents();
  }

  handleStoreUpdate() {
    if (this.currentHash === '#admin') {
      this.renderAdminOnly();
      return;
    }

    // Update cart badge in navbar
    const cartBadge = document.getElementById('nav-cart-badge');
    const cartCount = store.getCartCount();
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      if (cartCount === 0) cartBadge.classList.add('hidden');
      else cartBadge.classList.remove('hidden');
    }

    // Update wishlist badge in navbar
    const wishBadge = document.getElementById('nav-wishlist-badge');
    const wishCount = store.getWishlistCount();
    if (wishBadge) {
      wishBadge.textContent = wishCount;
      if (wishCount === 0) wishBadge.classList.add('hidden');
      else wishBadge.classList.remove('hidden');
    }

    // Re-render catalogue grid without disrupting whole page scroll
    const grid = document.getElementById('catalogue-products-grid');
    const countDisplay = document.getElementById('cat-count-display');
    if (grid) {
      const filtered = store.getFilteredProducts();
      if (countDisplay) countDisplay.textContent = filtered.length;
      grid.innerHTML = filtered.length === 0 ? `
        <div class="col-span-full py-20 text-center bg-white rounded-3xl border border-[#DDD4C4] p-8">
          <h3 class="font-heading text-2xl font-bold text-black">No products found</h3>
          <p class="text-xs text-[#777] mt-1">Try another search keyword or reset category filter.</p>
        </div>
      ` : filtered.map(p => window.renderProductCard ? window.renderProductCard(p) : '').join('');
    }

    // Update gender recommendations block if present
    const genderContainer = document.getElementById('gender-recommendations');
    if (genderContainer && typeof window.renderGenderRecommendations === 'function') {
      genderContainer.outerHTML = window.renderGenderRecommendations(store.getUserGender());
    }


    // Update cart drawer contents
    const drawerContainer = document.getElementById('cart-drawer');
    if (drawerContainer) {
      const temp = document.createElement('div');
      temp.innerHTML = renderCartDrawer();
      const newDrawer = temp.querySelector('#cart-drawer');
      if (newDrawer) {
        drawerContainer.innerHTML = newDrawer.innerHTML;
      }
    }
  }
}

// Instantiate on DOM load or immediately if already parsed
function bootPrintora() {
  if (!window.printoraApp) {
    window.printoraApp = new PrintoraApp();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootPrintora);
} else {
  bootPrintora();
}
