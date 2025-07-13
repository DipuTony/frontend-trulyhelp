import React, { useState, useEffect } from 'react';

const UpdateDonorModal = ({ isOpen, onClose, donorData, onSave }) => {
    const [form, setForm] = useState({
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        donorDob: '',
        donorPan: '',
        aadharNo: '',
        donorAddress: '',
    });

    useEffect(() => {
        if (donorData) {
            setForm({
                donorName: donorData.donorName || '',
                donorEmail: donorData.donorEmail || '',
                donorPhone: donorData.donorPhone || '',
                donorDob: donorData.donorDob ? donorData.donorDob.slice(0, 10) : '',
                donorPan: donorData.donorPan || '',
                aadharNo: donorData.aadharNo || '',
                donorAddress: donorData.donorAddress || '',
            });
        }
    }, [donorData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Update Donor Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="donorName"
                                    value={form.donorName}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    name="donorEmail"
                                    value={form.donorEmail}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    type="text"
                                    name="donorPhone"
                                    value={form.donorPhone}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                                    required
                                />
                            </div>

                        </div>
                        {/* Right column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">PAN No</label>
                                <input
                                    type="text"
                                    name="donorPan"
                                    value={form.donorPan}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="donorDob"
                                    value={form.donorDob}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Aadhar No</label>
                                <input
                                    type="text"
                                    name="aadharNo"
                                    value={form.aadharNo}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <textarea
                            name="donorAddress"
                            value={form.donorAddress}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default UpdateDonorModal; 