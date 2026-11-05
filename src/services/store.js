// PRINTORA Central Store & Reactive State Management
// Brand: PRINTORA ("YOU IMAGINE. WE PRINT.")
// Official Domain: https://printoracustom.in
// WhatsApp: +91 8106992102
// Delivery: STRICT ₹0 FREE DELIVERY ACROSS INDIA

import { CATEGORIES, INITIAL_PRODUCTS } from '../data/products.js';
import { supabase, isSupabaseConfigured } from './supabase.js';
import { formatWhatsAppOrderMessage, generateWhatsAppUrl, sendWhatsAppCloudApiNotification, generateBulkWhatsAppUrl } from './whatsapp.js';

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
const safeGetItem = (k) => isBrowser ? localStorage.getItem(k) : null;
const safeSetItem = (k, v) => isBrowser ? localStorage.setItem(k, v) : null;
const safeRemoveItem = (k) => isBrowser ? localStorage.removeItem(k) : null;

class PrintoraStore {
  constructor() {
    this.listeners = new Set();
    this.products = this.loadInitialProducts();
    this.categories = CATEGORIES;
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.savedDesigns = this.loadSavedDesigns();
    this.coupons = this.loadCoupons();
    this.orders = this.loadOrders();
    this.bulkEnquiries = this.loadBulkEnquiries();
    this.suppliers = this.loadSuppliers();
    this.supplierAssignments = this.loadSupplierAssignments();
    this.settings = this.loadSettings();
    this.currentUser = this.loadUser();
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'featured'; // featured, price-low, price-high, name
    this.notification = null;
    
    // Sync with Supabase in background if configured
    this.syncFromSupabase();
  }

  // Reactive Subscription
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  showToast(message, type = 'info') {
    this.notification = { message, type, id: Date.now() };
    this.notify();
    setTimeout(() => {
      if (this.notification?.id) {
        this.notification = null;
        this.notify();
      }
    }, 4000);
  }

  // Persistence helpers
  loadInitialProducts() {
    const saved = safeGetItem('printora_custom_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [...INITIAL_PRODUCTS];
  }

  saveProducts() {
    safeSetItem('printora_custom_products', JSON.stringify(this.products));
    this.notify();
  }

  loadCart() {
    const saved = safeGetItem('printora_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    safeSetItem('printora_cart', JSON.stringify(this.cart));
    this.notify();
  }

  loadWishlist() {
    const saved = safeGetItem('printora_wishlist');
    return saved ? JSON.parse(saved) : [];
  }

  saveWishlist() {
    safeSetItem('printora_wishlist', JSON.stringify(this.wishlist));
    this.notify();
  }

  addToWishlist(product) {
    if (!this.wishlist.some(p => p.id === product.id)) {
      this.wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || '',
        categoryName: product.categoryName,
        isQuoteOnly: product.isQuoteOnly
      });
      this.saveWishlist();
      this.showToast(`Added "${product.name}" to Wishlist`, 'success');
    }
  }

  removeFromWishlist(productId) {
    this.wishlist = this.wishlist.filter(p => p.id !== productId);
    this.saveWishlist();
    this.showToast('Removed from Wishlist', 'info');
  }

  isInWishlist(productId) {
    return this.wishlist.some(p => p.id === productId);
  }

  getWishlistCount() {
    return this.wishlist.length;
  }

  loadSavedDesigns() {
    const saved = safeGetItem('printora_saved_designs');
    return saved ? JSON.parse(saved) : [
      {
        id: "dsg-demo-1",
        title: "Neon Cyber Jersey",
        productName: "Custom Jersey",
        date: new Date().toLocaleDateString('en-IN'),
        previewData: {
          playerName: "PRINTORA",
          playerNumber: "10",
          teamName: "TITANS FC",
          jerseyColor: "#111111",
          font: "Bebas Neue",
          textColor: "#FF6B35"
        }
      }
    ];
  }

  saveCustomDesign(designData) {
    const newDesign = {
      id: `dsg-${Date.now()}`,
      title: designData.title || `Design ${this.savedDesigns.length + 1}`,
      productName: designData.productName || 'Custom Apparel',
      date: new Date().toLocaleDateString('en-IN'),
      previewData: designData
    };
    this.savedDesigns.unshift(newDesign);
    safeSetItem('printora_saved_designs', JSON.stringify(this.savedDesigns));
    this.notify();
    this.showToast('Design saved to your account', 'success');
    return newDesign;
  }

