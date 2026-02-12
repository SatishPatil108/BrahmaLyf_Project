import {
    loginModel,
    resetPasswordModel,
    updateProfileModel,
    sendOtpModel,
    verifyOtpModel
} from "../models/auth_user.js";

export const loginController = loginModel;
export const resetPasswordController = resetPasswordModel;
export const updateProfileController = updateProfileModel;
export const sendOtpController = sendOtpModel;
export const verifyOtpController = verifyOtpModel;