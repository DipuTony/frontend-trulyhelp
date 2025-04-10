"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sendNotification } from "../../store/slices/notificationSlice"

const NotificationPanel = () => {
  const dispatch = useDispatch()
  const { notifications } = useSelector((state) => state.notifications)

  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "email",
    recipients: "all", // all, donors, volunteers
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNotificationData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(
      sendNotification({
        ...notificationData,
        id: Date.now(),
        sentAt: new Date().toISOString(),
      }),
    )
    setNotificationData({
      title: "",
      message: "",
      type: "email",
      recipients: "all",
    })
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Notification Panel</h1>
          <p className="mt-2 text-sm text-gray-700">Send notifications to donors and volunteers.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Send Notification</h3>
              <p className="mt-1 text-sm text-gray-500">Create and send notifications via Email, WhatsApp, or SMS.</p>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={notificationData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    value={notificationData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Notification Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={notificationData.type}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
                    Recipients
                  </label>
                  <select
                    id="recipients"
                    name="recipients"
                    value={notificationData.recipients}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="all">All</option>
                    <option value="donors">Donors Only</option>
                    <option value="volunteers">Volunteers Only</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i
                      className={`fas fa-${notificationData.type === "email" ? "envelope" : notificationData.type === "whatsapp" ? "comment" : "sms"} mr-2`}
                    ></i>
                    Send Notification
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="sm:col-span-3">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Notifications</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">A list of recently sent notifications.</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-hidden overflow-y-auto" style={{ maxHeight: "400px" }}>
                <ul className="divide-y divide-gray-200">
                  {notifications.length === 0 ? (
                    <li className="px-4 py-4 sm:px-6">
                      <p className="text-sm text-gray-500 italic">No notifications sent yet.</p>
                    </li>
                  ) : (
                    notifications.map((notification) => (
                      <li key={notification.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">{notification.title}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                notification.type === "email"
                                  ? "bg-blue-100 text-blue-800"
                                  : notification.type === "whatsapp"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {notification.type}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <i className="fas fa-users flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"></i>
                              {notification.recipients}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <i className="fas fa-clock flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"></i>
                            <p>
                              Sent on{" "}
                              {new Date(notification.sentAt).toLocaleDateString() +
                                " " +
                                new Date(notification.sentAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{notification.message}</p>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationPanel
