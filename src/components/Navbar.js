// PRINTORA Premium Navigation Bar Component
// Section 4: Home, Shop, Customize, Custom Jerseys, Personalized Gifts, Corporate & Bulk, About, Contact
// Header: Logo, Search, Account, Wishlist, Cart, Mobile Menu

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { openCustomerAccountModal } from './CustomerAccountModal.js';
import { openAuthModal } from './AuthModal.js';

export function renderNavbar() {
  const cartCount = store.getCartCount();
  const wishlistCount = store.getWishlistCount();
  const settings = store.settings;

  return `
    <!-- Top Announcement Bar (Strict Free Delivery Notice & Coupon) -->
    <aside class="bg-[#111111] text-[#FF6B35] text-[11px] font-bold py-2 px-4 text-center tracking-wider border-b border-[#222] flex items-center justify-center gap-2 font-heading" aria-label="Announcement">
      <span class="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse"></span>
      <span class="text-white">${settings.announcementBanner || "FREE SHIPPING ACROSS INDIA • USE COUPON 'PRINTORA 25' FOR FLAT ₹25 OFF ON MRP!"}</span>
    </aside>

    <!-- Main Sticky Navigation -->
    <nav class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5DFD4] transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Mobile Menu Trigger -->
          <div class="flex items-center lg:hidden">
            <button id="mobile-menu-btn" class="p-2 text-black hover:text-[#FF6B35] rounded-xl transition-colors" aria-label="Open Navigation Menu">
              ${renderIcon('menu', 'w-6 h-6')}
            </button>
          </div>

          <!-- Brand Logo & Identity -->
          <div class="flex items-center">
            <a href="#" class="flex flex-col items-center sm:items-start group">
              <span class="font-heading text-2xl sm:text-3xl font-black tracking-[0.15em] text-[#111111] group-hover:text-[#FF6B35] transition-colors">
                PRINTORA
              </span>
              <span class="text-[9px] tracking-[0.3em] text-[#777] uppercase font-bold -mt-1 group-hover:text-black transition-colors font-heading">
                YOU IMAGINE. WE PRINT.
              </span>
            </a>
          </div>

          <!-- Desktop Navigation Links (Section 4) -->
          <div class="hidden lg:flex items-center space-x-7 text-xs font-bold uppercase tracking-wider text-[#333]">
            <a href="#" class="hover:text-[#FF6B35] transition-colors py-2 font-heading">
              Home
            </a>
            <a href="#catalogue" class="hover:text-[#FF6B35] transition-colors py-2 font-heading">
              Shop
            </a>
            <a href="#custom-studio" class="hover:text-[#FF6B35] transition-colors py-2 font-heading flex items-center gap-1">
              <span>Customize</span>
              <span class="bg-[#111] text-white text-[9px] px-1.5 py-0.5 rounded-full">STUDIO</span>
            </a>
            <a href="#studio-3d" class="hover:text-[#FF6B35] transition-colors py-2 font-heading flex items-center gap-1">
              <span>3D Studio</span>
              <span class="bg-[#FF6B35] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">360°</span>
            </a>
            <a href="#custom-jersey" class="hover:text-[#FF6B35] transition-colors py-2 font-heading flex items-center gap-1">
              <span>Custom Jerseys</span>
              <span class="text-[#FF6B35] font-mono">₹499</span>
            </a>
            <a href="#catalogue" onclick="window.filterCategory('personalized-gifts')" class="hover:text-[#FF6B35] transition-colors py-2 font-heading">
              Personalized Gifts
            </a>
            <a href="#bulk-orders" class="hover:text-[#FF6B35] transition-colors py-2 font-heading">
              Corporate & Bulk
            </a>
            <a href="#about-us" data-policy="about" class="hover:text-[#FF6B35] transition-colors py-2 font-heading">
              About Us
            </a>
            <a href="#contact-us" data-policy="contact" class="hover:text-[#FF6B35] transition-colors py-2 font-heading">
              Contact
            </a>
          </div>

          <!-- Right Action Controls (Header Suite) -->
          <div class="flex items-center space-x-2 sm:space-x-3">
            
            <!-- Search Trigger -->
            <button id="nav-search-btn" class="p-2 text-[#333] hover:text-[#FF6B35] rounded-full hover:bg-[#F5F5F5] transition-colors" title="Search Products" aria-label="Search Products">
              ${renderIcon('search', 'w-5 h-5')}
            </button>

            <!-- Wishlist Trigger -->
            <button id="nav-wishlist-btn" class="relative p-2 text-[#333] hover:text-[#FF6B35] rounded-full hover:bg-[#F5F5F5] transition-colors" title="My Wishlist" aria-label="My Wishlist">
              ${renderIcon('heart', 'w-5 h-5')}
              <span id="nav-wishlist-badge" class="absolute -top-0.5 -right-0.5 bg-[#FF6B35] text-white font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ${wishlistCount === 0 ? 'hidden' : ''}">
                ${wishlistCount}
              </span>
            </button>

            <!-- Account Trigger -->
            <button id="nav-account-btn" class="p-2 text-[#333] hover:text-[#FF6B35] rounded-full hover:bg-[#F5F5F5] transition-colors" title="My Account" aria-label="My Account">
              ${renderIcon('user', 'w-5 h-5')}
            </button>

            <!-- Shopping Cart Trigger -->
            <button id="nav-cart-btn" class="relative p-2.5 bg-[#111111] text-white hover:bg-[#FF6B35] rounded-full transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer" aria-label="Shopping Cart">
              ${renderIcon('shoppingBag', 'w-5 h-5')}
              <span id="nav-cart-badge" class="absolute -top-1 -right-1 bg-[#FF6B35] text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${cartCount === 0 ? 'hidden' : ''}">
                ${cartCount}
              </span>
            </button>

          </div>

        </div>
      </div>
    </nav>

    <!-- Mobile Slide-Down Drawer Menu -->
    <div id="mobile-menu-drawer" class="hidden lg:hidden bg-white border-b border-[#DDD4C4] px-6 py-6 space-y-3.5 text-xs font-bold uppercase tracking-wider text-[#333] shadow-xl animate-fade-in font-heading">
      <a href="#" class="block py-2 border-b border-[#F0EAE1] hover:text-[#FF6B35]">Home</a>
      <a href="#catalogue" class="block py-2 border-b border-[#F0EAE1] hover:text-[#FF6B35]">Shop All Products</a>
      <a href="#custom-studio" class="block py-2 border-b border-[#F0EAE1] text-[#FF6B35] flex items-center justify-between">
        <span>Customize Studio</span>
        <span class="bg-[#FF6B35] text-white text-[9px] px-1.5 py-0.5 rounded-full">STUDIO</span>
      </a>
      <a href="#studio-3d" class="block py-2 border-b border-[#F0EAE1] text-[#111] flex items-center justify-between">
        <span>360° 3D Studio</span>
        <span class="bg-black text-[#FF6B35] text-[9px] px-1.5 py-0.5 rounded-full">3D</span>
      </a>
      <a href="#custom-jersey" class="block py-2 border-b border-[#F0EAE1] hover:text-[#FF6B35] flex items-center justify-between">
        <span>Custom Team Jerseys</span>
        <span class="font-mono text-[#FF6B35]">₹499</span>
      </a>
      <a href="#catalogue" onclick="window.filterCategory('personalized-gifts')" class="block py-2 border-b border-[#F0EAE1] hover:text-[#FF6B35]">Personalized Gifts</a>
      <a href="#bulk-orders" class="block py-2 border-b border-[#F0EAE1] hover:text-[#FF6B35]">Corporate & Bulk Orders</a>
      <a href="#about-us" data-policy="about" class="block py-2 border-b border-[#F0EAE1] hover:text-[#FF6B35]">About Us</a>
      <a href="#contact-us" data-policy="contact" class="block py-2 border-b border-[#F0EAE1] hover:text-[#FF6B35]">Contact</a>
      <div class="pt-2 flex items-center justify-between">
        <a href="#admin" class="text-[#FF6B35] font-mono text-[11px] font-bold">Admin Portal Login →</a>
        <span class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Free Pan-India Delivery</span>
      </div>
    </div>
  `;
}

export function initNavbarEvents() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const searchBtn = document.getElementById('nav-search-btn');
  const accountBtn = document.getElementById('nav-account-btn');
  const wishlistBtn = document.getElementById('nav-wishlist-btn');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileDrawer.classList.add('hidden'));
    });
  }

  // Account button opens Customer Account or Auth
  if (accountBtn) {
    accountBtn.addEventListener('click', () => {
      if (store.currentUser) {
        openCustomerAccountModal();
      } else {
        openAuthModal(() => {
          openCustomerAccountModal();
        });
      }
    });
  }

  // Wishlist button opens Customer Account Wishlist tab
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      openCustomerAccountModal();
      const wishlistTabBtn = document.querySelector('[data-tab="wishlist"]');
      if (wishlistTabBtn) wishlistTabBtn.click();
    });
  }

  const navCartBtn = document.getElementById('nav-cart-btn');
  if (navCartBtn) {
    navCartBtn.addEventListener('click', () => {
      if (typeof window.openCartDrawer === 'function') {
        window.openCartDrawer();
      }
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
