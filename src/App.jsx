import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./components/common/ErrorBoundary"

// Auth Pages
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard"
// import UserManagement from "./pages/admin/UserManagement"
import DonationList from "./pages/admin/Donations/DonationList"
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
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import ToastNotification from "./components/common/ToastNotification"
import { useEffect } from "react"
import { setAxiosNavigate, setAxiosDispatch } from "./utils/axiosInterceptor"

// Guest Pages
import GuestIndex from "./pages/guest/GuestIndex"
import DonationSettings from "./pages/admin/DonationSettings/DonationSettings"
import UserDetails from "./pages/admin/Users/UserDetails"
import IdCardList from "./pages/admin/IdCard/IdCardList"
import ICardVolunteer from "./pages/volunteer/ICardVolunteer"
import DonorRegistration from "./pages/admin/Donors/DonorRegistration"
import DonorList from "./pages/admin/Donors/DonorList"
import DonateNowOffline from "./pages/admin/Donations/DonateNowOffline"
import SearchDonor from "./pages/volunteer/SearchDonor"
import EmailVerification from "./pages/auth/EmailVerification"
import AdminManagement from "./pages/admin/AdminManagement"
import VolunteerManagement from "./pages/admin/VolunteerManagement"
// import HomePage from "./pages/guest/HomePage"

function App() {

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get the dispatch function

  useEffect(() => {
    setAxiosNavigate(navigate);
    setAxiosDispatch(dispatch);
  }, [navigate, dispatch]);

  return (
    <>
      <ToastNotification />
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} showNavigation={true} />
        )}
        onReset={() => {
          // Optional: Add any reset logic here
          window.location.reload();
        }}
      >
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => window.location.reload()}
            >
              <Login />
            </ErrorBoundary>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/emailVerification/:token" element={<EmailVerification />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
              >
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="donations" element={<DonationList />} /> {/* used for admin and volunteer */}
            <Route path="donor-registration" element={<DonorRegistration usedFor="ADMIN" />} /> {/* used for admin and volunteer */}
            <Route path="donate/:userId?" element={<DonateNowOffline usedFor="ADMIN" />} /> {/* used for admin and volunteer */}
            <Route path="donor-list" element={<DonorList />} />
            {/* <Route path="users/:role?" element={<UserManagement />} /> */}
            <Route path="users/admin" element={<AdminManagement />} />
            <Route path="users/volunteer" element={<VolunteerManagement />} />
            <Route path="UserDetails/:userId?" element={<UserDetails />} />
            {/* <Route path="expenses" element={<ExpenseManagement />} /> */}
            <Route path="payment-verification" element={<PaymentVerification />} />
            <Route path="reports" element={<ReportGenerator />} />
            <Route path="notifications" element={<NotificationPanel />} />
            <Route path="profile" element={<Profile />} />
            <Route path="donation-setting" element={<DonationSettings />} />
            <Route path="add-donation" element={<AddDonation usedFor="admin" />} />
            <Route path="id-card" element={<IdCardList />} />
          </Route>

          {/* Volunteer Routes */}
          <Route
            path="/volunteer"
            element={
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
              >
                <ProtectedRoute role="volunteer">
                  <VolunteerLayout />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          >
            <Route index element={<VolunteerDashboard />} />
            <Route path="add-donation" element={<AddDonation usedFor="volunteer" />} />
            {/* <Route path="donation-history" element={<VolunteerDonationHistory />} /> */}
            <Route path="donation-history" element={<DonationList />} /> {/* user for admin and volunteer */}
            <Route path="donor-registration" element={<DonorRegistration usedFor="VOLUNTEER" />} /> {/* used for admin and volunteer */}
            <Route path="donate/:userId?" element={<DonateNowOffline usedFor="VOLUNTEER" />} /> {/* used for admin and volunteer */}
            <Route path="search-donor" element={<SearchDonor />} />

            <Route path="iCard" element={<ICardVolunteer />} />
            <Route path="upload-settlement" element={<VolunteerUploadSettlement />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Donor Routes */}
          <Route
            path="/donor"
            element={
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
              >
                <ProtectedRoute role="donor">
                  <DonorLayout />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          >
            <Route index element={<DonorDonationHistory />} />
            {/* <Route path="history" element={<DonorDonationHistory />} /> */}
            <Route path="donate" element={<DonateNow />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Guest Routes */}
          <Route path="/" element={
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => window.location.reload()}
            >
              <GuestLayout />
            </ErrorBoundary>
          }>
            <Route index element={<GuestIndex />} /> {/* This is Home Route */}
            {/* <Route path="home" element={<HomePage />} /> */}
            <Route path="payment/success" element={<PaymentSuccess />} />
            <Route path="payment/failed" element={<PaymentFailed />} />
          </Route>

          {/* Redirect to login if no route matches */}
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </ErrorBoundary>
    </>
  )
}

export default App
