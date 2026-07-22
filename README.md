# AuraCare Hospital OS (Horizon Super Speciality Hospital)

AuraCare Hospital OS (currently branded as **Horizon Super Speciality Hospital**) is a modern, full-featured hospital management web application. It seamlessly integrates a public-facing website for patient information and appointment booking with internal, role-based portals for hospital staff (Reception, Doctors, and Pharmacy) to manage the patient lifecycle and paperless workflows.

## 🚀 Key Features

### 1. Public-Facing Website
- **Modern Landing Page**: High-performance, SEO-friendly landing page with sections for About, Services, Specialities, Doctors, Gallery, and Contact.
- **Smooth Animations**: Integrated with Framer Motion and Lenis for an immersive, premium scrolling experience.
- **Dynamic Configuration**: All hospital data (Doctors, Specialities, Services, Stats) is centrally managed in `lib/hospitalConfig.ts` for easy updates without deep code changes.
- **Online Appointments**: Patients can book appointments through a beautiful, modal-based booking form that pushes data directly to the hospital's backend.

### 2. Reception & Queue Controller (`/reception`)
- **Walk-in Registration**: Quickly register walk-in or urgent patients, generate a UHID, and assign them to a specific doctor's queue.
- **Live Queue Management**: View all online and walk-in appointments in real-time, categorized by Triage priority (Normal, Urgent, Emergency).
- **Status Tracking**: Track payment status and patient location (Waiting, In Consultation, Completed).

### 3. Doctor Clinical Console (`/doctor-login` & `/doctor-dashboard`)
- **Secure Authentication**: Doctors log in securely to access their specific patient queue (powered by `DoctorAuthContext`).
- **Live Patient Queue**: See the list of patients assigned to them for the day in real-time.
- **e-Prescription Desk**: A fully digital consultation interface where doctors can write prescriptions (Medicines, Frequency, Duration) and instantly dispatch them to the pharmacy.

### 4. Pharmacy Dispensary Portal (`/pharmacy`)
- **Instant Digital Prescriptions**: Prescriptions sent by doctors appear immediately on the pharmacy dashboard.
- **Fulfillment Tracking**: Pharmacists can review the prescribed medicines and mark the order as "Fulfilled & Handed" once dispensed to the patient.

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Animations**: Framer Motion & Lenis (Smooth Scrolling)
- **Icons**: Lucide React
- **Backend/Database**: Supabase (PostgreSQL, Realtime Subscriptions)
- **Language**: TypeScript

## 📂 Project Structure

```
Demopiece/
├── app/
│   ├── doctor-dashboard/    # Doctor's secure portal for consultations & e-prescriptions
│   ├── doctor-login/        # Authentication page for doctors
│   ├── pharmacy/            # Pharmacy portal for medicine fulfillment
│   ├── reception/           # Front desk portal for patient intake & queue management
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout with SmoothScroll wrapper
│   └── page.tsx             # Public landing page
├── components/              # Modular UI components (Hero, Navbar, Footer, Sections, Modals)
├── context/                 # React Context providers (DoctorAuthContext, AppointmentContext)
├── lib/
│   ├── hospitalConfig.ts    # Centralized configuration for hospital content
│   └── supabase.ts          # Supabase client initialization
└── public/                  # Static assets
```

## ⚙️ Setup and Installation

### 1. Prerequisites
- Node.js 18.x or later
- npm, yarn, or pnpm
- A [Supabase](https://supabase.com) account

### 2. Clone and Install
```bash
# Navigate to the project directory
cd Demopiece

# Install dependencies
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the `Demopiece` directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup (Supabase)
You need to create a table in your Supabase public schema named `Booking Appointment` with the following columns (or adapt according to your implementation):
- `id` (uuid or int8, primary key)
- `Name` (text)
- `Email` (text)
- `Phone` (numeric)
- `Department` (text)
- `Date` (date)
- `Doctor` (text)
- `age` (numeric, nullable)
- `gender` (text, nullable)
- `triage_priority` (text, nullable)
- `payment_status` (text, nullable)
- `reason` (text, nullable)
- `queue_status` (text, nullable)
- `booking_type` (text, nullable)
- `created_at` (timestamp)

*Note: Ensure Realtime is enabled for the `Booking Appointment` table in your Supabase dashboard so the Reception and Doctor portals update automatically.*

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Usage Guide

- **Public Site**: Access via `/`. Test the "Book Appointment" flow.
- **Reception**: Access via `/reception`. Add a Walk-in patient and assign them to a doctor.
- **Doctor Portal**: Access via `/doctor-login`. Use demo credentials (e.g., `dr.smith@horizon.com` / `password123` based on your Auth Context setup) to view the patient assigned from Reception, and generate a prescription.
- **Pharmacy**: Access via `/pharmacy` to see the prescription generated by the doctor and mark it fulfilled.

---
*Developed as a comprehensive, paperless Hospital Workflow Engine.*
