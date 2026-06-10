import React, { useState } from "react";
import useLogin from "./useLogin";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, Eye, EyeOff, Lock, Mail } from "lucide-react";

// ─── Theme token map ───────────────────────────────────────────────────────────

const THEME = {
  light: {
    // Page
    pageBg: "bg-gray-50",
    // Card / surface
    cardBg: "bg-white",
    cardBorder: "border-gray-200",
    // Typography
    headingText: "text-gray-900",
    bodyText: "text-gray-500",
    labelText: "text-gray-700",
    mutedText: "text-gray-400",
    // Input
    inputBg: "bg-white",
    inputBorder: "border-gray-200",
    inputHover: "hover:border-gray-300",
    inputText: "text-gray-900",
    inputPlaceholder: "placeholder-gray-400",
    // Checkbox
    checkboxUnchecked: "bg-white border-gray-300",
    checkboxLabel: "text-gray-600",
    // Divider
    dividerLine: "bg-gray-200",
    dividerText: "text-gray-400",
    // Sign-up row
    signupText: "text-gray-500",
    signupLink: "text-gray-900 hover:text-violet-600",
    // Trust text
    trustText: "text-gray-400",
    trustLink: "hover:text-gray-600",
    // Error
    errorBorder: "border-red-200",
    errorBg: "bg-red-50",
    errorText: "text-red-700",
    // Misc
    forgotLink: "text-violet-600 hover:text-violet-700",
  },
  dark: {
    pageBg: "bg-gray-950",
    cardBg: "bg-gray-900",
    cardBorder: "border-gray-800",
    headingText: "text-white",
    bodyText: "text-gray-400",
    labelText: "text-gray-300",
    mutedText: "text-gray-500",
    inputBg: "bg-gray-800/60",
    inputBorder: "border-gray-700",
    inputHover: "hover:border-gray-600",
    inputText: "text-gray-100",
    inputPlaceholder: "placeholder-gray-500",
    checkboxUnchecked: "bg-gray-800 border-gray-600",
    checkboxLabel: "text-gray-400",
    dividerLine: "bg-gray-800",
    dividerText: "text-gray-600",
    signupText: "text-gray-400",
    signupLink: "text-white hover:text-violet-400",
    trustText: "text-gray-600",
    trustLink: "hover:text-gray-400",
    errorBorder: "border-red-800/60",
    errorBg: "bg-red-900/20",
    errorText: "text-red-300",
    forgotLink: "text-violet-400 hover:text-violet-300",
  },
};

// ─── InputField ────────────────────────────────────────────────────────────────

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  icon: Icon,
  rightSlot,
  autoComplete,
  t,
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className={`block text-sm font-medium ${t.labelText}`}>
      {label}
    </label>
    <div className="relative group">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <Icon
          className={`w-[18px] h-[18px] ${t.mutedText} group-focus-within:text-violet-500 transition-colors duration-200`}
        />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`
          w-full rounded-xl border ${t.inputBorder} ${t.inputBg} ${t.inputHover}
          pl-10 pr-10 py-3
          text-sm ${t.inputText} ${t.inputPlaceholder}
          outline-none transition-all duration-200
          focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10
          focus:shadow-[0_0_0_1px_theme(colors.violet.500)]
        `}
      />
      {rightSlot && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {rightSlot}
        </div>
      )}
    </div>
  </div>
);

// ─── Checkbox ──────────────────────────────────────────────────────────────────

const Checkbox = ({ id, checked, onChange, label, t }) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2.5 cursor-pointer select-none group"
  >
    <div className="relative flex-shrink-0">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`
        w-[18px] h-[18px] rounded-[5px] border transition-all duration-150
        ${
          checked
            ? "bg-violet-600 border-violet-600"
            : `${t.checkboxUnchecked} group-hover:border-violet-400`
        }
      `}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center w-full h-full"
            >
              <Check className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    <span className={`text-sm ${t.checkboxLabel}`}>{label}</span>
  </label>
);

// ─── LoginPage ─────────────────────────────────────────────────────────────────

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

  const t = THEME[theme] ?? THEME.light;

  return (
    <div className={`h-screen flex ${t.pageBg} overflow-hidden`}>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[400px] py-10"
          >
            {/* ── Header ── */}
            <div className="mb-8">
              <h2
                className={`text-2xl font-bold tracking-tight mb-1.5 ${t.headingText}`}
              >
                Welcome back
              </h2>
              <p className={`text-sm ${t.bodyText}`}>
                Sign in to continue your journey
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleLogin} noValidate className="space-y-5">
              <InputField
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                icon={Mail}
                autoComplete="email"
                t={t}
              />

              <InputField
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                icon={Lock}
                autoComplete="current-password"
                t={t}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className={`${t.mutedText} hover:text-gray-600 transition-colors duration-150 p-0.5 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/40`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>
                }
              />

              {/* Remember me + forgot */}
              <div className="flex items-center justify-between pt-0.5">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  label="Keep me signed in"
                  t={t}
                />
                <Link
                  to="/forgot-password"
                  className={`text-sm font-medium transition-colors duration-150 ${t.forgotLink}`}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-xl border px-4 py-3 ${t.errorBorder} ${t.errorBg}`}
                  >
                    <p className={`text-sm font-medium ${t.errorText}`}>
                      {error?.message ||
                        "Incorrect email or password. Please try again."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    relative w-full py-3 px-6 rounded-xl
                    bg-violet-600 hover:bg-violet-700
                    text-white text-sm font-semibold
                    transition-all duration-200
                    hover:shadow-lg hover:shadow-violet-500/25
                    active:scale-[0.98]
                    disabled:opacity-60 disabled:cursor-not-allowed
                    disabled:hover:scale-100 disabled:hover:shadow-none
                    focus:outline-none focus:ring-[3px] focus:ring-violet-500/40
                  "
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
                      Signing in…
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className={`flex-1 h-px ${t.dividerLine}`} />
              <span className={`text-xs font-medium ${t.dividerText}`}>or</span>
              <div className={`flex-1 h-px ${t.dividerLine}`} />
            </div>

            {/* Sign-up */}
            <p className={`text-center text-sm ${t.signupText}`}>
              New to BrahmaLYF?{" "}
              <Link
                to="/register"
                className={`font-semibold transition-colors duration-150 ${t.signupLink}`}
              >
                Create a free account →
              </Link>
            </p>

            {/* Trust */}
            <p className={`text-center text-xs mt-8 ${t.trustText}`}>
              By signing in, you agree to our{" "}
              <Link
                to="/terms"
                className={`underline underline-offset-2 transition-colors ${t.trustLink}`}
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className={`underline underline-offset-2 transition-colors ${t.trustLink}`}
              >
                Privacy Policy
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
