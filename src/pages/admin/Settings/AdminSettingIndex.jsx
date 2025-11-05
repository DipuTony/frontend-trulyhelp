import React, { useState } from 'react'
import PaymentGatewaySetting from './PaymentGatewaySetting'
import OrganizationSettings from './OrganizationSettings'
import BankSettings from './BankSettings'
import SocialSettings from './SocialSettings'

const AdminSettingIndex = () => {
  const [activeTab, setActiveTab] = useState('organization')

  const TabButton = ({ id, label }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 focus:outline-none transition-colors
        ${activeTab === id
          ? 'border-indigo-600 text-indigo-700'
          : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'}`}
    >
      {label}
    </button>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Settings</h1>

      <div className="bg-white rounded-xl shadow">
        <div className="px-4 pt-4">
          <div className="flex gap-2 border-b">
            <TabButton id="organization" label="Organization" />
            <TabButton id="bank" label="Bank (Offline)" />
            <TabButton id="social" label="Social Links" />
            <TabButton id="payment" label="Payment Gateway (EASEBUZZ)" />
          </div>
        </div>

        <div className="p-4">
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
        </div>
      </div>
    </div>
  )
}

export default AdminSettingIndex