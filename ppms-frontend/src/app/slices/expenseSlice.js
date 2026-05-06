import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
  filters: { category: null, month: null },
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setExpenseLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setExpenseData: (state, action) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination || state.pagination;
      state.loading = false;
    },
    setExpenseError: (state, action) => {
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
    addExpense: (state, action) => {
      state.data.unshift(action.payload);
    },
    updateExpense: (state, action) => {
      const index = state.data.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteExpense: (state, action) => {
      state.data = state.data.filter((e) => e._id !== action.payload);
    },
  },
});

export const {
  setExpenseLoading,
  setExpenseData,
  setExpenseError,
  setFilters,
  setPagination,
  addExpense,
  updateExpense,
  deleteExpense,
} = expenseSlice.actions;

export default expenseSlice.reducer;
