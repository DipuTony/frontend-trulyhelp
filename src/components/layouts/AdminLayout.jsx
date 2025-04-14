"use client"

import { useState, useEffect } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/slices/authSlice"

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState(null)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu)
  }

  const isActive = (href) => {
    return location.pathname === href
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "chart-pie" },
    { 
      name: "Users", 
      icon: "users",
      subItems: [
        { name: "Doners", href: "/admin/users/donor", icon: "hand-holding-dollar" },
        { name: "Volunteers", href: "/admin/users/volunteer", icon: "user-group" },
        { name: "Admins", href: "/admin/users/admin", icon: "user-shield" }
      ]
    },
    { name: "Donations", href: "/admin/donations", icon: "chart-pie" },
    { name: "Expenses", href: "/admin/expenses", icon: "chart-pie" },
    { name: "Payment Verification", href: "/admin/payment-verification", icon: "check-circle" },
    { name: "Reports", href: "/admin/reports", icon: "chart-pie" },
    { name: "Notifications", href: "/admin/notifications", icon: "bell" },
  ]

  // Automatically open submenu if current route matches any subitem
  useEffect(() => {
    navigation.forEach(item => {
      if (item.subItems && item.subItems.some(subItem => isActive(subItem.href))) {
        setOpenSubMenu(item.name)
      }
    })
  }, [location.pathname]) // Only run when pathname changes


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="fixed inset-y-0 left-0 flex max-w-xs w-full bg-white">
          <div className="h-full flex flex-col flex-grow overflow-y-auto">
            <div className="flex items-center justify-between h-16 px-4">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Donation ERP</h1>
              </div>
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg
                  className="h-6 w-6 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.subItems ? (
                      <div>
                        <button
                          onClick={() => toggleSubMenu(item.name)}
                          className={`group w-full flex items-center px-2 py-2 text-base font-medium rounded-md ${openSubMenu === item.name || item.subItems.some(subItem => isActive(subItem.href)) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                          <span className={`mr-4 h-6 w-6 ${openSubMenu === item.name || item.subItems.some(subItem => isActive(subItem.href)) ? 'text-gray-500' : 'text-gray-400'}`}>
                            <i className={`fas fa-${item.icon}`}></i>
                          </span>
                          {item.name}
                          <svg
                            className={`ml-2 h-4 w-4 transform ${openSubMenu === item.name ? 'rotate-90' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {(openSubMenu === item.name || item.subItems.some(subItem => isActive(subItem.href))) && (
                          <div className="pl-8 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive(subItem.href) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <span className={`mr-4 h-6 w-6 ${isActive(subItem.href) ? 'text-gray-500' : 'text-gray-400'}`}>
                                  <i className={`fas fa-${subItem.icon}`}></i>
                                </span>
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive(item.href) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className={`mr-4 h-6 w-6 ${isActive(item.href) ? 'text-gray-500' : 'text-gray-400'}`}>
                          <i className={`fas fa-${item.icon}`}></i>
                        </span>
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  <div className="text-base font-medium text-gray-700">{user?.name || "Admin User"}</div>
                  <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Donation ERP</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleSubMenu(item.name)}
                        className={`group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${openSubMenu === item.name || item.subItems.some(subItem => isActive(subItem.href)) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                        <span className={`mr-3 h-6 w-6 ${openSubMenu === item.name || item.subItems.some(subItem => isActive(subItem.href)) ? 'text-gray-500' : 'text-gray-400'}`}>
                          <i className={`fas fa-${item.icon}`}></i>
                        </span>
                        {item.name}
                        <svg
                          className={`ml-2 h-4 w-4 transform ${openSubMenu === item.name ? 'rotate-90' : ''}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {(openSubMenu === item.name || item.subItems.some(subItem => isActive(subItem.href))) && (
                        <div className="pl-8 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive(subItem.href) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                              <span className={`mr-3 h-6 w-6 ${isActive(subItem.href) ? 'text-gray-500' : 'text-gray-400'}`}>
                                <i className={`fas fa-${subItem.icon}`}></i>
                              </span>
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive(item.href) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      <span className={`mr-3 h-6 w-6 ${isActive(item.href) ? 'text-gray-500' : 'text-gray-400'}`}>
                        <i className={`fas fa-${item.icon}`}></i>
                      </span>
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <div className="text-sm font-medium text-gray-700">{user?.name || "Admin User"}</div>
                <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
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

export default AdminLayout