  deleteSavedDesign(designId) {
    this.savedDesigns = this.savedDesigns.filter(d => d.id !== designId);
    safeSetItem('printora_saved_designs', JSON.stringify(this.savedDesigns));
    this.notify();
    this.showToast('Design removed', 'info');
  }

  loadCoupons() {
    const defaultCoupons = [
      { code: "PRINTORA 25", alias: "PRINTORA25", discountType: "fixed", value: 25, minOrder: 0, description: "Flat ₹25 OFF on MRP" },
      { code: "PRINTORA50", alias: "PRINTORA 50", discountType: "fixed", value: 50, minOrder: 499, description: "Flat ₹50 OFF on orders above ₹499" },
      { code: "WELCOME10", discountType: "percent", value: 10, minOrder: 0, description: "10% OFF for new customers" },
      { code: "BULK20", discountType: "percent", value: 20, minOrder: 2499, description: "20% OFF on team and bulk orders above ₹2499" }
    ];

    const saved = safeGetItem('printora_coupons');
    if (!saved) return defaultCoupons;
    try {
      const list = JSON.parse(saved);
      if (!list.some(c => c.code.replace(/\s+/g, '').toUpperCase() === 'PRINTORA25')) {
        list.unshift(defaultCoupons[0]);
      }
      return list;
    } catch (e) {
      return defaultCoupons;
    }
  }

  saveCoupons() {
    safeSetItem('printora_coupons', JSON.stringify(this.coupons));
    this.notify();
  }

