# 🏥 MediCare Center — Advanced Hospital Management System

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
![Node](https://img.shields.io/badge/Node-v18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)

MediCare Center is a premium, full-stack Hospital Management System (HMS) designed for modern medical institutions. It features a sophisticated architecture that integrates patient care, diagnostics, financial billing, and role-based operational management into a single, high-performance platform.

---

## ✨ Key Modules & Features

### 🛡️ State-of-the-Art RBAC (Role-Based Access Control)

The system implements a rigorous security model across all modules.

- **7 Distinct Roles**: Admin, Doctor, Nurse, Receptionist, Pharmacist, MedTech, and Accountant.
- **UI Guards**: Automatically hides or disables administrative actions (Add/Edit/Delete) based on the logged-in user's role.
- **API Security**: Backend routes are hardened with middleware that enforces strict access permissions.

### 💰 Smart Financial Billing & Invoicing

Equipped with a professional-grade PDF generation engine and an in-place printing system.

- **PDF Isolation Rendering**: Uses an isolated iframe environment to ensure pixel-perfect downloads, unaffected by Tailwind CSS v4's global variable shifts.
- **Auto-Sync**: Automatically calculates totals from patient services, lab tests, and room rates.
- **Status Tracking**: Manage "Draft", "Pending", and "Paid" invoices with a full audit trail.

### 🛏️ Admissions & Bed Management

Efficiently manage hospital occupancy with real-time tracking.

- **Room/Bed Allocation**: Dynamic status updates (Available, Occupied, Under Maintenance).
- **Patient Admissions**: Intuitive workflow for admitting and discharging patients, integrated directly with the billing module.
- **Selection Guards**: Smart filtering prevents selecting already-admitted patients or occupied beds.

### 🧪 Laboratory & Diagnostics

Streamlined diagnostic workflow for medical technicians and doctors.

- **Test Requisition**: Doctors create orders with specific diagnostic categories.
- **Electronic Results**: MedTechs input findings and upload reports directly to the patient profile.

### 💊 Pharmacy & Inventory Tracking

Real-time stock management linked to patient prescriptions.

- **Automated Deductions**: Stock is automatically reduced when a pharmaceutical invoice is generated.
- **History Logs**: Track every movement within the pharmacy inventory.

---

## 🛠️ Technical Architecture

### Frontend (User Interface)

- **React 19 & Vite**: Ultra-fast HMR and optimized production bundles.
- **Tailwind CSS v4**: Utilizing modern color spaces (`oklch`) and the new design token system.
- **Outfit Typography**: Sleek, professional font integration via Google Fonts.
- **React Context**: Unified global state management for Authentication and Contextual Data.

### Backend (Logic & Security)

- **Node.js & Express**: Scalable RESTful API architecture.
- **MongoDB & Mongoose**: Complex data relationships managed through high-performance schemas.
- **JWT Security**: Secure, stateless authentication for all medical personnel.
- **Audit Logging**: Integrated `AuditLog` model recording all critical system activities.

---

## 🚀 Getting Started

### 1. Requirements

- **Node.js (18+)**
- **MongoDB** (Local or Atlas)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/Minel03/hospital-app.git

# Setup Backend
cd backend
npm install
# Configure your .env (MONGODB_URI, JWT_SECRET, PORT)
npm run seed  # Generates full audit trail and test data
npm start

# Setup Frontend
cd ../frontend
npm install
npm run dev
```

---

## 👤 Test Credentials (from `seed.js`)

| Role             | Email                 | Password      | Access Level             |
| :--------------- | :-------------------- | :------------ | :----------------------- |
| **Admin**        | `admin@medicare.com`  | `password123` | Full Access              |
| **Chief Doctor** | `john@medicare.com`   | `password123` | Clinical & Orders        |
| **Pharmacist**   | `lisa@medicare.com`   | `password123` | Inventory & Med-Billing  |
| **Nurse**        | `clara@medicare.com`  | `password123` | Admissions & Beds        |
| **MedTech**      | `mike@medicare.com`   | `password123` | Lab Reports & Results    |
| **Accountant**   | `kevin@medicare.com`  | `password123` | Billing & Revenue        |
| **Receptionist** | `rachel@medicare.com` | `password123` | Appointments & Check-ins |

---

## 👨‍💻 Developed by

**Mynel Iesu P. Santos** — _Full Stack Developer_
