import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProfile, updateProfile, changePassword } from "../../store/slices/authSlice"
import LoaderType1 from "../../components/common/LoaderType1"
import { useFormik } from "formik"
import * as Yup from "yup"

function Profile() {
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector((state) => state.auth)
    const [isEditing, setIsEditing] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [passwordError, setPasswordError] = useState("")

    // Create refs for form fields
    const nameRef = useRef(null)
    const phoneRef = useRef(null)
    const dobRef = useRef(null)
    const panRef = useRef(null)
    const addressRef = useRef(null)
    const currentPasswordRef = useRef(null)
    const newPasswordRef = useRef(null)
    const confirmPasswordRef = useRef(null)

    // Validation schemas
    const profileSchema = Yup.object({
        name: Yup.string()
            .required("Name is required")
            .min(3, "Name must be at least 3 characters"),
        phone: Yup.string()
            .required("Phone number is required")
            .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
        dob: Yup.date()
            .required("Date of birth is required")
            .max(new Date(), "Date of birth cannot be in the future"),
        pan: Yup.string()
            .required("PAN number is required")
            .trim()
            .uppercase()
            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number format"),
        address: Yup.string()
            .required("Address is required")
            .test(
              "min-valid-chars",
              "Address must be at least 6 characters (not just spaces)",
              (value) => !!value && value.trim().length >= 6
            )
    })

    const passwordSchema = Yup.object({
        currentPassword: Yup.string()
            .required("Current password is required")
            .min(6, "Password must be at least 6 characters"),
        newPassword: Yup.string()
            .required("New password is required")
            .min(6, "Password must be at least 6 characters")
            .notOneOf([Yup.ref('currentPassword')], 'New password must be different from current password'),
        confirmPassword: Yup.string()
            .required("Please confirm your password")
            .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    })

    // Profile formik
    const profileFormik = useFormik({
        initialValues: {
            name: "",
            phone: "",
            dob: "",
            pan: "",
            address: "",
        },
        validationSchema: profileSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(updateProfile(values)).unwrap()
                setSuccessMessage("Profile updated successfully")
                setIsEditing(false)
                setTimeout(() => setSuccessMessage(""), 3000)
            } catch (err) {
                console.error("Failed to update profile:", err)
                // Focus first error field
                const firstError = Object.keys(profileFormik.errors)[0]
                const refs = { name: nameRef, phone: phoneRef, dob: dobRef, pan: panRef, address: addressRef }
                refs[firstError]?.current?.focus()
            }
        },
    })

    // Password formik
    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: passwordSchema,
        onSubmit: async (values) => {
            try {
                setPasswordError("") // Clear previous error
                await dispatch(changePassword({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                })).unwrap()
                setSuccessMessage("Password changed successfully")
                passwordFormik.resetForm()
                setTimeout(() => setSuccessMessage(""), 3000)
            } catch (err) {
                setPasswordError(err.message || "Failed to change password")
                const firstError = Object.keys(passwordFormik.errors)[0]
                const refs = {
                    currentPassword: currentPasswordRef,
                    newPassword: newPasswordRef,
                    confirmPassword: confirmPasswordRef
                }
                refs[firstError]?.current?.focus()
            }
        },
    })

    useEffect(() => {
        dispatch(getProfile())
    }, [dispatch])

    useEffect(() => {
        if (user) {
            profileFormik.setValues({
                name: user.name || "",
                phone: user.phone || "",
                dob: user.dob ? user.dob.split('T')[0] : "",
                pan: user.pan || "",
                address: user.address || "",
            })
        }
    }, [user])

    // Show loading state
    if (loading) {
        return <LoaderType1 />
    }

    // Show error state
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto">
                {/* Profile Header with Account Info */}
                <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
                        <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {user?.role}
                            </span>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </button>
                        </div>
                    </div>

                    {/* Email and Verification Status */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <p className="text-base font-medium text-gray-900">{user?.email}</p>
                            </div>
                            <div className="flex items-center">
                                {user?.emailVerifyStatus ? (
                                    <div className="flex items-center text-green-700">
                                        <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Verified</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-yellow-700">
                                        <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Unverified</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
                            {successMessage}
                        </div>
                    )}

                    {/* Existing Profile Form */}
                    <form onSubmit={profileFormik.handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {[
                                { label: "Full Name", name: "name", type: "text", ref: nameRef },
                                { label: "Phone Number", name: "phone", type: "tel", ref: phoneRef },
                                { label: "Date of Birth", name: "dob", type: "date", ref: dobRef },
                                { label: "PAN Number", name: "pan", type: "text", ref: panRef },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        ref={field.ref}
                                        value={profileFormik.values[field.name]}
                                        onChange={profileFormik.handleChange}
                                        onBlur={profileFormik.handleBlur}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm 
                                            ${profileFormik.touched[field.name] && profileFormik.errors[field.name]
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-indigo-500'} 
                                            focus:outline-none focus:ring-2 focus:border-transparent
                                            disabled:bg-gray-50 disabled:text-gray-500`}
                                    />
                                    {profileFormik.touched[field.name] && profileFormik.errors[field.name] && (
                                        <p className="mt-1 text-sm text-red-600">{profileFormik.errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <textarea
                                name="address"
                                ref={addressRef}
                                rows={3}
                                value={profileFormik.values.address}
                                onChange={profileFormik.handleChange}
                                onBlur={profileFormik.handleBlur}
                                disabled={!isEditing}
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm 
                                    ${profileFormik.touched.address && profileFormik.errors.address
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-indigo-500'} 
                                    focus:outline-none focus:ring-2 focus:border-transparent
                                    disabled:bg-gray-50 disabled:text-gray-500`}
                            />
                            {profileFormik.touched.address && profileFormik.errors.address && (
                                <p className="mt-1 text-sm text-red-600">{profileFormik.errors.address}</p>
                            )}
                        </div>

                        {/* Account Information */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Member Since</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(user?.createdAt).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Last Updated</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(user?.updatedAt).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Change Password Section */}
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
                    {passwordError && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                            {passwordError}
                        </div>
                    )}
                    <form onSubmit={passwordFormik.handleSubmit} className="space-y-6">
                        {[
                            { label: "Current Password", name: "currentPassword", ref: currentPasswordRef },
                            { label: "New Password", name: "newPassword", ref: newPasswordRef },
                            { label: "Confirm New Password", name: "confirmPassword", ref: confirmPasswordRef },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                </label>
                                <input
                                    type="password"
                                    name={field.name}
                                    ref={field.ref}
                                    value={passwordFormik.values[field.name]}
                                    onChange={passwordFormik.handleChange}
                                    onBlur={passwordFormik.handleBlur}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm 
                                        ${passwordFormik.touched[field.name] && passwordFormik.errors[field.name]
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-indigo-500'} 
                                        focus:outline-none focus:ring-2 focus:border-transparent`}
                                />
                                {passwordFormik.touched[field.name] && passwordFormik.errors[field.name] && (
                                    <p className="mt-1 text-sm text-red-600">{passwordFormik.errors[field.name]}</p>
                                )}
                            </div>
                        ))}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile