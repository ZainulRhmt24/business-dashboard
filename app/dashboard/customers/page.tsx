'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { KPICard } from '@/components/kpi-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { customerData, customerGrowthData } from '@/lib/mock-data';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'name' | 'revenue' | 'joinDate';
type SortOrder = 'asc' | 'desc';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>(
    'all'
  );

  // Calculate metrics
  const activeCustomers = customerData.filter(c => c.status === 'active').length;
  const totalRevenue = customerData.reduce((sum, c) => sum + c.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / customerData.length);
  const topCustomer = customerData.reduce((prev, current) =>
    prev.revenue > current.revenue ? prev : current
  );

  // Filter and sort data
  let filtered = customerData.filter(
    c =>
      (filterStatus === 'all' || c.status === filterStatus) &&
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  filtered.sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'revenue') {
      aVal = a.revenue;
      bVal = b.revenue;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-500/10', text: 'text-green-700', label: 'Active' },
      inactive: { bg: 'bg-gray-500/10', text: 'text-gray-700', label: 'Inactive' },
      pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-700', label: 'Pending' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Analytics</h1>
          <p className="text-foreground/60 mt-2">Manage and analyze your customer base</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Customers"
            value={customerData.length}
            description="All time"
            icon="👥"
          />
          <KPICard
            title="Active Customers"
            value={activeCustomers}
            description="Currently active"
            trend={{ value: 24.5, isPositive: true }}
            icon="✅"
          />
          <KPICard
            title="Average Revenue"
            value={`$${avgRevenue.toLocaleString()}`}
            description="Per customer"
            icon="💵"
          />
          <KPICard
            title="Top Customer"
            value={`$${topCustomer.revenue.toLocaleString()}`}
            description={topCustomer.name}
            icon="🏆"
          />
        </div>

        {/* Customer Growth Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>Customer acquisition trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--foreground)" />
                <YAxis stroke="var(--foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={false}
                  name="Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>View and manage all customers</CardDescription>
            <div className="mt-4 space-y-4">
              <div className="flex gap-2 flex-wrap">
                <div className="flex-1 relative min-w-64">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'active', 'inactive', 'pending'].map(status => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      onClick={() => setFilterStatus(status as any)}
                      size="sm"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
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
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        Customer <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      <button
                        onClick={() => toggleSort('revenue')}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        Revenue <SortIcon field="revenue" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">
                      <button
                        onClick={() => toggleSort('joinDate')}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        Joined <SortIcon field="joinDate" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map(customer => (
                      <tr
                        key={customer.id}
                        className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-foreground">{customer.name}</td>
                        <td className="py-3 px-4 text-foreground/60 hidden md:table-cell text-sm">
                          {customer.email}
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground">
                          ${customer.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-foreground/60 hidden lg:table-cell text-sm">
                          {new Date(customer.joinDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(customer.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-foreground/60">
                        No customers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-foreground/60">
              Showing {filtered.length} of {customerData.length} customers
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
