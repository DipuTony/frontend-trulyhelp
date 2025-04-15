"use client"

import { useEffect, useState } from "react"
// import { useSelector, useDispatch } from "react-redux"
// import { fetchDonations } from "../../store/slices/donationSlice"
import { Link } from "react-router-dom"

const DonorDonationHistory = () => {
  // const dispatch = useDispatch()
  // const { user } = useSelector((state) => state.auth)
  // const { donations, loading, error } = useSelector((state) => state.donations)

  // TEMP dummy user & donation data
  const user = {
    name: "Jane Doe",
    email: "jane@example.com"
  }

  const donations = [
    {
      id: 1,
      donorEmail: "jane@example.com",
      donorName: "Jane Doe",
      amount: 100,
      date: "2025-04-01T10:00:00Z",
      paymentMethod: "UPI",
      verified: true
    },
    {
      id: 2,
      donorEmail: "jane@example.com",
      donorName: "Jane Doe",
      amount: 250,
      date: "2025-04-05T14:30:00Z",
      paymentMethod: "Card",
      verified: false
    },
    {
      id: 3,
      donorEmail: "jane@example.com",
      donorName: "Jane Doe",
      amount: 75,
      date: "2025-04-07T09:45:00Z",
      paymentMethod: "Netbanking",
      verified: true
    }
  ]

  // useEffect(() => {
  //   dispatch(fetchDonations())
  // }, [dispatch])

  const myDonations = donations.filter((d) => d.donorEmail === user?.email)

  const totalDonated = myDonations.reduce((sum, donation) => sum + (donation.amount || 0), 0)
  const verifiedDonations = myDonations.filter((d) => d.verified)
  const pendingDonations = myDonations.filter((d) => !d.verified)

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome, {user?.name || "Donor"}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/donor/donate"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i className="fas fa-hand-holding-heart mr-2"></i>
            Donate Now
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Your Donation Summary</h3>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <i className="fas fa-hand-holding-usd h-6 w-6 text-white"></i>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Donated</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">₹{totalDonated.toFixed(2)}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <i className="fas fa-check-circle h-6 w-6 text-white"></i>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Verified Donations</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{verifiedDonations.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <i className="fas fa-clock h-6 w-6 text-white"></i>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Donations</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{pendingDonations.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Donation History</h3>
        </div>
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
                        Date
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
                        Payment Method
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
                    {myDonations.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          You haven't made any donations yet.{" "}
                          <Link to="/donor/donate" className="text-indigo-600 hover:text-indigo-900">
                            Make your first donation
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      myDonations.map((donation) => (
                        <tr key={donation.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(donation.date).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{donation.amount?.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{donation.paymentMethod || "Online"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                donation.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
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

      <div className="mt-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Tax Receipts</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Download tax receipts for your donations.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <i className="fas fa-download mr-2"></i>
                Download Tax Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDonationHistory
