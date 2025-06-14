"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addDonation, onlineGuestDonationEazyBuzz } from "../../store/slices/donationSlice"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInterceptor"

const DonateNow = () => {
  const [donationOptions, setDonationOptions] = useState({})
  const [selectedCause, setSelectedCause] = useState(null)
  const [selectedFrequency, setSelectedFrequency] = useState("once")
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { loading, error } = useSelector((state) => state.donations)

  useEffect(() => {
    const fetchDonationOptions = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/donation-options`)
        if (response.data?.data) {
          setDonationOptions(response.data.data)
          const causes = Object.keys(response.data.data)
          if (causes.length > 0) setSelectedCause(causes[0])
        }
      } catch (err) {
        console.error('Error fetching donation options:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDonationOptions()
  }, [])

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault()
    if (!selectedCause || !selectedAmount) {
      alert('Please select a cause and amount')
      return
    }

    const causeData = donationOptions[selectedCause]
    if (!causeData) return

    const payload = {
      // donorName: user?.name || 'Anonymous',
      // donorEmail: user?.email || '',
      // causeId: causeData.causeId,
      donationAmount: Number(selectedAmount),
      isRecurring: selectedFrequency === "monthly",
      frequency: selectedFrequency === "monthly" ? "monthly" : null,
    }

    try {
      const response = await dispatch(onlineGuestDonationEazyBuzz(payload));
      console.log("button xlicked", payload)
      if (response.error) {
        setSubmitting(false);
        // Update button state here
        return;
      }
      // Handle success case
    } catch (error) {
      setSubmitting(false);
      // Update button state here
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (Object.keys(donationOptions).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">No donation options available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Cause Selection */}
      <div className="w-1/2 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Select Your Cause</h1>
        <div className="space-y-4">
          {Object.entries(donationOptions).map(([key, cause]) => (
            <div
              key={key}
              onClick={() => setSelectedCause(key)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedCause === key
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-blue-50'
                }`}
            >
              <h3 className="font-medium">{cause.displayName}</h3>
              <p className="text-sm">{cause.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Donation Details */}
      <div className="w-1/2 bg-white p-6">
        {selectedCause && (
          <>
            <h1 className="text-2xl font-bold mb-6">Donation Details</h1>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Frequency</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedFrequency("once")}
                  className={`flex-1 py-2 rounded-md ${selectedFrequency === "once"
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  One-time
                </button>
                <button
                  onClick={() => setSelectedFrequency("monthly")}
                  className={`flex-1 py-2 rounded-md ${selectedFrequency === "monthly"
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Amount (₹)</h3>
              <div className="grid grid-cols-3 gap-3">
                {donationOptions[selectedCause]?.options?.[selectedFrequency]?.amounts?.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-3 rounded-md ${selectedAmount === amount
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or enter custom amount
              </label>
              <input
                type="number"
                value={selectedAmount || ''}
                onChange={(e) => setSelectedAmount(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
                min="1"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedAmount || loading}
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Complete Donation'}
            </button>

            {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
          </>
        )}
      </div>
    </div>
  )
}

export default DonateNow