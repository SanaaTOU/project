export interface Product {
  id: string;
  name: string;
  quantity: number;
  usageRate: number; // monthly usage
  expiryDate: string;
  supplierCountry: string;
  deliveryTime: number; // in days
  lastUpdated: string;
  createdAt: string;
  notes?: string;
  category?: string;
  critical: boolean;
  status: 'OK' | 'LOW_STOCK' | 'EXPIRING_SOON' | 'OVERSTOCKED';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface Notification {
  id: string;
  type: 'EXPIRY' | 'LOW_STOCK' | 'REORDER' | 'SYSTEM';
  message: string;
  productId?: string;
  date: string;
  read: boolean;
}

export interface AIRecommendation {
  productId: string;
  action: 'REORDER' | 'REDUCE_INVENTORY' | 'MONITOR';
  reason: string;
  predictedUsage: number;
  daysUntilStockout?: number;
  daysUntilExpiry?: number;
  suggestedOrderQuantity?: number;
}