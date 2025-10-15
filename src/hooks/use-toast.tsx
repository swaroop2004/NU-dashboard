import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'destructive';
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCount}`;
    const newToast: Toast = {
      id,
      variant: 'default',
      ...props,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toast,
    toasts,
    dismiss,
  };
}

// Simple toast component for displaying notifications
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`
                bg-white border rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]
                ${toast.variant === 'destructive' ? 'border-red-200 bg-red-50' : 'border-gray-200'}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {toast.title && (
                    <h3 className="font-semibold text-gray-900 mb-1">{toast.title}</h3>
                  )}
                  <p className={`text-sm ${toast.variant === 'destructive' ? 'text-red-700' : 'text-gray-600'}`}>
                    {toast.description}
                  </p>
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}