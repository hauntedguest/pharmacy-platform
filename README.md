# 🏥 MediCare Plus — Online Pharmacy Demo (Next.js + PostgreSQL)

> **Live Deployment:** [https://pharmacy-platform-ten.vercel.app](https://pharmacy-platform-ten.vercel.app)  
> **Admin Portal:** [https://pharmacy-platform-ten.vercel.app/admin](https://pharmacy-platform-ten.vercel.app/admin)

[![Production Website](https://img.shields.io/badge/Live%20Website-pharmacy--platform--ten.vercel.app-0070f3?style=for-the-badge&logo=vercel&logoColor=white)](https://pharmacy-platform-ten.vercel.app)
[![Database](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.4%20(Turbopack)-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

---

## 🌟 Overview

**MediCare Plus** is a full-stack demo of a direct-to-consumer online pharmacy, built as a personal portfolio project. It covers the core flows of an e-commerce pharmacy: catalogue, cart and checkout, prescription upload, order tracking and an admin portal, backed by PostgreSQL.

> **Demo project.** This is not a real pharmacy. No real orders are fulfilled, products and batch data are sample data, and nothing on the site is medical advice.

**How it was built:** I designed the features and data model and directed AI coding agents to implement them, then reviewed, tested and deployed the result to Vercel with a Neon PostgreSQL database.

---

## 🚀 Key Features

### 1. 🛒 Storefront and checkout
* Product catalogue with search and filters, product pages, cart and checkout.
* Animated 3D landing page built with **Three.js / React Three Fiber**.
* Indian PIN code lookup for delivery estimates.

### 2. 📄 Prescription and order flows
* Prescription upload form (image/PDF) with the prescribing doctor's registration number captured at checkout. Verification is a manual admin step; there is no automated validation.
* Refill subscriptions with reminder scheduling.
* Order tracking page that shows **simulated** cold-chain temperature readings to demonstrate how sensor data could be displayed (no real IoT devices).

### 3. 🤖 Shopping assistant chatbot
* Floating, draggable chat assistant.
* Handles common requests (product lookup, generic alternatives, delivery speed by PIN code, address changes, discounts) with **keyword-based intent rules**, and falls back to a free hosted LLM API for open-ended questions.

### 4. 💊 Drug interaction checker (demo)
* Rule-based lookup against a small curated list of known interactions for the medicines in the catalogue. For demonstration only, not a clinical tool.

### 5. 🗄️ Admin portal and data layer
* Admin pages for products, stock, visibility toggles, orders, prescriptions and batches (with sample certificate-of-analysis data).
* PostgreSQL (Neon) via Prisma ORM, with an in-memory fallback store for running without a database.
* About 20 Next.js API routes.

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
* **Admin Portal:** [https://pharmacy-platform-ten.vercel.app/admin](https://pharmacy-platform-ten.vercel.app/admin)
* **Catalogue & Filters:** [https://pharmacy-platform-ten.vercel.app/products](https://pharmacy-platform-ten.vercel.app/products)
* **Prescription Upload:** [https://pharmacy-platform-ten.vercel.app/prescriptions/upload](https://pharmacy-platform-ten.vercel.app/prescriptions/upload)
* **Interaction Checker (demo):** [https://pharmacy-platform-ten.vercel.app/interaction-checker](https://pharmacy-platform-ten.vercel.app/interaction-checker)
