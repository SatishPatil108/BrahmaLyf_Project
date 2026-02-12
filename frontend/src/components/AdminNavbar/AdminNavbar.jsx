import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
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

  const linkStyle = ({ isActive }) =>
    `block px-5 py-2.5 rounded-lg text-base font-medium transition-all duration-300 ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
    }`;

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      dispatch(logoutAdmin());
      navigate("/admin/login");
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                BrahmaLYF
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {adminLoginSuccess && (
            <nav className="hidden md:flex items-center gap-2">
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {adminLoginSuccess ? (
              <CustomButton 
                variant="danger" 
                onClick={handleLogout}
                className="px-5 py-2.5"
              >
                Logout
              </CustomButton>
            ) : (
              <CustomButton 
                variant="primary" 
                onClick={() => navigate("/admin/login")}
                className="px-5 py-2.5"
              >
                Admin Login
              </CustomButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            {/* Navigation Items */}
            {adminLoginSuccess && (
              <div className="space-y-2 mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">
                  Navigation
                </h3>
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive
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
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">
                Account
              </h3>
              {adminLoginSuccess ? (
                <CustomButton
                  variant="danger"
                  onClick={handleLogout}
                  className="w-full justify-center py-3"
                  fullWidth
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
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
                  className="w-full justify-center py-3"
                  fullWidth
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Admin Login
                  </span>
                </CustomButton>
              )}
            </div>

            {/* Current User Info */}
            {adminLoginSuccess && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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