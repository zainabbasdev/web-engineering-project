import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
  filters: { role: null, status: 'active' },
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeeLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setEmployeeData: (state, action) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination || state.pagination;
      state.loading = false;
    },
    setEmployeeError: (state, action) => {
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
    addEmployee: (state, action) => {
      state.data.unshift(action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.data.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteEmployee: (state, action) => {
      state.data = state.data.filter((e) => e._id !== action.payload);
    },
  },
});

export const {
  setEmployeeLoading,
  setEmployeeData,
  setEmployeeError,
  setFilters,
  setPagination,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
