# ✦ PRINTORA — ULTIMATE MASTER MERCHANDISE PLATFORM
> **Tagline:** YOU IMAGINE. WE PRINT.  
> **Official Website:** [https://printoracustom.in](https://printoracustom.in)  
> **Official WhatsApp:** [+91 8106992102](https://wa.me/918106992102)  
> **Official Instagram:** [@printora.gifts](https://instagram.com/printora.gifts)  
> **Market:** India | **Currency:** INR (₹)  
> **Shipping Policy:** **FREE SHIPPING ON ALL ORDERS ACROSS INDIA — ZERO DELIVERY CHARGES (ALWAYS ₹0)**

---

## 1. Brand Identity & Design System
PRINTORA is a premium international fashion and personalized gifting brand identity.
- **Design Style:** Luxury minimalism, modern fashion aesthetic, clean product presentation, premium typography.
- **Color Palette:**
  - Black: `#111111`
  - White: `#FFFFFF`
  - Light Grey: `#F5F5F5`
  - Orange Accent: `#FF6B35`
  - Charcoal: `#202020`
- **Typography:** Space Grotesk, Manrope, Inter, Poppins, Playfair Display.

---

## 2. Master Product Catalogue & Confirmed Customer Prices (INR)

### APPAREL
| Product | Price | Specifications |
| :--- | :--- | :--- |
| **Round Neck T-shirt** | **₹499** | 100% bio-washed super-combed cotton, 180 GSM |
| **Premium T-shirt** | **₹599** | 220 GSM heavyweight luxury single-jersey |
| **Oversized T-shirt** | **₹799** | 240 GSM drop-shoulder boxy streetwear cut |
| **Polo T-shirt** | **₹599** | 230 GSM honeycomb pique knit |
| **Hoodie** | **₹949** | 320 GSM heavy brushed fleece |
| **Custom Jersey** | **₹499** | Full sublimation dry-fit honeycomb, custom player name & number |
| **Cap** | **₹399** | 6-panel structured cotton twill with metal slider buckle |

### GIFTS
| Product | Price | Specifications |
| :--- | :--- | :--- |
| **Coffee Mug** | **₹299** | 325ml Grade-A ceramic with vibrant sublimation |
| **Magic Mug** | **₹399** | Heat-sensitive color reveal ceramic mug |
| **500ml Tumbler** | **₹549** | Double-wall vacuum insulated 304 stainless steel |
| **Photo Frame** | **₹499** | Solid wood finish frame with archival matte print |
| **Gift Box** | **Starting ₹799** | Handcrafted rigid magnetic keepsake box with ribbon |

### BAGS AND ACCESSORIES
| Product | Price | Specifications |
| :--- | :--- | :--- |
| **Tote Bag** | **₹449** | 340 GSM heavy natural canvas |
| **Notebook** | **₹429** | 100 GSM acid-free unruled/ruled journal |
| **Stickers** | **Starting ₹299** | Matte waterproof precision die-cut vinyl sticker sheets |

### ADDITIONAL CATEGORIES (Quotation-Based or Coming Soon)
- **Bags:** Gym Bags, Laptop Bags, Jute Bags, Rucksack Bags, Backpacks (`Contact for Price` / `Coming Soon`)
- **Drinkware:** Flask Bottles, Steel Bottles, Sippers (`Contact for Price`)
- **Personalized Gifts:** Wallets, Cushions, Keychains, Diaries, Stationery, Acrylic Photo Frames (`Contact for Price`)
- **Corporate & Business:** ID Cards, Transparent ID Cards, Visiting Cards, Letterheads, Welcome Gift Sets (`Contact for Price`)
- **Tech Accessories:** Phone Cases, Laptop Sleeves, Desk Mats (`Contact for Price`)

> **Anti-Price-Invention Guarantee:** No placeholder prices are invented. Confirmed prices are strictly enforced across store, database, cart, checkout, and WhatsApp order messages.

---

## 3. Free Delivery Guarantee — Strict Business Rule
- **Shipping charges:** **₹0** across all orders in India.
- **No minimum order threshold** required for free delivery.
- Checkout Calculation:
  $$\text{Subtotal} = \sum (\text{Product Price} \times \text{Quantity})$$
  $$\text{Discount} = \text{Valid Coupon Discount}$$
  $$\text{Shipping} = \text{₹0}$$
  $$\text{Final Total} = \text{Subtotal} - \text{Discount}$$

---

## 4. Key Architectural Features

### A. Real Interactive 360-Degree Three.js Product Viewer
- **Engine:** Three.js with OrbitControls.
- **Supported Garments:** Round Neck T-shirt, Oversized T-shirt, Polo T-shirt, Hoodie, and Custom Jersey.
- **Interactivity:**
  - 360° mouse drag / mobile touch rotation.
  - Smooth camera presets (Front, Back, Left, Right, Reset).
  - Dynamic canvas texture mapping (instant name, jersey number, and uploaded graphic rendering).
  - Realistic fabric lighting, shadows, and color changer.
  - Automatic 2D canvas fallback for non-WebGL devices.

### B. Advanced Customization Studio
- **12 Live Google Fonts:** Inter, Poppins, Montserrat, Bebas Neue, Oswald, Playfair Display, Roboto, Anton, Dancing Script, Pacifico, Space Grotesk, Manrope.
- **Controls:** Real-time text preview on garment, font picker, font color, size slider, rotation slider, text alignment, artwork/logo uploader, front/back customization toggle, undo/redo/reset history, and saved designs.

### C. Custom Jersey Designer
- Full athletic customization with custom player name, jersey number, team crest, sponsor graphics, and collar styles. Instant rendering on 3D/2D jersey.

### D. Customer Authentication (OTP Based)
- Email OTP and Indian Phone OTP (+91).
- 6-digit auto-advancing input fields with countdown timer and resend protection.
- Session persistence and customer dashboard access.

### E. Indian Address Verification & GPS Geolocation
- PIN code auto-fill via Postal API (`api.postalpincode.in`) populating District, State, and Post Office.
- "Use My Current Location" button using HTML5 Geolocation with reverse geocoding fallback.

### F. Complete Order Lifecycle & Tracking
10 distinct order statuses tracked in real time:
1. `Order Placed`
2. `Payment Pending`
3. `Payment Confirmed`
4. `Artwork Verification`
5. `In Production`
6. `Quality Check`
7. `Shipped`
8. `Out for Delivery`
9. `Delivered`
10. `Cancelled`

### G. Pre-Saved WhatsApp Order Routing
Orders are assigned a unique tracking ID (e.g. `PRN-ORD-XXXXX`) and saved to local/Supabase storage before opening WhatsApp, ensuring zero order drop-offs.

### H. Comprehensive Admin Dashboard (`#admin`)
- Real-time revenue metrics and order analytics.
- 10-status order status workflow dropdown with customer notification preview.
- Product catalogue manager with price editing.
- Coupon engine with discount percentage/flat rules and usage limits.
- Supplier assignment and fulfillment logging.
- Supabase First Admin Setup modal.

---

## 5. Getting Started & Running Locally

The project runs natively with modern ES Modules and zero external npm dependencies required to preview:

```bash
# 1. Open the project directory
cd C:\Users\Manireddy\.gemini\antigravity\scratch\printora

# 2. Start the local server
node server.js
```

Then visit:
- **Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard:** [http://localhost:3000#admin](http://localhost:3000#admin)
- **3D Customizer Studio:** [http://localhost:3000#customize](http://localhost:3000#customize)
- **Custom Jersey Studio:** [http://localhost:3000#custom-jersey](http://localhost:3000#custom-jersey)
- **Corporate & Bulk Orders:** [http://localhost:3000#bulk-orders](http://localhost:3000#bulk-orders)

---

## 6. Supabase Database Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire SQL script from [`supabase/schema.sql`](file:///C:/Users/Manireddy/.gemini/antigravity/scratch/printora/supabase/schema.sql).
4. Copy your **Supabase URL** and **Anon Key** into `src/services/supabase.js`.
5. Run the First Admin grant query in SQL Editor:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_UUID', 'admin')
   ON CONFLICT (user_id, role) DO NOTHING;
   ```
