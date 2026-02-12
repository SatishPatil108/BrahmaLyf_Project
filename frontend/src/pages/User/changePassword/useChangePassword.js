// hooks/useChangePassword.js
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changePasswordAPI } from "@/store/feature/auth";
import { logoutUser } from "@/store/feature/auth/authSlice";
import { clearUserError } from "@/store/feature/user/userSlice";

export const useChangePassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentRef = useRef(null);
    const newRef = useRef(null);
    const confirmRef = useRef(null);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;

    // Check password strength in real-time
    const checkPasswordStrength = (password) => {
        setPasswordRequirements({
            length: password.length >= 8 && password.length <= 20,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*]/.test(password),
        });
    };

    // Validate password
    const validate = () => {
        const currentPassword = currentRef.current?.value || '';
        const newPassword = newRef.current?.value || '';
        const confirmPassword = confirmRef.current?.value || '';

        setErrorMsg("");

        // Current password
        if (currentPassword.length > 0 && currentPassword.length < 6) {
            setErrorMsg("Current password must be at least 6 characters.");
            return false;
        }

        // New password strong check
        if (newPassword.length > 0 && !strongPasswordRegex.test(newPassword)) {
            setErrorMsg("Please ensure your new password meets all requirements.");
            return false;
        }

        // Confirm password match
        if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
            setErrorMsg("New passwords do not match.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!validate()) return;

        const payload = {
            currentPassword: currentRef.current.value,
            newPassword: newRef.current.value,
        };

        setIsLoading(true);

        try {
            const response = await dispatch(changePasswordAPI(payload)).unwrap();
            if (response.success) {
                setSuccessMsg(response.message || "Password updated successfully!");

                // Auto-redirect after 2 seconds
                setTimeout(() => {
                    dispatch(logoutUser());
                    dispatch(clearUserError());
                    navigate("/login");
                }, 2000);
            } else {
                setErrorMsg(response.message || "Failed to update password.");
            }
        } catch (error) {
            console.error("Password update error:", error);
            setErrorMsg(error.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle new password input change
    const handleNewPasswordChange = (e) => {
        checkPasswordStrength(e.target.value);
        if (errorMsg) validate();
    };

    // Password requirement items
    const requirementItems = [
        { key: 'length', label: '8-20 characters' },
        { key: 'uppercase', label: 'Uppercase letter (A-Z)' },
        { key: 'lowercase', label: 'Lowercase letter (a-z)' },
        { key: 'number', label: 'Number (0-9)' },
        { key: 'special', label: 'Special character (!@#$%^&*)' },
    ];

    return {
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
        navigateBack: () => {
            dispatch(clearUserError());
            navigate(-1);
        },

        // Constants
        strongPasswordRegex
    };
};

export const getChangePasswordTheme = (theme) => ({
    dark: {
        bg: {
            primary: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
            card: 'bg-gray-800/50 backdrop-blur-sm',
            input: 'bg-gray-700/50',
            success: 'bg-emerald-900/30',
            error: 'bg-red-900/30',
        },
        text: {
            primary: 'text-gray-100',
            secondary: 'text-gray-300',
            tertiary: 'text-gray-400',
            inverse: 'text-white',
        },
        border: {
            light: 'border-gray-700',
            medium: 'border-gray-600',
            strong: 'border-gray-500',
        },
        gradient: {
            primary: 'from-purple-600 to-pink-600',
            secondary: 'from-teal-500 to-blue-600',
            accent: 'from-orange-500 to-yellow-500',
        },
        button: {
            primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
            disabled: 'bg-gray-600 text-gray-400 cursor-not-allowed',
        },
        icon: {
            success: 'text-emerald-400',
            error: 'text-red-400',
            warning: 'text-yellow-400',
            info: 'text-blue-400',
        }
    },
    light: {
        bg: {
            primary: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
            card: 'bg-white/50 backdrop-blur-sm',
            input: 'bg-white',
            success: 'bg-emerald-50',
            error: 'bg-red-50',
        },
        text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-600',
            tertiary: 'text-gray-500',
            inverse: 'text-white',
        },
        border: {
            light: 'border-gray-200',
            medium: 'border-gray-300',
            strong: 'border-gray-400',
        },
        gradient: {
            primary: 'from-purple-500 to-pink-500',
            secondary: 'from-teal-400 to-blue-500',
            accent: 'from-orange-400 to-yellow-400',
        },
        button: {
            primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
            disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
        },
        icon: {
            success: 'text-emerald-600',
            error: 'text-red-600',
            warning: 'text-yellow-600',
            info: 'text-blue-600',
        }
    }
}[theme]);