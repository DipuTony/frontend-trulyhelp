import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const GuestLayout = () => {

  const { isAuthenticated, user } = useSelector((state) => state.auth)
  // const isAdmin = user?.role === 'ADMIN';

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const organizationName = import.meta.env.VITE_ORG_NAME;

  // Determine profile path based on user role
  const getProfilePath = (role) => {
    switch ((role || '').toUpperCase()) {
      case 'ADMIN':
        return '/admin';
      case 'VOLUNTEER':
        return '/volunteer';
      case 'DONOR':
        return '/donor';
      default:
        return '/profile';
    }
  };

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Animated Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {organizationName}
              </h1>
            </div>
            <div className="flex space-x-4">
              {isAuthenticated ?
                <div className="flex items-center space-x-6 bg-white/70 px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                  {/* Avatar or Initials */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-lg shadow">
                    {user?.name ? user.name[0] : user?.email[0]}
                  </div>
                  {/* Greeting and Role */}
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-semibold">
                      Hello, {user?.name || user?.email}
                    </span>
                    <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium shadow">
                      {user?.role}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={getProfilePath(user?.role)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow transition-all"
                    >
                      <span className="mr-1">👤</span> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-red-500 hover:bg-red-400 shadow transition-all"
                    >
                      <span className="mr-1">🚪</span> Logout
                    </button>
                  </div>
                </div>
                :
                <>
                  <Link
                    to="/login"
                    className="relative inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <span className="mr-1">👋</span> Login
                  </Link>
                  <Link
                    to="/signup"
                    className="relative inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-full text-indigo-600 bg-white border-2 border-indigo-200 hover:border-indigo-300 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <span className="mr-1">✨</span> Sign Up
                  </Link>
                </>
              }
            </div>

          </div>
        </div>
      </header >

      {/* Main Content */}
      < main className="relative" >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-30 -z-0" ></div >

        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <Outlet />
          </div>
        </div>
      </main >

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white" >
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {organizationName}
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {organizationName} System. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Making the world a better place through technology and generosity
            </p>
          </div>
        </div>
      </footer >
    </div >
  );
};

export default GuestLayout;