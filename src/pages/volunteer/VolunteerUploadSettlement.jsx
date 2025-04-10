"use client"

import { useState } from "react"

const paymentMethods = [
  "CASH",
  "CHEQUE",
  "NEFT",
  "RTGS",
  "BANK_TRANSFER",
  "UPI",
  "QR",
  "ONLINE",
]

const VolunteerUploadSettlement = () => {
  const [formData, setFormData] = useState({
    amount: "",
    method: "CASH",
    transactionId: "",
    file: null,
    notes: "",
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
      uploadData.append("amount", formData.amount)
      uploadData.append("method", formData.method)
      uploadData.append("transactionId", formData.transactionId)
      uploadData.append("notes", formData.notes)
      if (formData.file) uploadData.append("file", formData.file)

      // await fetch("/api/donations/settlement", {
      //   method: "POST",
      //   body: uploadData,
      // })

      setSuccess(true)
      setFormData({ amount: "", method: "CASH", transactionId: "", notes: "", file: null })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to upload settlement. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Upload Settlement</h3>

      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Settlement uploaded successfully!
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter amount"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="method" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            name="method"
            id="method"
            value={formData.method}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
            Transaction ID (optional)
          </label>
          <input
            type="text"
            name="transactionId"
            id="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            placeholder="Enter transaction ID"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Upload Receipt (optional)
          </label>
          <input
            type="file"
            name="file"
            id="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            id="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any notes or clarification"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? "Uploading..." : "Upload Settlement"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VolunteerUploadSettlement
