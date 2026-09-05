-- ============================================================================
-- MediCare Plus India — CDSCO Compliant PostgreSQL Database Schema
-- Optimized for 100% Free Tiers (Supabase / Neon / Local PostgreSQL)
-- ============================================================================

-- 1. Master Formulations & Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(128) NOT NULL DEFAULT 'MediCare Plus',
    generic_name VARCHAR(255),
    active_ingredient VARCHAR(255),
    category VARCHAR(64) NOT NULL, -- 'prescription', 'supplement', 'medical-device', 'ayurvedic', 'otc'
    dosage_form VARCHAR(64), -- 'Tablet', 'Softgel', 'Capsule', 'Liquid', 'Device'
    strength VARCHAR(64), -- '40mg', '60,000 IU', '1000mg'
    pack_size VARCHAR(64) NOT NULL, -- 'Strip of 15 Tablets', 'Bottle of 60 Softgels'
    mrp_inr NUMERIC(10, 2) NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    discount_pct INTEGER DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 100,
    requires_prescription BOOLEAN DEFAULT FALSE,
    prescription_type VARCHAR(64), -- 'Schedule H', 'Schedule H1', 'OTC'
    storage_condition VARCHAR(128) DEFAULT 'Controlled Ambient (15°C-25°C)',
    is_cold_chain BOOLEAN DEFAULT FALSE,
    rating NUMERIC(2, 1) DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 120,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customer & Patient Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    shipping_street TEXT NOT NULL,
    shipping_city VARCHAR(128) NOT NULL,
    shipping_state VARCHAR(128) NOT NULL,
    shipping_pincode VARCHAR(16) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(64) NOT NULL, -- 'UPI (Google Pay)', 'Credit Card (RuPay)', 'Cash on Delivery'
    payment_status VARCHAR(32) DEFAULT 'Paid', -- 'Pending', 'Paid', 'Failed'
    status VARCHAR(32) DEFAULT 'Verified', -- 'Verified', 'Dispensing', 'Dispatched', 'Delivered'
    is_cold_chain BOOLEAN DEFAULT FALSE,
    current_payload_temp VARCHAR(16) DEFAULT 'Ambient',
    delivery_otp VARCHAR(8) NOT NULL,
    tracking_number VARCHAR(64) NOT NULL,
    prescription_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- 4. CDSCO Schedule H Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(64) PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    patient_age INTEGER NOT NULL,
    patient_gender VARCHAR(16) NOT NULL,
    patient_phone VARCHAR(32) NOT NULL,
    shipping_city VARCHAR(128) NOT NULL,
    shipping_pincode VARCHAR(16) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    doctor_reg_no VARCHAR(64) NOT NULL, -- e.g. MMC-2004-49102, DMC-2011-88219
    clinic_hospital VARCHAR(255) NOT NULL,
    date_issued DATE NOT NULL,
    valid_until DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    urgency VARCHAR(16) DEFAULT 'Normal', -- 'High', 'Normal'
    medications TEXT[] NOT NULL,
    file_url TEXT,
    pharmacist_remarks TEXT,
    approved_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Automated Chronic Pill Refills Subscriptions Table
CREATE TABLE IF NOT EXISTS refills (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    interval_days INTEGER NOT NULL DEFAULT 30, -- 30, 60, 90
    next_refill_date DATE NOT NULL,
    status VARCHAR(16) DEFAULT 'Active', -- 'Active', 'Paused', 'Cancelled'
    whatsapp_reminder BOOLEAN DEFAULT TRUE,
    rx_validity_months INTEGER DEFAULT 6,
    remaining_pills_estimate INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Direct-From-Lab Batch Certificate of Analysis (COA) Records
CREATE TABLE IF NOT EXISTS batch_records (
    batch_id VARCHAR(64) PRIMARY KEY, -- e.g. BAT-MCP-99201
    product_id VARCHAR(64) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL DEFAULT 'MediCare Plus Cleanroom Labs',
    manufacturing_facility VARCHAR(255) NOT NULL,
    mfg_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    purity_assay_pct NUMERIC(4, 2) NOT NULL, -- e.g. 99.85
    heavy_metals_screen VARCHAR(32) DEFAULT 'Nil (Compliant with IP/USP)',
    microbial_test VARCHAR(32) DEFAULT 'Zero Colony (Sterile)',
    dissolution_rate VARCHAR(32) DEFAULT '98.4% in 15 mins',
    storage_vault_zone VARCHAR(64) NOT NULL,
    current_vault_temp VARCHAR(16) NOT NULL,
    total_stock_units INTEGER NOT NULL,
    reorder_level INTEGER NOT NULL,
    release_pharmacist VARCHAR(255) NOT NULL,
    release_status VARCHAR(32) DEFAULT 'Passed Quality Control',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Real-Time Cold-Chain Telemetry Log Table
CREATE TABLE IF NOT EXISTS cold_chain_telemetry (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    temperature NUMERIC(3, 1) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(16) DEFAULT 'optimal' -- 'optimal', 'warning'
);
