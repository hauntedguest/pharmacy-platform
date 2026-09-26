import { PrismaClient } from "@prisma/client";
import { mockProducts } from "../src/lib/data/products";
import {
  initialOrders,
  initialPrescriptions,
  initialRefills,
  initialBatches,
  initialTelemetryMap,
} from "../src/lib/db/seeds";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 [Seed] Starting MediCare Plus database seed...");

  // 1. Seed Products
  console.log(`📦 [Seed] Seeding ${mockProducts.length} pharmaceutical products...`);
  for (const product of mockProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        slug: product.slug,
        name: product.name,
        category: product.category,
        subCategory: product.subCategory,
        brand: product.brand,
        manufacturer: product.manufacturer,
        price: product.price,
        originalPrice: product.originalPrice,
        packSize: product.packSize,
        stock: product.stock,
        inStock: product.inStock ?? product.stock > 0,
        requiresPrescription: product.requiresPrescription,
        prescriptionType: product.prescriptionType,
        images: product.images,
        description: product.description,
        dosage: product.dosage,
        dosageForm: product.dosageForm,
        activeIngredient: product.activeIngredient,
        composition: product.composition,
        sideEffects: product.sideEffects || [],
        usage: product.usage || "",
        warnings: product.warnings || [],
        storage: product.storage,
        featured: product.featured,
        bestseller: product.bestseller,
        tags: product.tags,
        rating: product.rating,
        reviewCount: product.reviewCount,
        discountPercent: product.discountPercent,
        isVisible: product.isVisible ?? true,
      },
      create: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        subCategory: product.subCategory,
        brand: product.brand,
        manufacturer: product.manufacturer,
        price: product.price,
        originalPrice: product.originalPrice,
        packSize: product.packSize,
        stock: product.stock,
        inStock: product.inStock ?? product.stock > 0,
        requiresPrescription: product.requiresPrescription,
        prescriptionType: product.prescriptionType,
        images: product.images,
        description: product.description,
        dosage: product.dosage,
        dosageForm: product.dosageForm,
        activeIngredient: product.activeIngredient,
        composition: product.composition,
        sideEffects: product.sideEffects || [],
        usage: product.usage || "",
        warnings: product.warnings || [],
        storage: product.storage,
        featured: product.featured,
        bestseller: product.bestseller,
        tags: product.tags,
        rating: product.rating,
        reviewCount: product.reviewCount,
        discountPercent: product.discountPercent,
        isVisible: product.isVisible ?? true,
      },
    });
  }

  // 2. Seed Orders & Items
  console.log(`📑 [Seed] Seeding ${initialOrders.length} customer orders...`);
  for (const order of initialOrders) {
    await prisma.order.upsert({
      where: { id: order.id },
      update: {
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        shippingStreet: order.shippingStreet,
        shippingCity: order.shippingCity,
        shippingState: order.shippingState,
        shippingPincode: order.shippingPincode,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        isColdChain: order.isColdChain,
        currentPayloadTemp: order.currentPayloadTemp,
        deliveryOtp: order.deliveryOtp,
        trackingNumber: order.trackingNumber,
        prescriptionId: order.prescriptionId,
      },
      create: {
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        shippingStreet: order.shippingStreet,
        shippingCity: order.shippingCity,
        shippingState: order.shippingState,
        shippingPincode: order.shippingPincode,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        isColdChain: order.isColdChain,
        currentPayloadTemp: order.currentPayloadTemp,
        deliveryOtp: order.deliveryOtp,
        trackingNumber: order.trackingNumber,
        prescriptionId: order.prescriptionId,
        items: {
          create: order.items.map((it) => ({
            productId: it.productId,
            productName: it.productName,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            totalPrice: it.totalPrice,
          })),
        },
      },
    });
  }

  // 3. Seed Prescriptions
  console.log(`🩺 [Seed] Seeding ${initialPrescriptions.length} prescriptions...`);
  for (const rx of initialPrescriptions) {
    await prisma.prescription.upsert({
      where: { id: rx.id },
      update: {
        patientName: rx.patientName,
        patientAge: rx.patientAge,
        patientGender: rx.patientGender,
        patientPhone: rx.patientPhone,
        shippingCity: rx.shippingCity,
        shippingPincode: rx.shippingPincode,
        doctorName: rx.doctorName,
        doctorRegNo: rx.doctorRegNo,
        clinicHospital: rx.clinicHospital,
        dateIssued: rx.dateIssued,
        validUntil: rx.validUntil,
        status: rx.status,
        urgency: rx.urgency,
        medications: rx.medications,
        fileUrl: rx.fileUrl,
        pharmacistRemarks: rx.pharmacistRemarks,
        approvedBy: rx.approvedBy,
      },
      create: {
        id: rx.id,
        patientName: rx.patientName,
        patientAge: rx.patientAge,
        patientGender: rx.patientGender,
        patientPhone: rx.patientPhone,
        shippingCity: rx.shippingCity,
        shippingPincode: rx.shippingPincode,
        doctorName: rx.doctorName,
        doctorRegNo: rx.doctorRegNo,
        clinicHospital: rx.clinicHospital,
        dateIssued: rx.dateIssued,
        validUntil: rx.validUntil,
        status: rx.status,
        urgency: rx.urgency,
        medications: rx.medications,
        fileUrl: rx.fileUrl,
        pharmacistRemarks: rx.pharmacistRemarks,
        approvedBy: rx.approvedBy,
      },
    });
  }

  // 4. Seed Refills
  console.log(`🔄 [Seed] Seeding ${initialRefills.length} auto-refill subscriptions...`);
  for (const refill of initialRefills) {
    await prisma.refill.upsert({
      where: { id: refill.id },
      update: {
        productId: refill.productId,
        productName: refill.productName,
        customerName: refill.customerName,
        customerPhone: refill.customerPhone,
        quantity: refill.quantity,
        intervalDays: refill.intervalDays,
        nextRefillDate: refill.nextRefillDate,
        status: refill.status,
        whatsappReminder: refill.whatsappReminder,
        rxValidityMonths: refill.rxValidityMonths,
        remainingPillsEstimate: refill.remainingPillsEstimate,
      },
      create: {
        id: refill.id,
        productId: refill.productId,
        productName: refill.productName,
        customerName: refill.customerName,
        customerPhone: refill.customerPhone,
        quantity: refill.quantity,
        intervalDays: refill.intervalDays,
        nextRefillDate: refill.nextRefillDate,
        status: refill.status,
        whatsappReminder: refill.whatsappReminder,
        rxValidityMonths: refill.rxValidityMonths,
        remainingPillsEstimate: refill.remainingPillsEstimate,
      },
    });
  }

  // 5. Seed Batches
  console.log(`🧪 [Seed] Seeding ${initialBatches.length} batch CoA QA records...`);
  for (const batch of initialBatches) {
    await prisma.batch.upsert({
      where: { batchId: batch.batchId },
      update: {
        productId: batch.productId,
        productName: batch.productName,
        manufacturer: batch.manufacturer,
        manufacturingFacility: batch.manufacturingFacility,
        mfgDate: batch.mfgDate,
        expiryDate: batch.expiryDate,
        purityAssayPct: batch.purityAssayPct,
        heavyMetalsScreen: batch.heavyMetalsScreen,
        microbialTest: batch.microbialTest,
        dissolutionRate: batch.dissolutionRate,
        storageVaultZone: batch.storageVaultZone,
        currentVaultTemp: batch.currentVaultTemp,
        totalStockUnits: batch.totalStockUnits,
        reorderLevel: batch.reorderLevel,
        releasePharmacist: batch.releasePharmacist,
        releaseStatus: batch.releaseStatus,
      },
      create: {
        batchId: batch.batchId,
        productId: batch.productId,
        productName: batch.productName,
        manufacturer: batch.manufacturer,
        manufacturingFacility: batch.manufacturingFacility,
        mfgDate: batch.mfgDate,
        expiryDate: batch.expiryDate,
        purityAssayPct: batch.purityAssayPct,
        heavyMetalsScreen: batch.heavyMetalsScreen,
        microbialTest: batch.microbialTest,
        dissolutionRate: batch.dissolutionRate,
        storageVaultZone: batch.storageVaultZone,
        currentVaultTemp: batch.currentVaultTemp,
        totalStockUnits: batch.totalStockUnits,
        reorderLevel: batch.reorderLevel,
        releasePharmacist: batch.releasePharmacist,
        releaseStatus: batch.releaseStatus,
      },
    });
  }

  // 6. Seed Telemetry
  console.log("🛰️ [Seed] Seeding cold-chain IoT telemetry records...");
  for (const [orderId, points] of Object.entries(initialTelemetryMap)) {
    for (const pt of points) {
      await prisma.telemetryRecord.create({
        data: {
          orderId,
          time: pt.time,
          temp: pt.temp,
          location: pt.location,
          status: pt.status,
        },
      });
    }
  }

  console.log("✅ [Seed] Database successfully seeded with CDSCO clinical & e-commerce records!");
}

main()
  .catch((e) => {
    console.error("❌ [Seed] Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
