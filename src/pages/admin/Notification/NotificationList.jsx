import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = [
  { key: 'current', label: 'Current' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'past', label: 'Past' },
]

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Monthly Update',
    type: 'email',
    status: 'past',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 2,
    title: 'Volunteer Meetup Reminder',
    type: 'whatsapp',
    status: 'current',
    sentAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Festival Drive Announcement',
    type: 'sms',
    status: 'scheduled',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
  },
]

const NotificationList = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('current')

  const filtered = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter((n) => n.status === activeTab)
  }, [activeTab])

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="mt-2 text-sm text-gray-700">View past, current, and scheduled notifications.</p>
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-3 shadow-sm">
            <p className="text-sm text-red-700">This feature coming soon</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => navigate('/admin/notifications/select')}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Send Notification
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4 bg-white shadow sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <li className="px-4 py-6">
                <p className="text-sm text-gray-500 italic">No notifications found.</p>
              </li>
            ) : (
              filtered.map((n) => (
                <li key={n.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{n.title}</p>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        n.type === 'email'
                          ? 'bg-blue-100 text-blue-800'
                          : n.type === 'whatsapp'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {n.type}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {n.status === 'scheduled' && n.scheduledAt && (
                      <span>Scheduled for {new Date(n.scheduledAt).toLocaleString()}</span>
                    )}
                    {n.status !== 'scheduled' && n.sentAt && (
                      <span>{n.status === 'past' ? 'Sent' : 'Sending'} on {new Date(n.sentAt).toLocaleString()}</span>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NotificationList