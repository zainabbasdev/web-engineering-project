import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
  error: null,
  filters: { startDate: null, endDate: null },
  fuelPrices: [],
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReportsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setReportsData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    setReportsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setFuelPrices: (state, action) => {
      state.fuelPrices = action.payload;
    },
  },
});

export const {
  setReportsLoading,
  setReportsData,
  setReportsError,
  setFilters,
  setFuelPrices,
} = reportsSlice.actions;

export default reportsSlice.reducer;
