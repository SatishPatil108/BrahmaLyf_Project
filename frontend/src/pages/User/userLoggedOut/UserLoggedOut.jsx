import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/feature/auth/authSlice";
import { clearUserError } from "@/store/feature/user/userSlice";
import {
  LogOut,
  ArrowLeft,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const UserLoggedOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();

  // Simple theme colors
  const themeColors = {
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      mutedText: "text-gray-400",
      accent: "from-purple-600 to-pink-500",
      accentText: "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
      cardBg: "bg-gray-800 border border-gray-700",
      cancelBtn: "bg-gray-700 hover:bg-gray-600 text-gray-100",
      logoutBtn: "bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white",
      warningBg: "bg-yellow-900/20 border border-yellow-800",
      successBg: "bg-green-900/20 border border-green-800",
    },
    light: {
      bg: "bg-gray-50",
      text: "text-gray-900",
      mutedText: "text-gray-600",
      accent: "from-purple-500 to-pink-400",
      accentText: "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
      cardBg: "bg-white border border-gray-200",
      cancelBtn: "bg-gray-100 hover:bg-gray-200 text-gray-700",
      logoutBtn: "bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white",
      warningBg: "bg-yellow-50 border border-yellow-200",
      successBg: "bg-green-50 border border-green-200",
    }
  };

  const colors = themeColors[theme] || themeColors.light;

  const handleLogout = () => {
    dispatch(logoutUser());
    setConfirmed(true);
    setTimeout(() => {
      dispatch(clearUserError());
      navigate("/login");
    }, 2000);
  };

  const handleCancel = () => {
    dispatch(clearUserError());
    navigate(-1);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${colors.bg} p-4`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md rounded-xl ${colors.cardBg}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <h2 className={`text-2xl font-bold ${colors.text}`}>
            Account Logout
          </h2>
          <p className={`text-sm mt-1 ${colors.mutedText}`}>
            Confirm your decision to sign out
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-6">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${colors.accent} flex-shrink-0`}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-lg font-semibold ${colors.text} truncate`}>
                    {user.name}
                  </h3>
                  <p className={`text-sm ${colors.mutedText} truncate mt-1`}>
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!confirmed ? (
          <div className="p-6 pt-0 space-y-6">
            {/* Warning Message */}
            <div className={`p-4 rounded-lg ${colors.warningBg}`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />
                <div>
                  <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    Before you go...
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-yellow-400/80' : 'text-yellow-600'}`}>
                    Your session will end and you'll need to sign in again.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCancel}
                className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${colors.cancelBtn} flex items-center justify-center gap-2`}
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Session
              </button>

              <button
                onClick={handleLogout}
                className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${colors.logoutBtn} flex items-center justify-center gap-2`}
              >
                <LogOut className="w-5 h-5" />
                Yes, Logout Now
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-6 text-center"
          >
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className={`p-5 rounded-full bg-gradient-to-r ${colors.accent}`}>
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Success Message */}
            <div>
              <h3 className={`text-xl font-bold mb-2 ${colors.text}`}>
                Logged Out Successfully
              </h3>
              <p className={`text-base ${colors.mutedText} mb-4`}>
                Thanks for visiting! We hope to see you again soon.
              </p>
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-sm ${colors.mutedText}`}>
                  Redirecting to login page...
                </p>
                <div className="mt-2 w-full h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Return Option */}
            <button
              onClick={() => navigate("/login")}
              className={`text-sm font-medium ${colors.accentText} hover:underline`}
            >
              Go to login immediately →
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UserLoggedOut;