import axios from 'axios';
// import { store } from '../store'; // Remove this import
import { logout } from '../store/slices/authSlice';
import { setMessage } from "../store/slices/notificationSlice"; // Import the setMessage action

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://donation.toolvid.in/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Store a reference to the navigate function (to be set later)
let navigateRef = null;
let dispatchRef = null;

// Function to set navigate (to be called from a React component)
export const setAxiosNavigate = (navigate) => {
  navigateRef = navigate;
};

// New: Function to set dispatch (to be called from a React component)
export const setAxiosDispatch = (dispatch) => {
  dispatchRef = dispatch;
};

// Request interceptor (adds token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handles 401 errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Dispatch the logout action and show message
      if (dispatchRef) {
        dispatchRef(logout());
        dispatchRef(setMessage("Your session has expired. Please log in again.")); // Dispatch the message
      }

      if (navigateRef) {
        navigateRef('/login'); // Use React Router navigation (no reload)
      } else {
        window.location.href = "/login"; // Fallback (reloads)
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;