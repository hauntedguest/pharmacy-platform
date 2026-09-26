# 🏥 MediCare Plus — Precision D2C Pharmaceutical Platform

> **Live Deployment:** [https://pharmacy-platform-ten.vercel.app](https://pharmacy-platform-ten.vercel.app)  
> **Pharmacist & Inventory Admin Portal:** [https://pharmacy-platform-ten.vercel.app/admin](https://pharmacy-platform-ten.vercel.app/admin)

[![Production Website](https://img.shields.io/badge/Live%20Website-pharmacy--platform--ten.vercel.app-0070f3?style=for-the-badge&logo=vercel&logoColor=white)](https://pharmacy-platform-ten.vercel.app)
[![Database](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.4%20(Turbopack)-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

---

## 🌟 Overview

**MediCare Plus** is an enterprise-grade Direct-to-Consumer (D2C) clinical pharmaceutical and healthcare platform engineered with strict CDSCO Schedule H compliance, real-time cold-chain IoT telemetry, autonomous multi-agent clinical assistance, and direct-from-lab formulation purity.

---

## 🚀 Key Features

### 1. 🔬 4-Act Cinematic 3D Scroll Experience
* Interactive **Three.js & React Three Fiber** 3D molecular simulation.
* Smooth scroll progression visualizing cleanroom lab synthesis, enteric micro-encapsulation, analytical HPLC assays, and temperature-monitored cold-chain delivery.

### 2. 🤖 Autonomous Multi-Agent AI Clinical Assistant
* **Direct-from-Lab Generic Substitution Engine**: Replaces high-cost market brand medications with verified 99.8% pure lab generics, saving patients up to 75%.
* **CompassHealthcare Financial Relief**: Autonomous sentiment analysis and grant evaluation for budget-constrained patients.
* **Drug-Drug Interaction (DDI) Checker**: Real-time multi-molecule clinical contraindication screening.
* **Live India Post PIN Code Delivery Speed**: Direct logistics verification with cold-chain transit feasibility.
* **Autonomous Cart & Address Actions**: Instant stock verification, coupon executions, and in-chat delivery address updates.
* **Floating & Draggable UI**: Positionable assistant icon with boundary clamping to avoid obstructing checkout actions.

### 3. 🛡️ Regulatory Compliance & Precision Commerce
* **Schedule H Prescription Intake**: Verification workflow with doctor registration (MCI/SMC) validation.
* **Chronic Refill Subscriptions**: Auto-refill schedules with 7-day pre-runout patient notifications.
* **Certificate of Analysis (CoA) Vault**: Batch-level purity assays, heavy metal screenings, and ISO cleanroom certificates.
* **Cold-Chain IoT Telemetry**: Real-time sensor logs tracking refrigerated products (2°C–8°C) with transit GPS coordinates.

### 4. 🗄️ PostgreSQL Database & Prisma ORM
* High-integrity relational schema for Products, Orders, OrderItems, Prescriptions, Refills, Batches, and IoT Telemetry.
* Seamless hybrid repository pattern connecting to Neon Serverless PostgreSQL with in-memory offline fallback.
* Instant Admin Catalogue Controls: In-table visibility toggles (`isVisible`), dynamic stock counters, and relational product lifecycle management.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16.3.4 (App Router & Turbopack)
* **Frontend:** React 19.2.8, Tailwind CSS v4, Framer Motion, Lucide Icons
* **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`
* **Database & ORM:** PostgreSQL (Neon Serverless), Prisma ORM 6.19
* **Hosting & CI/CD:** Vercel Production Infrastructure

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/hauntedguest/pharmacy-platform.git
cd pharmacy-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@your-neon-or-local-db.tech/neondb?sslmode=require"
```

### 4. Generate Prisma Client & Run Database Migrations
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Live URLs

* **Storefront:** [https://pharmacy-platform-ten.vercel.app](https://pharmacy-platform-ten.vercel.app)
* **Pharmacist Admin Portal:** [https://pharmacy-platform-ten.vercel.app/admin](https://pharmacy-platform-ten.vercel.app/admin)
* **Catalogue & Filters:** [https://pharmacy-platform-ten.vercel.app/products](https://pharmacy-platform-ten.vercel.app/products)
* **Prescription Upload:** [https://pharmacy-platform-ten.vercel.app/prescriptions/upload](https://pharmacy-platform-ten.vercel.app/prescriptions/upload)
* **Clinical Interaction Checker:** [https://pharmacy-platform-ten.vercel.app/interaction-checker](https://pharmacy-platform-ten.vercel.app/interaction-checker)
