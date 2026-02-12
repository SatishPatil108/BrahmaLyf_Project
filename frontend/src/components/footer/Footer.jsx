import React, { useRef } from "react";
import { Link } from "react-router-dom";
import useFooter from "./useFooter";
import { Heart, Send, Sparkles, ChevronRight, MapPin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

function Footer() {
  const {
    theme,
    currentYear,
    txtEmail,
    handleSubmit,
    linkSections,
    socialLinks,
    contactInfo,
    colors,
    responseObj,
  } = useFooter();

  return (
    <footer className={`${colors.bg} w-full border-t ${colors.border}`}>
      {/* Main Content - Compact Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Top Section - Brand + Links in Condensed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-8">
          {/* Brand - Takes more space on large screens */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.accent} flex items-center justify-center shadow-md`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className={`text-xl font-bold ${colors.accentText} group-hover:opacity-80 transition-opacity`}>
                    BrahmaLYF
                  </h2>
                  <p className={`text-xs ${colors.mutedText}`}>
                    Transform Your Life
                  </p>
                </div>
              </div>
            </Link>

            <p className={`text-sm leading-relaxed ${colors.mutedText} max-w-sm`}>
              Empowering individuals to grow, heal, and transform through
              world-class coaching and mindful programs.
            </p>

            {/* Social Links - Moved here for better flow */}
            <div className="flex items-center gap-2 ">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${colors.socialBg} ${colors.socialText}`}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links - Compact */}
          <div className="lg:col-span-2">
            <h3 className={`text-sm font-semibold ${colors.text} mb-4 pt-3 uppercase tracking-wide`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Courses", path: "/courses" },
                { name: "Categories", path: "/categories" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors ${colors.mutedText} ${colors.hoverText} hover:translate-x-1 inline-block`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs - Compact */}
          <div className="lg:col-span-2">
            <h3 className={`text-sm font-semibold ${colors.text} mb-4 pt-3 uppercase tracking-wide`}>
              Programs
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Mindfulness", path: "/programs/mindfulness" },
                { name: "Life Coaching", path: "/programs/coaching" },
                { name: "Stress Relief", path: "/programs/stress" },
                { name: "Leadership", path: "/programs/leadership" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors ${colors.mutedText} ${colors.hoverText} hover:translate-x-1 inline-block`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - Compact */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              <div>
                <h3 className={`text-sm font-semibold ${colors.text} mb-4 uppercase tracking-wide`}>
                  <Send className={`w-4 h-4 ${colors.accentText}`} />
                  Newsletter
                </h3>
                <p className={`text-xs  ${colors.mutedText}`}>
                  Get weekly insights and tips delivered to your inbox.
                </p>
              </div>

              {/* Newsletter Form - Compact */}
              <form className="space-y-2" onSubmit={handleSubmit}>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    ref={txtEmail}
                    required
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 ${colors.inputBg} ${colors.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  <button
                    type="submit"
                    disabled={responseObj.loading}
                    className={`px-4 py-2 bg-gradient-to-r ${colors.accent} text-white text-sm rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50`}
                  >
                    {responseObj.loading ? "..." : "Join"}
                  </button>
                </div>

                {responseObj.res && (
                  <p className="text-xs text-green-600">
                    {responseObj.res.message}
                  </p>
                )}

                {responseObj.error && (
                  <p className="text-xs text-red-600">{responseObj.error}</p>
                )}
              </form>

              {/* Contact Info - Compact */}
              <div className="space-y-2">
                {contactInfo.slice(0, 2).map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${colors.mutedText}`}
                  >
                    <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${colors.accentText}`} />
                    <span className="text-xs">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact and Clean */}
        <div className={`pt-6 border-t ${colors.border}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
            {/* Copyright */}
            <div className={`${colors.mutedText} text-center sm:text-left order-2 sm:order-1`}>
              © {currentYear} BrahmaLYF. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 order-1 sm:order-2">
              {["Terms", "Privacy", "Cookies"].map((item, index) => (
                <Link
                  key={index}
                  to={`/${item.toLowerCase()}`}
                  className={`transition-colors ${colors.mutedText} ${colors.hoverText}`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Made with love */}
            <div className={`flex items-center gap-1.5 ${colors.mutedText} order-3`}>
              Made with
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
              by AAVID SOFT
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;