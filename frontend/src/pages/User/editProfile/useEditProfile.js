import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateProfileAPI,
    sendOtpAPI,
    verifyOtpAPI
} from "@/store/feature/auth";

const useEditProfile = () => {
    const dispatch = useDispatch();
    const { user, isLoading, error } = useSelector((state) => state.auth);

    const [userDetails, setUserDetails] = useState(null);
    const [originalUserDetails, setOriginalUserDetails] = useState(null);

    // Load user into local state
    useEffect(() => {
        if (user) {
            const processedUser = {
                ...user,
                gender: user.gender !== null && user.gender !== undefined ? String(user.gender) : null
            };
            setUserDetails({ ...processedUser });
            setOriginalUserDetails({ ...processedUser });
        }
    }, [user]);

    // Send OTP
    const sendOtp = async (email) => {
        try {
            const res = await dispatch(sendOtpAPI(email)).unwrap();
            return res?.success;
        } catch (err) {
            console.error('Send OTP error:', err);
            return false;
        }
    };

    // Verify OTP
    const verifyOtp = async (otpString) => {
        try {
            const res = await dispatch(verifyOtpAPI(otpString)).unwrap();
            return res?.success;
        } catch (err) {
            console.error('Verify OTP error:', err);
            return false;
        }
    };

    // Update Profile
    const updateProfile = async () => {
        try {
            const formData = new FormData();

            // Required fields
            formData.append("name", userDetails.name || "");
            formData.append("email", userDetails.email || "");
            formData.append("contact_number", userDetails.contact_number || "");
            formData.append("dob", userDetails.dob || "");

            // Handle gender
            let genderValue = userDetails.gender;
            if (genderValue === "" || genderValue === null || genderValue === undefined) {
                genderValue = null;
            } else {
                genderValue = parseInt(genderValue);
            }
            formData.append("gender", genderValue);

            // Profile picture (optional)
            if (userDetails.profile_picture_url && typeof userDetails.profile_picture_url === "object") {
                formData.append("profile_picture", userDetails.profile_picture_url);
            }

            const res = await dispatch(updateProfileAPI(formData)).unwrap();
            return true;
        } catch (err) {
            return false;
        }
    };

    return {
        userDetails,
        originalUserDetails,
        isLoading,
        error,
        setUserDetails,
        updateProfile,
        sendOtp,
        verifyOtp
    };
};

export default useEditProfile;