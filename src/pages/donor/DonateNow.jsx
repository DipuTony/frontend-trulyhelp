"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addDonation } from "../../store/slices/donationSlice"
import { useNavigate } from "react-router-dom"

const DonateNow = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { loading, error } = useSelector((state) => state.donations)

  const [donationData, setDonationData] = useState({
    amount: "",
    paymentMethod: "credit_card",
    isRecurring: false,
    frequency: "monthly",
    notes: "",
  })

  const [step, setStep] = useState(1)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setDonationData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    if (!donationData.amount) return
    setStep(2)
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newDonation = {
      donorName: user?.name,
      donorEmail: user?.email,
      amount: Number.parseFloat(donationData.amount),
      paymentMethod: donationData.paymentMethod,
      isRecurring: donationData.isRecurring,
      frequency: donationData.isRecurring ? donationData.frequency : null,
      notes: donationData.notes,
      date: new Date().toISOString(),
      verified: false,
    }

    dispatch(addDonation(newDonation))
      .unwrap()
      .then(() => {
        navigate("/donor")
      })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Make a Difference Today</h1>
            <p className="text-xl text-indigo-100">
              Your generosity powers positive change. Every contribution creates ripples of impact in our community.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${step === 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 
                ${step === 1 ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>
                <i className="fas fa-dollar-sign"></i>
              </div>
              <span className="ml-2 font-medium">Amount</span>
            </div>
            <div className={`h-1 w-24 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step === 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2
                ${step === 2 ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>
                <i className="fas fa-credit-card"></i>
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-red-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {step === 1 ? (
              <div className="p-8">
                {/* Quick Amount Selection */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Amount</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[100, 500, 1000, 5000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDonationData(prev => ({ ...prev, amount: amount.toString() }))}
                        className={`p-6 text-center rounded-xl transition-all transform hover:scale-105
                          ${donationData.amount === amount.toString()
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-50 hover:bg-indigo-50 text-gray-900'
                          }`}
                      >
                        <div className="text-2xl font-bold mb-1">₹{amount}</div>
                        <div className="text-sm opacity-75">One-time</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter custom amount
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-lg">₹</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={donationData.amount}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-12 py-4 text-lg rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter amount"
                      min="1"
                    />
                  </div>
                </div>

                {/* Recurring Donation Option */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <i className="fas fa-sync-alt text-indigo-600 text-xl"></i>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Make it monthly</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isRecurring"
                            checked={donationData.isRecurring}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      <p className="text-gray-600 mt-1">Support our cause with regular contributions</p>
                      
                      {donationData.isRecurring && (
                        <select
                          name="frequency"
                          value={donationData.frequency}
                          onChange={handleChange}
                          className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="annually">Annually</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!donationData.amount}
                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    Continue to Payment
                    <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          type="button"
                          onClick={() => setDonationData(prev => ({ ...prev, paymentMethod: "credit_card" }))}
                          className={`p-4 rounded-lg border-2 ${donationData.paymentMethod === "credit_card" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
                        >
                          <i className="fas fa-credit-card text-xl mb-2"></i>
                          <div>Credit Card</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDonationData(prev => ({ ...prev, paymentMethod: "paypal" }))}
                          className={`p-4 rounded-lg border-2 ${donationData.paymentMethod === "paypal" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
                        >
                          <i className="fab fa-paypal text-xl mb-2"></i>
                          <div>PayPal</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDonationData(prev => ({ ...prev, paymentMethod: "bank_transfer" }))}
                          className={`p-4 rounded-lg border-2 ${donationData.paymentMethod === "bank_transfer" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
                        >
                          <i className="fas fa-university text-xl mb-2"></i>
                          <div>Bank Transfer</div>
                        </button>
                      </div>
                    </div>

                    {/* Card Details */}
                    {donationData.paymentMethod === "credit_card" && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleCardDetailsChange}
                            placeholder="1234 5678 9012 3456"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={cardDetails.cardName}
                            onChange={handleCardDetailsChange}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={cardDetails.expiryDate}
                              onChange={handleCardDetailsChange}
                              placeholder="MM/YY"
                              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                              CVV
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardDetailsChange}
                              placeholder="123"
                              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Summary */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Donation Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-medium">₹{donationData.amount}</span>
                        </div>
                        {donationData.isRecurring && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Frequency</span>
                            <span className="font-medium capitalize">{donationData.frequency}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-medium">
                            {donationData.paymentMethod === "credit_card" ? "Credit Card" : 
                             donationData.paymentMethod === "paypal" ? "PayPal" : "Bank Transfer"}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>₹{donationData.amount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={donationData.notes}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
                        placeholder="Any special instructions for your donation..."
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Processing...
                          </>
                        ) : (
                          <>
                            Complete Donation
                            <i className="fas fa-check ml-2"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Impact Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Impact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: 'graduation-cap', color: 'indigo', title: 'Education', description: 'Supporting underprivileged students' },
                { icon: 'heartbeat', color: 'red', title: 'Healthcare', description: 'Medical support for communities' },
                { icon: 'hands-helping', color: 'green', title: 'Community', description: 'Building better infrastructure' },
                { icon: 'house-damage', color: 'yellow', title: 'Emergency Relief', description: 'Immediate crisis assistance' }
              ].map((item) => (
                <div key={item.title} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-xl bg-${item.color}-100 flex items-center justify-center`}>
                    <i className={`fas fa-${item.icon} text-${item.color}-600 text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonateNow