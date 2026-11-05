// PRINTORA Central Store & Reactive State Management
// Brand: PRINTORA ("YOU IMAGINE. WE PRINT.")
// Official Domain: https://printoracustom.in
// WhatsApp: +91 8106992102
// Delivery: STRICT ₹0 FREE DELIVERY ACROSS INDIA

import { CATEGORIES, INITIAL_PRODUCTS } from '../data/products.js';
import { supabase, isSupabaseConfigured } from './supabase.js';
import { formatWhatsAppOrderMessage, generateWhatsAppUrl, sendWhatsAppCloudApiNotification, generateBulkWhatsAppUrl } from './whatsapp.js';
import { getCloudOverrides, pushOverridesToCloud, fetchLiveCloudOverrides, getGlobalCloudState, fetchLiveGlobalCloud, pushGlobalCloudState } from './cloudSync.js';

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
const safeGetItem = (k) => {
  if (!isBrowser) return null;
  try { return localStorage.getItem(k); } catch (e) { return null; }
};
const safeSetItem = (k, v) => {
  if (!isBrowser) return null;
  try {
    localStorage.setItem(k, v);
  } catch (err) {
    console.warn(`[STORAGE QUOTA] Could not save ${k}:`, err.message);
    try {
      localStorage.removeItem('printora_custom_products');
      localStorage.setItem(k, v);
    } catch (e) {}
  }
};
const safeRemoveItem = (k) => {
  if (!isBrowser) return null;
  try { localStorage.removeItem(k); } catch (e) {}
};

