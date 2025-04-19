import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Login thunk
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post("/auth/login", credentials)
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Register thunk
export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/auth/register", userData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Profile thunks
export const getProfile = createAsyncThunk("auth/profile", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/auth/profile")
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateProfile = createAsyncThunk("auth/updateProfile", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.put("/auth/profile", userData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const changePassword = createAsyncThunk("auth/changePassword", async (passwords, { rejectWithValue }) => {
  try {
    const response = await axios.post("/auth/change-password", passwords)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Get stored user data
const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null

const initialState = {
  user: storedUser,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Login failed"
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Registration failed"
      })
      // Profile cases
      .addCase(getProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch profile"
      })
      // Update Profile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to update profile"
      })
      // Change Password cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to change password"
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
