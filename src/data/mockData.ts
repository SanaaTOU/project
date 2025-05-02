import { Product, Notification, AIRecommendation } from '../types';
import { addDays, format, subDays } from 'date-fns';

// Helper to create dates relative to today
const createDate = (days: number): string => {
  return format(addDays(new Date(), days), 'yyyy-MM-dd');
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Buffer X',
    quantity: 10,
    usageRate: 2,
    expiryDate: createDate(90),
    supplierCountry: 'Germany',
    deliveryTime: 15,
    lastUpdated: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    createdAt: format(subDays(new Date(), 120), 'yyyy-MM-dd'),
    category: 'Buffers',
    critical: true,
    status: 'OK',
  },
  {
    id: '2',
    name: 'Enzyme A',
    quantity: 5,
    usageRate: 4,
    expiryDate: createDate(60),
    supplierCountry: 'USA',
    deliveryTime: 20,
    lastUpdated: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    createdAt: format(subDays(new Date(), 150), 'yyyy-MM-dd'),
    category: 'Enzymes',
    critical: true,
    status: 'LOW_STOCK',
  },
  {
    id: '3',
    name: 'Reagent B',
    quantity: 25,
    usageRate: 1,
    expiryDate: createDate(30),
    supplierCountry: 'Japan',
    deliveryTime: 25,
    lastUpdated: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    createdAt: format(subDays(new Date(), 180), 'yyyy-MM-dd'),
    category: 'Reagents',
    critical: false,
    status: 'EXPIRING_SOON',
  },
  {
    id: '4',
    name: 'Catalyst Y',
    quantity: 50,
    usageRate: 2,
    expiryDate: createDate(365),
    supplierCountry: 'Switzerland',
    deliveryTime: 10,
    lastUpdated: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    createdAt: format(subDays(new Date(), 200), 'yyyy-MM-dd'),
    category: 'Catalysts',
    critical: false,
    status: 'OVERSTOCKED',
  },
  {
    id: '5',
    name: 'Solution Z',
    quantity: 8,
    usageRate: 5,
    expiryDate: createDate(120),
    supplierCountry: 'UK',
    deliveryTime: 12,
    lastUpdated: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    createdAt: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    category: 'Solutions',
    critical: true,
    status: 'LOW_STOCK',
  },
  {
    id: '6',
    name: 'Media C',
    quantity: 15,
    usageRate: 3,
    expiryDate: createDate(45),
    supplierCountry: 'France',
    deliveryTime: 18,
    lastUpdated: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
    createdAt: format(subDays(new Date(), 160), 'yyyy-MM-dd'),
    category: 'Media',
    critical: false,
    status: 'OK',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'LOW_STOCK',
    message: 'Enzyme A is running low. Consider reordering soon.',
    productId: '2',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    read: false,
  },
  {
    id: '2',
    type: 'EXPIRY',
    message: 'Reagent B will expire in 30 days. Plan usage accordingly.',
    productId: '3',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    read: false,
  },
  {
    id: '3',
    type: 'REORDER',
    message: 'Solution Z needs to be reordered to prevent stockout.',
    productId: '5',
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    read: true,
  },
  {
    id: '4',
    type: 'SYSTEM',
    message: 'Weekly inventory analysis completed.',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    read: true,
  },
];

export const mockRecommendations: AIRecommendation[] = [
  {
    productId: '2',
    action: 'REORDER',
    reason: 'Based on current usage, stock will run out before delivery can be made.',
    predictedUsage: 4.2,
    daysUntilStockout: 32,
    suggestedOrderQuantity: 25,
  },
  {
    productId: '3',
    action: 'REDUCE_INVENTORY',
    reason: 'Current stock will likely expire before usage. Consider reducing inventory or increasing usage.',
    predictedUsage: 0.8,
    daysUntilExpiry: 30,
  },
  {
    productId: '4',
    action: 'REDUCE_INVENTORY',
    reason: 'Current inventory exceeds 6-month usage needs. Consider optimizing stock levels.',
    predictedUsage: 1.8,
    daysUntilStockout: 834,
  },
  {
    productId: '5',
    action: 'REORDER',
    reason: 'Critical item with high usage rate needs immediate reordering.',
    predictedUsage: 5.3,
    daysUntilStockout: 45,
    suggestedOrderQuantity: 30,
  },
];

// Chart data for the dashboard
export const usageChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Buffer X',
      data: [2, 3, 2, 2, 1, 2],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
    },
    {
      label: 'Enzyme A',
      data: [4, 3, 5, 4, 4, 3],
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgba(16, 185, 129, 1)',
    },
    {
      label: 'Reagent B',
      data: [1, 2, 1, 0, 1, 1],
      backgroundColor: 'rgba(245, 158, 11, 0.5)',
      borderColor: 'rgba(245, 158, 11, 1)',
    },
  ],
};

export const expiryChartData = {
  labels: ['0-30 days', '30-60 days', '60-90 days', '90-180 days', '180+ days'],
  datasets: [
    {
      data: [1, 1, 1, 2, 1],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(107, 114, 128, 0.7)',
      ],
      borderWidth: 1,
    },
  ],
};

export const inventoryStatusData = {
  labels: ['OK', 'Low Stock', 'Expiring Soon', 'Overstocked'],
  datasets: [
    {
      data: [2, 2, 1, 1],
      backgroundColor: [
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(59, 130, 246, 0.7)',
      ],
      borderWidth: 1,
    },
  ],
};