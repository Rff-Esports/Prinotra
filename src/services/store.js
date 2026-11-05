// PRINTORA Central Store & Reactive State Management
import { CATEGORIES, INITIAL_PRODUCTS } from '../data/products.js';
import { supabase, isSupabaseConfigured } from './supabase.js';
import { formatWhatsAppOrderMessage, generateWhatsAppUrl, sendWhatsAppCloudApiNotification, generateBulkWhatsAppUrl } from './whatsapp.js';

class PrintoraStore {
  constructor() {
    this.listeners = new Set();
    this.products = this.loadInitialProducts();
    this.categories = CATEGORIES;
    this.cart = this.loadCart();
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
    const saved = localStorage.getItem('printora_custom_products');
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
    localStorage.setItem('printora_custom_products', JSON.stringify(this.products));
    this.notify();
  }

  loadCart() {
    const saved = localStorage.getItem('printora_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('printora_cart', JSON.stringify(this.cart));
    this.notify();
  }

  loadOrders() {
    const saved = localStorage.getItem('printora_orders');
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
        status: "Processing",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        items: [
          {
            id: "prn-spt-01",
            name: "Custom Jerseys",
            price: 499,
            quantity: 2,
            selectedSize: "L",
            selectedColor: "Stealth Black & Gold",
            customName: "VARMA",
            customNumber: "07",
            customNotes: "Front gold team crest"
          }
        ],
        internalNotes: "Assigned to Nizamabad Hub. Fabric printed, awaiting stitching.",
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
    localStorage.setItem('printora_orders', JSON.stringify(this.orders));
    this.notify();
  }

  loadBulkEnquiries() {
    const saved = localStorage.getItem('printora_bulk_enquiries');
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
    localStorage.setItem('printora_bulk_enquiries', JSON.stringify(this.bulkEnquiries));
    this.notify();
  }

  loadSuppliers() {
    const saved = localStorage.getItem('printora_suppliers');
    return saved ? JSON.parse(saved) : [
      {
        id: "s1000000-0000-0000-0000-000000000001",
        name: "Printora Nizamabad Central Hub",
        contactPerson: "Production Lead",
        phone: "+91 8106992102",
        email: "production@printoracustom.in",
        city: "Nizamabad",
        specialization: "Local fast-turnaround DTF apparel & ceramic mugs",
        isActive: true
      },
      {
        id: "s1000000-0000-0000-0000-000000000002",
        name: "Deccan Sublimation Works",
        contactPerson: "Ramesh K.",
        phone: "+91 9440012345",
        email: "deccan.sublimation@example.com",
        city: "Hyderabad",
        specialization: "Custom Sportswear, Sublimation Team Jerseys",
        isActive: true
      },
      {
        id: "s1000000-0000-0000-0000-000000000003",
        name: "Tirupur Knitwear & Textile Partner",
        contactPerson: "Suresh V.",
        phone: "+91 9842011223",
        email: "tirupur.partner@example.com",
        city: "Tirupur",
        specialization: "Bulk Oversized T-shirts, Hoodies & Sweatshirts",
        isActive: true
      }
    ];
  }

  saveSuppliers() {
    localStorage.setItem('printora_suppliers', JSON.stringify(this.suppliers));
    this.notify();
  }

  loadSupplierAssignments() {
    const saved = localStorage.getItem('printora_supplier_assignments');
    return saved ? JSON.parse(saved) : {};
  }

  saveSupplierAssignments() {
    localStorage.setItem('printora_supplier_assignments', JSON.stringify(this.supplierAssignments));
    this.notify();
  }

  loadSettings() {
    const saved = localStorage.getItem('printora_store_settings');
    return saved ? JSON.parse(saved) : {
      brandName: "PRINTORA",
      tagline: "MAKE IT YOURS.",
      whatsappNumber: "+91 8106992102",
      instagramHandle: "@printoracustom.in",
      supportEmail: "support@printoracustom.in",
      businessLocation: "Nizamabad, Telangana, India",
      shippingFlatFee: 60,
      freeShippingThreshold: 999,
      announcementBanner: "✦ Custom Apparel & Merch for Individuals & Teams • Free Pan-India Delivery on orders over ₹999 ✦",
      whatsappCloudApiToken: "",
      whatsappPhoneNumberId: "",
      razorpayKeyId: localStorage.getItem('printora_razorpay_key_id') || ""
    };
  }

  saveSettings() {
    localStorage.setItem('printora_store_settings', JSON.stringify(this.settings));
    this.notify();
  }

  loadUser() {
    const saved = localStorage.getItem('printora_user');
    return saved ? JSON.parse(saved) : null;
  }

  setUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('printora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('printora_user');
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
        // Merge or replace
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
          shippingFlatFee: Number(dbSettings.shipping_flat_fee) || this.settings.shippingFlatFee,
          freeShippingThreshold: Number(dbSettings.free_shipping_threshold) || this.settings.freeShippingThreshold,
          announcementBanner: dbSettings.announcement_banner || this.settings.announcementBanner
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
      this.showToast(`"${product.name}" requires a custom quote. Please submit an enquiry.`, 'info');
      return false;
    }

    const {
      size = product.sizes?.[0] || 'Standard',
      color = product.colors?.[0]?.name || 'Standard',
      quantity = 1,
      customName = '',
      customNumber = '',
      customNotes = '',
      artworkFile = null
    } = options;

    const cartItemId = `${product.id}-${size}-${color}-${customName}-${customNumber}`;
    const existingIndex = this.cart.findIndex(i => i.cartItemId === cartItemId);

    if (existingIndex > 0 || existingIndex === 0) {
      this.cart[existingIndex].quantity += quantity;
    } else {
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
        artworkFile: artworkFile ? artworkFile.name : null
      });
    }

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

  getShippingCharge() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= this.settings.freeShippingThreshold) return 0;
    return this.settings.shippingFlatFee;
  }

  getCartTotal(discount = 0) {
    return Math.max(0, this.getCartSubtotal() + this.getShippingCharge() - discount);
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
    const shippingCharge = this.getShippingCharge();
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
      shippingState: customerData.state.trim(),
      shippingPincode: customerData.pincode.trim(),
      shippingCountry: 'India',
      specialInstructions: customerData.specialInstructions?.trim() || '',
      items: [...this.cart],
      subtotal,
      discount,
      shippingCharge,
      totalAmount,
      status: 'Pending',
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
            shipping_charge: shippingCharge,
            total_amount: totalAmount,
            status: 'Pending'
          }])
          .select()
          .single();

        if (!ordErr && dbOrder) {
          // Insert order items
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

    // 3. Trigger Method 2 (WhatsApp Cloud API if configured)
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
  // ADMIN STORE MANAGEMENT
  // ==========================================
  updateOrderStatus(orderId, newStatus, internalNotes = '') {
    const order = this.orders.find(o => o.id === orderId || o.orderCode === orderId);
    if (order) {
      order.status = newStatus;
      if (internalNotes) order.internalNotes = internalNotes;
      order.updatedAt = new Date().toISOString();
      this.saveOrders();
      this.showToast(`Order ${order.orderCode} updated to ${newStatus}`, 'success');
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
      // Category filter
      const matchesCategory = this.activeCategory === 'all' || prod.categoryId === this.activeCategory;
      // Search filter
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
      // 'featured'
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }
}

export const store = new PrintoraStore();
