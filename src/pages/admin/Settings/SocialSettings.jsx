import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosInterceptor'

const SocialSettings = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [values, setValues] = useState({
    socialFacebook: '',
    socialInstagram: '',
    socialTwitter: '',
    socialYouTube: '',
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
            socialFacebook = '', socialInstagram = '', socialTwitter = '', socialYouTube = ''
          } = data.data || {}
          setValues({ socialFacebook, socialInstagram, socialTwitter, socialYouTube })
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
      const payload = { ...values }
      const { data } = await axiosInstance.put('/organization', payload)
      if (data?.status) {
        setSuccess('Social settings saved')
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
          <h2 className="text-lg font-medium mb-4">Social</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input
                type="url"
                name="socialFacebook"
                value={values.socialFacebook}
                onChange={onChange}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Linked in footer and share components.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="url"
                name="socialInstagram"
                value={values.socialInstagram}
                onChange={onChange}
                placeholder="https://instagram.com/yourpage"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Linked in footer and share components.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X</label>
              <input
                type="url"
                name="socialTwitter"
                value={values.socialTwitter}
                onChange={onChange}
                placeholder="https://twitter.com/yourpage"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Linked in footer and share components.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
              <input
                type="url"
                name="socialYouTube"
                value={values.socialYouTube}
                onChange={onChange}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Linked in footer and share components.</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Social Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SocialSettings

