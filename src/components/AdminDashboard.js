// PRINTORA Master Admin Dashboard
// Dedicated Route: #admin
// Implements Requirements 9 & 10: Overview, Product CRUD, Order Status Workflow, Supplier Fulfillment, Bulk Enquiries, Store Settings

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';
import { isSupabaseConfigured, updateSupabaseCredentials } from '../services/supabase.js';

export function renderAdminDashboard() {
  const orders = store.orders;
  const products = store.products;
  const bulkEnquiries = store.bulkEnquiries;
  const suppliers = store.suppliers;
  const settings = store.settings;

  // Overview Metrics Calculations (Genuine Data)
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped' || o.status === 'Ready for Dispatch').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return `
    <div id="admin-view" class="min-h-screen bg-[#F4F1EA] text-[#111111] pb-24">
      
      <!-- Admin Top Bar -->
      <header class="bg-[#0A0A0A] text-white border-b border-[#222] sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a href="#catalogue" class="text-xs uppercase tracking-widest text-[#C5A880] hover:underline flex items-center gap-1">
              <span>← Back to Store</span>
            </a>
            <span class="text-[#333]">|</span>
            <span class="font-serif text-lg font-bold tracking-wider brand-title">PRINTORA ADMIN</span>
            <span class="text-[10px] bg-[#C5A880]/20 text-[#C5A880] px-2 py-0.5 rounded font-mono">PORTAL</span>
          </div>

          <div class="flex items-center gap-4 text-xs">
            <span class="hidden sm:inline-flex items-center gap-1.5 ${isSupabaseConfigured() ? 'text-emerald-400' : 'text-amber-400'}">
              <span class="w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
              <span>${isSupabaseConfigured() ? 'Supabase Live' : 'Local Storage Mode'}</span>
            </span>
            <button id="admin-quick-add-prod-btn" class="bg-[#C5A880] hover:bg-[#B5966B] text-black font-semibold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1">
              ${renderIcon('plus', 'w-3.5 h-3.5')}
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <!-- Admin Navigation Tabs -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 overflow-x-auto text-xs font-semibold uppercase tracking-wider text-[#888] border-t border-[#1C1C1C]">
          <button class="admin-tab-btn py-3 border-b-2 border-[#C5A880] text-white whitespace-nowrap" data-tab="overview">
            Overview
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="orders">
            Orders (${totalOrders})
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="fulfillment">
            Supplier Fulfillment
          </button>
          <button class="admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap" data-tab="products">
            Products (${products.length})
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
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div class="bg-white border border-[#DDD4C4] rounded-xl p-4 shadow-soft">
              <span class="text-[11px] uppercase tracking-wider text-[#787673] font-semibold block">Total Revenue</span>
              <span class="text-xl md:text-2xl font-bold text-black font-mono mt-1 block">₹${totalRevenue}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-xl p-4 shadow-soft">
              <span class="text-[11px] uppercase tracking-wider text-[#787673] font-semibold block">Total Orders</span>
              <span class="text-xl md:text-2xl font-bold text-black font-mono mt-1 block">${totalOrders}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-xl p-4 shadow-soft">
              <span class="text-[11px] uppercase tracking-wider text-amber-600 font-semibold block">Pending</span>
              <span class="text-xl md:text-2xl font-bold text-amber-700 font-mono mt-1 block">${pendingOrders}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-xl p-4 shadow-soft">
              <span class="text-[11px] uppercase tracking-wider text-blue-600 font-semibold block">Confirmed</span>
              <span class="text-xl md:text-2xl font-bold text-blue-700 font-mono mt-1 block">${confirmedOrders}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-xl p-4 shadow-soft">
              <span class="text-[11px] uppercase tracking-wider text-purple-600 font-semibold block">In Production</span>
              <span class="text-xl md:text-2xl font-bold text-purple-700 font-mono mt-1 block">${processingOrders}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-xl p-4 shadow-soft">
              <span class="text-[11px] uppercase tracking-wider text-cyan-600 font-semibold block">Dispatched</span>
              <span class="text-xl md:text-2xl font-bold text-cyan-700 font-mono mt-1 block">${shippedOrders}</span>
            </div>
            <div class="bg-white border border-[#DDD4C4] rounded-xl p-4 shadow-soft">
              <span class="text-[11px] uppercase tracking-wider text-emerald-600 font-semibold block">Delivered</span>
              <span class="text-xl md:text-2xl font-bold text-emerald-700 font-mono mt-1 block">${deliveredOrders}</span>
            </div>
          </div>

          <!-- Recent Orders Feed -->
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-soft">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-serif text-xl font-medium text-black">Live Recent Orders</h3>
              <button onclick="document.querySelector('[data-tab=orders]').click();" class="text-xs text-[#997A52] font-semibold hover:underline">
                View All Orders →
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF7F2] text-[#666] uppercase tracking-wider font-semibold border-b border-[#DDD4C4]">
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
                  ${orders.slice(0, 5).map(o => `
                    <tr class="hover:bg-[#FAF9F5] transition-colors">
                      <td class="py-3 px-4 font-mono font-bold text-black">${o.orderCode}</td>
                      <td class="py-3 px-4">
                        <div class="font-semibold text-black">${o.customerName}</div>
                        <div class="text-[11px] text-[#777] font-mono">${o.customerPhone}</div>
                      </td>
                      <td class="py-3 px-4 text-[#555]">${o.shippingCity}, ${o.shippingState}</td>
                      <td class="py-3 px-4">
                        ${o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td class="py-3 px-4 font-mono font-bold text-black">₹${o.totalAmount}</td>
                      <td class="py-3 px-4">
                        <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadgeClass(o.status)}">
                          ${o.status}
                        </span>
                      </td>
                      <td class="py-3 px-4">
                        <button class="admin-view-order-btn text-[#997A52] hover:text-black font-semibold" data-order-id="${o.orderCode}">
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
             TAB 2: ORDER MANAGEMENT
             ========================================== -->
        <div id="admin-tab-orders" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-soft">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 class="font-serif text-2xl font-medium text-black">Order Management</h3>
                <p class="text-xs text-[#787673]">Review customization instructions, update production lifecycle, and print packing invoices.</p>
              </div>

              <!-- Search & Filter Controls -->
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <input type="text" id="admin-order-search" placeholder="Search order ID or phone..." 
                       class="bg-[#FAFAF7] border border-[#DDD4C4] rounded-lg px-3 py-2 text-xs outline-none w-full sm:w-60">
              </div>
            </div>

            <!-- Full Orders List -->
            <div class="space-y-4" id="admin-orders-list-container">
              ${orders.map(o => `
                <div class="border border-[#DDD4C4] rounded-xl p-5 bg-[#FAF9F6] space-y-4 hover:border-black transition-colors" data-order-card="${o.orderCode}">
                  <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-[#E5E0D5] pb-3">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-mono font-bold text-sm text-black">${o.orderCode}</span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadgeClass(o.status)}">${o.status}</span>
                      </div>
                      <span class="text-[11px] text-[#777]">Placed on ${new Date(o.createdAt).toLocaleString()}</span>
                    </div>

                    <div class="flex items-center gap-3">
                      <!-- Status update dropdown -->
                      <select class="admin-order-status-select bg-white border border-[#DDD4C4] rounded-md px-2.5 py-1 text-xs font-semibold outline-none" data-order-id="${o.orderCode}">
                        ${['Pending', 'Confirmed', 'Processing', 'Ready for Dispatch', 'Shipped', 'Delivered', 'Cancelled'].map(st => `
                          <option value="${st}" ${st === o.status ? 'selected' : ''}>${st}</option>
                        `).join('')}
                      </select>

                      <button class="admin-assign-dealer-btn bg-[#111] hover:bg-[#C5A880] text-white hover:text-black px-3 py-1 text-xs rounded font-semibold transition-colors" data-order-id="${o.orderCode}">
                        Assign Dealer
                      </button>
                    </div>
                  </div>

                  <!-- Customer & Shipping details -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span class="text-[#787673] font-semibold uppercase tracking-wider text-[10px] block">Customer</span>
                      <strong class="text-black text-sm block mt-0.5">${o.customerName}</strong>
                      <span class="font-mono text-[#555] block">${o.customerPhone}</span>
                      ${o.customerEmail ? `<span class="text-[#666] block">${o.customerEmail}</span>` : ''}
                    </div>

                    <div>
                      <span class="text-[#787673] font-semibold uppercase tracking-wider text-[10px] block">Delivery Destination</span>
                      <span class="text-[#444] block mt-0.5">${o.shippingHouse}, ${o.shippingArea}</span>
                      <strong class="text-black block">${o.shippingCity}, ${o.shippingState} - ${o.shippingPincode}</strong>
                    </div>

                    <div class="bg-white p-3 rounded-lg border border-[#DDD4C4]">
                      <span class="text-[#787673] font-semibold uppercase tracking-wider text-[10px] block">Billing Breakdown</span>
                      <div class="mt-1 space-y-0.5">
                        <div class="flex justify-between"><span>Subtotal:</span><span class="font-mono">₹${o.subtotal}</span></div>
                        <div class="flex justify-between"><span>Shipping:</span><span class="font-mono">₹${o.shippingCharge}</span></div>
                        <div class="flex justify-between font-bold text-black border-t border-[#EEE] pt-1"><span>Total Amount:</span><span class="font-mono">₹${o.totalAmount}</span></div>
                      </div>
                    </div>
                  </div>

                  <!-- Customized Items Detail -->
                  <div class="bg-white p-3.5 rounded-lg border border-[#DDD4C4] space-y-2">
                    <span class="text-[#787673] font-semibold uppercase tracking-wider text-[10px] block">Customized Products</span>
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
                            ${it.customNotes ? `<div class="text-[11px] text-[#787673] italic">Notes: "${it.customNotes}"</div>` : ''}
                          </div>
                          <span class="font-mono font-bold text-black">₹${it.price * it.quantity}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Internal Admin Notes & Assigned Supplier if present -->
                  ${o.supplierAssignment ? `
                    <div class="bg-[#F0EAE1] p-3 rounded-lg border border-[#DDD4C4] text-xs flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span class="text-[10px] font-bold text-[#997A52] uppercase tracking-wider">Assigned Dealer / Supplier:</span>
                        <strong class="text-black ml-1">${o.supplierAssignment.supplierName}</strong>
                        ${o.supplierAssignment.trackingNumber ? ` • Tracking: <span class="font-mono font-bold">${o.supplierAssignment.trackingNumber}</span> (${o.supplierAssignment.courier})` : ''}
                      </div>
                      <span class="text-[11px] bg-white px-2 py-0.5 rounded font-mono font-semibold text-[#555]">
                        Private Supplier Cost: ₹${o.supplierAssignment.privateCost}
                      </span>
                    </div>
                  ` : ''}

                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB 3: DEALER & SUPPLIER FULFILLMENT (Requirement 10)
             ========================================== -->
        <div id="admin-tab-fulfillment" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-soft space-y-6">
            <div>
              <span class="text-xs uppercase tracking-wider text-[#997A52] font-semibold">Requirement 10 Workflow</span>
              <h3 class="font-serif text-2xl font-medium text-black">Printing & Manufacturing Dealer Network</h3>
              <p class="text-xs text-[#787673] mt-1 max-w-2xl">
                Printora works with verified printing hubs in Nizamabad, Hyderabad, and Tirupur. All dealer assignments enforce strict white-label packaging with Printora branding. Supplier costs are kept completely confidential from the client-facing website.
              </p>
            </div>

            <!-- Registered Dealers Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF7F2] text-[#666] uppercase tracking-wider font-semibold border-b border-[#DDD4C4]">
                  <tr>
                    <th class="py-3 px-4">Dealer / Hub Name</th>
                    <th class="py-3 px-4">Location</th>
                    <th class="py-3 px-4">Contact Person</th>
                    <th class="py-3 px-4">Specialization</th>
                    <th class="py-3 px-4">Assigned Orders</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#EFECE4]">
                  ${suppliers.map(s => {
                    const assignedCount = orders.filter(o => o.supplierAssignment?.supplierId === s.id).length;
                    return `
                      <tr class="hover:bg-[#FAF9F5]">
                        <td class="py-3 px-4 font-bold text-black">${s.name}</td>
                        <td class="py-3 px-4 text-[#555]">${s.city}</td>
                        <td class="py-3 px-4">${s.contactPerson} (${s.phone})</td>
                        <td class="py-3 px-4 text-[#666]">${s.specialization}</td>
                        <td class="py-3 px-4 font-mono font-bold text-black">${assignedCount}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- White-Label Packaging Standard Notice -->
            <div class="p-4 bg-[#FAF7F2] border border-[#DDD4C4] rounded-xl text-xs space-y-2">
              <h4 class="font-bold text-black">✦ Printora White-Label Fulfillment Rules for Dealers:</h4>
              <ul class="text-[#666] space-y-1 list-disc list-inside">
                <li>All apparel must be packed with the official Printora card tag: <strong>MAKE IT YOURS.</strong></li>
                <li>No supplier external branding, dealer invoices, or manufacturing addresses allowed in the packaging.</li>
                <li>Dispatches must include the client delivery slip with the unique Printora Order ID.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB 4: PRODUCT MANAGEMENT
             ========================================== -->
        <div id="admin-tab-products" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-soft">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="font-serif text-2xl font-medium text-black">Product Catalogue Manager</h3>
                <p class="text-xs text-[#787673]">Add new products, adjust selling prices, toggle availability, and upload imagery.</p>
              </div>
              <button id="admin-add-product-btn-2" class="bg-[#111] hover:bg-[#C5A880] text-white hover:text-black px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
                ${renderIcon('plus', 'w-3.5 h-3.5')}
                <span>Add New Product</span>
              </button>
            </div>

            <!-- Product Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF7F2] text-[#666] uppercase tracking-wider font-semibold border-b border-[#DDD4C4]">
                  <tr>
                    <th class="py-3 px-4">Product Name</th>
                    <th class="py-3 px-4">Category</th>
                    <th class="py-3 px-4">Selling Price</th>
                    <th class="py-3 px-4">Sizes / Colors</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#EFECE4]">
                  ${products.map(p => `
                    <tr class="hover:bg-[#FAF9F5] transition-colors">
                      <td class="py-3 px-4 font-semibold text-black">
                        <div class="flex items-center gap-2">
                          <img src="${p.images?.[0] || ''}" class="w-8 h-8 rounded object-cover border border-[#DDD4C4]">
                          <span>${p.name}</span>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-[#666]">${p.categoryName}</td>
                      <td class="py-3 px-4 font-mono font-bold text-black">
                        ${p.price ? `₹${p.price}${p.isOnwards ? ' onwards' : ''}` : '<span class="text-[#888] font-sans font-normal">REQUEST A QUOTE</span>'}
                      </td>
                      <td class="py-3 px-4 text-[#555]">${p.sizes ? p.sizes.join(', ') : 'Standard'}</td>
                      <td class="py-3 px-4">
                        <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold ${p.isAvailable !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                          ${p.isAvailable !== false ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right space-x-2">
                        <button class="admin-edit-prod-btn text-[#997A52] hover:text-black font-semibold" data-prod-id="${p.id}">
                          Edit
                        </button>
                        <button class="admin-delete-prod-btn text-rose-600 hover:text-rose-800 font-semibold" data-prod-id="${p.id}">
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
             TAB 5: BULK ENQUIRIES
             ========================================== -->
        <div id="admin-tab-bulk" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 shadow-soft space-y-4">
            <div>
              <h3 class="font-serif text-2xl font-medium text-black">Institutional & Bulk Enquiries</h3>
              <p class="text-xs text-[#787673]">Incoming requests from universities, sports teams, companies and gym franchises.</p>
            </div>

            <div class="space-y-4">
              ${bulkEnquiries.map(b => `
                <div class="border border-[#DDD4C4] rounded-xl p-5 bg-[#FAF9F6] space-y-3">
                  <div class="flex items-center justify-between border-b border-[#E5E0D5] pb-2">
                    <div>
                      <strong class="text-black text-sm">${b.organization}</strong>
                      <span class="text-xs text-[#666] ml-2">Contact: ${b.fullName} (${b.phone} • ${b.email})</span>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">${b.status}</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span class="text-[#888] block text-[10px] uppercase font-bold">Category</span>
                      <strong class="text-black">${b.category}</strong>
                    </div>
                    <div>
                      <span class="text-[#888] block text-[10px] uppercase font-bold">Quantity</span>
                      <strong class="text-black font-mono text-sm">${b.quantity} Units</strong>
                    </div>
                    <div>
                      <span class="text-[#888] block text-[10px] uppercase font-bold">Target Date</span>
                      <strong class="text-black">${b.targetDate || 'Flexible'}</strong>
                    </div>
                  </div>

                  <div class="bg-white p-3 rounded-lg border border-[#DDD4C4] text-xs">
                    <span class="text-[#888] block text-[10px] uppercase font-bold mb-1">Specifications</span>
                    <p class="text-[#444]">${b.details}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB 6: STORE SETTINGS & CLOUD INTEGRATION
             ========================================== -->
        <div id="admin-tab-settings" class="admin-tab-content hidden space-y-6">
          <div class="bg-white border border-[#DDD4C4] rounded-2xl p-6 md:p-8 shadow-soft space-y-6">
            <div>
              <h3 class="font-serif text-2xl font-medium text-black">Store Configuration & Cloud Integrations</h3>
              <p class="text-xs text-[#787673]">Manage your business phone, WhatsApp notification channels, and Supabase cloud database credentials.</p>
            </div>

            <form id="admin-store-settings-form" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-[#333] mb-1">Brand Name</label>
                  <input type="text" id="set-brand-name" value="${settings.brandName}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-lg p-2.5 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-[#333] mb-1">Brand Tagline</label>
                  <input type="text" id="set-tagline" value="${settings.tagline}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-lg p-2.5 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-[#333] mb-1">Business WhatsApp Number</label>
                  <input type="text" id="set-whatsapp" value="${settings.whatsappNumber}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-lg p-2.5 text-xs font-mono">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-[#333] mb-1">Instagram Handle</label>
                  <input type="text" id="set-instagram" value="${settings.instagramHandle}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-lg p-2.5 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-[#333] mb-1">Free Shipping Threshold (₹)</label>
                  <input type="number" id="set-free-threshold" value="${settings.freeShippingThreshold}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-lg p-2.5 text-xs font-mono">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-[#333] mb-1">Standard Flat Shipping Fee (₹)</label>
                  <input type="number" id="set-flat-fee" value="${settings.shippingFlatFee}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-lg p-2.5 text-xs font-mono">
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#333] mb-1">Homepage Announcement Banner</label>
                <input type="text" id="set-announcement" value="${settings.announcementBanner}" class="w-full bg-[#FAFAF7] border border-[#DDD4C4] rounded-lg p-2.5 text-xs">
              </div>

              <!-- Supabase Integration Section -->
              <div class="p-4 bg-[#FAF7F2] border border-[#DDD4C4] rounded-xl space-y-3">
                <span class="text-xs uppercase tracking-wider text-[#997A52] font-bold block">Supabase Cloud Database Sync</span>
                <p class="text-xs text-[#666]">Connect your live Supabase database URL and Anon public key to sync orders and products to the cloud.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" id="set-supabase-url" placeholder="https://xyzcompany.supabase.co" class="bg-white border border-[#DDD4C4] rounded-lg p-2 text-xs">
                  <input type="password" id="set-supabase-key" placeholder="Supabase Anon Key..." class="bg-white border border-[#DDD4C4] rounded-lg p-2 text-xs">
                </div>
              </div>

              <!-- Razorpay Payment Gateway Integration -->
              <div class="p-4 bg-[#FAF7F2] border border-[#DDD4C4] rounded-xl space-y-3">
                <span class="text-xs uppercase tracking-wider text-[#997A52] font-bold block">Razorpay Payment Gateway (UPI / Cards / NetBanking)</span>
                <p class="text-xs text-[#666]">Enter your Razorpay Key ID (starts with rzp_live_ or rzp_test_). Safe for client-side checkout.</p>
                <div>
                  <input type="text" id="set-razorpay-key" placeholder="rzp_live_xxxxxxxxxxxx or rzp_test_xxxxxxxxxxxx" value="${settings.razorpayKeyId || ''}" class="w-full bg-white border border-[#DDD4C4] rounded-lg p-2 text-xs font-mono">
                </div>
              </div>

              <!-- Meta WhatsApp Cloud API Section (Method 2) -->
              <div class="p-4 bg-[#FAF7F2] border border-[#DDD4C4] rounded-xl space-y-3">
                <span class="text-xs uppercase tracking-wider text-[#997A52] font-bold block">Meta WhatsApp Cloud API (Method 2 - Optional)</span>
                <p class="text-xs text-[#666]">If you have an official Meta Developer account for business API notifications, provide your credentials below.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="password" id="set-wa-token" placeholder="Meta Graph API Token" class="bg-white border border-[#DDD4C4] rounded-lg p-2 text-xs">
                  <input type="text" id="set-wa-phone-id" placeholder="Phone Number ID" class="bg-white border border-[#DDD4C4] rounded-lg p-2 text-xs">
                </div>
              </div>

              <button type="submit" class="bg-[#111] hover:bg-[#C5A880] text-white hover:text-black px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all">
                Save Store Settings
              </button>
            </form>
          </div>
        </div>

      </main>

      <!-- Assign Dealer Modal -->
      <div id="assign-dealer-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div class="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#DDD4C4] space-y-4">
          <div class="flex items-center justify-between border-b border-[#EEE] pb-3">
            <h4 class="font-serif text-lg font-bold text-black">Assign Fulfillment Dealer</h4>
            <button id="close-dealer-modal-btn" class="text-[#888] hover:text-black">✕</button>
          </div>
          
          <form id="dealer-assign-form" class="space-y-3 text-xs">
            <input type="hidden" id="assign-order-id">
            <div>
              <label class="block font-semibold mb-1">Select Supplier / Hub *</label>
              <select id="assign-supplier-id" required class="w-full border border-[#DDD4C4] rounded-lg p-2">
                ${suppliers.map(s => `<option value="${s.id}">${s.name} (${s.city})</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1">Private Supplier Cost (₹) *</label>
              <input type="number" id="assign-private-cost" required placeholder="e.g. 350" class="w-full border border-[#DDD4C4] rounded-lg p-2 font-mono">
              <span class="text-[10px] text-[#888]">Kept 100% confidential from client</span>
            </div>
            <div>
              <label class="block font-semibold mb-1">Courier Partner</label>
              <input type="text" id="assign-courier" placeholder="e.g. DTDC / Delhivery / Bluedart" class="w-full border border-[#DDD4C4] rounded-lg p-2">
            </div>
            <div>
              <label class="block font-semibold mb-1">Tracking Number</label>
              <input type="text" id="assign-tracking" placeholder="e.g. DTDC-NZB-9981" class="w-full border border-[#DDD4C4] rounded-lg p-2 font-mono">
            </div>
            <button type="submit" class="w-full bg-[#111] hover:bg-[#C5A880] text-white hover:text-black py-2.5 rounded-lg font-bold uppercase transition-colors">
              Confirm Assignment
            </button>
          </form>
        </div>
      </div>

    </div>
  `;
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Pending': return 'bg-amber-100 text-amber-800 border border-amber-300';
    case 'Confirmed': return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'Processing': return 'bg-purple-100 text-purple-800 border border-purple-300';
    case 'Ready for Dispatch': return 'bg-indigo-100 text-indigo-800 border border-indigo-300';
    case 'Shipped': return 'bg-cyan-100 text-cyan-800 border border-cyan-300';
    case 'Delivered': return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    case 'Cancelled': return 'bg-rose-100 text-rose-800 border border-rose-300';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function initAdminEvents() {
  // Tab Switching
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => {
        b.className = 'admin-tab-btn py-3 border-b-2 border-transparent hover:text-white whitespace-nowrap';
      });
      btn.className = 'admin-tab-btn py-3 border-b-2 border-[#C5A880] text-white whitespace-nowrap';

      tabContents.forEach(c => {
        if (c.id === `admin-tab-${target}`) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });

  // Order Status dropdown updates
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
      const supplierId = document.getElementById('assign-supplier-id')?.value;
      const privateCost = document.getElementById('assign-private-cost')?.value;
      const courier = document.getElementById('assign-courier')?.value;
      const tracking = document.getElementById('assign-tracking')?.value;

      const supplierObj = store.suppliers.find(s => s.id === supplierId);
      store.assignSupplierToOrder(orderId, {
        supplierId,
        supplierName: supplierObj ? supplierObj.name : 'Unknown Hub',
        privateCost,
        courier,
        trackingNumber: tracking
      });

      if (assignModal) assignModal.classList.add('hidden');
    });
  }

  // Store Settings Form Save
  const settingsForm = document.getElementById('admin-store-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const brandName = document.getElementById('set-brand-name')?.value;
      const tagline = document.getElementById('set-tagline')?.value;
      const whatsappNumber = document.getElementById('set-whatsapp')?.value;
      const instagramHandle = document.getElementById('set-instagram')?.value;
      const freeShippingThreshold = Number(document.getElementById('set-free-threshold')?.value) || 999;
      const shippingFlatFee = Number(document.getElementById('set-flat-fee')?.value) || 60;
      const announcementBanner = document.getElementById('set-announcement')?.value;
      const razorpayKeyId = document.getElementById('set-razorpay-key')?.value?.trim() || "";
      const supabaseUrl = document.getElementById('set-supabase-url')?.value;
      const supabaseKey = document.getElementById('set-supabase-key')?.value;

      store.settings = {
        ...store.settings,
        brandName,
        tagline,
        whatsappNumber,
        instagramHandle,
        freeShippingThreshold,
        shippingFlatFee,
        announcementBanner,
        razorpayKeyId
      };
      if (razorpayKeyId) {
        localStorage.setItem('printora_razorpay_key_id', razorpayKeyId);
      } else {
        localStorage.removeItem('printora_razorpay_key_id');
      }
      store.saveSettings();

      if (supabaseUrl && supabaseKey) {
        updateSupabaseCredentials(supabaseUrl, supabaseKey);
      } else {
        alert("Store settings saved successfully!");
      }
    });
  }
}
