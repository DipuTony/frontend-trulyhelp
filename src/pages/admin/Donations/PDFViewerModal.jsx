import React from 'react';

const PDFViewerModal = ({ fileUrl, onClose }) => {
  if (!fileUrl) return null;

  // Helper to check if file is a PDF
  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 animate__animated animate__fadeIn">
      <div className="bg-white p-2 rounded-lg shadow-xl max-w-3xl max-h-[90vh] w-full mx-auto animate__animated animate__zoomIn flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-bold">&times;</button>
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition ml-2"
          >
            Download
          </a>
        </div>
        <div className="flex-grow flex justify-center items-center overflow-auto">
          {isPdf ? (
            <iframe
              src={fileUrl}
              title="Receipt PDF"
              className="w-full h-[70vh] border rounded"
            />
          ) : (
            <img src={fileUrl} alt="Full-size Evidence" className="max-w-full max-h-[70vh] object-contain" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModal; 