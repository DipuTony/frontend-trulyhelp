import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../../utils/axiosInterceptor'
import { toast } from 'sonner'
import countryList from '../../../DATA/CountryList.json'

const DonateNowOffline = ({ usedFor }) => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableCauses, setAvailableCauses] = useState([]);
    const [loadingCauses, setLoadingCauses] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState({ groups: [] });
    const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);

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
                    // Pre-fill donation form with user data
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
                const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}donation-options`);
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
                const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}master/payment-methods`);
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
                // Reset form
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
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add donation');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white shadow rounded-lg">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{userData?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{userData?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{userData?.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    userData?.emailVerifyStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {userData?.emailVerifyStatus ? 'Verified' : 'Not Verified'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Donation Form */}
                    <form onSubmit={handleSubmit} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Donation Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Donation Details</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Donation Cause*</label>
                                    <select
                                        name="donationCause"
                                        value={donationData.donationCause}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
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
                                    <label className="block text-sm font-medium text-gray-700">Donation Type*</label>
                                    <select
                                        name="donationType"
                                        value={donationData.donationType}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="Individual">Individual</option>
                                        <option value="Organization">Organization</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount*</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
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
                                            className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Payment Method*</label>
                                    <select
                                        name="method"
                                        value={donationData.method}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
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
                                        <label className="block text-sm font-medium text-gray-700">Reference No</label>
                                        <input
                                            type="text"
                                            name="paymentReferenceNo"
                                            value={donationData.paymentReferenceNo}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                )}

                                {(donationData.method === "CHEQUE" || donationData.method === "DD") && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                {donationData.method === "CHEQUE" ? "Cheque" : "DD"} Number*
                                            </label>
                                            <input
                                                type="text"
                                                name="chequeNo"
                                                value={donationData.chequeNo}
                                                onChange={handleChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Issue Date*</label>
                                            <input
                                                type="date"
                                                name="issueDate"
                                                value={donationData.issueDate}
                                                onChange={handleChange}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Donor Type*</label>
                                    <select
                                        name="donorType"
                                        value={donationData.donorType}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="indian">Indian</option>
                                        <option value="foreign">Foreign / NRI</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    {donationData.donorType === 'foreign' ? (
                                        <select
                                            name="country"
                                            value={donationData.country}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
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
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {donationData.donorType === 'foreign' ? "Passport" : "PAN"} Number
                                    </label>
                                    <input
                                        type="text"
                                        name="donorPan"
                                        value={donationData.donorPan}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Aadhar No</label>
                                    <input
                                        type="number"
                                        name="aadharNo"
                                        value={donationData.aadharNo}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <textarea
                                        name="donorAddress"
                                        rows={3}
                                        value={donationData.donorAddress}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Submit Donation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DonateNowOffline;