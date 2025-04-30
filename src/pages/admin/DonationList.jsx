"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations, verifyDonation } from "../../store/slices/donationSlice"
import { Link, useNavigate } from "react-router-dom"
import 'animate.css';

const DonationList = () => {
  const dispatch = useDispatch()
  const { donations, loading, error } = useSelector((state) => state.donations)
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'ADMIN'
  const [filter, setFilter] = useState("ALL") // ALL, PENDING, COMPLETED, FAILED,  REFUNDED

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchDonations(filter))
  }, [dispatch, filter])

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleViewDonation = (donationId) => {
    navigate(`/admin/donations/${donationId}`);
  }

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
    <div className="animate__animated animate__fadeIn">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Donations</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all donations including their donor, amount, date, and verification status.
          </p>
        </div>
      </div>

      <div className="mt-4 animate__animated animate__fadeInUp">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="block w-48 rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="ALL">All Donations</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          {/* <option value="CANCELLED">Cancelled</option> */}
          <option value="REFUNDED">Refunded</option>
        </select>
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
                    {isAdmin &&
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    }
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {donations?.length > 0 ? (
                    donations.map((donation) => (
                      <tr key={donation.id} className="animate__animated animate__fadeIn">
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
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                            ${donation.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              donation.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                donation.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                  donation.paymentStatus === 'REFUNDED' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                            {donation.paymentStatus}
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
                          {isAdmin && (
                            <>                            
                              <button
                                onClick={() => handleViewDonation(donation?.donationId)}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <i className="fas fa-eye mr-1"></i>
                                View Details
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="animate__animated animate__fadeIn">
                      <td colSpan="7" className="py-8 text-center">
                        <div className="text-gray-500">
                          No donations found for {filter === 'PENDING' ? 'Pending' :
                            filter === 'COMPLETED' ? 'Completed' :
                              filter === 'FAILED' ? 'Failed' :
                                filter === 'REFUNDED' ? 'Refunded' : 'All'}
                        </div>
                      </td>
                    </tr>
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

export default DonationList
