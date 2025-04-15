"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations } from "../../store/slices/donationSlice"
import { fetchVolunteers } from "../../store/slices/volunteerSlice"
import { fetchExpenses } from "../../store/slices/expenseSlice"

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`rounded-lg p-3 ${stat.color} text-white`}>
                <i className={`fas fa-${stat.icon} text-xl`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Donation Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {donationStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`rounded-lg p-3 ${stat.color} text-white`}>
                <i className={`fas fa-${stat.icon} text-xl`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Donations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Donations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(donations) && donations.slice(0, 5).map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{donation.donorName || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">{donation.donorEmail || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  ₹{Number(donation.amount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${donation.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {donation.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard