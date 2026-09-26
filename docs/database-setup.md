# MediCare Plus — PostgreSQL Database Setup Guide (100% Free Tier)

This platform uses **Prisma ORM** with **PostgreSQL**, engineered for high reliability, CDSCO regulatory compliance, ACID-safe order transactions, and batch certificate tracking.

---

## 🚀 1. Free PostgreSQL Database Hosting Options (No Cost)

### Option A: Neon Serverless Postgres (Recommended)
1. Navigate to **[https://neon.tech](https://neon.tech)** and click **Sign Up** (Free Forever, zero credit card required).
2. Create a new project (e.g. `medicare-platform`).
3. Select your preferred region (e.g. `ap-southeast-1` Singapore or `us-east-2`).
4. In your project dashboard, copy the connection string under **Connection Details**:
   ```env
   DATABASE_URL="postgresql://neondb_owner:your_password@ep-xyz-pooler.region.aws.neon.tech/neondb?sslmode=require"
   ```
5. Paste `DATABASE_URL` into your local `.env.local` file.

### Option B: Supabase PostgreSQL
1. Navigate to **[https://supabase.com](https://supabase.com)** and create a new free project.
2. Go to **Project Settings** &rarr; **Database** &rarr; **Connection string** (URI).
3. Copy the pooled connection string and set `DATABASE_URL` in `.env.local`.

---

## 🛠️ 2. Sync Schema & Seed Initial Data

Once `DATABASE_URL` is set in your `.env.local`:

```bash
# 1. Push the Prisma schema to your PostgreSQL database
npm run db:push

# 2. Seed the pharmaceutical catalogue, orders, batches, and prescriptions
npm run db:seed

# 3. (Optional) Open Prisma Studio to browse your live database visually
npm run db:studio
```

---

## 🔄 3. Dual-Mode Architecture & Offline Fallback

The platform includes a built-in **hybrid database adapter**:
- **With `DATABASE_URL` configured**: All reads and writes (`getProducts`, `createOrder`, `updateStock`, `verifyPrescription`) interact directly with PostgreSQL via Prisma.
- **Without `DATABASE_URL` (Offline/Development)**: The system automatically and gracefully falls back to the in-memory CDSCO seed store. This ensures zero downtime, local development without external database setup, and instant test execution.

---

## 🗄️ 4. Data Models Overview

| Model | Purpose | Key Relations |
| :--- | :--- | :--- |
| `Product` | 28+ CDSCO pharmaceutical formulations, stock, pricing, and Schedule H flags | `OrderItem` |
| `Order` | Patient orders, payment status, cold-chain indicators, and delivery OTPs | `OrderItem`, `TelemetryRecord` |
| `OrderItem` | Line items with unit pricing, product references, and quantity | `Order`, `Product` |
| `Prescription` | Schedule H doctor prescriptions, MMC registration verification, approval workflows | Standalone / Order link |
| `Refill` | Chronic auto-refills with WhatsApp reminder schedules | Product reference |
| `Batch` | Cleanroom QA records, purity assay (%), heavy metal tests, and vault temperatures | Product reference |
| `TelemetryRecord` | Cold-chain GPS & IoT temperature records (2°C - 8°C) | `Order` |
