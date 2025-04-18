import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store"

// Auth Pages
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard"
import UserManagement from "./pages/admin/UserManagement"
import DonationList from "./pages/admin/DonationList"
import ExpenseManagement from "./pages/admin/ExpenseManagement"
import PaymentVerification from "./pages/admin/PaymentVerification"
import ReportGenerator from "./pages/admin/ReportGenerator"
import NotificationPanel from "./pages/admin/NotificationPanel"

// Volunteer Pages
import VolunteerDashboard from "./pages/volunteer/Dashboard"
import AddDonation from "./pages/volunteer/AddDonation"
import VolunteerDonationHistory from "./pages/volunteer/VolunteerDonationHistory"
import VolunteerUploadSettlement from "./pages/volunteer/VolunteerUploadSettlement"

// Donor Pages
import DonateNow from "./pages/donor/DonateNow"
import DonorDonationHistory from "./pages/donor/DonorDonationHistory"
import DonorDashboard from "./pages/donor/Dashboard"

// Guest Pages
import GuestDonationNow from "./pages/guest/GuestDonateNow"

// Layout Components
import AdminLayout from "./components/layouts/AdminLayout"
import VolunteerLayout from "./components/layouts/VolunteerLayout"
import DonorLayout from "./components/layouts/DonorLayout"
import GuestLayout from "./components/layouts/GuestLayout"

// Auth Guard Component
import ProtectedRoute from "./components/auth/ProtectedRoute"
import PaymentFailed from "./pages/guest/PaymentFailed"
import PaymentSuccess from "./pages/guest/PaymentSuccess"
import Profile from "./pages/donor/Profile"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="donations" element={<DonationList />} />
            <Route path="users/:role?" element={<UserManagement />} />
            <Route path="users/:role?/:userId?" element={"vol;uinter details"} />
            {/* <Route path="expenses" element={<ExpenseManagement />} /> */}
            <Route path="payment-verification" element={<PaymentVerification />} />
            <Route path="reports" element={<ReportGenerator />} />
            <Route path="notifications" element={<NotificationPanel />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-donation" element={<AddDonation usedFor="admin"/>} />
          </Route>

          {/* Volunteer Routes */}
          <Route
            path="/volunteer"
            element={
              <ProtectedRoute role="volunteer">
                <VolunteerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<VolunteerDashboard />} />
            <Route path="add-donation" element={<AddDonation usedFor="volunteer"/>} />
            <Route path="donation-history" element={<VolunteerDonationHistory />} />
            <Route path="upload-settlement" element={<VolunteerUploadSettlement />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Donor Routes */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute role="donor">
                <DonorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DonorDashboard />} />
            <Route path="history" element={<DonorDonationHistory />} />
            <Route path="donate" element={<DonateNow />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Guest Routes */}
          <Route path="/" element={<GuestLayout />}>
            <Route index element={<GuestDonationNow />} />
            <Route path="payment/success" element={<PaymentSuccess />} />
            <Route path="payment/failed" element={<PaymentFailed />} />
          </Route>

          {/* Redirect to login if no route matches */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
