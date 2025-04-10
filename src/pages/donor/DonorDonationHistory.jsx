"use client"

import { useEffect, useState } from "react"

const DonorDonationHistory = ({ donorId }) => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulated fetch — replace with your API call
    const fetchDonations = async () => {
      try {
        setLoading(true)
        // Example: const res = await fetch(`/api/donations?donorId=${donorId}`)
        // const data = await res.json()
        const data = [
          {
            id: 1,
            amount: 500,
            method: "Online Payment",
            date: "2025-03-20T15:30:00Z",
          },
          {
            id: 2,
            amount: 1000,
            method: "Cash",
            date: "2025-02-14T11:15:00Z",
          },
        ]
        setDonations(data)
      } catch (err) {
        setError("Failed to load donation history")
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [donorId])

  return (
    <div className="mt-10 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Donation History</h3>

      {loading ? (
        <p className="text-sm text-gray-500">Loading donations...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : donations.length === 0 ? (
        <p className="text-sm text-gray-500">No donations found for this donor.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(donation.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{donation.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {donation.method}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DonorDonationHistory
