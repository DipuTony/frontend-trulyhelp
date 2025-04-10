"use client"

import { useState } from "react"

const GuestDonationNow = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    transactionId: "",
    file: null,
  })

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const uploadData = new FormData()
      uploadData.append("name", formData.name)
      uploadData.append("email", formData.email)
      uploadData.append("amount", formData.amount)
      uploadData.append("method", "ONLINE")
      uploadData.append("transactionId", formData.transactionId)
      if (formData.file) uploadData.append("file", formData.file)

      // Replace with your actual backend endpoint
      // await fetch("/api/guest-donation", {
      //   method: "POST",
      //   body: uploadData,
      // })

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        amount: "",
        transactionId: "",
        file: null,
      })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to submit donation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg mt-10 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Guest Donation</h2>

      {success && (
        <div className="mb-4 bg-green-100 text-green-800 p-3 rounded">
          Thank you for your donation!
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-100 text-red-800 p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            required
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Transaction ID</label>
          <input
            type="text"
            name="transactionId"
            required
            value={formData.transactionId}
            onChange={handleChange}
            placeholder="Enter transaction ID"
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Receipt (optional)</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          {loading ? "Submitting..." : "Donate Now"}
        </button>
      </form>
    </div>
  )
}

export default GuestDonationNow
