import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../utils/axiosInterceptor'; // Import axiosInstance

const UploadEvidenceForm = ({ donationId, goBack }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { user } = useSelector((state) => state.auth);
  // const token = user?.token; // No longer needed as axiosInstance handles it

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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

      if (response.data.success) {
        setSuccess(true);
        setSelectedFile(null); // Clear selected file
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
    <div className="p-4 bg-white shadow rounded-lg animate__animated animate__fadeInUp">
      <h2 className="text-xl font-semibold mb-4">Upload Evidence for Donation ID: {donationId}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="evidence" className="block text-sm font-medium text-gray-700">Select Image</label>
          <input
            type="file"
            id="evidence"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        {selectedFile && (
          <p className="text-sm text-gray-600 mb-2">Selected file: {selectedFile.name}</p>
        )}

        {loading && (
          <div className="flex items-center text-blue-600">
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

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
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