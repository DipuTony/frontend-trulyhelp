"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { onlineGuestDonationEazyBuzz } from "../../store/slices/donationSlice"
import { Link } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import 'animate.css'
import countryList from  '../../DATA/CountryList.json'
import { FileText, IndianRupee, Tag, Repeat, Clock, Info } from "lucide-react"

const validationSchema = Yup.object({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    .required('Phone number is required'),
  address: Yup.string(),
  city: Yup.string(),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Pincode must be 6 digits'),
  state: Yup.string(),
  panNumber: Yup.string(),

  donationType: Yup
    .string()
    .required('Please select a Donor type')
    .oneOf(['Individual', 'Organization'], 'Invalid Donor type selected'),

  donorType: Yup
    .string()
    .required('Please select a Citizenship')
    .oneOf(['indian', 'foreign'], 'Invalid Citizenship selected'),

  //  .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN number format'),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .nullable(),
  receiveG80Certificate: Yup.boolean()
    .oneOf([true], 'You must accept the Terms & Conditions to proceed'),
  country: Yup.string().when('donorType', {
    is: (val) => val === 'foreign',
    then: (schema) => schema.required('Country is required'),
    otherwise: (schema) => schema
  }),
})

const DonateForm = ({ donationData, onBackClick }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.donations)
  const [submitting, setSubmitting] = useState(false);

  // console.log(donationData);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      panNumber: "",
      donationType: "",
      donorType: "",
      amount: donationData?.amount?.toString() || "",
      category: donationData?.cause || "general",
      receiveG80Certificate: false,
    },
    validationSchema,
    onSubmit: values => {

      const newDonation = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        dob: values.dateOfBirth,
        pan: values.panNumber,
        donationType: values.donationType,
        country: formik.values.donorType === "indian" ? "India" : values.country,
        donorType: values.donorType,
        address: values.address,
        cause:donationData?.cause,
        donationAmount: Number.parseFloat(donationData?.amount?.toString()),
      }

console.log(newDonation)
      // return
      handleSubmit(newDonation)
    },
  })


  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const response = await dispatch(onlineGuestDonationEazyBuzz(values));
      if (response.error) {
        setSubmitting(false);
        // Update button state here
        return;
      }
      // Handle success case
    } catch (error) {
      setSubmitting(false);
      // Update button state here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 animate__animated animate__fadeIn animate__delay-0.5s">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Make a <span className="text-indigo-600">Difference</span> Today
          </h1>
          <p className="mt-3 text-xl text-gray-500">Your generosity can change lives.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md animate__animated animate__shakeX">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error || error.message || 'An error occurred. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate__animated animate__fadeInUp">
          <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Donation Summary */}
            <div className="p-8 bg-gradient-to-br from-indigo-50 via-indigo-100 to-white animate__animated animate__fadeInLeft">
              <div className="sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Summary</h2>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="inline-block bg-indigo-100 text-indigo-600 rounded-full p-2">
                      <FileText className="w-5 h-5" />
                    </span>
                    Summary
                  </h3>
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-gray-600">
                        <IndianRupee className="w-5 h-5 text-green-500" />
                        Amount
                      </span>
                      <span className="font-bold text-2xl text-green-600">
                        ₹ {donationData?.amount ? Number(donationData?.amount?.toString().toLocaleString()) : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Tag className="w-5 h-5 text-blue-500" />
                        Category
                      </span>
                      <span className="text-gray-900 capitalize">{donationData?.cause}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-gray-600">
                        {donationData?.frequency === 'monthly' ? (
                          <Repeat className="w-5 h-5 text-purple-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-purple-500" />
                        )}
                        Type
                      </span>
                      <span className="text-gray-900 capitalize">{donationData?.frequency}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-5 mt-2 shadow border border-blue-100 flex items-start gap-3">
                  <span className="mt-1">
                    <Info className="w-6 h-6 text-blue-400" />
                  </span>
                  <div className="text-sm text-blue-900">
                    As per the Indian Income Tax Department's rules, a donor is required to add their <b>Full Name, Address and PAN number</b> in case they wish to claim tax exemption.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Details */}
            <div className="p-8 border-t lg:border-t-0 lg:border-l border-gray-200 animate__animated animate__fadeInRight">
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
                  <div className="grid gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {formik.touched.name && formik.errors.name ? (
                          <div className="mt-1 text-sm text-red-600">{formik.errors.name}</div>
                        ) : null}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formik.values.dateOfBirth}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                          <div className="mt-1 text-sm text-red-600">{formik.errors.dateOfBirth}</div>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <div className="mt-1 text-sm text-red-600">{formik.errors.email}</div>
                        ) : null}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          maxLength={10}
                          placeholder="Enter 10 digit number"
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {formik.touched.phone && formik.errors.phone ? (
                          <div className="mt-1 text-sm text-red-600">{formik.errors.phone}</div>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Donor Type*</label>
                        <select
                          name="donationType"
                          value={formik.values.donationType}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl bg-gray-50"
                        >
                          <option value="">Select</option>
                          <option value="Individual">Individual</option>
                          <option value="Organization">Organization</option>
                        </select>
                        {formik.touched.donationType && formik.errors.donationType ? (
                          <div className="mt-1 text-sm text-red-600">{formik.errors.donationType}</div>
                        ) : null}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Citizenship*</label>
                        <select
                          name="donorType"
                          value={formik.values.donorType}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl bg-gray-50"
                        >
                          <option value="">Select</option>
                          <option value="indian">Indian</option>
                          <option value="foreign">Foreign / NRI</option>
                        </select>
                        {formik.touched.donorType && formik.errors.donorType ? (
                          <div className="mt-1 text-sm text-red-600">{formik.errors.donorType}</div>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country{formik.values.donorType === 'foreign' ? ' *' : ''}
                        </label>
                        {formik.values.donorType === 'foreign' ? (
                          <>
                            <select
                              name="country"
                              value={formik.values.country}
                              onChange={formik.handleChange}
                              className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl bg-gray-50"
                            >
                              <option value="">Select Country</option>
                              {countryList.map((country) => (
                                <option key={country.name} value={country.name}>
                                  {country.name}
                                </option>
                              ))}
                            </select>
                            {formik.touched.country && formik.errors.country && (
                              <div className="mt-1 text-sm text-red-600">{formik.errors.country}</div>
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            name="country"
                            value="INDIA"
                            readOnly
                            className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl bg-gray-50"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formik.values.donorType === 'foreign' ? "Passport No" : "PAN Number"}
                        </label>
                        <input
                          type="text"
                          name="panNumber"
                          value={formik.values.panNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {formik.touched.panNumber && formik.errors.panNumber ? (
                          <div className="mt-1 text-sm text-red-600">{formik.errors.panNumber}</div>
                        ) : null}
                      </div>

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        rows={2}
                        className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {formik.touched.address && formik.errors.address ? (
                        <div className="mt-1 text-sm text-red-600">{formik.errors.address}</div>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formik.values.city}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {formik.touched.city && formik.errors.city ? (
                          <div className="mt-1 text-sm text-red-600">{formik.errors.city}</div>
                        ) : null}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formik.values.state}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {formik.touched.state && formik.errors.state ? (
                          <div className="mt-1 text-sm text-red-600">{formik.errors.state}</div>
                        ) : null}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                        <input
                          type="number"
                          name="pincode"
                          value={formik.values.pincode}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {formik.touched.pincode && formik.errors.pincode ? (
                          <div className="mt-1 text-sm text-red-600">{formik.errors.pincode}</div>
                        ) : null}
                      </div>
                    </div>



                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        name="receiveG80Certificate"
                        checked={formik.values.receiveG80Certificate}
                        onChange={formik.handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        I accept the <span className="underline cursor-pointer text-indigo-500 hover:text-indigo-600"> Terms & Conditions </span> and also confirm that information provided above true.
                        Your donations are tax exempted under 80G of the Indian Income Tax Act.
                      </label>
                    </div>
                    {formik.touched.receiveG80Certificate && formik.errors.receiveG80Certificate ? (
                      <div className="mt-1 text-sm text-red-600">{formik.errors.receiveG80Certificate}</div>
                    ) : null}
                  </div>
                </div>

                {/* Submit Section */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading || submitting}
                    className="w-full px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading || submitting ? "Processing..." : "Proceed to Payment"}
                  </button>
                  <p className="mt-4 text-sm text-center text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <button
        onClick={onBackClick}
        className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
      >
        ← Back
      </button>
    </div>
  )
}

export default DonateForm