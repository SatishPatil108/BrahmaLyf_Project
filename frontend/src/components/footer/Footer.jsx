import React, { memo, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../../assets/assets.js";

// Optimized icon imports
import {
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle,
  XCircle,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import useFooter from "./useFooter.js";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Memoized component for better performance
const Footer = memo(() => {
  const {
    theme,
    currentYear,
    txtEmail,
    handleSubmit,
    linkSections,
    colors,
    responseObj,
    setResponseObj,
  } = useFooter();

  const renderedLinkSections = useMemo(
    () => (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
        {linkSections.map((section, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3
              className={`text-sm font-semibold uppercase tracking-wider ${colors.headingText}`}
            >
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <Link
                    to={link.path}
                    className={`text-sm ${colors.linkText} ${colors.linkHover} transition-colors duration-200 inline-flex items-center group`}
                  >
                    <ArrowRight className="w-3 h-3 mr-0 opacity-0 group-hover:mr-2 group-hover:opacity-100 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    ),
    [linkSections, colors],
  );

  return (
    <footer
      className={`relative w-full bg-gradient-to-b ${colors.footerBg} border-t ${colors.footerBorder} overflow-hidden`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Main Footer Content */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-2"
        >
          {/* Brand Section - Reduced from 4 to 3 columns */}
          <motion.div variants={fadeInUp} className="lg:col-span-3 space-y-6">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={assets.favicon}
                    alt="BrahmaLyf"
                    className="w-12 h-12 rounded-lg border border-purple-500"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </motion.div>
                <div>
                  <h2
                    className={`text-2xl font-bold bg-gradient-to-r ${theme === "dark" ? "from-purple-600 to-pink-600" : "from-purple-500 to-purple-700"} bg-clip-text text-transparent`}
                  >
                    BrahmaLYF
                  </h2>
                  <p
                    className={`text-xs ${theme === "dark" ? "text-pink-400" : "text-purple-500"}`}
                  >
                    Transform Your Life
                  </p>
                </div>
              </div>
            </Link>

            <p className={`${colors.descriptionText} leading-relaxed text-sm`}>
              Empowering individuals to grow, heal, and transform through
              world-class coaching and mindful programs. Join thousands of
              transformed lives worldwide.
            </p>
          </motion.div>

          {/* Quick Links Sections - Reduced from 5 to 4 columns */}
          <div className="lg:col-span-5">{renderedLinkSections}</div>

          {/* Newsletter Section - Increased from 3 to 4 columns for wider card */}
          <motion.div variants={fadeInUp} className="lg:col-span-4">
            <div className="text-sm space-y-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <h2 className={`font-semibold mb-5 ${colors.headingText}`}>
                    Subscribe to our newsletter
                  </h2>
                  <div className="text-sm space-y-2">
                    <p className={colors.newsletterText}>
                      The latest news, articles, and resources, sent to your
                      inbox weekly.
                    </p>
                    <div className="flex items-center gap-2 pt-4">
                      <input
                        className={`border ${colors.inputBg} ${colors.inputPlaceholder} focus:ring-2 ${colors.inputFocus} outline-none w-full max-w-64 h-9 rounded px-2 ${colors.text}`}
                        type="email"
                        ref={txtEmail}
                        placeholder="Enter your email"
                      />
                      <button
                        type="submit"
                        className={`${colors.buttonBg} w-24 h-9 ${colors.buttonText} rounded cursor-pointer flex items-center justify-center transition-colors duration-200 font-semibold`}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={`pt-4 mt-2 border-t ${colors.footerBorder}`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className={`${colors.copyrightText} text-center md:text-left`}>
              <Link
                to="/copyright"
                className={`hover:${colors.linkHover} transition-colors`}
              >
                © {currentYear} BrahmaLYF. All rights reserved.
              </Link>
            </div>

            <div className={`flex items-center gap-2 ${colors.poweredByText}`}>
              <span className="text-sm">Powered by</span>
              <motion.a
                href="https://aavidsoft.in"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="block"
              >
                <img
                  src={assets.aavidsoft_logo}
                  alt="AavidSoft Logo"
                  className="h-4 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
