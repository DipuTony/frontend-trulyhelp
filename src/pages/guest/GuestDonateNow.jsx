"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addDonation } from "../../store/slices/donationSlice"
import { Link } from "react-router-dom"

const GuestDonateNow = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.donations)

  const [donorData, setDonorData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [donationData, setDonationData] = useState({
    amount: "",
    paymentMethod: "credit_card",
    isRecurring: false,
    frequency: "monthly",
    notes: "",
    category: "general",
  })

  const [step, setStep] = useState(1)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const [success, setSuccess] = useState(false)

  // Predefined donation amounts
  const donationAmounts = [10, 25, 50, 100, 250, 500]

  const handleDonorChange = (e) => {
    const { name, value } = e.target
    setDonorData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDonationChange = (e) => {
    const { name, value, type, checked } = e.target
    setDonationData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleAmountSelect = (amount) => {
    setDonationData((prev) => ({
      ...prev,
      amount: amount.toString(),
    }))
  }

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNextStep = () => {
    if (step === 1 && (!donorData.name || !donorData.email)) {
      return
    }
    if (step === 2 && !donationData.amount) {
      return
    }
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newDonation = {
      donorName: donorData.name,
      donorEmail: donorData.email,
      donorPhone: donorData.phone,
      amount: Number.parseFloat(donationData.amount),
      paymentMethod: donationData.paymentMethod,
      isRecurring: donationData.isRecurring,
      frequency: donationData.isRecurring ? donationData.frequency : null,
      notes: donationData.notes,
      category: donationData.category,
      date: new Date().toISOString(),
      verified: false,
    }

    dispatch(addDonation(newDonation))
      .unwrap()
      .then(() => {
        setSuccess(true)
        setStep(4)
      })
  }

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Make a <span className="text-indigo-600">Difference</span> Today
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Your generosity helps us create lasting change in our communities.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Progress Steps */}
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <nav aria-label="Progress" className="mb-4">
              <ol className="flex items-center">
                <li className={`relative pr-8 sm:pr-20 ${step > 1 ? "text-indigo-600" : "text-gray-900"}`}>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className={`h-0.5 w-full ${step > 1 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                  </div>
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                      step >= 1 ? "bg-indigo-600" : "bg-gray-200"
                    } ${step > 1 ? "border-2 border-indigo-600" : ""}`}
                  >
                    {step > 1 ? (
                      <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-white font-medium">1</span>
                    )}
                  </div>
                  <span className="hidden absolute top-10 left-1/2 -translate-x-1/2 sm:block text-center text-sm font-medium">
                    Your Info
                  </span>
                </li>

                <li className={`relative pr-8 sm:pr-20 ${step > 2 ? "text-indigo-600" : "text-gray-900"}`}>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className={`h-0.5 w-full ${step >= 2 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                  </div>
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                      step >= 2 ? "bg-indigo-600" : "bg-gray-200"
                    } ${step > 2 ? "border-2 border-indigo-600" : ""}`}
                  >
                    {step > 2 ? (
                      <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-white font-medium">2</span>
                    )}
                  </div>
                  <span className="hidden absolute top-10 left-1/2 -translate-x-1/2 sm:block text-center text-sm font-medium">
                    Donation
                  </span>
                </li>

                <li className={`relative pr-8 sm:pr-20 ${step > 3 ? "text-indigo-600" : "text-gray-900"}`}>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className={`h-0.5 w-full ${step >= 3 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                  </div>
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                      step >= 3 ? "bg-indigo-600" : "bg-gray-200"
                    } ${step > 3 ? "border-2 border-indigo-600" : ""}`}
                  >
                    {step > 3 ? (
                      <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-white font-medium">3</span>
                    )}
                  </div>
                  <span className="hidden absolute top-10 left-1/2 -translate-x-1/2 sm:block text-center text-sm font-medium">
                    Payment
                  </span>
                </li>

                <li className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className={`h-0.5 w-full ${step >= 4 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                  </div>
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                      step >= 4 ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  >
                    <span className="text-white font-medium">4</span>
                  </div>
                  <span className="hidden absolute top-10 left-1/2 -translate-x-1/2 sm:block text-center text-sm font-medium">
                    Confirmation
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {/* Step 1: Donor Information */}
            {step === 1 && (
              <div className="max-w-lg mx-auto">
                <h2 className="text-xl font-bold text-gray-900">Your Information</h2>
                <p className="mt-1 text-sm text-gray-500">Please provide your contact details.</p>

                <div className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={donorData.name}
                        onChange={handleDonorChange}
                        required
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={donorData.email}
                        onChange={handleDonorChange}
                        required
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number (Optional)
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={donorData.phone}
                        onChange={handleDonorChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Sign in
                    </Link>
                  </p>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!donorData.name || !donorData.email}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Next
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 -mr-1 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Donation Details */}
            {step === 2 && (
              <div className="max-w-lg mx-auto">
                <h2 className="text-xl font-bold text-gray-900">Donation Details</h2>
                <p className="mt-1 text-sm text-gray-500">Choose your donation amount and preferences.</p>

                <div className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Donation Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {donationAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleAmountSelect(amount)}
                          className={`${
                            donationData.amount === amount.toString()
                              ? "bg-indigo-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          } border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <label htmlFor="custom-amount" className="sr-only">
                        Custom Amount
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="amount"
                          id="custom-amount"
                          value={donationData.amount}
                          onChange={handleDonationChange}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="Custom amount"
                          min="1"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Donation Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={donationData.category}
                      onChange={handleDonationChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="general">General Fund</option>
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="community">Community Development</option>
                      <option value="emergency">Emergency Relief</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={donationData.paymentMethod}
                      onChange={handleDonationChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isRecurring"
                        name="isRecurring"
                        type="checkbox"
                        checked={donationData.isRecurring}
                        onChange={handleDonationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isRecurring" className="font-medium text-gray-700">
                        Make this a recurring donation
                      </label>
                      <p className="text-gray-500">Support our work with regular donations.</p>
                    </div>
                  </div>

                  {donationData.isRecurring && (
                    <div>
                      <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                        Frequency
                      </label>
                      <select
                        id="frequency"
                        name="frequency"
                        value={donationData.frequency}
                        onChange={handleDonationChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={donationData.notes}
                      onChange={handleDonationChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Any specific instructions or notes for your donation"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 -ml-1 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!donationData.amount}
                    className="inline-flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Next
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 -mr-1 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Information */}
            {step === 3 && (
              <div className="max-w-lg mx-auto">
                <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
                <p className="mt-1 text-sm text-gray-500">Complete your donation with secure payment.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  {donationData.paymentMethod === "credit_card" && (
                    <>
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                          Card Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="cardNumber"
                            id="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleCardDetailsChange}
                            required
                            placeholder="1234 5678 9012 3456"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                          Name on Card
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="cardName"
                            id="cardName"
                            value={cardDetails.cardName}
                            onChange={handleCardDetailsChange}
                            require
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                            Expiry Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="expiryDate"
                              id="expiryDate"
                              value={cardDetails.expiryDate}
                              onChange={handleCardDetailsChange}
                              required
                              placeholder="MM/YY"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                            CVV
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="cvv"
                              id="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardDetailsChange}
                              required
                              placeholder="123"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {donationData.paymentMethod === "paypal" && (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <i className="fas fa-info-circle text-blue-400"></i>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">PayPal Information</h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>You will be redirected to PayPal to complete your donation of ${donationData.amount}.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {donationData.paymentMethod === "bank_transfer" && (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <i className="fas fa-info-circle text-blue-400"></i>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">Bank Transfer Information</h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>
                              Please use the following details to make your bank transfer of ${donationData.amount}:
                            </p>
                            <div className="mt-2 bg-white p-3 rounded-md">
                              <p className="text-sm">
                                <strong>Bank Name:</strong> Example Bank
                              </p>
                              <p className="text-sm">
                                <strong>Account Name:</strong> Donation ERP Foundation
                              </p>
                              <p className="text-sm">
                                <strong>Account Number:</strong> 1234567890
                              </p>
                              <p className="text-sm">
                                <strong>Routing Number:</strong> 987654321
                              </p>
                              <p className="text-sm">
                                <strong>Reference:</strong> {donorData.name} - Donation
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-900">Donation Summary</h3>
                    <dl className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Donor:</dt>
                        <dd className="text-sm font-medium text-gray-900">{donorData.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Email:</dt>
                        <dd className="text-sm font-medium text-gray-900">{donorData.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Amount:</dt>
                        <dd className="text-sm font-medium text-gray-900">${donationData.amount}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Category:</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {donationData.category.charAt(0).toUpperCase() + donationData.category.slice(1)}
                        </dd>
                      </div>
                      {donationData.isRecurring && (
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Frequency:</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {donationData.frequency.charAt(0).toUpperCase() + donationData.frequency.slice(1)}
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Payment Method:</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {donationData.paymentMethod
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 -ml-1 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Donation
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2 -mr-1 h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="text-center py-10 max-w-lg mx-auto">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-6 text-2xl font-extrabold text-gray-900">Thank You for Your Donation!</h2>
                <p className="mt-2 text-lg text-gray-600">
                  Your donation of ${donationData.amount} has been successfully processed.
                </p>
                <p className="mt-1 text-gray-600">A confirmation email has been sent to {donorData.email}.</p>
                <div className="mt-8 bg-gray-50 p-4 rounded-md text-left">
                  <h3 className="text-sm font-medium text-gray-900">Donation Details</h3>
                  <dl className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Donation ID:</dt>
                      <dd className="text-sm font-medium text-gray-900">DON-{Math.floor(Math.random() * 10000)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Date:</dt>
                      <dd className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Amount:</dt>
                      <dd className="text-sm font-medium text-gray-900">${donationData.amount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Payment Method:</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {donationData.paymentMethod
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Return to Home
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create an Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <i className="fas fa-book h-6 w-6 text-white"></i>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Education</h3>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Your donation helps provide educational resources and scholarships to underprivileged students.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <i className="fas fa-medkit h-6 w-6 text-white"></i>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Healthcare</h3>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Your donation supports medical facilities and healthcare programs in underserved areas.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <i className="fas fa-home h-6 w-6 text-white"></i>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Community</h3>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Your donation helps build infrastructure and support local community initiatives.
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default GuestDonateNow
