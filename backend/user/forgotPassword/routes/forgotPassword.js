import {
    sendOtpController,
    verifyOtpController,
    resetPasswordController
} from "../controllers/forgotPassword.js";
import {
    sendOtpValidator,
    verifyOtpValidator,
    resetPasswordValidator
} from "../middleware/forgotPassword.js";

export default (app) => {
    app.post(
        "/apis/auth/forgot-password/send-otp",
        sendOtpValidator,
        sendOtpController
    );
    app.post(
        "/apis/auth/forgot-password/verify-otp",
        verifyOtpValidator,
        verifyOtpController
    );
    app.post(
        "/apis/auth/forgot-password/reset-password",
        resetPasswordValidator,
        resetPasswordController
    );
};