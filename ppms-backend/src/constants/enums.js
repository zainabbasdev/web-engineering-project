// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant'
};

// Fuel Types
export const FUEL_TYPES = {
  PETROL: 'Petrol',
  DIESEL: 'Diesel',
  CNG: 'CNG'
};

// Shift Types
export const SHIFTS = {
  DAY: 'Day',
  NIGHT: 'Night'
};

// Employee Roles
export const EMPLOYEE_ROLES = {
  ATTENDANT: 'Attendant',
  MANAGER: 'Manager',
  GUARD: 'Guard',
  CLEANER: 'Cleaner'
};

// Expense Categories
export const EXPENSE_CATEGORIES = {
  ELECTRICITY: 'Electricity',
  MAINTENANCE: 'Maintenance',
  SALARY: 'Salary',
  MISCELLANEOUS: 'Miscellaneous'
};

// Transaction Types (Customer Ledger)
export const TRANSACTION_TYPES = {
  UDHAR: 'Udhar',      // Credit given
  WAPSI: 'Wapsi',      // Payment received
  NIL: 'NIL'           // Settlement
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
  DUPLICATE_EMAIL: 'Email already exists',
  DUPLICATE_CNIC: 'CNIC already exists'
};
