import { useEffect, useState } from 'react';
import axios from 'axios';

const TestPaymentNotification = () => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    console.log('TestPaymentNotification component mounted');
  }, []);

  useEffect(() => {
    const checkPaymentGateway = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/organization/public`);
        console.log('Payment gateway check:', response.data);
        console.log('easebuzzEnv value:', response.data?.data?.easebuzzEnv);
        console.log('Condition check:', response?.data?.status && response.data?.data?.easebuzzEnv === 'test');
        
        if (response?.data?.status && response.data?.data?.easebuzzEnv === 'test') {
          console.log('Test mode detected, showing notification');
          setShowNotification(true);
        } else {
          console.log('Test mode not detected or condition failed');
        }
      } catch (error) {
        console.error('Error checking payment gateway:', error);
      }
    };
    checkPaymentGateway();
  }, []);

  if (!showNotification) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-fade-in" style={{ zIndex: 9999 }}>
      <div className="bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 max-w-sm border-2 border-yellow-600">
        <i className="fas fa-exclamation-triangle text-xl flex-shrink-0"></i>
        <div className="flex-1">
          <p className="font-semibold text-sm">Test Payment Gateway Enabled</p>
          <p className="text-xs opacity-90">Payments are in test mode</p>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="ml-2 text-white hover:opacity-70 flex-shrink-0"
          aria-label="Close notification"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default TestPaymentNotification;

