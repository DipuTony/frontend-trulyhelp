"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchDonerDonations } from "../../store/slices/donationSlice"
import { Link } from "react-router-dom"
import { formatDateShort } from "../../components/common/DateFormatFunctions"

const DonorDonationHistory = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { donations, loading, error } = useSelector((state) => state.donations)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDonations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
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
                      {formatDateShort(donation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{donation.amount?.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.paymentMethod || "Online"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${donation.verified 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {donation.verified ? "Verified" : "Pending"}
                      </span>
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
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      currentPage === idx + 1
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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Tax Receipts</h3>
            <p className="mt-1 text-sm text-gray-500">Download tax receipts for your donations</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <i className="fas fa-download mr-2"></i>
            Download Tax Receipt
          </button>
        </div>
      </div>
    </div>
  )
}

export default DonorDonationHistory
