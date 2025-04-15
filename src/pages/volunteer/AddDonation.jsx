"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addDonation } from "../../store/slices/donationSlice"

const AddDonation = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { loading, error } = useSelector((state) => state.donations)

  const [donationData, setDonationData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    donorDob: "",
    donorPan: "",
    donorAddress: "",
    amount: "",
    method: "", // Default to CHEQUE as per payload
    chequeNo: "",
  })

  const [showQRScanner, setShowQRScanner] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setDonationData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newDonation = {
      name: donationData.donorName,
      email: donationData.donorEmail,
      phone: donationData.donorPhone,
      dob: donationData.donorDob,
      pan: donationData.donorPan,
      address: donationData.donorAddress,
      amount: Number(donationData.amount),
      method: donationData.method,
      chequeNo: donationData.method 
      // === "CHEQUE" ? donationData.chequeNo : undefined,
      // volunteerUserId: user?.userId, // Using userId instead of id to match your schema
      // status: "PENDING",
      // createdAt: new Date().toISOString(),
    }

    dispatch(addDonation(newDonation))
      .unwrap()
      .then(() => {
        setSuccess(true)
        // Reset form
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
  }

  const toggleQRScanner = () => {
    setShowQRScanner(!showQRScanner)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add Donation</h2>
        <button
          onClick={toggleQRScanner}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <i className="fas fa-qrcode mr-2"></i>
          {showQRScanner ? "Hide QR Scanner" : "Show QR Scanner"}
        </button>
      </div>

      {showQRScanner && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center mb-4">
              <i className="fas fa-camera text-gray-400 text-5xl"></i>
            </div>
            <p className="text-sm text-gray-500 mb-4">Camera access required for QR scanning</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Start Scanning
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Donation added successfully!
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Donor Information</h3>
              
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

            {/* Donation Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Donation Details</h3>
              
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="CHEQUE">Cheque</option>
                  <option value="CASH">Cash</option>
                  <option value="ONLINE">Online Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Credit/Debit Card</option>
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
                    required={donationData.method === "CHEQUE"}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Submit Donation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDonation