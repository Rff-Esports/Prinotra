-- ==============================================================================
-- PRINTORA – ULTIMATE MASTER DATABASE SCHEMA & MIGRATIONS
-- Brand: PRINTORA ("YOU IMAGINE. WE PRINT.")
-- Official Domain: https://printoracustom.in
-- Target: Supabase PostgreSQL with Full Row Level Security (RLS)
-- Includes all 22+ specified tables, constraints, indexes & RLS policies
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('customer', 'admin', 'super_admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM (
        'Order Placed',
        'Payment Pending',
        'Payment Confirmed',
        'Artwork Verification',
        'In Production',
        'Quality Check',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE bulk_enquiry_status_type AS ENUM (
        'New', 'Reviewing', 'Quote Sent', 'In Production', 'Completed', 'Closed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(30) UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. USER ROLES TABLE (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_type DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    hero_image TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    price NUMERIC(10, 2), -- Confirmed price in INR (NULL = Contact for Price)
    original_price NUMERIC(10, 2),
    is_quote_only BOOLEAN DEFAULT FALSE,
    is_starting_price BOOLEAN DEFAULT FALSE, -- e.g. "₹299 onwards"
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    available_sizes JSONB DEFAULT '[]'::jsonb,
    available_colors JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    view_type VARCHAR(50) DEFAULT 'front', -- front, back, side, lifestyle, closeup
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    size VARCHAR(50) NOT NULL,
    color VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20),
    stock_quantity INT DEFAULT 100,
    price_override NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CUSTOMIZATION OPTIONS TABLE
CREATE TABLE IF NOT EXISTS customization_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    allow_custom_name BOOLEAN DEFAULT TRUE,
    allow_custom_number BOOLEAN DEFAULT FALSE,
    allow_logo_upload BOOLEAN DEFAULT TRUE,
    allow_special_notes BOOLEAN DEFAULT TRUE,
    placement_zones JSONB DEFAULT '["Center Chest", "Left Chest", "Full Back"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. SAVED DESIGNS TABLE
CREATE TABLE IF NOT EXISTS saved_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    design_data JSONB NOT NULL,
    preview_thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. CARTS TABLE
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    custom_name VARCHAR(100),
    custom_number VARCHAR(50),
    custom_notes TEXT,
    front_design_data JSONB,
    back_design_data JSONB,
    artwork_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 14. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(wishlist_id, product_id)
);

-- 15. ADDRESSES TABLE (Indian Postal Schema)
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    house_flat VARCHAR(255) NOT NULL,
    street_area VARCHAR(255) NOT NULL,
    landmark VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- 'percent' or 'fixed'
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount_amount NUMERIC(10, 2),
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    usage_limit INT,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. ORDERS TABLE (Strict ₹0 Free Shipping)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_email VARCHAR(255),
    shipping_house VARCHAR(255) NOT NULL,
    shipping_area VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_district VARCHAR(100),
    shipping_state VARCHAR(100) NOT NULL,
    shipping_pincode VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) DEFAULT 'India',
    special_instructions TEXT,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping_charge NUMERIC(10, 2) NOT NULL DEFAULT 0, -- Strict Business Rule: ALWAYS 0
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status order_status_type DEFAULT 'Order Placed',
    payment_method VARCHAR(100) DEFAULT 'Online (UPI / Cards)',
    payment_status VARCHAR(100) DEFAULT 'Payment Confirmed',
    whatsapp_notified BOOLEAN DEFAULT FALSE,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    size VARCHAR(50),
    color VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. ORDER CUSTOMIZATIONS TABLE
CREATE TABLE IF NOT EXISTS order_customizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    custom_name VARCHAR(100),
    custom_number VARCHAR(50),
    sponsor_text VARCHAR(150),
    front_design_details JSONB,
    back_design_details JSONB,
    artwork_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_gateway VARCHAR(50) DEFAULT 'Razorpay', -- Razorpay, UPI, Direct WhatsApp
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'Success',
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_text TEXT NOT NULL,
    is_verified_buyer BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    warehouse_location VARCHAR(100) DEFAULT 'Nizamabad Central Hub',
    stock_count INT DEFAULT 100,
    reserved_count INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 23. SHIPPING DETAILS & TRACKING TABLE
CREATE TABLE IF NOT EXISTS shipping_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    courier_partner VARCHAR(100), -- DTDC, Delhivery, BlueDart, Express Post
    tracking_number VARCHAR(100),
    tracking_url TEXT,
    dispatched_at TIMESTAMP WITH TIME ZONE,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    current_status VARCHAR(100) DEFAULT 'Order Placed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 24. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'order_status', 'shipping_update', 'promo'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 25. ADMIN ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(150) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 26. SUPPLIERS TABLE (Manufacturing Hubs)
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    city VARCHAR(100),
    specialization VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 27. SUPPLIER ASSIGNMENTS (Private Admin Tracking)
