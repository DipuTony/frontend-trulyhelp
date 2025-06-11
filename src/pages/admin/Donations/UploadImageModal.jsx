import React from 'react';
import UploadEvidenceForm from './UploadEvidenceForm';

const UploadImageModal = ({ donationData, onClose, onUploadSuccess }) => {
  if (!donationData) return null;

  const { donationId, donorName, amount, method, paymentStatus } = donationData;

  const handleUploadSuccess = () => {
    onUploadSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 animate__animated animate__fadeIn">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto animate__animated animate__zoomIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upload Image for Donation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <div className="mb-4 text-gray-700">
          <p><strong>Donation ID:</strong> {donationId}</p>
          <p><strong>Donor Name:</strong> {donorName}</p>
          <p><strong>Amount:</strong> ₹{amount}</p>
          <p><strong>Payment Method:</strong> {method}</p>
          <p><strong>Payment Status:</strong> {paymentStatus}</p>
        </div>

        <UploadEvidenceForm donationId={donationId} goBack={onClose} onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default UploadImageModal; 