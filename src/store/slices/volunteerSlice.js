import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInterceptor";

// Get all volunteers
export const fetchVolunteers = createAsyncThunk(
  "volunteers/fetchVolunteers",
  async (role, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/view-all?role=${role}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add new user (donor / volunteer /admin)
export const addVolunteer = createAsyncThunk(
  "volunteers/addVolunteer",
  async (volunteerData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/create", volunteerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update volunteer
export const updateVolunteer = createAsyncThunk(
  "volunteers/updateVolunteer",
  async ({ id, volunteerData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, volunteerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Search volunteer
export const searchVolunteers = createAsyncThunk(
  "volunteers/search",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/volunteers/search?q=${query}`);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to search volunteers");
    }
  }
);

export const fetchICard = createAsyncThunk(
  "volunteers/fetchICard",
  async (userId, { rejectWithValue }) => {
    try {
      let url = "/user/view-icard";
      if (userId) {
        url += `?userId=${userId}`;
      }
      const response = await axiosInstance.get(url);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const requestICard = createAsyncThunk(
  "volunteers/requestICard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/request-icard");
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchICardList = createAsyncThunk(
  "volunteers/fetchICardList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/icard-list");
      return response.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  volunteers: [],
  iCardList: null,
  iCardData: null,
  iCardRequested: false,
  loading: false,
  error: null
};

const volunteerSlice = createSlice({
  name: "volunteers",
  initialState,
  reducers: {
    clearVolunteerError: (state) => {
      state.error = null;
    },
    resetICardRequested: (state) => {
      state.iCardRequested = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Search volunteers
      .addCase(searchVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers = action.payload;
      })
      .addCase(searchVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch volunteers
      .addCase(fetchVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers = action.payload;
      })
      .addCase(fetchVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add volunteer
      .addCase(addVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers.push(action.payload);
      })
      .addCase(addVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update volunteer
      .addCase(updateVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.volunteers.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.volunteers[index] = action.payload;
        }
      })
      .addCase(updateVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch ICard
      .addCase(fetchICard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchICard.fulfilled, (state, action) => {
        state.loading = false;
        state.iCardData = action.payload;
      })
      .addCase(fetchICard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Request ICard
      .addCase(requestICard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestICard.fulfilled, (state) => {
        state.loading = false;
        state.iCardRequested = true;
      })
      .addCase(requestICard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch ICard List
      .addCase(fetchICardList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchICardList.fulfilled, (state, action) => {
        state.loading = false;
        state.iCardList = action.payload;
      })
      .addCase(fetchICardList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearVolunteerError, resetICardRequested } = volunteerSlice.actions;
export default volunteerSlice.reducer;