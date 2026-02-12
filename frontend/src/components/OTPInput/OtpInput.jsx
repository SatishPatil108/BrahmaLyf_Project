import React, { useState } from "react";

const OtpInput = ({
    otp,
    otpRefs,
    handleOtpChange,
    handleOtpKeyDown,
    verifyOtp,
    setIsEmailVerified,
    loading = false,
    error = null,
    setError = () => {}
}) => {
    const [localError, setLocalError] = useState(null);
    const [isTouched, setIsTouched] = useState(false);

    const handleVerify = async () => {
        const finalOtp = otp.join("");
        
        // Clear previous errors
        setLocalError(null);
        setError(null);
        
        // Validation
        if (finalOtp.length !== 6) {
            setLocalError("Please enter a 6-digit OTP code");
            return;
        }
        
        // Check if all digits are numbers
        if (!/^\d+$/.test(finalOtp)) {
            setLocalError("OTP should contain only numbers");
            return;
        }
        
        setIsTouched(true);
        
        try {
            const verified = await verifyOtp(finalOtp);
            
            if (verified) {
                setIsEmailVerified(true);
                setLocalError(null);
            }
        } catch (err) {
            setLocalError(err.message || "OTP verification failed");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleVerify();
        }
    };

    return (
        <div className="space-y-4">
            {/* Label */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Enter OTP Code
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Enter the 6-digit code sent to your email address.
                </p>
            </div>

            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        maxLength={1}
                        value={digit}
                        ref={(el) => (otpRefs.current[index] = el)}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setLocalError(null)}
                        className={`
                            w-14 h-14 text-center border-2 rounded-lg text-2xl font-bold
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                            transition-all duration-200
                            ${(localError || error) && isTouched
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'
                            }
                            text-gray-900 dark:text-gray-100
                        `}
                        disabled={loading}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        type="text"
                    />
                ))}
            </div>

            {/* Error Messages */}
            {(localError || error) && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <svg 
                        className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {localError || error}
                    </p>
                </div>
            )}

            {/* Verification Status */}
            {!localError && !error && isTouched && otp.join("").length === 6 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <svg 
                        className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                    <p className="text-sm text-green-600 dark:text-green-400">
                        OTP entered. Click verify to continue.
                    </p>
                </div>
            )}

            {/* Verify Button */}
            <button
                onClick={handleVerify}
                disabled={loading || otp.join("").length !== 6}
                className={`
                    w-full py-3 rounded-lg font-medium text-white transition-colors
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${loading || otp.join("").length !== 6
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                    }
                `}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying...
                    </span>
                ) : (
                    'Verify OTP'
                )}
            </button>

            {/* Helper Text */}
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                    Enter the 6-digit code from your email. The code will expire in 10 minutes.
                </p>
            </div>
        </div>
    );
};

export default OtpInput;