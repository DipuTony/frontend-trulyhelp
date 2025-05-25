import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInterceptor";

// Get payment statuses
export const fetchPaymentStatuses = createAsyncThunk(
  "master/fetchPaymentStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/master/payment-statuses");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get payment methods
export const fetchPaymentMethods = createAsyncThunk(
  "master/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/master/payment-methods");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  paymentStatuses: [],
  paymentMethods: [],
  loading: false,
  error: null
};

const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    clearMasterError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Payment Statuses
      .addCase(fetchPaymentStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatuses = action.payload;
      })
      .addCase(fetchPaymentStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Payment Methods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMasterError } = masterSlice.actions;
export default masterSlice.reducer;