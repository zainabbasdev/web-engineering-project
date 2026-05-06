import React from 'react';
import { Button } from './Button';

/**
 * ConfirmDialog - Modal confirmation dialog for destructive actions
 */
export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        {/* Header */}
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-neutral-600 text-sm mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white text-sm font-medium transition ${
              isDanger
                ? 'bg-danger-600 hover:bg-danger-700'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
