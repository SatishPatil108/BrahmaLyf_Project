import {
    sendOtpModel,
    verifyOtpModel,
    resetPasswordModel
} from "../models/forgotPassword.js";

export const sendOtpController = sendOtpModel;
export const verifyOtpController = verifyOtpModel;
export const resetPasswordController = resetPasswordModel;