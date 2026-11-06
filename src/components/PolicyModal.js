// PRINTORA Master Legal & Policy Pages (Requirement 12)
// Full, genuine Indian e-commerce legal provisions

import { renderIcon } from '../utils/icons.js';
import { BUSINESS_WHATSAPP_NUMBER } from '../services/whatsapp.js';

export const POLICIES = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "Data Protection & Digital Personal Data Protection (DPDP) Act Compliance",
    content: `
      <h4>1. Overview</h4>
      <p>PRINTORA ("we", "our", "us"), operating at https://printoracustom.in, recognizes the critical importance of privacy and personal data protection. This Privacy Policy outlines our transparent protocols for collecting, processing, and safeguarding your information when you browse our catalogue, configure customized merchandise, and communicate via WhatsApp.</p>

      <h4>2. Customer Information Collected</h4>
      <p>When you place an order or submit a bulk request, we collect:</p>
      <ul>
        <li><strong>Identity & Contact Details:</strong> Full Name, WhatsApp mobile number, and email address.</li>
        <li><strong>Delivery Address:</strong> House number, street name, area/locality, city, state, postal PIN code, and country (India).</li>
        <li><strong>Customization Data:</strong> Player names, jersey numbers, customized typography, corporate logo artwork files, and specialized printing notes.</li>
      </ul>

      <h4>3. Purpose of Processing & WhatsApp Communication</h4>
      <p>Your details are used exclusively to:
        (a) Verify and approve customized printing proofs before production;
        (b) Transmit order confirmations, tracking numbers, and delivery status updates via official WhatsApp (+91 8106992102);
        (c) Coordinate white-label dispatch through verified logistics partners;
        (d) Provide post-order support and warranty assistance.
      </p>

      <h4>4. Data Security & Storage</h4>
      <p>Customer data is encrypted and securely retained within Supabase PostgreSQL databases with Row Level Security (RLS). We do not collect, process, or store credit card, debit card, or net-banking credentials on our servers. Uploaded artwork is stored in secure cloud buckets solely for production purposes.</p>

      <h4>5. Third-Party Disclosures & Supplier Restrictions</h4>
      <p>We work with vetted printing and textile dealers (located in Nizamabad, Hyderabad, and Tirupur) under strict non-disclosure obligations. Dealers receive only the production artwork and delivery destination required to manufacture and dispatch the item. Dealer agreements explicitly forbid the sale or external sharing of your data.</p>

      <h4>6. Contact for Privacy Inquiries</h4>
      <p>For data rectification, access, or deletion requests, please contact our privacy compliance desk at <strong>printora256@gmail.com</strong> or write to PRINTORA, Nizamabad, Telangana 503001, India.</p>
    `
  },
  terms: {
    title: "Terms and Conditions",
    subtitle: "Website Usage & Commercial Ordering Agreement",
    content: `
      <h4>1. Agreement to Terms</h4>
      <p>By browsing, accessing, or placing orders on https://printoracustom.in, you agree to be bound by these Terms and Conditions and our associated policies. If you disagree with any portion, please refrain from using the platform.</p>

      <h4>2. Customization & Intellectual Property</h4>
      <p>When you provide custom logos, artwork, slogans, or imagery for personalized merchandise, you affirm that you possess the necessary copyrights, trademarks, or authorized permission to reproduce the design. PRINTORA reserves the right to decline printing materials that infringe on intellectual property, contain hate speech, or violate applicable laws.</p>

      <h4>3. Pricing Accuracy & Quote Requests</h4>
      <p>Confirmed selling prices are displayed in Indian National Rupees (INR). For products labeled "REQUEST A QUOTE", pricing is subject to custom specifications, volume, fabric GSM, and embroidery requirements. We reserve the right to correct accidental pricing errors before order acceptance.</p>

      <h4>4. Governing Law & Jurisdiction</h4>
      <p>These terms are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising from transactions on this platform shall be subject to the exclusive jurisdiction of the competent courts in Nizamabad, Telangana.</p>
    `
  },
  shipping: {
    title: "Shipping and Delivery Policy",
    subtitle: "Production Lead Times & Pan-India Logistics",
    content: `
      <h4>1. Order Processing & Production Time</h4>
      <p>Because every PRINTORA piece is custom manufactured to your specifications, orders undergo a specialized dual-stage fulfillment cycle:</p>
      <ul>
        <li><strong>Digital Proofing:</strong> Within 12–24 hours of order receipt, artwork is verified for resolution and typography spelling.</li>
        <li><strong>Custom Production Time:</strong> 2 to 4 business days for single orders (T-shirts, Custom Jerseys, Drinkware, Gifts); 4 to 7 business days for bulk and institutional orders (50+ units).</li>
      </ul>

      <h4>2. Transit & Delivery Timelines</h4>
      <ul>
        <li><strong>Nizamabad & Local Telangana:</strong> 1 to 2 business days after production completion.</li>
        <li><strong>Metro Cities (Hyderabad, Bangalore, Mumbai, Delhi NCR, Chennai):</strong> 2 to 4 business days.</li>
        <li><strong>Rest of India:</strong> 4 to 6 business days via express air/surface couriers (DTDC, Bluedart, Delhivery).</li>
      </ul>

      <h4>3. Zero Shipping Charges — 100% Free Pan-India Delivery</h4>
      <p>PRINTORA provides <strong>100% FREE Pan-India Delivery</strong> on all orders without exception. There are no delivery charges, no fuel surcharges, and no minimum order amount required. Whether you order a single custom mug (₹299) or 100 team jerseys, shipping is always ₹0 across all serviceable pin codes in India.</p>

      <h4>4. Tracking & Delays</h4>
      <p>Once dispatched, a live tracking link with the courier partner's docket number is dispatched to your WhatsApp number. While we partner with top-tier national logistics providers, PRINTORA is not liable for transit delays caused by extreme weather, regional strikes, or incorrect postal addresses provided by the customer.</p>
    `
  },
  refund: {
    title: "Return and Refund Policy",
    subtitle: "Customized Product Conditions & Replacement Guarantees",
    content: `
      <h4>1. Personalized Merchandise Policy</h4>
      <p>Because customized products (bearing your chosen names, custom numbers, uploaded logos, or personal photos) cannot be restocked or resold, returns or exchanges for customer sizing errors, subjective change of mind, or buyer's remorse are not accepted under standard consumer guidelines.</p>

      <h4>2. Defective, Damaged or Incorrect Deliveries</h4>
      <p>We take pride in our workmanship. You are 100% entitled to an immediate free remake, replacement, or full refund if:</p>
      <ul>
        <li>The product arrives materially damaged or broken during transit (e.g. cracked ceramic mug, torn stitching).</li>
        <li>There is a verified manufacturing defect in the fabric, print peeling, or wrong colorway dispatched.</li>
        <li>The printed name or number does not match the specifications submitted in your verified order slip.</li>
      </ul>

      <h4>3. Evidence Required & Reporting Window</h4>
      <p>To report a valid complaint, please contact our support team on WhatsApp (+91 8106992102) or email <strong>printora256@gmail.com</strong> within <strong>48 hours of delivery</strong>. Please provide:</p>
      <ul>
        <li>Your Unique Order ID (e.g. PRN-20261104-XXXX).</li>
        <li>An unedited parcel unboxing video and clear, high-resolution photographs showing the defect or transit damage.</li>
      </ul>

      <h4>4. Refund Processing</h4>
      <p>Approved refunds are processed to your original UPI account or bank account within 3–5 working days of verification.</p>
    `
  },
  cancellation: {
    title: "Cancellation Policy",
    subtitle: "Production Milestones & Cancellation Rights",
    content: `
      <h4>1. Cancellation Before Production</h4>
      <p>You may cancel your order free of charge at any time before production commences (within 4 hours of placing the order or prior to your explicit approval of the digital printing proof). Upon cancellation, 100% of the paid amount is refunded.</p>

      <h4>2. Cancellation After Customization Begins</h4>
      <p>Once your artwork has been sent to digital thermal printing, fabric laser-cutting, or sublimation processing, cancellation is not possible due to the irreversible customized nature of personalized merchandise.</p>

      <h4>3. Cancellation After Dispatch</h4>
      <p>Orders that have been handed over to national courier partners cannot be cancelled or intercepted in transit.</p>
    `
  },
  customization: {
    title: "Customization & Personalization Policy",
    subtitle: "Artwork Quality, Proofing & Color Calibration Guidelines",
    content: `
      <h4>1. Artwork & Logo Submission Requirements</h4>
      <p>For crystal clear, sharp printing, customers are encouraged to upload vector files (.AI, .EPS, .SVG, .PDF) or high-resolution raster images (minimum 300 DPI, PNG with transparent background). PRINTORA is not responsible for pixelation or blurriness resulting from low-resolution customer-supplied screenshots.</p>

      <h4>2. Spelling, Names and Numbers</h4>
      <p>Please double-check the spelling of all custom player names, corporate designations, and jersey numbers in the order form. We print exactly what you enter. No alterations can be made once printing begins.</p>

      <h4>3. Color Representation & Monitor Variations</h4>
      <p>While we calibrate our sublimation and DTF printers to Pantone precision standards, subtle variations may occur between backlit RGB screens (smartphones/monitors) and physical CMYK/textile pigments on fabric.</p>
    `
  },
  about: {
    title: "About PRINTORA",
    subtitle: "Our Story, Craftsmanship & The 'Make It Yours' Philosophy",
    content: `
      <p class="text-base text-black font-medium leading-relaxed italic">
        "Printora is a personalized products and custom merchandise brand built around creativity, individuality and meaningful expression. From customized apparel and sports jerseys to personalized gifts, corporate merchandise and everyday essentials, we help individuals, teams and businesses bring their ideas to life. Our goal is to make customization simple, accessible and memorable."
      </p>

      <h4>Brand Philosophy: MAKE IT YOURS.</h4>
      <p>Founded with headquarters in Nizamabad, Telangana, PRINTORA was created to break away from mass-produced, generic merchandise. Whether you are a college cricket team gearing up for a championship with custom jerseys, a fast-growing startup onboarding new team members with premium executive diaries, or an individual searching for an unforgettable personalized keepsake for someone you love, PRINTORA crafts every single piece with bespoke attention.</p>

      <h4>Factory-Direct Partnerships & Quality Control</h4>
      <p>We work directly with specialized textile knitters and sublimation experts across Telangana, Hyderabad, and South India. Every fabric is bio-washed, pre-shrunk, and engineered for durable wear. Every ceramic mug and tumbler undergoes thermal stress testing. We handle client communication, proofing, and branding end-to-end to deliver international luxury standards right to your doorstep.</p>
    `
  },
  contact: {
    title: "Contact Us",
    subtitle: "Nizamabad Central Office & Pan-India Customer Support",
    content: `
      <div class="bg-[#FAF7F2] p-5 rounded-xl border border-[#DDD4C4] space-y-3 mb-6">
        <div>
          <strong class="text-black block text-sm">Official WhatsApp Business Desk:</strong>
          <a href="https://wa.me/918106992102" target="_blank" class="text-emerald-700 font-mono font-bold text-base hover:underline">+91 8106992102</a>
          <span class="text-[11px] text-[#777] block mt-0.5">Available Monday to Saturday: 9:30 AM – 8:30 PM IST</span>
        </div>

        <div>
          <strong class="text-black block text-sm">Official Support Email:</strong>
          <a href="mailto:printora256@gmail.com" class="text-[#997A52] font-semibold text-sm hover:underline">printora256@gmail.com</a>
        </div>

        <div>
          <strong class="text-black block text-sm">Instagram Community:</strong>
          <a href="https://www.instagram.com/printoracustom.in?vrfl=MXRwdDYyMWo3ajR0NA==" target="_blank" class="text-[#997A52] font-semibold text-sm hover:underline">@printoracustom.in</a>
        </div>

        <div>
          <strong class="text-black block text-sm">Operating Headquarters:</strong>
          <span class="text-[#444] text-xs">PRINTORA Custom Merch Studio, Nizamabad, Telangana 503001, India.</span>
        </div>
      </div>

      <p class="text-xs text-[#666]">Have a question regarding sizing, team orders, or bulk corporate branding? Drop us a WhatsApp message and our product concierge will assist you immediately.</p>
    `
  },
  faq: {
    title: "Frequently Asked Questions (FAQ)",
    subtitle: "Common Questions About Ordering, Jerseys & Customization",
    content: `
      <h4>Q: How does WhatsApp Ordering work?</h4>
      <p>A: When you configure your products and fill in your shipping address, clicking "Place Order" saves your order into our system with a unique Order ID and immediately opens your WhatsApp with the complete prefilled order summary. You simply tap 'Send' to connect directly with our desk. We reply with digital proofs and confirm your order!</p>

      <h4>Q: What is the price of the Custom Jersey?</h4>
      <p>A: Custom Jerseys start at only ₹499! This includes all-over dry-fit sublimation, your custom player name on back, jersey number, and front branding.</p>

      <h4>Q: What does "REQUEST A QUOTE" mean?</h4>
      <p>A: For bulk institutional products, corporate gift hampers, or specialized leather goods, prices vary depending on order volume, material GSM, and embroidery choices. We provide transparent wholesale quotations without hidden markups.</p>

      <h4>Q: How long does delivery take to Nizamabad and Pan-India?</h4>
      <p>A: Local Nizamabad orders take 1–2 days after production. Rest of Telangana & Pan-India deliveries take 2–5 days via express couriers.</p>

      <h4>Q: Can I order in bulk for my college fest or gym?</h4>
      <p>A: Yes! Visit our Bulk Orders section or tap the WhatsApp button. We fulfill bulk orders ranging from 25 to 5000+ units with official GST billing.</p>
    `
  }
};

export function renderPolicyModal() {
  return `
    <div id="policy-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div class="relative w-full max-w-2xl bg-white border border-[#DDD4C4] rounded-2xl shadow-2xl overflow-hidden my-8 animate-fade-in flex flex-col max-h-[85vh]">
        
        <!-- Header -->
        <div class="p-6 bg-[#111111] text-white flex items-center justify-between border-b border-[#222]">
          <div>
            <span class="text-[10px] text-[#C5A880] uppercase tracking-[0.25em] font-semibold" id="policy-modal-tag">PRINTORA LEGAL</span>
            <h3 class="font-serif text-2xl font-medium tracking-tight" id="policy-modal-title">Policy Title</h3>
            <p class="text-xs text-[#AAA] mt-0.5" id="policy-modal-subtitle">Policy Subtitle</p>
          </div>
          <button id="policy-modal-close-btn" class="text-[#AAA] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            ${renderIcon('close', 'w-5 h-5')}
          </button>
        </div>

        <!-- Content Area -->
        <div class="p-6 md:p-8 overflow-y-auto space-y-4 text-xs text-[#444] leading-relaxed policy-prose" id="policy-modal-body">
          <!-- Injected dynamically -->
        </div>

        <!-- Footer -->
        <div class="p-4 bg-[#F7F4EE] border-t border-[#E5DFD4] flex items-center justify-between text-xs">
          <span class="text-[#787673]">Brand: PRINTORA • Nizamabad, Telangana</span>
          <button type="button" onclick="document.getElementById('policy-modal-close-btn').click();" class="bg-[#111] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#C5A880] hover:text-black transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  `;
}

export function openPolicy(key) {
  const policy = POLICIES[key];
  if (!policy) return;

  const modal = document.getElementById('policy-modal');
  const title = document.getElementById('policy-modal-title');
  const subtitle = document.getElementById('policy-modal-subtitle');
  const body = document.getElementById('policy-modal-body');

  if (title) title.textContent = policy.title;
  if (subtitle) subtitle.textContent = policy.subtitle;
  if (body) body.innerHTML = policy.content;

  if (modal) modal.classList.remove('hidden');
}

export function initPolicyModalEvents() {
  const modal = document.getElementById('policy-modal');
  const closeBtn = document.getElementById('policy-modal-close-btn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  // Delegated close listener
  document.addEventListener('click', (e) => {
    if (e.target.closest('#policy-modal-close-btn') || e.target.id === 'policy-modal') {
      const m = document.getElementById('policy-modal');
      if (m) m.classList.add('hidden');
    }
  });

  // Hook all footer policy triggers
  document.querySelectorAll('[data-policy]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const policyKey = el.getAttribute('data-policy');
      openPolicy(policyKey);
    });
  });
}
