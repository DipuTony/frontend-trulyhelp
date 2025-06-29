import React from 'react'
import qrCode from '../../../images/qr_trulyhelp.png';

const AccountDetails = () => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-lg mt-2">
            <h3 className="font-bold text-xl mb-3 text-gray-800 text-center">Direct Bank Transfer</h3>
            <div className="flex flex-col items-center mb-2">
                <div className="bg-white p-1 rounded shadow">
                    <img src={qrCode} alt="Donation QR Code" className="w-28 h-28" />
                </div>
                <p className="text-xs font-semibold mt-1 text-gray-700">Scan to Donate</p>
            </div>
            <dl className="space-y-1 text-xs text-gray-700">
                <div className="flex justify-between">
                    <dt className="font-semibold">Bank:</dt>
                    <dd className="font-mono font-bold text-sm">HDFC BANK</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-semibold">A/C Holder:</dt>
                    <dd className="font-mono font-bold text-sm">TRULYHELP TRUST</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-semibold">A/C No:</dt>
                    <dd className="font-mono font-bold text-sm">50200089949557</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-semibold">IFSC:</dt>
                    <dd className="font-mono font-bold text-sm">HDFC0004945</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-semibold">A/C Type:</dt>
                    <dd className="font-mono font-bold text-sm">CURRENT</dd>
                </div>
                <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between">
                        <dt className="font-semibold">UPI ID:</dt>
                        <dd className="font-mono font-bold text-sm">9499159319@hdfcbank</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="font-semibold">Phonepe/Gpay:</dt>
                        <dd className="font-mono font-bold text-sm">9499159319</dd>
                    </div>
                </div>
            </dl>
        </div>
    )
}

export default AccountDetails