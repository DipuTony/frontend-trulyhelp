import React, { useState } from 'react';

const HomePage = ({ onDonateClick }) => {
    const [activeCause, setActiveCause] = useState('sight');
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [donationFrequency, setDonationFrequency] = useState('once');

    const handleDonate = () => {
        const donationData = {
            amount: donationOptions[activeCause][donationFrequency].amounts[selectedAmount],
            frequency: donationFrequency,
            cause: activeCause
        };
        onDonateClick(donationData);
    };

    // Donation amounts and corresponding messages for each cause and frequency
    const donationOptions = {
        sight: {
            once: {
                amounts: [5500, 11000, 22000, 33000],
                messages: [
                    "Support one sight-restoring surgery",
                    "Support two sight-restoring surgeries",
                    "Help four people regain their vision",
                    "Help six people see again"
                ]
            },
            monthly: {
                amounts: [1500, 2500, 3500, 5000],
                messages: [
                    "Monthly support for sight-restoring surgeries",
                    "Help two people see every month",
                    "Transform lives monthly through vision care",
                    "Sustained support for sight restoration"
                ]
            }
        },
        education: {
            once: {
                amounts: [2500, 5000, 10000, 15000],
                messages: [
                    "Support a Child for 3 months with accessible educational resources",
                    "Support a Child for 6 months with accessible educational resources",
                    "Support a Child for a year with accessible educational resources",
                    "Support two Children for a year with accessible educational resources"
                ]
            },
            monthly: {
                amounts: [800, 1500, 2500, 3500],
                messages: [
                    "Monthly educational support for a child",
                    "Provide continuous learning resources monthly",
                    "Sustained education for visually impaired children",
                    "Comprehensive monthly educational support"
                ]
            }
        },
        training: {
            once: {
                amounts: [1500, 3000, 6000, 9000],
                messages: [
                    "Provide vocational training for one person",
                    "Provide vocational training for two people",
                    "Help four people gain livelihood skills",
                    "Help six people become self-sufficient"
                ]
            },
            monthly: {
                amounts: [500, 1000, 2000, 3000],
                messages: [
                    "Monthly skills training support",
                    "Continuous livelihood training monthly",
                    "Sustained vocational training program",
                    "Comprehensive monthly training support"
                ]
            }
        }
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

    // Color schemes for each cause
    const causeColors = {
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

    const currentColors = causeColors[activeCause];

    const bgImage = "https://img.freepik.com/free-photo/photorealistic-kid-refugee-camp_23-2151494502.jpg"

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Vibrant Banner Section */}
            {/* <div className="w-full h-64 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: "url('/images/banner.jpg')" }}> */}
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
                        {['sight', 'education', 'training'].map((cause) => {
                            const isActive = activeCause === cause;
                            const colors = causeColors[cause];
                            return (
                                <button
                                    key={cause}
                                    onClick={() => handleCauseClick(cause)}
                                    className={`w-full p-6 rounded-xl text-left transition-all duration-300 shadow-md hover:shadow-lg ${isActive
                                        ? `bg-gradient-to-r from-${colors.primary} to-${colors.secondary} text-white`
                                        : `bg-white hover:bg-${colors.light} border-l-4 border-${colors.primary}`
                                        }`}
                                    style={{
                                        background: isActive ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : 'white',
                                        borderLeftColor: colors.primary
                                    }}
                                >
                                    <h3 className="font-bold text-lg mb-1">
                                        {cause === 'sight' && 'Help the visually impaired see'}
                                        {cause === 'education' && 'Uplift visually impaired children'}
                                        {cause === 'training' && 'Support people with disabilities'}
                                    </h3>
                                    <p className={`text-sm ${isActive ? 'text-white opacity-90' : 'text-gray-600'}`}>
                                        {cause === 'sight' && 'with a SIGHT RESTORATION SURGERY'}
                                        {cause === 'education' && 'with EDUCATION SUPPORT'}
                                        {cause === 'training' && 'through LIVELIHOOD TRAINING'}
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
                                        className={`px-6 py-3 text-sm font-medium rounded-l-full border ${donationFrequency === 'once'
                                            ? `bg-${currentColors.primary} text-white border-${currentColors.primary}`
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        style={{
                                            background: donationFrequency === 'once' ? currentColors.primary : 'white',
                                            borderColor: donationFrequency === 'once' ? currentColors.primary : '#e5e7eb'
                                        }}
                                    >
                                        Give Once
                                    </button>
                                    <button
                                        onClick={() => handleFrequencyChange('monthly')}
                                        type="button"
                                        className={`px-6 py-3 text-sm font-medium rounded-r-full border ${donationFrequency === 'monthly'
                                            ? `bg-${currentColors.primary} text-white border-${currentColors.primary}`
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        style={{
                                            background: donationFrequency === 'monthly' ? currentColors.primary : 'white',
                                            borderColor: donationFrequency === 'monthly' ? currentColors.primary : '#e5e7eb'
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
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {donationOptions[activeCause][donationFrequency].amounts.map((amount, index) => (
                                        <button
                                            key={amount}
                                            onClick={() => handleAmountClick(index)}
                                            className={`py-5 px-4 rounded-xl border-2 text-lg font-medium transition-all flex flex-col items-center relative overflow-hidden ${selectedAmount === index
                                                ? `border-${currentColors.primary} bg-${currentColors.light}`
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
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
                                                    {donationOptions[activeCause][donationFrequency].messages[index]}
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

                                {/* Selected Amount Message */}
                                {selectedAmount !== null && (
                                    <div
                                        className="p-4 rounded-lg mb-8 text-center"
                                        style={{ backgroundColor: currentColors.light }}
                                    >
                                        <p style={{ color: currentColors.text }}>
                                            {donationOptions[activeCause][donationFrequency].messages[selectedAmount]}
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
                                        className={`py-4 px-12 rounded-full text-lg font-bold text-white shadow-lg transition-all transform hover:scale-105 ${selectedAmount !== null
                                            ? `bg-gradient-to-r from-${currentColors.primary} to-${currentColors.secondary} hover:shadow-xl`
                                            : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                        style={{
                                            background: selectedAmount !== null
                                                ? `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})`
                                                : '#9ca3af'
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