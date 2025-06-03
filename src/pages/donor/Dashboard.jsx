"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { formatDateShort } from "../../components/common/DateFormatFunctions"
import 'animate.css'
import axiosInstance from "../../utils/axiosInterceptor"

const DonorDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}report/donor-dashboard`)
        setDashboardData(response.data.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    )
  }

  console.log("dashboardData", dashboardData)

  if (!dashboardData) return <div>No data available</div>

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white mb-4 md:mb-0">
            <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Donor"}</h1>
            <p className="mt-1 text-indigo-100">Track your donations and make a difference</p>
          </div>
          <Link
            to="/donor/donate"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
          >
            <i className="fas fa-hand-holding-heart mr-2"></i>
            Donate Now
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
              <p className="text-sm text-gray-500 font-medium">Total Donation</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{dashboardData?.donationSummary
?.totalAmountDonated.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-check-circle text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Completed Donations</p>
              <h3 className="text-2xl font-bold text-gray-900">{dashboardData?.donationSummary
?.totalCompletedDonations}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-percentage text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Completion Rate</p>
              <h3 className="text-2xl font-bold text-gray-900">{dashboardData?.performanceMetrics?.completionRate}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Donations</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donation Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData?.recentDonations?.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{donation.donationId}</div>
                    <div className="text-sm text-gray-500">{donation.donorPhone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">₹{donation.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{donation.paymentStatus}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{donation.method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDateShort(donation.createdAt)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ICard Status */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Volunteer Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Status</p>
            <p className="text-lg font-semibold">{dashboardData?.iCard?.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Assigned On</p>
            <p className="text-lg font-semibold">{formatDateShort(dashboardData?.iCard?.assignDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Expires On</p>
            <p className="text-lg font-semibold">{formatDateShort(dashboardData?.iCard?.expiryDate)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDashboard
