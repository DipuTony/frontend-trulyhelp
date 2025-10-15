import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { showSuccessToast, showErrorToast } from '../../../utils/toast'

const CHANNELS = [
  { key: 'email', label: 'Email', icon: '📧' },
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { key: 'sms', label: 'SMS', icon: '📱' },
]

const TEMPLATES = {
  whatsapp: [
    { key: 'thanks', label: 'Thank You', body: 'Dear {name}, thank you for your generous support to TrulyHelp.' },
    { key: 'reminder', label: 'Payment Reminder', body: 'Hello {name}, this is a friendly reminder about your pending donation.' },
  ],
  sms: [
    { key: 'thanks', label: 'Thank You', body: 'Thank you for supporting TrulyHelp!' },
    { key: 'update', label: 'Project Update', body: 'TrulyHelp update: Your support is making a difference.' },
  ],
}

const NotificationCompose = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const recipients = state?.recipients || []
  const preserve = state?.preserve

  const [channel, setChannel] = useState('email')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sendType, setSendType] = useState('now')
  const [scheduledAt, setScheduledAt] = useState('')
  const [templateKey, setTemplateKey] = useState('')

  const smsChars = message.length
  const smsLimit = 160

  const isValid = useMemo(() => {
    const baseValid = (() => {
      if (channel === 'email') return subject.trim() && message.trim()
      if (channel === 'sms') return message.trim() && smsChars <= smsLimit
      return message.trim()
    })()
    const scheduleValid = sendType === 'now' || (scheduledAt && new Date(scheduledAt) > new Date())
    return baseValid && scheduleValid
  }, [channel, subject, message, smsChars, sendType, scheduledAt])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!recipients.length) return showErrorToast('Please select recipients.')
    if (!isValid) return showErrorToast('Please fill required fields.')

    const payload = {
      channel,
      subject: channel === 'email' ? subject.trim() : undefined,
      message: message.trim(),
      recipientIds: recipients.map((r) => r.id),
      sendType,
      scheduledAt: sendType === 'later' ? new Date(scheduledAt).toISOString() : undefined,
    }
    console.log('compose submit', payload)
    showSuccessToast('Notification ready to send (stub).')
    navigate('/admin/notifications')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compose Notification</h1>
          <p className="mt-1 text-sm text-gray-500">Create and send notifications to your recipients</p>
        </div>
        <button
          onClick={() => navigate('/admin/notifications/select', { state: { preserve } })}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Recipients Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👥</span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{recipients.length} Recipients Selected</p>
            {recipients.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {recipients.slice(0, 2).map(r => r.name).join(', ')}
                {recipients.length > 2 && ` +${recipients.length - 2} more`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Channel Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Select Channel <span className="text-red-600">*</span></label>
          <p className="text-xs text-gray-500 mb-3">Choose one channel to send this notification.</p>
          <div className="grid grid-cols-3 gap-3">
            {CHANNELS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setChannel(c.key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  channel === c.key
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{c.icon}</div>
                <div className={`text-sm font-medium ${channel === c.key ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {c.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Subject (Email only) */}
        {channel === 'email' && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Subject <span className="text-red-600">*</span></label>
            <p className="text-xs text-gray-500 mb-2">Required for email notifications.</p>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            />
          </div>
        )}

        {(channel === 'whatsapp' || channel === 'sms') && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Template</label>
            <p className="text-xs text-gray-500 mb-2">Optional: select a predefined template. You can edit the message after selecting.</p>
            <select
              value={templateKey}
              onChange={(e) => {
                const key = e.target.value
                setTemplateKey(key)
                const list = TEMPLATES[channel] || []
                const selected = list.find((t) => t.key === key)
                if (selected) setMessage(selected.body)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            >
              <option value="">Select a template...</option>
              {(TEMPLATES[channel] || []).map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Message <span className="text-red-600">*</span></label>
          <p className="text-xs text-gray-500 mb-2">Write the content that will be sent to recipients. Keep it concise and clear.</p>
          <textarea
            rows={channel === 'sms' ? 3 : 6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Write your ${channel} message here...`}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-none"
          />
          {channel === 'sms' && (
            <p className={`text-xs mt-1 ${smsChars > smsLimit ? 'text-red-600' : 'text-gray-500'}`}>
              {smsChars}/{smsLimit} characters
            </p>
          )}
        </div>

        {/* Delivery Options */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Delivery Time</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="sendType"
                value="now"
                checked={sendType === 'now'}
                onChange={() => setSendType('now')}
                className="w-4 h-4 text-indigo-600"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Send Immediately</div>
                <div className="text-xs text-gray-500">Notification will be sent right away</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="sendType"
                value="later"
                checked={sendType === 'later'}
                onChange={() => setSendType('later')}
                className="w-4 h-4 text-indigo-600"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Schedule for Later</div>
                <div className="text-xs text-gray-500 mb-2">Choose a date and time</div>
                {sendType === 'later' && (
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  />
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={!isValid || !recipients.length}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sendType === 'now' ? '📤 Send Now' : '⏰ Schedule Notification'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/notifications')}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/notifications/select', { state: { preserve } })}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  )
}

export default NotificationCompose