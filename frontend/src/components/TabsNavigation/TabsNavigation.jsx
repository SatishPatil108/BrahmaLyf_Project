import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const TabsNavigation = ({ tabs, activeSection, onTabClick, theme, styles }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (id) => {
    onTabClick(id);
    setIsMobileMenuOpen(false);
  };

  const activeTab = tabs.find((t) => t.id === activeSection);

  return (
    <div
      className={`sticky top-0 z-40 backdrop-blur-sm border-b `}
    >
      <div className={`max-w-6xl  px-4 sm:px-6 lg:px-16`}>
        {/* ── Desktop ───────────────────────────────────────────── */}
        <nav
          role="tablist"
          aria-label="Course sections"
          className={`hidden md:flex items-center gap-1  overflow-x-auto scrollbar-hide ${styles.cardBg}`}
        >
          {tabs.map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`section-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-4 text-sm font-medium
                  transition-all duration-200 border-b-2 relative whitespace-nowrap
                  ${
                    isActive
                      ? styles.tabActive
                      : `${styles.tabInactive} border-transparent ${styles.tabInactiveBorder}`
                  }
                `}
              >
                <span aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Mobile dropdown ───────────────────────────────────── */}
        <div className={`md:hidden py-3 relative`}>
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-expanded={isMobileMenuOpen}
            aria-haspopup="listbox"
            aria-label="Select course section"
            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span aria-hidden="true">{activeTab?.icon}</span>
              <span className={`font-medium ${styles.textPrimary}`}>
                {activeTab?.label}
              </span>
            </div>
            <ChevronDown
              aria-hidden="true"
              className={`w-5 h-5 transition-transform duration-200 ${
                isMobileMenuOpen ? "rotate-180" : ""
              } ${styles.textMuted}`}
            />
          </button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.ul
                role="listbox"
                aria-label="Course sections"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute left-0 right-0 mt-2 mx-0 rounded-xl shadow-lg border z-50 overflow-hidden ${styles.cardBg} ${styles.cardBorder}`}
              >
                {tabs.map((tab, idx) => (
                  <li
                    key={tab.id}
                    role="option"
                    aria-selected={activeSection === tab.id}
                  >
                    <button
                      onClick={() => handleTabClick(tab.id)}
                      className={`
                        flex items-center gap-3 w-full px-4 py-3 text-left
                        transition-all duration-200
                        ${
                          activeSection === tab.id
                            ? theme === "dark"
                              ? "bg-indigo-950/20 text-indigo-400"
                              : "bg-indigo-50 text-indigo-600"
                            : `${styles.tabInactive} hover:bg-gray-50 dark:hover:bg-gray-800`
                        }
                        ${idx !== tabs.length - 1 ? `border-b ${styles.divider}` : ""}
                      `}
                    >
                      <span aria-hidden="true">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TabsNavigation;
