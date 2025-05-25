import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import donationReducer from "./slices/donationSlice"
import volunteerReducer from "./slices/volunteerSlice"
import expenseReducer from "./slices/expenseSlice"
import notificationReducer from "./slices/notificationSlice"
import masterReducer from "./slices/masterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    donations: donationReducer,
    volunteers: volunteerReducer,
    expenses: expenseReducer,
    notifications: notificationReducer,
    master: masterReducer,
  },
})
