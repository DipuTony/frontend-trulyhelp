"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations } from "../../store/slices/donationSlice"
import { fetchVolunteers } from "../../store/slices/volunteerSlice"
import { fetchExpenses } from "../../store/slices/expenseSlice"
import { Link } from "react-router-dom"
import 'animate.css'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { donations = [], loading: donationsLoading } = useSelector((state) => state.donations)
  const { volunteers = [], loading: volunteersLoading } = useSelector((state) => state.volunteers)
  const { expenses = [], loading: expensesLoading } = useSelector((state) => state.expenses)

  useEffect(() => {
    dispatch(fetchDonations())
    dispatch(fetchVolunteers())
    dispatch(fetchExpenses())
  }, [dispatch])

  // Safe calculation functions
  const calculateTotal = (items, key = 'amount') => {
    if (!Array.isArray(items)) return 0
    return items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0)
  }

  const countByStatus = (items, statusKey, statusValue) => {
    if (!Array.isArray(items)) return 0
    return items.filter(item => item[statusKey] === statusValue).length
  }

  // Calculate statistics
  const totalDonations = calculateTotal(donations)
  const verifiedDonations = countByStatus(donations, 'verified', true)
  const pendingDonations = countByStatus(donations, 'verified', false)
  const totalExpenses = calculateTotal(expenses)
  const netBalance = totalDonations - totalExpenses

  const stats = [
    {
      name: "Total Donations",
      value: `₹${totalDonations.toFixed(2)}`,
      icon: "dollar-sign",
      color: "bg-green-500",
    },
    { 
      name: "Volunteers", 
      value: volunteers.length, 
      icon: "users", 
      color: "bg-blue-500" 
    },
    { 
      name: "Expenses", 
      value: `₹${totalExpenses.toFixed(2)}`, 
      icon: "file-invoice", 
      color: "bg-red-500" 
    },
    { 
      name: "Net Balance", 
      value: `₹${netBalance.toFixed(2)}`, 
      icon: "balance-scale", 
      color: "bg-purple-500" 
    },
  ]

  const donationStats = [
    { 
      name: "Verified Donations", 
      value: verifiedDonations, 
      icon: "check-circle", 
      color: "bg-green-500" 
    },
    { 
      name: "Pending Donations", 
      value: pendingDonations, 
      icon: "clock", 
      color: "bg-yellow-500" 
    },
  ]

  if (donationsLoading || volunteersLoading || expensesLoading) {
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
            <h1 className="text-3xl font-bold">Welcome back, Admin</h1>
            <p className="mt-1 text-indigo-100">Monitor and manage all donations and activities</p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/admin/donations"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
            >
              <i className="fas fa-chart-line mr-2"></i>
              View Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color.replace('bg-', 'bg-opacity-20 ')} ${stat.color.replace('bg-', 'text-')}`}>
                <i className={`fas fa-${stat.icon} text-2xl`}></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Donation Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {donationStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color.replace('bg-', 'bg-opacity-20 ')} ${stat.color.replace('bg-', 'text-')}`}>
                <i className={`fas fa-${stat.icon} text-2xl`}></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Donations Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Donations</h2>
            <Link 
              to="/admin/donations" 
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
              {Array.isArray(donations) && donations.slice(0, 5).map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{donation.donorName || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">{donation.donorEmail || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">₹{Number(donation.amount || 0).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : '-'}
                    </div>
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
              <h3 className="text-lg font-semibold">Manage Volunteers</h3>
              <p className="mt-1 text-purple-100">View and manage volunteer activities</p>
            </div>
            <Link
              to="/admin/users/volunteer"
              className="inline-flex items-center px-4 py-2 rounded-md bg-white text-purple-600 hover:bg-purple-50 transition-colors duration-200"
            >
              <i className="fas fa-users mr-2"></i>
              Manage
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Payment Verification</h3>
              <p className="mt-1 text-blue-100">Verify pending donation payments</p>
            </div>
            <Link
              to="/admin/payment-verification"
              className="inline-flex items-center px-4 py-2 rounded-md bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Verify
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard