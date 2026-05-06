import React, { useEffect, useState } from 'react';

/**
 * Toast - Notification toast component (singleton-like behavior)
 */
let toastCallback = null;

export const useToast = () => {
  const [, setToastUpdate] = useState(0);

  return {
    show: (message, type = 'info', duration = 3000) => {
      if (toastCallback) {
        toastCallback({ message, type, duration });
        setToastUpdate((prev) => prev + 1);
      }
    },
  };
};

export const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastCallback = ({ message, type, duration }) => {
      const id = Date.now();
      const toast = { id, message, type };
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg text-sm font-medium text-white shadow-lg animate-fade-in ${
            toast.type === 'success' ? 'bg-success-600' :
            toast.type === 'error' ? 'bg-danger-600' :
            toast.type === 'warning' ? 'bg-warning-600' :
            'bg-primary-600'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
