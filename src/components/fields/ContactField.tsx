import React from 'react';
import { cn } from '@/lib/utils';

export interface ContactFieldProps {
  phone?: string;
  email?: string;
  variant?: 'phone' | 'email' | 'both' | 'compact';
  showIcons?: boolean;
  className?: string;
  onPhoneClick?: (phone: string) => void;
  onEmailClick?: (email: string) => void;
}

export const ContactField: React.FC<ContactFieldProps> = ({
  phone,
  email,
  variant = 'both',
  showIcons = true,
  className,
  onPhoneClick,
  onEmailClick
}) => {
  const formatPhone = (phone: string) => {
    // Basic phone formatting - can be enhanced based on locale
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const handlePhoneClick = () => {
    if (phone && onPhoneClick) {
      onPhoneClick(phone);
    } else if (phone) {
      window.open(`tel:${phone}`);
    }
  };

  const handleEmailClick = () => {
    if (email && onEmailClick) {
      onEmailClick(email);
    } else if (email) {
      window.open(`mailto:${email}`);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-gray-600', className)}>
        {phone && (
          <button
            onClick={handlePhoneClick}
            className="hover:text-blue-600 transition-colors"
            title={`Call ${formatPhone(phone)}`}
          >
            {showIcons && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            )}
            {!showIcons && formatPhone(phone)}
          </button>
        )}
        {phone && email && <span className="text-gray-400">•</span>}
        {email && (
          <button
            onClick={handleEmailClick}
            className="hover:text-blue-600 transition-colors"
            title={`Email ${email}`}
          >
            {showIcons && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
            {!showIcons && email}
          </button>
        )}
      </div>
    );
  }

  if (variant === 'phone') {
    return (
      <div className={className}>
        {phone ? (
          <button
            onClick={handlePhoneClick}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
          >
            {showIcons && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            )}
            {formatPhone(phone)}
          </button>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </div>
    );
  }

  if (variant === 'email') {
    return (
      <div className={className}>
        {email ? (
          <button
            onClick={handleEmailClick}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
          >
            {showIcons && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
            {email}
          </button>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {phone && (
        <button
          onClick={handlePhoneClick}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
        >
          {showIcons && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          )}
          {formatPhone(phone)}
        </button>
      )}
      {email && (
        <button
          onClick={handleEmailClick}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
        >
          {showIcons && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
          {email}
        </button>
      )}
      {!phone && !email && (
        <span className="text-sm text-gray-400">-</span>
      )}
    </div>
  );
};