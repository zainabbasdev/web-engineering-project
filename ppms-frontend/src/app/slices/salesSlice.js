import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
  filters: { fuelType: null, shift: null, startDate: null, endDate: null },
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSalesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setSalesData: (state, action) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination || state.pagination;
      state.loading = false;
    },
    setSalesError: (state, action) => {
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
    addSale: (state, action) => {
      state.data.unshift(action.payload);
    },
    updateSale: (state, action) => {
      const index = state.data.findIndex((s) => s._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteSale: (state, action) => {
      state.data = state.data.filter((s) => s._id !== action.payload);
    },
  },
});

export const {
  setSalesLoading,
  setSalesData,
  setSalesError,
  setFilters,
  setPagination,
  addSale,
  updateSale,
  deleteSale,
} = salesSlice.actions;

export default salesSlice.reducer;
