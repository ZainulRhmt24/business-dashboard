'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { KPICard } from '@/components/kpi-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { revenueData, categoryData } from '@/lib/mock-data';

export default function RevenuePage() {
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / revenueData.length);
  const maxRevenue = Math.max(...revenueData.map(item => item.revenue));
  const lastMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  const growthRate = Math.round(
    ((lastMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100
  );

  const periodData = {
    daily: revenueData.map(item => ({
      ...item,
      revenue: Math.round(item.revenue / 30),
      target: Math.round(item.target / 30),
    })),
    monthly: revenueData,
    yearly: [
      { month: '2023', revenue: 512000, target: 500000 },
      { month: '2024', revenue: 749000, target: 720000 },
    ],
  };

  const currentData = periodData[period];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Revenue Analytics</h1>
            <p className="text-foreground/60 mt-2">Track and analyze your revenue performance</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={period === 'daily' ? 'default' : 'outline'}
              onClick={() => setPeriod('daily')}
              size="sm"
            >
              Daily
            </Button>
            <Button
              variant={period === 'monthly' ? 'default' : 'outline'}
              onClick={() => setPeriod('monthly')}
              size="sm"
            >
              Monthly
            </Button>
            <Button
              variant={period === 'yearly' ? 'default' : 'outline'}
              onClick={() => setPeriod('yearly')}
              size="sm"
            >
              Yearly
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            description="All time"
            icon="💰"
          />
          <KPICard
            title="Average Revenue"
            value={`$${avgRevenue.toLocaleString()}`}
            description="Per period"
            icon="📊"
          />
          <KPICard
            title="Highest Revenue"
            value={`$${maxRevenue.toLocaleString()}`}
            description="Peak period"
            icon="🏆"
          />
          <KPICard
            title="Growth Rate"
            value={`${growthRate > 0 ? '+' : ''}${growthRate}%`}
            description="vs previous"
            trend={{ value: Math.abs(growthRate), isPositive: growthRate > 0 }}
            icon="📈"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Area Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Revenue by {period}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis stroke="var(--foreground)" />
                  <YAxis stroke="var(--foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--chart-1)"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue vs Target */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Revenue vs Target</CardTitle>
              <CardDescription>Performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentData}>
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
                  <Legend />
                  <Bar dataKey="revenue" fill="var(--chart-1)" name="Revenue" />
                  <Bar dataKey="target" fill="var(--chart-3)" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Sales distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {categoryData.map(category => (
                <div key={category.name} className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-foreground/60 mb-1">{category.name}</p>
                  <p className="text-2xl font-bold">{category.percentage}%</p>
                  <p className="text-xs text-foreground/60 mt-1">
                    ${Math.round(totalRevenue * (category.percentage / 100)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
