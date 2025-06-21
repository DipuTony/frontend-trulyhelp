import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../../utils/axiosInterceptor'
import { toast } from 'sonner'
import countryList from '../../../DATA/CountryList.json'
import { useSelector } from 'react-redux'
import { maskEmail, maskPhone } from '../../../components/common/maskUtils'

const DonateNowOffline = ({ usedFor }) => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableCauses, setAvailableCauses] = useState([]);
    const [loadingCauses, setLoadingCauses] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState({ groups: [] });
    const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);

    const { user } = useSelector((state) => state.auth)
    const isAdmin = user?.role === 'ADMIN'

    const [donationData, setDonationData] = useState({
        donorName: "",
        aadharNo: "",
        donorEmail: "",
        donorPhone: "",
        donorDob: "",
        donationCause: "",
        paymentReferenceNo: "",
        donorPan: "",
        donorAddress: "",
        amount: "",
        donationType: "",
        method: "",
        chequeNo: "",
        issueDate: "",
        expiryDate: "",
        donorType: "",
        country: ""
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/user/view-basic-details?userId=${userId}`);
                if (response.data.status) {
                    setUserData(response.data.data);
                    setDonationData(prev => ({
                        ...prev,
                        donorName: response.data.data.name || "",
                        donorEmail: response.data.data.email || "",
                        donorPhone: response.data.data.phone || "",
                        donorDob: response.data.data.dob || "",
                        donorPan: response.data.data.pan || "",
                        aadharNo: response.data.data.aadharNo || "",
                        donorAddress: response.data.data.address || "",
                        donorType: response.data.data.donorType || "",
                        country: response.data.data.country || ""
                    }));
                } else {
                    setError(response.data.message);
                    toast.error(response.data.message);
                }
            } catch (err) {
                setError(err.message);
                toast.error(err.message || 'Failed to fetch user details');
            } finally {
                setLoading(false);
            }
        };

        const fetchDonationOptions = async () => {
            try {
                setLoadingCauses(true);
                const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/donation-options`);
                if (response.data.success) {
                    setAvailableCauses(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching donation options:', err);
            } finally {
                setLoadingCauses(false);
            }
        };

        const fetchPaymentMethods = async () => {
            try {
                setLoadingPaymentMethods(true);
                const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/master/payment-methods`);
                if (response.data.status) {
                    setPaymentMethods(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching payment methods:', err);
            } finally {
                setLoadingPaymentMethods(false);
            }
        };

        if (userId) {
            fetchUserDetails();
            fetchDonationOptions();
            fetchPaymentMethods();
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDonationData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/donations/donate', {
                name: donationData.donorName,
                aadharNo: donationData.aadharNo,
                email: donationData.donorEmail,
                donationCause: donationData.donationCause,
                paymentReferenceNo: donationData.paymentReferenceNo,
                phone: donationData.donorPhone,
                dob: donationData.donorDob,
                pan: donationData.donorPan,
                donationType: donationData.donationType,
                address: donationData.donorAddress,
                amount: Number(donationData.amount),
                method: donationData.method,
                chequeNo: donationData.method === "CHEQUE" ? donationData.chequeNo : undefined,
                checkIssueDate: donationData.issueDate,
                checkExpiryDate: donationData.expiryDate,
                donorType: donationData.donorType,
                country: donationData.donorType === "indian" ? "India" : donationData.country,
            });

            if (response.data.status) {
                toast.success('Donation added successfully');
                setDonationData({
                    donorName: "",
                    aadharNo: "",
                    donorEmail: "",
                    donorPhone: "",
                    donorDob: "",
                    donationCause: "",
                    paymentReferenceNo: "",
                    donorPan: "",
                    donorAddress: "",
                    amount: "",
                    donationType: "",
                    method: "",
                    chequeNo: "",
                    issueDate: "",
                    expiryDate: "",
                    donorType: "",
                    country: ""
                });
            } else {
                // Show all validation errors if present
                if (response.data.errors && Array.isArray(response.data.errors)) {
                    response.data.errors.forEach(errMsg => toast.error(errMsg));
                } else {
                    toast.error(response.data.message || 'Failed to add donation');
                }
            }
        } catch (err) {
            // Show all validation errors if present in error response
            const errors = err.response?.data?.errors;
            if (errors && Array.isArray(errors)) {
                errors.forEach(errMsg => toast.error(errMsg));
            } else {
                toast.error(err.response?.data?.message || err.message || 'Failed to add donation');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Offline Donation</h1>
                    <p className="mt-2 text-lg text-gray-600">Support our cause with your generous contribution</p>
                </div>

                {/* User Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all hover:shadow-lg">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Donor Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Name</p>
                                <p className="text-lg font-semibold text-gray-800">{userData?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-lg font-semibold text-gray-800">{maskEmail(userData?.email)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                <p className="text-lg font-semibold text-gray-800">{maskPhone(userData?.phone)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    userData?.emailVerifyStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {userData?.emailVerifyStatus ? 'Verified' : 'Not Verified'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donation Form */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Donation Details */}
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-xl font-semibold text-gray-800">Donation Details</h3>
                                        <p className="mt-1 text-sm text-gray-500">Enter information about your donation</p>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Donation Cause*</label>
                                            <select
                                                name="donationCause"
                                                value={donationData.donationCause}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            >
                                                <option value="">Select a cause</option>
                                                {Object.keys(availableCauses).map((key) => (
                                                    <option key={key} value={key}>
                                                        {availableCauses[key].displayName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Donor Type*</label>
                                            <select
                                                name="donationType"
                                                value={donationData.donationType}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            >
                                                <option value="">Select</option>
                                                <option value="Individual">Individual</option>
                                                <option value="Organization">Organization</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount*</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">₹</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={donationData.amount}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method*</label>
                                            <select
                                                name="method"
                                                value={donationData.method}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            >
                                                <option value="">Select Payment Method</option>
                                                {paymentMethods.groups?.map((group) => (
                                                    <optgroup key={group.label} label={group.label}>
                                                        {group.options.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        </div>

                                        {donationData.method && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Reference No</label>
                                                <input
                                                    type="text"
                                                    name="paymentReferenceNo"
                                                    value={donationData.paymentReferenceNo}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                        )}

                                        {(donationData.method === "CHEQUE" || donationData.method === "DD") && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        {donationData.method === "CHEQUE" ? "Cheque" : "DD"} Number*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="chequeNo"
                                                        value={donationData.chequeNo}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date*</label>
                                                    <input
                                                        type="date"
                                                        name="issueDate"
                                                        value={donationData.issueDate}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-xl font-semibold text-gray-800">Additional Information</h3>
                                        <p className="mt-1 text-sm text-gray-500">Provide necessary details for tax purposes</p>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship Type*</label>
                                            <select
                                                name="donorType"
                                                value={donationData.donorType}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            >
                                                <option value="">Select</option>
                                                <option value="indian">Indian</option>
                                                <option value="foreign">Foreign / NRI</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            {donationData.donorType === 'foreign' ? (
                                                <select
                                                    name="country"
                                                    value={donationData.country}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                                                    name="country"
                                                    value="INDIA"
                                                    readOnly
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
                                                />
                                            )}
                                        </div>

                                        <div className={`${!isAdmin && 'hidden' }`}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {donationData.donorType === 'foreign' ? "Passport" : "PAN"} Number
                                            </label>
                                            <input
                                                type="text"
                                                name="donorPan"
                                                value={donationData.donorPan}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>

                                        <div className={`${!isAdmin && 'hidden' }`}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar No</label>
                                            <input
                                                type="number"
                                                name="aadharNo"
                                                value={donationData.aadharNo}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                            <textarea
                                                name="donorAddress"
                                                rows={3}
                                                value={donationData.donorAddress}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Submit Donation
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DonateNowOffline;