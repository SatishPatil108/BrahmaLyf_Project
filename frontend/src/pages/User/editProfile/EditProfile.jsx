import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    X, User, Mail, Phone, Calendar, Upload,
    CheckCircle, AlertCircle, ArrowLeft, Save,
    Shield, Clock, Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import defaultImg from "@/assets/user.png";
import OtpInput from "../../../components/OTPInput/OtpInput";
import { clearUserError } from "@/store/feature/user/userSlice";
import useEditProfile from "./useEditProfile";
import EmailSection from "./EmailSection";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theme } = useTheme();

    const {
        userDetails,
        originalUserDetails,
        isLoading,
        error: apiError,
        setUserDetails,
        updateProfile,
        sendOtp,
        verifyOtp
    } = useEditProfile();


    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(true);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);
    const fileInputRef = useRef(null);
    const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Theme colors
    const themeColors = {
        dark: {
            bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
            text: "text-gray-100",
            mutedText: "text-gray-400",
            accent: "from-purple-600 to-pink-500",
            accentText: "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
            inputBg: "bg-gray-800/50 border-gray-700",
            cardBg: "bg-gray-800/30 backdrop-blur-sm border border-gray-700",
            buttonBg: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
            cancelBtn: "bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600",
            warningBg: "bg-yellow-900/20 border-yellow-800 text-yellow-300",
            successBg: "bg-green-900/20 border-green-800 text-green-300",
            errorBg: "bg-red-900/20 border-red-800 text-red-300",
            requiredStar: "text-red-400"
        },
        light: {
            bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
            text: "text-gray-900",
            mutedText: "text-gray-600",
            accent: "from-purple-500 to-pink-400",
            accentText: "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
            inputBg: "bg-white border-gray-300",
            cardBg: "bg-white/70 backdrop-blur-sm border border-gray-200",
            buttonBg: "bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500",
            cancelBtn: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300",
            warningBg: "bg-yellow-50 border-yellow-200 text-yellow-600",
            successBg: "bg-green-50 border-green-200 text-green-600",
            errorBg: "bg-red-50 border-red-200 text-red-600",
            requiredStar: "text-red-500"
        }
    };

    const colors = themeColors[theme] || themeColors.light;

    // Check if profile has changes
    const isProfileChanged = userDetails && originalUserDetails &&
        JSON.stringify(userDetails) !== JSON.stringify(originalUserDetails);

    // Load saved timer
    useEffect(() => {
        const expiry = localStorage.getItem("otp_timer_expiry");
        if (!expiry) return;

        const diff = Math.floor((expiry - Date.now()) / 1000);
        if (diff > 0) {
            setIsOtpButtonDisabled(true);
            setTimer(diff);
        }
    }, []);

    // Countdown timer
    useEffect(() => {
        let interval;
        if (isOtpButtonDisabled && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        localStorage.removeItem("otp_timer_expiry");
                        setIsOtpButtonDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer, isOtpButtonDisabled]);

    // OTP handlers
    const handleOtpChange = (e, idx) => {
        const val = e.target.value;
        if (!/^\d?$/.test(val)) return;

        const newOtp = [...otp];
        newOtp[idx] = val;
        setOtp(newOtp);

        if (val && idx < 5) {
            setTimeout(() => {
                otpRefs.current[idx + 1]?.focus();
            }, 10);
        }
    };

    const handleOtpKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            setTimeout(() => {
                otpRefs.current[idx - 1]?.focus();
            }, 10);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setUserDetails(prev => ({
            ...prev,
            [name]: name === "gender" ? (value === "" ? null : value) : value
        }));

        // Clear field error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        // Handle email verification reset
        if (name === "email" && originalUserDetails) {
            if (value === originalUserDetails.email) {
                setOtpSent(false);
                setIsEmailVerified(true);
            } else {
                setOtpSent(false);
                setIsEmailVerified(false);
            }
        }
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, profile_picture: "Please select an image file" }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, profile_picture: "Image size should be less than 5MB" }));
                return;
            }
            setUserDetails(prev => ({
                ...prev,
                profile_picture_url: file
            }));
            setErrors(prev => ({ ...prev, profile_picture: "" }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Name - Required
        if (!userDetails.name?.trim()) {
            newErrors.name = "Name is required";
        } else if (userDetails.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        // Email - Required
        if (!userDetails.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(userDetails.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Contact Number - Required (10 digits)
        if (!userDetails.contact_number || userDetails.contact_number === "0") {
            newErrors.contact_number = "Contact number is required";
        } else if (!/^\d{10}$/.test(userDetails.contact_number)) {
            newErrors.contact_number = "Contact number must be exactly 10 digits";
        }

        // Date of Birth - Required
        if (!userDetails.dob) {
            newErrors.dob = "Date of birth is required";
        } else {
            const dob = new Date(userDetails.dob);
            const today = new Date();
            if (dob > today) {
                newErrors.dob = "Date of birth cannot be in the future";
            }
        }

        // Gender - Required
        if (userDetails.gender === null || userDetails.gender === "" || userDetails.gender === undefined) {
            newErrors.gender = "Please select your gender";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle update profile
    const handleUpdateProfile = async () => {
        if (!validateForm()) return;

        if (userDetails.email !== originalUserDetails.email && !isEmailVerified) {
            setErrors(prev => ({ ...prev, email: "Please verify your email first" }));
            return;
        }

        setIsSubmitting(true);
        try {
            if (await updateProfile()) {
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!userDetails || !originalUserDetails) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${colors.bg}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className={colors.text}>Loading profile...</p>
                </div>
            </div>
        );
    }

    const profileImage = userDetails.profile_picture_url
        ? typeof userDetails.profile_picture_url === "string"
            ? `${BASE_URL}${userDetails.profile_picture_url}`
            : URL.createObjectURL(userDetails.profile_picture_url)
        : defaultImg;

    const canUpdate = isProfileChanged && (userDetails.email === originalUserDetails.email || isEmailVerified);

    // Required field indicator component
    const RequiredStar = () => (
        <span className={`ml-1 ${colors.requiredStar}`}>*</span>
    );

    return (
        <div className={`min-h-screen transition-colors duration-300 ${colors.bg} py-8 px-4`}>
            <div className="max-w-2xl mx-auto">
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
                                Edit Profile
                            </h1>
                            <p className={`text-sm ${colors.mutedText} mt-1`}>
                                All fields marked with * are required
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                dispatch(clearUserError());
                                navigate(-1);
                            }}
                            className={`p-2 rounded-lg hover:bg-gray-700/30 transition-colors ${colors.mutedText}`}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Required Fields Note */}
                        <div className={`mb-6 p-4 rounded-xl ${colors.warningBg}`}>
                            <div className="flex items-start gap-3">
                                <AlertCircle className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />
                                <div>
                                    <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                                        Complete All Required Fields
                                    </h4>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-yellow-400/80' : 'text-yellow-600'}`}>
                                        All fields marked with <RequiredStar /> are required.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Image Upload */}
                        <div className="text-center mb-8">
                            <div className="relative inline-block">
                                <div
                                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 cursor-pointer mx-auto"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`mt-3 text-sm font-medium ${colors.accentText} hover:underline`}
                                >
                                    Change Photo
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                {errors.profile_picture && (
                                    <p className="text-red-500 text-sm mt-1">{errors.profile_picture}</p>
                                )}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                                    <User className="w-4 h-4" />
                                    Full Name
                                    <RequiredStar />
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userDetails.name || ""}
                                    onChange={handleChange}
                                    className={`w-full rounded-xl ${colors.inputBg} border px-4 py-3.5 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${colors.text} ${errors.name ? 'border-red-500' : ''}`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Contact Number */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                                    <Phone className="w-4 h-4" />
                                    Contact Number
                                    <RequiredStar />
                                </label>
                                <input
                                    type="tel"
                                    name="contact_number"
                                    value={userDetails.contact_number || ""}
                                    onChange={handleChange}
                                    className={`w-full rounded-xl ${colors.inputBg} border px-4 py-3.5 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${colors.text} ${errors.contact_number ? 'border-red-500' : ''}`}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                />
                                {errors.contact_number && (
                                    <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                                    <Calendar className="w-4 h-4" />
                                    Date of Birth
                                    <RequiredStar />
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={userDetails.dob ? userDetails.dob.split('T')[0] : ""}
                                    onChange={handleChange}
                                    className={`w-full rounded-xl ${colors.inputBg} border px-4 py-3.5 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${colors.text} ${errors.dob ? 'border-red-500' : ''}`}
                                />
                                {errors.dob && (
                                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                                    <span className="text-lg">⚧</span>
                                    Gender
                                    <RequiredStar />
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: "1", label: "Male", icon: "♂" },
                                        { value: "0", label: "Female", icon: "♀" },
                                        { value: "-1", label: "Other", icon: "⚧" }
                                    ].map((option) => (
                                        <label
                                            key={option.value}
                                            className={`
                                                flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all
                                                ${String(userDetails.gender) === option.value
                                                    ? theme === 'dark'
                                                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 border-transparent text-white'
                                                        : 'bg-gradient-to-r from-purple-500 to-pink-400 border-transparent text-white'
                                                    : theme === 'dark'
                                                        ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500'
                                                        : 'bg-white border-gray-300 text-gray-700 hover:border-purple-400'
                                                }
                                                ${errors.gender ? 'border-red-500' : ''}
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={(option.value)}
                                                checked={String(userDetails.gender) === option.value}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <span className="text-2xl mb-1">{option.icon}</span>
                                            <span className="text-xs font-medium">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                                )}
                            </div>

                            {/* Email Section */}
                            <EmailSection
                                userDetails={userDetails}
                                originalUserDetails={originalUserDetails}
                                errors={errors}
                                setErrors={setErrors}
                                otpSent={otpSent}
                                isEmailVerified={isEmailVerified}
                                isOtpButtonDisabled={isOtpButtonDisabled}
                                timer={timer}
                                sendOtp={sendOtp}
                                setOtpSent={setOtpSent}
                                setIsEmailVerified={setIsEmailVerified}
                                setIsOtpButtonDisabled={setIsOtpButtonDisabled}
                                setTimer={setTimer}
                                setUserDetails={setUserDetails}
                                theme={theme}
                                colors={colors}
                            />

                            {/* OTP Input */}
                            {otpSent && !isEmailVerified && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4"
                                >
                                    <div className="text-center">
                                        <h4 className={`text-lg font-semibold ${colors.text} mb-2`}>
                                            Enter Verification Code
                                        </h4>
                                        <p className={`text-sm ${colors.mutedText}`}>
                                            We sent a 6-digit code to your email
                                        </p>
                                    </div>
                                    <OtpInput
                                        otp={otp}
                                        otpRefs={otpRefs}
                                        handleOtpChange={handleOtpChange}
                                        handleOtpKeyDown={handleOtpKeyDown}
                                        verifyOtp={(finalOtp) => verifyOtp(finalOtp).then(success => {
                                            if (success) {
                                                setIsEmailVerified(true);
                                                setOtpSent(false);
                                            }
                                        })}
                                        setIsEmailVerified={setIsEmailVerified}
                                        theme={theme}
                                    />
                                </motion.div>
                            )}

                            {/* Error Messages */}
                            {apiError && (
                                <div className={`p-4 rounded-xl ${colors.errorBg}`}>
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">
                                            {apiError.message === "Database error while updating profile"
                                                ? "Email or phone number already in use. Please use different ones."
                                                : apiError.message}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                <button
                                    onClick={() => {
                                        dispatch(clearUserError());
                                        navigate(-1);
                                    }}
                                    className={`flex-1 py-3.5 px-6 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 font-medium ${colors.cancelBtn}`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <ArrowLeft className="w-5 h-5" />
                                        Cancel
                                    </div>
                                </button>
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={!canUpdate || isSubmitting || isLoading}
                                    className={`flex-1 py-3.5 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95 font-semibold ${colors.buttonBg} text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
                                >
                                    {isSubmitting || isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <Save className="w-5 h-5" />
                                            Update Profile
                                        </div>
                                    )}
                                </button>
                            </div>

                            {/* Update Status Info */}
                            {!isProfileChanged && (
                                <div className={`text-center p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
                                    <p className={`text-sm ${colors.mutedText}`}>
                                        Make changes to enable update button
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EditProfile;