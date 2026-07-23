-- HORIZON Super Speciality Hospital - Admin Dashboard Schema
-- This script is completely additive. Run this in your Supabase SQL Editor.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (for Auth + Roles: admin, doctor, receptionist, pharmacist)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'receptionist',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    head_of_department TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Doctors (Full Admin View)
-- Note: If you already have a 'Doctors' table, you can either link to it or use this for the admin module.
CREATE TABLE IF NOT EXISTS doctors_admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES auth.users(id), -- Linked to login
    full_name TEXT NOT NULL,
    photo_url TEXT,
    gender TEXT,
    date_of_birth DATE,
    phone TEXT,
    email TEXT UNIQUE,
    emergency_contact TEXT,
    specialization TEXT, -- Can also link to departments(id)
    department_id UUID REFERENCES departments(id),
    qualifications TEXT,
    experience_years INTEGER,
    registration_number TEXT,
    employee_id TEXT UNIQUE,
    join_date DATE,
    employment_type TEXT,
    designation TEXT,
    salary NUMERIC,
    consultation_fee NUMERIC,
    revenue_share_percentage NUMERIC,
    payment_details TEXT,
    available_days TEXT[],
    shift_start TIME,
    shift_end TIME,
    max_patients_per_day INTEGER,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Staff
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL, -- nurse, receptionist, lab_tech, etc.
    phone TEXT,
    email TEXT UNIQUE,
    salary NUMERIC,
    join_date DATE,
    shift TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Patients Registry (Centralized)
CREATE TABLE IF NOT EXISTS patients_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uhid TEXT UNIQUE, -- Unique Hospital ID
    full_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Appointments Master
CREATE TABLE IF NOT EXISTS appointments_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients_registry(id),
    doctor_id UUID REFERENCES doctors_admin(id),
    department_id UUID REFERENCES departments(id),
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'Scheduled', -- Scheduled, Completed, Cancelled, No-show
    payment_status TEXT DEFAULT 'Pending',
    chief_complaint TEXT,
    vitals JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Pharmacy Inventory
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT,
    stock_quantity INTEGER DEFAULT 0,
    unit_price NUMERIC NOT NULL,
    expiry_date DATE,
    reorder_level INTEGER DEFAULT 10,
    supplier TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Pharmacy Sales
CREATE TABLE IF NOT EXISTS pharmacy_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients_registry(id),
    total_amount NUMERIC NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'Paid',
    items JSONB NOT NULL, -- array of medicines and quantities
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Invoices / Billing
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients_registry(id),
    doctor_id UUID REFERENCES doctors_admin(id),
    department_id UUID REFERENCES departments(id),
    amount NUMERIC NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'Pending', -- Pending, Paid, Partial
    invoice_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    items JSONB -- Breakdown of charges (consultation, lab, etc.)
);

-- 10. Wards
CREATE TABLE IF NOT EXISTS wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- General, Private, ICU, Emergency
    price_per_day NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Beds
CREATE TABLE IF NOT EXISTS beds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_id UUID REFERENCES wards(id),
    bed_number TEXT NOT NULL,
    status TEXT DEFAULT 'Available', -- Available, Occupied, Maintenance
    current_patient_id UUID REFERENCES patients_registry(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT, -- Alert, Reminder, System
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL, -- Table name
    entity_id TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES (Row Level Security)
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can do everything. For simplicity in this script, we create a broad policy.
-- Note: In Supabase, auth.uid() is the user id. We look up their role in `profiles`.
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Example broad admin policy for doctors_admin (you can replicate for others as needed in production)
CREATE POLICY "Admins have full access to doctors" ON doctors_admin FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to profiles" ON profiles FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to departments" ON departments FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to staff" ON staff FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to patients" ON patients_registry FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to appointments" ON appointments_master FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to pharmacy" ON pharmacy_inventory FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to sales" ON pharmacy_sales FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to invoices" ON invoices FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to wards" ON wards FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to beds" ON beds FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to notifications" ON notifications FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to audit" ON audit_logs FOR ALL USING (is_admin());

-- Allow public read for departments (for landing page)
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (true);
