import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'

const PaymentSuccess = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  
  // Extract key payment details
  const paymentDetails = {
    Name: searchParams.get('name'),
    transactionId: searchParams.get('transactionId'),
    email: searchParams.get('email'),
    donationId: searchParams.get('donationId'),
    phone: searchParams.get('phone'),
    PAN: searchParams.get('donorPan'),
    amount: searchParams.get('amount'),
    address: searchParams.get('address'),
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="mt-2 text-lg text-gray-600">
              Thank you for your generous donation of ₹{paymentDetails.amount}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Transaction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(paymentDetails).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                  <span className="text-gray-900 font-medium">{value || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/"
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Donate Again
            </Link>
            <Link
              to="/login"
              className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess