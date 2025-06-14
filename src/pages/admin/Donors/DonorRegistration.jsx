import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import countryList from '../../../DATA/CountryList.json'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_API_URL;

const DonorRegistration = ({ usedFor }) => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [registeredUser, setRegisteredUser] = useState()

    let urlPreFix;;

    if (usedFor === "ADMIN") {
        urlPreFix = "admin";
    }
    if (usedFor === "VOLUNTEER") {
        urlPreFix = "volunteer";
    }


    const navigate = useNavigate()

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .min(2, 'Name must be at least 2 characters'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        phone: Yup.string()
            .required('Phone number is required')
            .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters'),
        //   .matches(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        //     'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        //   ),
        confirmPassword: Yup.string()
            .required('Please confirm your password')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        donorType: Yup.string()
            .required('Donor type is required')
            .oneOf(['indian', 'foreign'], 'Invalid donor type'),
        country: Yup.string()
            .when('donorType', {
                is: 'foreign',
                then: (schema) => schema.required('Country is required for foreign donors'),
                otherwise: (schema) => schema.notRequired(),
            }),
        dob: Yup.date()
            .max(new Date(), 'Date of birth cannot be in the future')
            .nullable(),
        pan: Yup.string()
            .when('donorType', {
                is: 'indian',
                // then: (schema) => schema.matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number'),
                otherwise: (schema) => schema.notRequired(),
            }),
        aadharNo: Yup.string()
            .when('donorType', {
                is: 'indian',
                then: (schema) => schema.matches(/^[0-9]{12}$/, 'Aadhar number must be 12 digits'),
                otherwise: (schema) => schema.notRequired(),
            }),
        address: Yup.string()
            .required('Address is required')
            .min(10, 'Address must be at least 10 characters'),
    })

    const handleRegisterNew = () => {
        setSuccess(false)
        setRegisteredUser(null)
        formik.resetForm()
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            donorType: '',
            country: '',
            dob: '',
            pan: '',
            aadharNo: '',
            address: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            setError(null)
            try {
                const header = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }

                const addUserPayload = {
                    ...values,
                    role: 'DONOR',
                    country: values.donorType === 'indian' ? 'India' : values.country,
                }

                // Remove confirmPassword from payload
                delete addUserPayload.confirmPassword;

                const response = await axios.post(`${BACKEND_URL}/user/create`, addUserPayload, header)

                if (response.status === 201 || response.data.status) {
                    setSuccess(true)
                    setRegisteredUser(response.data.data)
                    formik.resetForm()
                } else {
                    setError(response.data.message || 'Failed to register donor')
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while registering donor')
            } finally {
                setLoading(false)
            }
        },
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Donor Registration</h2>
                    <p className="mt-2 text-gray-600">Register a new donor in the system</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Success Message */}
                    {success && registeredUser && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-green-800">Registration Successful!</h3>
                                        <p className="mt-1 text-sm text-green-700">Donor has been registered successfully.</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</p>
                                            <p className="text-sm font-medium text-gray-900">{registeredUser?.userId}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
                                            <p className="text-sm font-medium text-gray-900">{registeredUser?.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                                            <p className="text-sm font-medium text-gray-900">{registeredUser?.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                                            <p className="text-sm font-medium text-gray-900">{registeredUser?.phone}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Role</p>
                                            <p className="text-sm font-medium text-gray-900">{registeredUser?.role}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-5">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/${urlPreFix}/donate/${registeredUser?.userId}`)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Make Donation
                                        <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRegisterNew}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Register New Donor
                                        <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Only show form if not in success state */}
                    {!success && (
                        <form onSubmit={formik.handleSubmit}>
                            <div className="p-8">
                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                    Full Name*
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.name && formik.errors.name
                                                        ? 'border-red-300'
                                                        : ''
                                                        }`}
                                                />
                                                {formik.touched.name && formik.errors.name && (
                                                    <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email*
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.email && formik.errors.email
                                                        ? 'border-red-300'
                                                        : ''
                                                        }`}
                                                />
                                                {formik.touched.email && formik.errors.email && (
                                                    <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    Phone Number*
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formik.values.phone}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.phone && formik.errors.phone
                                                        ? 'border-red-300'
                                                        : ''
                                                        }`}
                                                />
                                                {formik.touched.phone && formik.errors.phone && (
                                                    <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    id="dob"
                                                    name="dob"
                                                    value={formik.values.dob}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.dob && formik.errors.dob
                                                        ? 'border-red-300'
                                                        : ''
                                                        }`}
                                                />
                                                {formik.touched.dob && formik.errors.dob && (
                                                    <p className="mt-1 text-sm text-red-600">{formik.errors.dob}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Section */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                    Password*
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="password"
                                                        name="password"
                                                        value={formik.values.password}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.password && formik.errors.password
                                                            ? 'border-red-300'
                                                            : ''
                                                            }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    >
                                                        {showPassword ? (
                                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                {formik.touched.password && formik.errors.password && (
                                                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                                    Confirm Password*
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        value={formik.values.confirmPassword}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.confirmPassword && formik.errors.confirmPassword
                                                            ? 'border-red-300'
                                                            : ''
                                                            }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                                    <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Donor Type and Country */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Donor Type</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="donorType" className="block text-sm font-medium text-gray-700">
                                                    Donor Type*
                                                </label>
                                                <select
                                                    id="donorType"
                                                    name="donorType"
                                                    value={formik.values.donorType}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.donorType && formik.errors.donorType
                                                        ? 'border-red-300'
                                                        : ''
                                                        }`}
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="indian">Indian</option>
                                                    <option value="foreign">Foreign / NRI</option>
                                                </select>
                                                {formik.touched.donorType && formik.errors.donorType && (
                                                    <p className="mt-1 text-sm text-red-600">{formik.errors.donorType}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                                    Country
                                                </label>
                                                {formik.values.donorType === 'foreign' ? (
                                                    <select
                                                        id="country"
                                                        name="country"
                                                        value={formik.values.country}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.country && formik.errors.country
                                                            ? 'border-red-300'
                                                            : ''
                                                            }`}
                                                    >
                                                        <option value="">Select Country</option>
                                                        {countryList.map((country) => (
                                                            <option key={country.name} value={country.name}>
                                                                {country.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        id="country"
                                                        name="country"
                                                        value="India"
                                                        readOnly
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50"
                                                    />
                                                )}
                                                {formik.touched.country && formik.errors.country && (
                                                    <p className="mt-1 text-sm text-red-600">{formik.errors.country}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Identification Details */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Identification Details</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                                                    {formik.values.donorType === 'foreign' ? 'Passport' : 'PAN'} Number
                                                </label>
                                                <input
                                                    type="text"
                                                    id="pan"
                                                    name="pan"
                                                    value={formik.values.pan}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.pan && formik.errors.pan
                                                        ? 'border-red-300'
                                                        : ''
                                                        }`}
                                                />
                                                {formik.touched.pan && formik.errors.pan && (
                                                    <p className="mt-1 text-sm text-red-600">{formik.errors.pan}</p>
                                                )}
                                            </div>

                                            {formik.values.donorType === 'indian' && (
                                                <div>
                                                    <label htmlFor="aadharNo" className="block text-sm font-medium text-gray-700">
                                                        Aadhar Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="aadharNo"
                                                        name="aadharNo"
                                                        value={formik.values.aadharNo}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.aadharNo && formik.errors.aadharNo
                                                            ? 'border-red-300'
                                                            : ''
                                                            }`}
                                                    />
                                                    {formik.touched.aadharNo && formik.errors.aadharNo && (
                                                        <p className="mt-1 text-sm text-red-600">{formik.errors.aadharNo}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                Full Address*
                                            </label>
                                            <textarea
                                                id="address"
                                                name="address"
                                                rows={3}
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.address && formik.errors.address
                                                    ? 'border-red-300'
                                                    : ''
                                                    }`}
                                            />
                                            {formik.touched.address && formik.errors.address && (
                                                <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="px-8 py-6 bg-gray-50">
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform duration-150 hover:scale-105"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Register Donor
                                                <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DonorRegistration