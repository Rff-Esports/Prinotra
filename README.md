# ✦ PRINTORA — MASTER E-COMMERCE PLATFORM
> **Tagline:** MAKE IT YOURS.  
> **Website:** https://printoracustom.in  
> **Official WhatsApp:** [+91 8106992102](https://wa.me/918106992102)  
> **Official Instagram:** [@printoracustom.in](https://instagram.com/printoracustom.in) & [@printora.gifts](https://instagram.com/printora.gifts)  
> **HQ:** Nizamabad, Telangana, India  

---

## 1. Brand Identity & Overview
**PRINTORA** is an established, international-grade luxury personalized products and corporate merchandise brand. Built around minimal, modern aesthetics (Black `#0A0A0A`, Crisp White, Sand Beige `#F7F4EE`, Warm Grey), PRINTORA caters to individual customizers, university sports squads, corporate tech teams, and fitness organizations.

### Key Business Architecture:
- **Instant WhatsApp Ordering:** Every checkout formats an itemized, elegant order record directly to your business WhatsApp (+91 8106992102).
- **Interactive Live Jersey Customizer:** Real-time 3D/2D visualizer allowing live name, number, team crest, and front/back design options at **₹499**.
- **Admin & Dealer Fulfillment Engine:** Admin assigns orders to production hubs (Nizamabad, Hyderabad, Tirupur), logs private supplier costs, tracks couriers, and enforces strict white-label Printora packaging.
- **Genuine Pricing & Strict Anti-Invention Rule:** Confirmed prices are strictly displayed; unconfirmed items clearly display **"REQUEST A QUOTE"**.

---

## 2. Product Catalogue & Selling Prices (INR)

### A. APPAREL
- **Round Neck T-shirt:** ₹499 *(100% bio-washed super-combed cotton, 180 GSM)*
- **Premium T-shirt:** ₹599 *(220 GSM heavyweight luxury single-jersey)*
- **Oversized T-shirt:** ₹799 *(240 GSM drop-shoulder boxy streetwear cut)*
- **Polo T-shirt:** ₹599 *(230 GSM honeycomb pique knit)*
- **Hoodie:** ₹949 *(320 GSM heavy brushed fleece)*
- **Custom Caps:** ₹399 *(6-panel structured cotton twill)*
- **Sweatshirts:** `REQUEST A QUOTE`
- **Tank Tops:** `REQUEST A QUOTE`

### B. SPORTSWEAR
- **Custom Jerseys:** ₹499 *(Full sublimation dry-fit honeycomb, custom name, jersey #, team crest)*
- **Team Jerseys:** ₹499 *(Multi-player team kit rosters)*
- **Sports T-shirts:** ₹499 *(Micro-poly activewear)*
- **Customized Team Uniforms:** `REQUEST A QUOTE`

### C. BAGS
- **Tote Bag:** ₹449 *(340 GSM heavy natural canvas)*
- **Gym Bags:** `REQUEST A QUOTE`
- **Laptop Bags:** `REQUEST A QUOTE`
- **Jute Bags:** `REQUEST A QUOTE`
- **Rucksack Bags:** `REQUEST A QUOTE`
- **Backpacks:** `REQUEST A QUOTE`

### D. DRINKWARE
- **Coffee Mug:** ₹299 *(325ml Grade-A ceramic)*
- **Personalized Mugs:** ₹299 *(Photo collage wrap)*
- **Magic Mug:** ₹399 *(Heat-sensitive reveal)*
- **Tumbler 500ml:** ₹549 *(Double-wall insulated 304 steel)*
- **Flask Bottles:** `REQUEST A QUOTE`
- **Steel Bottles:** `REQUEST A QUOTE`
- **Sippers:** `REQUEST A QUOTE`

### E. PERSONALIZED GIFTS
- **Photo Frame:** ₹399 *(Wood finish with archival matte print)*
- **Gift Boxes:** ₹699 onwards *(Rigid magnetic keepsake)*
- **Personalized Wallets:** `REQUEST A QUOTE`
- **Keychains:** `REQUEST A QUOTE`
- **Cushions & Pillows:** `REQUEST A QUOTE`
- **Acrylic Photo Frames:** `REQUEST A QUOTE`
- **Posters:** `REQUEST A QUOTE`
- **Personalized Accessories:** `REQUEST A QUOTE`

### F. STATIONERY
- **Notebook:** ₹329 *(100 GSM acid-free unruled/ruled journal)*
- **Corporate Diary:** ₹399 *(PU leather casebound with pen loop)*
- **Stickers:** ₹199 onwards *(Matte waterproof vinyl)*
- **Diaries, Pens, Office Stationery:** `REQUEST A QUOTE`

### G. CORPORATE & BUSINESS
- **Customized T-shirts:** ₹499 onwards *(Staff uniforms & hackathon drops)*
- **Transparent ID Cards with Wearable Tags:** `REQUEST A QUOTE`
- **ID Cards, Visiting Cards, Letterheads, Folders, Welcome Gift Sets:** `REQUEST A QUOTE`

### H. TECH ACCESSORIES
- **Phone Cases, Laptop Sleeves, Desk Mats:** `REQUEST A QUOTE`

---

## 3. How to Run Locally

This application is built with modern ES Modules and has **zero required external npm dependencies** to run locally.

### Start Development Server:
```bash
# In the project directory:
node server.js
```
Then open your browser to:
- **Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard:** [http://localhost:3000#admin](http://localhost:3000#admin)
- **Custom Jersey Studio:** [http://localhost:3000#custom-jersey](http://localhost:3000#custom-jersey)
- **Bulk Orders:** [http://localhost:3000#bulk-orders](http://localhost:3000#bulk-orders)

---

## 4. WhatsApp Order Notification Flow

1. Customer adds items with sizes, colors, custom text, and uploaded logos to bag.
2. At checkout, customer inputs delivery address (Nizamabad, Telangana or anywhere in India).
3. The platform generates a unique order ID: `PRN-YYYYMMDD-XXXX`.
4. Order is saved locally & synchronized to Supabase table `orders`.
5. **Method 1 (Click-to-chat):** Automatically formats the order message and opens WhatsApp directly to `+91 8106992102`.
6. **Method 2 (Cloud API):** If configured in Admin Settings, dispatches a business webhook notification via the official Meta WhatsApp Cloud API.

---

## 5. Supabase Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository and run the entire script.
4. It will create all tables (`products`, `categories`, `orders`, `order_items`, `bulk_enquiries`, `suppliers`, `supplier_assignments`, `store_settings`) with proper Row Level Security (RLS) policies.
5. In your Printora Store (`#admin` -> Store Settings), enter your **Project URL** and **Anon Key**.

---

## 6. Netlify Deployment & Spaceship DNS Guide
See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for full step-by-step instructions.
