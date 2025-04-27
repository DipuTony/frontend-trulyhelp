import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import axiosInstance from "../../utils/axiosInterceptor";

// Get all volunteers
export const fetchVolunteers = createAsyncThunk("volunteers/fetchVolunteers", async (role, { rejectWithValue }) => { // Accept role parameter
  try {
    const response = await axiosInstance.get(`/user/view-all?role=${role}`); // or `/user/${role}/view-all`
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
}
);

// Add new user (donor / volunteer /admin)
export const addVolunteer = createAsyncThunk("volunteers/addVolunteer", async (volunteerData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/user/create", volunteerData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Update volunteer
export const updateVolunteer = createAsyncThunk("volunteers/updateVolunteer",async ({ id, volunteerData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, volunteerData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)
// search volunteer
export const searchVolunteers = createAsyncThunk(
  "volunteers/search",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/volunteers/search?q=${query}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to search volunteers")
    }
  }
)


const initialState = {
  volunteers: [],
  loading: false,
  error: null,
}

const volunteerSlice = createSlice({
  name: "volunteers",
  initialState,
  reducers: {
    clearVolunteerError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(searchVolunteers.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(searchVolunteers.fulfilled, (state, action) => {
      state.loading = false
      state.volunteers = action.payload
    })
    .addCase(searchVolunteers.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
      // Fetch volunteers cases
      .addCase(fetchVolunteers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVolunteers.fulfilled, (state, action) => {
        state.loading = false
        state.volunteers = action.payload
      })
      .addCase(fetchVolunteers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch volunteers"
      })
      // Add volunteer cases
      .addCase(addVolunteer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addVolunteer.fulfilled, (state, action) => {
        state.loading = false
        state.volunteers.push(action.payload)
      })
      .addCase(addVolunteer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to add volunteer"
      })
      // Update volunteer cases
      .addCase(updateVolunteer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateVolunteer.fulfilled, (state, action) => {
        state.loading = false
        const index = state.volunteers.findIndex((v) => v.id === action.payload.id)
        if (index !== -1) {
          state.volunteers[index] = action.payload
        }
      })
      .addCase(updateVolunteer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to update volunteer"
      })
  },
})

export const { clearVolunteerError } = volunteerSlice.actions
export default volunteerSlice.reducer
