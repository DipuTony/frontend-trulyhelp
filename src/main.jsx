import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import axios from "axios"

// // Set up axios defaults
// axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://donation.toolvid.in/"
// axios.defaults.headers.common["Content-Type"] = "application/json"

// // Add token to requests if available
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
