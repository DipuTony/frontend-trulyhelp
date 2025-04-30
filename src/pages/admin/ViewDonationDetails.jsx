import React from 'react';
import { useParams } from 'react-router-dom';

function ViewDonationDetails() {
    const { donationId } = useParams();
    const donationData = {
        donationId: donationId,
        donorName: 'Nerea Johnston',
        donorEmail: 'sipy@mailinator.com',
        donorPhone: '9588169339',
        donorDob: '2006-01-05',
        donorPan: 'Cum autem consectetu',
        donorAddress: 'Rem enim quaerat est',
        amount: 9,
        method: 'CASH',
        paymentStatus: 'COMPLETED',
        createdAt: '2025-04-26',
        updatedAt: '2025-04-29',
        volunteer: {
            name: 'Volunter Dipu',
            email: 'v@gmail.com',
            phone: '9876543299'
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">Donation Details</h1>
                    <p className="text-gray-500 mt-2">ID: {donationData.donationId}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    <div className="space-y-6">
                        <Section title="Donor Information">
                            <InfoItem label="Name" value={donationData.donorName} />
                            <InfoItem label="Email" value={donationData.donorEmail} />
                            <InfoItem label="Phone" value={donationData.donorPhone} />
                            <InfoItem label="Address" value={donationData.donorAddress} />
                        </Section>

                        <Section title="Payment Details">
                            <InfoItem label="Amount" value={`₹${donationData.amount}`} />
                            <InfoItem label="Method" value={donationData.method} />
                            <InfoItem label="Status" value={donationData.paymentStatus} />
                        </Section>
                    </div>

                    <div className="space-y-6">
                        <Section title="Volunteer Information">
                            <InfoItem label="Name" value={donationData.volunteer.name} />
                            <InfoItem label="Email" value={donationData.volunteer.email} />
                            <InfoItem label="Phone" value={donationData.volunteer.phone} />
                        </Section>

                        <Section title="Timestamps">
                            <InfoItem label="Created At" value={new Date(donationData.createdAt).toLocaleString()} />
                            <InfoItem label="Updated At" value={new Date(donationData.updatedAt).toLocaleString()} />
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Section = ({ title, children }) => (
    <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-800 font-medium">{value}</span>
    </div>
);

export default ViewDonationDetails;