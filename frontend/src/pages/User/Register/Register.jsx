import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useRegister from "./useRegister";
import {
  LucideUser,
  LucideMail,
  LucideLock,
  LucideCheck,
  LucideX,
  LucideSmartphone,
  LucideCalendar,
  // LucideVenusMars,
  Sparkles,
  Brain,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const RegisterPage = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    contactNumber,
    setContactNumber,
    dob,
    setDob,
    gender,
    setGender,
    loading,
    error,
    registerSuccess,
    passwordStrength,
    handleRegister,
    validatePassword
  } = useRegister();

  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Theme colors matching login page
  const themeColors = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      text: "text-gray-100",
      mutedText: "text-gray-400",
      accent: "from-purple-600 to-pink-500",
      accentText: "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
      inputBg: "bg-gray-800/50 border-gray-700",
      cardBg: "bg-gray-800/30 backdrop-blur-sm border border-gray-700",
      placeholder: "placeholder-gray-500",
      googleBtn: "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700",
      divider: "border-gray-700",
      gradientBg: "bg-gradient-to-r from-purple-900/20 via-pink-900/10 to-gray-900/20",
      featureBg: "bg-gray-800/40",
      successBg: "bg-green-900/20 border-green-800 text-green-300",
      errorBg: "bg-red-900/20 border-red-800 text-red-300"
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      text: "text-gray-900",
      mutedText: "text-gray-600",
      accent: "from-purple-500 to-pink-400",
      accentText: "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
      inputBg: "bg-white border-gray-300",
      cardBg: "bg-white/70 backdrop-blur-sm border border-gray-200",
      placeholder: "placeholder-gray-400",
      googleBtn: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
      divider: "border-gray-300",
      gradientBg: "bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50",
      featureBg: "bg-white/80",
      successBg: "bg-green-50 border-green-200 text-green-600",
      errorBg: "bg-red-50 border-red-200 text-red-600"
    }
  };

  const colors = themeColors[theme] || themeColors.light;

  // Password strength indicators
  const passwordRequirements = [
    { text: "At least 6 characters", met: password.length >= 6 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { text: "Contains number", met: /[0-9]/.test(password) },
    { text: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  // Features for desktop view
  const features = [
    { icon: Sparkles, text: "Personalized Growth Paths" },
    { icon: Brain, text: "Daily Mindfulness Exercises" },
    { icon: LucideCheck, text: "Progress Tracking" }
  ];

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${colors.bg}`}>
      {/* --- Registration Form --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full flex items-center justify-center p-4 sm:p-6 lg:p-8"
      >
        <div className={`w-full max-w-md p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl ${colors.cardBg}`}>
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${colors.accent} mb-4`}>
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className={`text-3xl font-bold ${colors.accentText}`}>
                BrahmaLYF
              </h1>
              <p className={`text-sm ${colors.mutedText} uppercase tracking-wider mt-1`}>
                Transform Your Life
              </p>
            </div>

            <div className="text-center mb-6">
              <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>
                Create Account
              </h2>
              <p className={`text-sm ${colors.mutedText}`}>
                Start your transformation journey
              </p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className={`text-3xl font-bold ${colors.text} mb-2`}>
              Create Your Account
            </h2>
            <p className={`text-sm ${colors.mutedText}`}>
              Fill in the required details to get started
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                <LucideUser className="w-4 h-4" />
                Full Name *
              </label>
              <div className={`flex items-center rounded-xl ${colors.inputBg} border px-4 py-3.5 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`flex-1 bg-transparent outline-none ${colors.text} ${colors.placeholder} text-sm sm:text-base`}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                <LucideMail className="w-4 h-4" />
                Email Address *
              </label>
              <div className={`flex items-center rounded-xl ${colors.inputBg} border px-4 py-3.5 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex-1 bg-transparent outline-none ${colors.text} ${colors.placeholder} text-sm sm:text-base`}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                <LucideLock className="w-4 h-4 flex-shrink-0" />
                Password *
              </label>
              <div className={`flex items-center rounded-xl ${colors.inputBg} border px-3 sm:px-4 py-3 sm:py-3.5 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`flex-1 min-w-0 bg-transparent outline-none ${colors.text} ${colors.placeholder} text-sm sm:text-base pr-2`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`p-1 ${colors.mutedText} hover:text-purple-500 transition-colors flex-shrink-0`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2 pt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all ${i <= passwordStrength
                            ? theme === 'dark' ? 'bg-green-500' : 'bg-green-400'
                            : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {passwordRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {req.met ? (
                          <LucideCheck className="w-3 h-3 text-green-500 flex-shrink-0" />
                        ) : (
                          <LucideX className="w-3 h-3 text-red-500 flex-shrink-0" />
                        )}
                        <span className={req.met ? "text-green-500" : colors.mutedText}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${colors.text}`}>
                Confirm Password *
              </label>
              <div className={`flex items-center rounded-xl ${colors.inputBg} border px-3 sm:px-4 py-3 sm:py-3.5 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`flex-1 min-w-0 bg-transparent outline-none ${colors.text} ${colors.placeholder} text-sm sm:text-base pr-2`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`p-1 ${colors.mutedText} hover:text-purple-500 transition-colors flex-shrink-0`}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Toggle Optional Fields */}
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className={`w-full text-sm font-medium ${colors.accentText} hover:underline transition-colors`}
            >
              {showOptionalFields ? "Hide optional fields" : "+ Add optional information (phone, gender, etc.)"}
            </button>

            {/* Optional Fields */}
            {showOptionalFields && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 pt-4 border-t border-gray-700"
              >
                {/* Contact Number */}
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                    <LucideSmartphone className="w-4 h-4" />
                    Contact Number
                  </label>
                  <div className={`flex items-center rounded-xl ${colors.inputBg} border px-4 py-3.5 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                    <input
                      type="tel"
                      placeholder="10-digit number (optional)"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`flex-1 bg-transparent outline-none ${colors.text} ${colors.placeholder} text-sm sm:text-base`}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                    {/* <LucideVenusMars className="w-4 h-4" /> */}
                    Gender
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: null, label: "Prefer not to say" },
                      { value: 1, label: "Male" },
                      { value: 0, label: "Female" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setGender(option.value)}
                        className={`flex-1 py-2.5 px-4 rounded-xl border transition-all ${gender === option.value
                          ? `bg-gradient-to-r ${colors.accent} text-white border-transparent`
                          : `${colors.inputBg} ${colors.text} hover:border-purple-500`
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${colors.errorBg}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {registerSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${colors.successBg}`}
              >
                <div className="flex items-center gap-2">
                  <LucideCheck className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">
                    Registration successful! Redirecting to login...
                  </span>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 bg-gradient-to-r ${colors.accent} text-white font-semibold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : "Create Account"}
            </button>

            {/* Terms and Conditions */}
            <p className={`text-xs text-center ${colors.mutedText} pt-4`}>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className={`${colors.accentText} hover:underline`}>
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className={`${colors.accentText} hover:underline`}>
                Privacy Policy
              </Link>
            </p>

            {/* Login Link */}
            <div className="text-center">
              <p className={`text-sm ${colors.mutedText}`}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className={`font-semibold ${colors.accentText} hover:underline transition-all`}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;