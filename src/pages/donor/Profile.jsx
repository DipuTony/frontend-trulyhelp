import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProfile, updateProfile, changePassword } from "../../store/slices/authSlice"
import LoaderType1 from "../../components/common/LoaderType1"
import { useFormik } from "formik"
import * as Yup from "yup"
import { FiCamera, FiEdit3, FiSave, FiX, FiEye, FiEyeOff } from 'react-icons/fi'
import axiosInstance from "../../utils/axiosInterceptor"
import { toast } from "sonner"

function Profile() {
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector((state) => state.auth)
    const [isEditing, setIsEditing] = useState(false)
    const [isPasswordEditing, setIsPasswordEditing] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [uploadingImage, setUploadingImage] = useState(false)
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })
    const fileInputRef = useRef(null)

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
                setIsPasswordEditing(false)
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

    const handleImageUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB')
            return
        }

        try {
            setUploadingImage(true)
            const formData = new FormData()
            formData.append('profileImage', file)

            const response = await axiosInstance.post('/user/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (response.data.status) {
                toast.success('Profile image uploaded successfully')
                await dispatch(getProfile())
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload image')
        } finally {
            setUploadingImage(false)
        }
    }

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        profileFormik.resetForm()
        if (user) {
            profileFormik.setValues({
                name: user.name || "",
                phone: user.phone || "",
                dob: user.dob ? user.dob.split('T')[0] : "",
                pan: user.pan || "",
                address: user.address || "",
            })
        }
    }

    const handleCancelPasswordEdit = () => {
        setIsPasswordEditing(false)
        passwordFormik.resetForm()
        setPasswordError("")
    }

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
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {successMessage}
                        </div>
                    </div>
                )}

                {/* Profile Header Card */}
                <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-6">
                    {/* Mobile-first Profile Header */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                        {/* Profile Photo Section */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
                                {user?.profileImageUrl ? (
                                    <img
                                        src={user.profileImageUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                        <span className="text-2xl sm:text-4xl">{user?.name?.charAt(0)?.toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingImage}
                                className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {uploadingImage ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FiCamera className="w-4 h-4" />
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{user?.name}</h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {user?.role}
                                </span>
                                <div className="flex items-center justify-center sm:justify-start">
                                    {user?.emailVerifyStatus ? (
                                        <div className="flex items-center text-green-700">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm font-medium">Verified</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-yellow-700">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm font-medium">Unverified</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 break-all">{user?.email}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                {isEditing ? (
                                    <>
                                        <FiX className="w-4 h-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <FiEdit3 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Form Card */}
                <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                    
                    <form onSubmit={profileFormik.handleSubmit} className="space-y-6">
                        {/* Form Fields Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { label: "Full Name", name: "name", type: "text", ref: nameRef },
                                { label: "Phone Number", name: "phone", type: "tel", ref: phoneRef },
                                { label: "Date of Birth", name: "dob", type: "date", ref: dobRef },
                                { label: "PAN Number", name: "pan", type: "text", ref: panRef },
                            ].map((field) => (
                                <div key={field.name} className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors
                                            ${profileFormik.touched[field.name] && profileFormik.errors[field.name]
                                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} 
                                            focus:outline-none focus:ring-2
                                            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
                                    />
                                    {profileFormik.touched[field.name] && profileFormik.errors[field.name] && (
                                        <p className="mt-1 text-sm text-red-600">{profileFormik.errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Address Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors
                                    ${profileFormik.touched.address && profileFormik.errors.address
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} 
                                    focus:outline-none focus:ring-2
                                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
                            />
                            {profileFormik.touched.address && profileFormik.errors.address && (
                                <p className="mt-1 text-sm text-red-600">{profileFormik.errors.address}</p>
                            )}
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <FiSave className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Account Information Card */}
                <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-500 mb-1">User ID</p>
                            <p className="font-medium text-gray-900 break-all">{user?.userId}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-500 mb-1">Member Since</p>
                            <p className="font-medium text-gray-900">
                                {new Date(user?.createdAt).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                            <p className="font-medium text-gray-900">
                                {new Date(user?.updatedAt).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Change Password</h2>
                        <button
                            onClick={() => setIsPasswordEditing(!isPasswordEditing)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                            {isPasswordEditing ? (
                                <>
                                    <FiX className="w-4 h-4 mr-2" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <FiEdit3 className="w-4 h-4 mr-2" />
                                    Change Password
                                </>
                            )}
                        </button>
                    </div>

                    {passwordError && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {passwordError}
                            </div>
                        </div>
                    )}

                    {isPasswordEditing && (
                        <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
                            {[
                                { label: "Current Password", name: "currentPassword", ref: currentPasswordRef, field: "current" },
                                { label: "New Password", name: "newPassword", ref: newPasswordRef, field: "new" },
                                { label: "Confirm New Password", name: "confirmPassword", ref: confirmPasswordRef, field: "confirm" },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords[field.field] ? "text" : "password"}
                                            name={field.name}
                                            ref={field.ref}
                                            value={passwordFormik.values[field.name]}
                                            onChange={passwordFormik.handleChange}
                                            onBlur={passwordFormik.handleBlur}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm transition-colors
                                                ${passwordFormik.touched[field.name] && passwordFormik.errors[field.name]
                                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} 
                                                focus:outline-none focus:ring-2`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility(field.field)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords[field.field] ? (
                                                <FiEyeOff className="w-5 h-5" />
                                            ) : (
                                                <FiEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {passwordFormik.touched[field.name] && passwordFormik.errors[field.name] && (
                                        <p className="mt-1 text-sm text-red-600">{passwordFormik.errors[field.name]}</p>
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <FiSave className="w-4 h-4 mr-2" />
                                    Update Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile