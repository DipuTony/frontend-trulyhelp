
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProfile, updateProfile, changePassword } from "../../store/slices/authSlice"
import LoaderType1 from "../../components/common/LoaderType1"

function Profile() {
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector((state) => state.auth)
    const [isEditing, setIsEditing] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    const [profileData, setProfileData] = useState({
        name: "",
        phone: "",
        dob: "",
        pan: "",
        address: "",
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    useEffect(() => {
        dispatch(getProfile())
    }, [dispatch])

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                phone: user.phone || "",
                dob: user.dob ? user.dob.split('T')[0] : "",
                pan: user.pan || "",
                address: user.address || "",
            })
        }
    }, [user])

    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(updateProfile(profileData)).unwrap()
            setSuccessMessage("Profile updated successfully")
            setIsEditing(false)
            setTimeout(() => setSuccessMessage(""), 3000)
        } catch (err) {
            console.error("Failed to update profile:", err)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return // Add error handling for password mismatch
        }
        try {
            await dispatch(changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })).unwrap()
            setSuccessMessage("Password changed successfully")
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
            setTimeout(() => setSuccessMessage(""), 3000)
        } catch (err) {
            console.error("Failed to change password:", err)
        }
    }
    // if (loading) {
    //     <LoaderType1 />
    // }

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
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {[
                                { label: "Full Name", name: "name", type: "text" },
                                { label: "Phone Number", name: "phone", type: "tel" },
                                { label: "Date of Birth", name: "dob", type: "date" },
                                { label: "PAN Number", name: "pan", type: "text" },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={profileData[field.name]}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <textarea
                                name="address"
                                rows={3}
                                value={profileData.address}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                disabled:bg-gray-50 disabled:text-gray-500"
                            />
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

                {/* Existing Change Password Section */}
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        {[
                            { label: "Current Password", name: "currentPassword" },
                            { label: "New Password", name: "newPassword" },
                            { label: "Confirm New Password", name: "confirmPassword" },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                </label>
                                <input
                                    type="password"
                                    name={field.name}
                                    value={passwordData[field.name]}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
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