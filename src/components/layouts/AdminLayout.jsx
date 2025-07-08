"use client"

import { useState, useEffect } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/slices/authSlice"
import organizationLogo from '../../images/Logo1.png';

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
    { 
      name: "Dashboard", 
      href: "/admin", 
      icon: "chart-pie",
      description: "Overview of your system"
    },
    { 
      name: "Users", 
      icon: "users",
      description: "Manage system users",
      subItems: [
        { name: "Volunteers", href: "/admin/users/volunteer", icon: "user-group", description: "Manage volunteers" },
        { name: "Admins", href: "/admin/users/admin", icon: "user-shield", description: "Manage administrators" }
      ]
    },
    { 
      name: "Donors", 
      icon: "hand-holding-dollar",
      description: "Manage donor information",
      subItems: [
        { name: "Donor Registration", href: "/admin/donor-registration", icon: "user-plus", description: "Register new donors" },
        { name: "Donor List", href: "/admin/donor-list", icon: "list", description: "View all donors" },
      ]
    },
    { 
      name: "Donations", 
      icon: "rupee",
      description: "Manage donations",
      subItems: [
        { name: "View Donations", href: "/admin/donations", icon: "chart-pie", description: "View all donations" },
        { name: "Add Donation", href: "/admin/add-donation", icon: "plus-circle", description: "Add new donation" },
      ]
    },
    { 
      name: "HR Admin", 
      icon: "rupee",
      description: "Manage donations",
      subItems: [
        { name: "iCard", href: "/admin/id-card", icon: "id-card", description: "Manage identity cards" },
        // { name: "Offer Later", href: "#", icon: "message", description: "Send Offer later" },
      ]
    },
    { 
      name: "Payment Verification", 
      href: "/admin/payment-verification", 
      icon: "check-circle",
      description: "Verify payment transactions"
    },
    { 
      name: "Reports", 
      href: "/admin/reports", 
      icon: "chart-bar",
      description: "View system reports"
    },
    { 
      name: "Notifications", 
      href: "/admin/notifications", 
      icon: "bell",
      description: "Manage notifications"
    },
    { 
      name: "Donation Settings", 
      href: "/admin/donation-setting", 
      icon: "cog",
      description: "System settings"
    },
    { 
      name: "Profile", 
      href: "/admin/profile", 
      icon: "user",
      description: "User Profile"
    },
  ]

  useEffect(() => {
    navigation.forEach(item => {
      if (item.subItems && item.subItems.some(subItem => isActive(subItem.href))) {
        setOpenSubMenu(item.name)
      }
    })
  }, [location.pathname])

  const getLinkClasses = (path, isSubItem = false) => {
    const baseClasses = "group flex items-center px-3 py-2.5 font-medium rounded-lg transition-all duration-200"
    const mobileClasses = "text-base"
    const desktopClasses = "text-sm"
    
    return `${baseClasses} ${
      isActive(path)
        ? "bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-600 border-l-4 border-indigo-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    } ${sidebarOpen ? mobileClasses : desktopClasses} ${isSubItem ? 'pl-10' : ''}`
  }

  const getIconClasses = (path) => {
    return `${isActive(path) ? "text-indigo-600" : "text-gray-500"} transition-colors duration-200`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Mobile sidebar */}
        <div className={`fixed inset-y-0 left-0 flex max-w-xs w-full bg-white transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="h-full flex flex-col flex-grow overflow-y-auto">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex-shrink-0 flex items-center">
                <a href="https://trulyhelp.org/" target="_blank" rel="noopener noreferrer">
                  <img className="h-10 w-auto" src={organizationLogo} alt="Donation ERP"/>
                </a>
              </div>
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg
                  className="h-6 w-6 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
                          className={`group w-full flex items-center px-3 py-2.5 text-base font-medium rounded-lg transition-all duration-200 ${
                            openSubMenu === item.name || item.subItems.some(subItem => isActive(subItem.href)) 
                              ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-600' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <span className={`mr-4 h-6 w-6 transition-colors duration-200 ${
                            openSubMenu === item.name || item.subItems.some(subItem => isActive(subItem.href)) 
                              ? 'text-indigo-600' 
                              : 'text-gray-500'
                          }`}>
                            <i className={`fas fa-${item.icon}`}></i>
                          </span>
                          {item.name}
                          <svg
                            className={`ml-auto h-4 w-4 transform transition-transform duration-200 ${
                              openSubMenu === item.name ? 'rotate-90' : ''
                            }`}
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
                        <div className={`overflow-hidden transition-all duration-200 ${
                          openSubMenu === item.name ? 'max-h-96' : 'max-h-0'
                        }`}>
                          <div className="mt-1 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                  isActive(subItem.href)
                                    ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-600 border-l-4 border-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                } pl-10`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <span className={`mr-3 h-5 w-5 ${getIconClasses(subItem.href)}`}>
                                  <i className={`fas fa-${subItem.icon}`}></i>
                                </span>
                                <div className="flex flex-col">
                                  <span>{subItem.name}</span>
                                  <span className="text-xs text-gray-500">{subItem.description}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={getLinkClasses(item.href)}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className={`mr-4 h-6 w-6 ${getIconClasses(item.href)}`}>
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
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-700">{user?.name || "Admin User"}</div>
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

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <a href="https://trulyhelp.org/" target="_blank" rel="noopener noreferrer">
                <img className="h-10 w-auto" src={organizationLogo} alt="Donation ERP"/>
              </a>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleSubMenu(item.name)}
                        className={`group w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          openSubMenu === item.name || item.subItems.some(subItem => isActive(subItem.href)) 
                            ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className={`mr-3 h-6 w-6 transition-colors duration-200 ${
                          openSubMenu === item.name || item.subItems.some(subItem => isActive(subItem.href)) 
                            ? 'text-indigo-600' 
                            : 'text-gray-500'
                        }`}>
                          <i className={`fas fa-${item.icon}`}></i>
                        </span>
                        {item.name}
                        <svg
                          className={`ml-auto h-4 w-4 transform transition-transform duration-200 ${
                            openSubMenu === item.name ? 'rotate-90' : ''
                          }`}
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
                      <div className={`overflow-hidden transition-all duration-200 ${
                        openSubMenu === item.name ? 'max-h-96' : 'max-h-0'
                      }`}>
                        <div className="mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                isActive(subItem.href)
                                  ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-600 border-l-4 border-indigo-600'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              } pl-10`}
                            >
                              <span className={`mr-3 h-5 w-5 ${getIconClasses(subItem.href)}`}>
                                <i className={`fas fa-${subItem.icon}`}></i>
                              </span>
                              <div className="flex flex-col">
                                <span>{subItem.name}</span>
                                <span className="text-xs text-gray-500">{subItem.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={getLinkClasses(item.href)}
                    >
                      <span className={`mr-3 h-6 w-6 ${getIconClasses(item.href)}`}>
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
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || "A"}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">{user?.name || "Admin User"}</div>
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

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow-sm">
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