import React, { useState } from 'react'
import axiosInstance from '../../../utils/axiosInterceptor'

const DownloadDatabase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [format, setFormat] = useState('json') // 'json' or 'mysql'

  const handleDownload = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axiosInstance.get('/database/export', {
        params: { format },
        responseType: 'blob', // Important for file download
      })

      // Create a blob from the response data
      const mimeType = format === 'mysql' ? 'application/sql' : 'application/json'
      const fileExtension = format === 'mysql' ? 'sql' : 'json'
      const blob = new Blob([response.data], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // Generate filename with current date
      const today = new Date().toISOString().split('T')[0]
      link.setAttribute('download', `database-export-${today}.${fileExtension}`)

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSuccess(`Database exported successfully as ${format.toUpperCase()}!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Download error:', err)
      
      // Try to parse error message from blob response if needed
      let errorMessage = 'Failed to export database. Please try again.'
      if (err?.response?.data) {
        if (err.response.data instanceof Blob) {
          // If error is a blob, try to read it as text
          try {
            const text = await err.response.data.text()
            const parsed = JSON.parse(text)
            errorMessage = parsed.message || errorMessage
          } catch {
            errorMessage = 'Failed to export database. Please try again.'
          }
        } else if (typeof err.response.data === 'object') {
          errorMessage = err.response.data.message || errorMessage
        }
      } else if (err?.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setTimeout(() => setError(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start mb-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-database text-indigo-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Export Complete Database
            </h2>
            <p className="text-sm text-gray-600">
              Download a complete backup of all database tables. Choose between JSON or MySQL (SQL) format. 
              The export automatically detects all tables in the database, so no code changes are needed when tables are added or removed.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-blue-500 mt-0.5 mr-3"></i>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Important Information
              </h3>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>The export file contains sensitive data - handle with care</li>
                <li>Only administrators can access this feature</li>
                <li>All tables are automatically detected - no code changes needed</li>
                <li>JSON format: Easy to parse and view, includes all data</li>
                <li>MySQL format: Standard SQL dump, can be imported directly</li>
                <li>Large databases may take a few moments to export</li>
                <li>Both formats work without external tools - pure Node.js implementation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={format === 'json'}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">
                  <i className="fas fa-file-code mr-1"></i>
                  JSON
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="mysql"
                  checked={format === 'mysql'}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">
                  <i className="fas fa-database mr-1"></i>
                  MySQL (SQL)
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <i className="fas fa-shield-alt text-gray-400 mr-2"></i>
              <span>Admin Only Access</span>
            </div>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-download"></i>
                  <span>Download Database ({format.toUpperCase()})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadDatabase