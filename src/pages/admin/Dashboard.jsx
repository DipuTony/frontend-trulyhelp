"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations } from "../../store/slices/donationSlice"
import { fetchVolunteers } from "../../store/slices/volunteerSlice"
import { fetchExpenses } from "../../store/slices/expenseSlice"

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { donations, loading: donationsLoading } = useSelector((state) => state.donations)
  const { volunteers, loading: volunteersLoading } = useSelector((state) => state.volunteers)
  const { expenses, loading: expensesLoading } = useSelector((state) => state.expenses)

  useEffect(() => {
    dispatch(fetchDonations())
    dispatch(fetchVolunteers())
    dispatch(fetchExpenses())
  }, [dispatch])

  // Calculate statistics
  const totalDonations = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0)
  const verifiedDonations = donations.filter((d) => d.verified).length
  const pendingDonations = donations.filter((d) => !d.verified).length
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
  const netBalance = totalDonations - totalExpenses

  const stats = [
    {
      name: "Total Donations",
      value: `${totalDonations.toFixed(2)}`,
      icon: "dollar-sign",
      color: "bg-green-500",
    },
    { name: "Volunteers", value: volunteers.length, icon: "users", color: "bg-blue-500" },
    { name: "Expenses", value: `${totalExpenses.toFixed(2)}`, icon: "file-invoice", color: "bg-red-500" },
    { name: "Net Balance", value: `${netBalance.toFixed(2)}`, icon: "balance-scale", color: "bg-purple-500" },
  ]

  const donationStats = [
    { name: "Verified Donations", value: verifiedDonations, icon: "check-circle", color: "bg-green-500" },
    { name: "Pending Donations", value: pendingDonations, icon: "clock", color: "bg-yellow-500" },
  ]

  if (donationsLoading || volunteersLoading || expensesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Overview</h2>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <i className={`fas fa-${stat.icon} h-6 w-6 text-white`} aria-hidden="true"></i>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Donation Status</h2>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {donationStats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <i className={`fas fa-${stat.icon} h-6 w-6 text-white`} aria-hidden="true"></i>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Donations</h2>
        <div className="mt-2 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Donor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.slice(0, 5).map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                          <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${donation.amount?.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(donation.date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${donation.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
