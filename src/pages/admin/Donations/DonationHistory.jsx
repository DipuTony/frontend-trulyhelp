import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from '../../../components/common/DataTable/DataTable';
import { formatDateShort } from '../../../components/common/DateFormatFunctions';
import { fetchUserDonations } from '../../../store/slices/donationSlice';
import axiosInstance from '../../../utils/axiosInterceptor';

function DonationHistory({ userId, setDonationId }) {
    const dispatch = useDispatch();
    // const { donations, loading, error } = useSelector((state) => state.donations);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [donations, setDonations] = useState([]);

    const fetchUserDonations = async (userId) => {
        setLoading(true);
        setError(null);

        axiosInstance.get(`donations/donor-donation-history?userId=${userId}`)
            .then((response) => {
                console.log('API Response:', response.data);
                setDonations(response?.data?.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user donations:', error);
                setError(error.message);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchUserDonations(userId);
    }, [userId]);


    console.log("donations in history", donations);

    // useEffect(() => {
    //     if (userId) {
    //         dispatch(fetchUserDonations(userId))
    //             .then((result) => {
    //                 console.log('API Response:', result);
    //             });
    //     }
    // }, [userId, dispatch]);

    const COLUMNS = [
        {
            Header: '#',
            Cell: ({ row }) => (
                <div className='pr-2'>{row.index + 1}</div>
            )
        },
        // {
        //     Header: 'Donation Id',
        //     Cell: ({ row }) => (
        //         <button
        //             onClick={() => handleViewDonation(row.original.donationId)}
        //             className="inline-flex items-center text-indigo-600 hover:text-indigo-900 hover:underline"
        //         >
        //             {row.original.donationId}
        //         </button>
        //     )
        // },
        {
            Header: 'Donation Id',
            accessor: 'donationId',
        },
        {
            Header: 'Amount',
            accessor: 'amount',
            Cell: ({ value }) => `₹${value}`
        },
        {
            Header: 'Method',
            accessor: 'method',
        },
        {
            Header: 'Status',
            accessor: 'paymentStatus',
        },
        {
            Header: 'Date',
            accessor: 'createdAt',
            Cell: ({ value }) => formatDateShort(value)
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <button
                    onClick={() => handleViewDonation(row.original)}
                    className="inline-flex items-center text-indigo-600 border border-indigo-500 rounded-md px-2 py-1 hover:bg-indigo-600 hover:text-white"
                >
                    View Details
                </button>
            )
        }
    ];

    // Function to handle viewing donation details
    const handleViewDonation = (donationId) => {
        console.log('Viewing donation:', donationId);
        setDonationId(donationId);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">Error loading donations: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">User Donation History</h1>
                <p className="text-sm text-gray-600 mb-4">View and manage donation history for a specific user</p>

                {userId && (
                    <div className="text-left mb-4 p-2 bg-gray-100 rounded-md">
                        <p className="text-sm font-medium">Currently viewing donations for User ID: <span className="text-indigo-600">{userId}</span></p>
                    </div>
                )}
            </div>

            {donations && donations.length > 0 ? (
                <DataTable
                    data={donations}
                    columns={COLUMNS}
                />
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">
                        {userId ? `No donation records found for User ID: ${userId}` : "Enter a User ID to view donation history"}
                    </p>
                </div>
            )}
        </div>
    )
}

export default DonationHistory