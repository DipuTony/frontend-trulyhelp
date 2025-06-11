import React from 'react';

const ImageViewerModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 animate__animated animate__fadeIn">
      <div className="bg-white p-2 rounded-lg shadow-xl max-w-3xl max-h-3/4 mx-auto animate__animated animate__zoomIn flex flex-col">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-bold">&times;</button>
        </div>
        <div className="flex-grow flex justify-center items-center overflow-auto">
          <img src={imageUrl} alt="Full-size Evidence" className="max-w-full max-h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal; 