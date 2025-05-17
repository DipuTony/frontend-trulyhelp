import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = ({ onDonateClick }) => {
    const [donationOptions, setDonationOptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCause, setActiveCause] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [donationFrequency, setDonationFrequency] = useState('once');
    const [availableCauses, setAvailableCauses] = useState([]);

    // Fetch donation options from API
    useEffect(() => {
        const fetchDonationOptions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}donation-options`);
                
                if (response.data.success) {
                    setDonationOptions(response.data.data);
                    // Set available causes from API response
                    const causeNames = Object.keys(response.data.data);
                    setAvailableCauses(causeNames);
                    // Set first cause as active if we have causes and none is selected
                    if (causeNames.length > 0 && !activeCause) {
                        setActiveCause(causeNames[0]);
                    }
                } else {
                    setError('Failed to fetch donation options');
                }
            } catch (err) {
                console.error('Error fetching donation options:', err);
                setError(err.message || 'An error occurred while fetching donation options');
            } finally {
                setLoading(false);
            }
        };

        fetchDonationOptions();
    }, []);

    const handleDonate = () => {
        if (!activeCause || selectedAmount === null || !donationOptions[activeCause]?.options) return;
        
        const frequency = donationFrequency;
        const options = donationOptions[activeCause].options;
        
        // Find the correct amount and message based on frequency and selected index
        const frequencyOptions = options[frequency];
        if (!frequencyOptions) return;
        
        const donationData = {
            amount: frequencyOptions.amounts[selectedAmount],
            frequency: donationFrequency,
            cause: activeCause
        };
        
        onDonateClick(donationData);
    };

    const handleCauseClick = (cause) => {
        setActiveCause(cause);
        setSelectedAmount(null);
    };

    const handleAmountClick = (amountIndex) => {
        setSelectedAmount(amountIndex);
    };

    const handleFrequencyChange = (frequency) => {
        setDonationFrequency(frequency);
        setSelectedAmount(null);
    };

    // Get color scheme from API or use default
    const getCauseColors = (causeName) => {
        if (donationOptions[causeName]?.colorScheme) {
            return {
                primary: donationOptions[causeName].colorScheme.primary || '#4f46e5',
                secondary: donationOptions[causeName].colorScheme.secondary || '#6366f1',
                light: donationOptions[causeName].colorScheme.light || '#e0e7ff',
                text: donationOptions[causeName].colorScheme.text || '#312e81'
            };
        }
        
        // Default color schemes as fallback
        const defaultColors = {
            sight: {
                primary: '#4f46e5',  // Indigo
                secondary: '#6366f1',
                light: '#e0e7ff',
                text: '#312e81'
            },
            education: {
                primary: '#10b981',  // Emerald
                secondary: '#34d399',
                light: '#d1fae5',
                text: '#064e3b'
            },
            training: {
                primary: '#f59e0b',  // Amber
                secondary: '#fbbf24',
                light: '#fef3c7',
                text: '#92400e'
            }
        };
        
        return defaultColors[causeName] || defaultColors.sight;
    };

    // Get current colors based on active cause
    const currentColors = activeCause ? getCauseColors(activeCause) : { primary: '#4f46e5', secondary: '#6366f1', light: '#e0e7ff', text: '#312e81' };

    const bgImage = "https://img.freepik.com/free-photo/photorealistic-kid-refugee-camp_23-2151494502.jpg";

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Donation Options</h2>
                    <p className="text-gray-700">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // If no causes available
    if (availableCauses.length === 0) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Donation Options Available</h2>
                    <p className="text-gray-700">Please check back later for donation opportunities.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Vibrant Banner Section */}
            <div
                className="w-full h-64 bg-cover bg-center relative overflow-hidden"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-40"></div>
                <div className="relative h-full flex items-center justify-center">
                    <div className="text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Vision of a Better and Empowered India</h1>
                        <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
                        Train, Educate, Raise Awareness, and Enable them towards a better life.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Cause Selection */}
                    <div className="space-y-4">
                        {availableCauses.map((cause) => {
                            const isActive = activeCause === cause;
                            const colors = getCauseColors(cause);
                            const causeData = donationOptions[cause];
                            
                            return (
                                <button
                                    key={cause}
                                    onClick={() => handleCauseClick(cause)}
                                    className={`w-full p-6 rounded-xl text-left transition-all duration-300 shadow-md hover:shadow-lg`}
                                    style={{
                                        background: isActive ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : 'white',
                                        borderLeftWidth: '4px',
                                        borderLeftColor: colors.primary,
                                        color: isActive ? 'white' : 'inherit'
                                    }}
                                >
                                    <h3 className="font-bold text-lg mb-1">
                                        {causeData.displayName}
                                    </h3>
                                    <p className={`text-sm ${isActive ? 'text-white opacity-90' : 'text-gray-600'}`}>
                                        {causeData.description}
                                    </p>
                                </button>
                            );
                        })}

                        {/* Impact Stats */}
                        <div className="bg-white p-6 rounded-xl shadow-md mt-8">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Your Impact</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                        <span className="text-purple-600">👁️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">1,240+</p>
                                        <p className="text-sm text-gray-500">Surgeries funded</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                        <span className="text-green-600">🎓</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">850+</p>
                                        <p className="text-sm text-gray-500">Children educated</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                                        <span className="text-amber-600">🛠️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">620+</p>
                                        <p className="text-sm text-gray-500">People trained</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Donation Section */}
                    <div className="lg:col-span-2">
                        {/* Vision Section */}
                        <div
                            className="p-6 rounded-xl mb-8 text-center shadow-md"
                            style={{
                                background: `linear-gradient(135deg, ${currentColors.light}, white)`,
                                borderTop: `4px solid ${currentColors.primary}`
                            }}
                        >
                            <h2 className="text-2xl font-bold mb-3" style={{ color: currentColors.text }}>
                                SHARED VISION OF A BETTER AND EMPOWERED INDIA
                            </h2>
                            <p className="text-gray-700">
                                Train, Educate, Raise Awareness, and Enable them towards a better life.
                            </p>
                        </div>

                        {/* Donation Card */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Frequency Toggle */}
                            <div className="flex justify-center p-6 bg-gray-50">
                                <div className="inline-flex rounded-full shadow-sm" role="group">
                                    <button
                                        onClick={() => handleFrequencyChange('once')}
                                        type="button"
                                        className={`px-6 py-3 text-sm font-medium rounded-l-full border`}
                                        style={{
                                            background: donationFrequency === 'once' ? currentColors.primary : 'white',
                                            borderColor: donationFrequency === 'once' ? currentColors.primary : '#e5e7eb',
                                            color: donationFrequency === 'once' ? 'white' : '#374151'
                                        }}
                                    >
                                        Give Once
                                    </button>
                                    <button
                                        onClick={() => handleFrequencyChange('monthly')}
                                        type="button"
                                        className={`px-6 py-3 text-sm font-medium rounded-r-full border`}
                                        style={{
                                            background: donationFrequency === 'monthly' ? currentColors.primary : 'white',
                                            borderColor: donationFrequency === 'monthly' ? currentColors.primary : '#e5e7eb',
                                            color: donationFrequency === 'monthly' ? 'white' : '#374151'
                                        }}
                                    >
                                        Give Monthly
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">
                                    Choose your donation amount
                                </h3>
                                <p className="text-center text-sm text-gray-500 mb-6">
                                    {donationFrequency === 'once'
                                        ? 'Make a one-time contribution'
                                        : 'Make a recurring monthly impact'}
                                </p>

                                {/* Donation Amount Buttons */}
                                {activeCause && donationOptions[activeCause]?.options && donationOptions[activeCause].options[donationFrequency] ? (
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {donationOptions[activeCause].options[donationFrequency].amounts.map((amount, index) => (
                                            <button
                                                key={amount}
                                                onClick={() => handleAmountClick(index)}
                                                className={`py-5 px-4 rounded-xl border-2 text-lg font-medium transition-all flex flex-col items-center relative overflow-hidden`}
                                                style={{
                                                    borderColor: selectedAmount === index ? currentColors.primary : '#e5e7eb',
                                                    backgroundColor: selectedAmount === index ? currentColors.light : 'white'
                                                }}
                                            >
                                                <span className="font-bold" style={{ color: currentColors.text }}>
                                                    ₹{amount.toLocaleString('en-IN')}
                                                </span>
                                                {selectedAmount === index && (
                                                    <span className="text-xs mt-2 text-center text-gray-600">
                                                        {donationOptions[activeCause].options[donationFrequency].messages[index]}
                                                    </span>
                                                )}
                                                {selectedAmount === index && (
                                                    <div
                                                        className="absolute top-0 left-0 w-full h-1"
                                                        style={{ backgroundColor: currentColors.primary }}
                                                    ></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No donation options available for {donationFrequency} frequency.
                                    </div>
                                )}

                                {/* Selected Amount Message */}
                                {selectedAmount !== null && activeCause && donationOptions[activeCause]?.options && 
                                 donationOptions[activeCause].options[donationFrequency] && (
                                    <div
                                        className="p-4 rounded-lg mb-8 text-center"
                                        style={{ backgroundColor: currentColors.light }}
                                    >
                                        <p style={{ color: currentColors.text }}>
                                            {donationOptions[activeCause].options[donationFrequency].messages[selectedAmount]}
                                        </p>
                                    </div>
                                )}

                                {/* Custom Amount Input */}
                                <div className="mb-8">
                                    <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                        Or enter a custom amount
                                    </label>
                                    <div className="relative max-w-xs mx-auto">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            id="custom-amount"
                                            className="block w-full pl-8 pr-12 py-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Other amount"
                                        />
                                    </div>
                                </div>

                                {/* Donate Now Button */}
                                <div className="text-center">
                                    <button
                                        onClick={handleDonate}
                                        disabled={selectedAmount === null}
                                        className={`py-4 px-12 rounded-full text-lg font-bold text-white shadow-lg transition-all transform hover:scale-105`}
                                        style={{
                                            background: selectedAmount !== null
                                                ? `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})`
                                                : '#9ca3af',
                                            cursor: selectedAmount !== null ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        {donationFrequency === 'once' ? 'Donate Now' : 'Start Monthly Donation'}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-3">
                                        Your donation is secure and tax-deductible
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600">💙</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="italic text-gray-700">
                                        "Thanks to generous donors, I regained my sight and can now support my family again."
                                    </p>
                                    <p className="mt-2 font-medium text-gray-800">- Rajesh, Surgery Recipient</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;