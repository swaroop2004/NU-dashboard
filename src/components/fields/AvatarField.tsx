import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarFieldProps {
  name: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square';
  showInitials?: boolean;
  src?: string;
  className?: string;
  fallbackClassName?: string;
}

export const AvatarField: React.FC<AvatarFieldProps> = ({
  name,
  email,
  size = 'md',
  variant = 'circle',
  showInitials = true,
  src,
  className,
  fallbackClassName
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500 text-white',
      'bg-green-500 text-white',
      'bg-purple-500 text-white',
      'bg-pink-500 text-white',
      'bg-yellow-500 text-white',
      'bg-red-500 text-white',
      'bg-indigo-500 text-white',
      'bg-teal-500 text-white'
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <div className={cn(
        'relative overflow-hidden bg-gray-100',
        sizeClasses[size],
        shapeClasses[variant],
        className
      )}>
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center justify-center font-medium',
      sizeClasses[size],
      shapeClasses[variant],
      getAvatarColor(name),
      fallbackClassName,
      className
    )}>
      {showInitials ? getInitials(name) : name.slice(0, 2)}
    </div>
  );
};