import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedId: null,
  loading: false,
  filters: {
    fuelType: null,
    startDate: null,
    endDate: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    addItem: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex((item) => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
  },
});

export const {
  setItems,
  setLoading,
  setFilters,
  setPagination,
  addItem,
  updateItem,
  removeItem,
  setSelectedId,
} = inventorySlice.actions;

export default inventorySlice.reducer;
