import React, { useState } from "react";
import useForgotPassword from "./useForgotPassword";
import { motion } from "framer-motion";
import {
    LucideMail,
    LucideLock,
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle,
    Send,
    Shield,
    Key,
    Sparkles,
    Brain
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const {
        email,
        otp,
        otpRefs,
        newPass,
        confirmPass,
        error,
        successMsg,
        step,
        loading,
        setEmail,
        handleOtpChange,
        handleOtpKeyDown,
        verifyOtp,
        setNewPass,
        setConfirmPass,
        validateEmail,
        handleSendOtp,
        handleResetPassword,
    } = useForgotPassword();

    const { theme } = useTheme();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Theme colors matching login/register pages
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

    return (
        <div className={`flex min-h-screen transition-colors duration-300 ${colors.bg}`}>
            {/* Left side illustration (Desktop only) */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="hidden lg:flex w-1/2 flex-col justify-center p-8 lg:p-12 xl:p-16"
            >
                <div className="max-w-lg mx-auto w-full">
                    {/* Branding */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${colors.accent}`}>
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className={`text-4xl font-bold ${colors.accentText}`}>
                                    BrahmaLYF
                                </h1>
                                <p className={`text-sm ${colors.mutedText} uppercase tracking-wider mt-1`}>
                                    Transform Your Life
                                </p>
                            </div>
                        </div>

                        <h2 className={`text-5xl font-bold mb-6 ${colors.text}`}>
                            Reset Password
                        </h2>
                        <p className={`text-xl ${colors.mutedText} leading-relaxed`}>
                            Follow these simple steps to securely reset your password and regain access to your account.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className={`mt-12 p-8 rounded-2xl ${colors.featureBg} backdrop-blur-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-2xl font-bold mb-6 ${colors.text}`}>
                            Reset Process
                        </h3>
                        <div className="space-y-8">
                            {[
                                { icon: LucideMail, text: "Enter your email address" },
                                { icon: Shield, text: "Verify with OTP sent to email" },
                                { icon: Key, text: "Set new password" },
                                { icon: CheckCircle, text: "Login with new credentials" }
                            ].map((stepItem, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className={`p-3 rounded-full ${index + 1 <= step ? `bg-gradient-to-r ${colors.accent}` : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <stepItem.icon className={`w-6 h-6 ${index + 1 <= step ? 'text-white' : colors.accentText}`} />
                                    </div>
                                    <div>
                                        <span className={`text-lg font-medium ${colors.text}`}>
                                            Step {index + 1}: {stepItem.text}
                                        </span>
                                        <div className={`h-1 w-24 mt-2 rounded-full ${index + 1 < step ? `bg-gradient-to-r ${colors.accent}` : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right side form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8"
            >
                <div className={`w-full max-w-md p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl ${colors.cardBg}`}>
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${colors.accent} mb-4`}>
                                <Key className="w-8 h-8 text-white" />
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
                                Reset Password
                            </h2>
                            <p className={`text-sm ${colors.mutedText}`}>
                                Follow the steps to reset your password
                            </p>
                        </div>

                        {/* Mobile Progress */}
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center">
                                {[1, 2, 3].map((stepNum) => (
                                    <React.Fragment key={stepNum}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stepNum <= step ? `bg-gradient-to-r ${colors.accent} text-white` : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                                            {stepNum}
                                        </div>
                                        {stepNum < 3 && (
                                            <div className={`w-12 h-1 ${stepNum < step ? `bg-gradient-to-r ${colors.accent}` : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden lg:block mb-8">
                        <Link to="/login" className={`flex items-center gap-2 text-sm ${colors.accentText} hover:underline mb-6`}>
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                        <h2 className={`text-3xl font-bold ${colors.text} mb-2`}>
                            Forgot Password
                        </h2>
                        <p className={`text-sm ${colors.mutedText}`}>
                            Enter your email to receive a verification code
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg mb-6 ${colors.errorBg}`}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Success Message */}
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg mb-6 ${colors.successBg}`}
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium">{successMsg}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: ENTER EMAIL */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -25 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                                    <LucideMail className="w-4 h-4" />
                                    Email Address *
                                </label>
                                <div className={`flex items-center rounded-xl ${colors.inputBg} border px-4 py-3.5 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                                    <input
                                        type="email"
                                        value={email}
                                        onBlur={validateEmail}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`flex-1 bg-transparent outline-none ${colors.text} ${colors.placeholder} text-sm sm:text-base`}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSendOtp}
                                disabled={loading}
                                className={`w-full py-4 px-6 bg-gradient-to-r ${colors.accent} text-white font-semibold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 flex items-center justify-center gap-2`}
                            >
                                <Send className="w-5 h-5" />
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        sending verification code...
                                    </span>
                                ) : " Send Verification Code"}
                            </motion.button>

                            <div className="text-center">
                                <p className={`text-sm ${colors.mutedText}`}>
                                    Remember your password?{" "}
                                    <Link
                                        to="/login"
                                        className={`font-semibold ${colors.accentText} hover:underline transition-all`}
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: ENTER OTP */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -25 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
                                    Enter Verification Code
                                </h3>
                                <p className={`text-sm ${colors.mutedText}`}>
                                    We sent a 6-digit code to <span className="font-semibold">{email}</span>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                                    <Shield className="w-4 h-4" />
                                    6-Digit OTP
                                </label>
                                <div className="flex justify-between gap-1 sm:gap-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (otpRefs.current[index] = el)}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl ${colors.inputBg} border focus:ring-2 focus:ring-purple-500 outline-none transition-all ${colors.text}`}
                                            required
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        otpRefs.current[0]?.focus();
                                    }}
                                    className={`flex-1 py-3.5 rounded-xl border ${colors.inputBg} ${colors.text} font-medium transition-all hover:scale-[1.02] active:scale-95`}
                                >
                                    Back
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => verifyOtp(otp.join(''))}
                                    disabled={loading}
                                    className={`flex-1 py-3.5 bg-gradient-to-r ${colors.accent} text-white font-semibold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 active:scale-95`}
                                >

                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            verifying code...
                                        </span>
                                    ) : "Verify Code"}
                                </motion.button>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={handleSendOtp}
                                    className={`text-sm ${colors.accentText} hover:underline font-medium`}
                                >
                                    Resend Code
                                </button>
                                <p className={`text-xs ${colors.mutedText} mt-2`}>
                                    Code expires in 10 minutes
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: NEW PASSWORD */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: -25 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
                                    Create New Password
                                </h3>
                                <p className={`text-sm ${colors.mutedText}`}>
                                    Enter a strong password for your account
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                                    <LucideLock className="w-4 h-4 flex-shrink-0" />
                                    New Password *
                                </label>
                                <div className={`flex items-center rounded-xl ${colors.inputBg} border px-3 sm:px-4 py-3 sm:py-3.5 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPass}
                                        onChange={(e) => setNewPass(e.target.value)}
                                        className={`flex-1 min-w-0 bg-transparent outline-none ${colors.text} ${colors.placeholder} text-sm sm:text-base pr-2`}
                                        placeholder="Minimum 8 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className={`p-1 ${colors.mutedText} hover:text-purple-500 transition-colors flex-shrink-0`}
                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ) : (
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${colors.text}`}>
                                    Confirm Password *
                                </label>
                                <div className={`flex items-center rounded-xl ${colors.inputBg} border px-3 sm:px-4 py-3 sm:py-3.5 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPass}
                                        onChange={(e) => setConfirmPass(e.target.value)}
                                        className={`flex-1 min-w-0 bg-transparent outline-none ${colors.text} ${colors.placeholder} text-sm sm:text-base pr-2`}
                                        placeholder="Re-enter your password"
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

                            {/* Password Requirements */}
                            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                                <p className={`text-sm font-medium ${colors.text} mb-2`}>
                                    Password Requirements:
                                </p>
                                <ul className={`text-xs space-y-1 ${colors.mutedText}`}>
                                    <li className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${newPass.length >= 8 ? 'bg-green-500' : 'bg-gray-500'}`} />
                                        At least 8 characters
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPass) ? 'bg-green-500' : 'bg-gray-500'}`} />
                                        One uppercase letter
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPass) ? 'bg-green-500' : 'bg-gray-500'}`} />
                                        One number
                                    </li>
                                </ul>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className={`flex-1 py-3.5 rounded-xl border ${colors.inputBg} ${colors.text} font-medium transition-all hover:scale-[1.02] active:scale-95`}
                                >
                                    Back
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                    className={`w-full py-3.5 bg-gradient-to-r ${colors.accent} text-white font-semibold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Resetting...
                                        </span>
                                    ) : "Reset Password"}
                                </motion.button>
                            </div>

                            <div className="text-center">
                                <p className={`text-sm ${colors.mutedText}`}>
                                    Remember your password?{" "}
                                    <Link
                                        to="/login"
                                        className={`font-semibold ${colors.accentText} hover:underline transition-all`}
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;