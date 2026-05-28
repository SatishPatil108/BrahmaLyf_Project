import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useHeader } from "./useHeader";
import UserMenu from "./UserMenu";
import {
  Sun,
  Moon,
  Home,
  BookOpen,
  BookMarked,
  Info,
  Mail,
  User2Icon,
  NotebookTabs,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { assets } from "@/assets/assets";
import { useSelector } from "react-redux";
import LanguageSelector from "@/pages/User/Language/LanguageSelector";

function Header() {
  const { links, user } = useHeader();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => setIsScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [location.pathname]);

  const navStyles = {
    header: isDark
      ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800"
      : "bg-white/95 backdrop-blur-md border-b border-gray-200",
    bottomNav: isDark
      ? "bg-gray-900/95 backdrop-blur-md border-t border-gray-800"
      : "bg-white/95 backdrop-blur-md border-t border-gray-200",
    text: isDark ? "text-gray-300" : "text-gray-900",
    hoverText: isDark ? "hover:text-gray-100" : "hover:text-gray-700",
    inactiveIconBg: isDark
      ? "bg-gray-800/50 hover:bg-gray-700/50"
      : "bg-gray-100 hover:bg-gray-200",
  };

  const navLinkStyle = ({ isActive }) => `
    inline-flex items-center px-4 py-2.5 rounded-lg whitespace-nowrap font-medium text-sm transition-all duration-200
    ${
      isActive
        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
        : `${
            isDark
              ? "text-gray-300 hover:bg-gray-800/50 hover:text-gray-100"
              : "text-gray-900 hover:bg-gray-100 hover:text-gray-700"
          } backdrop-blur-sm`
    }
  `;

  const ThemeToggleButton = ({ isMobile = false }) => (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center rounded-full transition-all duration-300 group
        ${isMobile ? "w-10 h-10" : "w-9 h-9"}
        ${isDark ? "bg-gray-800/50 hover:bg-gray-700/50" : "bg-gray-100 hover:bg-gray-200"}
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun
          className={`${isMobile ? "w-5 h-5" : "w-4 h-4"} text-gray-300 group-hover:scale-110 transition-transform`}
        />
      ) : (
        <Moon
          className={`${isMobile ? "w-5 h-5" : "w-4 h-4"} text-gray-700 group-hover:scale-110 transition-transform`}
        />
      )}
    </button>
  );

  const bottomNavItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/about", label: "About", icon: Info },
    { to: "/contact", label: "Contact", icon: Mail },
  ];
  if (!user) {
    bottomNavItems.push({ to: "/login", label: "Login", icon: User2Icon });
  } else {
    bottomNavItems.splice(2, 0, {
      to: "/my-courses",
      label: "Courses",
      icon: BookMarked,
    });
    bottomNavItems.splice(2, 0, {
      to: "/notes",
      label: "Notes",
      icon: NotebookTabs,
    });
  }

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <header
          className={`w-full transition-all duration-500 ${
            isScrolled
              ? `${navStyles.header} shadow-lg`
              : isDark
                ? "bg-gray-900"
                : "bg-white"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <NavLink to="/" className="flex items-center">
                <div className="h-20 flex items-center">
                  <div className="bg-gray-800">
                    <img
                      src={isDark ? assets.logo_dark : assets.logo_light}
                      alt="BrahmaLyf Logo"
                      className="h-20 w-auto object-cover"
                      style={{ mixBlendMode: "lighten" }}
                    />
                  </div>
                </div>
              </NavLink>

              <nav
                aria-label="Main navigation"
                className="flex items-center gap-4"
              >
                <ul className="flex items-center gap-1">
                  {links.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        className={navLinkStyle}
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                {user && (
                  <div className="ml-2">
                    <LanguageSelector />
                  </div>
                )}

                <div className="ml-2">
                  <ThemeToggleButton />
                </div>

                {user && (
                  <div className="ml-2">
                    <UserMenu />
                  </div>
                )}
              </nav>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <header
          className={`sticky top-0 left-0 w-full z-50 ${navStyles.header}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <NavLink to="/" className="flex items-center gap-2">
                <div className="bg-gray-800">
                  <img
                    src={isDark ? assets.logo_dark : assets.logo_light}
                    alt="BrahmaLyf Logo"
                    className="h-16 w-auto object-cover"
                    style={{ mixBlendMode: "lighten" }}
                  />
                </div>
              </NavLink>

              <div className="flex items-center gap-1.5">
                {user && (
                  <div className="ml-2">
                    <LanguageSelector />
                  </div>
                )}
                <ThemeToggleButton isMobile={true} />
                {user && <UserMenu />}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 ${navStyles.bottomNav} z-40 shadow-xl`}
        aria-label="Mobile bottom navigation"
      >
        <div className="max-w-7xl mx-auto">
          <ul className="flex justify-around items-center">
            {bottomNavItems.map((item) => (
              <li key={item.to} className="flex-1">
                <NavLink
                  to={item.to}
                  onClick={() => window.scrollTo(0, 0)}
                  className={({ isActive }) => `
                    flex flex-col items-center justify-center py-3 transition-all duration-200 group
                    ${
                      isActive
                        ? "text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text"
                        : `${navStyles.text} ${navStyles.hoverText}`
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`p-2 rounded-lg mb-1 transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/20"
                            : navStyles.inactiveIconBg
                        }`}
                      >
                        <item.icon
                          className={`w-4 h-4 ${
                            isActive ? "text-white" : navStyles.text
                          } group-hover:scale-110 transition-transform`}
                        />
                      </div>
                      <span className="text-xs font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Header;
