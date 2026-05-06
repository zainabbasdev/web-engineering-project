import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import inventoryReducer from './slices/inventorySlice.js';
import salesReducer from './slices/salesSlice.js';
import stockReducer from './slices/stockSlice.js';
import employeeReducer from './slices/employeeSlice.js';
import expenseReducer from './slices/expenseSlice.js';
import ledgerReducer from './slices/ledgerSlice.js';
import reportsReducer from './slices/reportsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    sales: salesReducer,
    stock: stockReducer,
    employee: employeeReducer,
    expense: expenseReducer,
    ledger: ledgerReducer,
    reports: reportsReducer,
  },
});

export default store;
