import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  notifications: [],
  loading: false,
  error: null,
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    sendNotification: (state, action) => {
      // This is a mock action since no backend is required for notifications
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        sentAt: new Date().toISOString(),
      })
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setMessage: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        type: 'info',
        message: action.payload,
        sentAt: new Date().toISOString(),
      });
    },
  },
})

export const { sendNotification, clearNotifications, setMessage } = notificationSlice.actions
export default notificationSlice.reducer
