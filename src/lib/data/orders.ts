/**
 * Mock Order Data
 * Realistic order and inventory data for admin dashboard prototype
 */

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
}

export interface InventoryAlert {
  productId: string;
  productName: string;
  currentStock: number;
  reorderLevel: number;
  status: "critical" | "low" | "warning";
}

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockItems: number;
  orderGrowth: number; // percentage
  revenueGrowth: number; // percentage
}

// Generate realistic timestamps
const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

export const mockOrders: Order[] = [
  {
    id: "ord_001",
    orderNumber: "ORD-2026-001234",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    status: "pending",
    total: 89.97,
    items: [
      { productId: "prod_001", productName: "Vitamin D3 5000 IU", quantity: 2, price: 24.99 },
      { productId: "prod_003", productName: "Omega-3 Fish Oil 1000mg", quantity: 1, price: 29.99 },
      { productId: "prod_002", productName: "Ibuprofen 200mg", quantity: 1, price: 12.99 },
    ],
    shippingAddress: {
      street: "456 Oak Street",
      city: "Portland",
      state: "OR",
      zip: "97201",
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ord_002",
    orderNumber: "ORD-2026-001233",
    customerName: "Michael Chen",
    customerEmail: "m.chen@email.com",
    status: "processing",
    total: 49.99,
    items: [
      { productId: "prod_007", productName: "Blood Pressure Monitor", quantity: 1, price: 49.99 },
    ],
    shippingAddress: {
      street: "789 Pine Avenue",
      city: "Seattle",
      state: "WA",
      zip: "98101",
    },
    createdAt: yesterday,
    updatedAt: yesterday,
    trackingNumber: "TRK1234567890",
  },
  {
    id: "ord_003",
    orderNumber: "ORD-2026-001232",
    customerName: "Emily Rodriguez",
    customerEmail: "emily.r@email.com",
    status: "shipped",
    total: 64.98,
    items: [
      { productId: "prod_006", productName: "Probiotic 30 Billion CFU", quantity: 1, price: 34.99 },
      { productId: "prod_003", productName: "Omega-3 Fish Oil 1000mg", quantity: 1, price: 29.99 },
    ],
    shippingAddress: {
      street: "321 Elm Drive",
      city: "San Diego",
      state: "CA",
      zip: "92101",
    },
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
    trackingNumber: "TRK0987654321",
  },
  {
    id: "ord_004",
    orderNumber: "ORD-2026-001231",
    customerName: "David Thompson",
    customerEmail: "d.thompson@email.com",
    status: "delivered",
    total: 18.99,
    items: [
      { productId: "prod_004", productName: "Lisinopril 10mg", quantity: 1, price: 18.99 },
    ],
    shippingAddress: {
      street: "567 Maple Court",
      city: "Austin",
      state: "TX",
      zip: "78701",
    },
    createdAt: threeDaysAgo,
    updatedAt: yesterday,
    trackingNumber: "TRK1122334455",
  },
  {
    id: "ord_005",
    orderNumber: "ORD-2026-001230",
    customerName: "Jessica Park",
    customerEmail: "j.park@email.com",
    status: "delivered",
    total: 44.97,
    items: [
      { productId: "prod_001", productName: "Vitamin D3 5000 IU", quantity: 1, price: 24.99 },
      { productId: "prod_005", productName: "Digital Thermometer", quantity: 1, price: 14.99 },
      { productId: "prod_008", productName: "Antibiotic Ointment", quantity: 1, price: 8.99 },
    ],
    shippingAddress: {
      street: "890 Birch Lane",
      city: "Denver",
      state: "CO",
      zip: "80201",
    },
    createdAt: weekAgo,
    updatedAt: threeDaysAgo,
    trackingNumber: "TRK5566778899",
  },
];

export const mockInventoryAlerts: InventoryAlert[] = [
  {
    productId: "prod_007",
    productName: "Blood Pressure Monitor",
    currentStock: 34,
    reorderLevel: 50,
    status: "critical",
  },
  {
    productId: "prod_004",
    productName: "Lisinopril 10mg",
    currentStock: 45,
    reorderLevel: 100,
    status: "critical",
  },
  {
    productId: "prod_006",
    productName: "Probiotic 30 Billion CFU",
    currentStock: 67,
    reorderLevel: 100,
    status: "low",
  },
  {
    productId: "prod_003",
    productName: "Omega-3 Fish Oil 1000mg",
    currentStock: 89,
    reorderLevel: 150,
    status: "low",
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalOrders: 1247,
  totalRevenue: 87429.56,
  pendingOrders: 23,
  lowStockItems: 4,
  orderGrowth: 12.3,
  revenueGrowth: 8.7,
};

// Helper functions
export const getOrdersByStatus = (status: Order["status"]): Order[] => {
  return mockOrders.filter((order) => order.status === status);
};

export const getRecentOrders = (limit: number = 5): Order[] => {
  return [...mockOrders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

export const getCriticalInventory = (): InventoryAlert[] => {
  return mockInventoryAlerts.filter((alert) => alert.status === "critical");
};

export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find((order) => order.id === id);
};
