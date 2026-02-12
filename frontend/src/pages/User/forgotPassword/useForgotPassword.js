import {
    sendOtpForForgotPasswordAPI,
    verifyOtpForForgotPasswordAPI,
    changePasswordForForgotPasswordAPI
} from "@/store/feature/auth";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);

    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState(1);
    const [otpTries, setOtpTries] = useState(0);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateEmail = () => {
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email");
            return false;
        }
        setError("");
        return true;
    };

    const handleSendOtp = async () => {
        if (!validateEmail()) return;

        setError("");
        setLoading(true);
        try {
            const res = await dispatch(sendOtpForForgotPasswordAPI(email)).unwrap();
            if (res.success) {
                setSuccessMsg("OTP sent successfully!");
                setStep(2);
            } else {
                setError(res.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error("Send OTP error:", error);
            setError(error.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            setTimeout(() => {
                otpRefs.current[index + 1]?.focus();
            }, 10);
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            setTimeout(() => {
                otpRefs.current[index - 1]?.focus();
            }, 10);
        }
    };

    const verifyOtp = async () => {
        const finalOtp = otp.join('');
        if (finalOtp.length !== 6) {
            setError("Please enter the complete 6-digit OTP");
            return false;
        }

        setLoading(true);
        try {
            const res = await dispatch(verifyOtpForForgotPasswordAPI({ email, otp: finalOtp })).unwrap();
            
            if (res.success) {
                setSuccessMsg("OTP verified successfully!");
                setStep(3);
                setError("");
                return true;
            } else {
                let tries = otpTries + 1;
                setOtpTries(tries);

                if (tries >= 3) {
                    setError("Maximum OTP attempts reached. Please request a new OTP.");
                    setStep(1);
                    setOtp(["", "", "", "", "", ""]);
                } else {
                    setError(`Invalid OTP. ${3 - tries} attempt${tries === 2 ? '' : 's'} left`);
                }
                return false;
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            setError(error.message || "Failed to verify OTP");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setError("");

        if (newPass.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (newPass !== confirmPass) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await dispatch(changePasswordForForgotPasswordAPI({ email, newPass })).unwrap();

            if (res.success) {
                setSuccessMsg("Password reset successful! Redirecting to login...");
                setError("");
                
                // Clear the form
                setNewPass("");
                setConfirmPass("");
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 2000);
            } else {
                setError(res.message || "Failed to reset password");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            setError(error.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail("");
        setOtp(["", "", "", "", "", ""]);
        setNewPass("");
        setConfirmPass("");
        setError("");
        setSuccessMsg("");
        setStep(1);
        setOtpTries(0);
    };

    return {
        email,
        setEmail,
        otp,
        setOtp,
        otpRefs,
        newPass,
        setNewPass,
        confirmPass,
        setConfirmPass,
        error,
        successMsg,
        step,
        loading,
        validateEmail,
        handleSendOtp,
        verifyOtp,
        handleOtpChange,
        handleOtpKeyDown,
        handleResetPassword,
        resetForm
    };
};

export default useForgotPassword;