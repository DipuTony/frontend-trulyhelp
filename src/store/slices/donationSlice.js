import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Get all donations
export const fetchDonations = createAsyncThunk("donations/fetchDonations", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/donations")
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Add new donation
export const addDonation = createAsyncThunk("donations/addDonation", async (donationData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/donations", donationData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Verify donation
export const verifyDonation = createAsyncThunk("donations/verifyDonation", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/donations/${id}/verify`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Generate report
export const generateReport = createAsyncThunk("donations/generateReport", async (reportType, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/donations/report?type=${reportType}`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

const initialState = {
  donations: [],
  report: null,
  loading: false,
  error: null,
}

const donationSlice = createSlice({
  name: "donations",
  initialState,
  reducers: {
    clearDonationError: (state) => {
      state.error = null
    },
    clearReport: (state) => {
      state.report = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch donations cases
      .addCase(fetchDonations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.loading = false
        state.donations = action.payload
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch donations"
      })
      // Add donation cases
      .addCase(addDonation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addDonation.fulfilled, (state, action) => {
        state.loading = false
        state.donations.push(action.payload)
      })
      .addCase(addDonation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to add donation"
      })
      // Verify donation cases
      .addCase(verifyDonation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyDonation.fulfilled, (state, action) => {
        state.loading = false
        const index = state.donations.findIndex((d) => d.id === action.payload.id)
        if (index !== -1) {
          state.donations[index] = action.payload
        }
      })
      .addCase(verifyDonation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to verify donation"
      })
      // Generate report cases
      .addCase(generateReport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false
        state.report = action.payload
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to generate report"
      })
  },
})

export const { clearDonationError, clearReport } = donationSlice.actions
export default donationSlice.reducer
