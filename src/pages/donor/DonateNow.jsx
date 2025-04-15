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
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Make a Donation</h1>
          <p className="mt-2 text-sm text-gray-700">
            Your generosity helps us make a difference. Thank you for your support.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Donation Details</h3>
            <p className="mt-1 text-sm text-gray-500">
              {step === 1
                ? "Choose your donation amount and frequency."
                : "Enter your payment information to complete your donation."}
            </p>
            <div className="mt-6">
              <div className="flex items-center">
                <div className="flex h-6 items-center">
                  <input
                    id="isRecurring"
                    name="isRecurring"
                    type="checkbox"
                    checked={donationData.isRecurring}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isRecurring" className="font-medium text-gray-700">
                    Make this a recurring donation
                  </label>
                  <p className="text-gray-500">Support us with a regular donation.</p>
                </div>
              </div>
              {donationData.isRecurring && (
                <div className="mt-4">
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={donationData.frequency}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            {step === 1 ? (
              <form>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Donation Amount
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={donationData.amount}
                        onChange={handleChange}
                        required
                        min="1"
                        step="0.01"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={donationData.paymentMethod}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={donationData.notes}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Any specific instructions or notes for your donation"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!donationData.amount}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  {donationData.paymentMethod === "credit_card" && (
                    <>
                      <div className="col-span-6">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          id="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardDetailsChange}
                          required
                          placeholder="1234 5678 9012 3456"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6">
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          id="cardName"
                          value={cardDetails.cardName}
                          onChange={handleCardDetailsChange}
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-3">
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          id="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardDetailsChange}
                          required
                          placeholder="MM/YY"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-3">
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          id="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardDetailsChange}
                          required
                          placeholder="123"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </>
                  )}

                  {donationData.paymentMethod === "paypal" && (
                    <div className="col-span-6">
                      <p className="text-sm text-gray-500">
                        You will be redirected to PayPal to complete your donation of ₹{donationData.amount}.
                      </p>
                    </div>
                  )}

                  {donationData.paymentMethod === "bank_transfer" && (
                    <div className="col-span-6">
                      <p className="text-sm text-gray-500">
                        Please use the following details to make your bank transfer of ₹{donationData.amount}:
                      </p>
                      <div className="mt-2 bg-gray-50 p-4 rounded-md">
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
                          <strong>Reference:</strong> {user?.name} - Donation
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="col-span-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900">Donation Summary</h4>
                      <div className="mt-2 flex justify-between">
                        <p className="text-sm text-gray-500">Amount:</p>
                        <p className="text-sm font-medium text-gray-900">₹{donationData.amount}</p>
                      </div>
                      {donationData.isRecurring && (
                        <div className="mt-1 flex justify-between">
                          <p className="text-sm text-gray-500">Frequency:</p>
                          <p className="text-sm font-medium text-gray-900">{donationData.frequency}</p>
                        </div>
                      )}
                      <div className="mt-1 flex justify-between">
                        <p className="text-sm text-gray-500">Payment Method:</p>
                        <p className="text-sm font-medium text-gray-900">
                          {donationData.paymentMethod.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? "Processing..." : "Complete Donation"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Why Donate?</h3>
            <p className="mt-1 text-sm text-gray-500">Learn how your donation makes a difference.</p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="prose prose-indigo max-w-none">
              <p>
                Your donation helps us continue our mission to make a positive impact in our community. Here's how your
                contribution helps:
              </p>
              <ul>
                <li>
                  <strong>Education:</strong> Providing educational resources and scholarships to underprivileged
                  students.
                </li>
                <li>
                  <strong>Healthcare:</strong> Supporting medical facilities and healthcare programs in underserved
                  areas.
                </li>
                <li>
                  <strong>Community Development:</strong> Building infrastructure and supporting local initiatives.
                </li>
                <li>
                  <strong>Emergency Relief:</strong> Providing immediate assistance during natural disasters and crises.
                </li>
              </ul>
              <p>
                <strong>Tax Benefits:</strong> All donations are tax-deductible. You will receive a receipt for your
                records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonateNow
