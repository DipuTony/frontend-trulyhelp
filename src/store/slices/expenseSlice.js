import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Get all expenses
export const fetchExpenses = createAsyncThunk("expenses/fetchExpenses", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/expenses")
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Add new expense
export const addExpense = createAsyncThunk("expenses/addExpense", async (expenseData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/expenses", expenseData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Update expense
export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/expenses/${id}`, expenseData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

// Delete expense
export const deleteExpense = createAsyncThunk("expenses/deleteExpense", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/expenses/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

const initialState = {
  expenses: [],
  loading: false,
  error: null,
}

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    clearExpenseError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses cases
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false
        state.expenses = action.payload
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch expenses"
      })
      // Add expense cases
      .addCase(addExpense.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false
        state.expenses.push(action.payload)
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to add expense"
      })
      // Update expense cases
      .addCase(updateExpense.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false
        const index = state.expenses.findIndex((e) => e.id === action.payload.id)
        if (index !== -1) {
          state.expenses[index] = action.payload
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to update expense"
      })
      // Delete expense cases
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false
        state.expenses = state.expenses.filter((e) => e.id !== action.payload)
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to delete expense"
      })
  },
})

export const { clearExpenseError } = expenseSlice.actions
export default expenseSlice.reducer
