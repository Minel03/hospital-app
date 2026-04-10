# 🏥 MediCare Center — Advanced Hospital Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
![Node](https://img.shields.io/badge/Node-v18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)

MediCare Center is a premium, full-stack Hospital Management System (HMS) designed to streamline medical operations. It features a sophisticated architecture that bridges patient care, financial billing, and inventory management into a single, cohesive experience.

---

## ✨ Core Modules

### 💰 Smart Financial Billing & Invoicing
Equipped with a professional-grade PDF generation engine and an in-place printing system.
- **True Isolation Rendering**: Uses an isolated iframe environment to ensure pixel-perfect PDF downloads, completely safe from CSS conflicts.
- **Auto-Calculation**: Fetches patient services, lab tests, and room rates automatically.
- **Professional Templates**: Elegant, high-fidelity invoice designs suitable for official hospital records.

### 💊 Intelligent Pharmacy & Inventory
Syncs prescriptions directly with the billing module for automated stock management.
- **Automated stock deduction** upon invoice generation.
- **Expiry tracking** and category-based sorting.

### 👥 Patient & Staff Orchestration
Role-based access control (RBAC) ensures data security and integrity.
- **Admins**: Full system oversight and settings control.
- **Doctors**: Consultation management and digital prescription writing.
- **Staff/Nurses**: Bed allocation and patient monitoring.

### 🧪 Laboratory & Diagnostics
Track lab reports from test requisition to final result delivery.

---

## 🛠️ Technical Architecture

### Frontend (Modern Stack)
*   **React 19 & Vite**: Ultra-fast HMR and optimized builds.
*   **Tailwind CSS v4**: Utilizing the latest modern color spaces (`oklch`) and design tokens.
*   **Recharts**: Interactive data visualization for the administrative dashboard.
*   **React Context**: Robust global state management for user settings and auth.

### Backend (Scalable Micro-services)
*   **Node.js & Express**: High-performance API architecture.
*   **MongoDB & Mongoose**: Flexible schema design for complex medical data relationships.
*   **JWT Security**: Secure, stateless authentication for all medical personnel.

---

## 🚀 Getting Started

### 1. Requirements
Ensure you have **Node.js (18+)** and **MongoDB** installed and running.

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure your `.env` variables (MONGODB_URI, JWT_SECRET).
```bash
npm run seed  # To populate initial medical data and staff accounts
npm run server
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 👤 Test Access (Seed Data)

Use these credentials to explore the system's different role views:

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@medicare.com` | `password123` |
| **Chief Doctor** | `john@medicare.com` | `password123` |
| **Support Staff** | `clara@medicare.com` | `password123` |

---

## 🛡️ Audit & Security
The system includes a dedicated **Logs** module that records every critical action (admissions, deletions, billing updates), providing a full audit trail for hospital compliance.

---

## 👨‍💻 Developed by
**Mynel Iesu P. Santos** — *Full Stack Developer*
