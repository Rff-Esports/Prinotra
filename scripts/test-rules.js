import { INITIAL_PRODUCTS, CATEGORIES } from '../src/data/products.js';
import store from '../src/services/store.js';

console.log('Testing business rules and pricing compliance...');

// Check product pricing for official products
const expectedPrices = {
  'Round Neck T-shirt': 499,
  'Premium T-shirt': 599,
  'Oversized T-shirt': 799,
  'Polo T-shirt': 599,
  'Hoodie': 949,
  'Custom Jersey': 499,
  'Cap': 399,
  'Coffee Mug': 299,
  'Magic Mug': 399,
  'Photo Frame': 499,
  'Gift Box': 799,
  'Tote Bag': 449
};

let errors = [];

for (const [name, price] of Object.entries(expectedPrices)) {
  const prod = INITIAL_PRODUCTS.find(p => p.name === name);
  if (!prod) {
    errors.push(`Missing product: ${name}`);
  } else if (prod.price !== price) {
    errors.push(`Price mismatch for ${name}: expected ₹${price}, got ₹${prod.price}`);
  }
}

// Check other items have contact_for_price / quoteOnly / comingSoon
for (const p of INITIAL_PRODUCTS) {
  if (p.price === null || p.price === undefined) {
    if (!p.isQuoteOnly && !p.contactForPrice && !p.comingSoon) {
      errors.push(`Product ${p.name} has no price and neither isQuoteOnly nor contactForPrice nor comingSoon is set`);
    }
  }
}

// Check shipping charge is always 0
const cartScenarios = [
  [],
  [{ id: 'round-neck', price: 499, quantity: 1 }],
  [{ id: 'round-neck', price: 499, quantity: 1 }, { id: 'hoodie', price: 949, quantity: 2 }],
  [{ id: 'cap', price: 399, quantity: 10 }]
];

for (const items of cartScenarios) {
  store.cart = items;
  const shipping = store.getShippingCharge();
  if (shipping !== 0) {
    errors.push(`Shipping charge rule violated: expected 0, got ${shipping}`);
  }
  const subtotal = store.getCartSubtotal();
  const total = store.getCartTotal();
  if (total !== subtotal) {
    errors.push(`Total mismatch when no coupon: subtotal=${subtotal}, total=${total}`);
  }
}

if (errors.length > 0) {
  console.error('FAILED with errors:', errors);
  process.exit(1);
} else {
  console.log(`SUCCESS: All ${Object.keys(expectedPrices).length} official products match exact prompt prices!`);
  console.log(`SUCCESS: Total products in catalogue: ${INITIAL_PRODUCTS.length}`);
  console.log(`SUCCESS: Free shipping rules strictly return ₹0 across all scenarios!`);
}
