import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useHeader } from "./useHeader";
import UserMenu from "./UserMenu";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { assets } from "@/assets/assets";
import { useSelector } from "react-redux";

function Header() {
  const { links, user } = useHeader();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  // Handle scroll effect for transparency
  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => setIsScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [location.pathname]);

  // Theme toggle button component
  const ThemeToggleButton = () => (
    <button
      onClick={toggleTheme}
      className={`
        group relative flex items-center justify-center w-9 h-9 rounded-full
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2
        ${isDark ? "focus:ring-offset-gray-900" : "focus:ring-offset-white"}
        ${
          isDark
            ? "bg-gray-800/60 hover:bg-gray-700/80 text-gray-300 hover:text-amber-400"
            : "bg-gray-100/60 hover:bg-gray-200/80 text-gray-600 hover:text-amber-600"
        }
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      )}
    </button>
  );

  // Get header styles based on scroll state and theme
  const getHeaderStyles = () => {
    const baseStyles =
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out";

    if (location.pathname === "/" && !isScrolled) {
      // Transparent header on home page when not scrolled
      return `${baseStyles} bg-transparent`;
    }

    // Scrolled header or non-home pages
    return `${baseStyles} ${
      isDark
        ? "bg-gray-900/85 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-gray-900/20"
        : "bg-white/85 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-200/30"
    }`;
  };

  // Navigation link styling
  const getNavLinkStyles = ({ isActive }) => {
    const activeClasses =
      "text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-md shadow-purple-500/25";
    const inactiveClasses = isDark
      ? "text-gray-300 hover:text-white hover:bg-gray-800/60"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80";

    return `
      relative px-4 py-2 rounded-lg text-sm font-medium
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-1
      ${isActive ? activeClasses : inactiveClasses}
    `;
  };

  return (
    <header className={getHeaderStyles()}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <NavLink
            to="/"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg transition-opacity duration-200 hover:opacity-90"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="relative h-10 lg:h-12 w-auto">
              <img
                src={isDark ? assets.logo_dark : assets.logo_light}
                alt="BrahmaLyf"
                className="h-full w-auto object-contain"
              />
            </div>
          </NavLink>

          {/* Navigation Section */}
          <nav className="flex items-center gap-6" aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={getNavLinkStyles}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {({ isActive }) => (
                      <span className="relative z-10">{link.label}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggleButton />
              {user && <UserMenu />}
            </div>
          </nav>
        </div>
      </div>

      {/* Animated bottom border glow effect when scrolled */}
      {isScrolled && (
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-px
            bg-gradient-to-r from-transparent via-purple-500/50 to-transparent
            transition-opacity duration-500
          `}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

export default Header;
