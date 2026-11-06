const assert = require('assert');

async function runTest() {
  console.log('Testing End-to-End User Order Submission to Admin Dashboard...');

  // Mock browser localStorage and sessionStorage
  const storage = new Map();
  const session = new Map();
  global.window = {
    location: { hostname: 'localhost', hash: '' },
    localStorage: {
      getItem: (k) => storage.get(k) || null,
      setItem: (k, v) => storage.set(k, v),
      removeItem: (k) => storage.delete(k)
    },
    sessionStorage: {
      getItem: (k) => session.get(k) || null,
      setItem: (k, v) => session.set(k, v),
      removeItem: (k) => session.delete(k)
    }
  };
  global.localStorage = global.window.localStorage;
  global.sessionStorage = global.window.sessionStorage;

  const { store } = await import('../src/services/store.js');
  const { renderAdminDashboard, setAdminAuthenticated } = await import('../src/components/AdminDashboard.js');

  // Authenticate admin session
  setAdminAuthenticated(true);

  // Clear existing cart
  store.clearCart();
  assert.strictEqual(store.getCartCount(), 0, 'Cart should start empty');

  // 1. User selects Round Neck T-shirt (Base: ₹399) + Large A4 Print (+₹60) = ₹459
  const product = store.products.find(p => p.id === 'prn-app-01');
  assert.ok(product, 'Round Neck T-shirt must exist in catalogue');
  assert.strictEqual(product.price, 399, 'Base price must be ₹399');

  const mockUploadedDesign = {
    name: 'test-company-logo.png',
    size: '48.5 KB',
    type: 'image/png',
    dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    isPdf: false
  };

  store.addToCart(product, {
    size: 'L',
    color: 'Onyx Black',
    quantity: 2,
    customName: 'RAHUL',
    customNumber: '07',
    customNotes: 'Print logo centered on chest',
    basePrice: 399,
    printingCharge: 60,
    printingType: 'Large A4 Print',
    printingPosition: 'Front',
    uploadedDesign: mockUploadedDesign
  });

  // 2. Verify Cart calculations
  assert.strictEqual(store.getCartCount(), 2, 'Cart count should be 2');
  const expectedUnitPrice = 399 + 60; // ₹459
  const expectedSubtotal = 459 * 2; // ₹918
  assert.strictEqual(store.getCartSubtotal(), expectedSubtotal, `Subtotal must be ₹${expectedSubtotal}`);
  assert.strictEqual(store.getShippingCharge(), 0, 'Shipping must be ₹0 Free Delivery');
  assert.strictEqual(store.getCartTotal(), expectedSubtotal, `Total payable must be ₹${expectedSubtotal}`);

  // 3. User POV: Place the order
  const placedOrder = await store.submitOrder({
    name: 'Vikram Reddy',
    phone: '9848011223',
    email: 'vikram.reddy@gmail.com',
    pincode: '500081',
    house: 'Flat 402, Royal Residency',
    area: 'Madhapur',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    specialInstructions: 'Leave with security if not available',
    paymentMethod: 'Razorpay Online (UPI / Card / NetBanking)',
    paymentStatus: 'Payment Confirmed',
    status: 'Payment Confirmed'
  });

  console.log('Placed Order Code:', placedOrder.orderCode);
  assert.ok(placedOrder.orderCode.startsWith('PRN-'), 'Order code must begin with PRN-');
  assert.strictEqual(placedOrder.totalAmount, 918, 'Total amount must match ₹918');
  assert.strictEqual(placedOrder.items.length, 1, 'Order must contain 1 customized item');

  const orderedItem = placedOrder.items[0];
  assert.strictEqual(orderedItem.printingType, 'Large A4 Print', 'Printing type must be Large A4 Print');
  assert.strictEqual(orderedItem.printingPosition, 'Front', 'Printing position must be Front');
  assert.strictEqual(orderedItem.printingCharge, 60, 'Printing charge must be 60');
  assert.strictEqual(orderedItem.basePrice, 399, 'Base price must be 399');
  assert.strictEqual(orderedItem.price, 459, 'Unit price must be 459');
  assert.ok(orderedItem.uploadedDesign, 'Uploaded design must be preserved');
  assert.strictEqual(orderedItem.uploadedDesign.name, 'test-company-logo.png', 'Uploaded design filename must match');

  // 4. Verify Admin Dashboard renders the order and every detail
  const adminHtml = renderAdminDashboard();

  // Check customer details in admin HTML
  assert.ok(adminHtml.includes(placedOrder.orderCode), 'Order code must appear in Admin Dashboard');
  assert.ok(adminHtml.includes('Vikram Reddy'), 'Customer name must appear in Admin Dashboard');
  assert.ok(adminHtml.includes('9848011223'), 'Customer phone must appear in Admin Dashboard');
  assert.ok(adminHtml.includes('500081'), 'Customer pincode must appear in Admin Dashboard');

  // Check printing customization specifications in admin HTML
  assert.ok(adminHtml.includes('Large A4 Print'), 'Print size "Large A4 Print" must appear in Admin Dashboard');
  assert.ok(adminHtml.includes('Front'), 'Print position "Front" must appear in Admin Dashboard');
  assert.ok(adminHtml.includes('Base Garment:'), 'Base Garment price must appear in Admin Orders tab');
  assert.ok(adminHtml.includes('Printing Charge:'), 'Printing charge must appear in Admin Orders tab');

  // Check uploaded artwork preview & download in admin HTML
  assert.ok(adminHtml.includes('test-company-logo.png'), 'Uploaded design filename must appear in Admin');
  assert.ok(adminHtml.includes('Download Design'), 'Download button must appear in Admin');
  assert.ok(adminHtml.includes('View Full'), 'View Full Image button must appear in Admin');

  console.log('✅ ALL TESTS PASSED! User POV order placement, artwork preservation, print specifications, and Admin Dashboard views are 100% verified!');
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
