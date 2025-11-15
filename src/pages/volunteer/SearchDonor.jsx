import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInterceptor';
import { toast } from 'sonner';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchDonor = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.length < 3) {
            toast.error('Please enter at least 3 characters to search');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/user/donor/search?q=${encodeURIComponent(searchQuery)}`);
            
            if (response.data.status) {
                setDonors(response.data.data);
            } else {
                setError(response.data.message);
                setDonors([]);
                toast.error(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to search donors');
            setDonors([]);
            toast.error(err.response?.data?.message || 'Failed to search donors');
        } finally {
            setLoading(false);
        }
    };

    const handleDonateNow = (userId) => {
        navigate(`/volunteer/donate/${userId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Search Donors</h1>
                    <p className="mt-2 text-lg text-gray-600">Find donors by name, email, phone, or user ID</p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <form onSubmit={handleSearch} className="p-6">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name, email, phone, or user ID (min. 3 characters)"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    minLength={3}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || searchQuery.length < 3}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Searching...
                                    </div>
                                ) : (
                                    'Search'
                                )}
                            </button>
                        </div>
                        {searchQuery.length > 0 && searchQuery.length < 3 && (
                            <p className="mt-2 text-sm text-red-600">
                                Please enter at least 3 characters to search
                            </p>
                        )}
                    </form>
                </div>

                {/* Results */}
                {donors.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2>
                            <div className="space-y-4">
                                {donors.map((donor) => (
                                    <div
                                        key={donor.userId}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-lg font-semibold text-gray-900">{donor.name}</p>
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    {donor.role}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                <p>Email: {donor.email}</p>
                                                <p>Phone: {donor.phone}</p>
                                                <p>ID: {donor.userId}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDonateNow(donor.userId)}
                                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                        >
                                            Donate Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* No Results Message */}
                {error && !loading && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                                <p className="text-gray-600">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchDonor;