import React, { useState } from 'react';
import { FiDownload, FiUser, FiClock, FiCheckCircle, FiSend } from 'react-icons/fi';

const ICardVolunteer = () => {
  // State to simulate different statuses - change this to use your actual data
  const [status, setStatus] = useState('approved'); // can be 'approved', 'pending', or 'unassigned'
  
  // Sample iCard data
  const iCardData = {
    name: "Alex Johnson",
    volunteerId: "VOL-2023-0425",
    role: "Community Helper",
    issueDate: "15 April 2023",
    expiryDate: "15 April 2024",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VOL-2023-0425"
  };

  const handleRequestICard = () => {
    // API call or logic to request iCard would go here
    setStatus('pending');
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
          {status === 'approved' && (
            <div className="flex items-center justify-center bg-green-50 p-4 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-green-700 font-medium">Your iCard is approved and ready</span>
            </div>
          )}
          {status === 'pending' && (
            <div className="flex items-center justify-center bg-yellow-50 p-4 rounded-lg">
              <FiClock className="h-6 w-6 text-yellow-500 mr-2" />
              <span className="text-yellow-700 font-medium">Your iCard request is pending approval</span>
            </div>
          )}
          {status === 'unassigned' && (
            <div className="flex items-center justify-center bg-blue-50 p-4 rounded-lg">
              <FiUser className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-blue-700 font-medium">You haven't requested an iCard yet</span>
            </div>
          )}
        </div>

        {/* iCard Display */}
        {status === 'approved' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{iCardData.name}</h2>
                  <p className="text-blue-100">{iCardData.role}</p>
                </div>
                <div className="bg-white p-1 rounded-lg">
                  <img 
                    src={iCardData.qrCode} 
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
                  <p className="font-medium">{iCardData.volunteerId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issue Date</p>
                  <p className="font-medium">{iCardData.issueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="font-medium">{iCardData.expiryDate}</p>
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
        {status === 'unassigned' && (
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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiSend className="mr-2 h-4 w-4" />
              Request iCard
            </button>
          </div>
        )}

        {status === 'pending' && (
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
    </div>
  );
};

export default ICardVolunteer;