import React, { useEffect, useState } from 'react';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiDollarSign,
    FiCreditCard,
    FiFileText,
    FiHome,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiMessageSquare,
    FiSmartphone,
    FiAtSign,
    FiEdit
} from 'react-icons/fi';
import DonationHistory from './DonationHistory';
import { formatDateDMY, formatRelativeTime } from '../../../components/common/DateFormatFunctions';
import ImageViewerModal from './ImageViewerModal';
import PDFViewerModal from './PDFViewerModal';
import axiosInstance from '../../../utils/axiosInterceptor';
import { setMessage } from '../../../store/slices/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import UpdateDonorModal from './UpdateDonorModal';

const DonationDetails = ({ donationData, goBack }) => {

    const [showOldDonations, setShowOldDonations] = useState(false);
    const [donation, setDonation] = useState(donationData);
    const [showVolunteerDetails, setShowVolunteerDetails] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [sendingReceipt, setSendingReceipt] = useState(false);
    const [showUpdateDonorModal, setShowUpdateDonorModal] = useState(false);
    const [generatingReceiptId, setGeneratingReceiptId] = useState(null);
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state) => state.auth)
    const isAdmin = user?.role === 'ADMIN';

    // Scroll to top when donation changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [donation]);

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Payment status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSendReceipt = async (donationId, type) => {
        setSendingReceipt(true);
        try {
            const res = await axiosInstance.post('/notification/send-receipt', {
                type,
                donationId
            });
            if (res.data?.error) {
                dispatch(setMessage(res.data.error));
            } else {
                dispatch(setMessage(res.data?.message || 'Receipt sent successfully!'));
            }
        } catch (error) {
            const errMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to send receipt.';
            dispatch(setMessage(errMsg));
        } finally {
            setSendingReceipt(false);
        }
    };

    const handleGenerateReceipt = async (donationId) => {
        setGeneratingReceiptId(donationId);
        try {
            const token = localStorage.getItem('token');
            const res = await axiosInstance.get(`/donations/receipt/${donationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.data.status && res.data.filePath) {
                setDonation((prev) => ({ ...prev, receiptPath: res.data.filePath }));
                setShowReceiptModal(true);
                dispatch(setMessage('Receipt generated successfully.'));
            } else {
                dispatch(setMessage(res.data.message || 'Failed to generate receipt'));
            }
        } catch (err) {
            dispatch(setMessage('Error generating receipt'));
        }
        setGeneratingReceiptId(null);
    };

    const handleUpdateDonorInformation = () => {
        setShowUpdateDonorModal(true);
    }

    const handleSaveDonorInfo = async (updatedDonor) => {
        try {
            const res = await axiosInstance.post('/donations/update-donation-donor', {
                donationId: donation.donationId,
                ...updatedDonor
            });
            if (res.data.status) {
                setDonation((prev) => ({ ...prev, ...res.data.data }));
                setShowUpdateDonorModal(false);
                dispatch(setMessage('Donor information updated successfully.'));
            } else {
                dispatch(setMessage(res.data.message || 'Failed to update donor information.'));
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to update donor information.';
            dispatch(setMessage(errMsg));
        }
    };

    return (
        <div className=" bg-gray-50">
            <div className=" mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 py-4 px-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Donation Details</h2>
                    <span className="text-white font-medium">ID: {donation?.donationId || "N/A"}</span>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    {/* Donation Summary */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center mb-2 sm:mb-0">
                                <FiDollarSign className="text-blue-600 mr-2" size={20} />
                                <span className="font-semibold">Amount:</span>
                                <span className="ml-2 text-lg">₹{donation?.amount?.toLocaleString() || "N/A"}</span>
                            </div>

                            <div className="flex items-center mb-2 sm:mb-0">
                                <FiCreditCard className="text-blue-600 mr-2" size={20} />
                                <span className="font-semibold">Payment Method:</span>
                                <span className="ml-2 capitalize">{donation?.method?.toUpperCase() || "N/A"}</span>
                            </div>

                            <div className="flex items-center">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(donation?.paymentStatus)}`}>
                                    {donation?.paymentStatus || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Donor Information */}
                        <div className="border rounded-lg p-4">
                            <div className='flex justify-between'>
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FiUser className="mr-2 text-blue-600" /> Donor Information
                                </h3>
                                <div>
                                    <button
                                        onClick={handleUpdateDonorInformation}
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-200 shadow"
                                    >
                                        <FiEdit className="mr-2" size={16} />
                                        Update
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Donor ID</p>
                                    <p className="font-medium">{donation?.donorUserId || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium">{donation?.donorName || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium flex items-center">
                                        <FiMail className="mr-2 text-gray-400" size={16} />
                                        {donation?.donorEmail || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium flex items-center">
                                        <FiPhone className="mr-2 text-gray-400" size={16} />
                                        {donation?.donorPhone || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Date of Birth</p>
                                    <p className="font-medium flex items-center">
                                        <FiCalendar className="mr-2 text-gray-400" size={16} />
                                        {formatDate(donation?.donorDob || "N/A")}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">PAN Number</p>
                                    <p className="font-medium flex items-center">
                                        <FiFileText className="mr-2 text-gray-400" size={16} />
                                        {donation?.donorPan || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Donor Type</p>
                                    <p className="font-medium flex items-center">
                                        <FiFileText className="mr-2 text-gray-400" size={16} />
                                        {donation?.donationType || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Donation Cause</p>
                                    <p className="font-medium flex items-center">
                                        <FiFileText className="mr-2 text-gray-400" size={16} />
                                        {donation?.donationCause || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Aadhar No</p>
                                    <p className="font-medium flex items-center">
                                        <FiFileText className="mr-2 text-gray-400" size={16} />
                                        {donation?.aadharNo || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium flex items-center">
                                        <FiFileText className="mr-2 text-gray-400" size={16} />
                                        {donation?.donorAddress || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment & Address Information */}
                        <div className="space-y-6">
                            {/* Send Receipt Section */}
                            <div className="border rounded-lg p-4 bg-white shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FiMessageSquare className="mr-2 text-blue-600" /> Send Receipt
                                </h3>
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
                                    <div className="flex justify-around items-center w-full sm:w-auto gap-6">
                                        <a
                                            // href={donation?.receiptPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex flex-col items-center ${donation?.receiptPath && !sendingReceipt ? 'text-green-500 hover:text-green-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'} transition-colors duration-200`}
                                            tabIndex={donation?.receiptPath && !sendingReceipt ? 0 : -1}
                                            aria-disabled={!donation?.receiptPath || sendingReceipt}
                                            onClick={e => {
                                                e.preventDefault();
                                                if (donation?.receiptPath && !sendingReceipt) handleSendReceipt(donation?.donationId, 'WHATSAPP');
                                            }}
                                        >
                                            <FiSmartphone size={30} />
                                            <span className="text-xs mt-1">WhatsApp</span>
                                        </a>
                                        <a
                                            // href={donation?.receiptPath}
                                            className={`flex flex-col items-center ${donation?.receiptPath && !sendingReceipt ? 'text-blue-500 hover:text-blue-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'} transition-colors duration-200`}
                                            tabIndex={donation?.receiptPath && !sendingReceipt ? 0 : -1}
                                            aria-disabled={!donation?.receiptPath || sendingReceipt}
                                            onClick={e => {
                                                e.preventDefault();
                                                if (donation?.receiptPath && !sendingReceipt) handleSendReceipt(donation?.donationId, 'EMAIL');
                                            }}
                                        >
                                            <FiAtSign size={30} />
                                            <span className="text-xs mt-1">Email</span>
                                        </a>
                                        <a
                                            // href={donation?.receiptPath}
                                            className={`flex flex-col items-center ${donation?.receiptPath && !sendingReceipt ? 'text-purple-500 hover:text-purple-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'} transition-colors duration-200`}
                                            tabIndex={donation?.receiptPath && !sendingReceipt ? 0 : -1}
                                            aria-disabled={!donation?.receiptPath || sendingReceipt}
                                            onClick={e => {
                                                e.preventDefault();
                                                if (donation?.receiptPath && !sendingReceipt) handleSendReceipt(donation?.donationId, 'SMS');
                                            }}
                                        >
                                            <FiMessageSquare size={30} />
                                            <span className="text-xs mt-1">SMS</span>
                                        </a>
                                    </div>
                                    {/* Admin Receipt Actions */}
                                    {isAdmin && (
                                        donation?.receiptPath ? (
                                            <button
                                                onClick={() => setShowReceiptModal(true)}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded bg-blue-600 text-white shadow hover:bg-blue-700"
                                            >
                                                <FiFileText className="mr-2" size={16} />
                                                View Receipt
                                            </button>
                                        ) : (
                                            donation?.paymentStatus === 'COMPLETED' ? (
                                                <button
                                                    onClick={() => handleGenerateReceipt(donation?.donationId)}
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded bg-yellow-600 text-white shadow hover:bg-yellow-700"
                                                    disabled={generatingReceiptId === donation?.donationId}
                                                >
                                                    <FiFileText className="mr-2" size={16} />
                                                    {generatingReceiptId === donation?.donationId ? 'Generating...' : 'Generate Receipt'}
                                                </button>
                                            ) : (
                                                <button
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    disabled
                                                >
                                                    <FiFileText className="mr-2" size={16} />
                                                    No Receipt
                                                </button>
                                            )
                                        )
                                    )}
                                </div>
                                {sendingReceipt && (
                                    <div className="mt-2 text-center text-sm text-blue-500 font-medium animate-pulse">Sending...</div>
                                )}
                            </div>

                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FiCreditCard className="mr-2 text-blue-600" /> Payment Details
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Transaction ID</p>
                                        <p className="font-medium">{donation?.transactionId || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Payment Gateway</p>
                                        <p className="font-medium">{donation?.gateway || "OFFLINE"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Donation By</p>
                                        <p className="font-medium">{donation?.donationBy || "N/A"}</p>
                                    </div>
                                    {donation?.volunteer && (
                                        <div className="mt-4">
                                            <div
                                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                                                onClick={() => setShowVolunteerDetails(!showVolunteerDetails)}
                                            >
                                                <div className="p-4 flex items-center justify-between cursor-pointer">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-indigo-100 p-2 rounded-full">
                                                            <svg
                                                                className="w-5 h-5 text-indigo-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-gray-900">Volunteer Details</h3>
                                                            <p className="text-xs text-gray-500">Click to {showVolunteerDetails ? 'hide' : 'view'} information</p>
                                                        </div>
                                                    </div>
                                                    <div className={`transform transition-transform duration-200 ${showVolunteerDetails ? 'rotate-180' : ''}`}>
                                                        <svg
                                                            className="w-5 h-5 text-gray-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showVolunteerDetails ? 'max-h-96' : 'max-h-0'}`}>
                                                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
                                                                <p className="text-sm font-medium text-gray-900">{donation?.volunteer?.name || "N/A"}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</p>
                                                                <p className="text-sm font-medium text-gray-900">{donation?.volunteer?.userId || "N/A"}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                                                                <p className="text-sm font-medium text-gray-900">{donation?.volunteer?.phone || "N/A"}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                                                                <p className="text-sm font-medium text-gray-900">{donation?.volunteer?.email || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm text-gray-500">Payment Method</p>
                                        <p className="font-medium">{donation?.method || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Payment Status</p>
                                        <p className="font-medium">{donation?.paymentStatus || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Date & Time</p>
                                        <p className="font-medium">{new Date(donation?.createdAt)?.toLocaleString() || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FiHome className="mr-2 text-blue-600" /> Address
                                </h3>
                                <p className="whitespace-pre-line">{donation?.donorAddress || "N/A"}</p>
                            </div> */}
                        </div>
                    </div>

                    {/* Timeline - Admin only */}
                    {isAdmin && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Donation Timeline</h3>
                            <div className="border-l-2 border-gray-200 pl-6 space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-7 top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
                                    <div className="flex items-start">
                                        <div className="flex-1">
                                            <p className="font-medium">Donation Received</p>
                                            <p className="text-sm text-gray-500">{formatDate(donation?.createdAt) || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {donation.receiptGeneratedAt && (
                                    <div className="relative">
                                        <div className="absolute -left-7 top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white"></div>
                                        <div className="flex items-start">
                                            <div className="flex-1">
                                                <p className="font-medium">Receipt Generated</p>
                                                <p className="text-sm text-gray-500">{formatDate(donation?.receiptGeneratedAt) || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className='flex justify-between'>
                    {isAdmin && (
                        <div className="px-6 py-4 flex justify-start space-x-3">
                            <button
                                onClick={() => {
                                    setShowOldDonations(!showOldDonations);
                                    setTimeout(() => { // Wait for state update and DOM render
                                        if (!showOldDonations) {
                                            // Scroll to bottom of donations container
                                            const container = document.querySelector('.donations-container');
                                            if (container) {
                                                container.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                            }
                                        } else {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }, 0);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                {showOldDonations ? 'Hide' : 'Show'} Previous Donations
                            </button>
                        </div>
                    )}
                    <div className="px-6 py-4 flex justify-end space-x-3">
                        {/* <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                            Edit Details
                        </button> */}
                        {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Generate Receipt
                        </button> */}
                        <button onClick={() => goBack()} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                            Back
                        </button>
                    </div>
                </div>

                {
                    showOldDonations && (
                        <div className="">
                            <DonationHistory userId={donation?.donorUserId} setDonationId={setDonation} />
                        </div>
                    )
                }

                <div className="mt-36 donations-container"></div>
            </div>

            {/* Modal for viewing receipt */}
            {showReceiptModal && (
                <PDFViewerModal
                    fileUrl={donation?.receiptPath}
                    onClose={() => setShowReceiptModal(false)}
                />
            )}
            {/* Modal for updating donor info */}
            <UpdateDonorModal
                isOpen={showUpdateDonorModal}
                onClose={() => setShowUpdateDonorModal(false)}
                donorData={donation}
                onSave={handleSaveDonorInfo}
            />
        </div>
    );
};

export default DonationDetails;