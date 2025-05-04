import React from 'react';
import HomePage from './HomePage';
import DonateForm from './DonateForm';

const GuestIndex = () => {
    const [currentPage, setCurrentPage] = React.useState('home');
    const [donationData, setDonationData] = React.useState(null);

    return (
        <>
            <div className={`${currentPage === 'home' ? 'block' : 'hidden'}`}>

                <HomePage
                    onDonateClick={(data) => {
                        setDonationData(data);
                        setCurrentPage('donate');
                    }}
                />
            </div>

            <div className={`${currentPage === 'donate' ? 'block' : 'hidden'}`}>

                <DonateForm
                    donationData={donationData}
                    onBackClick={() => setCurrentPage('home')}
                />
            </div>

        </>
    );
};

export default GuestIndex;