"use client"

import { useState } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/slices/authSlice"

const VolunteerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/volunteer", icon: "home" },
    { name: "Add Donation", href: "/volunteer/add-donation", icon: "plus-circle" },
    { name: "Donation History", href: "/volunteer/donation-history", icon: "clock" },
    { name: "Upload Settlement", href: "/volunteer/upload-settlement", icon: "file-upload" },
  ]

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  const getLinkClasses = (path) => {
    const baseClasses = "group flex items-center px-2 py-2 font-medium rounded-md transition-all duration-200"
    const mobileClasses = "text-base"
    const desktopClasses = "text-sm"
    
    return `${baseClasses} ${
      isActiveLink(path)
        ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    } ${sidebarOpen ? mobileClasses : desktopClasses}`
  }

  const getIconClasses = (path) => {
    return `${isActiveLink(path) ? "text-indigo-600" : "text-gray-500"}`
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex max-w-xs w-full bg-white shadow-xl">
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 bg-indigo-600">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-white">Donation ERP</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={getLinkClasses(item.href)}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className={`mr-3 h-6 w-6 ${getIconClasses(item.href)}`}>
                    <i className={`fas fa-${item.icon}`}></i>
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm">{user?.name?.charAt(0) || "V"}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name || "Volunteer"}</p>
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 bg-indigo-600">
            <h1 className="text-xl font-bold text-white">Donation ERP</h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={getLinkClasses(item.href)}
                >
                  <span className={`mr-3 h-6 w-6 ${getIconClasses(item.href)}`}>
                    <i className={`fas fa-${item.icon}`}></i>
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm">{user?.name?.charAt(0) || "V"}</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || "Volunteer"}</p>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default VolunteerLayout
