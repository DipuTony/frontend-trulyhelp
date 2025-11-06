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

            // Function to convert image to data URL
            const imageToDataURL = (src) => {
                return new Promise((resolve) => {
                    // If already a data URL, return as is
                    if (src.startsWith('data:')) {
                        resolve(src);
                        return;
                    }

                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    
                    img.onload = () => {
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.naturalWidth || img.width;
                            canvas.height = img.naturalHeight || img.height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);
                            const dataURL = canvas.toDataURL('image/png');
                            resolve(dataURL);
                        } catch (err) {
                            console.warn('Canvas conversion failed:', err);
                            // If conversion fails, try to use original src
                            resolve(src);
                        }
                    };
                    
                    img.onerror = () => {
                        console.warn('Failed to load image:', src);
                        resolve(src); // Fallback to original src
                    };
                    
                    img.src = src;
                });
            };

            // Get all images and convert them to data URLs
            const images = cardContainerRef.current.getElementsByTagName('img');
            const imageMap = new Map();
            
            // Convert all images to data URLs
            const conversionPromises = Array.from(images).map(async (img, index) => {
                if (!img.src && !img.currentSrc) return;
                
                // Get both src attribute and currentSrc for better matching
                const srcAttr = img.getAttribute('src') || img.src;
                const originalSrc = img.currentSrc || img.src;
                
                console.log(`Processing image ${index}:`, { srcAttr, originalSrc });
                
                // Wait for image to load if not already loaded
                if (!img.complete || img.naturalHeight === 0) {
                    await new Promise((resolve) => {
                        if (img.complete && img.naturalHeight > 0) {
                            resolve();
                        } else {
                            const timeout = setTimeout(resolve, 5000);
                            img.onload = () => {
                                clearTimeout(timeout);
                                resolve();
                            };
                            img.onerror = () => {
                                clearTimeout(timeout);
                                resolve();
                            };
                        }
                    });
                }
                
                // Only convert if image loaded successfully
                if (img.complete && img.naturalHeight > 0) {
                    // Convert to data URL
                    const dataURL = await imageToDataURL(originalSrc);
                    // Store both src attribute and currentSrc for matching
                    imageMap.set(originalSrc, dataURL);
                    if (srcAttr && srcAttr !== originalSrc) {
                        imageMap.set(srcAttr, dataURL);
                    }
                    console.log(`Converted image ${index}:`, originalSrc, 'to data URL');
                } else {
                    console.warn(`Image ${index} not loaded:`, originalSrc);
                    imageMap.set(originalSrc, originalSrc); // Keep original
                    if (srcAttr && srcAttr !== originalSrc) {
                        imageMap.set(srcAttr, originalSrc);
                    }
                }
            });

            await Promise.all(conversionPromises);
            
            console.log('Image conversion complete. Total images:', imageMap.size);
            
            // Wait a bit more to ensure everything is ready
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create a clone of the container
            const clonedContainer = cardContainerRef.current.cloneNode(true);
            
            // Replace all image sources with data URLs in the clone
            const clonedImages = clonedContainer.getElementsByTagName('img');
            Array.from(clonedImages).forEach(img => {
                const originalSrc = img.currentSrc || img.src;
                if (imageMap.has(originalSrc)) {
                    const dataURL = imageMap.get(originalSrc);
                    img.src = dataURL;
                    img.crossOrigin = 'anonymous';
                    img.style.display = 'block';
                    img.style.opacity = '1';
                    img.style.visibility = 'visible';
                    console.log('Replaced image src:', originalSrc, 'with data URL');
                } else {
                    // Try to find by src attribute if currentSrc doesn't match
                    const srcAttr = img.getAttribute('src');
                    if (srcAttr && imageMap.has(srcAttr)) {
                        img.src = imageMap.get(srcAttr);
                        img.crossOrigin = 'anonymous';
                        img.style.display = 'block';
                        img.style.opacity = '1';
                        img.style.visibility = 'visible';
                        console.log('Replaced image src by attribute:', srcAttr);
                    }
                }
            });

            // Create temporary container
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0px';
            tempContainer.style.width = cardContainerRef.current.offsetWidth + 'px';
            tempContainer.style.backgroundColor = '#f3f4f6';
            tempContainer.style.padding = '24px';
            tempContainer.appendChild(clonedContainer);
            document.body.appendChild(tempContainer);

            // Wait for clone to render
            await new Promise(resolve => setTimeout(resolve, 500));

            // Capture the cloned container
            const canvas = await html2canvas(clonedContainer, {
                scale: 2,
                backgroundColor: '#f3f4f6',
                logging: false,
                useCORS: true,
                allowTaint: false, // Use false since we're using data URLs
                imageTimeout: 30000,
                onclone: (clonedDoc) => {
                    // Ensure all images are visible
                    const finalImages = clonedDoc.getElementsByTagName('img');
                    Array.from(finalImages).forEach(img => {
                        img.style.display = 'block';
                        img.style.opacity = '1';
                        img.style.visibility = 'visible';
                        img.crossOrigin = 'anonymous';
                    });
                }
            });

            // Remove temporary container
            document.body.removeChild(tempContainer);

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (!blob) {
                    toast.dismiss(loadingToast);
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
