"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { generateReport } from "../../store/slices/donationSlice"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import axiosInstance from "../../utils/axiosInterceptor"
import * as XLSX from "xlsx"




const paymentMethods = [
  "CASH", "CHEQUE", "DD", "NEFT", "RTGS", "IMPS", "SWIFT", "UPI", "GPAY", "PHONEPE", "QR", "OTHER", "ONLINE"
]
const paymentStatuses = [
  "PENDING", "PROCESSING", "COMPLETED", "FAILED", "REFUNDED"
]
const donationTypes = ["Individual", "Organization"]
const donorTypes = ["indian", "Foreign"]

const ReportGenerator = () => {
  const dispatch = useDispatch()
  const { report, loading: reduxLoading, error } = useSelector((state) => state.donations)
  const [reportType, setReportType] = useState("10BD")
  const [causes, setCauses] = useState([])
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    cause: "",
    paymentMethod: "",
    paymentStatus: "",
    donationType: "",
    donorType: ""
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch causes for dropdown
    axiosInstance.get("/donation-options/").then(res => {
      if (res.data && res.data.data) {
        const causeList = Object.values(res.data.data).map(c => ({
          value: c.displayName,
          label: c.displayName
        }))
        setCauses(causeList)
      }
    })
  }, [])

  const reportTypes = [
    { value: "10BD", label: "10BD Report" },
    { value: "monthly", label: "Monthly Report" },
    { value: "quarterly", label: "Quarterly Report" },
    { value: "yearly", label: "Annual Report" },
    { value: "custom", label: "Custom Date Range" }
  ]

  const handleGenerate10DBReport = async () => {
    //donwad the csv file from the server
    const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/report/from10DB`)
    const csv = response.data
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "10BD-report.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleGenerateReport = async () => {
    setLoading(true)
    // Build query params from filters
    let params = {}
    if (reportType !== "custom") params.type = reportType
    if (reportType === "custom" || reportType === "monthly" || reportType === "quarterly" || reportType === "yearly") {
      if (filters.startDate) params.startDate = filters.startDate
      if (filters.endDate) params.endDate = filters.endDate
    }
    if (filters.cause) params.cause = filters.cause
    if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus
    if (filters.donationType) params.donationType = filters.donationType
    if (filters.donorType) params.donorType = filters.donorType

    // Call backend directly (bypassing redux for now)
    try {
      const response = await axiosInstance.get(`/report/generate`, { params })
      if (response.data && response.data.data) {
        dispatch({ type: "donations/generateReport/fulfilled", payload: response.data.data })
      }
    } catch (err) {
      dispatch({ type: "donations/generateReport/rejected", payload: err.message })
    }
    setLoading(false)
  }

  const handleDownloadPDF = () => {
    const reportElement = document.getElementById("report-content")

    html2canvas(reportElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${reportType}-report.pdf`)
    })
  }

  const handleDownloadExcel = () => {
    if (!report || !report.donations || report.donations.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(report.donations.map(d => ({
      "Donation ID": d.donationId,
      "Donor Name": d.donorName,
      "Donor Email": d.donorEmail,
      "Donor Phone": d.donorPhone,
      "Amount": d.amount,
      "Date": new Date(d.date).toLocaleString(),
      "Payment Method": d.method,
      "Payment Status": d.paymentStatus,
      "Donation Type": d.donationType,
      "Donor Type": d.donorType,
      "Cause": d.cause,
      "City": d.city,
      "State": d.state,
      "Country": d.country,
      "Transaction ID": d.transactionId,
      "Volunteer Name": d.volunteerName,
      "Volunteer Email": d.volunteerEmail,
      "Receipt": d.receiptPath ? `${window.location.origin}/${d.receiptPath}` : ""
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${reportType}-report.xlsx`);
  }

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value)
    if (e.target.value === "10BD") {
      // Clear report data when switching to 10BD
      dispatch({ type: "donations/generateReport/fulfilled", payload: null })
    }
  }

  // Calculate auto date range for monthly, quarterly, yearly
  const getAutoDateRange = () => {
    const now = new Date();
    let startDate = "";
    let endDate = "";
    if (reportType === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
    } else if (reportType === "quarterly") {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1).toISOString().slice(0, 10);
      endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0).toISOString().slice(0, 10);
    } else if (reportType === "yearly") {
      startDate = new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10);
      endDate = new Date(now.getFullYear(), 11, 31).toISOString().slice(0, 10);
    }
    return { startDate, endDate };
  };
  const autoRange = getAutoDateRange();

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Report Generator</h1>
          <p className="mt-2 text-sm text-gray-700">Generate and download donation reports.</p>
        </div>
      </div>
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-1">Report Options</h3>
          <p className="text-sm text-gray-500 mb-4">Select the type of report and filters you want to generate.</p>
          {/* First row: Report Type, Start Date, End Date, Cause */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="report-type" className="block text-sm font-medium text-gray-700">Report Type</label>
              <select
                id="report-type"
                name="report-type"
                value={reportType}
                onChange={handleReportTypeChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {reportTypes?.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>)
                )}
              </select>
            </div>
            {/* Start Date field */}
            {reportType !== "10BD" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                {reportType === "custom" ? (
                  <input type="date" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={filters.startDate} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} />
                ) : (
                  <input type="date" className="mt-1 block w-full py-2 px-3 border border-gray-200 bg-gray-100 rounded-md shadow-sm sm:text-sm" value={autoRange.startDate} disabled />
                )}
              </div>
            )}
            {/* End Date field */}
            {reportType !== "10BD" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                {reportType === "custom" ? (
                  <input
                    type="date"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={filters.endDate}
                    onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
                  />
                ) : (
                  <input
                    type="date"
                    className="mt-1 block w-full py-2 px-3 border border-gray-200 bg-gray-100 rounded-md shadow-sm sm:text-sm"
                    value={autoRange.endDate}
                    disabled
                  />
                )}
               
              </div>
            )}
            {reportType !== "10BD" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Cause</label>
                <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={filters.cause} onChange={e => setFilters(f => ({ ...f, cause: e.target.value }))}>
                  <option value="">All</option>
                  {causes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            )}
          </div>
          {/* Second row: Payment Method, Payment Status, Donation Type, Donor Type */}
          {reportType !== "10BD" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={filters.paymentMethod} onChange={e => setFilters(f => ({ ...f, paymentMethod: e.target.value }))}>
                  <option value="">All</option>
                  {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={filters.paymentStatus} onChange={e => setFilters(f => ({ ...f, paymentStatus: e.target.value }))}>
                  <option value="">All</option>
                  {paymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Donation Type</label>
                <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={filters.donationType} onChange={e => setFilters(f => ({ ...f, donationType: e.target.value }))}>
                  <option value="">All</option>
                  {donationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Donor Type</label>
                <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={filters.donorType} onChange={e => setFilters(f => ({ ...f, donorType: e.target.value }))}>
                  <option value="">All</option>
                  {donorTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}
          <div className="mt-1">
             {/* Show auto date range message below End Date for auto types */}
             {(reportType === "monthly" || reportType === "quarterly" || reportType === "yearly") && (
                  <span className="block text-xs text-gray-500 mt-1 mb-2 ">
                    Note : Date range is set automatically for this report type.
                  </span>
                )}
            {/* Show auto date range message below End Date for auto types */}
            {reportType === "10BD" ?
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleGenerate10DBReport}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >Download {reportType}</button>
              </div>

              :

              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Generating...
                  </>
                ) : <span className="capitalize">Generate {reportType} Report</span>}
              </button>
            }
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Report display section */}
      {reportType !== "10BD" && report && (
        <div className="mt-6">
          {/* No data found message */}
          {report.donations && report.donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0 0v4m0-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z" />
              </svg>
              <span className="text-lg text-gray-500 font-semibold">No data found for the selected filter.</span>
              <span className="text-sm text-gray-400">Change filter to see the data.</span>
            </div>
          ) : (
            <>
              <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6" id="report-content">
                <div className="border-b border-gray-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="text-lg leading-6 text-gray-700 capitalize font-semibold">{reportType} Report</h3>
                    <p className="mt-1 text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <i className="fas fa-download mr-2"></i>
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadExcel}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <i className="fas fa-file-excel mr-2"></i>
                      Download Excel
                    </button>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                    <span className="text-xs text-gray-500">Total Donations</span>
                    <span className="text-xl font-bold text-indigo-700">{report.totalDonations}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                    <span className="text-xs text-gray-500">Total Amount</span>
                    <span className="text-xl font-bold text-green-700">₹{report.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                    <span className="text-xs text-gray-500">Average Donation</span>
                    <span className="text-xl font-bold text-blue-700">₹{report.averageDonation?.toFixed(2)}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                    <span className="text-xs text-gray-500">Period</span>
                    <span className="text-base font-semibold text-gray-700">{report.period}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Donation Details</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs md:text-sm divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Donation ID</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Txn ID</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Donor</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Email</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Phone</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Amount</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Date/Time</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Method</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Status</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Type</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Donor Type</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Cause</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">City</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">State</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Country</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-600">Volunteer Name</th>
                          {/* <th className="px-2 py-2 text-left font-semibold text-gray-600">Receipt</th> */}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {report.donations?.map((donation) => (
                          <tr key={donation.id} className="hover:bg-gray-50">
                            <td className="px-2 py-2 whitespace-nowrap font-mono text-xs">{donation.transactionId || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap font-mono text-xs text-gray-700">{donation.donationId || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.donorName || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.donorEmail || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.donorPhone || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap font-semibold text-green-700">₹{typeof donation.amount === 'number' ? donation.amount.toFixed(2) : '0.00'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.date ? new Date(donation.date).toLocaleString() : '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">{donation.method || '-'}</span>
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              <span className={`inline-block px-2 py-1 rounded font-semibold border ${donation.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>{donation.paymentStatus || '-'}</span>
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.donationType || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.donorType || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.cause || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.city || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.state || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.country || '-'}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{donation.volunteerName || '-'}</td>
                            {/* <td className="px-2 py-2 whitespace-nowrap">
                              {donation.receiptPath ? (
                                <a href={donation.receiptPath} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Download</a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Only show Download PDF/Excel if there is data */}
              {report.donations && report.donations.length > 0 && (
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadExcel}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <i className="fas fa-file-excel mr-2"></i>
                    Download Excel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ReportGenerator
