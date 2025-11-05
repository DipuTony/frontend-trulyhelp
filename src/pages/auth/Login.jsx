"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login, clearError, resendEmailVerification } from "../../store/slices/authSlice"
import { showSuccessToast, showErrorToast } from "../../utils/toast"
import LoaderType1 from "../../components/common/LoaderType1"
import 'animate.css';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth)
  const [resendLoading, setResendLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(clearError())
    if (isAuthenticated) {
      const role = (user?.role || '').toUpperCase()
      const roleRoutes = {
        SUPER_ADMIN: "/admin/profile",
        ADMIN: "/admin/profile",
        VOLUNTEER: "/volunteer/profile",
        DONOR: "/donor/profile",
      }
      navigate(roleRoutes[role] || "/")
    }
  }, [isAuthenticated, user, navigate, dispatch])

  useEffect(() => {
    if (error && typeof error === 'object' && error.status === 403 && error.emailVerifyStatus === false) {
      showErrorToast(error.message || "Please verify your email before logging in")
    }
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
  }

  const handleResendEmailVerify = async () => {
    if (!email) {
      showErrorToast("Please enter your email address above first.")
      return
    }
    setResendLoading(true)
    try {
      const resultAction = await dispatch(resendEmailVerification(email))
      if (resendEmailVerification.fulfilled.match(resultAction)) {
        showSuccessToast("Verification email sent. Please check your inbox.")
      } else {
        showErrorToast(resultAction.payload || "Failed to resend verification email.")
      }
    } catch (err) {
      showErrorToast("Failed to resend verification email.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {(loading || resendLoading) && <LoaderType1 />}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 animate__animated animate__fadeIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">
            New here?{" "}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Create an account
            </Link>
            {" "}or{" "}
            <Link to="/" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Donate as guest
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {typeof error === 'string' ? error : error.message || "Something went wrong"}
                </p>
                {error?.emailVerifyStatus === false && (
                  <button onClick={handleResendEmailVerify} className="mt-2 text-sm text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition">
                    Resend Verification Email
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          <div>
            <Link to="/forgot-password" className="font-semibold ml-1 text-base text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