CREATE TABLE IF NOT EXISTS supplier_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE RESTRICT,
    private_supplier_cost NUMERIC(10, 2), -- Never exposed to public client
    supplier_notes TEXT,
    tracking_number VARCHAR(100),
    courier_partner VARCHAR(100),
    dispatched_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'Assigned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 28. BULK ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS bulk_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    product_category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    customization_details TEXT NOT NULL,
    target_delivery_date DATE,
    artwork_url TEXT,
    status bulk_enquiry_status_type DEFAULT 'New',
    admin_quote NUMERIC(10, 2),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 29. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS store_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'primary',
    brand_name VARCHAR(100) DEFAULT 'PRINTORA',
    tagline VARCHAR(100) DEFAULT 'YOU IMAGINE. WE PRINT.',
    whatsapp_number VARCHAR(30) DEFAULT '+91 8106992102',
    instagram_handle VARCHAR(100) DEFAULT '@printora.gifts',
    support_email VARCHAR(100) DEFAULT 'support@printoracustom.in',
    business_location VARCHAR(255) DEFAULT 'India (Free Pan-India Delivery)',
    shipping_flat_fee NUMERIC(10, 2) DEFAULT 0.00,
    free_shipping_threshold NUMERIC(10, 2) DEFAULT 0.00,
    announcement_banner TEXT DEFAULT 'FREE SHIPPING ACROSS INDIA – NO DELIVERY CHARGES!',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 30. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check if user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = $1 AND user_roles.role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Select Policies
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (is_available = true);
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Product Variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public Read Customization Options" ON customization_options FOR SELECT USING (true);
CREATE POLICY "Public Read Store Settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT USING (is_active = true);

-- Customer Protected Policies
CREATE POLICY "User Own Profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "User Own Saved Designs" ON saved_designs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User Own Addresses" ON addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User Own Carts" ON carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User Own Cart Items" ON cart_items FOR ALL USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
);
CREATE POLICY "User Own Wishlists" ON wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User Own Wishlist Items" ON wishlist_items FOR ALL USING (
    wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid())
);
CREATE POLICY "User Own Notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Order Placement Policies (Public / Authenticated can insert)
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Customizations" ON order_customizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Bulk Enquiries" ON bulk_enquiries FOR INSERT WITH CHECK (true);

-- User can view own orders
CREATE POLICY "User Read Own Orders" ON orders FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() IS NULL
);

-- Admin Global Privileges
CREATE POLICY "Admin Global All Categories" ON categories FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admin Global All Products" ON products FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admin Global All Orders" ON orders FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admin Global All Suppliers" ON suppliers FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admin Global All Assignments" ON supplier_assignments FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admin Global All Bulk Enquiries" ON bulk_enquiries FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admin Global All Coupons" ON coupons FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admin Global All Activity Logs" ON admin_activity_logs FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- ==============================================================================
-- 31. SEED DATA (Exact Customer-Facing Prices Specified in Section 6)
-- ==============================================================================
INSERT INTO store_settings (id, brand_name, tagline, whatsapp_number, instagram_handle, support_email, shipping_flat_fee, free_shipping_threshold, announcement_banner)
VALUES ('primary', 'PRINTORA', 'YOU IMAGINE. WE PRINT.', '+91 8106992102', '@printora.gifts', 'support@printoracustom.in', 0.00, 0.00, 'FREE SHIPPING ACROSS INDIA – NO DELIVERY CHARGES!')
ON CONFLICT (id) DO UPDATE SET
  tagline = 'YOU IMAGINE. WE PRINT.',
  instagram_handle = '@printora.gifts',
  shipping_flat_fee = 0.00,
  free_shipping_threshold = 0.00,
  announcement_banner = 'FREE SHIPPING ACROSS INDIA – NO DELIVERY CHARGES!';

-- Seed Categories
INSERT INTO categories (id, slug, name, description, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'apparel', 'Apparel', '100% bio-washed combed cotton customized T-shirts and hoodies.', 1),
('c1000000-0000-0000-0000-000000000002', 'sportswear', 'Sportswear', 'High performance moisture-wicking dry-fit sublimation team jerseys.', 2),
('c1000000-0000-0000-0000-000000000003', 'bags', 'Bags & Totes', 'Canvas totes, tech backpacks and minimalist travel bags.', 3),
('c1000000-0000-0000-0000-000000000004', 'drinkware', 'Drinkware', 'Ceramic mugs, color-changing magic mugs and insulated tumblers.', 4),
('c1000000-0000-0000-0000-000000000005', 'personalized-gifts', 'Personalized Gifts', 'Timeless archival photo frames, curated keepsake gift boxes and engraved accessories.', 5),
('c1000000-0000-0000-0000-000000000006', 'stationery', 'Stationery', 'Debossed corporate notebooks, hardbound diaries and precision vinyl stickers.', 6),
('c1000000-0000-0000-0000-000000000007', 'corporate-merchandise', 'Corporate & Business', 'Turnkey executive identity kits and event merchandise.', 7)
ON CONFLICT (slug) DO NOTHING;

