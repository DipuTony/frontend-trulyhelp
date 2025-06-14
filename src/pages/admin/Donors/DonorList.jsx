"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchVolunteers, addVolunteer, updateVolunteer } from "../../../store/slices/volunteerSlice"
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useNavigate, useParams } from "react-router-dom"
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { showErrorToast, showSuccessToast } from "../../../utils/toast"
import axios from 'axios';
import { formatDateShort } from "../../../components/common/DateFormatFunctions"
import DataTable from "../../../components/common/DataTable/DataTable"

const DonorList = () => {
    const dispatch = useDispatch()
    // const { volunteers, loading, error } = useSelector((state) => state.volunteers)
    const navigate = useNavigate();

    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentVolunteer, setCurrentVolunteer] = useState(null)

    const BACKEND_URL = import.meta.env.VITE_API_URL;



    const header = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    }


    const fetchVolunteers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${BACKEND_URL}user/view-all?role=DONOR`, header);
            console.log("data", data?.data)
            setVolunteers(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching volunteers:', error);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{typeof error === 'object' ? error.message || 'An error occurred' : error}</span>
            </div>
        )
    }

    const handleViewDonation = (donationId) => {
        navigate(`/admin/UserDetails/${donationId}`);
    }

    const COLUMNS = [
        {
            Header: '#',
            Cell: ({ row }) => (
                <div className='pr-2'>{row.index + 1}</div>
            )
        },
        {
            Header: 'userId',
            accessor: 'userId',
        },
        {
            Header: 'Donor Name',
            Cell: ({ row }) => (
                <button
                    onClick={() => handleViewDonation(row.original.userId)}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-900 hover:underline"
                >
                    {row.original.name}
                </button>
            )
        },
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Phone',
            accessor: 'phone',
        },
        {
            Header: 'Role',
            accessor: 'role',
        },
        {
            Header: 'Created At',
            accessor: 'createdAt',
            Cell: ({ value }) => formatDateShort(value)
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <button
                onClick={() => navigate(`/admin/donate/${row.original.userId}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
                Donate Now
            </button>
            )
        }
    ];

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 capitalize">Donors</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all Donors including their name, email, phone, and address.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/donor-registration')}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                       Register New Donor
                    </button>
                </div>
            </div>

            {/* Data Table */}
            {
                volunteers?.data && volunteers?.data?.length > 0 && <DataTable
                    data={volunteers?.data}
                    columns={COLUMNS} />
            }



        </div>
    )
}


export default DonorList