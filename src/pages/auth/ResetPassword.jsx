import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams, useNavigate } from "react-router-dom"
import { resetPassword } from "../../store/slices/authSlice"
import { useFormik } from "formik"
import * as Yup from "yup"
import 'animate.css';

function ResetPassword() {
    const [message, setMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const { loading, error } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { token } = useParams()

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            // .matches(/[0-9]/, 'Password must contain at least one number')
            // .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            // .matches(/[^\w]/, 'Password must contain at least one symbol')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
    })

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setMessage("")
            setSuccessMessage("")

            dispatch(resetPassword({ token, newPassword: values.password }))
                .unwrap()
                .then(() => {
                    setSuccessMessage("Password reset successful! Please login with your new password.")
                    setTimeout(() => {
                        navigate('/login')
                    }, 3000)
                })
                .catch((err) => {
                    console.error("Error resetting password:", err)
                    const errorMessage = err.response?.data?.message || err.message || err || "Failed to reset password. Please try again."
                    setMessage(errorMessage)
                })
        },
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 animate__animated animate__fadeIn">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
                    <p className="text-gray-600">
                        Enter your new password below
                    </p>
                </div>

                {successMessage && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                )}

                {(error || message) && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-sm text-red-700">{error || message}</p>
                    </div>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            {...formik.getFieldProps('password')}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                formik.touched.password && formik.errors.password 
                                    ? 'border-red-300' 
                                    : 'border-gray-300'
                            }`}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            {...formik.getFieldProps('confirmPassword')}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                formik.touched.confirmPassword && formik.errors.confirmPassword 
                                    ? 'border-red-300' 
                                    : 'border-gray-300'
                            }`}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formik.isValid || !formik.dirty}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Resetting Password...
                            </span>
                        ) : (
                            "Reset Password"
                        )}
                    </button>

                    <div className="text-center">
                        <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword