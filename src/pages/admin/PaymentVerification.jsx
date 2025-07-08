"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations, verifyDonation } from "../../store/slices/donationSlice"
import { formatDateShort, formatRelativeTime } from "../../components/common/DateFormatFunctions"
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import axios from "axios"
import ImageViewerModal from "../admin/Donations/ImageViewerModal";

const PaymentVerification = () => {
  const dispatch = useDispatch()
  const { donations, loading, error } = useSelector((state) => state.donations)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentStatuses, setPaymentStatuses] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('PENDING')
  const [selectedMethod, setSelectedMethod] = useState('ALL')
  const [loadingStatuses, setLoadingStatuses] = useState(false)
  const [loadingMethods, setLoadingMethods] = useState(false)
  const [selectedPaymentStatusForVerify, setSelectedPaymentStatusForVerify] = useState('')
  const [dropdownError, setDropdownError] = useState('');
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageToView, setImageToView] = useState(null);

  useEffect(() => {
    fetchPaymentStatusesMasterData();
  }, []);

  useEffect(() => {
    fetchMasterData()
  }, [])

  useEffect(() => {
    fetchDonationsByMethod();
  }, [dispatch]);

  // Clear selection when donations list changes
  useEffect(() => {
    setSelectedDonation(null);
  }, [donations]);

  const fetchDonationsByMethod = () => {
    dispatch(fetchDonations({
      selectedStatus: selectedStatus || 'PENDING',
      selectedMethod: selectedMethod || 'ALL'
    }));
  }

  const fetchMasterData = async () => {
    try {
      setLoadingStatuses(true)
      setLoadingMethods(true)

      // Fetch payment statuses
      const statusResponse = await axios.get(`${import.meta.env.VITE_API_URL}/master/payment-statuses`)
      if (statusResponse.data.status) {
        setPaymentStatuses(statusResponse.data.data)
      }

      //  fetch payment methods:
      const methodResponse = await axios.get(`${import.meta.env.VITE_API_URL}/master/payment-methods`)
      if (methodResponse.data.status) {
        // Use the same structure as VolunteerLayout's navigation
        const formattedMethods = methodResponse.data.data.groups.flatMap(group =>
          group.options.map(option => ({
            id: option.value,
            name: option.label
          }))
        )
        setPaymentMethods(formattedMethods)
      }
    } catch (err) {
      console.error('Error fetching master data:', err)
    } finally {
      setLoadingStatuses(false)
      setLoadingMethods(false)
    }
  }

  const fetchPaymentStatusesMasterData = async () => {
    try {
      setLoadingStatuses(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/master/payment-statuses`);
      if (response.data.status) {
        setPaymentStatuses(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching payment statuses:', err);
    } finally {
      setLoadingStatuses(false);
    }
  };

  const handleVerify = () => {
    if (!selectedPaymentStatusForVerify) {
      setDropdownError('Please select a payment status');
      return;
    }
    setDropdownError('');

    if (selectedDonation) {
      console.log("in jsx", selectedDonation.donationId, selectedDonation.amount, selectedPaymentStatusForVerify)
      dispatch(verifyDonation({ paymentStatus: selectedPaymentStatusForVerify, donationId: selectedDonation.donationId, amount: selectedDonation.amount }))
        .unwrap()
        .then(() => {
          showSuccessToast('Donation verified successfully!');
          setSelectedDonation(null);
          fetchDonationsByMethod(); // Refresh the list after verification
        })
        .catch((error) => {
          showErrorToast(error?.message || 'Failed to verify donation');
        });
    }
  };

  const handleOpenImageViewer = (imageUrl) => {
    setImageToView(imageUrl);
    setIsImageViewerOpen(true);
  };

  const handleCloseImageViewer = () => {
    setImageToView(null);
    setIsImageViewerOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Verification</h1>
        <p className="mt-2 text-lg text-gray-600">
          Verify pending donation payments from volunteers
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            {loadingStatuses ? (
              <div className="animate-pulse h-10 w-full bg-gray-200 rounded"></div>
            ) : (
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            {loadingMethods ? (
              <div className="animate-pulse h-10 w-full bg-gray-200 rounded"></div>
            ) : (
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Methods</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-end">
            <button
              onClick={() => fetchDonationsByMethod()}
              className="w-full h-10 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by name, phone, or transaction ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Donations List */}
        <div className="lg:w-1/2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Pending Donations</h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {donations?.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 italic">No matching donations found.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {donations?.map((donation) => {
                    console.log('selectedDonation?.donationId:', selectedDonation?.donationId, typeof selectedDonation?.donationId);
                    console.log('donation.donationId:', donation.donationId, typeof donation.donationId);
                    const isSelected = String(selectedDonation?.donationId) === String(donation.donationId);
                    return (
                      <li
                        key={donation.donationId}
                        className={`p-4 cursor-pointer transition-colors duration-150 
                          ${isSelected 
                            ? "bg-blue-200 border-l-4 border-blue-600" 
                            : "hover:bg-gray-50"}`}
                        onClick={() => setSelectedDonation(donation)}
                      >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                            <i className="fas fa-user text-indigo-500"></i>
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">{donation.donorName}</p>
                            <p className="text-sm font-semibold text-indigo-600">₹{donation.amount?.toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{donation.donorPhone}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full 
                              ${donation.paymentEvidencePath 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"}`}>
                              {donation.paymentEvidencePath ? "Image Available" : "No Image"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDateShort(donation.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  )})}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Donation Details */}
        <div className="lg:w-1/2">
          <div className={`bg-white shadow rounded-lg h-full transition-all duration-300 
            ${selectedDonation ? "opacity-100" : "opacity-70"}`}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
              {selectedDonation?.paymentStatus && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${selectedDonation.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    selectedDonation.paymentStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {selectedDonation.paymentStatus}
                </span>
              )}
            </div>
            
            {selectedDonation ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Donation Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Donation ID</p>
                        <p className="text-sm font-medium">{selectedDonation.donationId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Transaction ID</p>
                        <p className="text-sm font-medium">{selectedDonation.transactionId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-sm font-medium">₹{selectedDonation.amount?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Donor Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-medium">{selectedDonation.donorName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium">{selectedDonation.donorPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium">{selectedDonation.donorEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Method</p>
                      <p className="text-sm font-medium">{selectedDonation.method || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium">{formatDateShort(selectedDonation.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ref No</p>
                      <p className="text-sm font-medium">{selectedDonation?.offlinePaymentRefNo || "N/A"}</p>
                    </div>
                    {selectedDonation?.checkIssueDate && (
                      <div>
                        <p className="text-xs text-gray-500">Check Issue Date</p>
                        <p className="text-sm font-medium">
                          {formatDateShort(selectedDonation.checkIssueDate)}
                          <span className="text-gray-400 text-xs ml-1">({formatRelativeTime(selectedDonation.checkIssueDate)})</span>
                        </p>
                      </div>
                    )}
                    {selectedDonation?.checkExpiryDate && (
                      <div>
                        <p className="text-xs text-gray-500">Check Expiry Date</p>
                        <p className="text-sm font-medium">
                          {formatDateShort(selectedDonation.checkExpiryDate)}
                          <span className="text-gray-400 text-xs ml-1">({formatRelativeTime(selectedDonation.checkExpiryDate)})</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedDonation?.paymentEvidencePath && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Evidence</h4>
                    <div className="flex items-start space-x-4">
                      <img
                        src={selectedDonation.paymentEvidencePath}
                        alt="Payment Evidence"
                        className="w-32 h-32 object-contain rounded-md border border-gray-300 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleOpenImageViewer(selectedDonation.paymentEvidencePath)}
                      />
                      {selectedDonation.paymentEvidenceUploadedAt && (
                        <div className="text-sm text-gray-500">
                          <p>Uploaded: {formatDateShort(selectedDonation.paymentEvidenceUploadedAt)}</p>
                          <p>({formatRelativeTime(selectedDonation.paymentEvidenceUploadedAt)})</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <div className="flex flex-col space-y-4">
                    {loadingStatuses ? (
                      <div className="animate-pulse h-10 w-full bg-gray-200 rounded"></div>
                    ) : (
                      <select
                        value={selectedPaymentStatusForVerify}
                        onChange={(e) => (setSelectedPaymentStatusForVerify(e.target.value), setDropdownError(''))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select new status</option>
                        {paymentStatuses
                          .filter(status => selectedDonation?.paymentStatus !== status)
                          .map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))
                        }
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={handleVerify}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <i className="fas fa-check mr-2"></i>
                      Verify Payment
                    </button>
                  </div>
                  {dropdownError && (
                    <p className="mt-2 text-sm text-red-600 text-center">{dropdownError}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
                <i className="fas fa-hand-pointer text-4xl text-gray-300 mb-4"></i>
                <h4 className="text-lg font-medium text-gray-500">Select a donation</h4>
                <p className="text-sm text-gray-400 mt-1">Choose a donation from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isImageViewerOpen && (
        <ImageViewerModal
          imageUrl={imageToView}
          onClose={handleCloseImageViewer}
        />
      )}
    </div>
  )
}

export default PaymentVerification