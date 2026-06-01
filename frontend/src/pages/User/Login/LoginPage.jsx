import React, { useState } from "react";
import useLogin from "./useLogin";
import { Link } from "react-router-dom";
import {
  LucideMail,
  LucideLock,
  Eye,
  EyeOff,
  Sparkles,
  Mail,
  Brain,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const LoginPage = () => {
  const {
    email,
    password,
    rememberMe,
    loading,
    error,
    setEmail,
    setRememberMe,
    setPassword,
    handleLogin,
  } = useLogin();

  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  // Theme colors
  const themeColors = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      text: "text-gray-100",
      mutedText: "text-gray-400",
      accent: "from-purple-600 to-pink-500",
      accentText:
        "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
      inputBg: "bg-gray-800/50 border-gray-700",
      cardBg: "bg-gray-800/30 backdrop-blur-sm border border-gray-700",
      placeholder: "placeholder-gray-500",
      googleBtn: "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700",
      divider: "border-gray-700",
      linearBg:
        "bg-gradient-to-r from-purple-900/20 via-pink-900/10 to-gray-900/20",
      featureBg: "bg-gray-800/40",
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      text: "text-gray-900",
      mutedText: "text-gray-600",
      accent: "from-purple-500 to-pink-400",
      accentText:
        "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
      inputBg: "bg-white border-gray-300",
      cardBg: "bg-white/70 backdrop-blur-sm border border-gray-200",
      placeholder: "placeholder-gray-400",
      googleBtn: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
      divider: "border-gray-300",
      linearBg: "bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50",
      featureBg: "bg-white/80",
    },
  };

  const colors = themeColors[theme] || themeColors.light;

  // Features list for mobile view
  const features = [
    { icon: Brain, text: "Personalized Growth Paths" },
    { icon: Zap, text: "Daily Mindfulness Exercises" },
    { icon: Sparkles, text: "Progress Tracking" },
  ];

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${colors.bg}`}
    >
      {/* --- Login Form --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full  flex items-center justify-center p-4 sm:p-6 lg:p-8"
      >
        <div
          className={`w-full max-w-md p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl ${colors.cardBg}`}
        >
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${colors.accent} mb-4`}
              >
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className={`text-3xl font-bold ${colors.accentText}`}>
                BrahmaLYF
              </h1>
              <p
                className={`text-sm ${colors.mutedText} uppercase tracking-wider mt-1`}
              >
                Transform Your Life
              </p>
            </div>

            <div className="text-center mb-6">
              <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>
                Welcome Back
              </h2>
              <p className={`text-sm ${colors.mutedText}`}>
                Sign in to continue your journey
              </p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className={`text-3xl font-bold ${colors.text} mb-2`}>
              Sign In to Your Account
            </h2>
            <p className={`text-sm ${colors.mutedText}`}>
              Enter your credentials to access your personalized dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${colors.text}`}>
                Email Address
              </label>
              <div
                className={`flex items-center rounded-xl ${colors.inputBg} border px-4 py-3.5 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}
              >
                <LucideMail className={`w-5 h-5 ${colors.mutedText} mr-3`} />
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
              <div className="flex justify-between items-center">
                <label className={`text-sm font-medium ${colors.text}`}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className={`text-xs font-medium ${colors.accentText} hover:underline`}
                >
                  Forgot Password?
                </Link>
              </div>
              <div
                className={`flex items-center rounded-xl ${colors.inputBg} border px-3 sm:px-4 py-3 sm:py-3.5 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}
              >
                <LucideLock
                  className={`w-5 h-5 ${colors.mutedText} mr-2 sm:mr-3 shrink-0`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`flex-1 min-w-0 bg-transparent outline-none ${colors.text} ${colors.placeholder} text-sm sm:text-base`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`p-1 ${colors.mutedText} hover:text-purple-500 transition-colors shrink-0 ml-1 sm:ml-2`}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={`w-4 h-4 rounded mr-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                }`}
              />
              <label
                htmlFor="remember"
                className={`text-sm ${colors.mutedText}`}
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  theme === "dark"
                    ? "bg-red-900/20 text-red-300 border border-red-800"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">
                    {error.message || "Invalid credentials. Please try again."}
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-6">
              <p className={`text-sm ${colors.mutedText}`}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className={`font-semibold ${colors.accentText} hover:underline transition-all`}
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
