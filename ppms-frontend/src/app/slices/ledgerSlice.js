import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  currentCustomer: null,
  transactions: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
  filters: { search: '' },
};

const ledgerSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    setLedgerLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCustomersData: (state, action) => {
      state.customers = action.payload.data;
      state.pagination = action.payload.pagination || state.pagination;
      state.loading = false;
    },
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = action.payload;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setLedgerError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    addCustomer: (state, action) => {
      state.customers.unshift(action.payload);
    },
    updateCustomerBalance: (state, action) => {
      const customer = state.customers.find((c) => c._id === action.payload.id);
      if (customer) {
        customer.balance = action.payload.balance;
      }
      if (state.currentCustomer?._id === action.payload.id) {
        state.currentCustomer.balance = action.payload.balance;
      }
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
      if (state.currentCustomer) {
        state.currentCustomer.balance = action.payload.netBalance;
      }
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter((t) => t._id !== action.payload.txId);
      if (state.currentCustomer) {
        state.currentCustomer.balance = action.payload.newBalance;
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter((c) => c._id !== action.payload);
    },
  },
});

export const {
  setLedgerLoading,
  setCustomersData,
  setCurrentCustomer,
  setTransactions,
  setLedgerError,
  setFilters,
  setPagination,
  addCustomer,
  updateCustomerBalance,
  addTransaction,
  deleteTransaction,
  deleteCustomer,
} = ledgerSlice.actions;

export default ledgerSlice.reducer;
