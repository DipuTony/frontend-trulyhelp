import React, { useEffect, useRef, useState } from "react";
import { FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { formatDateFull } from "../../components/common/DateFormatFunctions";
import { useDispatch, useSelector } from "react-redux";
import { fetchICard } from "../../store/slices/volunteerSlice";
import axiosInstance from '../../utils/axiosInterceptor';
import Logo1 from '../../images/Logo1.png';

export default function IDCard({ cardData, adminSelectedCard }) {
    const cardContainerRef = useRef(null);
    const [fetchedData, setFetchedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userId = adminSelectedCard?.userId;

    console.log("cardData, userId",cardData, userId)

    useEffect(() => {
        // Only fetch if cardData is not provided
        if (!cardData) {
            const fetchICardData = async () => {
                setLoading(true);
                setError(null);
                try {
                    let url = "/user/view-icard";
                    if (userId) {
                        url += `?userId=${userId}`;
                    }
                    const res = await axiosInstance.get(url);
                    const data = res.data;
                    if (data.status) {
                        setFetchedData(data.data);
                    } else {
                        setError(data.message || 'Failed to fetch iCard data');
                    }
                } catch (err) {
                    setError(err.message || 'Failed to fetch iCard data');
                } finally {
                    setLoading(false);
                }
            };
            fetchICardData();
        }
    }, [cardData, userId]);

    const displayData = cardData || fetchedData;
    console.log(displayData);
    if (loading) return <div className="text-center py-10">Loading ID Card...</div>;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
    if (!displayData) return null;

    const handleDownload = async () => {
        if (!cardContainerRef.current) return;

        try {
            const loadingToast = toast.loading('Preparing ID Card for download...');

            // Function to preload an image
            const preloadImage = (src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
                    img.src = src;
                });
            };

            // Preload all images first
            const images = cardContainerRef.current.getElementsByTagName('img');
            const imagePromises = Array.from(images).map(img => {
                if (img.complete && img.naturalHeight !== 0) {
                    return Promise.resolve();
                }
                return preloadImage(img.src);
            });

            // Wait for all images to load
            await Promise.all(imagePromises);

            // Create a temporary container
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '-9999px';
            tempContainer.style.backgroundColor = '#f3f4f6'; // Match the background color
            tempContainer.appendChild(cardContainerRef.current.cloneNode(true));
            document.body.appendChild(tempContainer);

            // Capture the card
            const canvas = await html2canvas(tempContainer.firstChild, {
                scale: 2,
                backgroundColor: '#f3f4f6',
                logging: false,
                useCORS: true,
                allowTaint: true,
                foreignObjectRendering: false,
                imageTimeout: 15000,
                onclone: (clonedDoc) => {
                    const clonedImages = clonedDoc.getElementsByTagName('img');
                    Array.from(clonedImages).forEach(img => {
                        if (img.src) {
                            img.crossOrigin = 'anonymous';
                            img.style.display = 'block';
                            img.style.opacity = '1';
                        }
                    });
                }
            });

            // Remove temporary container
            document.body.removeChild(tempContainer);

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (!blob) {
                    toast.error('Failed to generate image. Please try again.');
                    return;
                }

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `id-card-${displayData?.name || 'card'}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.dismiss(loadingToast);
                toast.success('ID Card downloaded successfully!');
            }, 'image/png', 1.0);
        } catch (error) {
            console.error('Error downloading ID card:', error);
            toast.error(error.message || 'Failed to download ID Card. Please try again.');
        }
    };

    // Use provided data or fallback to static data
    // const logo = displayData?.organization?.logoUrl || Logo1;
    const logo = Logo1;
    const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${displayData?.userId || 'default'}`;
    const orgName = displayData?.organization?.legalName || "Truly Help Org";
    const webSite = displayData?.organization?.website || "trulyhelp.org";
    const orgRegNo = displayData?.organization?.registrationNumber || "N/A";
    const orgPhone = displayData?.organization?.phone || "N/A";
    const orgEmail = displayData?.organization?.email || "info@trulyhelp.org";
    const orgAddress = displayData?.organization?.formattedAddress || displayData?.organization?.address || "Noida, UP";
    const directorName = displayData?.organization?.directorName || "N/A";
    const directorTitle = displayData?.organization?.directorTitle || "(President / Director)";

    return (
        <div className="relative">
            <div ref={cardContainerRef} className="flex flex-wrap justify-center gap-6 p-6 bg-gray-100">
                {/* Front Side */}
                <div className="w-[340px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-300">
                    <div className="bg-red-600 text-white text-center py-1 text-sm font-bold">
                        Registration No: {orgRegNo}
                    </div>
                    <div className="p-4 text-center">
                        <img
                            src={logo}
                            alt="Logo"
                            className="mx-auto h-12 mb-2"
                        />
                        <h2 className="text-xl font-bold text-gray-800">
                            {orgName}
                        </h2>
                        <a
                            href={webSite}
                            className="text-sm text-blue-600"
                        >
                            {webSite}
                        </a>
                        <div className="flex justify-center items-center mt-4 gap-4">
                            <img
                                src={displayData?.profileImageUrl}
                                alt="Profile"
                                className="w-20 h-20 rounded object-cover"
                            />
                            {/* <img
                                src={qrImage}
                                alt="QR Code"
                                className="w-20 h-20"
                            /> */}
                        </div>
                        <p className="text-red-600 font-bold mt-2">{displayData?.name || 'Name'}</p>
                        <p className="text-red-600">{displayData?.role || 'Role'}</p>
                        <div className="text-sm text-left mt-4 space-y-1">
                            <p><strong>ID No:</strong> {displayData?.userId || 'N/A'}</p>
                            <p><strong>Mob No:</strong> {displayData?.phone || 'N/A'}</p>
                            <p><strong>Email:</strong> {displayData?.email || 'N/A'}</p>
                            <p><strong>City:</strong> {displayData?.city || 'N/A'}</p>
                        </div>
                        <div className="mt-4 text-left">
                            <p className="text-xs">{directorName}</p>
                            <p className="text-xs font-semibold">{directorTitle}</p>
                        </div>
                    </div>
                    <div className="bg-gray-800 text-white flex justify-around py-2 text-xs">
                        <div>
                            <p>📞 {orgPhone}</p>
                        </div>
                        <div>
                            <p>✉ {orgEmail}</p>
                        </div>
                        {/* <div>
                            <p>📍 {orgAddress}</p>
                        </div> */}
                    </div>
                </div>

                {/* Back Side */}
                <div className="w-[340px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-300">
                    <div className="bg-red-600 text-white text-center py-1 text-sm font-bold">
                        Registration No: {orgRegNo}
                    </div>
                    <div className="p-4 text-center">
                        <img
                            src={logo}
                            alt="Logo"
                            className="mx-auto h-12 mb-2"
                        />
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {orgName}
                        </h2>
                        <div className="flex justify-center items-center mt-4 gap-4">

                            <img
                                src={qrImage}
                                alt="QR Code"
                                className="w-20 h-20"
                            />
                        </div>
                        <h3 className="text-green-700 font-bold text-lg mb-2 mt-5">TERMS & CONDITIONS</h3>
                        <div className="text-left text-sm space-y-3">
                            <p>
                                <strong>Identification:</strong> Carry the ID card at all times during
                                working hours for identification purposes.
                            </p>
                            <p>
                                <strong>Authorized Use:</strong> The ID card is strictly for official use
                                and should not be shared or used for unauthorized purposes.
                            </p>
                        </div>
                        <div className="mt-6 text-sm font-semibold text-left space-y-1">
                            <p>Joining: {formatDateFull(displayData?.iCardAssignDate) || 'N/A'}</p>
                            <p>Validity: {formatDateFull(displayData?.iCardExpiryDate) || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="bg-gray-800 text-white flex justify-around py-2 text-xs">
                        {/* <div>
                            <p>📞 {orgPhone}</p>
                        </div>
                        <div>
                            <p>✉ {orgEmail}</p>
                        </div> */}
                        <div>
                            <p>📍 {orgAddress}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Single Download Button */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    <FiDownload className="w-5 h-5 mr-2" />
                    Download ID Card
                </button>
            </div>
        </div>
    );
}
