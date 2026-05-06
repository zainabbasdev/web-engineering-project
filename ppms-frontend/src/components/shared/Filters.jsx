import React from 'react';
import { Input } from '../ui/Input';

/**
 * SearchBar Component
 */
export const SearchBar = ({ placeholder = 'Search...', onSearch, debounceMs = 300, className }) => {
  const [value, setValue] = React.useState('');
  const timeoutRef = React.useRef(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSearch?.(newValue);
    }, debounceMs);
  };

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className={className}
    />
  );
};

/**
 * FilterDropdown Component
 */
export const FilterDropdown = ({ label, options, value, onChange, className }) => {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * DateRangeFilter Component
 */
export const DateRangeFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange, className }) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
