import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../../../utils/axiosInterceptor'

const Field = ({ formik, label, name, type = 'text', as = 'input', placeholder, required = false, help }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {as === 'textarea' ? (
      <textarea
        name={name}
        rows={3}
        value={formik.values[name] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${formik.touched[name] && formik.errors[name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={formik.values[name] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${formik.touched[name] && formik.errors[name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
      />
    )}
    {formik.touched[name] && formik.errors[name] && (
      <p className="mt-1 text-sm text-red-600">{formik.errors[name]}</p>
    )}
    {help && (
      <p className="mt-1 text-xs text-gray-500">{help}</p>
    )}
  </div>
)

const OrganizationSettings = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [initialValues, setInitialValues] = useState({
    legalName: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    logoUrl: '',
    directorName: '',
    directorTitle: '',
    panNumber: '',
    registrationNumber: '',
    eightyGNumber: '',
    donationReference: '',
    receiptFooterNote: '',
    supportEmail: '',
    supportPhone: ''
  })

  const validationSchema = Yup.object({
    legalName: Yup.string().min(2).required('Legal name is required'),
    email: Yup.string().email('Invalid email').nullable(true),
    website: Yup.string().url('Invalid URL').nullable(true),
    phone: Yup.string().matches(/^[0-9+\-()\s]{6,20}$/,
      'Invalid phone').nullable(true),
    supportEmail: Yup.string().email('Invalid support email').nullable(true),
    supportPhone: Yup.string().matches(/^[0-9+\-()\s]{6,20}$/,
      'Invalid support phone').nullable(true),
  })

  const formik = useFormik({
    enableReinitialize: false,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setError('')
      setSuccess('')
      setLoading(true)
      try {
        const { data } = await axiosInstance.put('/organization', values)
        if (data?.status) {
          setSuccess('Organization settings saved')
          formik.setValues(values)
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
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await axiosInstance.get('/organization')
        if (mounted && data?.status && data?.data) {
          formik.setValues({ ...initialValues, ...data.data })
        }
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Organization Settings</h1>

      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700">{error}</div>}
      {success && <div className="mb-4 p-3 rounded bg-green-50 text-green-700">{success}</div>}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field formik={formik} label="Legal Name" name="legalName" required help="Shown on receipts, legal docs and public pages." />
            <Field formik={formik} label="Website" name="website" help="Linked from headers/footers and emails." />
            <Field formik={formik} label="Logo URL" name="logoUrl" help="Displayed in navbar, ID cards and receipts." />
            <Field formik={formik} label="Email" name="email" help="Primary contact email shown on site and receipts." />
            <Field formik={formik} label="Phone" name="phone" help="Primary contact number shown on site and receipts." />
            <Field formik={formik} label="Director Name" name="directorName" help="Used in signatures on receipts/ID cards." />
            <Field formik={formik} label="Director Title" name="directorTitle" help="Shown below signature where applicable." />
          </div>
          <div className="mt-4">
            <Field formik={formik} label="Description" name="description" as="textarea" help="About the organization; used in SEO or info sections." />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field formik={formik} label="Address" name="address" help="Printed on receipts and contact sections." />
            <Field formik={formik} label="City" name="city" />
            <Field formik={formik} label="State" name="state" />
            <Field formik={formik} label="Country" name="country" />
            <Field formik={formik} label="Pincode" name="pincode" />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">Legal & Receipts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field formik={formik} label="PAN Number" name="panNumber" help="Shown on receipts and compliance documents." />
            <Field formik={formik} label="Registration Number" name="registrationNumber" help="Registration/CIN used on receipts and public info." />
            <Field formik={formik} label="80G Number" name="eightyGNumber" help="Displayed on donation receipts for tax benefits." />
            <Field formik={formik} label="Donation Reference Prefix" name="donationReference" help="Prefix used when generating receipt/ID references." />
            <Field formik={formik} label="Receipt Footer Note" name="receiptFooterNote" help="Short note printed at the bottom of each receipt." />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field formik={formik} label="Support Email" name="supportEmail" help="Displayed on help pages and emails for user queries." />
            <Field formik={formik} label="Support Phone" name="supportPhone" help="Shown on support/contact sections and receipts." />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrganizationSettings