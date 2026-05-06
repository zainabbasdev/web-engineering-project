import React, { useState } from 'react';
import clsx from 'clsx';

/**
 * Modal Component - Overlay dialog with content
 */
export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', closeButton = true }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className={clsx('relative bg-white rounded-xl shadow-lg w-full mx-4 max-h-[90vh] overflow-y-auto', sizes[size])}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-neutral-100 bg-white">
          <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
          {closeButton && (
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-100 bg-neutral-50">{footer}</div>}
      </div>
    </div>
  );
};

/**
 * ConfirmDialog - Confirmation modal with action buttons
 */
export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50',
              isDangerous
                ? 'bg-danger-600 text-white hover:bg-danger-700'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            )}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </>
      }
    >
      <p className="text-neutral-700">{message}</p>
    </Modal>
  );
};

/**
 * Toast Notification
 */
export const Toast = ({ message, type = 'info', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-danger-50 border-danger-200 text-danger-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
  };

  return (
    <div className={clsx('fixed bottom-4 right-4 z-50 p-4 border rounded-lg', bgColors[type])}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Modal;
