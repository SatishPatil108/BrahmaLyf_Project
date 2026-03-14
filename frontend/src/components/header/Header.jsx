import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useHeader } from "./useHeader";
import UserMenu from "./UserMenu";
import { Sun, Moon, Home, BookOpen, BookMarked, Info, Mail, User2Icon, NotebookTabs } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { assets } from "@/assets/assets";



function Header() {
  const { links, user } = useHeader();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Only apply the scroll effect on the homepage ('/')
    if (location.pathname === '/') {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [location.pathname]);

  const navLinkStyle = ({ isActive }) => `
    inline-flex items-center px-4 py-2.5 rounded-lg whitespace-nowrap font-medium text-sm transition-all duration-200
    ${isActive
      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
      : "text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 backdrop-blur-sm"
    }
  `;

  // Theme toggle button component - Always dark themed for navbar
  const ThemeToggleButton = ({ isMobile = false }) => (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center rounded-full transition-all duration-300 group
        ${isMobile
          ? "w-10 h-10 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50"
          : "w-9 h-9 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50"
        }
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className={`${isMobile ? "w-5 h-5" : "w-4 h-4"} text-gray-300 group-hover:scale-110 transition-transform`} />
      ) : (
        <Sun className={`${isMobile ? "w-5 h-5" : "w-4 h-4"} text-gray-300 group-hover:scale-110 transition-transform`} />
      )}
    </button>
  );

  // Define bottom navigation items explicitly
  const bottomNavItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/categories", label: "Categories", icon: BookOpen },
    { to: "/about", label: "About", icon: Info },
    { to: "/contact", label: "Contact", icon: Mail },
  ];
  if (!user) {
    bottomNavItems.push({ to: "/login", label: "Login", icon: User2Icon });
  } else {
    bottomNavItems.splice(2, 0, { to: "/my-courses", label: "Courses", icon: BookMarked });
    bottomNavItems.splice(2, 0, { to: "/notes", label: "Notes", icon: NotebookTabs });
    // bottomNavItems.push({ to: "/notes", label: "Notes", icon: NotebookTabs });

  }

  // Dark theme styles for navbar
  const darkNavStyles = {
    header: "bg-gray-900/95 backdrop-blur-md border-b border-gray-800",
    bottomNav: "bg-gray-900/95 backdrop-blur-md border-t border-gray-800",
    text: "text-gray-300",
    hoverText: "hover:text-gray-100",
    logoGradient: "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent",
    inactiveIconBg: "bg-gray-800/50 hover:bg-gray-700/50"
  };

  return (
    <>
      {/* Desktop Header - NOT fixed, regular flow */}
      <div className="hidden lg:block">
        <header
          className={`w-full transition-all duration-500 ${isScrolled
            ? `${darkNavStyles.header} shadow-lg`
            : "bg-gray-900"
            }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <NavLink to="/" className="flex items-center">
                <div className="h-20 flex items-center">
                  <img
                    src={assets.logo}
                    alt="BrahmaLyf Logo"
                    className="h-full w-auto object-contain"
                  />
                </div>
              </NavLink>

              {/* Navigation */}
              <nav aria-label="Main navigation" className="flex items-center gap-4">
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

                {/* Theme Toggle - Desktop */}
                <div className="ml-2">
                  <ThemeToggleButton />
                </div>

                {/* User Menu */}
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

      {/* Mobile Header - Fixed at top with UserMenu and Theme toggle */}
      <div className="lg:hidden">
        <header className={`sticky top-0 left-0 w-full z-50 ${darkNavStyles.header}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo - Mobile */}
              <NavLink to="/" className="flex items-center gap-2">
                <img
                  src={assets.logo}
                  alt="BrahmaLyf Logo"
                  className="h-18 w-auto object-contain"
                />
              </NavLink>

              {/* Right side - Theme toggle and User Menu */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle - Mobile */}
                <div className="mr-1">
                  <ThemeToggleButton isMobile={true} />
                </div>

                {/* User Menu - Mobile */}
                {user && (
                  <div className="ml-1">
                    <UserMenu />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Bottom Navigation - Fixed at bottom */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 ${darkNavStyles.bottomNav} z-40 shadow-xl`}
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
                    ${isActive
                      ? "text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text"
                      : `${darkNavStyles.text} ${darkNavStyles.hoverText}`
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`p-2 rounded-lg mb-1 transition-all ${isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/20"
                        : `${darkNavStyles.inactiveIconBg}`
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${isActive ? "text-white" : darkNavStyles.text} group-hover:scale-110 transition-transform`} />
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