
import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  style?: React.CSSProperties;
  indicatorClassName?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend,
  className,
  style,
  indicatorClassName
}) => {
  return (
    <div 
      className={cn(
        "flex items-start p-4 bg-white rounded-2xl animate-fade-up shadow-sm hover:shadow-md transition-shadow", 
        className
      )}
      style={style}
    >
      <div className="flex-1">
        <h3 className="text-sm text-fitness-gray mb-1">{title}</h3>
        <div className="flex items-center">
          <span className="text-xl font-semibold mr-2">{value}</span>
          {trend && (
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-green-500" : "text-fitness-secondary",
              indicatorClassName
            )}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
      <div className="w-10 h-10 flex items-center justify-center bg-fitness-gray-light rounded-xl">
        {icon}
      </div>
    </div>
  );
};

// Default export for backward compatibility
export default StatsCard;
