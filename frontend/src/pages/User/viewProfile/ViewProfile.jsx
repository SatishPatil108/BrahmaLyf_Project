import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, User, Mail, Phone, Calendar, Edit, CheckCircle, Shield, Clock, Percent, Book } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import defaultImg from "@/assets/user.png";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const ViewProfile = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { user } = useSelector((state) => state.auth);

    // Theme colors
    const themeColors = {
        dark: {
            bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
            text: "text-gray-100",
            mutedText: "text-gray-400",
            accent: "from-purple-600 to-pink-500",
            accentText: "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
            cardBg: "bg-gray-800/30 backdrop-blur-sm border border-gray-700",
            buttonBg: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
            infoBg: "bg-gray-800/50 border-gray-700"
        },
        light: {
            bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
            text: "text-gray-900",
            mutedText: "text-gray-600",
            accent: "from-purple-500 to-pink-400",
            accentText: "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
            cardBg: "bg-white/70 backdrop-blur-sm border border-gray-200",
            buttonBg: "bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500",
            infoBg: "bg-gray-50 border-gray-200"
        }
    };

    const colors = themeColors[theme] || themeColors.light;

    if (!user) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${colors.bg}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className={colors.text}>Loading profile...</p>
                </div>
            </div>
        );
    }

    // Format data
    const profileImage = user.profile_picture_url
        ? `${BASE_URL}${user.profile_picture_url}`
        : defaultImg;

    // Handle gender display
    const getGenderInfo = () => {
        if (String(user.gender) === "1") return { text: "Male", icon: "♂", color: "text-blue-500" };
        if (String(user.gender) === "0") return { text: "Female", icon: "♀", color: "text-pink-500" };
        if (String(user.gender) === "-1") return { text: "Other", icon: "⚧", color: "text-purple-500" };
        return { text: "Not set", icon: "⚧", color: "text-gray-500" };
    };
    const genderInfo = getGenderInfo();
    
    // Handle contact number
    const contactNumber = user.contact_number && user.contact_number !== "0" 
        ? user.contact_number 
        : "Not provided";

    // Handle date of birth
    const formattedDob = user.dob
        ? new Date(user.dob).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "Not set";

    // Calculate profile completion
    const calculateProfileCompletion = () => {
        const fields = [
            user.name && user.name.trim() !== "",
            user.email && user.email.trim() !== "",
            user.contact_number && user.contact_number !== "0",
            user.dob,
            user.gender !== null && user.gender !== undefined,
            user.profile_picture_url
        ];
        const filledFields = fields.filter(Boolean).length;
        return Math.round((filledFields / fields.length) * 100);
    };
    const profileCompletion = calculateProfileCompletion();

    // Get completion color
    const getCompletionColor = () => {
        if (profileCompletion >= 80) return "text-green-500";
        if (profileCompletion >= 50) return "text-yellow-500";
        return "text-red-500";
    };
    const completionColor = getCompletionColor();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${colors.bg} py-8 px-4`}>
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-2xl ${colors.cardBg}`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-700/30 flex justify-between items-center">
                        <div>
                            <h1 className={`text-2xl sm:text-3xl font-bold ${colors.text}`}>
                                My Profile
                            </h1>
                            <p className={`text-sm ${colors.mutedText} mt-1`}>
                                View your account information
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className={`p-2 rounded-lg hover:bg-gray-700/30 transition-colors ${colors.mutedText}`}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-purple-500">
                                    <img
                                        src={profileImage}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-2">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                            </div>

                            {/* User Info Summary */}
                            <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
                                <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold ${colors.text} mb-2`}>
                                    {user.name || "No name set"}
                                </h2>
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.infoBg}`}>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className={`text-xs sm:text-sm font-medium ${colors.mutedText}`}>
                                        Active Member
                                    </span>
                                </div>

                                {/* Profile Completion */}
                                <div className="mt-4 max-w-md">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-xs sm:text-sm font-medium ${colors.mutedText}`}>
                                            Profile Completion
                                        </span>
                                        <span className={`text-sm font-semibold ${completionColor}`}>
                                            {profileCompletion}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 sm:h-2 bg-gray-700/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                            style={{ width: `${profileCompletion}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Edit Button */}
                                <div className="mt-6">
                                    <button
                                        onClick={() => navigate("/edit-profile")}
                                        className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white text-sm sm:text-base font-medium transition-all hover:scale-105 active:scale-95 ${colors.buttonBg}`}
                                    >
                                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                                        {profileCompletion < 100 ? "Complete Profile" : "Edit Profile"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Personal Information */}
                            <div className={`p-4 sm:p-6 rounded-xl ${colors.infoBg}`}>
                                <h3 className={`text-base sm:text-lg font-semibold ${colors.text} mb-4 flex items-center gap-2`}>
                                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Personal Information
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <InfoRow
                                        label="Full Name"
                                        value={user.name || "Not set"}
                                        icon={<User className="w-3 h-3 sm:w-4 sm:h-4" />}
                                        isEmpty={!user.name}
                                        theme={theme}
                                    />
                                    <InfoRow
                                        label="Gender"
                                        value={genderInfo.text}
                                        icon={<span className={`text-base ${genderInfo.color}`}>{genderInfo.icon}</span>}
                                        isEmpty={user.gender === null || user.gender === undefined}
                                        theme={theme}
                                    />
                                    <InfoRow
                                        label="Date of Birth"
                                        value={formattedDob}
                                        icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4" />}
                                        isEmpty={!user.dob}
                                        theme={theme}
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className={`p-4 sm:p-6 rounded-xl ${colors.infoBg}`}>
                                <h3 className={`text-base sm:text-lg font-semibold ${colors.text} mb-4 flex items-center gap-2`}>
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Contact Information
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <InfoRow
                                        label="Email Address"
                                        value={user.email}
                                        icon={<Mail className="w-3 h-3 sm:w-4 sm:h-4" />}
                                        isEmail={true}
                                        isEmpty={!user.email}
                                        theme={theme}
                                    />
                                    <InfoRow
                                        label="Contact Number"
                                        value={contactNumber}
                                        icon={<Phone className="w-3 h-3 sm:w-4 sm:h-4" />}
                                        isEmpty={!user.contact_number || user.contact_number === "0"}
                                        theme={theme}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl ${colors.infoBg}`}>
                            <h3 className={`text-base sm:text-lg font-semibold ${colors.text} mb-4 flex items-center gap-2`}>
                                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                                Account Status
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                <StatCard
                                    label="Member Since"
                                    value={user.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}
                                    icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    theme={theme}
                                />
                                <StatCard
                                    label="Email Status"
                                    value="Verified"
                                    icon={<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                                    isVerified={true}
                                    theme={theme}
                                />
                                <StatCard
                                    label="Profile Completion"
                                    value={`${profileCompletion}%`}
                                    icon={<Percent className={`w-4 h-4 sm:w-5 sm:h-5 ${completionColor}`} />}
                                    theme={theme}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 pt-6 border-t border-gray-700/30">
                            <button
                                onClick={() => navigate("/my-courses")}
                                className={`w-full py-3 px-4 rounded-xl border transition-colors font-medium ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-100 border-gray-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'} flex items-center justify-center gap-2`}
                            >
                                <Book className="w-4 h-4 sm:w-5 sm:h-5" />
                                Back to My Courses
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Reusable Info Row Component
const InfoRow = ({ label, value, icon, isEmail = false, isEmpty = false, theme }) => {
    const displayValue = isEmpty
        ? <span className="italic text-gray-500 text-sm">Not set</span>
        : value;

    return (
        <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-700/20 last:border-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400 flex-shrink-0'}>
                    {icon}
                </div>
                <span className={`text-xs sm:text-sm font-medium truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {label}
                </span>
            </div>
            <div className="text-right ml-2 min-w-0 flex-1">
                {isEmail && !isEmpty ? (
                    <a
                        href={`mailto:${value}`}
                        className={`text-xs sm:text-sm font-medium hover:underline truncate block ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                    >
                        {value}
                    </a>
                ) : (
                    <span className={`text-xs sm:text-sm font-medium truncate block ${isEmpty ? 'italic text-gray-500' : theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                        {displayValue}
                    </span>
                )}
            </div>
        </div>
    );
};

// Reusable Stat Card Component
const StatCard = ({ label, value, icon, isVerified = false, theme }) => {
    return (
        <div className={`p-3 sm:p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className={`p-1.5 sm:p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {icon}
                    </div>
                </div>
                <div className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {label}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isVerified && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
                )}
                <span className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {value}
                </span>
            </div>
        </div>
    );
};

export default ViewProfile;