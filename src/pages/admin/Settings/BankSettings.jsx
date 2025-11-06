import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosInterceptor'

const BankSettings = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [values, setValues] = useState({
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
      setLoading(true)
      setError('')
      try {
        const { data } = await axiosInstance.get('/organization')
        if (mounted && data?.status && data?.data) {
          const {
            bankName = '', bankAccountName = '', bankAccountNumber = '',
            bankIfsc = '', bankBranch = '', accountType = '', qrUpiId = '', phonepeGpay = '', qrCodeImageUrl = ''
          } = data.data || {}
          setValues({ bankName, bankAccountName, bankAccountNumber, bankIfsc, bankBranch, accountType, qrUpiId, phonepeGpay, qrCodeImageUrl })
          if (qrCodeImageUrl) {
            setPreviewImage(qrCodeImageUrl)
          }
        }
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB')
        return
      }

      setSelectedFile(file)
      setError('')
      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewImage(objectUrl)
    } else {
      setSelectedFile(null)
      setPreviewImage(values.qrCodeImageUrl || null)
    }
  }

  const handleClearImage = () => {
    setSelectedFile(null)
    setPreviewImage(values.qrCodeImageUrl || null)
    const fileInput = document.getElementById('qrCodeImage')
    if (fileInput) fileInput.value = ''
  }

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image file')
      return
    }

    setUploadingImage(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('qrCodeImage', selectedFile)

      const { data } = await axiosInstance.post('/organization/upload-qr-code', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (data?.status) {
        setSuccess('QR code image uploaded successfully')
        setValues((prev) => ({ ...prev, qrCodeImageUrl: data.data.qrCodeImageUrl }))
        setPreviewImage(data.data.qrCodeImageUrl)
        setSelectedFile(null)
        // Clear the file input
        const fileInput = document.getElementById('qrCodeImage')
        if (fileInput) fileInput.value = ''
        setTimeout(() => setSuccess(''), 2500)
      } else {
        setError(data?.message || 'Failed to upload image')
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const payload = { ...values }
      const { data } = await axiosInstance.put('/organization', payload)
      if (data?.status) {
        setSuccess('Bank settings saved')
        setTimeout(() => setSuccess(''), 2500)
      } else {
        setError(data?.message || 'Failed to save')
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-2">
      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700">{error}</div>}
      {success && <div className="mb-4 p-3 rounded bg-green-50 text-green-700">{success}</div>}

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">Bank (offline donations)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={values.bankName}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                name="bankAccountName"
                value={values.bankAccountName}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={values.bankAccountNumber}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC</label>
              <input
                type="text"
                name="bankIfsc"
                value={values.bankIfsc}
                onChange={onChange}
                placeholder="e.g. HDFC0001234"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input
                type="text"
                name="bankBranch"
                value={values.bankBranch}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">A/C Type</label>
              <input
                type="text"
                name="accountType"
                value={values.accountType}
                onChange={onChange}
                placeholder="e.g. CURRENT, SAVINGS"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QR / UPI ID</label>
              <input
                type="text"
                name="qrUpiId"
                value={values.qrUpiId}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phonepe/Gpay</label>
              <input
                type="text"
                name="phonepeGpay"
                value={values.phonepeGpay}
                onChange={onChange}
                placeholder="e.g. 9499159319"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">QR Code Image</h2>
          <div className="space-y-4">
            {previewImage && (
              <div className="flex flex-col items-center">
                <div className="bg-white p-2 rounded shadow border">
                  <img 
                    src={previewImage} 
                    alt="QR Code Preview" 
                    className="w-32 h-32 object-contain"
                  />
                </div>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload QR Code Image
              </label>
              <input
                id="qrCodeImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Max size: 2MB (JPG, PNG, GIF)</p>
            </div>
            {selectedFile && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                  className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60 hover:bg-indigo-700"
                >
                  {uploadingImage ? 'Uploading...' : 'Upload QR Code Image'}
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Bank Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BankSettings


