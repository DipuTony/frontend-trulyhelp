import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDonations, verifyDonation } from "../../../store/slices/donationSlice"
import { Link, useNavigate } from "react-router-dom"
import 'animate.css';
import DataTable from "../../../components/common/DataTable/DataTable"
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline"
import { formatDateShort } from "../../../components/common/DateFormatFunctions"
import DonationDetails from "./DonationDetails";
import UploadEvidenceForm from "./UploadEvidenceForm";
import UploadImageModal from "./UploadImageModal";
import ImageViewerModal from "./ImageViewerModal";
import PDFViewerModal from "./PDFViewerModal";

const DonationList = () => {
  const dispatch = useDispatch()
  const { donations, loading, error } = useSelector((state) => state.donations)
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'ADMIN'
  const [filter, setFilter] = useState("ALL") // ALL, PENDING, COMPLETED, FAILED, REFUNDED
  const navigate = useNavigate();
  const [view, setView] = useState("DATA") // DATA, DETAILS
  const [selectedData, setSelectedData] = useState("");// Selected data for view details
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // State for modal visibility
  const [selectedDonationForUpload, setSelectedDonationForUpload] = useState(null); // State to hold donation data for image upload
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false); // State for image viewer modal visibility
  const [imageToView, setImageToView] = useState(null); // State to hold the URL of the image to display
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptFileUrl, setReceiptFileUrl] = useState(null);
  const [generatingReceiptId, setGeneratingReceiptId] = useState(null);


  // Single useEffect to handle data fetching
  useEffect(() => {
    dispatch(fetchDonations(filter))
  }, [dispatch, filter]) // Add filter as dependency

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
  }

  const handleViewDonation = (donationId) => {
    navigate(`/admin/UserDetails/${donationId}`);
  }

  const handleOpenUploadModal = (donation) => {
    setSelectedDonationForUpload(donation);
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedDonationForUpload(null);
  };

  const handleImageUploadSuccess = () => {
    dispatch(fetchDonations(filter)); // Refetch donations after successful upload
    handleCloseUploadModal(); // Close the upload modal after success
  };

  const handleOpenImageViewer = (imageUrl) => {
    setImageToView(imageUrl);
    setIsImageViewerOpen(true);
  };

  const handleCloseImageViewer = () => {
    setImageToView(null);
    setIsImageViewerOpen(false);
  };

  const handleGenerateReceipt = async (donationId) => {
    setGeneratingReceiptId(donationId);
    try {
      const token = localStorage.getItem('token'); // or get from redux if needed
      const res = await fetch(`${import.meta.env.VITE_API_URL}/donations/receipt/${donationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status && data.filePath) {
        setReceiptFileUrl(data.filePath);
        setIsReceiptModalOpen(true);
        dispatch(fetchDonations(filter)); // Refresh list to update receiptPath
      } else {
        alert(data.message || "Failed to generate receipt");
      }
    } catch (err) {
      alert("Error generating receipt");
    }
    setGeneratingReceiptId(null);
  };

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
    {
      Header: 'Donation Id',
      accessor: 'donationId',
    },
    {
      Header: 'Donor Name',
      Cell: ({ row }) => (
        <button
          onClick={() => handleViewDonation(row.original.donorUserId)}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 hover:underline"
        >
          {row.original.donorName}
        </button>
      )
    },
    // {
    //   Header: 'Phone Email',
    //   Cell: ({ row }) => (
    //     <div
    //       className="items-center"
    //     >
    //       <p>{row.original.donorPhone}</p>
    //       <p>{row.original.donorEmail}</p>

    //     </div>
    //   )
    // },
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
      Header: 'Image',
      Cell: ({ row }) => (
        row.original.paymentEvidencePath ? (
          <img
            src={row.original.paymentEvidencePath}
            alt="Evidence"
            className="w-12 h-12 object-cover rounded-md border border-blue-400 hover:shadow-lg shadow-xl cursor-pointer"
            onClick={() => handleOpenImageViewer(row.original.paymentEvidencePath)}
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )
      )
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex flex-col space-y-2">
          <div className="flex gap-x-3">
            <button
              onClick={() => (setView("DETAILS"), setSelectedData(row.original))}
              className="inline-flex items-center text-white bg-indigo-600 border border-indigo-500 rounded-md px-2 py-1 hover:bg-indigo-700"
            >
              View Details
            </button>
            {user?.role === "ADMIN" && (
              row.original.receiptPath ? (
                <button
                  onClick={() => {
                    setReceiptFileUrl(`${import.meta.env.VITE_API_URL}/${row.original.receiptPath}`);
                    setIsReceiptModalOpen(true);
                  }}
                  className="inline-flex items-center text-white bg-green-600 border border-green-500 rounded-md px-2 py-1 hover:bg-green-700"
                >
                  Receipt
                </button>
              ) : (
                row.original.paymentStatus === 'COMPLETED' && (
                  <button
                    onClick={() => handleGenerateReceipt(row.original.donationId)}
                    className="inline-flex items-center text-white bg-yellow-600 border border-yellow-500 rounded-md px-2 py-1 hover:bg-yellow-700"
                    disabled={generatingReceiptId === row.original.donationId}
                  >
                    {generatingReceiptId === row.original.donationId ? "Generating..." : "Generate Receipt"}
                  </button>
                )
              )
            )}

          </div>
          {!(row.original.paymentStatus === 'COMPLETED' || row.original.method === 'ONLINE') && (
            user?.role === "VOLUNTEER" &&
            <button
              onClick={() => handleOpenUploadModal(row.original)}
              className={`${row.original.paymentEvidencePath
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-500 hover:bg-green-600"
                } inline-flex items-center text-white border border-transparent rounded-md px-2 py-1`}
            >
              {row.original.paymentEvidencePath ? "ReUpload Image" : "Upload Image"}
            </button>
          )}
        </div>
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
        <button onClick={() => navigate("/admin/add-donation")} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Add New Donation</button>
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
            <DonationDetails donationData={selectedData} goBack={() => (setSelectedData(""), setView("DATA"))} />
            : "Please select a donation to view its details"
        )
      }

      {isUploadModalOpen && (
        <UploadImageModal
          donationData={selectedDonationForUpload}
          onClose={handleCloseUploadModal}
          onUploadSuccess={handleImageUploadSuccess}
        />
      )}

      {isImageViewerOpen && (
        <ImageViewerModal
          imageUrl={imageToView}
          onClose={handleCloseImageViewer}
        />
      )}

      {isReceiptModalOpen && (
        <PDFViewerModal
          fileUrl={receiptFileUrl}
          onClose={() => setIsReceiptModalOpen(false)}
        />
      )}
    </div>
  )
}

export default DonationList