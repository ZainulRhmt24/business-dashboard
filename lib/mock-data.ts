export interface RevenueData {
  month: string;
  revenue: number;
  target: number;
}

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  revenue: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderLevel: number;
  value: number;
  lastRestocked: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  customerGrowth: number;
  conversionRate: number;
}

// Mock revenue data
export const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 50000 },
  { month: 'Mar', revenue: 48000, target: 50000 },
  { month: 'Apr', revenue: 61000, target: 55000 },
  { month: 'May', revenue: 55000, target: 55000 },
  { month: 'Jun', revenue: 67000, target: 60000 },
  { month: 'Jul', revenue: 72000, target: 65000 },
  { month: 'Aug', revenue: 68000, target: 65000 },
  { month: 'Sep', revenue: 75000, target: 70000 },
  { month: 'Oct', revenue: 82000, target: 75000 },
  { month: 'Nov', revenue: 89000, target: 80000 },
  { month: 'Dec', revenue: 95000, target: 90000 },
];

// Category breakdown
export const categoryData: CategoryData[] = [
  { name: 'Electronics', value: 35, percentage: 35 },
  { name: 'Clothing', value: 25, percentage: 25 },
  { name: 'Home & Garden', value: 20, percentage: 20 },
  { name: 'Sports', value: 15, percentage: 15 },
  { name: 'Other', value: 5, percentage: 5 },
];

// Customer data
export const customerData: CustomerData[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    revenue: 12500,
    joinDate: '2023-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    revenue: 8900,
    joinDate: '2023-02-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@example.com',
    revenue: 15200,
    joinDate: '2023-03-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'David Williams',
    email: 'david.williams@example.com',
    revenue: 7600,
    joinDate: '2023-04-05',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    revenue: 11800,
    joinDate: '2023-05-12',
    status: 'active',
  },
  {
    id: '6',
    name: 'James Taylor',
    email: 'james.taylor@example.com',
    revenue: 9500,
    joinDate: '2023-06-01',
    status: 'active',
  },
  {
    id: '7',
    name: 'Rachel Kim',
    email: 'rachel.kim@example.com',
    revenue: 13400,
    joinDate: '2023-07-18',
    status: 'pending',
  },
  {
    id: '8',
    name: 'Thomas Brown',
    email: 'thomas.brown@example.com',
    revenue: 6200,
    joinDate: '2023-08-22',
    status: 'active',
  },
];

// Inventory data
export const inventoryData: InventoryItem[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    quantity: 45,
    reorderLevel: 20,
    value: 8955,
    lastRestocked: '2024-02-15',
  },
  {
    id: '2',
    name: 'USB-C Cables',
    sku: 'USB-002',
    quantity: 8,
    reorderLevel: 50,
    value: 320,
    lastRestocked: '2024-01-20',
  },
  {
    id: '3',
    name: 'Phone Cases',
    sku: 'PC-003',
    quantity: 120,
    reorderLevel: 30,
    value: 2160,
    lastRestocked: '2024-02-10',
  },
  {
    id: '4',
    name: 'Screen Protectors',
    sku: 'SP-004',
    quantity: 200,
    reorderLevel: 75,
    value: 1000,
    lastRestocked: '2024-02-08',
  },
  {
    id: '5',
    name: 'Power Banks',
    sku: 'PB-005',
    quantity: 25,
    reorderLevel: 40,
    value: 1250,
    lastRestocked: '2024-01-15',
  },
  {
    id: '6',
    name: 'Portable Chargers',
    sku: 'PC-006',
    quantity: 15,
    reorderLevel: 35,
    value: 1050,
    lastRestocked: '2024-01-10',
  },
];

// Dashboard metrics
export const dashboardMetrics: DashboardMetrics = {
  totalRevenue: 749000,
  monthlyRevenue: 95000,
  customerGrowth: 14.2,
  conversionRate: 3.8,
};

// Customer growth data for chart
export const customerGrowthData = [
  { month: 'Jan', customers: 120, revenue: 45000 },
  { month: 'Feb', customers: 145, revenue: 52000 },
  { month: 'Mar', customers: 168, revenue: 48000 },
  { month: 'Apr', customers: 195, revenue: 61000 },
  { month: 'May', customers: 220, revenue: 55000 },
  { month: 'Jun', customers: 248, revenue: 67000 },
  { month: 'Jul', customers: 280, revenue: 72000 },
  { month: 'Aug', customers: 305, revenue: 68000 },
  { month: 'Sep', customers: 332, revenue: 75000 },
  { month: 'Oct', customers: 365, revenue: 82000 },
  { month: 'Nov', customers: 398, revenue: 89000 },
  { month: 'Dec', customers: 435, revenue: 95000 },
];
