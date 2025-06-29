import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountDetails from './Components/AccountDetails';
import ImpactStats from './Components/ImpactStats';
import HomePageSkeleton from './Components/HomePageSkeleton';

const testimonials = [
    {
        name: 'Aarav Sharma',
        amount: 2500,
        message: 'It feels great to contribute to a cause that provides education to children. TrulyHelp makes it so easy.',
        avatar: 'https://i.pravatar.cc/150?u=aaron'
    },
    {
        name: 'Diya Patel',
        amount: 1500,
        message: 'I\'m happy to know my donation is helping someone regain their sight. Wonderful work by the team!',
        avatar: 'https://i.pravatar.cc/150?u=diya'
    },
    {
        name: 'Rohan Gupta',
        amount: 5000,
        message: 'The monthly donation option is fantastic. It allows me to make a sustained impact effortlessly.',
        avatar: 'https://i.pravatar.cc/150?u=rohan'
    },
    {
        name: 'Priya Singh',
        amount: 1000,
        message: 'Volunteering with TrulyHelp has been a life-changing experience. The transparency is commendable.',
        avatar: 'https://i.pravatar.cc/150?u=priya'
    },
    {
        name: 'Vikram Kumar',
        amount: 3000,
        message: 'Donating was simple and secure. Seeing the impact stories makes it all the more worthwhile.',
        avatar: 'https://i.pravatar.cc/150?u=vikram'
    },
    {
        name: 'Anika Reddy',
        amount: 2000,
        message: 'The work you do for women empowerment is inspiring. Proud to be a supporter.',
        avatar: 'https://i.pravatar.cc/150?u=anika'
    },
    {
        name: 'Siddharth Joshi',
        amount: 7500,
        message: 'I trust TrulyHelp with my contributions. Their financial transparency is a big reason why.',
        avatar: 'https://i.pravatar.cc/150?u=sid'
    },
    {
        name: 'Ishaan Verma',
        amount: 1200,
        message: 'Every child deserves a chance. Happy to support the child education programs.',
        avatar: 'https://i.pravatar.cc/150?u=ishaan'
    },
    {
        name: 'Sneha Mehta',
        amount: 4000,
        message: 'The regular updates on how my donation is being used are very reassuring. Keep up the amazing work!',
        avatar: 'https://i.pravatar.cc/150?u=sneha'
    },
    {
        name: 'Arjun Nair',
        amount: 10000,
        message: 'Supporting the humanitarian relief efforts was a no-brainer. Quick and effective response from TrulyHelp.',
        avatar: 'https://i.pravatar.cc/150?u=arjun'
    }
];

const HomePage = ({ onDonateClick }) => {
    const [donationOptions, setDonationOptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCause, setActiveCause] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [donationFrequency, setDonationFrequency] = useState('once');
    const [availableCauses, setAvailableCauses] = useState([]);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
    const [customAmount, setCustomAmount] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonialIndex(prevIndex => (prevIndex + 1) % testimonials.length);
        }, 5000); // Slide every 5 seconds
        return () => clearInterval(timer);
    }, []);

    // Fetch donation options from API
    useEffect(() => {
        const fetchDonationOptions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/donation-options`);

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
        if (!activeCause || (!donationOptions[activeCause]?.options)) return;

        const frequency = donationFrequency;
        const options = donationOptions[activeCause].options;
        const frequencyOptions = options[frequency];
        if (!frequencyOptions) return;

        let amount = null;
        if (customAmount && !isNaN(Number(customAmount)) && Number(customAmount) > 0) {
            amount = Number(customAmount);
        } else if (selectedAmount !== null) {
            amount = frequencyOptions.amounts[selectedAmount];
        }
        if (!amount) return;

        const donationData = {
            amount,
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
        setCustomAmount(""); // Clear custom amount if preset is selected
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
        return <HomePageSkeleton />;
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
                                    className={`w-full p-5 rounded-xl text-left transition-all duration-300 shadow-md hover:shadow-lg`}
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

                        {/* Account Details & Impact Stats for Desktop */}
                        <div className="hidden lg:block">
                            <AccountDetails />
                            <ImpactStats />
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
                                                {/* {selectedAmount === index && (
                                                    <span className="text-xs mt-2 text-center text-gray-600">
                                                        {donationOptions[activeCause].options[donationFrequency].messages[index]}
                                                    </span>
                                                )} */}
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
                                            value={customAmount}
                                            min={1}
                                            onChange={e => {
                                                setCustomAmount(e.target.value);
                                                setSelectedAmount(null); // Clear preset if custom is typed
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Donate Now Button */}
                                <div className="text-center">
                                    <button
                                        onClick={handleDonate}
                                        disabled={
                                            (!customAmount || isNaN(Number(customAmount)) || Number(customAmount) <= 0) && selectedAmount === null
                                        }
                                        className={`py-4 px-12 rounded-full text-lg font-bold text-white shadow-lg transition-all transform hover:scale-105`}
                                        style={{
                                            background: ((customAmount && !isNaN(Number(customAmount)) && Number(customAmount) > 0) || selectedAmount !== null)
                                                ? `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})`
                                                : '#9ca3af',
                                            cursor: ((customAmount && !isNaN(Number(customAmount)) && Number(customAmount) > 0) || selectedAmount !== null) ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        {donationFrequency === 'once' ? 'Donate Now' : 'Start Monthly Donation'}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-9">
                                        Your donation is secure and tax-deductible
                                    </p>
                                </div>

                                {/* Account Details & Impact Stats for Mobile */}
                                <div className="block lg:hidden mt-8 space-y-4">
                                    <AccountDetails />
                                    <ImpactStats />
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Slider */}
                        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Words from our Supporters</h3>
                            <div className="relative h-40 overflow-hidden">
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className={`absolute w-full transition-opacity duration-1000 ease-in-out ${currentTestimonialIndex === index ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mb-4 shadow-md" />
                                            <p className="italic text-gray-700">"{testimonial.message}"</p>
                                            <p className="mt-2 font-semibold text-gray-800">{testimonial.name}</p>
                                            <p className="text-sm text-green-600 font-bold">
                                                Donated ₹{testimonial.amount.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;