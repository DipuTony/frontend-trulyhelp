import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations, verifyDonation } from "../../../store/slices/donationSlice"
import { Link, useNavigate } from "react-router-dom"
import 'animate.css';
import DataTable from "../../../components/common/DataTable/DataTable"
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline"
import { formatDateShort } from "../../../components/common/DateFormatFunctions"
import ViewDonationDetails from "../ViewDonationDetails";
import DonationDetails from "./DonationDetails";

const DonationList = () => {
  const dispatch = useDispatch()
  const { donations, loading, error } = useSelector((state) => state.donations)
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'ADMIN'
  const [filter, setFilter] = useState("ALL") // ALL, PENDING, COMPLETED, FAILED, REFUNDED
  const navigate = useNavigate();
  const [view, setView] = useState("DATA") // DATA, DETAILS
  const [selectedData, setSelectedData] = useState("");// Selected data for view details

  console.log("selectedData", selectedData)

  // Single useEffect to handle data fetching
  useEffect(() => {
    dispatch(fetchDonations(filter))
  }, [dispatch, filter]) // Add filter as dependency

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
  }

  const handleViewDonation = (donationId) => {
    navigate(`/admin/donations/${donationId}`);
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
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

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
      Header: 'Donor Name',
      Cell: ({ row }) => (
        <button
          onClick={() => handleViewDonation(row.original.donationId)}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 hover:underline"
        >
          {row.original.donorName}
        </button>
      )
    },
    {
      Header: 'Email',
      accessor: 'donorEmail',
    },
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
          onClick={() => (setView("DETAILS"), setSelectedData(row.original))}
          className="inline-flex items-center text-indigo-600 border border-indigo-500 rounded-md px-2 py-1 hover:bg-indigo-600 hover:text-white"
        >
          View Details
        </button>
      )
    }
  ];

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Donations</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all donations including their donor, amount, date, and verification status.
          </p>
        </div>
      </div>

      {/* Tab code start here */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => (setView("DATA"), setSelectedData(""))}
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${view === "DATA"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Donations
        </button>
        <button
          onClick={() => setView("DETAILS")}
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${view === "DETAILS"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Details
        </button>
      </div>

      {/* Tab code end here */}

      {
        view === "DATA" && (
          <div>
            <div className="mt-4 animate__animated animate__fadeInUp">
              <select
                value={filter}
                onChange={handleFilterChange}
                className="block w-48 rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="ALL">All Donations</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            {/* Data Table */}
            {!loading && donations && donations?.length > 0 ? (
              <DataTable
                data={donations}
                columns={COLUMNS}
              />
            ) : (
              <div className="mt-8 text-center text-gray-500">
                No donations found for {filter === 'PENDING' ? 'Pending' :
                  filter === 'COMPLETED' ? 'Completed' :
                    filter === 'FAILED' ? 'Failed' :
                      filter === 'REFUNDED' ? 'Refunded' : 'All'}
              </div>
            )}
          </div>
        )
      }

      {
        view === "DETAILS" && (
          selectedData ?
            <DonationDetails donation={selectedData} goBack={() => (setSelectedData(""), setView("DATA"))} />
            : "Please select a donation to view its details"
        )
      }
    </div>
  )
}

export default DonationList