import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut, FiLock } from "react-icons/fi";
import CustomButton from "@/components/CustomButton";
import useAdminNavbar from "./useAdminNavbar";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "@/store/feature/auth/authSlice";

const AdminNavbar = () => {
  const { navItems, adminLoginSuccess } = useAdminNavbar();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname === "/admin") {
      const handleScroll = () => setIsScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setIsTabletMenuOpen(false);
  }, [location.pathname]);

  const linkStyle = ({ isActive }) =>
    `block px-2 lg:px-3 py-2.5 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 ${isActive
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
    }`;

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      dispatch(logoutAdmin());
      navigate("/admin/login");
      setMenuOpen(false);
      setIsTabletMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? "bg-white/90 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800"
        : "bg-transparent"
        }`}
    >
      <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo - Responsive sizing */}
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm sm:text-lg">B</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                BrahmaLYF
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Large screens */}
          {adminLoginSuccess && (
            <nav className="hidden lg:flex items-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-hide mx-4 xl:mx-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={linkStyle}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Desktop Actions - Large screens */}
          <div className="hidden lg:flex items-center gap-3">
            {adminLoginSuccess ? (
              <CustomButton
                variant="danger"
                onClick={handleLogout}
                className="px-4 xl:px-5 py-2.5 text-sm xl:text-base"
              >
                <span className="flex items-center gap-2">
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden xl:inline">Logout</span>
                </span>
              </CustomButton>
            ) : (
              <CustomButton
                variant="primary"
                onClick={() => navigate("/admin/login")}
                className="px-4 xl:px-5 py-2.5 text-sm xl:text-base"
              >
                <span className="flex items-center gap-2">
                  <FiLock className="w-4 h-4" />
                  <span className="hidden xl:inline">Admin Login</span>
                </span>
              </CustomButton>
            )}
          </div>

          {/* Mobile & Tablet Actions */}
          <div className="flex md:flex lg:hidden items-center gap-2">
            {/* Tablet/Desktop Login/Logout button */}
            {adminLoginSuccess ? (
              <button
                onClick={handleLogout}
                className="hidden sm:flex md:hidden lg:hidden w-10 h-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                aria-label="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => navigate("/admin/login")}
                className="hidden sm:flex md:hidden lg:hidden w-10 h-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                aria-label="Admin Login"
              >
                <FiLock className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Menu Button - Shows on mobile and tablet */}
            <button
              className="md:flex lg:hidden w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>


      {/* Mobile Menu - Small screens */}
      {menuOpen && (
        <div className="md:flex lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl">
          <div className="w-full px-3 sm:px-4 py-4">
            {/* Navigation Items */}
            {adminLoginSuccess && (
              <div className="space-y-2 mb-6">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">
                  Navigation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${isActive
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-l-4 border-indigo-600"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="ml-2">{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">
                Account
              </h3>
              {adminLoginSuccess ? (
                <CustomButton
                  variant="danger"
                  onClick={handleLogout}
                  className="w-full justify-center py-2.5 sm:py-3 text-sm sm:text-base"
                  fullWidth
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    Logout
                  </span>
                </CustomButton>
              ) : (
                <CustomButton
                  variant="primary"
                  onClick={() => {
                    navigate("/admin/login");
                    setMenuOpen(false);
                  }}
                  className="w-full justify-center py-2.5 sm:py-3 text-sm sm:text-base"
                  fullWidth
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiLock className="w-4 h-4 sm:w-5 sm:h-5" />
                    Admin Login
                  </span>
                </CustomButton>
              )}
            </div>

            {/* Current User Info */}
            {adminLoginSuccess && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      Admin User
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;