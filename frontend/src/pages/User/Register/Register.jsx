import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useRegister from "./useRegister";
import { useTheme } from "@/contexts/ThemeContext";

import {
  Brain,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

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
    loading,
    error,
    registerSuccess,
    passwordStrength,
    handleRegister,
    validatePassword,
  } = useRegister();

  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strengthLabel = [
    "",
    "Very Weak",
    "Weak",
    "Good",
    "Strong",
    "Excellent",
  ];

  // ─── Theme token map ───────────────────────────────────────────────────────────
  const themeTokens = {
    light: {
      pageBg: "bg-gray-50",
      headingText: "text-gray-900",
      bodyText: "text-gray-500",
      labelText: "text-gray-700",
      inputBg: "bg-white",
      inputBorder: "border-gray-200",
      inputHover: "hover:border-gray-300",
      inputText: "text-gray-900",
      inputPlaceholder: "placeholder-gray-400",
      inputFocusBorder: "focus:border-violet-500",
      inputFocusRing: "focus:ring-violet-500/10",
      inputFocusShadow: "focus:shadow-[0_0_0_1px_#8b5cf6]",
      eyeButton: "text-gray-400 hover:text-gray-600",
      strengthBarBg: "bg-gray-200",
      strengthText: "text-gray-500",
      errorBorder: "border-red-200",
      errorBg: "bg-red-50",
      errorText: "text-red-700",
      successBorder: "border-emerald-200",
      successBg: "bg-emerald-50",
      successIcon: "text-emerald-600",
      successText: "text-emerald-700",
      buttonBg: "bg-violet-600 hover:bg-violet-700",
      buttonShadow: "hover:shadow-violet-500/25",
      buttonFocusRing: "focus:ring-violet-500/40",
      dividerLine: "bg-gray-200",
      dividerText: "text-gray-400",
      signupText: "text-gray-500",
      signupLink: "text-gray-900 hover:text-violet-600",
      trustText: "text-gray-400",
      trustLink: "hover:text-gray-600",
      forgotLink: "text-violet-600 hover:text-violet-700",
    },
    dark: {
      pageBg: "bg-gray-950",
      headingText: "text-white",
      bodyText: "text-gray-400",
      labelText: "text-gray-300",
      inputBg: "bg-gray-800/60",
      inputBorder: "border-gray-700",
      inputHover: "hover:border-gray-600",
      inputText: "text-gray-100",
      inputPlaceholder: "placeholder-gray-500",
      inputFocusBorder: "focus:border-violet-400",
      inputFocusRing: "focus:ring-violet-400/10",
      inputFocusShadow: "focus:shadow-[0_0_0_1px_#a78bfa]",
      eyeButton: "text-gray-400 hover:text-gray-300",
      strengthBarBg: "bg-gray-800",
      strengthText: "text-gray-400",
      errorBorder: "border-red-800/60",
      errorBg: "bg-red-900/20",
      errorText: "text-red-300",
      successBorder: "border-emerald-800/60",
      successBg: "bg-emerald-900/20",
      successIcon: "text-emerald-400",
      successText: "text-emerald-300",
      buttonBg: "bg-violet-500 hover:bg-violet-600",
      buttonShadow: "hover:shadow-violet-500/25",
      buttonFocusRing: "focus:ring-violet-500/40",
      dividerLine: "bg-gray-800",
      dividerText: "text-gray-600",
      signupText: "text-gray-400",
      signupLink: "text-white hover:text-violet-400",
      trustText: "text-gray-600",
      trustLink: "hover:text-gray-400",
      forgotLink: "text-violet-400 hover:text-violet-300",
    },
  };

  const currentTheme = themeTokens[theme === "dark" ? "dark" : "light"];

  return (
    <div className={`min-h-screen ${currentTheme.pageBg} flex flex-col`}>
      {/* Centered form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px]"
        >
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h2
              className={`text-2xl font-bold ${currentTheme.headingText} tracking-tight mb-1.5`}
            >
              Create Account
            </h2>
            <p className={`text-sm ${currentTheme.bodyText}`}>
              Start your journey in less than a minute.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* NAME */}
            <div className="space-y-1.5">
              <label
                className={`block text-sm font-medium ${currentTheme.labelText}`}
              >
                Full Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className={`
                    w-full rounded-xl border ${currentTheme.inputBorder}
                    ${currentTheme.inputBg}
                    px-4 py-3
                    text-sm ${currentTheme.inputText}
                    ${currentTheme.inputPlaceholder}
                    outline-none
                    transition-all duration-200
                    ${currentTheme.inputHover}
                    ${currentTheme.inputFocusBorder}
                    focus:ring-3 ${currentTheme.inputFocusRing}
                    ${currentTheme.inputFocusShadow}
                  `}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label
                className={`block text-sm font-medium ${currentTheme.labelText}`}
              >
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={`
                    w-full rounded-xl border ${currentTheme.inputBorder}
                    ${currentTheme.inputBg}
                    px-4 py-3
                    text-sm ${currentTheme.inputText}
                    ${currentTheme.inputPlaceholder}
                    outline-none
                    transition-all duration-200
                    ${currentTheme.inputHover}
                    ${currentTheme.inputFocusBorder}
                    focus:ring-3 ${currentTheme.inputFocusRing}
                    ${currentTheme.inputFocusShadow}
                  `}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <label
                className={`block text-sm font-medium ${currentTheme.labelText}`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  placeholder="Create password"
                  required
                  className={`
                    w-full rounded-xl border ${currentTheme.inputBorder}
                    ${currentTheme.inputBg}
                    px-4 pr-12 py-3
                    text-sm ${currentTheme.inputText}
                    ${currentTheme.inputPlaceholder}
                    outline-none
                    transition-all duration-200
                    ${currentTheme.inputHover}
                    ${currentTheme.inputFocusBorder}
                    focus:ring-3 ${currentTheme.inputFocusRing}
                    ${currentTheme.inputFocusShadow}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150 ${currentTheme.eyeButton}`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div
                        key={item}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                          item <= passwordStrength
                            ? passwordStrength <= 2
                              ? "bg-red-500"
                              : passwordStrength <= 3
                                ? "bg-yellow-500"
                                : "bg-emerald-500"
                            : currentTheme.strengthBarBg
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${currentTheme.strengthText}`}>
                    {strengthLabel[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1.5">
              <label
                className={`block text-sm font-medium ${currentTheme.labelText}`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className={`
                    w-full rounded-xl border ${currentTheme.inputBorder}
                    ${currentTheme.inputBg}
                    px-4 pr-12 py-3
                    text-sm ${currentTheme.inputText}
                    ${currentTheme.inputPlaceholder}
                    outline-none
                    transition-all duration-200
                    ${currentTheme.inputHover}
                    ${currentTheme.inputFocusBorder}
                    focus:ring-3 ${currentTheme.inputFocusRing}
                    ${currentTheme.inputFocusShadow}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150 ${currentTheme.eyeButton}`}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR STATE */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl border ${currentTheme.errorBorder} ${currentTheme.errorBg} px-4 py-3`}
                >
                  <p
                    className={`text-sm ${currentTheme.errorText} font-medium`}
                  >
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUCCESS STATE */}
            <AnimatePresence>
              {registerSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center gap-2 rounded-xl border ${currentTheme.successBorder} ${currentTheme.successBg} px-4 py-3`}
                >
                  <Check size={16} className={currentTheme.successIcon} />
                  <p
                    className={`text-sm ${currentTheme.successText} font-medium`}
                  >
                    Registration successful! Redirecting...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUBMIT BUTTON */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className={`
                  relative w-full py-3 px-6 rounded-xl
                  ${currentTheme.buttonBg}
                  text-white text-sm font-semibold
                  transition-all duration-200
                  shadow-lg ${currentTheme.buttonShadow}
                  active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
                  focus:outline-none focus:ring-3 ${currentTheme.buttonFocusRing}
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="6"
                        stroke="currentColor"
                        strokeOpacity="0.25"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M14 8a6 6 0 0 0-6-6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Start Your Journey"
                )}
              </button>
            </div>

            {/* DIVIDER */}
            <div className="relative flex items-center gap-3 my-6">
              <div className={`flex-1 h-px ${currentTheme.dividerLine}`} />
              <span
                className={`text-xs ${currentTheme.dividerText} font-medium`}
              >
                or
              </span>
              <div className={`flex-1 h-px ${currentTheme.dividerLine}`} />
            </div>

            {/* SIGN IN LINK */}
            <p className={`text-center text-sm ${currentTheme.signupText}`}>
              Already have an account?{" "}
              <Link
                to="/login"
                className={`font-semibold transition-colors duration-150 ${currentTheme.signupLink}`}
              >
                Sign in →
              </Link>
            </p>

            {/* TRUST SIGNAL */}
            <p className={`text-center text-xs ${currentTheme.trustText} mt-8`}>
              By continuing you agree to our{" "}
              <Link
                to="/terms"
                className={`underline underline-offset-2 transition-colors ${currentTheme.trustLink}`}
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className={`underline underline-offset-2 transition-colors ${currentTheme.trustLink}`}
              >
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
