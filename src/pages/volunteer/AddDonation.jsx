"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addDonation } from "../../store/slices/donationSlice"
import { searchVolunteers } from "../../store/slices/volunteerSlice"

const AddDonation = ({ usedFor }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { loading, error } = useSelector((state) => state.donations)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)
  const [volunteers, setVolunteers] = useState([])

  const [donationData, setDonationData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    donorDob: "",
    donorPan: "",
    donorAddress: "",
    amount: "",
    method: "",
    chequeNo: "",
  })

  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDonationData((prev) => ({ ...prev, [name]: value }))
  }

  const handleVolunteerSearch = async (query) => {
    setSearchQuery(query)
    if (query.length >= 3) {
      try {
        const response = await dispatch(searchVolunteers(query)).unwrap()
        setVolunteers(response || [])
      } catch (err) {
        console.error("Search error:", err)
        setVolunteers([])
      }
    } else {
      setVolunteers([])
    }
  }

  const handleVolunteerSelect = (volunteer) => {
    setSelectedVolunteer(volunteer)
    setVolunteers([])
    setSearchQuery("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // if (usedFor === "admin" && !selectedVolunteer) {
    //   setFormErrors(["Please select a volunteer"])
    //   return
    // }

    const newDonation = {
      name: donationData.donorName,
      email: donationData.donorEmail,
      phone: donationData.donorPhone,
      dob: donationData.donorDob,
      pan: donationData.donorPan,
      address: donationData.donorAddress,
      amount: Number(donationData.amount),
      method: donationData.method,
      chequeNo: donationData.method === "CHEQUE" ? donationData.chequeNo : undefined,
      volunteerUserId: usedFor === "admin" ? selectedVolunteer?.userId : user?.userId,
    }

    dispatch(addDonation(newDonation))
      .unwrap()
      .then(() => {
        setSuccess(true)
        setFormErrors([])
        setDonationData({
          donorName: "",
          donorEmail: "",
          donorPhone: "",
          donorDob: "",
          donorPan: "",
          donorAddress: "",
          amount: "",
          method: "",
          chequeNo: "",
        })
        setTimeout(() => setSuccess(false), 3000)
      })
      .catch((err) => {
        if (err.errors) {
          setFormErrors(err.errors)
        } else if (err.message) {
          setFormErrors([err.message])
        } else if (typeof err === 'string') {
          setFormErrors([err])
        } else {
          setFormErrors(["Failed to submit donation"])
        }
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Add New Donation</h2>
          <p className="mt-2 text-gray-600">Enter donor and donation details below</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Donation added successfully!</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {typeof error === 'string' ? error : 
                     error.message || "An error occurred"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Validation Errors */}
          {formErrors.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Validation Error</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Volunteer Search (Admin Only) */}
          {usedFor === "admin" && (
            <div className="p-8 border-b border-gray-200">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Select Volunteer <span className="text-sm text-gray-500">(optional)</span></h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleVolunteerSearch(e.target.value)}
                    placeholder="Search volunteer by name or email..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  />
                  
                  {Array.isArray(volunteers) && volunteers.length > 0 ? (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {volunteers.map((volunteer) => (
                        <div
                          key={volunteer.userId}
                          onClick={() => handleVolunteerSelect(volunteer)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="font-medium text-gray-900">{volunteer.name}</div>
                          <div className="text-sm text-gray-600">{volunteer.email}</div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.length >= 3 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                      <p className="text-gray-600">No volunteers found</p>
                    </div>
                  )}
                </div>
              
                {selectedVolunteer && (
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{selectedVolunteer.name}</p>
                        <p className="text-sm text-gray-600">{selectedVolunteer.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVolunteer(null)
                          setSearchQuery("")
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Donation Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
              {/* Donor Information */}
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Donor Information</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name*</label>
                    <input
                      type="text"
                      name="donorName"
                      value={donationData.donorName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="donorEmail"
                        value={donationData.donorEmail}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                      <input
                        type="tel"
                        name="donorPhone"
                        value={donationData.donorPhone}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="donorDob"
                        value={donationData.donorDob}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                      <input
                        type="text"
                        name="donorPan"
                        value={donationData.donorPan}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      name="donorAddress"
                      rows={3}
                      value={donationData.donorAddress}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Donation Details</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount*</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        value={donationData.amount}
                        onChange={handleChange}
                        required
                        min="0"
                        className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method*</label>
                    <select
                      name="method"
                      value={donationData.method}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="CASH">Cash</option>
                      <option value="ONLINE">Online Transfer</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>

                  {donationData.method === "CHEQUE" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cheque Number*</label>
                      <input
                        type="text"
                        name="chequeNo"
                        value={donationData.chequeNo}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-8 py-6 bg-gray-50">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform duration-150 hover:scale-105"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Donation
                      <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddDonation