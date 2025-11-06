import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosInterceptor'
import qrCode from '../../../images/qr_trulyhelp.png';

const AccountDetails = () => {
    const [loading, setLoading] = useState(true)
    const [bankData, setBankData] = useState({
        bankName: '',
        bankAccountName: '',
        bankAccountNumber: '',
        bankIfsc: '',
        bankBranch: '',
        accountType: '',
        qrUpiId: '',
        phonepeGpay: '',
        qrCodeImageUrl: '',
    })

    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                const { data } = await axiosInstance.get('/organization/public')
                if (mounted && data?.status && data?.data) {
                    const {
                        bankName = '',
                        bankAccountName = '',
                        bankAccountNumber = '',
                        bankIfsc = '',
                        bankBranch = '',
                        accountType = '',
                        qrUpiId = '',
                        phonepeGpay = '',
                        qrCodeImageUrl = ''
                    } = data.data || {}
                    setBankData({
                        bankName,
                        bankAccountName,
                        bankAccountNumber,
                        bankIfsc,
                        bankBranch,
                        accountType,
                        qrUpiId,
                        phonepeGpay,
                        qrCodeImageUrl,
                    })
                }
            } catch (e) {
                console.error('Failed to load bank details:', e)
            } finally {
                setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    // Use uploaded QR code image if available, otherwise fallback to default
    const qrImageSrc = bankData.qrCodeImageUrl || qrCode

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-lg mt-2">
                <div className="text-center text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg mt-2">
            <h3 className="font-bold text-xl mb-3 text-gray-800 text-center">Direct Bank Transfer</h3>
            {qrImageSrc && (
                <div className="flex flex-col items-center mb-2">
                    <div className="bg-white p-1 rounded shadow">
                        <img src={qrImageSrc} alt="Donation QR Code" className="w-28 h-28" />
                    </div>
                    <p className="text-xs font-semibold mt-1 text-gray-700">Scan to Donate</p>
                </div>
            )}
            <dl className="space-y-1 text-xs text-gray-700">
                {bankData.bankName && (
                    <div className="flex justify-between">
                        <dt className="font-semibold">Bank:</dt>
                        <dd className="font-mono font-bold text-sm">{bankData.bankName}</dd>
                    </div>
                )}
                {bankData.bankAccountName && (
                    <div className="flex justify-between">
                        <dt className="font-semibold">A/C Holder:</dt>
                        <dd className="font-mono font-bold text-sm">{bankData.bankAccountName}</dd>
                    </div>
                )}
                {bankData.bankAccountNumber && (
                    <div className="flex justify-between">
                        <dt className="font-semibold">A/C No:</dt>
                        <dd className="font-mono font-bold text-sm">{bankData.bankAccountNumber}</dd>
                    </div>
                )}
                {bankData.bankIfsc && (
                    <div className="flex justify-between">
                        <dt className="font-semibold">IFSC:</dt>
                        <dd className="font-mono font-bold text-sm">{bankData.bankIfsc}</dd>
                    </div>
                )}
                {bankData.accountType && (
                    <div className="flex justify-between">
                        <dt className="font-semibold">A/C Type:</dt>
                        <dd className="font-mono font-bold text-sm">{bankData.accountType}</dd>
                    </div>
                )}
                {bankData.bankBranch && (
                    <div className="flex justify-between">
                        <dt className="font-semibold">Branch:</dt>
                        <dd className="font-mono font-bold text-sm">{bankData.bankBranch}</dd>
                    </div>
                )}
                {(bankData.qrUpiId || bankData.phonepeGpay) && (
                    <div className="mt-2 pt-2 border-t">
                        {bankData.qrUpiId && (
                            <div className="flex justify-between">
                                <dt className="font-semibold">UPI ID:</dt>
                                <dd className="font-mono font-bold text-sm">{bankData.qrUpiId}</dd>
                            </div>
                        )}
                        {bankData.phonepeGpay && (
                            <div className="flex justify-between">
                                <dt className="font-semibold">Phonepe/Gpay:</dt>
                                <dd className="font-mono font-bold text-sm">{bankData.phonepeGpay}</dd>
                            </div>
                        )}
                    </div>
                )}
            </dl>
        </div>
    )
}

export default AccountDetails