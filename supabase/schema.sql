-- ==============================================================================
-- PRINTORA - Master Database Schema & Initial Data
-- Brand: PRINTORA ("MAKE IT YOURS.")
-- Website: https://printoracustom.in
-- Target: Supabase PostgreSQL with Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM (
        'Pending',
        'Confirmed',
        'Processing',
        'Ready for Dispatch',
        'Shipped',
        'Delivered',
        'Cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE bulk_enquiry_status_type AS ENUM (
        'New',
        'Reviewing',
        'Quote Sent',
        'In Production',
        'Completed',
        'Closed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    price NUMERIC(10, 2), -- NULL when "REQUEST A QUOTE"
    is_quote_only BOOLEAN DEFAULT FALSE,
    is_starting_price BOOLEAN DEFAULT FALSE, -- e.g. "₹199 onwards"
    sale_price NUMERIC(10, 2),
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    available_sizes JSONB DEFAULT '[]'::jsonb,
    available_colors JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    customization_supported BOOLEAN DEFAULT TRUE,
    customization_options JSONB DEFAULT '{"allowName": true, "allowNumber": false, "allowLogo": true, "allowNotes": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_email VARCHAR(255),
    shipping_house VARCHAR(255) NOT NULL,
    shipping_area VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_pincode VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) DEFAULT 'India',
    special_instructions TEXT,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping_charge NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status order_status_type DEFAULT 'Pending',
    whatsapp_notified BOOLEAN DEFAULT FALSE,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    custom_name VARCHAR(100),
    custom_number VARCHAR(50),
    custom_notes TEXT,
    artwork_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SUPPLIERS TABLE (FULFILLMENT DEALERS)
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

-- 8. SUPPLIER ASSIGNMENTS (Admin Private Fulfillment Tracking)
CREATE TABLE IF NOT EXISTS supplier_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE RESTRICT,
    private_supplier_cost NUMERIC(10, 2), -- Never exposed to client
    supplier_notes TEXT,
    tracking_number VARCHAR(100),
    courier_partner VARCHAR(100),
    dispatched_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'Assigned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. BULK ENQUIRIES TABLE
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

-- 10. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS store_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'primary',
    brand_name VARCHAR(100) DEFAULT 'PRINTORA',
    tagline VARCHAR(100) DEFAULT 'MAKE IT YOURS.',
    whatsapp_number VARCHAR(30) DEFAULT '+91 8106992102',
    instagram_handle VARCHAR(100) DEFAULT '@printoracustom.in',
    support_email VARCHAR(100) DEFAULT 'support@printoracustom.in',
    business_location VARCHAR(255) DEFAULT 'Nizamabad, Telangana, India',
    shipping_flat_fee NUMERIC(10, 2) DEFAULT 60.00,
    free_shipping_threshold NUMERIC(10, 2) DEFAULT 999.00,
    announcement_banner TEXT DEFAULT '✦ Custom Apparel & Merch for Individuals & Teams • Free Pan-India Delivery on orders over ₹999 ✦',
    whatsapp_cloud_api_token TEXT,
    whatsapp_phone_number_id TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public can read products, categories, store_settings
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (is_available = true);
CREATE POLICY "Public Read Store Settings" ON store_settings FOR SELECT USING (true);

-- Public can insert new orders & order items & bulk enquiries
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Bulk Enquiries" ON bulk_enquiries FOR INSERT WITH CHECK (true);

-- Authenticated Admin can perform all operations
CREATE POLICY "Admin All Categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Order Items" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Suppliers" ON suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Supplier Assignments" ON supplier_assignments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Bulk Enquiries" ON bulk_enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Store Settings" ON store_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. INITIAL SEED DATA
INSERT INTO store_settings (id, brand_name, tagline, whatsapp_number, instagram_handle, business_location)
VALUES ('primary', 'PRINTORA', 'MAKE IT YOURS.', '+91 8106992102', '@printoracustom.in', 'Nizamabad, Telangana, India')
ON CONFLICT (id) DO NOTHING;

-- Seed Categories
INSERT INTO categories (id, slug, name, description, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'apparel', 'Apparel', 'Everyday customized style crafted from breathable premium combed cotton.', 1),
('c1000000-0000-0000-0000-000000000002', 'sportswear', 'Sportswear', 'High performance moisture-wicking jerseys engineered for athletes and teams.', 2),
('c1000000-0000-0000-0000-000000000003', 'bags', 'Bags', 'Durable, minimal and functional bags customized for gym, college and work.', 3),
('c1000000-0000-0000-0000-000000000004', 'drinkware', 'Drinkware', 'Ceramic mugs, stainless steel flasks and thermal tumblers with vivid prints.', 4),
('c1000000-0000-0000-0000-000000000005', 'personalized-gifts', 'Personalized Gifts', 'Memorable personalized gifts for birthdays, anniversaries and special moments.', 5),
('c1000000-0000-0000-0000-000000000006', 'stationery', 'Stationery', 'Premium journals, diaries and precision laser stickers tailored to your brand.', 6),
('c1000000-0000-0000-0000-000000000007', 'corporate-merchandise', 'Corporate & Business', 'Custom branded merchandise and professional identity kits for modern enterprises.', 7),
('c1000000-0000-0000-0000-000000000008', 'tech-accessories', 'Tech Accessories', 'Impact-resistant phone cases and sleek laptop sleeves personalized for you.', 8)
ON CONFLICT (slug) DO NOTHING;

-- Seed Suppliers
INSERT INTO suppliers (id, name, contact_person, phone, email, city, specialization) VALUES
('s1000000-0000-0000-0000-000000000001', 'Printora Nizamabad Central Hub', 'Production Lead', '+91 8106992102', 'production@printoracustom.in', 'Nizamabad', 'Local fast-turnaround DTF apparel & ceramic mugs'),
('s1000000-0000-0000-0000-000000000002', 'Deccan Sublimation Works', 'Ramesh K.', '+91 9440012345', 'deccan.sublimation@example.com', 'Hyderabad', 'Custom Sportswear, Sublimation Team Jerseys'),
('s1000000-0000-0000-0000-000000000003', 'Tirupur Knitwear & Textile Partner', 'Suresh V.', '+91 9842011223', 'tirupur.partner@example.com', 'Tirupur', 'Bulk Oversized T-shirts, Hoodies & Sweatshirts')
ON CONFLICT DO NOTHING;
