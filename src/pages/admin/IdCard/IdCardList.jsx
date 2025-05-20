import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchICardList } from '../../../store/slices/volunteerSlice';
import DataTable from '../../../components/common/DataTable/DataTable';
import { formatDateShort } from '../../../components/common/DateFormatFunctions';

const IdCardList = () => {
    const dispatch = useDispatch();
    const { iCardList, loading, error } = useSelector((state) => state.volunteers);
    
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState('assign'); // 'assign', 'view', 'edit'
    const [selectedCard, setSelectedCard] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        status: 'PENDING',
        assignDate: '',
        expiryDate: ''
    });

    useEffect(() => {
        dispatch(fetchICardList());
    }, [dispatch]);

    const handleModalOpen = (type, card = null) => {
        setModalType(type);
        if (card) {
            setSelectedCard(card);
            if (type === 'edit') {
                setFormData({
                    name: card.name,
                    email: card.email,
                    status: card.iCardStatus,
                    assignDate: card.iCardAssignDate ? formatDateForInput(card.iCardAssignDate) : '',
                    expiryDate: card.iCardExpiryDate ? formatDateForInput(card.iCardExpiryDate) : ''
                });
            }
        }
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setSelectedCard(null);
        setFormData({
            name: '',
            email: '',
            status: 'PENDING',
            assignDate: '',
            expiryDate: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAssignCard = () => {
        // API call to assign card
        console.log('Assigning card with data:', formData);
        handleModalClose();
    };

    const handleUpdateCard = () => {
        // API call to update card
        console.log('Updating card with data:', formData);
        handleModalClose();
    };

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error.message || 'Failed to load ID cards'}
        </div>
    );

    if (!iCardList?.data) return <div className="text-center py-10">No data available</div>;

    const statusCounts = iCardList.counts || {};
    const totalCards = iCardList.total || 0;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">ID Card Management</h1>
                    <div className="flex flex-wrap items-center gap-4">
                        <select 
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => console.log('Filter by:', e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PENDING">Pending</option>
                            <option value="DISABLED">Disabled</option>
                            <option value="UNASSIGN">Unassigned</option>
                        </select>
                        
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <div key={status} className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                        status === 'ACTIVE' ? 'bg-green-500' :
                                        status === 'PENDING' ? 'bg-yellow-500' :
                                        status === 'DISABLED' ? 'bg-red-500' : 'bg-gray-500'
                                    }`}></span>
                                    <span className="text-sm font-medium">{status}: {count}</span>
                                </div>
                            ))}
                            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                <span className="inline-block w-2 h-2 rounded-full mr-2 bg-blue-500"></span>
                                <span className="text-sm font-medium">Total: {totalCards}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={() => handleModalOpen('assign')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Assign New Card
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    columns={COLUMNS(handleModalOpen)}
                    data={iCardList.data}
                    fetchData={() => dispatch(fetchICardList())}
                />
            </div>

            {/* Modal */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {modalType === 'assign' ? 'Assign New ID Card' : 
                                 modalType === 'edit' ? 'Edit ID Card' : 'ID Card Details'}
                            </h2>
                        </div>
                        
                        <div className="p-6">
                            {modalType === 'view' ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                                            <p className="text-gray-900">{selectedCard.userId}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                            <p className="text-gray-900">{selectedCard.name}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                        <p className="text-gray-900">{selectedCard.email || 'N/A'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                selectedCard.iCardStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                selectedCard.iCardStatus === 'DISABLED' ? 'bg-red-100 text-red-800' :
                                                selectedCard.iCardStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {selectedCard.iCardStatus}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Assign Date</label>
                                            <p className="text-gray-900">
                                                {selectedCard.iCardAssignDate ? formatDateShort(selectedCard.iCardAssignDate) : 'Not assigned'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Expiry Date</label>
                                        <p className="text-gray-900">
                                            {selectedCard.iCardExpiryDate ? formatDateShort(selectedCard.iCardExpiryDate) : 'Not set'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                            <select
                                                id="status"
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="ACTIVE">Active</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="DISABLED">Disabled</option>
                                                <option value="UNASSIGN">Unassigned</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="assignDate" className="block text-sm font-medium text-gray-600 mb-1">Assign Date</label>
                                            <input
                                                type="date"
                                                id="assignDate"
                                                name="assignDate"
                                                value={formData.assignDate}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-600 mb-1">Expiry Date</label>
                                        <input
                                            type="date"
                                            id="expiryDate"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </form>
                            )}
                        </div>
                        
                        <div className="p-4 border-t flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleModalClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            {modalType !== 'view' && (
                                <button
                                    type="button"
                                    onClick={modalType === 'assign' ? handleAssignCard : handleUpdateCard}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {modalType === 'assign' ? 'Assign Card' : 'Save Changes'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Columns configuration with dynamic handler
const COLUMNS = (handleModalOpen) => [
    {
        Header: 'User ID',
        accessor: 'userId',
        Cell: ({ value }) => <span className="font-mono text-sm">{value}</span>
    },
    {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }) => (
            <button
                onClick={() => handleModalOpen('view', row.original)}
                className="text-blue-600 hover:text-blue-800 hover:underline"
            >
                {row.original.name}
            </button>
        )
    },
    {
        Header: 'Email',
        accessor: 'email',
        Cell: ({ value }) => <span className="text-gray-700">{value || 'N/A'}</span>
    },
    {
        Header: 'Status',
        accessor: 'iCardStatus',
        Cell: ({ value }) => (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                value === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                value === 'DISABLED' ? 'bg-red-100 text-red-800' :
                value === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
            }`}>
                {value}
            </span>
        )
    },
    {
        Header: 'Assign Date',
        accessor: 'iCardAssignDate',
        Cell: ({ value }) => (
            <span className="text-sm text-gray-700">
                {value ? formatDateShort(value) : (
                    <span className="text-gray-400 italic">Not assigned</span>
                )}
            </span>
        )
    },
    {
        Header: 'Expiry Date',
        accessor: 'iCardExpiryDate',
        Cell: ({ value }) => (
            <span className="text-sm text-gray-700">
                {value ? formatDateShort(value) : (
                    <span className="text-gray-400 italic">Not set</span>
                )}
            </span>
        )
    },
    {
        Header: 'Actions',
        Cell: ({ row }) => (
            <button
                onClick={() => handleModalOpen('edit', row.original)}
                className="text-indigo-600 hover:text-indigo-800 hover:underline text-sm font-medium"
            >
                Edit
            </button>
        )
    }
];

export default IdCardList;