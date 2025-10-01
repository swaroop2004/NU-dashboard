import React from 'react';
import { cn } from '@/lib/utils';

export interface TextFieldProps {
  value: string | number;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  truncate?: boolean;
  maxLength?: number;
  placeholder?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  value,
  className,
  variant = 'default',
  truncate = false,
  maxLength,
  placeholder = '-'
}) => {
  const displayValue = value || placeholder;
  const truncatedValue = maxLength && typeof displayValue === 'string' 
    ? displayValue.length > maxLength 
      ? `${displayValue.substring(0, maxLength)}...`
      : displayValue
    : displayValue;

  const variantClasses = {
    default: 'text-gray-900',
    primary: 'text-blue-600 font-medium',
    secondary: 'text-gray-600',
    accent: 'text-purple-600 font-semibold'
  };

  return (
    <span 
      className={cn(
        'text-sm',
        variantClasses[variant],
        truncate && 'truncate',
        className
      )}
    >
      {truncatedValue}
    </span>
  );
};