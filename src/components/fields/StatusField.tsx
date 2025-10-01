import React from 'react';
import { cn } from '@/lib/utils';
import { LeadStatus, PropertyStatus } from '@/types';

export interface StatusFieldProps {
  value: LeadStatus | PropertyStatus | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'dot' | 'pill';
}

const statusColorMap: Record<string, string> = {
  // Lead Status Colors
  [LeadStatus.HOT]: 'bg-red-100 text-red-800 border-red-200',
  [LeadStatus.WARM]: 'bg-orange-100 text-orange-800 border-orange-200',
  [LeadStatus.COLD]: 'bg-blue-100 text-blue-800 border-blue-200',
  [LeadStatus.NEW]: 'bg-green-100 text-green-800 border-green-200',
  [LeadStatus.FOLLOW_UP]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [LeadStatus.CONVERTED]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  [LeadStatus.LOST]: 'bg-gray-100 text-gray-800 border-gray-200',
  [LeadStatus.NURTURING]: 'bg-purple-100 text-purple-800 border-purple-200',
  
  // Property Status Colors
  [PropertyStatus.ACTIVE]: 'bg-green-100 text-green-800 border-green-200',
  [PropertyStatus.PRE_LAUNCH]: 'bg-blue-100 text-blue-800 border-blue-200',
  [PropertyStatus.UNDER_CONSTRUCTION]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [PropertyStatus.READY_TO_MOVE]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  [PropertyStatus.SOLD_OUT]: 'bg-gray-100 text-gray-800 border-gray-200',
  [PropertyStatus.ON_HOLD]: 'bg-orange-100 text-orange-800 border-orange-200'
};

const dotColorMap: Record<string, string> = {
  [LeadStatus.HOT]: 'bg-red-500',
  [LeadStatus.WARM]: 'bg-orange-500',
  [LeadStatus.COLD]: 'bg-blue-500',
  [LeadStatus.NEW]: 'bg-green-500',
  [LeadStatus.FOLLOW_UP]: 'bg-yellow-500',
  [LeadStatus.CONVERTED]: 'bg-emerald-500',
  [LeadStatus.LOST]: 'bg-gray-500',
  [LeadStatus.NURTURING]: 'bg-purple-500',
  
  [PropertyStatus.ACTIVE]: 'bg-green-500',
  [PropertyStatus.PRE_LAUNCH]: 'bg-blue-500',
  [PropertyStatus.UNDER_CONSTRUCTION]: 'bg-yellow-500',
  [PropertyStatus.READY_TO_MOVE]: 'bg-emerald-500',
  [PropertyStatus.SOLD_OUT]: 'bg-gray-500',
  [PropertyStatus.ON_HOLD]: 'bg-orange-500'
};

export const StatusField: React.FC<StatusFieldProps> = ({
  value,
  className,
  size = 'sm',
  variant = 'badge'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-sm'
  };

  const getStatusClasses = () => {
    return statusColorMap[value] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDotClasses = () => {
    return dotColorMap[value] || 'bg-gray-500';
  };

  if (variant === 'dot') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn('w-2 h-2 rounded-full', getDotClasses())} />
        <span className="text-sm text-gray-700">{value}</span>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={cn(
        'inline-flex items-center rounded-full',
        getStatusClasses(),
        sizeClasses[size],
        className
      )}>
        {value}
      </div>
    );
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-md border',
      getStatusClasses(),
      sizeClasses[size],
      className
    )}>
      {value}
    </span>
  );
};