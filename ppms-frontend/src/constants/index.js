// API base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
};

// Fuel types (for options dropdowns)
export const FUEL_TYPES = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'CNG', label: 'CNG' },
];

// Shifts
export const SHIFTS = [
  { value: 'Day', label: 'Day' },
  { value: 'Night', label: 'Night' },
];

// Employee roles
export const EMPLOYEE_ROLES = [
  { value: 'Attendant', label: 'Attendant' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Guard', label: 'Guard' },
  { value: 'Cleaner', label: 'Cleaner' },
];

// Expense categories
export const EXPENSE_CATEGORIES = [
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Salary', label: 'Salary' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
];

// Transaction types
export const TRANSACTION_TYPES = {
  UDHAR: 'Udhar',
  WAPSI: 'Wapsi',
  NIL: 'NIL',
};

// Navigation items - Role-based access control
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', roles: ['admin'] },
  { id: 'inventory', label: 'Inventory', path: '/inventory', roles: ['admin', 'manager'] },
  { id: 'sales', label: 'Sales', path: '/sales', roles: ['admin', 'manager'] },
  { id: 'stock', label: 'Stock', path: '/stock', roles: ['admin', 'manager'] },
  { id: 'employees', label: 'Employees', path: '/employees', roles: ['admin'] },
  { id: 'expenses', label: 'Expenses', path: '/expenses', roles: ['admin', 'accountant'] },
  { id: 'ledger', label: 'Ledger', path: '/ledger', roles: ['admin', 'accountant'] },
  { id: 'reports', label: 'Reports', path: '/reports', roles: ['admin', 'manager', 'accountant'] },
];

// Format currency
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
  }).format(value);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
