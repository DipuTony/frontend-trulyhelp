"use client"

import { useEffect, useState } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar, Doughnut } from 'react-chartjs-2'
import axiosInstance from "../../utils/axiosInterceptor"
import { Link } from "react-router-dom"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState('monthly') // 'today', 'monthly', 'yearly'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/report/dashboard`)
        if (response.data?.status) {
          setDashboardData(response.data.data)
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md">
          <div className="text-xl text-gray-700 mb-4">No dashboard data available</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  // Prepare data for charts
  const paymentMethodsData = {
    labels: Object.keys(dashboardData.donations.paymentMethods),
    datasets: [{
      data: Object.values(dashboardData.donations.paymentMethods).map(method => method.amount),
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',
        'rgba(14, 165, 233, 0.7)',
        'rgba(22, 163, 74, 0.7)',
        'rgba(234, 88, 12, 0.7)',
        'rgba(139, 92, 246, 0.7)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(14, 165, 233, 1)',
        'rgba(22, 163, 74, 1)',
        'rgba(234, 88, 12, 1)',
        'rgba(139, 92, 246, 1)'
      ],
      borderWidth: 1
    }]
  };

  const paymentStatusData = {
    labels: Object.keys(dashboardData.donations.paymentStatuses),
    datasets: [{
      data: Object.values(dashboardData.donations.paymentStatuses).map(status => status.count),
      backgroundColor: [
        'rgba(22, 163, 74, 0.7)',
        'rgba(234, 88, 12, 0.7)',
        'rgba(59, 130, 246, 0.7)'
      ],
      borderColor: [
        'rgba(22, 163, 74, 1)',
        'rgba(234, 88, 12, 1)',
        'rgba(59, 130, 246, 1)'
      ],
      borderWidth: 1
    }]
  };

  const paymentMethodsByCountData = {
    labels: Object.keys(dashboardData.donations.paymentMethods),
    datasets: [{
      label: 'Number of Transactions',
      data: Object.values(dashboardData.donations.paymentMethods).map(method => method.count),
      backgroundColor: 'rgba(99, 102, 241, 0.7)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1
    }]
  };

  const donationTrendsData = {
    labels: ['Today', 'This Month', 'This Year'],
    datasets: [{
      label: 'Donation Amount (₹)',
      data: [
        dashboardData.donations.today.amount,
        dashboardData.donations.monthly.amount,
        dashboardData.donations.yearly.amount
      ],
      backgroundColor: 'rgba(79, 70, 229, 0.7)',
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 1
    }, {
      label: 'Number of Donations',
      data: [
        dashboardData.donations.today.count,
        dashboardData.donations.monthly.count,
        dashboardData.donations.yearly.count
      ],
      backgroundColor: 'rgba(236, 72, 153, 0.7)',
      borderColor: 'rgba(236, 72, 153, 1)',
      borderWidth: 1
    }]
  };

  const iCardStatusData = {
    labels: Object.keys(dashboardData.iCards.stats),
    datasets: [{
      data: Object.values(dashboardData.iCards.stats),
      backgroundColor: [
        'rgba(22, 163, 74, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(234, 88, 12, 0.7)',
        'rgba(99, 102, 241, 0.7)'
      ],
      borderColor: [
        'rgba(22, 163, 74, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(234, 88, 12, 1)',
        'rgba(99, 102, 241, 1)'
      ],
      borderWidth: 1
    }]
  };

  const getTimeRangeData = () => {
    switch(timeRange) {
      case 'today': return dashboardData.donations.today;
      case 'monthly': return dashboardData.donations.monthly;
      case 'yearly': return dashboardData.donations.yearly;
      default: return dashboardData.donations.monthly;
    }
  };

  const timeRangeData = getTimeRangeData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Overview of platform activities</p>
          </div>
          <Link
            to="/admin/donations"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Detailed Reports
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-4 py-2 rounded-md ${timeRange === 'today' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-4 py-2 rounded-md ${timeRange === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeRange('yearly')}
              className={`px-4 py-2 rounded-md ${timeRange === 'yearly' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              This Year
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Volunteers Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Volunteers</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{dashboardData.volunteers.total}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Donations Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {timeRange === 'today' ? "Today's" : timeRange === 'monthly' ? "This Month's" : "This Year's"} Donations
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">₹{timeRangeData.amount.toLocaleString()}</div>
                    <div className="ml-2 text-sm text-gray-500">from {timeRangeData.count} donations</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* ICards Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total ICards</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {Object.values(dashboardData.iCards.stats).reduce((a, b) => a + b, 0)}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Donation Trends */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Donation Trends</h3>
            <div className="h-80">
              <Bar
                data={donationTrendsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.datasetIndex === 0) {
                            label += '₹' + context.raw.toLocaleString();
                          } else {
                            label += context.raw;
                          }
                          return label;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64">
                <Doughnut
                  data={paymentMethodsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right'
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="h-64">
                <Bar
                  data={paymentMethodsByCountData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.raw} transactions`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Status */}
          <div className="bg-white shadow rounded-lg p-6 lg:col-span-1">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Statuses</h3>
            <div className="h-64">
              <Pie
                data={paymentStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(dashboardData.donations.paymentStatuses).map(([status, data]) => (
                    <tr key={status}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{status}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.count}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{data.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ICard Status */}
          <div className="bg-white shadow rounded-lg p-6 lg:col-span-1">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ICard Status Distribution</h3>
            <div className="h-64">
              <Doughnut
                data={iCardStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(dashboardData.iCards.stats).map(([status, count]) => (
                    <tr key={status}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{status}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Methods Table */}
          <div className="bg-white shadow rounded-lg p-6 lg:col-span-1">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(dashboardData.donations.paymentMethods).map(([method, data]) => (
                    <tr key={method}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{method}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.count}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{data.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        ₹{data.count > 0 ? Math.round(data.amount/data.count).toLocaleString() : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard