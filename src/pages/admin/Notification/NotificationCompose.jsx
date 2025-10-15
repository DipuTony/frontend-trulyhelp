import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { showSuccessToast, showErrorToast } from '../../../utils/toast'

const CHANNELS = [
  { key: 'email', label: 'Email' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'sms', label: 'SMS' },
]

const NotificationCompose = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const recipients = state?.recipients || []

  const [channel, setChannel] = useState('email')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const smsChars = message.length
  const smsLimit = 160

  const isValid = useMemo(() => {
    if (channel === 'email') return subject.trim().length > 0 && message.trim().length > 0
    if (channel === 'sms') return message.trim().length > 0 && smsChars <= smsLimit
    return message.trim().length > 0
  }, [channel, subject, message, smsChars])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!recipients || recipients.length === 0) {
      showErrorToast('Please select at least one recipient.')
      return
    }
    if (!isValid) {
      showErrorToast('Please fill the required fields.')
      return
    }
    // Placeholder: integrate API call later
    // payload shape kept simple and consistent
    const payload = {
      channel,
      subject: channel === 'email' ? subject.trim() : undefined,
      message: message.trim(),
      recipientIds: recipients.map((r) => r.id),
    }
    // eslint-disable-next-line no-console
    console.log('compose submit', payload)
    showSuccessToast('Notification ready to send (stub).')
    navigate('/admin/notifications')
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Compose Notification</h1>
          <p className="mt-2 text-sm text-gray-700">Choose one channel and compose your message.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <span className="font-medium">Recipients:</span> {recipients.length}
        {recipients.length > 0 && (
          <span className="ml-2 text-gray-400">(showing first 3)</span>
        )}
        {recipients.length > 0 && (
          <ul className="mt-1 list-disc list-inside text-gray-500">
            {recipients.slice(0, 3).map((r) => (
              <li key={r.id}>{r.name} — {r.email}</li>
            ))}
            {recipients.length > 3 && (
              <li>+{recipients.length - 3} more</li>
            )}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Channel</label>
          <div className="mt-2 flex space-x-4">
            {CHANNELS.map((c) => (
              <label key={c.key} className="inline-flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="channel"
                  value={c.key}
                  checked={channel === c.key}
                  onChange={() => setChannel(c.key)}
                  className="h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        {channel === 'email' && (
          <div className="sm:col-span-4">
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter subject"
            />
          </div>
        )}

        <div className={channel === 'email' ? 'sm:col-span-6' : 'sm:col-span-4'}>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            rows={channel === 'sms' ? 3 : 5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={channel === 'whatsapp' ? 'Write WhatsApp message' : channel === 'sms' ? 'Write SMS (max 160 chars)' : 'Write email content'}
          />
          {channel === 'sms' && (
            <div className="mt-1 text-xs text-gray-500">{smsChars}/{smsLimit} characters</div>
          )}
        </div>

        <div className="sm:col-span-6">
          <button
            type="submit"
            disabled={!isValid || recipients.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default NotificationCompose