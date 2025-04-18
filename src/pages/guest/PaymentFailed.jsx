import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FaTimesCircle } from 'react-icons/fa'

const PaymentFailed = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  
  // Extract key payment details
  const paymentDetails = {
    amount: searchParams.get('amount'),
    donationId: searchParams.get('donationId'),
    transactionId: searchParams.get('transactionId'),
    error: searchParams.get('error'),
    errorReason: searchParams.get('errorReason'),
    status: searchParams.get('status'),
    email: searchParams.get('email'),
    name: searchParams.get('name'),
    phone: searchParams.get('phone'),
    paymentMethod: searchParams.get('paymentMethod'),
    paymentSource: searchParams.get('paymentSource'),
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          {/* Failed Header */}
          <div className="text-center mb-8">
            <FaTimesCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Payment Failed</h2>
            <p className="mt-2 text-lg text-gray-600">
              We couldn't process your donation of ₹{paymentDetails.amount}
            </p>
            <p className="mt-2 text-red-600">
              {paymentDetails.errorReason || paymentDetails.error || 'An error occurred during the payment process'}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Transaction Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Donation ID</span>
                <span className="text-gray-900 font-medium">{paymentDetails.donationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="text-gray-900 font-medium">{paymentDetails.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="text-gray-900 font-medium">₹{paymentDetails.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="text-gray-900 font-medium">{paymentDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-900 font-medium">{paymentDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="text-gray-900 font-medium">{paymentDetails.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900 font-medium">{paymentDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Source</span>
                <span className="text-gray-900 font-medium">{paymentDetails.paymentSource}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-red-600 font-medium uppercase">{paymentDetails.status}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/"
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Try Again
            </Link>
            <a
              href="mailto:support@trulyhelp.org"
              className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailed