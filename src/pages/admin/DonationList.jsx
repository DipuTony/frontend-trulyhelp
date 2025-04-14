"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations, verifyDonation } from "../../store/slices/donationSlice"
import { Link } from "react-router-dom"

const DonationList = () => {
  const dispatch = useDispatch()
  const { donations, loading, error } = useSelector((state) => state.donations)
  const [filter, setFilter] = useState("all") // all, verified, pending

  useEffect(() => {
    dispatch(fetchDonations())
  }, [dispatch])

  const handleVerify = (id) => {
    dispatch(verifyDonation(id))
  }

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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Donations</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all donations including their donor, amount, date, and verification status.
          </p>
        </div>
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-2 rounded-md text-sm font-medium ${filter === "all" ? "bg-indigo-100 text-indigo-800" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("verified")}
          className={`px-3 py-2 rounded-md text-sm font-medium ${filter === "verified" ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          Verified
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-2 rounded-md text-sm font-medium ${filter === "pending" ? "bg-yellow-100 text-yellow-800" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          Pending
        </button>
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
                      Method
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Self/Volt
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredDonations?.map((donation) => (
                    <tr key={donation.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{donation.donorName}</div>
                        <div className="font-normal text-gray-600">{donation.donorPhone}</div>
                        <div className="text-gray-500">{donation.donorEmail}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="text-gray-900">{donation.method}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="text-gray-900">₹{donation.amount?.toFixed(2)}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${donation.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {donation.verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${donation.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {donation?.donorUserId && "Self"}
                          {donation?.volunteer && (<Link to={`/admin/users/volunteer/${donation?.volunteer?.userId}`}> {donation?.volunteer?.name}</Link>)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                        {!donation.verified && (
                          <button
                            onClick={() => handleVerify(donation.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <i className="fas fa-check mr-1"></i>
                            Verify
                          </button>

                        )}
                        <button
                          onClick={() => console.log("View Details", donation.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <i className="fas fa-eye mr-1"></i>
                          View Details
                        </button>
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
  )
}

export default DonationList
