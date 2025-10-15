import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../../utils/axiosInterceptor'
import DataTable from '../../../components/common/DataTable/DataTable'


const ROLES = [
  { value: 'ALL', label: 'All' },
  { value: 'DONOR', label: 'Donor' },
  { value: 'VOLUNTEER', label: 'Volunteer' },
]

// using shared axios instance (baseURL + auth handled by interceptor)

const SelectRecipients = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [role, setRole] = useState('ALL')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => {
    // Restore preserved state if available (coming back from compose)
    const preserve = state?.preserve
    if (preserve) {
      if (preserve.role) setRole(preserve.role)
      if (typeof preserve.query === 'string') setQuery(preserve.query)
      if (Array.isArray(preserve.results)) setResults(preserve.results)
      if (Array.isArray(preserve.selectedIds)) setSelectedIds(new Set(preserve.selectedIds))
      return
    }
    setResults([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filterByQuery = (list) => {
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((u) =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q)
    )
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSelectedIds(new Set())

    try {
      let list = []
      if (role === 'ALL') {
        const [donorsRes, volunteersRes] = await Promise.all([
          axiosInstance.get(`/user/view-all?role=DONOR`),
          axiosInstance.get(`/user/view-all?role=VOLUNTEER`),
        ])
        const donors = donorsRes?.data?.data || donorsRes?.data || []
        const volunteers = volunteersRes?.data?.data || volunteersRes?.data || []
        list = [...donors, ...volunteers]
      } else {
        const { data } = await axiosInstance.get(`/user/view-all?role=${role}`)
        list = data?.data || data || []
      }

      const mapped = filterByQuery(list).map((u) => ({
        id: u.userId || u.id,
        userId: u.userId || u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
      }))
      setResults(mapped)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch users')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const allChecked = useMemo(() => results.length > 0 && results.every((u) => selectedIds.has(u.id)), [results, selectedIds])
  const someChecked = useMemo(() => results.some((u) => selectedIds.has(u.id)) && !allChecked, [results, selectedIds, allChecked])

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(results.map((u) => u.id)))
    }
  }

  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const proceed = () => {
    const selected = results.filter((u) => selectedIds.has(u.id))
    // Pass selection via navigation state for now; can switch to store/query later
    navigate('/admin/notifications/compose', {
      state: {
        recipients: selected,
        preserve: {
          role,
          query,
          results,
          selectedIds: Array.from(selectedIds),
        },
      },
    })
  }

  const COLUMNS = useMemo(() => [
    {
      Header: '',
      accessor: 'select',
      disableSortBy: true,
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.original.id)}
          onChange={() => toggleOne(row.original.id)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
      )
    },
    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.original.name}</div>
          <div className="text-xs text-gray-400">ID: {row.original.userId || row.original.id}</div>
        </div>
      )
    },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Phone', accessor: 'phone' },
    { Header: 'Role', accessor: 'role' }
  ], [selectedIds])

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Select Recipients</h1>
          <p className="mt-2 text-sm text-gray-700">Filter and choose recipients for your notification.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => navigate('/admin/notifications')}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-1 flex items-end">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mt-6 bg-white shadow sm:rounded-lg">
        {error && (
          <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border-b border-red-200">{error}</div>
        )}
        <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <input
              id="select-all"
              type="checkbox"
              checked={allChecked}
              ref={(el) => el && (el.indeterminate = someChecked)}
              onChange={toggleAll}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">Select All</label>
          </div>
          <div>
            <button
              type="button"
              onClick={proceed}
              disabled={selectedIds.size === 0}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              Proceed
            </button>
          </div>
        </div>

        {loading ? (
          <div className="px-4 py-6">
            <p className="text-sm text-gray-500 italic">Loading...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="px-4 py-6">
            <p className="text-sm text-gray-500 italic">No results. Adjust filters and search.</p>
          </div>
        ) : (
          <div className="p-4">
            <DataTable data={results} columns={COLUMNS} />
          </div>
        )}
      </div>
    </div>
  )
}

export default SelectRecipients