import React from 'react';
import clsx from 'clsx';

/**
 * Input Component - Text input with validation states
 * Props: label, error, placeholder, type, disabled, required, icon
 */
export const Input = React.forwardRef(
  ({ label, error, icon: Icon, className, disabled, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            {label}
            {required && <span className="text-danger-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />}

          <input
            ref={ref}
            disabled={disabled}
            className={clsx(
              'w-full px-3 py-2 bg-white border rounded-lg text-base placeholder-neutral-400 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed',
              Icon && 'pl-10',
              error ? 'border-danger-500 focus:ring-danger-500' : 'border-neutral-300 hover:border-neutral-400',
              className
            )}
            {...props}
          />
        </div>

        {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Select Component - Dropdown select
 */
export const Select = React.forwardRef(
  ({ label, error, options, disabled, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            {label}
            {required && <span className="text-danger-600 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          disabled={disabled}
          className={clsx(
            'w-full px-3 py-2 bg-white border rounded-lg text-base transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed',
            error ? 'border-danger-500 focus:ring-danger-500' : 'border-neutral-300 hover:border-neutral-400'
          )}
          {...props}
        >
          <option value="">Select an option</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

/**
 * TextArea Component - Multi-line text input
 */
export const TextArea = React.forwardRef(
  ({ label, error, disabled, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            {label}
            {required && <span className="text-danger-600 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          disabled={disabled}
          className={clsx(
            'w-full px-3 py-2 bg-white border rounded-lg text-base placeholder-neutral-400 resize-none transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed',
            error ? 'border-danger-500 focus:ring-danger-500' : 'border-neutral-300 hover:border-neutral-400'
          )}
          rows="4"
          {...props}
        />

        {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default Input;
