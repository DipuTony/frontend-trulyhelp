"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations, verifyDonation } from "../../store/slices/donationSlice"
import { formatDateShort } from "../../components/common/DateFormatFunctions"
import { showErrorToast, showSuccessToast } from '../../utils/toast';

const PaymentVerification = () => {
  const dispatch = useDispatch()
  const { donations, loading, error } = useSelector((state) => state.donations)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchPendingDonations = () => {
    dispatch(fetchDonations("PENDING"))
  }

  const filteredDonations = donations?.filter(donation => 
    donation?.donorName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    donation?.donorPhone?.includes(searchTerm) ||
    donation?.donationId?.includes(searchTerm)
  )

  useEffect(() => {
    fetchPendingDonations()
  }, [dispatch])

  const handleSelectDonation = (donation) => {
    setSelectedDonation(donation)
  }

  const handleVerify = () => {
    if (selectedDonation) {
      console.log("in jsx", selectedDonation.donationId, selectedDonation.amount)
      dispatch(verifyDonation({donationId:selectedDonation.donationId, amount:selectedDonation.amount}))
        .unwrap()
        .then(() => {
          showSuccessToast('Donation verified successfully!');
          setSelectedDonation(null);
          fetchPendingDonations(); // Refresh the list after verification
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
            <div className="mt-2 max-h-96 overflow-y-auto">
              {filteredDonations?.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No matching donations found.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredDonations?.map((donation) => (
                    <li
                      key={donation.id}
                      className={`py-4 cursor-pointer hover:bg-gray-50 ${selectedDonation?.id === donation.id ? "bg-indigo-50" : ""}`}
                      onClick={() => handleSelectDonation(donation)}
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
                          <p className="text-xs text-gray-500">ID: {donation.donationId}</p>
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
            <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Details</h3>
            {selectedDonation ? (
              <div className="mt-5 border-t border-gray-200 pt-5">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
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
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDateShort(selectedDonation.createdAt)}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedDonation.method || "N/A"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedDonation.donationId || "N/A"}
                    </dd>
                  </div>
                 
                  {/* <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Payment Receipt</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50 flex items-center justify-center">
                        <i className="fas fa-file-invoice text-gray-400 text-4xl"></i>
                      </div>
                    </dd>
                  </div> */}
                </dl>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i className="fas fa-check mr-2"></i>
                    Verify Payment
                  </button>
                </div>
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
