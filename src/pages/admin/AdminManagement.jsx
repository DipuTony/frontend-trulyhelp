"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { showErrorToast, showSuccessToast } from "../../utils/toast"
import axios from 'axios';
import { formatDateShort } from "../../components/common/DateFormatFunctions"
import DataTable from "../../components/common/DataTable/DataTable"

const AdminManagement = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState(null)

  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const roleName = "ADMIN";

  const header = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  }

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .nullable()
      .required('Phone number is required'),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: '',
      status: 'ACTIVE',
      isEditing: false
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      try {
        const addUserPayload = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          role: roleName,
          status: 'ACTIVE', // New admins are always active
        }

        const updatePayload = {
          userId: currentAdmin?.userId,
          name: values.name,
          phone: values.phone,
          role: roleName,
          status: values.status,
        }

        if (isEditing && currentAdmin) {
          await axios.post(`${BACKEND_URL}/user/update`, updatePayload, header);
          showSuccessToast("Admin updated successfully");
        } else {
          await axios.post(`${BACKEND_URL}/user/create`, addUserPayload, header);
          showSuccessToast("Admin added successfully");
        }

        await fetchAdmins();
        setStatus(null);
        setSubmitting(false);
        resetForm();
        handleCloseModal();
      } catch (error) {
        setStatus(error.response?.data?.message || 'An error occurred');
        showErrorToast(error.response?.data?.message || 'An error occurred');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/user/view-all?role=${roleName}`, header);
      setAdmins(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setIsEditing(true)
      setCurrentAdmin(admin)
      formik.setValues({
        name: admin.name || "",
        email: admin.email || "",
        phone: admin.phone || "",
        password: "",
        role: roleName,
        status: admin.status || 'ACTIVE',
        isEditing: true
      })
    } else {
      setIsEditing(false)
      setCurrentAdmin(null)
      formik.setValues({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: roleName,
        status: 'ACTIVE',
        isEditing: false
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    formik.resetForm();
  }

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

  const handleViewAdmin = (userId) => {
    navigate(`/admin/UserDetails/${userId}`);
  }

  const COLUMNS = [
    {
      Header: '#',
      Cell: ({ row }) => (
        <div className='pr-2'>{row.index + 1}</div>
      )
    },
    {
      Header: 'Admin Name',
      Cell: ({ row }) => (
        <button
          onClick={() => handleViewAdmin(row.original.userId)}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 hover:underline font-medium"
        >
          {row.original.name}
        </button>
      )
    },
    {
      Header: 'Email',
      accessor:'email',
    },  
    {
      Header: 'Phone',
      accessor:'phone',  
    },
    {
      Header: 'Role',
      accessor:'role',  
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => {
        const statusColors = {
          ACTIVE: 'bg-green-100 text-green-800',
          INACTIVE: 'bg-red-100 text-red-800',
          DELETED: 'bg-gray-100 text-gray-800'
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value || 'ACTIVE'}
          </span>
        )
      }
    },
    {
      Header: 'Created At',
      accessor:'createdAt',
      Cell: ({ value }) => formatDateShort(value)
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <button
          onClick={() => handleOpenModal(row.original)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      )
    }
  ];

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Admins</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all admins including their name, email, and phone.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Admin
          </button>
        </div>
      </div>
      {admins?.data && admins?.data?.length > 0 && <DataTable data={admins?.data} columns={COLUMNS} />}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{isEditing ? `Edit Admin` : `Add Admin`}</h3>
                    <div className="mt-2">
                      <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {formik.status && (
                          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{formik.status}</span>
                          </div>
                        )}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            id="name"
                            {...formik.getFieldProps('name')}
                            className={`mt-1 block w-full border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          />
                          {formik.touched.name && formik.errors.name && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                          )}
                        </div>
                        {!isEditing && (
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              id="email"
                              {...formik.getFieldProps('email')}
                              className={`mt-1 block w-full border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            />
                            {formik.touched.email && formik.errors.email && (
                              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                            )}
                          </div>
                        )}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="text"
                            id="phone"
                            {...formik.getFieldProps('phone')}
                            className={`mt-1 block w-full border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          />
                          {formik.touched.phone && formik.errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                          )}
                        </div>
                        {isEditing && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="flex items-center space-x-4">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="status"
                                  value="ACTIVE"
                                  checked={formik.values.status === 'ACTIVE'}
                                  onChange={formik.handleChange}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Active</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="status"
                                  value="INACTIVE"
                                  checked={formik.values.status === 'INACTIVE'}
                                  onChange={formik.handleChange}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Inactive</span>
                              </label>
                            </div>
                          </div>
                        )}
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                          >
                            {formik.isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
                          </button>
                          <button
                            type="button"
                            onClick={handleCloseModal}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminManagement 