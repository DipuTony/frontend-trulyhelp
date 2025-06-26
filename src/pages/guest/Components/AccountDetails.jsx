import React from 'react'
import qrCode from '../../../images/qr_trulyhelp.png';

const AccountDetails = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md mt-8">
            <h3 className="font-bold text-lg mb-4 text-gray-800 text-center">Direct Bank Transfer</h3>
            <div className="flex flex-col items-center mb-4">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                    <img src={qrCode} alt="Donation QR Code" className="w-40 h-40" />
                </div>
                <p className="text-sm font-semibold mt-2 text-gray-700">Scan to Donate</p>
            </div>
            <dl className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                    <dt className="font-semibold">Bank:</dt>
                    <dd className="font-mono">HDFC BANK</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-semibold">A/C Holder:</dt>
                    <dd className="font-mono">TRULYHELP TRUST</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-semibold">A/C No:</dt>
                    <dd className="font-mono">50200089949557</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-semibold">IFSC:</dt>
                    <dd className="font-mono">HDFC0004945</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-semibold">A/C Type:</dt>
                    <dd className="font-mono">CURRENT</dd>
                </div>
                <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between">
                        <dt className="font-semibold">UPI ID:</dt>
                        <dd className="font-mono">9499159319@hdfcbank</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="font-semibold">Phonepe/Gpay:</dt>
                        <dd className="font-mono">9499159319</dd>
                    </div>
                </div>
            </dl>
        </div>
    )
}

export default AccountDetails