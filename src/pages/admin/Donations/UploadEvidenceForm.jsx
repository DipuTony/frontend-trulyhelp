import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../utils/axiosInterceptor'; // Import axiosInstance

const UploadEvidenceForm = ({ donationId, goBack, onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // New state for image preview
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const { user } = useSelector((state) => state.auth);
    // const token = user?.token; // No longer needed as axiosInstance handles it

    // Effect to create and revoke object URL for image preview
    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewImage(objectUrl);

            // Clean up the object URL when the component unmounts or file changes
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewImage(null);
        }
    }, [selectedFile]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError(null); // Clear any previous file-related error
        } else {
            setSelectedFile(null);
            setPreviewImage(null);
        }
    };

    const handleClearImage = () => {
        setSelectedFile(null);
        setPreviewImage(null);
        // Clear the file input visually as well
        const fileInput = document.getElementById('evidence');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select a file to upload.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('evidenceImage', selectedFile);
        formData.append('donationId', donationId);

        try {
            const response = await axiosInstance.post('/donations/upload-evidence', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            });

            if (response.data.status) {
                setSuccess(true);
                setSelectedFile(null); // Clear selected file
                setPreviewImage(null); // Clear preview image
                // Clear the file input visually as well
                const fileInput = document.getElementById('evidence');
                if (fileInput) fileInput.value = '';

                if (onUploadSuccess) {
                    onUploadSuccess(); // Call the success callback
                }
            } else {
                throw new Error(response.data.message || 'Failed to upload image');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Upload Image</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-2">Select Image</label>
                    <input
                        type="file"
                        id="evidence"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>

                {previewImage && (
                    <div className="mb-4 p-2 border border-gray-200 rounded-md bg-white flex flex-col items-center">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img src={previewImage} alt="Selected" className="max-w-full h-32 object-contain rounded-md border border-gray-300" />
                        <button
                            type="button"
                            onClick={handleClearImage}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                            Clear Image
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center text-blue-600 mb-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                    </div>
                )}

                {error && (
                    <p className="text-red-600 text-sm mb-2">{error}</p>
                )}

                {success && (
                    <p className="text-green-600 text-sm mb-2">Image uploaded successfully!</p>
                )}

                <div className="flex space-x-2 mt-4">
                    <button
                        type="submit"
                        disabled={loading || !selectedFile}
                        className={`px-4 py-2 rounded-md text-white ${loading || !selectedFile ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button
                        type="button"
                        onClick={goBack}
                        className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadEvidenceForm; 