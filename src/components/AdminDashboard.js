// PRINTORA Master Admin Dashboard
// Section 19: Full administrative control, 10-status order lifecycle, price management, coupons, and Supabase first admin setup guide

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { isSupabaseConfigured, updateSupabaseCredentials } from '../services/supabase.js';
import { sendBrevoOtpEmail, generate6DigitOtp } from '../services/brevo.js';

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

  // Overview Metrics Calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Order Placed' || o.status === 'Payment Pending').length;
  const inProductionOrders = orders.filter(o => o.status === 'In Production' || o.status === 'Artwork Verification').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped' || o.status === 'Out for Delivery').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return `
    <div id="admin-view" class="min-h-screen bg-[#F5F5F5] text-[#111111] pb-24 font-sans">
      
      <!-- Admin Top Bar -->
      <header class="bg-[#111111] text-white border-b border-[#222] sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a href="#catalogue" class="text-xs uppercase tracking-widest text-[#FF6B35] hover:underline flex items-center gap-1 font-heading">
              <span>← Back to Store</span>
            </a>
            <span class="text-[#333]">|</span>
            <img src="/assets/logo.png" alt="PRINTORA" class="h-8 w-auto object-contain rounded-lg bg-white p-0.5">
            <span class="font-heading text-lg font-bold tracking-wider text-white">PRINTORA ADMIN</span>
            <span class="text-[10px] bg-[#FF6B35]/20 text-[#FF6B35] px-2 py-0.5 rounded font-mono font-bold">CONTROL CENTER</span>
          </div>

          <div class="flex items-center gap-3 text-xs">
            <button id="admin-setup-guide-btn" class="text-xs text-[#DDD] hover:text-white underline font-semibold">
              🔑 First Admin Setup Guide
            </button>
            <span class="hidden sm:inline-flex items-center gap-1.5 ${isSupabaseConfigured() ? 'text-emerald-400' : 'text-amber-400'}">
              <span class="w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
              <span>${isSupabaseConfigured() ? 'Supabase Live' : 'Local Sync Active'}</span>
            </span>
            <button id="admin-quick-add-prod-btn" class="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
              ${renderIcon('plus', 'w-3.5 h-3.5')}
              <span>Add Product</span>
            </button>
            <button id="admin-logout-btn" class="bg-[#242424] hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer" title="Log out from Admin">
              ${renderIcon('x', 'w-3.5 h-3.5')}
              <span>Logout</span>
            </button>
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
                        <button class="admin-view-order-btn text-[#FF6B35] hover:text-black font-bold" data-order-id="${o.orderCode}">
                          Manage →
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

                    <div class="flex items-center gap-3">
                      <!-- 10-Status Lifecycle Dropdown -->
                      <select class="admin-order-status-select bg-white border border-[#DDD4C4] rounded-xl px-3 py-1.5 text-xs font-bold outline-none" data-order-id="${o.orderCode}">
                        ${ADMIN_ORDER_STATUSES.map(st => `
                          <option value="${st}" ${st === o.status ? 'selected' : ''}>${st}</option>
                        `).join('')}
                      </select>

                      <button class="admin-assign-dealer-btn bg-[#111] hover:bg-[#FF6B35] text-white px-3.5 py-1.5 text-xs rounded-xl font-bold transition-colors" data-order-id="${o.orderCode}">
                        Assign Courier
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

                  <!-- Personalized Items -->
                  <div class="bg-white p-3.5 rounded-xl border border-[#DDD4C4] space-y-2">
                    <span class="text-[#777] font-bold uppercase tracking-wider text-[10px] block">Customized Items</span>
                    <div class="space-y-1.5 text-xs">
                      ${o.items.map(it => `
                        <div class="flex items-start justify-between py-1 border-b border-[#F0EAE1] last:border-0">
                          <div>
                            <strong class="text-black">${it.name}</strong> (x${it.quantity})
                            <div class="text-[11px] text-[#666] space-x-2">
                              ${it.selectedSize ? `<span>Size: ${it.selectedSize}</span>` : ''}
                              ${it.selectedColor ? `<span>Color: ${it.selectedColor}</span>` : ''}
                              ${it.customName ? `<span>Name: <strong class="text-black uppercase">${it.customName}</strong></span>` : ''}
                              ${it.customNumber ? `<span>Jersey #: <strong class="text-black font-mono">#${it.customNumber}</strong></span>` : ''}
                            </div>
                            ${it.customNotes ? `<div class="text-[11px] text-[#777] italic">Instructions: "${it.customNotes}"</div>` : ''}
                          </div>
                          <span class="font-mono font-bold text-black">₹${it.price * it.quantity}</span>
                        </div>
                      `).join('')}
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
             TAB 3: PRODUCTS & PRICING MANAGEMENT
             ========================================== -->
        <div id="admin-tab-products" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="font-heading text-xl font-bold text-black">Product Catalogue & Exact Pricing</h3>
                <p class="text-xs text-[#777]">Strict pricing compliance: Prices can only be changed by authorized administrators.</p>
              </div>
              <button id="admin-add-product-btn-2" class="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5">
                ${renderIcon('plus', 'w-3.5 h-3.5')}
                <span>Add New Product</span>
              </button>
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
                        <button class="admin-edit-prod-btn text-[#FF6B35] hover:text-black font-bold px-2.5 py-1 rounded-lg bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 transition-colors cursor-pointer" data-prod-id="${p.id}">
                          ✏️ Edit Price & Images
                        </button>
                        <button class="admin-delete-prod-btn text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer" data-prod-id="${p.id}">
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

            <div>
              <label class="block text-[11px] font-bold text-[#555] mb-1">Product Title / Name *</label>
              <input type="text" id="edit-prod-name" required class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3.5 py-2.5 font-bold outline-none focus:border-[#FF6B35]">
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
              <label class="block text-[11px] font-bold text-[#555] mb-1">Primary Product Image URL *</label>
              <input type="url" id="edit-prod-image" required placeholder="https://images.unsplash.com/..." class="w-full bg-white border border-[#DDD4C4] rounded-xl px-3.5 py-2.5 font-mono text-[11px] outline-none focus:border-[#FF6B35]">
              
              <!-- Real-time Image Preview -->
              <div class="mt-2.5 flex items-center gap-3 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#DDD4C4]">
                <img id="edit-prod-img-preview" src="" alt="Preview" class="w-14 h-14 rounded-lg object-cover border border-[#CCC] bg-white">
                <div class="text-[11px] text-[#666]">
                  <strong class="text-black block font-heading">Live Image Preview</strong>
                  <span class="text-[10px]">Verify your product photo appearance</span>
                </div>
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
              <button type="submit" class="bg-[#111] hover:bg-[#FF6B35] text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md cursor-pointer">
                Save Product Changes
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

  // Admin Logout Button
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setAdminAuthenticated(false);
      store.showToast('Logged out of Admin Portal', 'info');
      window.location.hash = '#catalogue';
      if (window.printoraApp) {
        window.printoraApp.route();
      }
    });
  }

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

  // 10-Status Lifecycle Dropdown
  const statusSelects = document.querySelectorAll('.admin-order-status-select');
  statusSelects.forEach(sel => {
    sel.addEventListener('change', (e) => {
      const orderId = e.target.getAttribute('data-order-id');
      const newStatus = e.target.value;
      store.updateOrderStatus(orderId, newStatus);
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

      store.settings = {
        ...store.settings,
        brandName,
        tagline,
        whatsappNumber,
        instagramHandle,
        brevoApiKey: brevoKey,
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

      if (supabaseUrl && supabaseKey) {
        updateSupabaseCredentials(supabaseUrl, supabaseKey);
      } else {
        store.showToast("Store settings, credentials & Brevo configuration saved!", "success");
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

  // Open Edit Product Modal on button click
  document.querySelectorAll('.admin-edit-prod-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-prod-id');
      const prod = store.products.find(p => p.id === prodId);
      if (!prod) return;

      if (editIdInput) editIdInput.value = prod.id;
      if (editNameInput) editNameInput.value = prod.name;
      if (editPriceInput) editPriceInput.value = prod.price !== null ? prod.price : '';
      if (editOrigPriceInput) editOrigPriceInput.value = prod.originalPrice !== null ? prod.originalPrice : '';
      
      const primaryImg = prod.images?.[0] || '';
      if (editImgInput) editImgInput.value = primaryImg;
      if (editImgPreview) editImgPreview.src = primaryImg;

      const extraImgs = prod.images && prod.images.length > 1 ? prod.images.slice(1).join(', ') : '';
      if (editExtraImgsInput) editExtraImgsInput.value = extraImgs;

      if (editAvailableInput) editAvailableInput.checked = prod.isAvailable !== false;

      const titleEl = document.getElementById('edit-prod-modal-title');
      if (titleEl) titleEl.textContent = `Edit Product: ${prod.name}`;

      if (editModal) editModal.classList.remove('hidden');
    });
  });

  // Handle Edit Product Form Submission
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = editIdInput?.value;
      if (!id) return;

      const name = editNameInput?.value.trim();
      const priceVal = editPriceInput?.value.trim();
      const origPriceVal = editOrigPriceInput?.value.trim();
      const primaryImg = editImgInput?.value.trim();
      const extraImgsStr = editExtraImgsInput?.value.trim();
      const isAvailable = editAvailableInput?.checked !== false;

      const price = priceVal !== '' ? Number(priceVal) : null;
      const originalPrice = origPriceVal !== '' ? Number(origPriceVal) : null;

      let images = [primaryImg];
      if (extraImgsStr) {
        const extras = extraImgsStr.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
        images = [...images, ...extras];
      }

      store.updateProduct(id, {
        name,
        price,
        originalPrice,
        images,
        isAvailable,
        isQuoteOnly: price === null
      });

      store.showToast(`Product "${name}" updated successfully!`, 'success');
      closeEditModal();
      window._adminActiveTab = 'products';
      if (window.printoraApp) {
        window.printoraApp.renderAdminOnly();
      }
    });
  }

  // Handle Delete Product Button
  document.querySelectorAll('.admin-delete-prod-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-prod-id');
      const prod = store.products.find(p => p.id === prodId);
      if (!prod) return;

      if (confirm(`Are you sure you want to delete / hide "${prod.name}" from active catalogue?`)) {
        store.updateProduct(prodId, { isAvailable: false });
        store.showToast(`Product "${prod.name}" marked as hidden`, 'info');
        window._adminActiveTab = 'products';
        if (window.printoraApp) {
          window.printoraApp.renderAdminOnly();
        }
      }
    });
  });
}

