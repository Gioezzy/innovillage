'use client';

import { Card, CardContent } from '../ui/card';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  iconColor = 'text-gray-600',
  trend,
}: StatsCardProps) {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground font-heading">
              {value}
            </p>

            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}

            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {trend.isPositive ? '↑' : '↓'} {trend.value}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  vs bulan lalu
                </span>
              </div>
            )}
          </div>

          <div className={`p-3 rounded-full bg-secondary/10 ${iconColor}`}>
            {React.isValidElement(icon)
              ? React.cloneElement(
                  icon as React.ReactElement<{ className?: string }>,
                  {
                    className: 'w-6 h-6',
                  }
                )
              : icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
