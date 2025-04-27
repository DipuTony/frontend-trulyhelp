"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchVolunteers, addVolunteer, updateVolunteer } from "../../store/slices/volunteerSlice"
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useNavigate, useParams } from "react-router-dom"
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { showErrorToast, showSuccessToast } from "../../utils/toast"
import axios from 'axios';
import { formatDateShort } from "../../components/common/DateFormatFunctions"

const UserManagement = () => {
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

  let { role } = useParams();

  const roleName = {
    volunteer: "VOLUNTEER",
    donor: "DONOR",
    admin: "ADMIN"
  }[role];

  const header = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  }

  // Move validation schema inside component
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .when('isEditing', {
        is: false,
        then: () => Yup.string()
          .required('Password is required for new users')
          .min(6, 'Password must be at least 6 characters'),
        otherwise: () => Yup.string(),
      }),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .nullable()
      .required('Phone number is required'),
    // role: Yup.string()
    //   .required('Role is required')
  })

  // Move formik configuration inside component
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: '',
      isEditing: false
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      try {
        const addUserPayload = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          role: roleName,
        }

        const updatePayload = {
          userId: currentVolunteer?.userId,
          name: values.name,
          phone: values.phone,
          role: roleName,
        }

        // delete submitData.isEditing; // Remove isEditing from submitData

        if (isEditing && currentVolunteer) {
          await axios.post(`${BACKEND_URL}user/update`, updatePayload, header);
          showSuccessToast("User updated successfully");
        } else {
          await axios.post(`${BACKEND_URL}user/create`, addUserPayload, header);
          showSuccessToast("User added successfully");
        }

        // Refresh the volunteers list after successful submission
        fetchVolunteers();
        setStatus(null);
        setSubmitting(false);
        resetForm();
        handleCloseModal();
      } catch (error) {
        console.log("error adding user", error)
        setStatus(error.response?.data?.message || 'An error occurred');
        showErrorToast(error.response?.data?.message || 'An error occurred');
      } finally {
        setSubmitting(false);
      }
    }
  });


  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}user/view-all?role=${role?.toUpperCase()}`, header);
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
  }, [role]);

  // Remove this line
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "", // Add password field
    role: roleName,
  })

  // useEffect(() => {
  //   dispatch(fetchVolunteers(role?.toUpperCase()))
  // }, [dispatch, role])

  const handleOpenModal = (volunteer = null) => {
    if (volunteer) {
      setIsEditing(true)
      setCurrentVolunteer(volunteer)
      formik.setValues({
        name: volunteer.name || "",
        email: volunteer.email || "",
        phone: volunteer.phone || "",
        password: "", // Password should be empty when editing
        role: roleName,
        isEditing: true
      })
    } else {
      setIsEditing(false)
      setCurrentVolunteer(null)
      formik.setValues({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: roleName,
        isEditing: false
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    formik.resetForm();
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      role: roleName,
    });
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

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 capitalize">{role ? role + "s" : "All Users"}</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all {role ? role + "s" : "All Users"} including their name, email, phone, and address.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add &nbsp;<span className="capitalize">{role}</span>
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      SL.
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created At
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {!volunteers?.data ? "No Data Found!" : volunteers?.data?.map((volunteer, index) => (
                    <tr key={volunteer.id}>
                      <td className="whitespace-nowrap pl-7 py-4 text-sm text-gray-500">{index + 1}.</td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {volunteer.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{volunteer?.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{volunteer?.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{volunteer?.role}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDateShort(volunteer?.createdAt)}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleOpenModal(volunteer)}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding/editing volunteer */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 capitalize">
                      {isEditing ? `Edit ${role}` : `Add ${role}`}
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {formik.status && (
                          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{formik.status}</span>
                          </div>
                        )}

                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            {...formik.getFieldProps('name')}
                            className={`mt-1 block w-full border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
                              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          />
                          {formik.touched.name && formik.errors.name && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                          )}
                        </div>
                        {!isEditing && (
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              {...formik.getFieldProps('email')}
                              className={`mt-1 block w-full border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            />
                            {formik.touched.email && formik.errors.email && (
                              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                            )}
                          </div>
                        )}
                        {!isEditing && (
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <input
                              type="password"
                              id="password"
                              {...formik.getFieldProps('password')}
                              className={`mt-1 block w-full border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            />
                            {formik.touched.password && formik.errors.password && (
                              <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                            )}
                          </div>
                        )}

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <input
                            type="text"
                            id="phone"
                            {...formik.getFieldProps('phone')}
                            className={`mt-1 block w-full border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'
                              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          />
                          {formik.touched.phone && formik.errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                          )}
                        </div>
                        {/* 
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div> */}

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

export default UserManagement