class PrintoraStore {
  constructor() {
    this.listeners = new Set();
    this.products = this.loadInitialProducts();
    this.categories = CATEGORIES;
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.savedDesigns = this.loadSavedDesigns();
    this.coupons = this.loadCoupons();
    this.appliedCoupon = this.loadAppliedCoupon();
    this.orders = this.loadOrders();
    this.registeredUsers = this.loadRegisteredUsers();
    this.bulkEnquiries = this.loadBulkEnquiries();
    this.suppliers = this.loadSuppliers();
    this.supplierAssignments = this.loadSupplierAssignments();
    this.settings = this.loadSettings();
    this.currentUser = this.loadUser();
    this.reviews = this.loadReviews();
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'featured'; // featured, price-low, price-high, name
    this.notification = null;

    
    // Sync with Supabase & Global Netlify Cloud in background
    this.syncFromSupabase();
    this.syncGlobalCloud();
    if (isBrowser) {
      setInterval(() => this.syncGlobalCloud(), 12000);
    }
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

  // Persistence helpers with Global Cross-Device Cloud Synchronization
  loadDeletedProducts() {
    const cloudDeleted = getGlobalCloudState()?.deletedProducts || [];
    const saved = safeGetItem('printora_deleted_products');
    let localDeleted = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) localDeleted = parsed;
      } catch (e) {
        localDeleted = [];
      }
    }
    return Array.from(new Set([...cloudDeleted, ...localDeleted]));
  }

  loadInitialProducts() {
    const cloudOverrides = getCloudOverrides() || {};
    const saved = safeGetItem('printora_custom_products');
    let localSavedMap = new Map();

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localSavedMap = new Map(parsed.map(p => [p.id, p]));
        }
      } catch (e) {
        console.warn("Failed to parse local custom products:", e);
      }
    }

    const deletedSet = new Set(this.loadDeletedProducts());

    const mergedProducts = INITIAL_PRODUCTS
      .filter(p => !deletedSet.has(p.id))
      .map(p => {
        // Cloud overrides have top priority so any update made on laptop/mobile reflects on ALL devices
        const ed = cloudOverrides[p.id] || localSavedMap.get(p.id);
        if (ed) {
          return {
            ...p,
            name: ed.name || p.name,
            price: ed.price !== undefined ? ed.price : p.price,
            originalPrice: ed.originalPrice !== undefined ? ed.originalPrice : p.originalPrice,
            images: (ed.images && ed.images.length > 0) ? ed.images : p.images,
            isAvailable: ed.isAvailable !== undefined ? ed.isAvailable : p.isAvailable,
            isQuoteOnly: ed.isQuoteOnly !== undefined ? ed.isQuoteOnly : p.isQuoteOnly,
            categoryId: ed.categoryId || p.categoryId,
            categoryName: ed.categoryName || p.categoryName,
            subtitle: ed.subtitle || p.subtitle,
            description: ed.description || p.description
          };
        }
        return { ...p };
      })
      .filter(p => p.isAvailable !== false);

    // Also include any custom items added by admin that are not in INITIAL_PRODUCTS and not deleted
    const initialIdSet = new Set(INITIAL_PRODUCTS.map(p => p.id));
    for (const [id, prod] of localSavedMap.entries()) {
      if (!initialIdSet.has(id) && !deletedSet.has(id) && prod.isAvailable !== false && !mergedProducts.some(p => p.id === id)) {
        mergedProducts.push(prod);
      }
    }
    for (const [id, ov] of Object.entries(cloudOverrides)) {
      if (!initialIdSet.has(id) && !deletedSet.has(id) && ov.isAvailable !== false && !mergedProducts.some(p => p.id === id)) {
        mergedProducts.push({
          id: ov.id || id,
          slug: (ov.name || 'custom-item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          categoryId: ov.categoryId || 'apparel',
          categoryName: ov.categoryName || 'Apparel',
          name: ov.name || 'Custom Product',
          subtitle: ov.subtitle || 'Custom Merchandise',
          description: ov.description || 'Crafted with premium materials by Printora.',
          price: ov.price,
          originalPrice: ov.originalPrice,
          isQuoteOnly: ov.price === null || ov.price === undefined,
          isOnwards: false,
          images: (ov.images && ov.images.length > 0) ? ov.images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'],
          sizes: ov.sizes || ["S", "M", "L", "XL", "XXL"],
          colors: ov.colors || [{ name: "Black", hex: "#111111" }, { name: "White", hex: "#FFFFFF" }],
          isFeatured: false,
          isAvailable: true,
          customization: {
            allowName: true,
            allowNumber: false,
            allowLogo: true,
            allowNotes: true,
            placementOptions: ["Center Chest", "Left Chest", "Back Print"]
          }
        });
      }
    }

    return mergedProducts;
  }

  saveProducts() {
    safeSetItem('printora_custom_products', JSON.stringify(this.products));
    this.notify();
  }

  async updateProduct(productId, updates) {
    let idx = this.products.findIndex(p => p.id === productId);
    let targetProduct;

    if (idx !== -1) {
      this.products[idx] = { ...this.products[idx], ...updates };
      targetProduct = this.products[idx];
    } else {
      // NEW PRODUCT CREATION: Add to catalogue!
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
      const catId = updates.categoryId || 'apparel';
      const catName = updates.categoryName || catMap[catId] || 'Apparel';
      const prodName = updates.name || 'New Custom Product';

      targetProduct = {
        id: productId || `prn-custom-${Date.now()}`,
        slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        categoryId: catId,
        categoryName: catName,
        name: prodName,
        subtitle: updates.subtitle || `${catName} Staple • Premium Printora Finish`,
        description: updates.description || 'Crafted with premium materials and high-precision custom printing by Printora.',
        price: updates.price !== undefined ? updates.price : null,
        originalPrice: updates.originalPrice !== undefined ? updates.originalPrice : (updates.price ? Math.round(updates.price * 1.3) : null),
        isQuoteOnly: updates.price === null || updates.price === undefined,
        isOnwards: false,
        images: (updates.images && updates.images.length > 0) ? updates.images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'],
        sizes: updates.sizes || ["S", "M", "L", "XL", "XXL"],
        colors: updates.colors || [
          { name: "Onyx Black", hex: "#111111" },
          { name: "Pure White", hex: "#FFFFFF" }
        ],
        isFeatured: false,
        isAvailable: updates.isAvailable !== undefined ? updates.isAvailable : true,
        customization: {
          allowName: true,
          allowNumber: false,
          allowLogo: true,
          allowNotes: true,
          placementOptions: ["Center Chest", "Left Chest", "Back Print"]
        },
        ...updates
      };

      this.products.unshift(targetProduct);
      idx = 0;

      // Remove from deleted list if it was previously deleted
      const delList = this.loadDeletedProducts().filter(id => id !== targetProduct.id);
      safeSetItem('printora_deleted_products', JSON.stringify(delList));
    }

    this.saveProducts();

    // Dual-sync to global Netlify cloud store for ALL devices worldwide
    const currentOverrides = { ...(getCloudOverrides() || {}) };
    currentOverrides[targetProduct.id] = {
      id: targetProduct.id,
      name: targetProduct.name,
      price: targetProduct.price,
      originalPrice: targetProduct.originalPrice,
      images: targetProduct.images,
      categoryId: targetProduct.categoryId,
      categoryName: targetProduct.categoryName,
      subtitle: targetProduct.subtitle,
      description: targetProduct.description,
      isAvailable: targetProduct.isAvailable,
      isQuoteOnly: targetProduct.isQuoteOnly
    };

    const deletedList = this.loadDeletedProducts();
    const success = await pushGlobalCloudState({
      products: currentOverrides,
      deletedProducts: deletedList
    });

    if (success) {
      console.log(`✅ [PRINTORA CLOUD] Product "${targetProduct.name}" synced live for ALL devices!`);
    }
    this.notify();
    return { success, product: targetProduct };
  }

  async deleteProduct(productId) {
    if (!productId) return { success: false };
    const prod = this.products.find(p => p.id === productId);
    const prodName = prod ? prod.name : productId;

    // 1. Add to deletedProducts tracking list locally
    const deletedList = this.loadDeletedProducts();
    if (!deletedList.includes(productId)) {
      deletedList.push(productId);
      safeSetItem('printora_deleted_products', JSON.stringify(deletedList));
    }

    // 2. Remove product completely from this.products
    this.products = this.products.filter(p => p.id !== productId);
    this.saveProducts();

    // 3. Remove from cloud overrides if present & push deletedProducts to Netlify cloud state
    const currentOverrides = { ...(getCloudOverrides() || {}) };
    delete currentOverrides[productId];

    const success = await pushGlobalCloudState({
      products: currentOverrides,
      deletedProducts: deletedList
    });

    this.notify();
    this.showToast(`Product "${prodName}" permanently deleted from catalogue & all devices`, 'info');
    return { success: true };
  }

  async restoreAllOfficialImages() {
    let changedCount = 0;
    const initialMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
    const currentOverrides = { ...(getCloudOverrides() || {}) };

    this.products.forEach(p => {
      const orig = initialMap.get(p.id);
      if (orig && orig.images && orig.images.length > 0) {
        p.images = [...orig.images];
        if (currentOverrides[p.id]) {
          currentOverrides[p.id].images = [...orig.images];
        }
        changedCount++;
      }
    });

    this.saveProducts();
    const success = await pushGlobalCloudState({
      products: currentOverrides
    });
    this.notify();
    this.showToast(`Official product images restored for ${changedCount} items across all devices!`, 'success');
    return { success, changedCount };
  }

  // Publish all current products, orders & coupons live to Netlify Cloud for all devices
  async publishAllProductsLive() {
    const overrides = {};
    for (const p of this.products) {
      overrides[p.id] = {
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        images: p.images,
        isAvailable: p.isAvailable,
        isQuoteOnly: p.isQuoteOnly
      };
    }
    const success = await pushGlobalCloudState({
      products: overrides,
      orders: this.orders,
      coupons: this.coupons
    });
    if (success) {
      this.showToast('🚀 All products, orders & coupons published live to ALL devices worldwide!', 'success');
    } else {
      this.showToast('Saved locally. Cloud sync pending.', 'info');
    }
    return success;
  }

  // Background Global Cloud Sync to pull fresh orders, coupons & product edits from Netlify Snippet
  async syncGlobalCloud() {
    try {
      const liveCloud = await fetchLiveGlobalCloud();
      if (liveCloud) {
        let hasChanges = false;

        // 0. Synchronize Deleted Orders across devices
        if (Array.isArray(liveCloud.deletedOrders) && liveCloud.deletedOrders.length > 0) {
          const localDeleted = this.loadDeletedOrders();
          const mergedDeleted = Array.from(new Set([...localDeleted, ...liveCloud.deletedOrders]));
          safeSetItem('printora_deleted_orders', JSON.stringify(mergedDeleted));
          const deletedSet = new Set(mergedDeleted);
          const initialLen = this.orders.length;
          this.orders = this.orders.filter(o => !deletedSet.has(o.orderCode || o.id));
          if (this.orders.length !== initialLen) {
            safeSetItem('printora_orders', JSON.stringify(this.orders));
            hasChanges = true;
          }
        }

        // 1. Synchronize Orders across devices
        if (Array.isArray(liveCloud.orders) && liveCloud.orders.length > 0) {
          const deletedSet = new Set(this.loadDeletedOrders());
          const orderMap = new Map(this.orders.map(o => [o.orderCode || o.id, o]));
          liveCloud.orders.forEach(co => {
            const key = co.orderCode || co.id;
            if (deletedSet.has(key)) return; // Never restore deleted orders
            if (!orderMap.has(key)) {
              this.orders.unshift(co);
              hasChanges = true;
            } else {
              const existing = orderMap.get(key);
              if (existing.status !== co.status) {
                existing.status = co.status;
                hasChanges = true;
              }
            }
          });
          if (hasChanges) {
            safeSetItem('printora_orders', JSON.stringify(this.orders));
          }
        }

        // 1b. Synchronize Registered & Logged-In Users across devices
        if (Array.isArray(liveCloud.registeredUsers) && liveCloud.registeredUsers.length > 0) {
          const userMap = new Map();
          this.registeredUsers.forEach(u => userMap.set((u.email || u.phone || u.id).toLowerCase(), u));
          let usersChanged = false;
          liveCloud.registeredUsers.forEach(cu => {
            const key = (cu.email || cu.phone || cu.id).toLowerCase();
            if (!userMap.has(key)) {
              userMap.set(key, cu);
              usersChanged = true;
            } else {
              const existing = userMap.get(key);
              if (cu.lastLogin && (!existing.lastLogin || new Date(cu.lastLogin) > new Date(existing.lastLogin))) {
                userMap.set(key, { ...existing, ...cu });
                usersChanged = true;
              }
            }
          });
          if (usersChanged) {
            this.registeredUsers = Array.from(userMap.values()).sort((a, b) => new Date(b.lastLogin || b.createdAt || 0) - new Date(a.lastLogin || a.createdAt || 0));
            safeSetItem('printora_registered_users', JSON.stringify(this.registeredUsers));
            hasChanges = true;
          }
        }

        // 2. Synchronize Coupons across devices
        if (Array.isArray(liveCloud.coupons) && liveCloud.coupons.length > 0) {
          const currentCodes = this.coupons.map(c => c.code.toUpperCase().replace(/\s+/g, '')).join(',');
          const incomingCodes = liveCloud.coupons.map(c => c.code.toUpperCase().replace(/\s+/g, '')).join(',');
          if (currentCodes !== incomingCodes || JSON.stringify(this.coupons) !== JSON.stringify(liveCloud.coupons)) {
            this.coupons = liveCloud.coupons;
            safeSetItem('printora_coupons', JSON.stringify(this.coupons));
            hasChanges = true;
          }
        }

        // -1. Synchronize Deleted Products across devices
        if (Array.isArray(liveCloud.deletedProducts) && liveCloud.deletedProducts.length > 0) {
          const localDeleted = this.loadDeletedProducts();
          const mergedDeleted = Array.from(new Set([...localDeleted, ...liveCloud.deletedProducts]));
          safeSetItem('printora_deleted_products', JSON.stringify(mergedDeleted));
          const deletedSet = new Set(mergedDeleted);
          const initialLen = this.products.length;
          this.products = this.products.filter(p => !deletedSet.has(p.id));
          if (this.products.length !== initialLen) {
            safeSetItem('printora_custom_products', JSON.stringify(this.products));
            hasChanges = true;
          }
        }

        // 3. Synchronize Products across devices
        if (liveCloud.products && Object.keys(liveCloud.products).length > 0) {
          const deletedSet = new Set(this.loadDeletedProducts());
          const existingMap = new Map(this.products.map(p => [p.id, p]));

          Object.entries(liveCloud.products).forEach(([id, ov]) => {
            if (deletedSet.has(id)) return; // Never restore deleted products

            if (existingMap.has(id)) {
              const existing = existingMap.get(id);
              if (
                existing.name !== ov.name ||
                existing.price !== ov.price ||
                existing.originalPrice !== ov.originalPrice ||
                existing.isAvailable !== ov.isAvailable ||
                JSON.stringify(existing.images) !== JSON.stringify(ov.images)
              ) {
                Object.assign(existing, {
                  name: ov.name || existing.name,
                  price: ov.price !== undefined ? ov.price : existing.price,
                  originalPrice: ov.originalPrice !== undefined ? ov.originalPrice : existing.originalPrice,
                  images: (ov.images && ov.images.length > 0) ? ov.images : existing.images,
                  isAvailable: ov.isAvailable !== undefined ? ov.isAvailable : existing.isAvailable,
                  isQuoteOnly: ov.isQuoteOnly !== undefined ? ov.isQuoteOnly : existing.isQuoteOnly
                });
                hasChanges = true;
              }
            } else if (ov.isAvailable !== false) {
              // New product added on another device!
              this.products.unshift({
                id: ov.id || id,
                slug: (ov.name || 'custom-item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                name: ov.name || 'Custom Product',
                categoryId: ov.categoryId || 'apparel',
                categoryName: ov.categoryName || 'Apparel',
                subtitle: ov.subtitle || 'Custom Merchandise • Premium Printora Finish',
                description: ov.description || 'Crafted with premium materials and high-precision custom printing by Printora.',
                price: ov.price !== undefined ? ov.price : null,
                originalPrice: ov.originalPrice,
                isQuoteOnly: ov.price === null || ov.price === undefined,
                isOnwards: false,
                images: (ov.images && ov.images.length > 0) ? ov.images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'],
                sizes: ov.sizes || ["S", "M", "L", "XL", "XXL"],
                colors: ov.colors || [{ name: "Black", hex: "#111111" }, { name: "White", hex: "#FFFFFF" }],
                isFeatured: false,
                isAvailable: true,
                customization: {
                  allowName: true,
                  allowNumber: false,
                  allowLogo: true,
                  allowNotes: true,
                  placementOptions: ["Center Chest", "Left Chest", "Back Print"]
                }
              });
              hasChanges = true;
            }
          });

          if (hasChanges) {
            safeSetItem('printora_custom_products', JSON.stringify(this.products));
          }
        }

        if (hasChanges) {
          this.notify();
          console.log('✅ [CLOUD SYNC] Synchronized latest Orders, Coupons & Products across devices');
        }
      }
    } catch (err) {
      console.warn('Background global cloud sync skipped:', err.message);
    }
  }

  loadCart() {
    const saved = safeGetItem('printora_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    safeSetItem('printora_cart', JSON.stringify(this.cart));
    if (this.appliedCoupon) {
      const subtotal = this.getCartSubtotal();
      const res = this.validateCoupon(this.appliedCoupon.code, subtotal);
      if (res.valid) {
        this.appliedCoupon.discount = res.discount;
        this.saveAppliedCoupon();
      } else {
        this.appliedCoupon = null;
        this.saveAppliedCoupon();
      }
    }
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
      { code: "DIWALI10", alias: "DIWALI 10", discountType: "percent", value: 10, minOrder: 0, description: "Flat 10% OFF on all custom merchandise (Happy Diwali Special)" },
      { code: "PRINTORA 25", alias: "PRINTORA25", discountType: "fixed", value: 25, minOrder: 0, description: "Flat ₹25 OFF on MRP" },
      { code: "PRINTORA50", alias: "PRINTORA 50", discountType: "fixed", value: 50, minOrder: 499, description: "Flat ₹50 OFF on orders above ₹499" },
      { code: "WELCOME10", discountType: "percent", value: 10, minOrder: 0, description: "10% OFF for new customers" },
      { code: "BULK20", discountType: "percent", value: 20, minOrder: 2499, description: "20% OFF on team and bulk orders above ₹2499" }
    ];

    const cloudCoupons = getGlobalCloudState()?.coupons;
    if (Array.isArray(cloudCoupons) && cloudCoupons.length > 0) {
      if (!cloudCoupons.some(c => c.code.replace(/\s+/g, '').toUpperCase() === 'DIWALI10')) {
        cloudCoupons.unshift(defaultCoupons[0]);
      }
      return cloudCoupons;
    }

    const saved = safeGetItem('printora_coupons');
    if (!saved) return defaultCoupons;
    try {
      const list = JSON.parse(saved);
      if (!list.some(c => c.code.replace(/\s+/g, '').toUpperCase() === 'DIWALI10')) {
        list.unshift(defaultCoupons[0]);
      }
      if (!list.some(c => c.code.replace(/\s+/g, '').toUpperCase() === 'PRINTORA25')) {
        list.splice(1, 0, defaultCoupons[1]);
      }
      return list;
    } catch (e) {
      return defaultCoupons;
    }
  }

  saveCoupons() {
    safeSetItem('printora_coupons', JSON.stringify(this.coupons));
    pushGlobalCloudState({ coupons: this.coupons });
    this.notify();
  }

  deleteCoupon(code) {
    if (!code) return;
    const norm = code.toUpperCase().replace(/\s+/g, '');
    this.coupons = this.coupons.filter(c => c.code.toUpperCase().replace(/\s+/g, '') !== norm);
    this.saveCoupons();
    this.showToast(`Coupon "${code}" deleted successfully`, 'info');
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

    // Check expiry date & time
    if (coupon.expiresAt) {
      const exp = new Date(coupon.expiresAt).getTime();
      if (!isNaN(exp) && Date.now() > exp) {
        return { valid: false, message: `Coupon "${coupon.code}" expired on ${new Date(coupon.expiresAt).toLocaleString('en-IN')}` };
      }
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

  loadAppliedCoupon() {
    const saved = safeGetItem('printora_applied_coupon');
    if (!saved) return null;
    try { return JSON.parse(saved); } catch (e) { return null; }
  }

  saveAppliedCoupon() {
    if (this.appliedCoupon) {
      safeSetItem('printora_applied_coupon', JSON.stringify(this.appliedCoupon));
    } else {
      safeRemoveItem('printora_applied_coupon');
    }
  }

  applyCoupon(code) {
    const subtotal = this.getCartSubtotal();
    const res = this.validateCoupon(code, subtotal);
    if (res.valid) {
      this.appliedCoupon = res;
      this.saveAppliedCoupon();
      this.notify();
      this.showToast(res.message, 'success');
    } else {
      this.showToast(res.message, 'error');
    }
    return res;
  }

  removeCoupon() {
    const prev = this.appliedCoupon?.code;
    this.appliedCoupon = null;
    this.saveAppliedCoupon();
    this.notify();
    if (prev) {
      this.showToast(`Coupon "${prev}" removed`, 'info');
    }
  }

  getCouponDiscount() {
    if (!this.appliedCoupon) return 0;
    const subtotal = this.getCartSubtotal();
    const res = this.validateCoupon(this.appliedCoupon.code, subtotal);
    if (res.valid) {
      if (this.appliedCoupon.discount !== res.discount) {
        this.appliedCoupon.discount = res.discount;
        this.saveAppliedCoupon();
      }
      return res.discount;
    } else {
      this.appliedCoupon = null;
      this.saveAppliedCoupon();
      return 0;
    }
  }

  loadDeletedOrders() {
    const cloudDeleted = getGlobalCloudState()?.deletedOrders || [];
    const saved = safeGetItem('printora_deleted_orders');
    let localDeleted = [];
    if (saved) {
      try { localDeleted = JSON.parse(saved); } catch (e) { localDeleted = []; }
    }
    return Array.from(new Set([...cloudDeleted, ...localDeleted]));
  }

  loadOrders() {
    const deletedList = this.loadDeletedOrders();
    const deletedSet = new Set(deletedList);
    const cloudOrders = (getGlobalCloudState()?.orders || []).filter(o => !deletedSet.has(o.orderCode || o.id));
    const saved = safeGetItem('printora_orders');
    const localOrders = (saved ? JSON.parse(saved) : []).filter(o => !deletedSet.has(o.orderCode || o.id));

    const defaultOrders = [
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
    ].filter(o => !deletedSet.has(o.orderCode || o.id));

    const mergedMap = new Map();
    defaultOrders.forEach(o => mergedMap.set(o.orderCode || o.id, o));
    localOrders.forEach(o => mergedMap.set(o.orderCode || o.id, o));
    cloudOrders.forEach(o => mergedMap.set(o.orderCode || o.id, o));

    return Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  saveOrders() {
    safeSetItem('printora_orders', JSON.stringify(this.orders));
    pushGlobalCloudState({ orders: this.orders });
    this.notify();
  }

  deleteOrder(orderCode) {
    if (!orderCode) return;
    const deletedList = this.loadDeletedOrders();
    if (!deletedList.includes(orderCode)) {
      deletedList.push(orderCode);
      safeSetItem('printora_deleted_orders', JSON.stringify(deletedList));
    }
    this.orders = this.orders.filter(o => o.orderCode !== orderCode && o.id !== orderCode);
    safeSetItem('printora_orders', JSON.stringify(this.orders));
    pushGlobalCloudState({
      orders: this.orders,
      deletedOrders: deletedList
    });
    this.notify();
    this.showToast(`Order #${orderCode} deleted successfully`, 'info');
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

  loadRegisteredUsers() {
    const cloudUsers = getGlobalCloudState()?.registeredUsers || [];
    const saved = safeGetItem('printora_registered_users');
    let localUsers = [];
    if (saved) {
      try { localUsers = JSON.parse(saved); } catch (e) { localUsers = []; }
    }
    const legacySaved = safeGetItem('printora_users_db');
    let legacyUsers = [];
    if (legacySaved) {
      try { legacyUsers = JSON.parse(legacySaved); } catch (e) { legacyUsers = []; }
    }

    const defaultUsers = [
      {
        id: "usr-demo-01",
        name: "Rahul Varma",
        phone: "9848022334",
        email: "rahul.varma@example.com",
        gender: "Male",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        lastLogin: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "usr-demo-02",
        name: "Ananya Sharma",
        phone: "9123456789",
        email: "ananya.sharma@gmail.com",
        gender: "Female",
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        lastLogin: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ];

    const map = new Map();
    defaultUsers.forEach(u => map.set((u.email || u.phone || u.id).toLowerCase(), u));
    legacyUsers.forEach(u => map.set((u.email || u.phone || u.id).toLowerCase(), u));
    localUsers.forEach(u => map.set((u.email || u.phone || u.id).toLowerCase(), u));
    cloudUsers.forEach(u => map.set((u.email || u.phone || u.id).toLowerCase(), u));

    return Array.from(map.values()).sort((a, b) => new Date(b.lastLogin || b.createdAt || 0) - new Date(a.lastLogin || a.createdAt || 0));
  }

  saveRegisteredUsers(users) {
    this.registeredUsers = users;
    safeSetItem('printora_registered_users', JSON.stringify(users));
    pushGlobalCloudState({ registeredUsers: users });
    this.notify();
  }

  recordUserLogin(user) {
    if (!user) return;
    const users = this.loadRegisteredUsers();
    const cleanEmail = (user.email || '').trim().toLowerCase();
    const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '').slice(-10);
    const key = cleanEmail || cleanPhone;
    if (!key) return;

    const existingIndex = users.findIndex(u => 
      (cleanEmail && u.email?.toLowerCase() === cleanEmail) ||
      (cleanPhone && u.phone?.replace(/[^0-9]/g, '').slice(-10) === cleanPhone)
    );

    const now = new Date().toISOString();
    if (existingIndex !== -1) {
      users[existingIndex] = {
        ...users[existingIndex],
        ...user,
        name: user.name || users[existingIndex].name,
        gender: user.gender || users[existingIndex].gender || 'Unisex',
        lastLogin: now
      };
    } else {
      users.unshift({
        id: user.id || `usr-${Date.now()}`,
        name: user.name || 'Printora Customer',
        phone: cleanPhone || user.phone || '',
        email: cleanEmail || user.email || '',
        gender: user.gender || 'Unisex',
        password: user.password || '',
        createdAt: user.createdAt || now,
        lastLogin: now
      });
    }

    this.saveRegisteredUsers(users);
  }

  registerUser({ name, phone, email, gender, password }) {
    const users = this.loadRegisteredUsers();
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanPhone || cleanPhone.length !== 10) {
      return { success: false, message: "Please provide a valid 10-digit mobile number." };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: "Please provide a valid email address." };
    }
    if (!password || password.length < 4) {
      return { success: false, message: "Password must be at least 4 characters long." };
    }

    // Check if already registered
    const existing = users.find(u => 
      u.email.toLowerCase() === cleanEmail || 
      (u.phone && u.phone.replace(/[^0-9]/g, '').slice(-10) === cleanPhone)
    );
    if (existing) {
      return { success: false, message: "An account with this email or mobile number already exists. Please sign in." };
    }

    const now = new Date().toISOString();
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      gender: gender || 'Unisex',
      password: password,
      createdAt: now,
      lastLogin: now
    };

    users.unshift(newUser);
    this.saveRegisteredUsers(users);
    this.setUser(newUser);
    return { success: true, user: newUser };
  }

  loginUser({ contact, password }) {
    const users = this.loadRegisteredUsers();
    const cleanContact = (contact || '').trim().toLowerCase();
    const cleanPhone = cleanContact.replace(/[^0-9]/g, '').slice(-10);

    const user = users.find(u => 
      u.email.toLowerCase() === cleanContact || 
      (cleanPhone.length === 10 && u.phone && u.phone.replace(/[^0-9]/g, '').slice(-10) === cleanPhone)
    );

    if (!user) {
      return { success: false, message: "No account found matching this email or mobile number. Please register first." };
    }

    if (user.password !== password) {
      return { success: false, message: "Incorrect password. Please enter the correct password." };
    }

    user.lastLogin = new Date().toISOString();
    this.saveRegisteredUsers(users);
    this.setUser(user);
    return { success: true, user };
  }

  loadReviews() {
    const saved = safeGetItem('printora_customer_reviews');
    if (!saved) {
      return [
        {
          id: 'rev-1',
          orderCode: 'PRN-DEMO-1',
          customerName: 'Rahul Varma',
          rating: 5,
          comment: 'Outstanding sublimation print and ultra-comfortable cotton. Delivered right to my doorstep with zero shipping charge!',
          photoUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
          date: '02 Nov 2026'
        },
        {
          id: 'rev-2',
          orderCode: 'PRN-DEMO-2',
          customerName: 'Ananya Sharma',
          rating: 5,
          comment: 'Custom coffee mug and tote bag came out better than expected! Crisp colors and fast WhatsApp confirmation.',
          photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80',
          date: '04 Nov 2026'
        }
      ];
    }
    try { return JSON.parse(saved); } catch (e) { return []; }
  }

  saveReviews(reviews) {
    safeSetItem('printora_customer_reviews', JSON.stringify(reviews));
    this.reviews = reviews;
    this.notify();
  }

  addReview({ orderCode, customerName, rating, comment, photoUrl }) {
    const newRev = {
      id: `rev-${Date.now()}`,
      orderCode,
      customerName: customerName || this.currentUser?.name || 'Customer',
      rating: Number(rating) || 5,
      comment: comment || 'Great quality delivery!',
      photoUrl: photoUrl || '',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const reviews = [newRev, ...(this.reviews || [])];
    this.saveReviews(reviews);

    // Update order record if present
    const ordIdx = this.orders.findIndex(o => o.orderCode === orderCode);
    if (ordIdx !== -1) {
      this.orders[ordIdx].reviewed = true;
      this.orders[ordIdx].review = newRev;
      this.saveOrders();
    }

    this.showToast('Thank you! Your rating and photo review has been published.', 'success');
    return newRev;
  }

  setUser(user) {
    this.currentUser = user;
    if (user) {
      safeSetItem('printora_user', JSON.stringify(user));
      if (user.gender) safeSetItem('printora_user_gender', user.gender);
    } else {
      safeRemoveItem('printora_user');
    }
    this.notify();
  }

  getUserGender() {
    return this.currentUser?.gender || safeGetItem('printora_user_gender') || null;
  }

  setUserGender(gender) {
    if (this.currentUser) {
      this.currentUser.gender = gender;
      safeSetItem('printora_user', JSON.stringify(this.currentUser));
    }
    safeSetItem('printora_user_gender', gender);
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
    this.appliedCoupon = null;
    this.saveAppliedCoupon();
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

  getCartTotal(discount = null) {
    const disc = discount !== null ? discount : this.getCouponDiscount();
    return Math.max(0, this.getCartSubtotal() - disc);
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

  // Filtered and sorted products
  getFilteredProducts() {
    return this.products.filter(prod => {
      if (prod.isAvailable === false) return false;
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
