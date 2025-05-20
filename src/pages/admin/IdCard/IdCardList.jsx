import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchICardList } from '../../../store/slices/volunteerSlice';
import DataTable from '../../../components/common/DataTable/DataTable';
import { formatDateShort } from '../../../components/common/DateFormatFunctions';

const IdCardList = () => {
    const dispatch = useDispatch()
    const { iCardList, loading, error } = useSelector((state) => state.volunteers);

    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    // const [data, setData] = useState(DATA);
    useEffect(() => {
        dispatch(fetchICardList());
    }, [dispatch]);

    const fetchDate = () => {
        dispatch(fetchICardList());
    }

    useEffect(() => {
        fetchDate();
    }, [])

    const handleAssignCard = () => {
        // API call to assign the card would go here
        setOpenAssignModal(false);
    };

    const handleUpdateCard = () => {
        const updatedData = data.map(item =>
            item.iCardID === selectedCard.iCardID ? selectedCard : item
        );
        setData(updatedData);
        setOpenViewModal(false);
    };

    const handleStatusChange = (id, newStatus) => {
        const updatedData = data.map(item =>
            item.iCardID === id ? { ...item, iCardStatus: newStatus } : item
        );
        setData(updatedData);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!iCardList) return <div>No data available</div>;
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">ID Card Management</h2>
                <button
                    onClick={() => setOpenAssignModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    <span>+</span>
                    <span>Assign New ID Card</span>
                </button>
            </div>

            {!loading && iCardList?.length > 0 ? (
                <DataTable
                    columns={COLUMNS}
                    data={iCardList}
                    fetchDate={fetchDate}
                />
            ) : (
                <div className="text-center">No data available</div>
            )}

            {/* Assign New ID Card Modal */}
            {openAssignModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Assign New ID Card
                                        </h3>
                                        <div className="mt-6 space-y-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                    Volunteer Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="text"
                                                    id="phone"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    id="dob"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                                    Gender
                                                </label>
                                                <select
                                                    id="gender"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                                                    Issue Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="issueDate"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="expiryDate"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleAssignCard}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Assign Card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOpenAssignModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View/Edit ID Card Modal */}
            {openViewModal && selectedCard && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            ID Card Details
                                        </h3>
                                        <div className="mt-6 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    ID Card ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedCard.iCardID}
                                                    disabled
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedCard.name}
                                                    onChange={(e) => setSelectedCard({ ...selectedCard, name: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedCard.phone}
                                                    onChange={(e) => setSelectedCard({ ...selectedCard, phone: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedCard.dateOfBirth}
                                                    onChange={(e) => setSelectedCard({ ...selectedCard, dateOfBirth: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Gender
                                                </label>
                                                <select
                                                    value={selectedCard.gender}
                                                    onChange={(e) => setSelectedCard({ ...selectedCard, gender: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Status
                                                </label>
                                                <select
                                                    value={selectedCard.iCardStatus}
                                                    onChange={(e) => setSelectedCard({ ...selectedCard, iCardStatus: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleUpdateCard}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOpenViewModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const COLUMNS = [

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
        Header: 'Issue Date',
        accessor: 'iCardAssignDate',
        Cell: ({ value }) => (
            <p>
                {value ? formatDateShort(value) : "Not Issued"}
            </p>
        )
    },
    {
        Header: 'Status',
        accessor: 'iCardStatus',
        Cell: ({ value }) => {
            // Determine styling based on status
            let statusStyles = "";
            switch (value) {
                case 'ACTIVE':
                    statusStyles = "bg-green-100 text-green-800 border-green-200";
                    break;
                case 'DISABLED':
                    statusStyles = "bg-red-100 text-red-800 border-red-200";
                    break;
                case 'PENDING':
                    statusStyles = "bg-yellow-100 text-yellow-800 border-yellow-200";
                    break;
                case 'UNASSIGN':
                    statusStyles = "bg-gray-100 text-gray-800 border-gray-200";
                    break;
                default:
                    statusStyles = "bg-gray-100 text-gray-800 border-gray-200";
            }

            return (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles}`}>
                    {value}
                </span>
            );
        }
    },
    {
        Header: 'Expiry Date',
        accessor: 'iCardExpiryDate',
        Cell: ({ value }) => (
            <p className="text-sm text-gray-700">
                {value ? formatDateShort(value) : (
                    <span className="text-gray-400 italic">Not Issued</span>
                )}
            </p>
        )
    },
    {
        Header: 'Actions',
        Cell: ({ row }) => (
            <button
                onClick={() => setOpenAssignModal(true)}
                className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
            >
                {/* <PencilIcon className="h-4 w-4 mr-1" /> */}
                View / update
            </button>
        )
    }
];

export default IdCardList;