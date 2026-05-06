import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStockLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setStockData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    setStockError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setStockLoading, setStockData, setStockError } = stockSlice.actions;

export default stockSlice.reducer;
