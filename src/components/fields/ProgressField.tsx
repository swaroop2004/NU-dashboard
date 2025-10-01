import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressFieldProps {
  value: number;
  className?: string;
  variant?: 'bar' | 'circle' | 'badge';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  showLabel?: boolean;
  labelPosition?: 'left' | 'right' | 'center';
  size?: 'sm' | 'md' | 'lg';
  max?: number;
}

export const ProgressField: React.FC<ProgressFieldProps> = ({
  value,
  className,
  variant = 'bar',
  color = 'blue',
  showLabel = true,
  labelPosition = 'right',
  size = 'sm',
  max = 100
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const labelClasses = {
    left: 'order-first mr-2',
    right: 'order-last ml-2',
    center: 'absolute inset-0 flex items-center justify-center'
  };

  if (variant === 'badge') {
    return (
      <div className={cn(
        'inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium',
        colorClasses[color],
        percentage >= 80 ? 'text-white' : 'text-white',
        className
      )}>
        {value}{max === 100 ? '%' : `/${max}`}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={colorClasses[color]}
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        {showLabel && (
          <span className="absolute text-xs font-medium text-gray-700">
            {value}{max === 100 ? '%' : ''}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center', className)}>
      {showLabel && labelPosition === 'left' && (
        <span className={cn('text-sm text-gray-600', labelClasses.left)}>
          {value}{max === 100 ? '%' : `/${max}`}
        </span>
      )}
      
      <div className={cn('w-full bg-gray-200 rounded-full', sizeClasses[size])}>
        <div
          className={cn(
            colorClasses[color],
            'rounded-full transition-all duration-300 ease-in-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showLabel && labelPosition === 'right' && (
        <span className={cn('text-sm text-gray-600', labelClasses.right)}>
          {value}{max === 100 ? '%' : `/${max}`}
        </span>
      )}
    </div>
  );
};