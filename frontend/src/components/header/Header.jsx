import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Home,
  Mail,
  FileSpreadsheetIcon,
  User2Icon,
  BookMarked,
  NotebookTabs,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useHeader } from "./useHeader";
import { assets } from "@/assets/assets";
import UserMenu from "./UserMenu";

// ─── Logo ────────────────────────────────────────────────────────────────────

function Logo({ isDark }) {
  return (
    <NavLink
      to="/"
      onClick={() => window.scrollTo(0, 0)}
      aria-label="BrahmaLyf — go to homepage"
      className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded-lg"
    >
      <div
        className="h-16 lg:h-20 flex items-center"
        style={{ background: "transparent" }}
      >
        <img
          src={isDark ? assets.logo_dark : assets.logo_light}
          alt="BrahmaLyf Logo"
          className="h-full w-auto object-contain"
        />
      </div>
    </NavLink>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle({ isDark, onToggle, size = "sm" }) {
  const dim = size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const iconSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={`
        ${dim} flex items-center justify-center rounded-xl
        border transition-all duration-200 active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
        ${
          isDark
            ? "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20"
            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
        }
      `}
    >
      {isDark ? (
        <Sun className={iconSize} aria-hidden="true" />
      ) : (
        <Moon className={iconSize} aria-hidden="true" />
      )}
    </button>
  );
}

// ─── Desktop Nav Link ─────────────────────────────────────────────────────────

function DesktopNavLink({ to, label }) {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <NavLink
      to={to}
      onClick={() => window.scrollTo(0, 0)}
      aria-current={isActive ? "page" : undefined}
      className={`
        relative px-3.5 py-2 text-sm font-medium rounded-lg
        transition-all duration-200 group whitespace-nowrap
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
        ${
          isActive
            ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.06]"
        }
      `}
    >
      {label}
      {/* Animated underline */}
      <span
        aria-hidden="true"
        className={`
          absolute bottom-1 left-3.5 right-3.5 h-[1.5px] rounded-full
          bg-gradient-to-r from-violet-500 to-indigo-500
          transition-transform duration-200 origin-left
          ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
        `}
      />
    </NavLink>
  );
}

// ─── Desktop Header ──────────────────────────────────────────────────────────

function DesktopHeader({ links, user, isDark, scrolled, toggleTheme }) {
  return (
    <header
      className={`
        hidden lg:block sticky top-0 z-50 w-full
        transition-all duration-300
        ${
          scrolled
            ? isDark
              ? "bg-gray-900/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_32px_-8px_rgba(0,0,0,0.4)]"
              : "bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_32px_-8px_rgba(0,0,0,0.10)]"
            : isDark
              ? "bg-gray-900 border-b border-transparent"
              : "bg-white border-b border-transparent"
        }
      `}
    >
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6"
      >
        <Logo isDark={isDark} />

        {/* Nav links */}
        <ul className="flex items-center gap-1" role="list">
          {links.map((link) => (
            <li key={link.to} role="listitem">
              <DesktopNavLink to={link.to} label={link.label} />
            </li>
          ))}
        </ul>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          {user && <UserMenu />}
        </div>
      </nav>
    </header>
  );
}

// ─── Mobile Header ─────────────────────────────────────────────────────────────

function MobileHeader({ isDark, toggleTheme, user }) {
  return (
    <header
      className={`
        lg:hidden sticky top-0 z-50 w-full
        ${
          isDark
            ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800"
            : "bg-white/95 backdrop-blur-md border-b border-gray-200"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo isDark={isDark} />
          <div className="flex items-center gap-2">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} size="lg" />
            {user && <UserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

function MobileBottomNav({ user, isDark }) {
  const location = useLocation();

  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/contact", label: "Contact", icon: Mail },
    { to: "/trial-resources", label: "Trial", icon: FileSpreadsheetIcon },
    { to: "/categories", label: "Courses", icon: BookOpen },
  ];

  if (!user) {
    items.push({ to: "/login", label: "Login", icon: User2Icon });
  } else {
    items.splice(
      2,
      0,
      { to: "/notes", label: "Notes", icon: NotebookTabs },
      { to: "/my-courses", label: "Enrolled", icon: BookMarked },
    );
  }

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-40
        ${
          isDark
            ? "bg-gray-900/95 backdrop-blur-md border-t border-gray-800"
            : "bg-white/95 backdrop-blur-md border-t border-gray-200"
        }
        shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.12)]
      `}
    >
      <ul className="flex justify-around items-center max-w-7xl mx-auto">
        {items.map(({ to, label, icon: Icon }) => {
          const isActive =
            location.pathname === to ||
            (to !== "/" && location.pathname.startsWith(to));
          return (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                onClick={() => window.scrollTo(0, 0)}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center justify-center py-3 group focus-visible:outline-none"
              >
                <div
                  className={`
                    p-2 rounded-xl mb-1 transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25"
                        : isDark
                          ? "bg-white/5 group-hover:bg-white/10"
                          : "bg-gray-100 group-hover:bg-gray-200"
                    }
                  `}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-white"
                        : isDark
                          ? "text-gray-300"
                          : "text-gray-600"
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold tracking-wide uppercase ${
                    isActive
                      ? "text-violet-600 dark:text-violet-400"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Header() {
  const { links, user } = useHeader();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isDark = theme === "dark";

  // Scroll detection — rAF throttled, passive listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On non-home pages, always show scrolled style
  useEffect(() => {
    if (location.pathname !== "/") setScrolled(true);
  }, [location.pathname]);

  return (
    <>
      <DesktopHeader
        links={links}
        user={user}
        isDark={isDark}
        scrolled={scrolled}
        toggleTheme={toggleTheme}
      />
      <MobileHeader isDark={isDark} toggleTheme={toggleTheme} user={user} />
      <MobileBottomNav user={user} isDark={isDark} />
    </>
  );
}
