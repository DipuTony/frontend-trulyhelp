"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { onlineGuestDonationEazyBuzz } from "../../store/slices/donationSlice"
import { Link } from "react-router-dom"
import 'animate.css'

const GuestDonateNow = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.donations)

  // Update the initial state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "INDIA",
    panNumber: "",
    amount: "",
    category: "general",
    receiveG80Certificate: false,
  })

  const donationAmounts = [100, 500, 1000, 2000, 5000, 10000]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAmountSelect = (amount) => {
    setFormData((prev) => ({
      ...prev,
      amount: amount.toString(),
    }))
  }

  // First, update the error handling in the form validation
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic phone validation before API call
    if (!/^\d{10}$/.test(formData.phone)) {
      dispatch({
        type: 'donations/setError',
        payload: 'Please enter a valid 10-digit phone number'
      })
      return
    }
  
    const newDonation = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dateOfBirth,
      pan: formData.panNumber,
      address: formData.address,
      address: formData.address,
      donationAmount: Number.parseFloat(formData.amount),
      // category: formData.category,
    }

    console.log(newDonation)
    // return
  
    dispatch(onlineGuestDonationEazyBuzz(newDonation))
  }

  // Update the error display in the JSX
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 animate__animated animate__fadeIn animate__delay-0.5s">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Make a <span className="text-indigo-600">Difference</span> Today
          </h1>
          <p className="mt-3 text-xl text-gray-500">Your generosity can change lives.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md animate__animated animate__shakeX">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {typeof error === 'string' ? error : error.message || 'An error occurred. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate__animated animate__fadeInUp">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Donation Amount */}
            <div className="p-8 bg-gradient-to-br from-indigo-50 via-indigo-100 to-white animate__animated animate__fadeInLeft">
              <div className="sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Amount</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      className={`${formData.amount === amount.toString()
                          ? "bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-600"
                          : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
                        } px-4 py-3 rounded-xl text-lg font-semibold transition-all duration-200`}
                    >
                      ₹{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="mb-8">
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <span className="text-gray-500 text-lg">₹</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Custom amount"
                    />
                  </div>
                </div>

                {/* Donation Summary */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                  <div className="space-y-3 text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-semibold text-gray-900">
                        ₹{formData.amount ? Number(formData.amount).toLocaleString() : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Category</span>
                      <span className="text-gray-900 capitalize">{formData.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Details */}
            <div className="p-8 border-t lg:border-t-0 lg:border-l border-gray-200 animate__animated animate__fadeInRight">
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
                  <div className="grid gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="dd-mm-yyyy"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          pattern="[0-9]{10}"
                          maxLength={10}
                          placeholder="Enter 10 digit number"
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={2}
                        className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          required
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          readOnly
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="receiveG80Certificate"
                        checked={formData.receiveG80Certificate}
                        onChange={(e) => handleChange({ target: { name: e.target.name, value: e.target.checked } })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        I would like to receive 80(G) Certificate.
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Section */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading || !formData.amount || !formData.name || !formData.email}
                    className="w-full px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </button>
                  <p className="mt-4 text-sm text-center text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GuestDonateNow
