import React from 'react';
import { useNavigate } from 'react-router-dom';

function ErrorFallback({ error, resetErrorBoundary, showNavigation = false }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Something went wrong
                    </h2>
                    <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <p className="font-bold">Error Details:</p>
                        <p className="text-sm">{error.message || 'An unexpected error occurred'}</p>
                    </div>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button
                            onClick={resetErrorBoundary}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                        >
                           Go Back
                        </button>
                        {showNavigation && (
                            <button
                                onClick={() => navigate('/')}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                            >
                                Go to Home
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorFallback;