import React from "react";
import { Send } from "lucide-react";

const EmailSection = ({
    userDetails,
    originalUserDetails,
    errors,
    setErrors,
    otpSent,
    isEmailVerified,
    isOtpButtonDisabled,
    timer,
    sendOtp,
    setOtpSent,
    setIsEmailVerified,
    setIsOtpButtonDisabled,
    setTimer,
    setUserDetails,
    theme,
    colors
}) => {
    const handleEmailChange = (e) => {
        const email = e.target.value;

        setErrors(prev => ({ ...prev, email: "" }));
        setUserDetails(prev => ({ ...prev, email }));

        if (email === originalUserDetails.email) {
            setOtpSent(false);
            setIsEmailVerified(true);
        } else {
            setOtpSent(false);
            setIsEmailVerified(false);
        }
    };

    const handleSendOtp = async () => {
        const email = userDetails.email;

        if (!email.trim()) {
            return setErrors(prev => ({ ...prev, email: "Email is required" }));
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return setErrors(prev => ({ ...prev, email: "Please enter a valid email" }));
        }

        setErrors(prev => ({ ...prev, email: "" }));

        if (isOtpButtonDisabled) return;

        const sent = await sendOtp(email);

        if (sent) {
            setOtpSent(true);
            setIsEmailVerified(false);
            setIsOtpButtonDisabled(true);
            setTimer(60);
            localStorage.setItem("otp_timer_expiry", Date.now() + 60 * 1000);
        }
    };

    return (
        <div className="space-y-2">
            <label className={`text-sm font-medium ${colors.text} flex items-center gap-2`}>
                <Send className="w-4 h-4" />
                Email Address *
            </label>

            <div className="relative">
                <input
                    type="email"
                    name="email"
                    value={userDetails.email || ""}
                    onChange={handleEmailChange}
                    className={`w-full rounded-xl ${colors.inputBg} border px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${colors.text} md:pr-32`}
                    placeholder="you@example.com"
                />

                {userDetails.email !== originalUserDetails.email && !isEmailVerified && (
                    <button
                        onClick={handleSendOtp}
                        disabled={isOtpButtonDisabled}
                        className={`w-full md:w-auto md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 mt-2 md:mt-0 px-3 py-2 md:py-1.5 rounded-lg text-sm md:text-xs font-medium transition-all
        ${isOtpButtonDisabled
                                ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                                : theme === 'dark'
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                            }`}
                    >
                        {isOtpButtonDisabled ? `Resend in ${timer}s` : "Verify Email"}
                    </button>
                )}
            </div>

            {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}

            {isEmailVerified && userDetails.email === originalUserDetails.email && (
                <div className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} flex items-center gap-1`}>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Email verified
                </div>
            )}

            {userDetails.email !== originalUserDetails.email && !isEmailVerified && otpSent && (
                <div className={`text-sm ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    OTP sent! Check your email and enter the code above.
                </div>
            )}
        </div>
    );
};

export default EmailSection;