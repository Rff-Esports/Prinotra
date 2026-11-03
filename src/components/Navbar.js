// PRINTORA Premium Navigation Bar Component
import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';

export function renderNavbar() {
  const cartCount = store.getCartCount();
  const settings = store.settings;

  return `
    <!-- Top Announcement Bar -->
    <aside class="bg-[#0A0A0A] text-[#C5A880] text-[11px] font-medium py-2 px-4 text-center tracking-wider border-b border-[#1A1A1A] flex items-center justify-center gap-2" aria-label="Announcement">
      <span class="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse"></span>
      <span>${settings.announcementBanner}</span>
    </aside>

    <!-- Main Sticky Navigation -->
    <nav class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E0D5] transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Mobile Menu Trigger -->
          <div class="flex items-center lg:hidden">
            <button id="mobile-menu-btn" class="p-2 text-black hover:text-[#997A52] rounded-lg transition-colors" aria-label="Open Navigation Menu">
              ${renderIcon('menu', 'w-6 h-6')}
            </button>
          </div>

          <!-- Brand Identity (Cinzel Luxury Typography) -->
          <div class="flex items-center">
            <a href="#catalogue" class="flex flex-col items-center sm:items-start group">
              <span class="brand-title text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-[#0A0A0A] group-hover:text-[#997A52] transition-colors">
                PRINTORA
              </span>
              <span class="text-[9px] tracking-[0.35em] text-[#787673] uppercase font-semibold -mt-1 group-hover:text-black transition-colors">
                MAKE IT YOURS.
              </span>
            </a>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-[#333]">
            <a href="#catalogue" class="hover:text-[#997A52] transition-colors py-2">
              All Products
            </a>
            <a href="#custom-jersey" class="hover:text-[#997A52] transition-colors py-2 flex items-center gap-1.5">
              <span>Custom Jerseys</span>
              <span class="bg-[#0A0A0A] text-[#C5A880] text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">₹499</span>
            </a>
            <a href="#bulk-orders" class="hover:text-[#997A52] transition-colors py-2">
              Bulk & Corporate
            </a>
            <a href="#about-us" data-policy="about" class="hover:text-[#997A52] transition-colors py-2">
              About
            </a>
            <a href="#contact-us" data-policy="contact" class="hover:text-[#997A52] transition-colors py-2">
              Contact
            </a>
          </div>

          <!-- Right Action Controls -->
          <div class="flex items-center space-x-2 sm:space-x-4">
            
            <!-- Search Toggle Trigger -->
            <button id="nav-search-btn" class="p-2 text-[#333] hover:text-[#997A52] rounded-full hover:bg-[#F0EAE1] transition-colors" title="Search Products" aria-label="Search Products">
              ${renderIcon('search', 'w-5 h-5')}
            </button>

            <!-- Customer / Admin Auth Trigger -->
            <button id="nav-account-btn" class="p-2 text-[#333] hover:text-[#997A52] rounded-full hover:bg-[#F0EAE1] transition-colors" title="Account / Admin" aria-label="Account / Admin">
              ${renderIcon('user', 'w-5 h-5')}
            </button>

            <!-- Shopping Bag Drawer Trigger -->
            <button id="nav-cart-btn" class="relative p-2.5 bg-[#0A0A0A] text-white hover:bg-[#997A52] hover:text-black rounded-full transition-all duration-300 shadow-md flex items-center justify-center" aria-label="Shopping Bag">
              ${renderIcon('shoppingBag', 'w-5 h-5')}
              <span id="nav-cart-badge" class="absolute -top-1 -right-1 bg-[#C5A880] text-black font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${cartCount === 0 ? 'hidden' : ''}">
                ${cartCount}
              </span>
            </button>

          </div>

        </div>
      </div>
    </nav>

    <!-- Mobile Slide-Down Drawer Menu -->
    <div id="mobile-menu-drawer" class="hidden lg:hidden bg-white border-b border-[#DDD4C4] px-6 py-6 space-y-4 text-xs font-semibold uppercase tracking-wider text-[#333] shadow-xl animate-fade-in">
      <a href="#catalogue" class="block py-2 border-b border-[#F0EAE1] hover:text-[#997A52]">All Products</a>
      <a href="#custom-jersey" class="block py-2 border-b border-[#F0EAE1] text-[#997A52] flex items-center justify-between">
        <span>Custom Jerseys (From ₹499)</span>
        <span class="bg-[#0A0A0A] text-[#C5A880] text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">POPULAR</span>
      </a>
      <a href="#bulk-orders" class="block py-2 border-b border-[#F0EAE1] hover:text-[#997A52]">Bulk & Corporate Enquiries</a>
      <a href="#about-us" data-policy="about" class="block py-2 border-b border-[#F0EAE1] hover:text-[#997A52]">About Us</a>
      <a href="#contact-us" data-policy="contact" class="block py-2 border-b border-[#F0EAE1] hover:text-[#997A52]">Contact & Location</a>
      <a href="#admin" class="block py-2 text-[#997A52] font-mono font-bold">Admin Portal Login →</a>
    </div>
  `;
}

export function initNavbarEvents() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const searchBtn = document.getElementById('nav-search-btn');
  const accountBtn = document.getElementById('nav-account-btn');
  const authModal = document.getElementById('auth-modal');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileDrawer.classList.add('hidden'));
    });
  }

  if (accountBtn && authModal) {
    accountBtn.addEventListener('click', () => {
      authModal.classList.remove('hidden');
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const searchInput = document.getElementById('catalogue-search-input');
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchInput.focus();
      }
    });
  }
}