-- Seed Exact Customer-Facing Products (Section 6 Strictly Enforced)
INSERT INTO products (id, slug, name, subtitle, description, price, original_price, is_quote_only, is_starting_price, is_featured, is_available) VALUES
('p1000000-0000-0000-0000-000000000001', 'round-neck-t-shirt', 'Round Neck T-shirt', '100% Super-Combed Cotton • 180 GSM', 'Our signature classic crewneck crafted from 100% bio-washed super-combed cotton.', 499.00, 699.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000002', 'premium-t-shirt', 'Premium T-shirt', '220 GSM Heavyweight Luxury Cotton', 'Tailored luxury essential constructed from heavyweight single-jersey cotton.', 599.00, 899.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000003', 'oversized-t-shirt', 'Oversized T-shirt', '240 GSM Boxy Drop-Shoulder Streetwear Fit', 'Contemporary streetwear drop-shoulder fit with relaxed drape.', 799.00, 1199.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000004', 'polo-t-shirt', 'Polo T-shirt', '240 GSM Heavy Pique Knit with Collar Placket', 'Classic semi-formal polo with ribbed folded collar.', 599.00, 899.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000005', 'hoodie', 'Hoodie', '350 GSM Brushed Fleece Winterwear', 'Heavyweight cotton-rich fleece pullover hoodie with kangaroo pouch.', 949.00, 1399.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000006', 'custom-jersey', 'Custom Jersey', 'Honeycomb Dry-Fit Moisture-Wicking Mesh', 'Pro team sublimation jersey with player name, lucky number and team badges.', 499.00, 799.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000007', 'cap', 'Cap', 'Embroidered Structured Cotton Twill Cap', 'Six-panel premium structured baseball cap with brass buckle adjuster.', 399.00, 599.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000008', 'coffee-mug', 'Coffee Mug', '325ml Grade-A Glossy Ceramic Mug', 'Microwave and dishwasher safe artisan glossy ceramic mug with vibrant sublimation printing.', 299.00, 449.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000009', 'magic-mug', 'Magic Mug', 'Heat-Activated Thermal Color Changing Ceramic', 'Thermodynamic matte black ceramic mug that reveals hidden personalized photos upon pouring hot liquid.', 399.00, 599.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000010', '500ml-tumbler', '500ml Tumbler', 'Vacuum-Insulated Double-Walled Stainless Steel', 'Keeps beverages 24h cold and 12h hot. Customized with precision laser engraving.', 549.00, 799.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000011', 'photo-frame', 'Photo Frame', 'Solid Wood Finish with Archival Matte Print', 'Minimalist wooden tabletop and wall frame with textured 260 GSM photo art paper.', 499.00, 699.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000012', 'gift-box', 'Gift Box', 'Custom Curated Rigid Keepsake Box with Ribbon', 'Handcrafted magnetic-closure rigid gift box with debossed branding.', 799.00, 1199.00, FALSE, TRUE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000013', 'tote-bag', 'Tote Bag', 'Heavyweight 380 GSM Natural Canvas Bag', 'Sustainable heavy-duty canvas tote with reinforced box-stitched handles.', 449.00, 649.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000014', 'notebook', 'Notebook', 'Softbound / Spiral Wire-O Journal • 100 GSM Paper', 'Versatile creative notebook with ink-bleed-resistant unruled or dotted sheets.', 429.00, 599.00, FALSE, FALSE, TRUE, TRUE),
('p1000000-0000-0000-0000-000000000015', 'stickers', 'Stickers', 'Precision Die-Cut Waterproof Vinyl Stickers', 'Waterproof, weatherproof, and UV-resistant matte vinyl stickers.', 299.00, 399.00, FALSE, TRUE, TRUE, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price;

-- Seed Default Discount Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, is_active) VALUES
('PRINTORA50', 'fixed', 50.00, 499.00, TRUE),
('WELCOME10', 'percent', 10.00, 0.00, TRUE),
('BULK20', 'percent', 20.00, 2499.00, TRUE)
ON CONFLICT (code) DO NOTHING;
