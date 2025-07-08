import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { formatDateTimeFull } from '../../components/common/DateFormatFunctions'

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
    DateTime: searchParams.get('dateTime'),
    // Address: searchParams.get('address'),
    // PAN: searchParams.get('donorPan'),
    // 'Payment Method': searchParams.get('paymentMethod'),
    // 'Bank Name': searchParams.get('bankName'),
    // 'Payment Source': searchParams.get('paymentSource'),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 pt-4 sm:pt-8 px-1 sm:px-4 lg:px-8">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-0 md:p-0">
          {/* Compact Flex Layout */}
          <div className="flex flex-col md:flex-row items-stretch md:items-stretch md:gap-0 gap-2 md:h-[340px]">
            {/* Success Header with Animation - fully colored, flush top/bottom */}
            <div className="md:w-1/3 flex flex-col items-center justify-center bg-gradient-to-b from-green-400 to-emerald-500 text-white p-4 md:p-0 h-full">
              <div className="w-full flex flex-col items-center justify-center h-full">
                <FaCheckCircle className="h-12 w-12 md:h-16 md:w-16 animate-bounce mb-2" />
                <h2 className="text-2xl md:text-3xl font-bold mb-1">Thank You!</h2>
                <p className="text-base md:text-lg opacity-90 mb-2 text-center">
                  Your donation of ₹{paymentDetails.Amount} has been received
                </p>
                <div className="mt-1 inline-block px-3 py-1 bg-white/20 rounded-full">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                    <span className="font-medium uppercase text-xs md:text-sm">{paymentDetails.status}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Card */}
            <div className="md:w-2/3 p-4 md:p-6 flex flex-col justify-between h-full">
              <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center">
                <span className="bg-indigo-100 p-1 rounded-lg mr-2">
                  <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                Receipt Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                {Object.entries(paymentDetails).map(([key, value]) => (
                  value && (
                    <div key={key} className="bg-gray-50 p-2 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-0.5">{key}</p>
                      <p className="text-gray-900 text-sm font-medium break-all">
                        {key === 'DateTime' ? formatDateTimeFull(value) : value}
                      </p>
                    </div>
                  )
                ))}
              </div>
              {/* Actions with Modern Styling */}
              <div className="flex flex-col sm:flex-row justify-center gap-2 mt-2">
                <Link
                  to="/"
                  className="group relative inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 hover:from-indigo-600 hover:to-blue-600 text-sm"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <span>Donate Again</span>
                </Link>
                {isAuthenticated ?
                  <Link
                    to="/donor"
                    className="inline-flex items-center justify-center px-5 py-2 border-2 border-gray-200 text-indigo-600 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm"
                  >
                   Download Receipt
                  </Link>
                  :
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-5 py-2 border-2 border-gray-200 text-indigo-600 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm"
                  >
                    Sign In
                  </Link>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className="text-base text-indigo-700 font-semibold">We Thank You for your generous contribution.</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess