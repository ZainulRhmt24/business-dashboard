'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { KPICard } from '@/components/kpi-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { inventoryData } from '@/lib/mock-data';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';

type SortField = 'name' | 'quantity' | 'value';
type SortOrder = 'asc' | 'desc';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('quantity');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showLowStock, setShowLowStock] = useState(false);

  // Calculate metrics
  const totalValue = inventoryData.reduce((sum, item) => sum + item.value, 0);
  const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventoryData.filter(item => item.quantity <= item.reorderLevel);
  const avgInventoryValue = Math.round(totalValue / inventoryData.length);

  // Filter and sort data
  let filtered = inventoryData.filter(
    item =>
      !showLowStock ||
      item.quantity <= item.reorderLevel ||
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  filtered = filtered.filter(
    item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filtered.sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const stockPercentage = (item: typeof inventoryData[0]) => {
    return Math.round((item.quantity / (item.reorderLevel * 3)) * 100);
  };

  const getStockStatus = (item: typeof inventoryData[0]) => {
    if (item.quantity <= item.reorderLevel) {
      return { color: 'bg-red-500', label: 'Low Stock', icon: AlertTriangle };
    }
    if (item.quantity <= item.reorderLevel * 1.5) {
      return { color: 'bg-yellow-500', label: 'Medium Stock', icon: AlertTriangle };
    }
    return { color: 'bg-green-500', label: 'Good Stock', icon: CheckCircle };
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-foreground/60 mt-2">Track stock levels and inventory value</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Items"
            value={totalItems}
            description="In stock"
            icon="📦"
          />
          <KPICard
            title="Inventory Value"
            value={`$${totalValue.toLocaleString()}`}
            description="Total worth"
            icon="💵"
          />
          <KPICard
            title="Low Stock Items"
            value={lowStockItems.length}
            description="Need reorder"
            trend={{ value: lowStockItems.length > 0 ? 1 : 0, isPositive: false }}
            icon="⚠️"
          />
          <KPICard
            title="Avg Item Value"
            value={`$${avgInventoryValue.toLocaleString()}`}
            description="Per item"
            icon="📊"
          />
        </div>

        {/* Stock Distribution Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
            <CardDescription>Inventory quantity by item</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--foreground)"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="var(--foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Legend />
                <Bar dataKey="quantity" fill="var(--chart-1)" name="Current Stock" />
                <Bar dataKey="reorderLevel" fill="var(--chart-3)" name="Reorder Level" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
            <div className="mt-4 space-y-4">
              <div className="flex gap-2 flex-wrap">
                <div className="flex-1 relative min-w-64">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
                  <Input
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant={showLowStock ? 'default' : 'outline'}
                  onClick={() => setShowLowStock(!showLowStock)}
                  size="sm"
                >
                  {showLowStock ? 'Low Stock Only' : 'All Items'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      <button
                        onClick={() => toggleSort('name')}
                        className="hover:text-primary transition-colors"
                      >
                        Product
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">
                      SKU
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      <button
                        onClick={() => toggleSort('quantity')}
                        className="hover:text-primary transition-colors"
                      >
                        Quantity
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">
                      Reorder Level
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      <button
                        onClick={() => toggleSort('value')}
                        className="hover:text-primary transition-colors"
                      >
                        Value
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map(item => {
                      const status = getStockStatus(item);
                      const StatusIcon = status.icon;

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-foreground">{item.name}</td>
                          <td className="py-3 px-4 text-foreground/60 hidden md:table-cell text-sm font-mono">
                            {item.sku}
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="font-semibold text-foreground">{item.quantity}</div>
                              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    item.quantity <= item.reorderLevel
                                      ? 'bg-red-500'
                                      : item.quantity <= item.reorderLevel * 1.5
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                  }`}
                                  style={{
                                    width: `${Math.min(stockPercentage(item), 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-foreground/60 hidden lg:table-cell text-sm">
                            {item.reorderLevel}
                          </td>
                          <td className="py-3 px-4 font-semibold text-foreground">
                            ${item.value.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${status.color}`} />
                              <span className="text-xs text-foreground/60 hidden sm:inline">
                                {status.label}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-foreground/60">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-foreground/60">
              Showing {filtered.length} of {inventoryData.length} items
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
