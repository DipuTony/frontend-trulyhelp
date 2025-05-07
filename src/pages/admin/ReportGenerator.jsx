"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { generateReport } from "../../store/slices/donationSlice"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const ReportGenerator = () => {
  const dispatch = useDispatch()
  const { report, loading, error } = useSelector((state) => state.donations)
  const [reportType, setReportType] = useState("10BD")

  const handleGenerateReport = () => {
    dispatch(generateReport(reportType))
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

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Report Generator</h1>
          <p className="mt-2 text-sm text-gray-700">Generate and download donation reports.</p>
        </div>
      </div>
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Report Options</h3>
            <p className="mt-1 text-sm text-gray-500">Select the type of report you want to generate.</p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="report-type" className="block text-sm font-medium text-gray-700">
                  Report Type
                </label>
                <select
                  id="report-type"
                  name="report-type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="10BD">10BD Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="quarterly">Quarterly Report</option>
                  <option value="annual">Annual Report</option>
                </select>
              </div>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {report && (
        <div className="mt-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6" id="report-content">
            <div className="border-b border-gray-200 pb-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">{reportType} Report</h3>
              <p className="mt-2 max-w-4xl text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900">Summary</h4>
              <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total Donations</dt>
                  <dd className="mt-1 text-sm text-gray-900">{report.totalDonations}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900">${report.totalAmount?.toFixed(2)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Average Donation</dt>
                  <dd className="mt-1 text-sm text-gray-900">${report.averageDonation?.toFixed(2)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Period</dt>
                  <dd className="mt-1 text-sm text-gray-900">{report.period}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900">Donation Details</h4>
              <div className="mt-2 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Donor
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {report.donations?.map((donation) => (
                            <tr key={donation.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                                <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">${donation.amount?.toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(donation.date).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    donation.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {donation.verified ? "Verified" : "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i className="fas fa-download mr-2"></i>
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportGenerator
