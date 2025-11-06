import React, { useEffect, useState } from 'react'
import PaymentGatewaySetting from './PaymentGatewaySetting'
import OrganizationSettings from './OrganizationSettings'
import BankSettings from './BankSettings'
import SocialSettings from './SocialSettings'
import DownloadDatabase from './DownloadDatabase'

const AdminSettingIndex = () => {
  const [activeTab, setActiveTab] = useState('organization')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const TabButton = ({ id, label }) => (
    <button
      type="button"
      onClick={() => {
        if (isLoading) return
        setActiveTab(id)
        setIsLoading(true)
        const t = setTimeout(() => setIsLoading(false), 400)
        // best-effort cleanup; button unmounts on tab switch but safe
        return () => clearTimeout(t)
      }}
      disabled={isLoading}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 focus:outline-none transition-colors
        ${activeTab === id
          ? 'border-indigo-600 text-indigo-700'
          : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'}
        ${isLoading ? ' opacity-60 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Settings</h1>

      <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <i className="fas fa-info-circle text-blue-500 text-xl"></i>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800 mb-1">
              Under Development
            </h3>
            <p className="text-sm text-blue-700">
              Some features are currently under development. Please wait for the development to be completed.
              If you have any questions, please contact the admin. Thank you for your patience.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow relative">
        <div className="px-4 pt-4">
          <div className="flex gap-2 border-b">
            <TabButton id="organization" label="Organization" />
            <TabButton id="bank" label="Bank (Offline)" />
            <TabButton id="social" label="Social Links" />
            <TabButton id="payment" label="Payment Gateway (EASEBUZZ)" />
            <TabButton id="database" label="Download Database" />
          </div>
        </div>

        <div className="p-4 min-h-[200px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
              <div className="flex items-center gap-3 text-gray-600">
                <span className="inline-block h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            </div>
          )}
          {activeTab === 'organization' && (
            <OrganizationSettings />
          )}
          {activeTab === 'payment' && (
            <PaymentGatewaySetting />
          )}
          {activeTab === 'bank' && (
            <BankSettings />
          )}
          {activeTab === 'social' && (
            <SocialSettings />
          )}
          {activeTab === 'database' && (
            <DownloadDatabase />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSettingIndex