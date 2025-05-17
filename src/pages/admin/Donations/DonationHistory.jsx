import React from 'react'
import DataTable from '../../../components/common/DataTable/DataTable';
import { formatDateShort } from '../../../components/common/DateFormatFunctions';

function DonationHistory() {

    const COLUMNS = [
        {
            Header: '#',
            Cell: ({ row }) => (
                <div className='pr-2'>{row.index + 1}</div>
            )
        },
        // {
        //   Header: 'Donor Name',
        //   accessor: 'donorName',
        // },
        {
            Header: 'Donation Id',
            Cell: ({ row }) => (
                <button
                    onClick={() => handleViewDonation(row.original.donationId)}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-900 hover:underline"
                >
                    {row.original.donationId}
                </button>
            )
        },
        // {
        //     Header: 'Email',
        //     accessor: 'donorEmail',
        // },
        {
            Header: 'Phone',
            accessor: 'donorPhone',
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
                    // onClick={() => (setView("DETAILS"), setSelectedData(row.original))}
                    className="inline-flex items-center text-indigo-600 border border-indigo-500 rounded-md px-2 py-1 hover:bg-indigo-600 hover:text-white"
                >
                    View Details
                </button>
            )
        }
    ];

    // Dummy data for the table (5 records)
    const data = [
        {
            donationId: 'DON123456',
            donorName: 'Rahul Sharma',
            donorEmail: 'rahul.sharma@example.com',
            donorPhone: '9876543210',
            amount: 5000,
            method: 'UPI',
            paymentStatus: 'Completed',
            createdAt: new Date('2023-10-15')
        },
        {
            donationId: 'DON789012',
            donorName: 'Priya Patel',
            donorEmail: 'priya.patel@example.com',
            donorPhone: '8765432109',
            amount: 2500,
            method: 'Credit Card',
            paymentStatus: 'Completed',
            createdAt: new Date('2023-11-05')
        },
        {
            donationId: 'DON345678',
            donorName: 'Amit Kumar',
            donorEmail: 'amit.kumar@example.com',
            donorPhone: '7654321098',
            amount: 10000,
            method: 'Net Banking',
            paymentStatus: 'Completed',
            createdAt: new Date('2023-12-20')
        },
        {
            donationId: 'DON901234',
            donorName: 'Sneha Gupta',
            donorEmail: 'sneha.gupta@example.com',
            donorPhone: '6543210987',
            amount: 1000,
            method: 'UPI',
            paymentStatus: 'Pending',
            createdAt: new Date('2024-01-10')
        },
        {
            donationId: 'DON567890',
            donorName: 'Vikram Singh',
            donorEmail: 'vikram.singh@example.com',
            donorPhone: '5432109876',
            amount: 7500,
            method: 'Debit Card',
            paymentStatus: 'Completed',
            createdAt: new Date('2024-02-15')
        }
    ];

    // Function to handle viewing donation details
    const handleViewDonation = (donationId) => {
        console.log('Viewing donation:', donationId);
        // Add your logic to view donation details
    };

    return (
        <div className="container mx-auto px-4 py-6 justify-center items-center text-center">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Previous Donation History</h1>
                <p className="text-sm text-gray-600">View and manage all past donations</p>
            </div>
            <DataTable
                data={data}
                columns={COLUMNS}
            />
        </div>
    )
}

export default DonationHistory