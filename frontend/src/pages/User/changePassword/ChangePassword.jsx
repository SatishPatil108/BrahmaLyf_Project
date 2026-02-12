import React from "react";
import { X, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, Shield, Key } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { getChangePasswordTheme, useChangePassword } from "./useChangePassword";
import "./changePassword.css"
const ChangePassword = () => {
    const { theme } = useTheme();
    const colors = getChangePasswordTheme(theme);

    const {
        // Refs
        currentRef,
        newRef,
        confirmRef,

        // State
        showCurrent,
        showNew,
        showConfirm,
        errorMsg,
        successMsg,
        isLoading,
        passwordRequirements,
        requirementItems,

        // State setters
        setShowCurrent,
        setShowNew,
        setShowConfirm,
        setErrorMsg,

        // Handlers
        handleSubmit,
        handleNewPasswordChange,
        validate,

        // Navigation
        navigateBack
    } = useChangePassword();

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${colors.bg.primary}`}>
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-1/4 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
                <div className={`absolute bottom-1/4 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 ${theme === 'dark' ? 'bg-pink-600' : 'bg-pink-300'}`}></div>
            </div>

            {/* Mobile Back Button */}
            <button
                onClick={navigateBack}
                className={`fixed top-6 left-4 sm:hidden flex items-center gap-2 z-50 ${colors.text.secondary} hover:text-opacity-70 transition-colors`}
                aria-label="Go back"
            >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Back</span>
            </button>

            {/* Main Card */}
            <div className={`relative w-full max-w-md p-6 sm:p-8 backdrop-blur-sm rounded-3xl border ${colors.bg.card} ${colors.border.light} shadow-2xl`}>
                {/* Desktop Close Button */}
                <button
                    onClick={navigateBack}
                    className={`absolute top-4 right-4 hidden sm:block ${colors.text.tertiary} hover:opacity-70 transition-colors`}
                    aria-label="Close"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 bg-gradient-to-r ${colors.gradient.primary}`}>
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${colors.text.primary}`}>
                        Change Password
                    </h1>
                    <p className={`text-sm sm:text-base ${colors.text.secondary}`}>
                        Secure your account with a new password
                    </p>
                </div>

                {/* Success Message */}
                {successMsg && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${colors.bg.success} ${theme === 'dark' ? 'border-emerald-800' : 'border-emerald-200'}`}>
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 ${colors.icon.success}`} />
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                {successMsg}
                            </p>
                            <p className={`text-xs mt-1 opacity-90 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                Redirecting to login...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errorMsg && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${colors.bg.error} ${theme === 'dark' ? 'border-red-800' : 'border-red-200'}`}>
                        <AlertCircle className={`w-5 h-5 flex-shrink-0 ${colors.icon.error}`} />
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                                {errorMsg}
                            </p>
                        </div>
                        <button
                            onClick={() => setErrorMsg("")}
                            className="p-1 hover:opacity-70 transition-opacity"
                            aria-label="Dismiss error"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${colors.text.primary}`}>
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                ref={currentRef}
                                type={showCurrent ? "text" : "password"}
                                placeholder="Enter current password"
                                onBlur={validate}
                                disabled={isLoading}
                                className={`w-full pl-4 pr-12 py-3.5 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0 border ${colors.bg.input} ${colors.border.medium} ${colors.text.primary} focus:border-purple-500 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                disabled={isLoading}
                                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:opacity-70 transition-opacity ${colors.text.tertiary} disabled:opacity-50`}
                                aria-label={showCurrent ? "Hide password" : "Show password"}
                            >
                                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${colors.text.primary}`}>
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                ref={newRef}
                                type={showNew ? "text" : "password"}
                                placeholder="Create new password"
                                onChange={handleNewPasswordChange}
                                onBlur={validate}
                                disabled={isLoading}
                                className={`w-full pl-4 pr-12 py-3.5 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0 border ${colors.bg.input} ${colors.border.medium} ${colors.text.primary} focus:border-purple-500 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                disabled={isLoading}
                                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:opacity-70 transition-opacity ${colors.text.tertiary} disabled:opacity-50`}
                                aria-label={showNew ? "Hide password" : "Show password"}
                            >
                                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Password Requirements */}
                        <div className="mt-3 space-y-2">
                            <p className={`text-xs font-medium ${colors.text.secondary}`}>
                                Password requirements:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {requirementItems.map((item) => {
                                    const met = passwordRequirements[item.key];
                                    return (
                                        <div key={item.key} className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${met ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                            <span className={`text-xs truncate ${met ? 'text-emerald-600 font-medium' : colors.text.tertiary}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${colors.text.primary}`}>
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                ref={confirmRef}
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm new password"
                                onBlur={validate}
                                disabled={isLoading}
                                className={`w-full pl-4 pr-12 py-3.5 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0 border ${colors.bg.input} ${colors.border.medium} ${colors.text.primary} focus:border-purple-500 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                disabled={isLoading}
                                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:opacity-70 transition-opacity ${colors.text.tertiary} disabled:opacity-50`}
                                aria-label={showConfirm ? "Hide password" : "Show password"}
                            >
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl ${isLoading ? colors.button.disabled : colors.button.primary}`}
                    >
                        {isLoading ? (
                            <>
                                <div className={`w-5 h-5 border-2 ${theme === 'dark' ? 'border-white' : 'border-white'} border-t-transparent rounded-full animate-spin`} />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <Key size={20} />
                                <span>Update Password</span>
                            </>
                        )}
                    </button>

                    {/* Helper Text */}
                    <p className={`text-center text-xs mt-4 ${colors.text.tertiary}`}>
                        After updating, you'll be logged out and redirected to login page
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;