  validateCoupon(code, subtotal) {
    if (!code) return { valid: false, message: "Please enter a coupon code" };
    const normalizedInput = code.trim().toUpperCase().replace(/\s+/g, '');
    const coupon = this.coupons.find(c => {
      const normCode = c.code.toUpperCase().replace(/\s+/g, '');
      const normAlias = c.alias ? c.alias.toUpperCase().replace(/\s+/g, '') : '';
      return normCode === normalizedInput || normAlias === normalizedInput;
    });

    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" };
    }
    if (subtotal < coupon.minOrder) {
      return { valid: false, message: `Minimum order of ₹${coupon.minOrder} required for ${coupon.code}` };
    }
    const discount = coupon.discountType === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
    return {
      valid: true,
      code: coupon.code,
      discount: Math.min(discount, subtotal),
      message: `🎉 Coupon "${coupon.code}" applied! Saved ₹${Math.min(discount, subtotal)} on MRP.`
    };
  }

  loadOrders() {
    const saved = safeGetItem('printora_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: "demo-ord-01",
        orderCode: "PRN-20261103-9182",
        customerName: "Rahul Varma",
        customerPhone: "+91 9848022334",
        customerEmail: "rahul.varma@example.com",
        shippingHouse: "Plot 42, Green Avenue",
        shippingArea: "Subhash Nagar",
        shippingCity: "Nizamabad",
        shippingState: "Telangana",
        shippingPincode: "503001",
        shippingCountry: "India",
        specialInstructions: "Please pack in discrete Printora black box. Deliver before 5 PM.",
        subtotal: 998,
        discount: 0,
        shippingCharge: 0,
        totalAmount: 998,
        status: "In Production",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        items: [
          {
            id: "prn-spt-01",
            name: "Custom Jerseys",
            price: 499,
            quantity: 2,
            selectedSize: "L",
            selectedColor: "Stealth Black & Orange",
            customName: "VARMA",
            customNumber: "07",
            customNotes: "Front orange team crest"
          }
        ],
        internalNotes: "Assigned to Nizamabad Hub. Fabric printed, awaiting final quality check.",
        supplierAssignment: {
          supplierId: "s1000000-0000-0000-0000-000000000001",
          supplierName: "Printora Nizamabad Central Hub",
          privateCost: 520,
          trackingNumber: "DTDC-NZB-88392",
          courier: "DTDC Express"
        }
      }
    ];
  }

  saveOrders() {
    safeSetItem('printora_orders', JSON.stringify(this.orders));
    this.notify();
  }

  loadBulkEnquiries() {
    const saved = safeGetItem('printora_bulk_enquiries');
    return saved ? JSON.parse(saved) : [
      {
        id: "blk-01",
        fullName: "Dr. K. Srinivas Rao",
        organization: "Telangana University Sports Wing",
        phone: "+91 9440112233",
        email: "sports.tu@gmail.com",
        category: "Sportswear (Team Jerseys)",
        quantity: 120,
        details: "Annual inter-college tournament jerseys. 120 custom dry-fit sublimated jerseys with individual player names, numbers, and TU crest.",
        targetDate: "2026-11-20",
        status: "Reviewing",
        adminQuote: 54000,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];
  }

  saveBulkEnquiries() {
    safeSetItem('printora_bulk_enquiries', JSON.stringify(this.bulkEnquiries));
    this.notify();
  }

  loadSuppliers() {
    const saved = safeGetItem('printora_suppliers');
    return saved ? JSON.parse(saved) : [
      {
        id: "s1000000-0000-0000-0000-000000000001",
        name: "Printora Central Production Hub",
        contactPerson: "Production Lead",
        phone: "+91 8106992102",
        email: "production@printoracustom.in",
        city: "Nizamabad",
        specialization: "Direct-to-Film (DTF) apparel, ceramic sublimation mugs & team jerseys",
        isActive: true
      },
      {
        id: "s1000000-0000-0000-0000-000000000002",
        name: "Deccan Sublimation Works",
        contactPerson: "Ramesh K.",
        phone: "+91 9440012345",
        email: "deccan.sublimation@example.com",
        city: "Hyderabad",
        specialization: "Pro Team Sportswear, Sublimation Team Jerseys",
        isActive: true
      },
      {
        id: "s1000000-0000-0000-0000-000000000003",
        name: "Tirupur Knitwear & Textile Partner",
        contactPerson: "Suresh V.",
        phone: "+91 9842011223",
        email: "tirupur.partner@example.com",
        city: "Tirupur",
        specialization: "Bulk Oversized T-shirts, Heavyweight Hoodies & Sweatshirts",
        isActive: true
      }
    ];
  }

  saveSuppliers() {
    safeSetItem('printora_suppliers', JSON.stringify(this.suppliers));
    this.notify();
  }

  loadSupplierAssignments() {
    const saved = safeGetItem('printora_supplier_assignments');
    return saved ? JSON.parse(saved) : {};
  }

  saveSupplierAssignments() {
    safeSetItem('printora_supplier_assignments', JSON.stringify(this.supplierAssignments));
    this.notify();
  }

  loadSettings() {
    const saved = safeGetItem('printora_store_settings');
    const defaults = {
      brandName: "PRINTORA",
      tagline: "YOU IMAGINE. WE PRINT.",
      whatsappNumber: "+91 8106992102",
      instagramHandle: "@printora.gifts",
      supportEmail: "support@printoracustom.in",
      businessLocation: "India (Pan-India Free Shipping)",
      shippingFlatFee: 0,
      freeShippingThreshold: 0,
      announcementBanner: "FREE SHIPPING ACROSS INDIA • USE COUPON 'PRINTORA 25' FOR FLAT ₹25 OFF ON MRP!",
      whatsappCloudApiToken: "",
      whatsappPhoneNumberId: "",
      razorpayKeyId: safeGetItem('printora_razorpay_key_id') || "rzp_test_Tw51XlubBFx1y1",
      brevoApiKey: safeGetItem('printora_brevo_api_key') || "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"
    };
    if (!saved) return defaults;
    try {
      const parsed = JSON.parse(saved);
      return { ...defaults, ...parsed, announcementBanner: "FREE SHIPPING ACROSS INDIA • USE COUPON 'PRINTORA 25' FOR FLAT ₹25 OFF ON MRP!" };
    } catch(e) {
      return defaults;
    }
  }

  saveSettings() {
    safeSetItem('printora_store_settings', JSON.stringify(this.settings));
    this.notify();
  }

  loadUser() {
    const saved = safeGetItem('printora_user');
    return saved ? JSON.parse(saved) : null;
  }

  setUser(user) {
    this.currentUser = user;
    if (user) {
      safeSetItem('printora_user', JSON.stringify(user));
    } else {
      safeRemoveItem('printora_user');
    }
    this.notify();
  }

  // --- Background Supabase Synchronization ---
  async syncFromSupabase() {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      // 1. Fetch products
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true);

      if (!prodErr && dbProducts && dbProducts.length > 0) {
        console.log(`Loaded ${dbProducts.length} live products from Supabase.`);
      }

      // 2. Fetch Store Settings
      const { data: dbSettings } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 'primary')
        .single();

      if (dbSettings) {
        this.settings = {
          ...this.settings,
          brandName: dbSettings.brand_name || this.settings.brandName,
          tagline: dbSettings.tagline || this.settings.tagline,
          whatsappNumber: dbSettings.whatsapp_number || this.settings.whatsappNumber,
          instagramHandle: dbSettings.instagram_handle || this.settings.instagramHandle,
          shippingFlatFee: 0, // Strict rule: always 0
          freeShippingThreshold: 0,
          announcementBanner: "FREE SHIPPING ACROSS INDIA – NO DELIVERY CHARGES!"
        };
        this.saveSettings();
      }
    } catch (err) {
      console.warn("Supabase background sync skipped:", err.message);
    }
  }

  // ==========================================
  // CART OPERATIONS
  // ==========================================
  addToCart(product, options = {}) {
    if (product.isQuoteOnly) {
      this.showToast(`"${product.name}" requires a custom quote. Please submit a bulk enquiry.`, 'info');
      return false;
    }

    const {
      size = product.sizes?.[0] || 'Standard',
      color = product.colors?.[0]?.name || 'Standard',
      quantity = 1,
      customName = '',
      customNumber = '',
      customNotes = '',
      artworkFile = null,
      frontDesign = null,
      backDesign = null
    } = options;

    const cartItemId = `${product.id}-${size}-${color}-${customName}-${customNumber}-${Date.now()}`;
    
    this.cart.push({
      cartItemId,
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0] || '',
      category: product.categoryName,
      selectedSize: size,
      selectedColor: color,
      quantity: quantity,
      customName: customName.trim(),
      customNumber: customNumber.trim(),
      customNotes: customNotes.trim(),
      artworkFile: artworkFile ? (artworkFile.name || artworkFile) : null,
      frontDesign,
      backDesign
    });

    this.saveCart();
    this.showToast(`Added ${product.name} to bag`, 'success');
    return true;
  }

  updateCartQuantity(cartItemId, delta) {
    const item = this.cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(cartItemId);
    } else {
      this.saveCart();
    }
  }

  removeFromCart(cartItemId) {
    this.cart = this.cart.filter(i => i.cartItemId !== cartItemId);
    this.saveCart();
    this.showToast('Item removed from bag', 'info');
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // STRICT BUSINESS RULE: FREE SHIPPING ON ALL ORDERS – NO DELIVERY CHARGES
  getShippingCharge() {
    return 0;
  }

  getCartTotal(discount = 0) {
    return Math.max(0, this.getCartSubtotal() - discount);
  }

  // ==========================================
  // CHECKOUT & ORDER SUBMISSION
  // ==========================================
  generateOrderCode() {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PRN-${dateStr}-${rand}`;
  }

  async submitOrder(customerData) {
    if (this.cart.length === 0) {
      throw new Error("Your cart is empty.");
    }

    const subtotal = this.getCartSubtotal();
    const shippingCharge = 0; // Strict requirement: ₹0 always
    const discount = customerData.discount || 0;
    const totalAmount = this.getCartTotal(discount);
    const orderCode = this.generateOrderCode();

    const orderRecord = {
      id: `ord-${Date.now()}`,
      orderCode,
      customerName: customerData.name.trim(),
      customerPhone: customerData.phone.trim(),
      customerEmail: customerData.email?.trim() || '',
      shippingHouse: customerData.house.trim(),
      shippingArea: customerData.area.trim(),
      shippingCity: customerData.city.trim(),
      shippingDistrict: customerData.district?.trim() || customerData.city.trim(),
      shippingState: customerData.state.trim(),
      shippingPincode: customerData.pincode.trim(),
      shippingCountry: 'India',
      specialInstructions: customerData.specialInstructions?.trim() || '',
      paymentMethod: customerData.paymentMethod || 'Online (Razorpay / UPI)',
      paymentStatus: customerData.paymentStatus || 'Payment Confirmed',
      items: [...this.cart],
      subtotal,
      discount,
      shippingCharge: 0,
      totalAmount,
      status: 'Order Placed',
      createdAt: new Date().toISOString()
    };

    // 1. Save locally so order is never lost
    this.orders.unshift(orderRecord);
    this.saveOrders();

    // 2. Insert into Supabase if connected
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: dbOrder, error: ordErr } = await supabase
          .from('orders')
          .insert([{
            order_code: orderCode,
            customer_name: orderRecord.customerName,
            customer_phone: orderRecord.customerPhone,
            customer_email: orderRecord.customerEmail,
            shipping_house: orderRecord.shippingHouse,
            shipping_area: orderRecord.shippingArea,
            shipping_city: orderRecord.shippingCity,
            shipping_state: orderRecord.shippingState,
            shipping_pincode: orderRecord.shippingPincode,
            special_instructions: orderRecord.specialInstructions,
            subtotal,
            discount,
            shipping_charge: 0,
            total_amount: totalAmount,
            status: 'Order Placed'
          }])
          .select()
          .single();

        if (!ordErr && dbOrder) {
          const dbItems = this.cart.map(item => ({
            order_id: dbOrder.id,
            product_name: item.name,
            size: item.selectedSize,
            color: item.selectedColor,
            quantity: item.quantity,
            unit_price: item.price,
            custom_name: item.customName || null,
            custom_number: item.customNumber || null,
            custom_notes: item.customNotes || null
          }));
          await supabase.from('order_items').insert(dbItems);
          console.log('Order successfully saved to Supabase:', dbOrder.id);
        }
      } catch (err) {
        console.warn('Supabase order insert warning (saved locally):', err.message);
      }
    }

    // 3. Trigger WhatsApp Cloud API if configured
    sendWhatsAppCloudApiNotification(orderRecord, this.settings);

    // 4. Clear the cart
    this.clearCart();

    return orderRecord;
  }

  // ==========================================
  // BULK ORDER ENQUIRIES
  // ==========================================
  async submitBulkEnquiry(data) {
    const enquiry = {
      id: `blk-${Date.now()}`,
      fullName: data.fullName.trim(),
      organization: data.organization.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      category: data.category,
      quantity: Number(data.quantity) || 50,
      details: data.details.trim(),
      targetDate: data.targetDate || '',
      status: 'New',
      createdAt: new Date().toISOString()
    };

    this.bulkEnquiries.unshift(enquiry);
    this.saveBulkEnquiries();

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('bulk_enquiries').insert([{
          full_name: enquiry.fullName,
          organization: enquiry.organization,
          phone: enquiry.phone,
          email: enquiry.email,
          product_category: enquiry.category,
          quantity: enquiry.quantity,
          customization_details: enquiry.details,
          target_delivery_date: enquiry.targetDate || null,
          status: 'New'
        }]);
      } catch (err) {
        console.warn("Supabase bulk insert warning:", err.message);
      }
    }

    return enquiry;
  }

  // ==========================================
  // ORDER STATUS UPDATE (10 Formal Statuses)
  // ==========================================
  updateOrderStatus(orderId, newStatus, internalNotes = '') {
    const order = this.orders.find(o => o.id === orderId || o.orderCode === orderId);
    if (order) {
      order.status = newStatus;
      if (internalNotes) order.internalNotes = internalNotes;
      order.updatedAt = new Date().toISOString();
      this.saveOrders();
      this.showToast(`Order ${order.orderCode} updated to "${newStatus}"`, 'success');
    }
  }

  assignSupplierToOrder(orderId, assignmentData) {
    const order = this.orders.find(o => o.id === orderId || o.orderCode === orderId);
    if (!order) return;

    order.supplierAssignment = {
      supplierId: assignmentData.supplierId,
      supplierName: assignmentData.supplierName,
      privateCost: Number(assignmentData.privateCost) || 0,
      trackingNumber: assignmentData.trackingNumber || '',
      courier: assignmentData.courier || '',
      notes: assignmentData.notes || '',
      assignedAt: new Date().toISOString()
    };

    this.saveOrders();
    this.showToast(`Order assigned to ${assignmentData.supplierName}`, 'success');
  }

  saveProduct(productData) {
    const existingIndex = this.products.findIndex(p => p.id === productData.id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = { ...this.products[existingIndex], ...productData };
      this.showToast(`Product "${productData.name}" updated`, 'success');
    } else {
      const newProduct = {
        ...productData,
        id: `prn-custom-${Date.now()}`,
        slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        isAvailable: true
      };
      this.products.unshift(newProduct);
      this.showToast(`Product "${productData.name}" created`, 'success');
    }
    this.saveProducts();
  }

  deleteProduct(productId) {
    this.products = this.products.filter(p => p.id !== productId);
    this.saveProducts();
    this.showToast("Product deleted", 'info');
  }

  // Filtered and sorted products
  getFilteredProducts() {
    return this.products.filter(prod => {
      const matchesCategory = this.activeCategory === 'all' || prod.categoryId === this.activeCategory;
      const q = this.searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.subtitle?.toLowerCase().includes(q) ||
        prod.description?.toLowerCase().includes(q) ||
        prod.categoryName?.toLowerCase().includes(q);
      
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (this.sortBy === 'price-low') {
        const pa = a.price ?? 999999;
        const pb = b.price ?? 999999;
        return pa - pb;
      }
      if (this.sortBy === 'price-high') {
        const pa = a.price ?? -1;
        const pb = b.price ?? -1;
        return pb - pa;
      }
      if (this.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }
}

export const store = new PrintoraStore();
export default store;
