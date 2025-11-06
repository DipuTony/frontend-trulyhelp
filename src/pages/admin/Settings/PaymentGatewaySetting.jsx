import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosInterceptor'

const PaymentGatewaySetting = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [values, setValues] = useState({
    easebuzzKey: '',
    easebuzzSalt: '',
    easebuzzEnv: 'test',
    easebuzzWebhookUrl: '',
    easebuzzWebhookPassKey: '',
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await axiosInstance.get('/organization/payment-gateway')
        if (mounted && data?.status && data?.data) {
          const {
            easebuzzKey = '', 
            easebuzzSalt = '', 
            easebuzzEnv = 'test',
            easebuzzWebhookUrl = '',
            easebuzzWebhookPassKey = ''
          } = data.data || {}
          setValues({ easebuzzKey, easebuzzSalt, easebuzzEnv, easebuzzWebhookUrl, easebuzzWebhookPassKey })
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

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      // Validate required fields
      if (!values.easebuzzKey || !values.easebuzzSalt) {
        setError('Easebuzz Key and Salt are required')
        setLoading(false)
        return
      }

      const payload = { ...values }
      const { data } = await axiosInstance.put('/organization/payment-gateway', payload)
      if (data?.status) {
        setSuccess('Payment gateway settings saved successfully')
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

      <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <i className="fas fa-lock text-yellow-500 text-xl"></i>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800 mb-1">
              Secure Storage
            </h3>
            <p className="text-sm text-yellow-700">
              Your payment gateway credentials are encrypted and stored securely in the database. 
              Only administrators can view and update these settings.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">Easebuzz Payment Gateway Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merchant Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="easebuzzKey"
                value={values.easebuzzKey}
                onChange={onChange}
                placeholder="Enter your Easebuzz Merchant Key"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Your Easebuzz merchant key (encrypted in database)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salt <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="easebuzzSalt"
                value={values.easebuzzSalt}
                onChange={onChange}
                placeholder="Enter your Easebuzz Salt"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Your Easebuzz salt value (encrypted in database)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Environment <span className="text-red-500">*</span>
              </label>
              <select
                name="easebuzzEnv"
                value={values.easebuzzEnv}
                onChange={onChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              >
                <option value="test">Test Environment</option>
                <option value="prod">Production Environment</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select 'Test' for testing or 'Production' for live transactions
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">Webhook Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL (Read-only)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="easebuzzWebhookUrl"
                  value={values.easebuzzWebhookUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-gray-600 border-gray-300 cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(values.easebuzzWebhookUrl)
                    setSuccess('Webhook URL copied to clipboard!')
                    setTimeout(() => setSuccess(''), 2000)
                  }}
                  disabled={!values.easebuzzWebhookUrl}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy webhook URL"
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Copy this URL and configure it in your Easebuzz Merchant Dashboard → Account Settings → Webhooks → Transaction Webhook
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook Pass Key / Secret
              </label>
              <input
                type="text"
                name="easebuzzWebhookPassKey"
                value={values.easebuzzWebhookPassKey}
                onChange={onChange}
                placeholder="Enter webhook pass key/secret (if provided by Easebuzz)"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Webhook pass key/secret for verifying webhook requests from Easebuzz (encrypted in database)
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle text-blue-500"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Important:</strong> After saving these settings, log in to your Easebuzz Merchant Dashboard and configure the webhook URL shown above in the Webhooks section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded bg-indigo-600 text-white disabled:opacity-60 hover:bg-indigo-700"
          >
            {loading ? 'Saving...' : 'Save Payment Gateway Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentGatewaySetting
