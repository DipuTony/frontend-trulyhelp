"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations } from "../../store/slices/donationSlice"
import { formatDateShort } from "../../components/common/DateFormatFunctions"

const VolunteerDonationHistory = () => {
  const [filter, setFilter] = useState("all")

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { donations, loading } = useSelector((state) => state.donations)

  useEffect(() => {
    dispatch(fetchDonations())
  }, [dispatch])

  const filteredDonations =
    filter === "all"
      ? donations
      : filter === "verified"
        ? donations.filter((d) => d.verified)
        : donations.filter((d) => !d.verified)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Donation History</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all donations you have collected, including their status and details.
          </p>
        </div>
      </div>

      <div className="mt-4 flex space-x-4">
        {["all", "verified", "pending"].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${filter === key
              ? key === "verified"
                ? "bg-green-100 text-green-800"
                : key === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-indigo-100 text-indigo-800"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Donor
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Payment Method
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No donations found
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((donation) => (
                      <tr key={donation.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">{donation.donorName}</div>
                          <div className="text-gray-500">{donation.donorEmail}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          ₹{donation.amount.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDateShort(donation.date)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {donation.paymentMethod}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${donation.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolunteerDonationHistory
