// PRINTORA Master Application Orchestrator
import { renderNavbar, initNavbarEvents } from './components/Navbar.js';
import { renderHeroBanner, initHeroBannerEvents } from './components/HeroBanner.js';
import { renderProductCatalogue, initProductCatalogueEvents } from './components/ProductCatalogue.js';
import { renderJerseyStudio, initJerseyCustomizerEvents } from './components/JerseyCustomizer.js';
import { renderBulkOrderSection, initBulkOrderEvents } from './components/BulkOrderSection.js';
import { renderFooter } from './components/Footer.js';
import { renderCartDrawer, initCartDrawerEvents } from './components/CartDrawer.js';
import { renderCheckoutModal, initCheckoutModalEvents } from './components/CheckoutModal.js';
import { renderProductDetailModal, openProductDetail, initProductDetailModalEvents } from './components/ProductDetailModal.js';
import { renderPolicyModal, openPolicy, initPolicyModalEvents } from './components/PolicyModal.js';
import { renderAuthModal, initAuthModalEvents } from './components/AuthModal.js';
import { renderAdminDashboard, initAdminEvents } from './components/AdminDashboard.js';
import { renderShirtFlipLoader, hideShirtLoader } from './components/ShirtFlipLoader.js';
import { store } from './services/store.js';

// Expose global helper methods for inline click handlers
window.openProductDetail = openProductDetail;
window.openPolicy = openPolicy;
window.renderProductCard = (p) => {
  import('./components/ProductCard.js').then(m => m.renderProductCard(p));
};
import { renderProductCard } from './components/ProductCard.js';
window.renderProductCard = renderProductCard;
window.filterCategory = (cat) => {
  store.activeCategory = cat;
  store.notify();
  const catSection = document.getElementById('catalogue');
  if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
};

class PrintoraApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.currentHash = window.location.hash || '#catalogue';
    
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
    // Show branded 3D shirt flip loading animation on initial load
    document.body.insertAdjacentHTML('afterbegin', renderShirtFlipLoader(true));
    
    this.render();
    this.attachEventListeners();

    // Dismiss loader smoothly
    hideShirtLoader(900);
  }

  route() {
    if (this.currentHash === '#admin') {
      this.renderAdminOnly();
    } else {
      this.render();
      this.attachEventListeners();

      // Check if hash points to a specific section or policy
      if (this.currentHash.startsWith('#policy-')) {
        const key = this.currentHash.replace('#policy-', '');
        openPolicy(key);
      } else if (this.currentHash.startsWith('#product-')) {
        const id = this.currentHash.replace('#product-', '');
        openProductDetail(id);
      }
    }
  }

  renderAdminOnly() {
    this.appContainer.innerHTML = `
      ${renderAdminDashboard()}
      ${renderPolicyModal()}
    `;
    initAdminEvents();
    initPolicyModalEvents();
  }

  render() {
    this.appContainer.innerHTML = `
      <!-- Toast Notification Bar if active -->
      <div id="printora-toast-container" class="fixed top-5 right-5 z-50 pointer-events-none space-y-2">
        ${store.notification ? `
          <div class="pointer-events-auto bg-[#111111] text-white px-5 py-3 rounded-xl shadow-2xl text-xs flex items-center gap-3 border border-[#333] animate-fade-in">
            <span class="w-2 h-2 rounded-full ${store.notification.type === 'success' ? 'bg-emerald-400' : 'bg-[#C5A880]'}"></span>
            <span>${store.notification.message}</span>
          </div>
        ` : ''}
      </div>

      <!-- Navigation -->
      ${renderNavbar()}

      <!-- Main Storefront Sections -->
      <main>
        ${renderHeroBanner()}
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
      ${renderPolicyModal()}
      ${renderAuthModal()}
    `;
  }

  attachEventListeners() {
    initNavbarEvents();
    initHeroBannerEvents();
    initProductCatalogueEvents();
    initJerseyCustomizerEvents();
    initBulkOrderEvents();
    initCartDrawerEvents();
    initCheckoutModalEvents();
    initProductDetailModalEvents();
    initPolicyModalEvents();
    initAuthModalEvents();
  }

  handleStoreUpdate() {
    // If on admin view, re-render admin
    if (this.currentHash === '#admin') {
      this.renderAdminOnly();
      return;
    }

    // Update cart badge in navbar
    const badge = document.getElementById('nav-cart-badge');
    const count = store.getCartCount();
    if (badge) {
      badge.textContent = count;
      if (count === 0) badge.classList.add('hidden');
      else badge.classList.remove('hidden');
    }

    // Re-render catalogue grid without disrupting whole page scroll
    const grid = document.getElementById('catalogue-products-grid');
    const countDisplay = document.getElementById('cat-count-display');
    if (grid) {
      const filtered = store.getFilteredProducts();
      if (countDisplay) countDisplay.textContent = filtered.length;
      grid.innerHTML = filtered.length === 0 ? `
        <div class="col-span-full py-20 text-center bg-white rounded-2xl border border-[#DDD4C4] p-8">
          <h3 class="font-serif text-2xl font-medium text-black">No products found</h3>
          <p class="text-xs text-[#787673] mt-1">Try another search keyword or reset category filter.</p>
        </div>
      ` : filtered.map(p => window.renderProductCard ? window.renderProductCard(p) : '').join('');
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

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new PrintoraApp();
});
