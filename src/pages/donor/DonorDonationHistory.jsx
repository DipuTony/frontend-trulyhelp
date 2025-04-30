"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchDonerDonations } from "../../store/slices/donationSlice"
import { Link } from "react-router-dom"
import { formatDateShort } from "../../components/common/DateFormatFunctions"
import axios from "axios"
import { showSuccessToast } from "../../utils/toast"

const DonorDonationHistory = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { donations, loading, error } = useSelector((state) => state.donations)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [generatingReceipt, setGeneratingReceipt] = useState(false)

  useEffect(() => {
    dispatch(fetchDonerDonations())
  }, [dispatch])

  const totalDonated = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0)
  const verifiedDonations = donations.filter((d) => d.verified)
  const pendingDonations = donations.filter((d) => !d.verified)

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentDonations = donations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(donations.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleDownloadReceipt = async (donationId) => {
    try {
      setGeneratingReceipt(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}donations/receipt/${donationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log("this is response", response);

      if (!response.data.status) {
        throw new Error('Failed to download receipt');
      }

      const filePath = response?.data?.filePath;
      const fileName = response?.data?.fileName || "Download.pdf";
      console.log("filePath", filePath)

      // Try to force download
      const anchor = document.createElement('a');
      anchor.href = filePath;
      anchor.download = fileName;
      anchor.target = '_blank'; // Open in new tab if download fails
      anchor.rel = 'noopener noreferrer';

      // This will trigger download if possible, otherwise open in new tab
      anchor.click();
      showSuccessToast("Receipt downloaded successfully!");

    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    }
    finally {
      setGeneratingReceipt(false);
    }
  };

  const handleDownloadAllReceipts = async () => {
    try {
      const response = await fetch('/donations/receipts/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to download receipts')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `all-donation-receipts-${new Date().toISOString().split('T')[0]}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading receipts:', error)
      alert('Failed to download receipts. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Welcome Back, {user?.name || "Donor"}</h2>
            <p className="mt-2 text-indigo-100">Track your contributions and their impact</p>
          </div>
          <Link
            to="/donor/donate"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-200"
          >
            <i className="fas fa-hand-holding-heart mr-2"></i>
            Make a Donation
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-4">
              <i className="fas fa-hand-holding-usd text-2xl text-white"></i>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Donated</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalDonated.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4">
              <i className="fas fa-check-circle text-2xl text-white"></i>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Verified Donations</p>
              <p className="text-2xl font-bold text-gray-900">{verifiedDonations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4">
              <i className="fas fa-clock text-2xl text-white"></i>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Pending Donations</p>
              <p className="text-2xl font-bold text-gray-900">{pendingDonations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation History Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Donation History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donation Id</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Receipt</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDonations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="text-center">
                      <i className="fas fa-gift text-4xl text-gray-300 mb-3"></i>
                      <p className="text-gray-500 mb-4">No donations found</p>
                      <Link
                        to="/donor/donate"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Make your first donation
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                currentDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation?.donationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateShort(donation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{donation.amount?.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.method || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                            ${donation.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          donation.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            donation.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                              donation.paymentStatus === 'REFUNDED' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}`}>
                        {donation.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDownloadReceipt(donation?.donationId)}
                        disabled={generatingReceipt || donation.paymentStatus !== "COMPLETED"}
                        className={`inline-flex items-center px-4 py-2 border rounded-xl shadow-sm text-sm font-medium disabled:opacity-50 transition-all duration-200
                          ${!donation.verified
                            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            : 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                      >
                        {donation.paymentStatus === "COMPLETED" && <i className="fas fa-download mr-2"></i>}
                        {generatingReceipt ? "Generating..." : donation.paymentStatus === "COMPLETED" ? 'Download Tax Receipt' : `Not Available`}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {donations.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, donations.length)} of {donations.length} entries
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(idx + 1)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === idx + 1
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tax Receipt Section */}
      {verifiedDonations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Tax Receipts</h3>
              <p className="mt-1 text-sm text-gray-500">Download all your verified donation receipts in one package</p>
            </div>
            <button
              onClick={handleDownloadAllReceipts}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i className="fas fa-file-archive mr-2"></i>
              Download All Receipts
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonorDonationHistory