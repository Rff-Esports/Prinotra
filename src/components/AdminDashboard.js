// PRINTORA Master Admin Dashboard
// Section 19: Full administrative control, 10-status order lifecycle, price management, coupons, and Supabase first admin setup guide

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { isSupabaseConfigured, updateSupabaseCredentials } from '../services/supabase.js';
import { sendBrevoOtpEmail, sendPaymentConfirmedEmail, generate6DigitOtp } from '../services/brevo.js';
import { compressImageFile } from '../services/cloudSync.js';
import { INITIAL_PRODUCTS } from '../data/products.js';


export const ADMIN_ORDER_STATUSES = [
  "Order Placed",
  "Payment Pending",
  "Payment Confirmed",
  "Artwork Verification",
  "In Production",
  "Quality Check",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

export function getAdminCredentials() {
  try {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('printora_admin_credentials') : null;
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return {
    username: "admin@printoracustom.in",
    password: "Printora@2026"
  };
}

export function saveAdminCredentials(username, password) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('printora_admin_credentials', JSON.stringify({ username, password }));
    }
  } catch (e) {}
}

export function isAdminAuthenticated() {
  try {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem('printora_admin_session') === 'active';
  } catch (e) {
    return false;
  }
}

export function setAdminAuthenticated(val) {
  try {
    if (typeof sessionStorage !== 'undefined') {
      if (val) {
        sessionStorage.setItem('printora_admin_session', 'active');
      } else {
        sessionStorage.removeItem('printora_admin_session');
      }
    }
  } catch (e) {}
}

function renderAdminLoginGate() {
  return `
    <div id="admin-login-barrier" class="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div class="w-full max-w-md bg-[#141414] border border-[#2B2B2B] rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        
        <div class="text-center mb-8 flex flex-col items-center">
          <img src="/assets/logo.png" alt="PRINTORA" class="h-16 w-auto object-contain rounded-2xl bg-white p-1 mb-3 shadow-xl">
          <span class="text-[10px] text-[#FF6B35] font-bold uppercase tracking-[0.3em] font-heading block">RESTRICTED ACCESS</span>
          <h2 class="text-2xl font-bold font-heading text-white mt-1">PRINTORA Control Center</h2>
          <p class="text-xs text-[#888] mt-1.5">Authorized Store Administrator Authentication</p>
        </div>

        <form id="admin-login-form" class="space-y-4">
          <div id="admin-login-error" class="hidden p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium text-center"></div>

          <div>
            <label for="admin-user-input" class="block text-xs font-bold text-[#CCC] mb-1.5 uppercase tracking-wider">Admin ID / Email</label>
            <input type="text" id="admin-user-input" required placeholder="admin@printoracustom.in" 
                   class="w-full bg-[#1C1C1C] border border-[#333] focus:border-[#FF6B35] rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors font-mono">
          </div>

          <div>
            <label for="admin-pwd-input" class="block text-xs font-bold text-[#CCC] mb-1.5 uppercase tracking-wider">Admin Password</label>
            <div class="relative">
              <input type="password" id="admin-pwd-input" required placeholder="••••••••••••" 
                     class="w-full bg-[#1C1C1C] border border-[#333] focus:border-[#FF6B35] rounded-xl pl-4 pr-11 py-3 text-sm text-white outline-none transition-colors font-mono">
              <button type="button" id="admin-pwd-toggle" class="absolute right-3.5 top-3.5 text-[#888] hover:text-white" title="Toggle Password">
                ${renderIcon('eye', 'w-4 h-4')}
              </button>
            </div>
          </div>

          <button type="submit" id="admin-login-btn" class="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-lg font-heading cursor-pointer mt-2">
            Unlock Admin Portal
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-[#242424] text-center">
          <a href="#catalogue" class="text-xs text-[#888] hover:text-white transition-colors flex items-center justify-center gap-1.5">
            <span>← Return to Public Store</span>
          </a>
        </div>

      </div>
    </div>
  `;
}

export function renderAdminDashboard() {
  if (!isAdminAuthenticated()) {
    return renderAdminLoginGate();
  }
  const orders = store.orders;
  const products = store.products;
  const bulkEnquiries = store.bulkEnquiries;
  const suppliers = store.suppliers;
  const settings = store.settings;
  const coupons = store.coupons;
  const registeredUsers = store.registeredUsers || store.loadRegisteredUsers();

  // Overview Metrics Calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Order Placed' || o.status === 'Payment Pending').length;
  const inProductionOrders = orders.filter(o => o.status === 'In Production' || o.status === 'Artwork Verification').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped' || o.status === 'Out for Delivery').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // Extract all customer orders containing custom clothing prints or uploaded designs
  const customDesignItems = [];
  orders.forEach(o => {
    (o.items || []).forEach((item, itemIdx) => {
      if (item.uploadedDesign || item.printingType || item.artworkFile) {
        customDesignItems.push({
          order: o,
          item,
          uniqueKey: `${o.orderCode || o.id}-${itemIdx}`
        });
      }
    });
  });

  return `
    <div id="admin-view" class="min-h-screen bg-[#F5F5F5] text-[#111111] pb-24 font-sans">
      
      <!-- Admin Top Bar -->
      <header class="bg-[#111111] text-white border-b border-[#222] sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          
          <!-- Top Row on Mobile / Left Section on Desktop -->
          <div class="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
            <div class="flex items-center gap-2 sm:gap-3">
              <a href="#catalogue" class="text-xs uppercase tracking-wider text-[#FF6B35] hover:underline flex items-center gap-1 font-heading font-bold whitespace-nowrap">
                <span>← Store</span>
              </a>
              <span class="text-[#333]">|</span>
              <img src="/assets/logo.png" alt="PRINTORA" class="h-7 sm:h-8 w-auto object-contain rounded-lg bg-white p-0.5">
              <span class="font-heading text-sm sm:text-lg font-bold tracking-wider text-white whitespace-nowrap">ADMIN</span>
              <span class="hidden md:inline-block text-[10px] bg-[#FF6B35]/20 text-[#FF6B35] px-2 py-0.5 rounded font-mono font-bold">CONTROL CENTER</span>
            </div>

            <!-- Mobile-only Quick Actions -->
            <div class="flex sm:hidden items-center gap-2">
              <button class="admin-quick-add-trigger bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 shadow-sm cursor-pointer">
                ${renderIcon('plus', 'w-3 h-3')}
                <span>Add</span>
              </button>
              <button class="admin-logout-trigger bg-[#242424] hover:bg-rose-600 text-white font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer" title="Logout">
                ${renderIcon('x', 'w-3 h-3')}
                <span>Exit</span>
              </button>
            </div>
          </div>

          <!-- Bottom Row on Mobile / Right Section on Desktop -->
          <div class="flex items-center justify-between sm:justify-end gap-3 text-xs w-full sm:w-auto border-t sm:border-t-0 border-[#222] pt-2 sm:pt-0">
            <button id="admin-setup-guide-btn" class="text-[11px] sm:text-xs text-[#AAA] hover:text-white underline font-semibold truncate cursor-pointer">
              🔑 Admin Setup Guide
            </button>
            
            <span class="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-400 font-medium">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="truncate">Global Cloud Sync Active</span>
            </span>

            <div class="hidden sm:flex items-center gap-2.5">
              <button class="admin-quick-add-trigger bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                ${renderIcon('plus', 'w-3.5 h-3.5')}
                <span>Add Product</span>
              </button>
              <button class="admin-logout-trigger bg-[#242424] hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer" title="Log out from Admin">
                ${renderIcon('x', 'w-3.5 h-3.5')}
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Admin Navigation Tabs -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 overflow-x-auto text-xs font-bold uppercase tracking-wider text-[#888] border-t border-[#1C1C1C]">
          <button class="admin-tab-btn py-3 border-b-2 border-[#FF6B35] text-white whitespace-nowrap" data-tab="overview">
            Overview
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="orders">
            Orders (${totalOrders})
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="custom-designs">
            Customer Uploaded Designs (${customDesignItems.length})
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="products">
            Products (${products.length})
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="coupons">
            Coupons (${coupons.length})
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="fulfillment">
            Supplier Fulfillment
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="bulk">
            Bulk Enquiries (${bulkEnquiries.length})
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="users">
            User Logins (${registeredUsers.length})
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="settings">
            Store Settings
          </button>
        </div>
      </header>

      <!-- Main Admin Content Container -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <!-- ==========================================
             TAB 1: OVERVIEW ANALYTICS
             ========================================== -->
        <div id="admin-tab-overview" class="admin-tab-content space-y-8">
          
          <!-- Key Metrics Cards -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div class="bg-white border border-[#DDD4C4] rounded-2xl p-4 shadow-sm">
              <span class="text-[11px] uppercase tracking-wider text-[#777] font-bold block">Verified Revenue</span>
              <span class="text-2xl font-black text-black font-mono mt-1 block">₹${totalRevenue}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-2xl p-4 shadow-sm">
              <span class="text-[11px] uppercase tracking-wider text-[#777] font-bold block">Total Orders</span>
              <span class="text-2xl font-black text-black font-mono mt-1 block">${totalOrders}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-2xl p-4 shadow-sm">
              <span class="text-[11px] uppercase tracking-wider text-amber-600 font-bold block">Pending</span>
              <span class="text-2xl font-black text-amber-700 font-mono mt-1 block">${pendingOrders}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-2xl p-4 shadow-sm">
              <span class="text-[11px] uppercase tracking-wider text-purple-600 font-bold block">In Production</span>
              <span class="text-2xl font-black text-purple-700 font-mono mt-1 block">${inProductionOrders}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-2xl p-4 shadow-sm">
              <span class="text-[11px] uppercase tracking-wider text-cyan-600 font-bold block">Shipped</span>
              <span class="text-2xl font-black text-cyan-700 font-mono mt-1 block">${shippedOrders}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-2xl p-4 shadow-sm">
              <span class="text-[11px] uppercase tracking-wider text-emerald-600 font-bold block">Delivered</span>
              <span class="text-2xl font-black text-emerald-700 font-mono mt-1 block">${deliveredOrders}</span>
            </div>
          </div>

          <!-- Free Shipping Compliance Banner -->
          <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <strong>Business Compliance Active:</strong> Free Shipping on all orders across India (₹0 Delivery Charges).
            </div>
            <span class="font-mono font-bold">Standard Delivery = ₹0 ALWAYS</span>
          </div>

          <!-- Live Orders Table -->
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-heading text-lg font-bold text-black">Recent Orders & Tracking Stages</h3>
              <button onclick="document.querySelector('[data-tab=orders]').click();" class="text-xs text-[#FF6B35] font-bold hover:underline">
                View All Orders →
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF7F2] text-[#666] uppercase tracking-wider font-bold border-b border-[#DDD4C4]">
                  <tr>
                    <th class="py-3 px-4">Order ID</th>
                    <th class="py-3 px-4">Customer</th>
                    <th class="py-3 px-4">Location</th>
                    <th class="py-3 px-4">Items</th>
                    <th class="py-3 px-4">Amount</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#EFECE4]">
                  ${orders.slice(0, 6).map(o => `
                    <tr class="hover:bg-[#FAF9F5] transition-colors">
                      <td class="py-3 px-4 font-mono font-bold text-black">${o.orderCode}</td>
                      <td class="py-3 px-4">
                        <div class="font-bold text-black">${o.customerName}</div>
                        <div class="text-[11px] text-[#777] font-mono">${o.customerPhone}</div>
                      </td>
                      <td class="py-3 px-4 text-[#555]">${o.shippingCity}, ${o.shippingState}</td>
                      <td class="py-3 px-4">${o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</td>
                      <td class="py-3 px-4 font-mono font-bold text-black">₹${o.totalAmount}</td>
                      <td class="py-3 px-4">
                        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(o.status)}">
                          ${o.status}
                        </span>
                      </td>
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-2">
                          <button class="admin-view-order-btn text-[#FF6B35] hover:text-black font-bold text-xs" data-order-id="${o.orderCode}">
                            Manage →
                          </button>
                          <button class="admin-delete-order-btn text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 text-xs font-bold cursor-pointer transition-colors" data-order-id="${o.orderCode}" title="Permanently delete order">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- ==========================================
             TAB 2: ORDER MANAGEMENT (10 Status Workflow)
             ========================================== -->
        <div id="admin-tab-orders" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-sm">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 class="font-heading text-xl font-bold text-black">10-Stage Order Lifecycle Workflow</h3>
                <p class="text-xs text-[#777]">Update order progress, verify custom artwork & text, and add courier tracking.</p>
              </div>

              <!-- Search -->
              <input type="text" id="admin-order-search" placeholder="Search order code or customer..." 
                     class="bg-[#FAFAF7] border border-[#DDD4C4] rounded-xl px-3.5 py-2 text-xs outline-none w-full sm:w-64">
            </div>

            <!-- Full Orders List -->
            <div class="space-y-4" id="admin-orders-list-container">
              ${orders.map(o => `
                <div class="border border-[#DDD4C4] rounded-2xl p-5 bg-[#FAF9F6] space-y-4 hover:border-black transition-colors" data-order-card="${o.orderCode}">
                  <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-[#E5E0D5] pb-3">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-mono font-bold text-sm text-black">${o.orderCode}</span>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(o.status)}">${o.status}</span>
                      </div>
                      <span class="text-[11px] text-[#777]">Placed on ${new Date(o.createdAt).toLocaleString()}</span>
                    </div>

                    <div class="flex items-center gap-2 flex-wrap">
                      <!-- 10-Status Lifecycle Dropdown -->
                      <select class="admin-order-status-select bg-white border border-[#DDD4C4] rounded-xl px-3 py-1.5 text-xs font-bold outline-none" data-order-id="${o.orderCode}">
                        ${ADMIN_ORDER_STATUSES.map(st => `
                          <option value="${st}" ${st === o.status ? 'selected' : ''}>${st}</option>
                        `).join('')}
                      </select>

                      <button class="admin-assign-dealer-btn bg-[#111] hover:bg-[#FF6B35] text-white px-3.5 py-1.5 text-xs rounded-xl font-bold transition-colors cursor-pointer" data-order-id="${o.orderCode}">
                        Assign Courier
                      </button>

                      <button class="admin-delete-order-btn bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-rose-600 px-3 py-1.5 text-xs rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer" data-order-id="${o.orderCode}" title="Permanently delete order from dashboard and user view">
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <!-- Details Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span class="text-[#777] font-bold uppercase tracking-wider text-[10px] block">Customer</span>
                      <strong class="text-black text-sm block mt-0.5">${o.customerName}</strong>
                      <span class="font-mono text-[#555] block">${o.customerPhone}</span>
                      ${o.customerEmail ? `<span class="text-[#666] block">${o.customerEmail}</span>` : ''}
                    </div>

                    <div>
                      <span class="text-[#777] font-bold uppercase tracking-wider text-[10px] block">Shipping Address (Pan-India)</span>
                      <span class="text-[#444] block mt-0.5">${o.shippingHouse}, ${o.shippingArea}</span>
                      <strong class="text-black block">${o.shippingCity}${o.shippingDistrict ? `, ${o.shippingDistrict}` : ''}, ${o.shippingState} - ${o.shippingPincode}</strong>
                    </div>

                    <div class="bg-white p-3 rounded-xl border border-[#DDD4C4]">
                      <span class="text-[#777] font-bold uppercase tracking-wider text-[10px] block">Billing Breakdown</span>
                      <div class="mt-1 space-y-0.5">
                        <div class="flex justify-between"><span>Subtotal:</span><span class="font-mono font-bold">₹${o.subtotal}</span></div>
                        <div class="flex justify-between text-emerald-700 font-bold"><span>Delivery:</span><span>FREE (₹0)</span></div>
                        <div class="flex justify-between font-bold text-black border-t border-[#EEE] pt-1">
                          <span>Total Paid:</span>
                          <span class="font-mono text-[#FF6B35]">₹${o.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Personalized & Customized Items with Full Artwork and Print Details -->
                  <div class="bg-white p-3.5 rounded-xl border border-[#DDD4C4] space-y-3">
                    <div class="flex items-center justify-between border-b border-[#EFECE4] pb-2">
                      <span class="text-[#777] font-bold uppercase tracking-wider text-[10px] block font-heading">Customized Items & Production Specifications</span>
                      <span class="text-[11px] font-mono font-bold text-black">${o.items.length} Product${o.items.length > 1 ? 's' : ''}</span>
                    </div>

                    <div class="space-y-3 text-xs">
                      ${o.items.map(it => {
                        const design = it.uploadedDesign;
                        const hasArtwork = Boolean(design && design.dataUrl);
                        const isPdf = design?.isPdf || design?.type === 'application/pdf';
                        const basePrice = it.basePrice || (it.price - (it.printingCharge || 0));
                        const printCharge = it.printingCharge || 0;

                        return `
                          <div class="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E0D5] space-y-2.5">
                            <div class="flex items-start justify-between gap-3">
                              <div>
                                <strong class="text-black font-heading text-sm">${it.name}</strong>
                                <span class="text-xs font-mono font-bold text-[#FF6B35] ml-2">Qty: ${it.quantity}</span>
                                
                                <div class="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
                                  ${it.selectedSize ? `<span class="bg-white border border-[#DDD4C4] px-2 py-0.5 rounded-md font-mono font-bold text-black">Size: ${it.selectedSize}</span>` : ''}
                                  ${it.selectedColor ? `<span class="bg-white border border-[#DDD4C4] px-2 py-0.5 rounded-md text-black">Color: ${it.selectedColor}</span>` : ''}
                                  ${it.phoneModel ? `<span class="bg-[#FFF1E8] border border-[#FF6B35]/30 text-[#FF6B35] px-2 py-0.5 rounded-md font-bold font-mono">Model: ${it.phoneModel}</span>` : ''}
                                </div>
                              </div>

                              <div class="text-right flex-shrink-0">
                                <span class="font-mono font-black text-black text-sm block">₹${it.price * it.quantity}</span>
                                <span class="text-[10px] text-[#777] font-mono">₹${it.price} each</span>
                              </div>
                            </div>

                            <!-- Printing Customization Specifications -->
                            ${it.printingType ? `
                              <div class="p-2.5 bg-white border border-[#FF6B35]/30 rounded-lg text-[11px] space-y-1">
                                <div class="flex items-center justify-between font-bold">
                                  <span class="text-[#FF6B35]">🖨️ Printing Size: <strong>${it.printingType}</strong></span>
                                  <span class="text-black">Position: <strong>${it.printingPosition || 'Front'}</strong></span>
                                </div>
                                <div class="flex items-center justify-between text-[10px] text-[#666] pt-0.5 border-t border-[#F0EAE1]">
                                  <span>Base Garment: <strong class="text-black font-mono">₹${basePrice}</strong></span>
                                  <span>Printing Charge: <strong class="text-[#FF6B35] font-mono">+₹${printCharge}</strong></span>
                                  <span>Item Unit Total: <strong class="text-black font-mono">₹${it.price}</strong></span>
                                </div>
                              </div>
                            ` : ''}

                            ${it.customName || it.customNumber ? `
                              <div class="text-[11px] text-[#555] space-x-3 bg-white p-2 rounded-lg border border-[#E5E0D5]">
                                ${it.customName ? `<span>Custom Name: <strong class="text-black uppercase">${it.customName}</strong></span>` : ''}
                                ${it.customNumber ? `<span>Jersey #: <strong class="text-black font-mono">#${it.customNumber}</strong></span>` : ''}
                              </div>
                            ` : ''}

                            ${it.customNotes ? `
                              <div class="text-[11px] text-[#777] italic bg-white p-2 rounded-lg border border-[#E5E0D5]">
                                📝 Customer Notes: "${it.customNotes}"
                              </div>
                            ` : ''}

                            <!-- Attached Customer Artwork / Design Preview & Action Buttons -->
                            ${hasArtwork ? `
                              <div class="mt-2 p-2.5 bg-white border border-[#DDD4C4] rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                                <div class="flex items-center gap-3 min-w-0">
                                  <div class="w-14 h-14 rounded-lg bg-[#FAF8F5] border border-[#E5E0D5] flex items-center justify-center overflow-hidden flex-shrink-0">
                                    ${isPdf ? `
                                      <span class="text-2xl">📄</span>
                                    ` : `
                                      <img src="${design.dataUrl}" alt="Customer artwork" class="w-full h-full object-cover">
                                    `}
                                  </div>
                                  <div class="min-w-0">
                                    <span class="text-[9px] uppercase font-bold text-emerald-700 tracking-wider block font-heading">📎 Customer Artwork Attached</span>
                                    <strong class="text-xs text-black block truncate font-mono">${design.name}</strong>
                                    <span class="text-[10px] text-[#777] font-mono">${design.size} • ${isPdf ? 'PDF Document' : 'Raster Image'}</span>
                                  </div>
                                </div>

                                <div class="flex items-center gap-1.5 flex-shrink-0">
                                  ${!isPdf ? `
                                    <button type="button" class="admin-view-design-btn bg-[#FAF7F2] hover:bg-[#F0EAE1] text-black border border-[#DDD4C4] py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer" data-img-src="${design.dataUrl}" data-img-name="${design.name}" data-order="${o.orderCode}" data-cust="${o.customerName}">
                                      🔍 View Full
                                    </button>
                                  ` : `
                                    <a href="${design.dataUrl}" target="_blank" class="bg-[#FAF7F2] hover:bg-[#F0EAE1] text-black border border-[#DDD4C4] py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all text-center">
                                      📄 Open PDF
                                    </a>
                                  `}
                                  <a href="${design.dataUrl}" download="${design.name || `Printora-${o.orderCode}-design`}" class="bg-[#111] hover:bg-[#FF6B35] text-white py-1.5 px-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer">
                                    <span>⬇️ Download Design</span>
                                  </a>
                                </div>
                              </div>
                            ` : (it.artworkFile ? `
                              <div class="p-2 bg-white rounded-lg border border-[#DDD4C4] text-[11px] text-[#555] flex items-center justify-between">
                                <span>📎 Artwork File Reference: <strong class="text-black font-mono">${it.artworkFile}</strong></span>
                                <span class="text-[10px] text-emerald-700 font-bold">✓ Listed</span>
                              </div>
                            ` : `
                              <div class="text-[10px] text-[#888] italic bg-white p-2 rounded-lg border border-dashed border-[#DDD4C4]">
                                No external artwork file attached (text customization / plain garment)
                              </div>
                            `)}
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>

                  ${o.supplierAssignment?.trackingNumber ? `
                    <div class="bg-[#F0EAE1] p-3 rounded-xl border border-[#DDD4C4] text-xs flex items-center justify-between">
                      <div>
                        <span class="font-bold text-[#FF6B35]">Courier Partner:</span> ${o.supplierAssignment.courier}
                        • <span class="font-bold">AWB:</span> <span class="font-mono font-bold">${o.supplierAssignment.trackingNumber}</span>
                      </div>
                    </div>
                  ` : ''}

                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB: CUSTOMER UPLOADED DESIGNS
             ========================================== -->
        <div id="admin-tab-custom-designs" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-sm">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 class="font-heading text-xl font-bold text-black flex items-center gap-2">
                  <span>Customer Uploaded Designs</span>
                  <span class="text-xs bg-[#FF6B35] text-white px-2.5 py-0.5 rounded-full font-mono">${customDesignItems.length}</span>
                </h3>
                <p class="text-xs text-[#777]">Inspect customer artwork files, print placement, and download full-resolution production assets.</p>
              </div>

              <!-- Search -->
              <input type="text" id="admin-custom-design-search" placeholder="Search order code, customer name or phone..." 
                     class="bg-[#FAFAF7] border border-[#DDD4C4] rounded-xl px-3.5 py-2 text-xs outline-none w-full sm:w-72">
            </div>

            ${customDesignItems.length === 0 ? `
              <div class="text-center py-16 bg-[#FAF9F6] rounded-2xl border border-dashed border-[#DDD4C4] p-8">
                <span class="text-4xl block mb-2">🎨</span>
                <h4 class="font-heading text-lg font-bold text-black">No Customer Uploaded Designs Yet</h4>
                <p class="text-xs text-[#777] max-w-sm mx-auto mt-1">When customers order customized clothing with small/A4 logo prints or upload artwork, they will appear here with full previews and instant download buttons.</p>
              </div>
            ` : `
              <div class="space-y-4" id="admin-custom-designs-grid">
                ${customDesignItems.map(({ order, item, uniqueKey }) => {
                  const design = item.uploadedDesign;
                  const hasArtwork = Boolean(design && design.dataUrl);
                  const isPdf = design?.isPdf || design?.type === 'application/pdf';
                  const basePrice = item.basePrice || (item.price - (item.printingCharge || 0));
                  const printCharge = item.printingCharge || 0;
                  const finalPrice = item.price;

                  return `
                    <div class="border border-[#DDD4C4] rounded-2xl p-5 bg-[#FAF9F6] hover:border-black transition-all space-y-4 admin-design-card" data-search="${(order.orderCode || '') + ' ' + (order.customerName || '') + ' ' + (order.customerPhone || '') + ' ' + (item.name || '')}">
                      <!-- Card Header -->
                      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#E5E0D5] pb-3">
                        <div class="flex items-center gap-3">
                          <span class="font-mono font-extrabold text-sm text-black">${order.orderCode}</span>
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(order.status)}">${order.status}</span>
                          <span class="text-[11px] text-[#777]">Ordered on ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div class="text-xs font-bold text-[#111] font-mono">
                          Order Total: ₹${order.totalAmount}
                        </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        <!-- Left: Customer Details (Cols 1-4) -->
                        <div class="md:col-span-4 space-y-2 text-xs">
                          <span class="text-[10px] uppercase font-bold tracking-wider text-[#FF6B35] font-heading block">Customer Details</span>
                          <div>
                            <strong class="text-sm font-bold text-black block font-heading">${order.customerName}</strong>
                            <a href="tel:${order.customerPhone}" class="text-[#555] hover:text-[#FF6B35] font-mono block mt-0.5">📞 ${order.customerPhone}</a>
                            ${order.customerEmail ? `<a href="mailto:${order.customerEmail}" class="text-[#555] hover:text-[#FF6B35] block truncate">✉️ ${order.customerEmail}</a>` : ''}
                          </div>
                          <div class="p-2.5 bg-white rounded-xl border border-[#E5E0D5] text-[11px] text-[#555] leading-relaxed">
                            <span class="font-bold text-black block mb-0.5">Delivery Address:</span>
                            ${order.shippingHouse}, ${order.shippingArea}, ${order.shippingCity}, ${order.shippingState} - <span class="font-mono font-bold">${order.shippingPincode}</span>
                          </div>
                        </div>

                        <!-- Center: Customization & Product Details (Cols 5-8) -->
                        <div class="md:col-span-4 space-y-2 text-xs">
                          <span class="text-[10px] uppercase font-bold tracking-wider text-[#FF6B35] font-heading block">Product & Printing Details</span>
                          <div class="p-3 bg-white rounded-xl border border-[#E5E0D5] space-y-2">
                            <div>
                              <strong class="text-xs font-bold text-black font-heading block">${item.name}</strong>
                              <span class="text-[11px] text-[#777]">Size: <strong class="text-black font-mono">${item.selectedSize}</strong> • Color: <strong class="text-black">${item.selectedColor}</strong> • Qty: <strong class="text-black font-mono">${item.quantity}</strong></span>
                            </div>

                            <div class="pt-2 border-t border-[#EFECE4] space-y-1 text-[11px]">
                              <div class="flex items-center justify-between">
                                <span class="text-[#666]">Printing Type:</span>
                                <span class="font-bold text-[#FF6B35]">${item.printingType || 'Small Logo'}</span>
                              </div>
                              <div class="flex items-center justify-between">
                                <span class="text-[#666]">Printing Position:</span>
                                <span class="font-bold text-black">${item.printingPosition || 'Front'}</span>
                              </div>
                              <div class="flex items-center justify-between">
                                <span class="text-[#666]">Base Product Price:</span>
                                <span class="font-mono font-bold text-black">₹${basePrice}</span>
                              </div>
                              <div class="flex items-center justify-between">
                                <span class="text-[#666]">Printing Charges:</span>
                                <span class="font-mono font-bold text-[#FF6B35]">+₹${printCharge}</span>
                              </div>
                              <div class="flex items-center justify-between pt-1 border-t border-[#EFECE4] font-bold text-xs">
                                <span>Final Product Price:</span>
                                <span class="font-mono font-black text-black">₹${finalPrice}</span>
                              </div>
                            </div>

                            ${item.customName || item.customNotes ? `
                              <div class="pt-2 border-t border-[#EFECE4] text-[11px] text-[#555]">
                                ${item.customName ? `<div>Custom Text: <strong class="text-black uppercase">${item.customName}</strong></div>` : ''}
                                ${item.customNotes ? `<div>Notes: <em>${item.customNotes}</em></div>` : ''}
                              </div>
                            ` : ''}
                          </div>
                        </div>

                        <!-- Right: Uploaded Artwork Preview & Actions (Cols 9-12) -->
                        <div class="md:col-span-4 space-y-2 text-xs">
                          <span class="text-[10px] uppercase font-bold tracking-wider text-[#FF6B35] font-heading block">Uploaded Design Asset</span>
                          ${hasArtwork ? `
                            <div class="p-3 bg-white rounded-xl border border-[#E5E0D5] space-y-2.5">
                              <div class="w-full aspect-video rounded-lg overflow-hidden bg-[#F0EAE1] flex items-center justify-center border border-[#DDD4C4] relative group">
                                ${isPdf ? `
                                  <div class="flex flex-col items-center justify-center p-3 text-center">
                                    <span class="text-3xl">📄</span>
                                    <span class="text-xs font-bold text-black mt-1 font-heading">PDF Document</span>
                                    <span class="text-[10px] text-[#777] font-mono">${design.size}</span>
                                  </div>
                                ` : `
                                  <img src="${design.dataUrl}" alt="Customer artwork" class="w-full h-full object-contain p-1">
                                `}
                              </div>

                              <div class="space-y-1">
                                <div class="font-bold text-black truncate font-mono text-[11px]">${design.name}</div>
                                <div class="text-[10px] text-[#777] font-mono">${design.size} • ${isPdf ? 'PDF Document' : 'Raster Image'}</div>
                              </div>

                              <div class="grid grid-cols-2 gap-2 pt-1">
                                ${!isPdf ? `
                                  <button type="button" class="admin-view-design-btn bg-[#FAF7F2] hover:bg-[#F0EAE1] text-black border border-[#DDD4C4] py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer" data-img-src="${design.dataUrl}" data-img-name="${design.name}" data-order="${order.orderCode}" data-cust="${order.customerName}">
                                    🔍 View Full
                                  </button>
                                ` : `
                                  <a href="${design.dataUrl}" target="_blank" class="bg-[#FAF7F2] hover:bg-[#F0EAE1] text-black border border-[#DDD4C4] py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-center">
                                    📄 Open PDF
                                  </a>
                                `}

                                <a href="${design.dataUrl}" download="${design.name || `Printora-${order.orderCode}-design`}" class="bg-[#111] hover:bg-[#FF6B35] text-white py-2 px-2.5 rounded-lg text-xs font-bold transition-colors text-center cursor-pointer flex items-center justify-center gap-1">
                                  <span>⬇️ Download</span>
                                </a>
                              </div>
                            </div>
                          ` : (item.artworkFile ? `
                            <div class="p-3 bg-white rounded-xl border border-[#E5E0D5] space-y-2">
                              <span class="text-xs font-bold text-black block font-heading">📎 Custom Artwork:</span>
                              <span class="text-[11px] font-mono text-[#555] block bg-[#FAF7F2] p-2 rounded-lg border border-[#DDD4C4]">${item.artworkFile}</span>
                              <span class="text-[10px] text-emerald-700 font-bold block">✓ File associated with order</span>
                            </div>
                          ` : `
                            <div class="p-5 bg-white rounded-xl border border-dashed border-[#DDD4C4] text-center space-y-1">
                              <span class="text-2xl block text-[#AAA]">📂</span>
                              <strong class="text-xs font-bold text-[#666] block">No Design Uploaded</strong>
                              <p class="text-[10px] text-[#888]">Customer ordered with custom text / plain garment without uploading artwork file.</p>
                            </div>
                          `)}
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- ==========================================
             TAB 3: PRODUCTS & PRICING MANAGEMENT
             ========================================== -->
        <div id="admin-tab-products" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-sm">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 class="font-heading text-xl font-bold text-black">Product Catalogue & Exact Pricing</h3>
                <p class="text-xs text-[#777]">Strict pricing compliance: Prices can only be changed by authorized administrators.</p>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <button id="admin-restore-all-images-btn" type="button" class="bg-[#FAF7F2] hover:bg-[#F0EAE1] text-black border border-[#DDD4C4] px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer" title="Revert all default products back to original official mockups">
                  <span>↺ Restore Official Images</span>
                </button>
                <button id="admin-sync-all-cloud-btn" type="button" class="bg-[#111] hover:bg-[#FF6B35] text-white px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                  <span>🚀 Publish All Live</span>
                </button>
                <button id="admin-add-product-btn-2" class="admin-quick-add-trigger bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer">
                  ${renderIcon('plus', 'w-3.5 h-3.5')}
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <!-- Global Cross-Device Live Sync Status Banner -->
            <div class="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <div>
                  <strong class="text-emerald-950 font-bold block">🌐 Cross-Device Live Sync Active for All Customers</strong>
                  <span class="text-emerald-800 text-[11px]">Any photo from your gallery or price edit you save here is automatically pushed live to all phones, laptops, and tablets across India.</span>
                </div>
              </div>
              <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                ● Netlify Edge Live
              </span>
            </div>

            <!-- Product Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF7F2] text-[#666] uppercase tracking-wider font-bold border-b border-[#DDD4C4]">
                  <tr>
                    <th class="py-3 px-4">Product Name</th>
                    <th class="py-3 px-4">Category</th>
                    <th class="py-3 px-4">Customer Price</th>
                    <th class="py-3 px-4">Sizes</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#EFECE4]">
                  ${products.map(p => `
                    <tr class="hover:bg-[#FAF9F5] transition-colors">
                      <td class="py-3 px-4 font-bold text-black">
                        <div class="flex items-center gap-2.5">
                          <img src="${p.images?.[0] || ''}" class="w-9 h-9 rounded-lg object-cover border border-[#DDD]">
                          <span>${p.name}</span>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-[#666]">${p.categoryName}</td>
                      <td class="py-3 px-4 font-mono font-bold text-black">
                        ${p.price ? `₹${p.price}${p.isOnwards ? ' onwards' : ''}` : '<span class="text-[#888] font-sans font-normal">Contact for Price</span>'}
                      </td>
                      <td class="py-3 px-4 text-[#555]">${p.sizes ? p.sizes.join(', ') : 'Standard'}</td>
                      <td class="py-3 px-4">
                        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.isAvailable !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                          ${p.isAvailable !== false ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button class="admin-edit-prod-btn text-[#FF6B35] hover:text-black font-bold px-2.5 py-1 rounded-lg bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 transition-colors cursor-pointer" data-prod-id="${p.id}" data-prod-name="${p.name.replace(/"/g, '&quot;')}">
                          ✏️ Edit Price & Images
                        </button>
                        <button class="admin-delete-prod-btn text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer" data-prod-id="${p.id}" data-prod-name="${p.name.replace(/"/g, '&quot;')}">
                          Delete
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB 4: COUPON & MARKETING MANAGEMENT
             ========================================== -->
        <div id="admin-tab-coupons" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-sm space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-heading text-xl font-bold text-black">Discount Coupons & Offers</h3>
                <p class="text-xs text-[#777]">Manage active customer coupon codes applied during checkout.</p>
              </div>
            </div>

            <!-- Coupons Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF7F2] text-[#666] uppercase tracking-wider font-bold border-b border-[#DDD4C4]">
                  <tr>
                    <th class="py-3 px-4">Coupon Code</th>
                    <th class="py-3 px-4">Discount</th>
                    <th class="py-3 px-4">Min. Order</th>
                    <th class="py-3 px-4">Expires At / Status</th>
                    <th class="py-3 px-4">Description</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#EFECE4]">
                  ${coupons.map(c => {
                    const isExpired = c.expiresAt && new Date(c.expiresAt).getTime() < Date.now();
                    const formattedDate = c.expiresAt ? new Date(c.expiresAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    }) : null;
                    return `
                    <tr class="hover:bg-[#FAF9F5] ${isExpired ? 'opacity-70 bg-rose-50/30' : ''}">
                      <td class="py-3 px-4">
                        <span class="font-mono font-bold text-black text-xs bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#DDD4C4]">${c.code}</span>
                      </td>
                      <td class="py-3 px-4 font-mono font-bold text-[#FF6B35]">
                        ${c.discountType === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                      </td>
                      <td class="py-3 px-4 font-mono">₹${c.minOrder}</td>
                      <td class="py-3 px-4">
                        ${isExpired ? `
                          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            <span>EXPIRED</span>
                            <span class="font-mono font-normal">(${formattedDate})</span>
                          </div>
                        ` : c.expiresAt ? `
                          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span>Active till:</span>
                            <span class="font-mono font-semibold">${formattedDate}</span>
                          </div>
                        ` : `
                          <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            <span>♾️ Lifetime (No Expiry)</span>
                          </div>
                        `}
                      </td>
                      <td class="py-3 px-4 text-[#555]">${c.description}</td>
                      <td class="py-3 px-4 text-right">
                        <button class="admin-delete-coupon-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:text-white hover:bg-rose-600 font-bold border border-rose-200 transition-colors cursor-pointer" data-code="${c.code}" title="Delete coupon code">
                          ${renderIcon('trash', 'w-3.5 h-3.5')}
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- Create New Coupon Form -->
            <form id="admin-create-coupon-form" class="p-5 bg-[#FAF8F5] border border-[#DDD4C4] rounded-2xl space-y-4">
              <div>
                <span class="text-xs uppercase font-bold text-black font-heading block">Create New Coupon Code</span>
                <p class="text-[11px] text-[#777]">Generate discount codes with custom values, minimum cart value, and optional expiration date & time.</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                <div>
                  <label class="block text-[11px] font-bold text-[#555] mb-1">Coupon Code</label>
                  <input type="text" id="new-coupon-code" required placeholder="FESTIVE15" class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3 py-2 uppercase font-mono font-bold outline-none focus:border-[#FF6B35]">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-[#555] mb-1">Discount Type</label>
                  <select id="new-coupon-type" class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3 py-2 font-bold outline-none focus:border-[#FF6B35]">
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-[#555] mb-1">Discount Value</label>
                  <input type="number" id="new-coupon-val" required placeholder="15" class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3 py-2 font-mono font-bold outline-none focus:border-[#FF6B35]">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-[#555] mb-1">Minimum Order (₹)</label>
                  <input type="number" id="new-coupon-min" required placeholder="999" class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3 py-2 font-mono font-bold outline-none focus:border-[#FF6B35]">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-[#555] mb-1">Expiry Date & Time (Optional)</label>
                  <input type="datetime-local" id="new-coupon-expiry" class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3 py-1.5 text-xs font-mono outline-none focus:border-[#FF6B35]">
                  <span class="text-[9px] text-[#888] block mt-0.5">Leave blank for lifetime</span>
                </div>
              </div>
              <div class="flex items-center justify-between pt-1">
                <span class="text-[11px] text-[#666]">💡 Expired coupons will automatically be rejected at checkout.</span>
                <button type="submit" class="bg-[#111] hover:bg-[#FF6B35] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer">
                  + Add Coupon Code
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ==========================================
             TAB 5: SUPPLIER FULFILLMENT
             ========================================== -->
        <div id="admin-tab-fulfillment" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 class="font-heading text-xl font-bold text-black">Manufacturing & Fulfillment Hubs</h3>
              <p class="text-xs text-[#777]">Strict white-label packaging rules. Private supplier costs are 100% confidential from clients.</p>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF7F2] text-[#666] uppercase tracking-wider font-bold border-b border-[#DDD4C4]">
                  <tr>
                    <th class="py-3 px-4">Hub / Partner Name</th>
                    <th class="py-3 px-4">City</th>
                    <th class="py-3 px-4">Contact</th>
                    <th class="py-3 px-4">Specialization</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#EFECE4]">
                  ${suppliers.map(s => `
                    <tr class="hover:bg-[#FAF9F5]">
                      <td class="py-3 px-4 font-bold text-black">${s.name}</td>
                      <td class="py-3 px-4 text-[#555]">${s.city}</td>
                      <td class="py-3 px-4">${s.contactPerson} (${s.phone})</td>
                      <td class="py-3 px-4 text-[#666]">${s.specialization}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB 6: BULK ENQUIRIES
             ========================================== -->
        <div id="admin-tab-bulk" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 class="font-heading text-xl font-bold text-black">Institutional & Bulk Quotation Requests</h3>
              <p class="text-xs text-[#777]">Requests from colleges, sports tournament organisers, gym chains and corporations.</p>
            </div>

            <div class="space-y-4">
              ${bulkEnquiries.map(b => `
                <div class="border border-[#DDD4C4] rounded-2xl p-5 bg-[#FAF9F6] space-y-3">
                  <div class="flex items-center justify-between border-b border-[#E5E0D5] pb-2">
                    <div>
                      <strong class="text-black text-sm">${b.organization}</strong>
                      <span class="text-xs text-[#666] ml-2">Contact: ${b.fullName} (${b.phone} • ${b.email})</span>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">${b.status}</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div><span class="text-[#888] block text-[10px] uppercase font-bold">Category</span><strong>${b.category}</strong></div>
                    <div><span class="text-[#888] block text-[10px] uppercase font-bold">Quantity</span><strong class="font-mono text-sm">${b.quantity} Units</strong></div>
                    <div><span class="text-[#888] block text-[10px] uppercase font-bold">Target Date</span><strong>${b.targetDate || 'Flexible'}</strong></div>
                  </div>
                  <div class="bg-white p-3 rounded-xl border border-[#DDD4C4] text-xs">
                    <span class="text-[#888] block text-[10px] uppercase font-bold mb-1">Specifications</span>
                    <p class="text-[#444]">${b.details}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB 7: STORE SETTINGS
             ========================================== -->
        <div id="admin-tab-settings" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 class="font-heading text-xl font-bold text-black">Store Configuration & Cloud Connections</h3>
              <p class="text-xs text-[#777]">Manage official brand identity, Instagram handle, and Supabase database parameters.</p>
            </div>

            <form id="admin-store-settings-form" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-[#333] mb-1">Brand Name</label>
                  <input type="text" id="set-brand-name" value="${settings.brandName}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-xl p-2.5 text-xs font-semibold">
                </div>
                <div>
                  <label class="block text-xs font-bold text-[#333] mb-1">Official Tagline</label>
                  <input type="text" id="set-tagline" value="${settings.tagline}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-xl p-2.5 text-xs font-semibold">
                </div>
                <div>
                  <label class="block text-xs font-bold text-[#333] mb-1">Business WhatsApp (+91)</label>
                  <input type="text" id="set-whatsapp" value="${settings.whatsappNumber}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-xl p-2.5 text-xs font-mono font-semibold">
                </div>
                <div>
                  <label class="block text-xs font-bold text-[#333] mb-1">Instagram Handle</label>
                  <input type="text" id="set-instagram" value="${settings.instagramHandle}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-xl p-2.5 text-xs font-semibold">
                </div>
              </div>

              <!-- Admin Security Credentials (Protected & Hidden from regular visitors) -->
              <div class="p-5 bg-[#FAF7F2] border border-[#DDD4C4] rounded-2xl space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs uppercase tracking-wider text-[#FF6B35] font-bold flex items-center gap-1.5">
                    ${renderIcon('shieldCheck', 'w-4 h-4')}
                    <span>Admin Security Credentials</span>
                  </span>
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Gated & Protected
                  </span>
                </div>
                <p class="text-xs text-[#666]">
                  These credentials control access to this private Admin Control Center at <code class="font-mono bg-white px-1.5 py-0.5 rounded border border-[#DDD4C4]">#admin</code>. Public visitors have zero links or visibility to this portal.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-bold text-[#444] mb-1">Admin ID / Login Email</label>
                    <input type="text" id="set-admin-username" value="${getAdminCredentials().username}" class="w-full bg-white border border-[#DDD4C4] rounded-xl p-2.5 text-xs font-mono">
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-[#444] mb-1">Admin Password</label>
                    <input type="text" id="set-admin-password" value="${getAdminCredentials().password}" class="w-full bg-white border border-[#DDD4C4] rounded-xl p-2.5 text-xs font-mono">
                  </div>
                </div>
              </div>

              <!-- Brevo (Sendinblue) Transactional Email & OTP System -->
              <div class="p-5 bg-[#FAF7F2] border border-[#DDD4C4] rounded-2xl space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs uppercase tracking-wider text-[#FF6B35] font-bold flex items-center gap-1.5">
                    ✉️ Brevo (Sendinblue) Transactional Email & OTP API
                  </span>
                  <span id="brevo-status-badge" class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${(settings.brevoApiKey || localStorage.getItem('printora_brevo_api_key')) ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                    ${(settings.brevoApiKey || localStorage.getItem('printora_brevo_api_key')) ? '● Brevo Connected' : '○ API Key Required'}
                  </span>
                </div>
                <p class="text-xs text-[#666]">
                  Enter your Brevo v3 API Key (starts with <code class="font-mono bg-white px-1.5 py-0.5 rounded border border-[#DDD4C4]">xkeysib-</code>). Used for real-time customer OTP authentication, order dispatch alerts, and custom jersey proofs.
                </p>
                <div class="space-y-3">
                  <div class="flex flex-col sm:flex-row gap-2">
                    <input type="password" id="set-brevo-api-key" value="${settings.brevoApiKey || localStorage.getItem('printora_brevo_api_key') || ''}" placeholder="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" class="flex-1 bg-white border border-[#DDD4C4] rounded-xl p-2.5 text-xs font-mono">
                    <button type="button" id="test-brevo-btn" class="bg-[#111] hover:bg-[#FF6B35] text-white px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer">
                      Test Send OTP
                    </button>
                  </div>
                  <div id="brevo-test-feedback" class="hidden text-xs p-3 rounded-xl font-medium"></div>
                </div>
              </div>

              <!-- Razorpay Live Payment Gateway Configuration -->
              <div class="p-5 bg-[#FAF7F2] border border-[#DDD4C4] rounded-2xl space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs uppercase tracking-wider text-[#FF6B35] font-bold flex items-center gap-1.5">
                    💳 Razorpay Live Payment Gateway
                  </span>
                  <span id="razorpay-status-badge" class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ● Live Gateway Active
                  </span>
                </div>
                <p class="text-xs text-[#666]">
                  Razorpay Live API credentials power instant online payments via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking at checkout.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-bold text-[#444] mb-1">Razorpay Key ID</label>
                    <input type="text" id="set-razorpay-key-id" value="${settings.razorpayKeyId || 'rzp_live_TwnbxHtTo3019C'}" class="w-full bg-white border border-[#DDD4C4] rounded-xl p-2.5 text-xs font-mono">
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-[#444] mb-1">Razorpay Key Secret</label>
                    <input type="password" id="set-razorpay-key-secret" value="${settings.razorpayKeySecret || 'k5U6kxipoECI6VLiOgnX00YJ'}" class="w-full bg-white border border-[#DDD4C4] rounded-xl p-2.5 text-xs font-mono">
                  </div>
                </div>
                <div class="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 font-medium">
                  <span>🔒</span>
                  <span>Credentials are active and verified for live merchant transactions. Zero delivery fees (₹0) enforced across all checkout orders.</span>
                </div>
              </div>

              <!-- Supabase Cloud Connection -->
              <div class="p-4 bg-[#FAF7F2] border border-[#DDD4C4] rounded-2xl space-y-3">
                <span class="text-xs uppercase tracking-wider text-[#FF6B35] font-bold block">Supabase Cloud Database Connection</span>
                <p class="text-xs text-[#666]">Enter your project URL and Anon Public Key from the Supabase Project Settings → API.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" id="set-supabase-url" placeholder="https://xyz.supabase.co" class="bg-white border border-[#DDD4C4] rounded-xl p-2.5 text-xs">
                  <input type="password" id="set-supabase-key" placeholder="Supabase Anon Public Key..." class="bg-white border border-[#DDD4C4] rounded-xl p-2.5 text-xs">
                </div>
              </div>

              <button type="submit" class="bg-[#111] hover:bg-[#FF6B35] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                Save Store Settings
              </button>
            </form>
          </div>
        </div>

        <!-- ==========================================
             TAB 7: USER LOGINS & REGISTERED ACCOUNTS
             ========================================== -->
        <div id="admin-tab-users" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-4 sm:p-6 shadow-sm">
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 class="font-heading text-xl font-bold text-black flex items-center gap-2">
                  <span>Customer Logins & Registrations</span>
                  <span class="bg-[#111] text-[#FF6B35] text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">${registeredUsers.length} Users</span>
                </h3>
                <p class="text-xs text-[#777] mt-0.5">Real-time records of registered customer profiles, mobile numbers, email addresses, and gender synced across all devices.</p>
              </div>

              <!-- User Search -->
              <div class="w-full sm:w-72">
                <input type="text" id="admin-user-search" placeholder="Search name, phone, email or gender..." 
                       class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#FF6B35] transition-colors font-medium">
              </div>
            </div>

            <!-- User Analytics Badges -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div class="bg-[#FAF9F6] border border-[#DDD4C4] rounded-xl p-3.5">
                <span class="text-[10px] uppercase font-bold text-[#777] tracking-wider block">Total Registered</span>
                <span class="text-xl font-black text-black font-mono mt-0.5 block">${registeredUsers.length}</span>
              </div>
              <div class="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5">
                <span class="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">Male Customers</span>
                <span class="text-xl font-black text-blue-800 font-mono mt-0.5 block">
                  ${registeredUsers.filter(u => (u.gender || '').toLowerCase() === 'male').length}
                </span>
              </div>
              <div class="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5">
                <span class="text-[10px] uppercase font-bold text-rose-700 tracking-wider block">Female Customers</span>
                <span class="text-xl font-black text-rose-800 font-mono mt-0.5 block">
                  ${registeredUsers.filter(u => (u.gender || '').toLowerCase() === 'female').length}
                </span>
              </div>
              <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
                <span class="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">Active Recently</span>
                <span class="text-xl font-black text-emerald-800 font-mono mt-0.5 block">
                  ${registeredUsers.filter(u => u.lastLogin).length}
                </span>
              </div>
            </div>

            <!-- Users Table (Desktop & Tablet) -->
            <div class="hidden md:block overflow-x-auto border border-[#E5E0D5] rounded-xl">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#F0EAE1] text-[#555] uppercase font-heading text-[10px] tracking-wider">
                  <tr>
                    <th class="py-3 px-4">Customer Name</th>
                    <th class="py-3 px-4">Mobile Number</th>
                    <th class="py-3 px-4">Email Address</th>
                    <th class="py-3 px-4">Gender</th>
                    <th class="py-3 px-4">Registered Date</th>
                    <th class="py-3 px-4">Last Login</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#E5E0D5]" id="admin-users-table-body">
                  ${registeredUsers.length === 0 ? `
                    <tr>
                      <td colspan="6" class="py-8 text-center text-[#777] font-medium">No registered customers found yet.</td>
                    </tr>
                  ` : registeredUsers.map(u => {
                    const cleanPhone = (u.phone || '').replace(/[^0-9]/g, '').slice(-10);
                    const genderBadge = (u.gender || '').toLowerCase() === 'male' 
                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                      : (u.gender || '').toLowerCase() === 'female'
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-zinc-100 text-zinc-800 border-zinc-200';
                    return `
                      <tr class="hover:bg-[#FAF9F6] transition-colors admin-user-row" data-search="${(u.name + ' ' + u.phone + ' ' + u.email + ' ' + u.gender).toLowerCase()}">
                        <td class="py-3.5 px-4 font-bold text-black flex items-center gap-2.5">
                          <div class="w-7 h-7 rounded-full bg-[#111] text-[#FF6B35] font-bold text-xs flex items-center justify-center flex-shrink-0">
                            ${(u.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span>${u.name || 'Anonymous User'}</span>
                        </td>
                        <td class="py-3.5 px-4">
                          ${cleanPhone ? `
                            <a href="https://wa.me/91${cleanPhone}" target="_blank" rel="noopener noreferrer" class="font-mono text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1.5" title="Chat on WhatsApp">
                              <span>+91 ${cleanPhone}</span>
                              <span class="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">WA</span>
                            </a>
                          ` : '<span class="text-[#888]">-</span>'}
                        </td>
                        <td class="py-3.5 px-4">
                          ${u.email ? `
                            <a href="mailto:${u.email}" class="text-blue-600 hover:underline font-medium">${u.email}</a>
                          ` : '<span class="text-[#888]">-</span>'}
                        </td>
                        <td class="py-3.5 px-4">
                          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${genderBadge}">
                            ${u.gender || 'Unspecified'}
                          </span>
                        </td>
                        <td class="py-3.5 px-4 text-[#666] font-mono text-[11px]">
                          ${u.createdAt ? new Date(u.createdAt).toLocaleString('en-IN') : 'Prior'}
                        </td>
                        <td class="py-3.5 px-4 font-mono text-[11px] text-emerald-700 font-bold">
                          ${u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-IN') : 'Never'}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- Users Cards List (Mobile Optimized) -->
            <div class="md:hidden space-y-3" id="admin-users-cards-list">
              ${registeredUsers.length === 0 ? `
                <div class="py-8 text-center text-[#777] font-medium bg-[#FAF9F6] rounded-xl border border-[#DDD4C4]">
                  No registered customers found yet.
                </div>
              ` : registeredUsers.map(u => {
                const cleanPhone = (u.phone || '').replace(/[^0-9]/g, '').slice(-10);
                const genderBadge = (u.gender || '').toLowerCase() === 'male' 
                  ? 'bg-blue-100 text-blue-800 border-blue-200' 
                  : (u.gender || '').toLowerCase() === 'female'
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-200';
                return `
                  <div class="p-4 bg-[#FAF9F6] border border-[#DDD4C4] rounded-2xl space-y-2.5 admin-user-card" data-search="${(u.name + ' ' + u.phone + ' ' + u.email + ' ' + u.gender).toLowerCase()}">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-full bg-[#111] text-[#FF6B35] font-bold text-xs flex items-center justify-center flex-shrink-0">
                          ${(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <strong class="text-sm font-bold text-black">${u.name || 'Customer'}</strong>
                      </div>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${genderBadge}">
                        ${u.gender || 'Unspecified'}
                      </span>
                    </div>

                    <div class="text-xs space-y-1.5 pt-1.5 border-t border-[#E5E0D5]">
                      <div class="flex items-center justify-between">
                        <span class="text-[#777]">Mobile:</span>
                        ${cleanPhone ? `
                          <a href="https://wa.me/91${cleanPhone}" target="_blank" rel="noopener noreferrer" class="font-mono text-emerald-700 font-bold">
                            +91 ${cleanPhone}
                          </a>
                        ` : '<span class="text-[#888]">-</span>'}
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-[#777]">Email:</span>
                        <a href="mailto:${u.email}" class="text-blue-600 truncate max-w-[180px]">${u.email || '-'}</a>
                      </div>
                      <div class="flex items-center justify-between text-[11px]">
                        <span class="text-[#777]">Last Active:</span>
                        <span class="font-mono text-emerald-700 font-bold">${u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN') : 'Recent'}</span>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

          </div>
        </div>

      </main>

      <!-- FIRST ADMIN SETUP MODAL -->
      <div id="first-admin-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#DDD4C4] space-y-5 text-xs my-8">
          <div class="flex items-center justify-between border-b border-[#EEE] pb-3">
            <div>
              <span class="text-[10px] uppercase font-bold text-[#FF6B35] tracking-widest">Administrator Onboarding</span>
              <h4 class="font-heading text-xl font-bold text-black mt-0.5">Creating the First Admin Account</h4>
            </div>
            <button id="close-admin-modal-btn" class="text-[#888] hover:text-black p-1 text-lg">✕</button>
          </div>

          <div class="space-y-4 text-[#444] leading-relaxed">
            <p>To adhere to strict security protocols, administrative credentials are never hard-coded or publicly exposed. Follow these official steps to designate your first administrator in Supabase:</p>
            
            <div class="bg-[#FAF7F2] p-4 rounded-xl border border-[#DDD4C4] space-y-2">
              <strong class="text-black block text-sm">Step 1: Create Account in Supabase Auth</strong>
              <p>In your Supabase Dashboard, navigate to <strong>Authentication → Users</strong> and click <strong>Add User</strong>. Create an account with your desired admin email and secure password.</p>
            </div>

            <div class="bg-[#FAF7F2] p-4 rounded-xl border border-[#DDD4C4] space-y-2">
              <strong class="text-black block text-sm">Step 2: Assign Admin Role via SQL Editor</strong>
              <p>Run the following SQL in Supabase SQL Editor to grant administrator privileges:</p>
              <pre class="bg-[#111] text-emerald-400 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
-- Replace with the UUID of the newly created user:
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_UUID_HERE', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';</pre>
            </div>

            <div class="bg-[#FAF7F2] p-4 rounded-xl border border-[#DDD4C4] space-y-2">
              <strong class="text-black block text-sm">Step 3: Access Admin Portal</strong>
              <p>Navigate to <strong>https://printoracustom.in/#admin</strong>. Authenticated administrators have server-verified access to orders, pricing, and configurations.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Assign Dealer / Courier Modal -->
      <div id="assign-dealer-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div class="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#DDD4C4] space-y-4">
          <div class="flex items-center justify-between border-b border-[#EEE] pb-3">
            <h4 class="font-heading text-lg font-bold text-black">Assign Courier & Tracking</h4>
            <button id="close-dealer-modal-btn" class="text-[#888] hover:text-black">✕</button>
          </div>
          
          <form id="dealer-assign-form" class="space-y-3 text-xs">
            <input type="hidden" id="assign-order-id">
            <div>
              <label class="block font-bold mb-1">Courier Partner *</label>
              <input type="text" id="assign-courier" required placeholder="e.g. DTDC Express, Delhivery, BlueDart" class="w-full border border-[#DDD4C4] rounded-xl p-2.5">
            </div>
            <div>
              <label class="block font-bold mb-1">AWB Tracking Number *</label>
              <input type="text" id="assign-tracking" required placeholder="e.g. DTDC-NZB-9981" class="w-full border border-[#DDD4C4] rounded-xl p-2.5 font-mono">
            </div>
            <button type="submit" class="w-full bg-[#111] hover:bg-[#FF6B35] text-white py-3 rounded-xl font-bold uppercase transition-colors">
              Save Courier Details
            </button>
          </form>
        </div>
      </div>

      <!-- ==========================================
           EDIT PRODUCT DETAILS MODAL (PRICE & IMAGES)
           ========================================== -->
      <div id="admin-edit-product-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">

        <div class="relative w-full max-w-xl bg-white border border-[#DDD4C4] rounded-3xl shadow-2xl p-6 md:p-8 space-y-5 text-[#111] my-8 animate-fade-in">
          <div class="flex items-center justify-between pb-3 border-b border-[#EFECE4]">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35] bg-[#FF6B35]/10 px-2 py-0.5 rounded-full font-heading">Product Editor</span>
              <h3 class="font-heading text-xl font-bold text-black mt-1" id="edit-prod-modal-title">Edit Product Details</h3>
            </div>
            <button id="close-edit-prod-modal-btn" type="button" class="text-[#888] hover:text-black p-1 text-lg cursor-pointer">✕</button>
          </div>

          <form id="admin-edit-prod-form" class="space-y-4 text-xs">
            <input type="hidden" id="edit-prod-id">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[11px] font-bold text-[#555] mb-1">Product Title / Name *</label>
                <input type="text" id="edit-prod-name" required class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3.5 py-2.5 font-bold outline-none focus:border-[#FF6B35]">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-[#555] mb-1">Category *</label>
                <select id="edit-prod-category" class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3.5 py-2.5 font-bold outline-none focus:border-[#FF6B35]">
                  <option value="apparel">Apparel</option>
                  <option value="sportswear">Sportswear</option>
                  <option value="bags">Bags</option>
                  <option value="drinkware">Drinkware</option>
                  <option value="personalized-gifts">Personalized Gifts</option>
                  <option value="stationery">Stationery</option>
                  <option value="corporate-merchandise">Corporate & Business</option>
                  <option value="tech-accessories">Tech Accessories</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[11px] font-bold text-[#555] mb-1">Customer Selling Price (₹) *</label>
                <input type="number" id="edit-prod-price" required placeholder="499" class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3.5 py-2.5 font-mono font-bold outline-none focus:border-[#FF6B35]">
                <span class="text-[10px] text-[#777] block mt-0.5">Amount customer pays at checkout</span>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-[#555] mb-1">Original MRP Price (₹) (Crossed-Out)</label>
                <input type="number" id="edit-prod-orig-price" placeholder="699" class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3.5 py-2.5 font-mono font-bold outline-none focus:border-[#FF6B35]">
                <span class="text-[10px] text-[#777] block mt-0.5">Displays discount strikethrough</span>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[11px] font-bold text-[#555]">Primary Product Image *</label>
                <span class="text-[10px] text-[#FF6B35] font-bold">Gallery or Image URL</span>
              </div>
              
              <!-- Direct Gallery / File Manager Image Picker -->
              <div class="mb-2.5 p-3 bg-[#FAF7F2] border-2 border-dashed border-[#FF6B35]/30 rounded-xl space-y-1">
                <label class="block text-[11px] font-bold text-[#FF6B35] flex items-center gap-1.5">
                  <span>📁 Choose Image from Device Gallery / File Manager</span>
                </label>
                <input type="file" id="edit-prod-file-input" accept="image/*" class="w-full text-xs text-[#555] file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#111] file:text-white hover:file:bg-[#FF6B35] file:cursor-pointer cursor-pointer">
                <span class="text-[10px] text-[#777] block">Select photo directly from your phone gallery or computer file explorer</span>
              </div>

              <input type="text" id="edit-prod-image" required placeholder="Image URL or loaded from gallery above" class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3.5 py-2.5 font-mono text-[11px] outline-none focus:border-[#FF6B35]">
              
              <!-- Real-time Image Preview -->
              <div class="mt-2.5 flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-xl border border-[#DDD4C4]">
                <div class="flex items-center gap-3">
                  <img id="edit-prod-img-preview" src="" alt="Preview" class="w-14 h-14 rounded-lg object-cover border border-[#CCC] bg-white">
                  <div class="text-[11px] text-[#666]">
                    <strong class="text-black block font-heading">Live Image Preview</strong>
                    <span class="text-[10px]">Photo loaded from gallery or URL</span>
                  </div>
                </div>
                <button type="button" id="restore-default-prod-img-btn" class="text-[11px] text-[#FF6B35] hover:text-[#111] font-bold underline cursor-pointer p-1">
                  ↺ Revert to Official Image
                </button>
              </div>
            </div>


            <div>
              <label class="block text-[11px] font-bold text-[#555] mb-1">Additional Gallery Image URLs (Optional)</label>
              <textarea id="edit-prod-extra-images" rows="2" placeholder="Paste extra image URLs separated by comma or new lines" class="w-full bg-white border border-[#DDD4C4] rounded-xl p-3 font-mono text-[11px] outline-none focus:border-[#FF6B35] resize-none"></textarea>
            </div>

            <div class="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD4C4]">
              <div>
                <strong class="text-black block text-xs">Catalogue Visibility</strong>
                <span class="text-[10px] text-[#777]">Set whether this product is active and visible to customers</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="edit-prod-available" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
              </label>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-[#EFECE4]">
              <button type="button" id="cancel-edit-prod-btn" class="px-4 py-2.5 rounded-xl border border-[#DDD4C4] text-[#666] font-bold hover:bg-[#F0EAE1] cursor-pointer">
                Cancel
              </button>
              <button type="submit" id="save-prod-changes-btn" class="bg-[#111] hover:bg-[#FF6B35] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 min-w-[170px]">
                <span id="save-prod-btn-text">Save Product Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `;
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Order Placed': return 'bg-amber-100 text-amber-800 border border-amber-300';
    case 'Payment Pending': return 'bg-orange-100 text-orange-800 border border-orange-300';
    case 'Payment Confirmed': return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'Artwork Verification': return 'bg-indigo-100 text-indigo-800 border border-indigo-300';
    case 'In Production': return 'bg-purple-100 text-purple-800 border border-purple-300';
    case 'Quality Check': return 'bg-pink-100 text-pink-800 border border-pink-300';
    case 'Shipped': return 'bg-cyan-100 text-cyan-800 border border-cyan-300';
    case 'Out for Delivery': return 'bg-teal-100 text-teal-800 border border-teal-300';
    case 'Delivered': return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    case 'Cancelled': return 'bg-rose-100 text-rose-800 border border-rose-300';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function initAdminEvents() {
  // Gatekeeper: If unauthenticated, bind login barrier events only
  if (!isAdminAuthenticated()) {
    const loginForm = document.getElementById('admin-login-form');
    const pwdToggle = document.getElementById('admin-pwd-toggle');
    const pwdInput = document.getElementById('admin-pwd-input');
    const userInput = document.getElementById('admin-user-input');
    const errBox = document.getElementById('admin-login-error');

    if (pwdToggle && pwdInput) {
      pwdToggle.addEventListener('click', () => {
        pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = userInput?.value.trim();
        const pwd = pwdInput?.value;
        const creds = getAdminCredentials();

        if (user.toLowerCase() === creds.username.toLowerCase() && pwd === creds.password) {
          setAdminAuthenticated(true);
          store.showToast('Admin authenticated successfully', 'success');
          if (window.printoraApp) {
            window.printoraApp.renderAdminOnly();
          } else {
            window.location.reload();
          }
        } else {
          if (errBox) {
            errBox.textContent = 'Invalid Admin ID or Password. Access denied.';
            errBox.classList.remove('hidden');
          }
        }
      });
    }
    return;
  }

  // Admin Logout Triggers (Mobile & Desktop)
  document.querySelectorAll('.admin-logout-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      setAdminAuthenticated(false);
      store.showToast('Logged out of Admin Portal', 'info');
      window.location.hash = '#catalogue';
      if (window.printoraApp) {
        window.printoraApp.route();
      }
    });
  });


  // Tab Switching
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      window._adminActiveTab = target;
      tabBtns.forEach(b => {
        b.className = 'admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap';
      });
      btn.className = 'admin-tab-btn py-3 border-b-2 border-[#FF6B35] text-white whitespace-nowrap';

      tabContents.forEach(c => {
        if (c.id === `admin-tab-${target}`) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });

  // Restore previously active tab if available
  if (window._adminActiveTab) {
    const activeTabBtn = document.querySelector(`.admin-tab-btn[data-tab="${window._adminActiveTab}"]`);
    if (activeTabBtn) {
      activeTabBtn.click();
    }
  }

  // Setup Guide Modal
  const setupBtn = document.getElementById('admin-setup-guide-btn');
  const setupModal = document.getElementById('first-admin-modal');
  const closeSetupBtn = document.getElementById('close-admin-modal-btn');

  if (setupBtn && setupModal) {
    setupBtn.addEventListener('click', () => setupModal.classList.remove('hidden'));
  }
  if (closeSetupBtn && setupModal) {
    closeSetupBtn.addEventListener('click', () => setupModal.classList.add('hidden'));
  }

  // Manage Order Jump Handler from Overview Tab
  document.addEventListener('click', (e) => {
    const manageBtn = e.target.closest('.admin-view-order-btn');
    if (manageBtn) {
      e.preventDefault();
      const orderId = manageBtn.getAttribute('data-order-id');
      const ordersTabBtn = document.querySelector('.admin-tab-btn[data-tab="orders"]');
      if (ordersTabBtn) ordersTabBtn.click();
      setTimeout(() => {
        const card = document.querySelector(`[data-order-card="${orderId}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('ring-2', 'ring-[#FF6B35]');
          setTimeout(() => card.classList.remove('ring-2', 'ring-[#FF6B35]'), 2500);
        }
      }, 100);
    }
  });

  // Customer Uploaded Designs Lightbox Modal Handlers
  document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.admin-view-design-btn');
    if (viewBtn) {
      e.preventDefault();
      const imgSrc = viewBtn.getAttribute('data-img-src');
      const imgName = viewBtn.getAttribute('data-img-name') || 'customer-design';
      const orderCode = viewBtn.getAttribute('data-order') || '';
      const custName = viewBtn.getAttribute('data-cust') || '';

      const modal = document.getElementById('admin-design-lightbox-modal');
      const modalImg = document.getElementById('admin-lightbox-img');
      const modalSub = document.getElementById('admin-lightbox-subtitle');
      const modalFile = document.getElementById('admin-lightbox-filename');
      const downloadLink = document.getElementById('admin-lightbox-download-link');

      if (modalImg) modalImg.src = imgSrc;
      if (modalSub) modalSub.textContent = `Order: ${orderCode} | Customer: ${custName}`;
      if (modalFile) modalFile.textContent = imgName;
      if (downloadLink) {
        downloadLink.href = imgSrc;
        downloadLink.download = imgName;
      }
      if (modal) modal.classList.remove('hidden');
    }

    if (e.target.closest('#admin-close-lightbox-btn') || e.target.id === 'admin-design-lightbox-modal') {
      const modal = document.getElementById('admin-design-lightbox-modal');
      if (modal) modal.classList.add('hidden');
    }
  });

  // Customer Uploaded Designs Search Filter
  const customDesignSearch = document.getElementById('admin-custom-design-search');
  if (customDesignSearch) {
    customDesignSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.admin-design-card').forEach(card => {
        const text = (card.getAttribute('data-search') || '').toLowerCase();
        if (!query || text.includes(query)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  // Admin Delete Order (Globally removes from Admin and Customer views)
  document.querySelectorAll('.admin-delete-order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const orderId = btn.getAttribute('data-order-id');
      if (!orderId) return;
      if (confirm(`⚠️ Permanently delete Order #${orderId}?\n\nThis will remove it completely from both Admin and Customer views across all devices.`)) {
        store.deleteOrder(orderId);
        window._adminActiveTab = 'orders';
        if (window.printoraApp) {
          window.printoraApp.renderAdminOnly();
        }
      }
    });
  });

  // Admin User Search Filter
  const userSearch = document.getElementById('admin-user-search');
  if (userSearch) {
    userSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.admin-user-row').forEach(row => {
        const text = row.getAttribute('data-search') || '';
        row.style.display = text.includes(q) ? '' : 'none';
      });
      document.querySelectorAll('.admin-user-card').forEach(card => {
        const text = card.getAttribute('data-search') || '';
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // 10-Status Lifecycle Dropdown
  const statusSelects = document.querySelectorAll('.admin-order-status-select');
  statusSelects.forEach(sel => {
    sel.addEventListener('change', async (e) => {
      const orderId = e.target.getAttribute('data-order-id');
      const newStatus = e.target.value;
      store.updateOrderStatus(orderId, newStatus);

      // Trigger Brevo Confirmation Email when Admin Confirms Payment
      if (newStatus === 'Payment Confirmed') {
        const order = store.orders.find(o => o.orderCode === orderId);
        if (order && order.customerEmail) {
          const apiKey = store.settings.brevoApiKey || "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";
          store.showToast(`Dispatching payment confirmation email to ${order.customerEmail}...`, 'info');
          const res = await sendPaymentConfirmedEmail({
            apiKey,
            toEmail: order.customerEmail,
            toName: order.customerName || "Valued Customer",
            orderCode: order.orderCode,
            totalAmount: order.totalAmount,
            items: order.items || []
          });
          if (res.success) {
            store.showToast(`✓ Payment confirmed email sent to ${order.customerEmail} via Brevo!`, 'success');
          } else {
            store.showToast(`Brevo notice: ${res.error || 'Failed to dispatch email'}`, 'warning');
          }
        }
      }
    });
  });


  // Assign Dealer Modal events
  const assignModal = document.getElementById('assign-dealer-modal');
  const closeDealerBtn = document.getElementById('close-dealer-modal-btn');
  const dealerForm = document.getElementById('dealer-assign-form');
  const assignOrderIdInput = document.getElementById('assign-order-id');

  if (closeDealerBtn && assignModal) {
    closeDealerBtn.addEventListener('click', () => assignModal.classList.add('hidden'));
  }

  document.querySelectorAll('.admin-assign-dealer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-order-id');
      if (assignOrderIdInput) assignOrderIdInput.value = orderId;
      if (assignModal) assignModal.classList.remove('hidden');
    });
  });

  if (dealerForm) {
    dealerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const orderId = assignOrderIdInput?.value;
      const courier = document.getElementById('assign-courier')?.value;
      const tracking = document.getElementById('assign-tracking')?.value;

      store.assignSupplierToOrder(orderId, {
        supplierId: 'hub-primary',
        supplierName: 'Printora Express Fulfillment Hub',
        privateCost: 0,
        courier,
        trackingNumber: tracking
      });

      if (assignModal) assignModal.classList.add('hidden');
    });
  }

  // Coupon Form
  const couponForm = document.getElementById('admin-create-coupon-form');
  if (couponForm) {
    couponForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('new-coupon-code')?.value.trim().toUpperCase();
      const type = document.getElementById('new-coupon-type')?.value;
      const val = Number(document.getElementById('new-coupon-val')?.value);
      const min = Number(document.getElementById('new-coupon-min')?.value);
      const expiryVal = document.getElementById('new-coupon-expiry')?.value;
      const expiresAt = expiryVal ? new Date(expiryVal).toISOString() : null;

      if (!code) return;

      const newCoupon = {
        code,
        discountType: type,
        value: val,
        minOrder: min,
        expiresAt,
        description: `${type === 'percent' ? `${val}% OFF` : `₹${val} OFF`} on orders above ₹${min}${expiresAt ? ` (Valid till ${new Date(expiresAt).toLocaleDateString('en-IN')})` : ''}`
      };

      const existingIdx = store.coupons.findIndex(c => c.code === code);
      if (existingIdx >= 0) {
        store.coupons[existingIdx] = newCoupon;
      } else {
        store.coupons.unshift(newCoupon);
      }

      window._adminActiveTab = 'coupons';
      store.saveCoupons();
      store.showToast(`Coupon ${code} saved successfully`, 'success');
      couponForm.reset();
    });
  }

  // Delete Coupon Event
  document.querySelectorAll('.admin-delete-coupon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      if (!code) return;
      if (confirm(`Are you sure you want to delete coupon "${code}"? Customers will no longer be able to use it at checkout.`)) {
        window._adminActiveTab = 'coupons';
        store.deleteCoupon(code);
      }
    });
  });

  // Store Settings Form Save (Brand Info, Admin Credentials, Brevo Key, Supabase)
  const settingsForm = document.getElementById('admin-store-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const brandName = document.getElementById('set-brand-name')?.value;
      const tagline = document.getElementById('set-tagline')?.value;
      const whatsappNumber = document.getElementById('set-whatsapp')?.value;
      const instagramHandle = document.getElementById('set-instagram')?.value;
      const supabaseUrl = document.getElementById('set-supabase-url')?.value;
      const supabaseKey = document.getElementById('set-supabase-key')?.value;

      // Admin Credentials update
      const newAdminUser = document.getElementById('set-admin-username')?.value.trim();
      const newAdminPwd = document.getElementById('set-admin-password')?.value;
      if (newAdminUser && newAdminPwd) {
        saveAdminCredentials(newAdminUser, newAdminPwd);
      }

      // Brevo API Key update
      const brevoKey = document.getElementById('set-brevo-api-key')?.value.trim() || '';
      localStorage.setItem('printora_brevo_api_key', brevoKey);

      // Razorpay Live Gateway update
      const razorpayKeyId = document.getElementById('set-razorpay-key-id')?.value.trim() || 'rzp_live_TwnbxHtTo3019C';
      const razorpayKeySecret = document.getElementById('set-razorpay-key-secret')?.value.trim() || 'k5U6kxipoECI6VLiOgnX00YJ';
      localStorage.setItem('printora_razorpay_key_id', razorpayKeyId);
      localStorage.setItem('printora_razorpay_key_secret', razorpayKeySecret);

      store.settings = {
        ...store.settings,
        brandName,
        tagline,
        whatsappNumber,
        instagramHandle,
        brevoApiKey: brevoKey,
        razorpayKeyId,
        razorpayKeySecret,
        shippingFlatFee: 0, // Strict rule: always 0
        freeShippingThreshold: 0
      };
      store.saveSettings();

      // Update Brevo badge
      const brevoBadge = document.getElementById('brevo-status-badge');
      if (brevoBadge) {
        if (brevoKey) {
          brevoBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
          brevoBadge.textContent = '● Brevo Connected';
        } else {
          brevoBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800';
          brevoBadge.textContent = '○ API Key Required';
        }
      }

      const rzpBadge = document.getElementById('razorpay-status-badge');
      if (rzpBadge) {
        if (razorpayKeyId && razorpayKeySecret) {
          rzpBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
          rzpBadge.textContent = '● Live Gateway Active';
        } else {
          rzpBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800';
          rzpBadge.textContent = '○ Key Required';
        }
      }

      if (supabaseUrl && supabaseKey) {
        updateSupabaseCredentials(supabaseUrl, supabaseKey);
      } else {
        store.showToast("Store settings, Razorpay keys & credentials saved successfully!", "success");
      }
    });
  }

  // Brevo Test OTP Dispatch Button
  const testBrevoBtn = document.getElementById('test-brevo-btn');
  const brevoFeedback = document.getElementById('brevo-test-feedback');
  if (testBrevoBtn) {
    testBrevoBtn.addEventListener('click', async () => {
      const apiKeyInput = document.getElementById('set-brevo-api-key');
      const apiKey = apiKeyInput?.value.trim() || store.settings.brevoApiKey || localStorage.getItem('printora_brevo_api_key');

      if (!apiKey) {
        alert("Please enter a Brevo API key first (starts with 'xkeysib-').");
        return;
      }

      const defaultEmail = getAdminCredentials().username.includes('@') ? getAdminCredentials().username : 'admin@printoracustom.in';
      const recipient = prompt("Enter an email address to send a real test OTP verification email:", defaultEmail);
      if (!recipient || !recipient.trim()) return;

      if (brevoFeedback) {
        brevoFeedback.className = 'text-xs p-3 rounded-xl font-medium bg-blue-50 text-blue-700 border border-blue-200 block';
        brevoFeedback.textContent = `⏳ Connecting to Brevo v3 REST API and dispatching OTP to ${recipient}...`;
      }

      testBrevoBtn.disabled = true;
      testBrevoBtn.textContent = 'Sending...';

      const testOtp = generate6DigitOtp();
      const res = await sendBrevoOtpEmail({
        apiKey,
        toEmail: recipient.trim(),
        toName: "PRINTORA Administrator",
        otpCode: testOtp,
        purpose: "Admin Brevo API Live Test"
      });

      testBrevoBtn.disabled = false;
      testBrevoBtn.textContent = 'Test Send OTP';

      if (brevoFeedback) {
        if (res.success) {
          brevoFeedback.className = 'text-xs p-3 rounded-xl font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 block';
          brevoFeedback.innerHTML = `✅ <strong>Brevo Test Succeeded!</strong> OTP <code>${testOtp}</code> was dispatched to <strong>${recipient}</strong>.<br><span class="text-[11px] text-[#555]">Message ID: ${res.messageId || 'Delivered'}</span>`;
        } else {
          brevoFeedback.className = 'text-xs p-3 rounded-xl font-medium bg-rose-50 text-rose-800 border border-rose-200 block';
          brevoFeedback.innerHTML = `❌ <strong>Brevo Dispatch Failed:</strong> ${res.error}`;
        }
      }
    });
  }

  // ==========================================
  // PRODUCT EDIT MODAL & MANAGEMENT
  // ==========================================
  const editModal = document.getElementById('admin-edit-product-modal');
  const closeEditBtn = document.getElementById('close-edit-prod-modal-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-prod-btn');
  const editForm = document.getElementById('admin-edit-prod-form');
  const editIdInput = document.getElementById('edit-prod-id');
  const editNameInput = document.getElementById('edit-prod-name');
  const editPriceInput = document.getElementById('edit-prod-price');
  const editOrigPriceInput = document.getElementById('edit-prod-orig-price');
  const editImgInput = document.getElementById('edit-prod-image');
  const editImgPreview = document.getElementById('edit-prod-img-preview');
  const editExtraImgsInput = document.getElementById('edit-prod-extra-images');
  const editAvailableInput = document.getElementById('edit-prod-available');

  const closeEditModal = () => {
    if (editModal) editModal.classList.add('hidden');
  };

  if (closeEditBtn) closeEditBtn.addEventListener('click', closeEditModal);
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);

  // Live image preview listener
  if (editImgInput && editImgPreview) {
    editImgInput.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      editImgPreview.src = url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80';
    });
  }

  // Register Delegated Global Admin Handlers EXACTLY ONCE to prevent duplicate popups/listeners
  if (!window.__adminGlobalListenersInitialized) {
    window.__adminGlobalListenersInitialized = true;

    // Device Gallery & File Manager Image Reader with Automatic Web Optimization
    document.addEventListener('change', async (e) => {
      if (e.target && e.target.id === 'edit-prod-file-input') {
        const file = e.target.files?.[0];
        if (file) {
          const submitBtn = document.getElementById('save-prod-changes-btn');
          const btnText = document.getElementById('save-prod-btn-text');
          if (submitBtn) {
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = '⏳ Processing Photo...';
          }

          try {
            store.showToast('Optimizing photo for fast global sync...', 'info');
            const dataUrl = await compressImageFile(file, 500, 500, 0.68);
            const imgIn = document.getElementById('edit-prod-image');
            const imgPrev = document.getElementById('edit-prod-img-preview');
            if (imgIn) imgIn.value = dataUrl;
            if (imgPrev) imgPrev.src = dataUrl;
            store.showToast('✓ Photo ready! Click "Save Product Changes" to publish across all devices.', 'success');
          } catch (err) {
            console.error('Image optimization failed:', err);
            store.showToast('Failed to process image: ' + err.message, 'warning');
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              if (btnText) btnText.textContent = 'Save Product Changes';
            }
          }
        }
      }
    });

    // Force Sync All Products to Netlify Cloud Button
    document.addEventListener('click', async (e) => {
      const syncAllBtn = e.target.closest('#admin-sync-all-cloud-btn');
      if (!syncAllBtn) return;
      syncAllBtn.disabled = true;
      syncAllBtn.textContent = '⏳ Syncing to All Devices...';
      await store.publishAllProductsLive();
      syncAllBtn.disabled = false;
      syncAllBtn.textContent = '🚀 Publish All Live';
    });

    // Delegated Open Edit Product Modal on button click (100% reliable across tab switches)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.admin-edit-prod-btn');
      if (!btn) return;

      const prodId = btn.getAttribute('data-prod-id');
      const prod = store.products.find(p => p.id === prodId);
      if (!prod) return;

      const modalEl = document.getElementById('admin-edit-product-modal');
      const idIn = document.getElementById('edit-prod-id');
      const nameIn = document.getElementById('edit-prod-name');
      const catIn = document.getElementById('edit-prod-category');
      const priceIn = document.getElementById('edit-prod-price');
      const origPriceIn = document.getElementById('edit-prod-orig-price');
      const imgIn = document.getElementById('edit-prod-image');
      const imgPrev = document.getElementById('edit-prod-img-preview');
      const extraImgsIn = document.getElementById('edit-prod-extra-images');
      const availIn = document.getElementById('edit-prod-available');
      const titleEl = document.getElementById('edit-prod-modal-title');
      const submitBtn = document.getElementById('save-prod-changes-btn');
      const btnText = document.getElementById('save-prod-btn-text');

      if (idIn) idIn.value = prod.id;
      if (nameIn) nameIn.value = prod.name;
      if (catIn) catIn.value = prod.categoryId || 'apparel';
      if (priceIn) priceIn.value = prod.price !== null && prod.price !== undefined ? prod.price : '';
      if (origPriceIn) origPriceIn.value = prod.originalPrice !== null && prod.originalPrice !== undefined ? prod.originalPrice : '';
      
      const primaryImg = prod.images?.[0] || '';
      if (imgIn) imgIn.value = primaryImg;
      if (imgPrev) imgPrev.src = primaryImg;

      const extraImgs = prod.images && prod.images.length > 1 ? prod.images.slice(1).join(', ') : '';
      if (extraImgsIn) extraImgsIn.value = extraImgs;

      if (availIn) availIn.checked = prod.isAvailable !== false;
      if (titleEl) titleEl.textContent = `Edit Product: ${prod.name}`;

      if (submitBtn) {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Save Product Changes';
      }

      if (modalEl) modalEl.classList.remove('hidden');
    });

    // Delegated Open Add Product Modal on button click (100% reliable across tab switches)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.admin-quick-add-trigger');
      if (!btn) return;
      const prodTabBtn = document.querySelector('.admin-tab-btn[data-tab="products"]');
      if (prodTabBtn) prodTabBtn.click();

      const modalEl = document.getElementById('admin-edit-product-modal');
      const idIn = document.getElementById('edit-prod-id');
      const nameIn = document.getElementById('edit-prod-name');
      const catIn = document.getElementById('edit-prod-category');
      const priceIn = document.getElementById('edit-prod-price');
      const origPriceIn = document.getElementById('edit-prod-orig-price');
      const imgIn = document.getElementById('edit-prod-image');
      const imgPrev = document.getElementById('edit-prod-img-preview');
      const extraImgsIn = document.getElementById('edit-prod-extra-images');
      const availIn = document.getElementById('edit-prod-available');
      const titleEl = document.getElementById('edit-prod-modal-title');
      const submitBtn = document.getElementById('save-prod-changes-btn');
      const btnText = document.getElementById('save-prod-btn-text');
      const fileIn = document.getElementById('edit-prod-file-input');

      if (idIn) idIn.value = `prn-custom-${Date.now()}`;
      if (nameIn) nameIn.value = '';
      if (catIn) catIn.value = 'apparel';
      if (priceIn) priceIn.value = '';
      if (origPriceIn) origPriceIn.value = '';
      if (imgIn) imgIn.value = '';
      if (imgPrev) imgPrev.src = '';
      if (extraImgsIn) extraImgsIn.value = '';
      if (fileIn) fileIn.value = '';
      if (availIn) availIn.checked = true;
      if (titleEl) titleEl.textContent = 'Add New Product to Catalogue';

      if (submitBtn) {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = '+ Add Product to Catalogue';
      }

      if (modalEl) modalEl.classList.remove('hidden');
    });

    // Handle Edit/Add Product Form Submission (Delegated to guarantee 100% execution)
    document.addEventListener('submit', async (e) => {
      const form = e.target.closest('#admin-edit-prod-form');
      if (!form) return;
      e.preventDefault();

      const submitBtn = form.querySelector('#save-prod-changes-btn') || form.querySelector('button[type="submit"]');
      const btnText = form.querySelector('#save-prod-btn-text');
      const idInput = form.querySelector('#edit-prod-id');
      const id = idInput?.value || `prn-custom-${Date.now()}`;

      if (submitBtn) {
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = '⏳ Publishing Globally...';
      }

      try {
        const name = form.querySelector('#edit-prod-name')?.value.trim();
        const categoryId = form.querySelector('#edit-prod-category')?.value || 'apparel';
        const catMap = {
          'apparel': 'Apparel',
          'sportswear': 'Sportswear',
          'bags': 'Bags',
          'drinkware': 'Drinkware',
          'personalized-gifts': 'Personalized Gifts',
          'stationery': 'Stationery',
          'corporate-merchandise': 'Corporate & Business',
          'tech-accessories': 'Tech Accessories'
        };
        const categoryName = catMap[categoryId] || 'Apparel';
        const priceVal = form.querySelector('#edit-prod-price')?.value.trim();
        const origPriceVal = form.querySelector('#edit-prod-orig-price')?.value.trim();
        const primaryImg = form.querySelector('#edit-prod-image')?.value.trim();
        const extraImgsStr = form.querySelector('#edit-prod-extra-images')?.value.trim();
        const isAvailable = form.querySelector('#edit-prod-available')?.checked !== false;

        const price = priceVal !== '' ? Number(priceVal) : null;
        const originalPrice = origPriceVal !== '' ? Number(origPriceVal) : null;

        let images = primaryImg ? [primaryImg] : [];
        if (extraImgsStr) {
          const extras = extraImgsStr.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
          images = [...images, ...extras];
        }
        if (images.length === 0) {
          images = ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'];
        }

        store.showToast(`Publishing "${name}" live across all devices...`, 'info');

        await store.updateProduct(id, {
          name,
          categoryId,
          categoryName,
          price,
          originalPrice,
          images,
          isAvailable,
          isQuoteOnly: price === null
        });

        if (btnText) btnText.textContent = '✓ Saved Live Globally!';
        store.showToast(`✓ Product "${name}" saved & published globally!`, 'success');

        setTimeout(() => {
          const modal = document.getElementById('admin-edit-product-modal');
          if (modal) modal.classList.add('hidden');
          window._adminActiveTab = 'products';
          if (window.printoraApp) {
            window.printoraApp.renderAdminOnly();
          }
        }, 400);

      } catch (err) {
        console.error('Update/add product error:', err);
        store.showToast('Save failed: ' + err.message, 'warning');
        if (submitBtn) {
          submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Save Product Changes';
        }
      }
    });

    // Handle Delete Product Button (Delegated listener registered ONCE, prevents multiple confirms)
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('.admin-delete-prod-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      if (btn.dataset.deleting === 'true') return;

      const prodId = btn.getAttribute('data-prod-id');
      const prodName = btn.getAttribute('data-prod-name') || store.products.find(p => p.id === prodId)?.name || 'this product';

      if (confirm(`🗑️ Delete "${prodName}" from catalogue?\n\nThis will permanently remove it from both User Storefront and Admin Dashboard across all devices.`)) {
        btn.dataset.deleting = 'true';
        btn.disabled = true;
        btn.textContent = '⏳ Deleting...';
        await store.deleteProduct(prodId);
        window._adminActiveTab = 'products';
        if (window.printoraApp) {
          window.printoraApp.renderAdminOnly();
        }
      }
    });

    // Revert Single Product to Official Image (in Edit Modal)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#restore-default-prod-img-btn');
      if (!btn) return;
      e.preventDefault();
      const idIn = document.getElementById('edit-prod-id');
      const prodId = idIn?.value;
      if (!prodId) return;

      const orig = INITIAL_PRODUCTS.find(p => p.id === prodId);
      if (orig && orig.images && orig.images.length > 0) {
        const imgIn = document.getElementById('edit-prod-image');
        const imgPrev = document.getElementById('edit-prod-img-preview');
        const extraImgsIn = document.getElementById('edit-prod-extra-images');
        if (imgIn) imgIn.value = orig.images[0];
        if (imgPrev) imgPrev.src = orig.images[0];
        if (extraImgsIn) extraImgsIn.value = orig.images.slice(1).join(', ');
        store.showToast(`Reverted to official photo for "${orig.name}"!`, 'info');
      } else {
        store.showToast('No official default image found for this custom item', 'warning');
      }
    });

    // Restore All Official Images button
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('#admin-restore-all-images-btn');
      if (!btn) return;
      e.preventDefault();

      if (confirm('↺ Restore all standard products back to original official mockups & photos across all devices?')) {
        btn.disabled = true;
        btn.textContent = '⏳ Restoring...';
        await store.restoreAllOfficialImages();
        window._adminActiveTab = 'products';
        if (window.printoraApp) {
          window.printoraApp.renderAdminOnly();
        }
      }
    });
  }
}

