import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchICard, requestICard } from '../../store/slices/volunteerSlice';
import { FiDownload, FiUser, FiClock, FiCheckCircle, FiSend } from 'react-icons/fi';
// import { toast } from '../../utils/toast';

const ICardVolunteer = () => {
  const [apiError, setApiError] = useState(null);
  const dispatch = useDispatch();
  const { iCardData, iCardRequested, loading, error } = useSelector((state) => state.volunteers);

  console.log(iCardData)

  useEffect(() => {
    dispatch(fetchICard());
  }, [dispatch]);

  const handleRequestICard = async () => {
    setApiError(null);
    try {
      const result = await dispatch(requestICard());
      if (result.error) {
        setApiError(result.payload?.message || 'Failed to request iCard');
      } else {
        await dispatch(fetchICard());
      }
    } catch (error) {
      setApiError(error.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Identity Card</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your official identification as a volunteer
          </p>
        </div>

        {/* Status Indicator */}
        <div className="mb-8">
          {iCardData?.iCardStatus === 'ACTIVE' && (
            <div className="flex items-center justify-center bg-green-50 p-4 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-green-700 font-medium">Your iCard is approved and ready</span>
            </div>
          )}
          {iCardData?.iCardStatus === 'PENDING' && (
            <div className="flex items-center justify-center bg-yellow-50 p-4 rounded-lg">
              <FiClock className="h-6 w-6 text-yellow-500 mr-2" />
              <span className="text-yellow-700 font-medium">Your iCard request is pending approval</span>
            </div>
          )}
          {iCardData?.iCardStatus === 'UNASSIGN' && (
            <div className="flex items-center justify-center bg-blue-50 p-4 rounded-lg">
              <FiUser className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-blue-700 font-medium">You haven't requested an iCard yet</span>
            </div>
          )}
          {iCardData?.iCardStatus === 'DISABLED' && (<>
            <div className="flex items-center justify-center bg-red-50 p-4 rounded-lg">
              <FiUser className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-red-700 font-medium">Your iCard has been disabled</span>
            </div>
            <p className='text-center text-gray-500 font-medium mt-1'>You can contact Admin for more details.</p>
          </>)}
        </div>

        {/* iCard Display */}
        {iCardData?.iCardStatus === 'ACTIVE' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{iCardData?.name}</h2>
                  <p className="text-blue-100">{iCardData?.role}</p>
                </div>
                <div className="bg-white p-1 rounded-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${iCardData?.userId}`}
                    alt="QR Code"
                    className="h-16 w-16"
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Volunteer ID</p>
                  <p className="font-medium">{iCardData?.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issue Date</p>
                  <p className="font-medium">{iCardData?.iCardAssignDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="font-medium">{iCardData?.iCardExpiryDate}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500">
                  This card identifies you as an authorized volunteer. Please present it when required.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiDownload className="mr-2 h-4 w-4" />
                Download iCard
              </button>
            </div>
          </div>
        )}

        {/* Actions based on status */}
        {iCardData?.iCardStatus === 'UNASSIGN' && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <FiUser className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No iCard assigned</h3>
            <p className="text-gray-500 mb-6">
              You need to request your volunteer identity card to access certain features.
            </p>
            <button
              onClick={handleRequestICard}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiSend className="mr-2 h-4 w-4" />
                  Request iCard
                </>
              )}
            </button>
          </div>
        )}

        {iCardData?.iCardStatus === 'PENDING' && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Approval</h3>
            <p className="text-gray-500 mb-6">
              Your iCard request is being processed. You'll be notified once it's approved.
            </p>
            <button
              disabled
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
            >
              Request Submitted
            </button>
          </div>
        )}
      </div>
      {/* Add this below the status indicator */}
      {apiError && (
        <div className="mb-4 p-4 bg-red-200 text-red-700 rounded-lg">
          {apiError}
        </div>
      )}
    </div>
  );
}
export default ICardVolunteer