"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchDonations } from "../../store/slices/donationSlice"
import { Link } from "react-router-dom"
import { formatDateShort } from "../../components/common/DateFormatFunctions"
import 'animate.css'

const VolunteerDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { donations, loading } = useSelector((state) => state.donations)

  useEffect(() => {
    dispatch(fetchDonations())
  }, [dispatch])

  // Filter donations collected by this volunteer
  // const myDonations = donations.filter((d) => d.collectedBy === user?.id)
  const pendingDonations = donations.filter((d) => !d.verified)
  const verifiedDonations = donations.filter((d) => d.verified)
  
  console.log("myDonations",donations)

  // Calculate statistics
  const totalCollected = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0)
  const pendingAmount = pendingDonations.reduce((sum, donation) => sum + (donation.amount || 0), 0)
  const verifiedAmount = verifiedDonations.reduce((sum, donation) => sum + (donation.amount || 0), 0)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white mb-4 md:mb-0">
            <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Volunteer"}</h1>
            <p className="mt-1 text-indigo-100">Manage donations and track your collections</p>
          </div>
          <Link
            to="/volunteer/add-donation"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Donation
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <i className="fas fa-hand-holding-usd text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Total Collected</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalCollected.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i className="fas fa-clock text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Pending Verification</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{pendingAmount.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-check-circle text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Verified Donations</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{verifiedAmount.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Donations</h2>
            <Link 
              to="/volunteer/donation-history" 
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              View all
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations?.slice(0, 5).map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{donation.donorName || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">{donation.donorEmail || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">₹{donation.amount?.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDateShort(donation.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${donation.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {donation.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Add New Donation</h3>
              <p className="mt-1 text-purple-100">Record a new donation from a donor</p>
            </div>
            <Link
              to="/volunteer/add-donation"
              className="inline-flex items-center px-4 py-2 rounded-md bg-white text-purple-600 hover:bg-purple-50 transition-colors duration-200"
            >
              <i className="fas fa-plus mr-2"></i>
              Add
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">QR Scanner</h3>
              <p className="mt-1 text-blue-100">Scan QR codes for quick donations</p>
            </div>
            <Link
              to="/volunteer/add-donation"
              className="inline-flex items-center px-4 py-2 rounded-md bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              <i className="fas fa-qrcode mr-2"></i>
              Scan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolunteerDashboard
