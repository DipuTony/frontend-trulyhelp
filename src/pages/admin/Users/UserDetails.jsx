import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInterceptor';
import { formatDateFull } from '../../../components/common/DateFormatFunctions';

const UserDetails = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/user/view-details?userId=${userId}`);
        if (data.status) {
          setUserData(data?.data?.data);
        } else {
          setError(data.message || 'Failed to fetch user details');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const getICardStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
      case 'EXPIRED':
        return 'bg-gradient-to-r from-red-400 to-red-500 text-white';
      case 'PENDING':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'CASH':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 'UPI':
        return 'bg-gradient-to-r from-purple-400 to-purple-500 text-white';
      case 'QR':
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white';
      case 'SWIFT':
        return 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white';
      case 'GPAY':
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
      case 'ONLINE':
        return 'bg-gradient-to-r from-teal-400 to-teal-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white/80 backdrop-blur-lg border border-red-200 text-red-700 px-8 py-6 rounded-2xl shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white/80 backdrop-blur-lg border border-yellow-200 text-yellow-700 px-8 py-6 rounded-2xl shadow-lg">
          No user data found
        </div>
      </div>
    );
  }

  const isVolunteer = userData.role === 'VOLUNTEER';
  const stats = isVolunteer ? userData.donationStats : {
    totalDonations: userData.donationStats.totalDonations,
    totalAmount: userData.donationStats.totalAmount
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {userData.role}
                  </span>
                  {isVolunteer && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getICardStatusColor(userData.iCardStatus)}`}>
                      {userData.iCardStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              ID: {userData.userId}
            </div>


            <button onClick={()=>navigate(`/admin/donate/${userData.userId}`)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:-translate-y-1 duration-200 shadow-lg hover:shadow-red-200">
              Donate Now ❤️
            </button>


          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Email</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{userData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Phone</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{userData.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Email Verification</label>
                  <p className={`text-sm px-4 py-2 rounded-lg ${userData.emailVerifyStatus
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                    }`}>
                    {userData.emailVerifyStatus ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
                {userData.country && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Country</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{userData.country}</p>
                  </div>
                )}
                {userData.donorType && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">
                      {userData.donorType === 'indian' ? 'PAN' : 'Passport'} Number
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{userData.pan}</p>
                  </div>
                )}
                {userData.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Address</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{userData.address}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Joined On</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{formatDateFull(userData?.createdAt)}</p>
                </div>
                {userData.dob && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Date of Birth</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{formatDateFull(userData?.dob)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* iCard Section for Volunteers */}
            {isVolunteer && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Identity Card Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Status</label>
                    <p className={`text-sm px-4 py-2 rounded-lg ${getICardStatusColor(userData.iCardStatus)}`}>
                      {userData.iCardStatus}
                    </p>
                  </div>
                  {userData.iCardAssignDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Assigned Date</label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {formatDateFull(userData.iCardAssignDate)}
                      </p>
                    </div>
                  )}
                  {userData.iCardExpiryDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Expiry Date</label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {formatDateFull(userData.iCardExpiryDate)}
                      </p>
                    </div>
                  )}
                  {userData.iCardRequestDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Request Date</label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {formatDateFull(userData.iCardRequestDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats and Donations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Donation Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-gray-500">
                    {isVolunteer ? 'Donations Collected' : 'Total Donations'}
                  </h3>
                  <p className="mt-2 text-4xl font-bold text-blue-600">
                    {isVolunteer ? stats.donationsCollected : stats.totalDonations}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-gray-500">
                    {isVolunteer ? 'Total Amount Collected' : 'Total Amount Donated'}
                  </h3>
                  <p className="mt-2 text-4xl font-bold text-green-600">
                    ₹{isVolunteer ? stats.totalAmountCollected : stats.totalAmount}
                  </p>
                </div>
              </div>
            </div>

            {/* Donations Table Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Donations</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donation ID
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      {isVolunteer && (
                        <>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Donor Name
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Donor Email
                          </th>
                        </>
                      )}
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userData.donations.map((donation) => (
                      <tr key={donation.donationId} className="hover:bg-gray-50/50 transition-colors duration-200">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {donation.donationId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ₹{donation.amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentMethodColor(donation.method)}`}>
                            {donation.method}
                          </span>
                        </td>
                        {isVolunteer && (
                          <>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {donation.donorName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {donation.donorEmail}
                            </td>
                          </>
                        )}
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDateFull(donation.createdAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${donation.paymentStatus === 'COMPLETED'
                              ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'}`}>
                            {donation.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;