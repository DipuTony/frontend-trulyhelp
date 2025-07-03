import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const PaymentSuccess = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'ADMIN';

  // Extract key payment details
  const paymentDetails = {
    Name: searchParams.get('name'),
    DonationId: searchParams.get('donationId'),
    TransactionId: searchParams.get('transactionId'),
    // Email: searchParams.get('email'),
    // Phone: searchParams.get('phone'),
    Amount: searchParams.get('amount'),
    Status: searchParams.get('status'),
    // Address: searchParams.get('address'),
    // PAN: searchParams.get('donorPan'),
    // 'Payment Method': searchParams.get('paymentMethod'),
    // 'Bank Name': searchParams.get('bankName'),
    // 'Payment Source': searchParams.get('paymentSource'),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
          {/* Success Header with Animation */}
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-white">
            <div className="text-center">
              <FaCheckCircle className="mx-auto h-20 w-20 animate-bounce" />
              <h2 className="mt-6 text-4xl font-bold">Thank You!</h2>
              <p className="mt-2 text-xl opacity-90">
                Your donation of ₹{paymentDetails.Amount} has been received
              </p>
              <div className="mt-4 inline-block px-4 py-2 bg-white/20 rounded-full">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                  <span className="font-medium uppercase">{paymentDetails.status}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Card */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                Receipt Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(paymentDetails).map(([key, value]) => (
                  value && (
                    <div key={key} className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">{key}</p>
                      <p className="text-gray-900 font-medium break-all">{value}</p>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Actions with Modern Styling */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/"
                className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:from-indigo-600 hover:to-blue-600"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span>Donate Again</span>
              </Link>
              {isAuthenticated ?
                <Link
                  to="/donor"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-200 text-indigo-600 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                 Download Receipt
                </Link>
                :
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-200 text-indigo-600 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  Sign In
                </Link>
              }
            </div>
          </div>
        </div>

        {/* Download Receipt Button */}
        {/* <div className="text-center mt-6">
          <button className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Receipt
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default PaymentSuccess