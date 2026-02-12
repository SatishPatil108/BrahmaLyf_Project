import {
    error,
    success,
    HTTP_OK,
    HTTP_NOT_FOUND,
    HTTP_INTERNAL_SERVER_ERROR,
    APP_RESPONSE_CODE_ERROR,
    APP_RESPONSE_CODE_SUCCESS,
    HTTP_BAD_REQUEST,
    HTTP_UNAUTHORIZED
} from "../../../response/response.js";

import {
    INVALID_REQUEST,
    USER_NOT_FOUND,
    PASSWORD_EMAIL_SENT,
    OTP_NOT_FOUND,
    OTP_EXPIRED,
    OTP_INVALID,
    OTP_VERIFIED_SUCCESS,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAILED
} from "../message/forgotPassword.js";

import {
    getUserIdByEmailService,
    saveUserOtpService,
    getOtpByEmailService,
    clearOtpService,
    updatePasswordService
} from "../services/forgotPassword.js";

import sendMail from "../../../utils/send_email.js";

import {
    BCRYPT_SALT_ROUNDS,
    OTP_TTL_MINUTES
} from "../../../config/config.js";

import bcrypt from "bcrypt";

export const sendOtpModel = async (req, res) => {
    try {
        const { email } = req.body;

        // 1️⃣ Get user ID from email
        const userDetails = await getUserIdByEmailService(email);
        if (!userDetails) {
            return error(
                res,
                HTTP_NOT_FOUND,
                APP_RESPONSE_CODE_ERROR,
                USER_NOT_FOUND,
                null
            );
        }

        // 2️⃣ Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

        // 3️⃣ Save OTP in DB
        const saved = await saveUserOtpService(userDetails.user_id, otp, expiresAt, email);
        if (!saved) {
            return error(
                res,
                HTTP_INTERNAL_SERVER_ERROR,
                APP_RESPONSE_CODE_ERROR,
                PASSWORD_EMAIL_SENT.FAILED_TO_SAVE_OTP || "Failed to store OTP",
                null
            );
        }

        // 4️⃣ Prepare Email Body
        const htmlBody = `
            <h3>Your One Time Password</h3>
            <p style="font-size: 18px; font-weight: bold;">${otp}</p>
            <p>OTP is valid for ${OTP_TTL_MINUTES} minutes. Do not share it with anyone.</p>
        `;

        // 5️⃣ Send Email
        const mailSent = await sendMail(email, "Your OTP Code", htmlBody);
        if (!mailSent) {
            return error(
                res,
                HTTP_INTERNAL_SERVER_ERROR,
                APP_RESPONSE_CODE_ERROR,
                PASSWORD_EMAIL_SENT.FAILED_TO_SEND_EMAIL || "Failed to send OTP email",
                null
            );
        }

        // 6️⃣ Success Response
        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            PASSWORD_EMAIL_SENT.SUCCESS || "OTP sent successfully",
            { email }
        );

    } catch (err) {
        console.error("sendOtpModel Error:", err);
        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            INVALID_REQUEST || "Internal server error",
            null
        );
    }
};

export const verifyOtpModel = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // 1️⃣ Fetch OTP record from DB
        const otpRecord = await getOtpByEmailService(email);
        if (!otpRecord) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                OTP_NOT_FOUND,
                null
            );
        }

        // 2️⃣ Extract DB fields
        const { otp: storedOtp, expires_at, user_id: userId } = otpRecord;

        // 3️⃣ Check expiry
        if (new Date() > new Date(expires_at)) {
            await clearOtpService(userId);

            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                OTP_EXPIRED,
                null
            );
        }

        // 4️⃣ Check OTP match
        if (String(otp) !== String(storedOtp)) {
            return error(
                res,
                HTTP_UNAUTHORIZED,
                APP_RESPONSE_CODE_ERROR,
                OTP_INVALID,
                null
            );
        }

        // 5️⃣ OTP is valid → Remove OTP record
        await clearOtpService(userId);

        // 6️⃣ Success response
        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            OTP_VERIFIED_SUCCESS,
            { verified: true }
        );

    } catch (err) {
        console.error("verifyOtpModel Error:", err);

        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            "Internal server error",
            null
        );
    }
};

export const resetPasswordModel = async (req, res) => {
    try {
        const { email, newPass } = req.body;

        // 1️⃣ Find user by email
        const userRecord = await getUserIdByEmailService(email);

        if (!userRecord) {
            return error(
                res,
                HTTP_NOT_FOUND,
                APP_RESPONSE_CODE_ERROR,
                USER_NOT_FOUND,
                null
            );
        }

        const { user_id: userId } = userRecord;

        // 2️⃣ Hash new password
        const hashedPassword = await bcrypt.hash(newPass, Number(BCRYPT_SALT_ROUNDS));

        // 3️⃣ Update user password
        await updatePasswordService(userId, hashedPassword);

        // 4️⃣ Success
        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            PASSWORD_RESET_SUCCESS,
            null
        );

    } catch (err) {
        console.error("Reset Password error:", err);

        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            PASSWORD_RESET_FAILED,
            null
        );
    }
};
