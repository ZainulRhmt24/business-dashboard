'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { revenueData, customerGrowthData, categoryData, customerData } from '@/lib/mock-data';
import { Download, Filter } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'comparison'>('summary');
  const [dateRange, setDateRange] = useState<'30days' | '90days' | 'ytd' | 'custom'>('30days');

  // Generate custom report data based on filters
  const getReportData = () => {
    const lastRevenueItems = revenueData.slice(-3);
    const totalRevenue = lastRevenueItems.reduce((sum, item) => sum + item.revenue, 0);
    const avgRevenue = Math.round(totalRevenue / lastRevenueItems.length);

    const lastCustomerItems = customerGrowthData.slice(-3);
    const customerIncrease =
      lastCustomerItems[lastCustomerItems.length - 1].customers -
      lastCustomerItems[0].customers;

    const activeCustomers = customerData.filter(c => c.status === 'active').length;

    return {
      totalRevenue,
      avgRevenue,
      customerIncrease,
      activeCustomers,
      topCategory: categoryData[0],
    };
  };

  const reportData = getReportData();

  const generatePDF = () => {
    window.print();
  };

  const generateCSV = () => {
    const headers = ['Month', 'Revenue', 'Target', 'Variance', 'Performance (%)'];
    const csvContent = [
      headers.join(','),
      ...revenueData.map(item => {
        const variance = item.revenue - item.target;
        const performance = Math.round((item.revenue / item.target) * 100);
        return `${item.month},${item.revenue},${item.target},${variance},${performance}`;
      })
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `financial-report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-foreground/60 mt-2">Generate custom reports and export data</p>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter size={20} />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Report Type
              </label>
              <div className="flex flex-wrap gap-2">
                {['summary', 'detailed', 'comparison'].map(type => (
                  <Button
                    key={type}
                    variant={reportType === type ? 'default' : 'outline'}
                    onClick={() => setReportType(type as any)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Date Range
              </label>
              <div className="flex flex-wrap gap-2">
                {['30days', '90days', 'ytd', 'custom'].map(range => (
                  <Button
                    key={range}
                    variant={dateRange === range ? 'default' : 'outline'}
                    onClick={() => setDateRange(range as any)}
                  >
                    {range === '30days'
                      ? 'Last 30 Days'
                      : range === '90days'
                        ? 'Last 90 Days'
                        : range === 'ytd'
                          ? 'Year to Date'
                          : 'Custom Range'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={generatePDF} variant="outline" className="gap-2">
                <Download size={16} />
                Export PDF
              </Button>
              <Button onClick={generateCSV} variant="outline" className="gap-2">
                <Download size={16} />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-sm text-foreground/60 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold">${reportData.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-foreground/60 mt-2">Last {
                dateRange === '30days' ? '30 days' : dateRange === '90days' ? '90 days' : 'year'
              }</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-sm text-foreground/60 mb-1">Average Daily Revenue</div>
              <div className="text-2xl font-bold">${reportData.avgRevenue.toLocaleString()}</div>
              <div className="text-xs text-foreground/60 mt-2">Daily average</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-sm text-foreground/60 mb-1">Customer Growth</div>
              <div className="text-2xl font-bold">+{reportData.customerIncrease}</div>
              <div className="text-xs text-foreground/60 mt-2">New customers</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-sm text-foreground/60 mb-1">Active Customers</div>
              <div className="text-2xl font-bold">{reportData.activeCustomers}</div>
              <div className="text-xs text-foreground/60 mt-2">Current active</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis stroke="var(--foreground)" />
                  <YAxis stroke="var(--foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Customer Trend */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Customer Acquisition</CardTitle>
              <CardDescription>New customers added</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerGrowthData.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis stroke="var(--foreground)" />
                  <YAxis stroke="var(--foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                    }}
                  />
                  <Bar dataKey="customers" fill="var(--chart-1)" name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Key metrics by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Sales by Category</h3>
                <div className="space-y-3">
                  {categoryData.map((category, index) => (
                    <div key={category.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{category.name}</p>
                        <div className="w-full h-2 bg-muted rounded-full mt-1">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${category.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-foreground w-12 text-right">
                        {category.percentage}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Data Table */}
        {reportType === 'detailed' && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Detailed Financial Report</CardTitle>
              <CardDescription>Month-by-month breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Month
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Revenue
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Target</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Variance
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map(item => {
                      const variance = item.revenue - item.target;
                      const performance = Math.round((item.revenue / item.target) * 100);

                      return (
                        <tr key={item.month} className="border-b border-border/50">
                          <td className="py-3 px-4 font-medium text-foreground">{item.month}</td>
                          <td className="py-3 px-4 text-foreground">
                            ${item.revenue.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-foreground">
                            ${item.target.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={
                                variance > 0 ? 'text-green-600' : 'text-red-600'
                              }
                            >
                              {variance > 0 ? '+' : ''} ${variance.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full">
                                <div
                                  className={`h-full rounded-full ${
                                    performance >= 100
                                      ? 'bg-green-500'
                                      : performance >= 90
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(performance, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold">{performance}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
