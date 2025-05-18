import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInterceptor';

const UserDetails = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // const response = await fetch(`/user/view-details?userId=${userId}`);
        const data = await axiosInstance.get(`${import.meta.env.VITE_API_URL}user/view-details?userId=${userId}`);
        // const data = await response.json();
        
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

  console.log(userData);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-blue-100">{userData.role}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-sm text-gray-900">{userData.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                <p className="mt-1 text-sm text-gray-900">{userData.userId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Verification</h3>
                <p className={`mt-1 text-sm ${userData.emailVerifyStatus ? 'text-green-600' : 'text-red-600'}`}>
                  {userData.emailVerifyStatus ? 'Verified' : 'Not Verified'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Joined On</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="px-6 py-4 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Donation Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  {isVolunteer ? 'Donations Collected' : 'Total Donations'}
                </h3>
                <p className="mt-1 text-3xl font-semibold text-blue-600">
                  {isVolunteer ? stats.donationsCollected : stats.totalDonations}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  {isVolunteer ? 'Total Amount Collected' : 'Total Amount Donated'}
                </h3>
                <p className="mt-1 text-3xl font-semibold text-green-600">
                  ₹{isVolunteer ? stats.totalAmountCollected : stats.totalAmount}
                </p>
              </div>
            </div>
          </div>

          {/* Donations Section */}
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Donations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donation ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    {isVolunteer && (
                      <>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Donor Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Donor Email
                        </th>
                      </>
                    )}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userData.donations.map((donation) => (
                    <tr key={donation.donationId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {donation.donationId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{donation.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${donation.method === 'CASH' ? 'bg-yellow-100 text-yellow-800' : 
                            donation.method === 'UPI' ? 'bg-purple-100 text-purple-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {donation.method}
                        </span>
                      </td>
                      {isVolunteer && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donation.donorName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donation.donorEmail}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${donation.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
  );
};

export default UserDetails;