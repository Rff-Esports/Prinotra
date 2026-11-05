# ✦ PRINTORA — COMPLETE DEPLOYMENT & DOMAIN GUIDE
> **Domain:** `printoracustom.in`  
> **Registrar:** Spaceship  
> **Hosting:** Netlify (Free Plan)  
> **Database:** Supabase  
> **Official WhatsApp:** `+91 8106992102`  

---

## 1. Hosting on Netlify (100% Free Tier)

### Method A: Connect via GitHub (Recommended for automatic updates)
1. Push this `printora` folder to a private or public GitHub repository.
2. Sign in to [netlify.com](https://www.netlify.com) using your GitHub account.
3. Click **"Add new site"** → **"Import an existing project"** → Choose GitHub.
4. Select your `printora` repository.
5. In **Build Settings**:
   - **Build command:** `echo 'Static build ready'` (or leave blank)
   - **Publish directory:** `.` (root directory)
6. Click **"Deploy site"**. Netlify will provide a free live URL (e.g. `printora-custom.netlify.app`).

### Method B: Netlify Drag & Drop (Fastest 1-Click Launch)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `printora` project folder directly into the browser upload window.
3. Your website goes live worldwide in under 15 seconds!

---

## 2. Spaceship Domain & DNS Setup (`printoracustom.in`)

Configure your domain DNS inside your **Spaceship** control panel:

### Step 1: Open DNS Manager in Spaceship
1. Log in to [spaceship.com](https://www.spaceship.com) and go to **Domain Portfolio**.
2. Click on **`printoracustom.in`** and navigate to **DNS Records** (or Advanced DNS).

### Step 2: Add Netlify DNS Records
Add the following two records to link your domain:

| Type | Host / Name | Value / Target | TTL | Note |
|---|---|---|---|---|
| **A** | `@` (or blank) | `75.2.60.5` | Automatic / 300 | Netlify Load Balancer IP |
| **CNAME** | `www` | `printora-custom.netlify.app` *(replace with your site name)* | Automatic / 300 | Directs www to Netlify |

> **IMPORTANT:** Keep existing MX and TXT records (e.g. Google Workspace or Zoho Mail) completely intact if you are using custom email with this domain!

### Step 3: Add Domain in Netlify
1. In your Netlify dashboard, go to **Site configuration** → **Domain management**.
2. Click **"Add custom domain"** and enter `printoracustom.in`.
3. Netlify will detect your Spaceship DNS records and automatically provision a **free SSL/TLS Certificate** via Let's Encrypt.
4. Once verified, HTTPS will be active across both `https://printoracustom.in` and `https://www.printoracustom.in`.

---

## 3. Supabase Cloud Database Configuration

1. Log in to [supabase.com](https://supabase.com) and create a new project named `printora-production`.
2. Choose the nearest region: **South Asia (Mumbai) [ap-south-1]**.
3. Open the **SQL Editor** tab on the left sidebar.
4. Copy the entire contents of `supabase/schema.sql` and click **"Run"**.
5. All 22+ tables, indexes, enums, initial categories, product catalogue seed data, and RLS security policies will be created.
6. Go to **Project Settings** → **API**.
7. Copy:
   - **Project URL** (e.g. `https://xyzabc.supabase.co`)
   - **anon public key**
8. Open your live Printora website, navigate to `#admin` → **Store Settings**, paste the URL and Anon Key, and click **Save**.
9. Grant First Admin privileges to your account:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_UUID', 'admin')
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

---

## 4. Admin Access & Management

1. Access the Admin Dashboard at:  
   `https://printoracustom.in#admin` (or `/admin` via Netlify redirect).
2. **Features available without code editing:**
   - **Live Orders & 10-Status Lifecycle:** Track and update orders across 10 progressive statuses (`Order Placed`, `Payment Pending`, `Payment Confirmed`, `Artwork Verification`, `In Production`, `Quality Check`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`).
   - **Fulfillment Engine:** Assign orders to production dealers (Nizamabad, Hyderabad, Tirupur), log internal costs, enter courier tracking numbers.
   - **Product Manager:** Update customer prices, create new seasonal items, upload photos.
   - **Coupons Engine:** Create percentage or flat discounts with minimum cart values and expiry dates.
   - **Settings:** Modify WhatsApp number (`+91 8106992102`), Instagram handle (`@printora.gifts`), announcement banners, and Supabase credentials.

---

## 5. WhatsApp Business Notification Setup

### Method 1: Instant Click-to-Chat (Zero Setup / 100% Free)
- Ready out-of-the-box!
- When a customer clicks "Place Order & Send via WhatsApp", a prefilled, structured order message is delivered directly to `+91 8106992102`.
- No monthly fees, no verification needed.

### Method 2: Meta WhatsApp Cloud API (Automated Business Notification)
- To send automatic background WhatsApp messages directly to your phone without the user needing to click send:
  1. Register at [developers.facebook.com](https://developers.facebook.com).
  2. Create a Business App and enable **WhatsApp Business Cloud API**.
  3. Obtain your **Permanent Access Token** and **Phone Number ID**.
  4. Paste them into **Store Settings** (`#admin`).
  5. *Note: Meta provides 1,000 free service conversations per month; utility messages thereafter may incur nominal per-message Meta fees.*

---

## 6. Website Maintenance & Backups

- Orders placed by customers are permanently saved both locally in browser storage and in your Supabase PostgreSQL cloud database.
- Even if customer WhatsApp encounters connection drops, no order is ever lost.
- To update product photography or prices, log in to the `#admin` portal anytime.
