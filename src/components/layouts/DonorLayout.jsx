"use client"

import { useState } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/slices/authSlice"

const DonorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  const getLinkClasses = (path) => {
    const baseClasses = "group flex items-center px-4 py-3 font-medium rounded-xl transition-all duration-200"
    const mobileClasses = "text-base"
    const desktopClasses = "text-sm"
    
    return `${baseClasses} ${
      isActiveLink(path)
        ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg"
        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    } ${sidebarOpen ? mobileClasses : desktopClasses}`
  }

  const getIconClasses = (path) => {
    return `mr-3 h-6 w-6 ${isActiveLink(path) ? "text-white" : "text-gray-500 group-hover:text-indigo-600"}`
  }

  const navigation = [
    { name: "Dashboard", href: "/donor", icon: "home" },
    { name: "Donation History", href: "/donor/history", icon: "history" },
    { name: "Donate Now", href: "/donor/donate", icon: "hand-holding-heart" },
    { name: "Profile", href: "/donor/profile", icon: "user" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>

        <div className="fixed inset-y-0 left-0 flex max-w-xs w-full">
          <div className="relative flex-1 flex flex-col w-full max-w-xs bg-white shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-times text-white text-xl"></i>
              </button>
            </div>

            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <i className="fas fa-hand-holding-heart text-white text-xl"></i>
                  </div>
                  <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    TrulyHelp
                  </h1>
                </div>
              </div>

              <nav className="mt-8 flex-1 px-4 space-y-2">
                {navigation.map((item) => (
                  <Link key={item.name} to={item.href} className={getLinkClasses(item.href)}>
                    <i className={`fas fa-${item.icon} ${getIconClasses(item.href)}`}></i>
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <i className="fas fa-user text-indigo-600"></i>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user?.name || "Donor"}</p>
                    <button 
                      onClick={handleLogout}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center mt-1"
                    >
                      <i className="fas fa-sign-out-alt mr-1"></i> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white shadow-xl">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <i className="fas fa-hand-holding-heart text-white text-xl"></i>
                </div>
                <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TrulyHelp
                </h1>
              </div>
            </div>

            <nav className="mt-8 flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} className={getLinkClasses(item.href)}>
                  <i className={`fas fa-${item.icon} ${getIconClasses(item.href)}`}></i>
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center bg-gray-50 rounded-xl p-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <i className="fas fa-user text-indigo-600"></i>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "Donor"}</p>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center mt-1"
                  >
                    <i className="fas fa-sign-out-alt mr-1"></i> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow-sm">
          <button
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DonorLayout
