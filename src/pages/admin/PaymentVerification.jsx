"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations, verifyDonation } from "../../store/slices/donationSlice"
import { formatDateShort, formatRelativeTime } from "../../components/common/DateFormatFunctions"
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import axios from "axios"

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

  useEffect(() => {
    fetchPaymentStatusesMasterData();
  }, []);

  useEffect(() => {
    fetchMasterData()
  }, [])

  useEffect(() => {
    fetchDonationsByMethod();
  }, [dispatch]);

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
      const statusResponse = await axios.get(`${import.meta.env.VITE_API_URL}master/payment-statuses`)
      if (statusResponse.data.status) {
        setPaymentStatuses(statusResponse.data.data)
      }

      //  fetch payment methods:
      const methodResponse = await axios.get(`${import.meta.env.VITE_API_URL}master/payment-methods`)
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}master/payment-statuses`);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Payment Verification</h1>
          <p className="mt-2 text-sm text-gray-700">
            Verify pending donation payments done by volunteers which is offline.
          </p>
        </div>
      </div>

      {/* Payment Filter */}
      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
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

        <div className="flex-1">
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
            className="h-10 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
        </div>
      </div>


      {/* Search Bar */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by name, phone, or transaction ID"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Pending Donations</h3>
            <div className="mt-2 max-h-96 overflow-y-auto ">
              {donations?.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No matching donations found.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {donations?.map((donation) => (
                    <li
                      key={donation.id}
                      className={`py-4 cursor-pointer hover:bg-gray-50 ${selectedDonation?.id === donation.id ? "bg-indigo-50" : ""}`}
                      onClick={() => setSelectedDonation(donation)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                            <i className="fas fa-user text-indigo-500"></i>
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{donation.donorName}</p>
                          <p className="text-sm text-gray-500 truncate">{donation.donorEmail}</p>
                          <p className="text-sm text-gray-500 truncate">{donation.donorPhone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">₹{donation.amount?.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{formatDateShort(donation.createdAt)}</p>
                          <p className="text-xs text-gray-500">TID: {donation.transactionId}</p>
                          <p className="text-xs text-gray-500">Method: {donation.method}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="sm:col-span-3">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Details</h3>
              <h3>{selectedDonation?.paymentStatus && selectedDonation?.paymentStatus}</h3>
            </div>
            {selectedDonation ? (
              <div className="mt-5 border-t border-gray-200 pt-5">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Donation ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedDonation.donationId || "N/A"}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedDonation.transactionId || "N/A"}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Donor Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedDonation.donorName}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Donor Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedDonation.donorPhone}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Donor Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedDonation.donorEmail}</dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Amount</dt>
                    <dd className="mt-1 text-sm text-gray-900">₹{selectedDonation.amount?.toFixed(2)}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Payment Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDateShort(selectedDonation.createdAt)}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedDonation.method || "N/A"}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 capitalize">Payment Ref No</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedDonation?.offlinePaymentRefNo || "N/A"}</dd>
                  </div>
                  {selectedDonation?.checkIssueDate &&
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Check Issue Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDateShort(selectedDonation.checkIssueDate) || "N/A"}
                        <span className="text-gray-400 text-sm mx-2">({formatRelativeTime(selectedDonation.checkIssueDate)})</span>
                      </dd>
                    </div>
                  }
                  {selectedDonation?.checkExpiryDate &&
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Check Expiry Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDateShort(selectedDonation.checkExpiryDate) || "N/A"}
                        <span className="text-gray-400 text-sm mx-2">({formatRelativeTime(selectedDonation.checkExpiryDate)})</span>
                      </dd>
                    </div>
                  }
                </dl>
                <div className="mt-6 flex justify-end space-x-4">
                  {loadingStatuses ? (
                    <div className="animate-pulse h-10 w-32 bg-gray-200 rounded"></div>
                  ) : (
                    <select
                      value={selectedPaymentStatusForVerify}
                      onChange={(e) => (setSelectedPaymentStatusForVerify(e.target.value), setDropdownError(''))}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select</option>
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i className="fas fa-check mr-2"></i>
                    Verify Payment
                  </button>
                </div>
                {dropdownError && (
                  <p className="text-center mt-1 text-sm text-red-600">{dropdownError}</p>
                )}
              </div>
            ) : (
              <div className="mt-5 flex items-center justify-center h-64">
                <p className="text-sm text-gray-500 italic">Select a donation to view payment details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentVerification
