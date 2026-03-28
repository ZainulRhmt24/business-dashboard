import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export function KPICard({
  title,
  value,
  description,
  trend,
  icon,
}: KPICardProps) {
  return (
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-2xl">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            {trend && (
              <>
                {trend.isPositive ? (
                  <ArrowUp className="w-3 h-3 text-green-500" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-500" />
                )}
                <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
                  {trend.value}%
                </span>
              </>
            )}
            {description && (
              <span className="text-foreground/60 ml-auto">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
