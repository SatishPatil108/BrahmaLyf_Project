// auth_controller.js
import {
  error,
  success,
  HTTP_OK,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_UNAUTHORIZED,
  HTTP_INTERNAL_SERVER_ERROR,
  APP_RESPONSE_CODE_ERROR,
  APP_RESPONSE_CODE_SUCCESS,
} from "../../../response/response.js";

import {
  INVALID_REQUEST,
  INVALID_CREDENTIALS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  USER_NOT_FOUND,
  PASSWORD_SAME_AS_OLD,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAILED,
  NO_RECORD_FOUND,
} from "../message/auth_user_mess.js";

import {
  getUserDetailsService,
  getUserByIdService,
  updatePasswordService,
  getUserDetailsByIdService,
  updateProfileService,
  saveUserOtpService,
  getOtpByUserIdService,
  clearOtpService,
  updateLanguageService,
} from "../services/auth_user.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../../../utils/send_email.js";

// ⭐ IMPORT FROM CONFIG
import { JWT_SECRET, BCRYPT_SALT_ROUNDS } from "../../../config/config.js";
import saveUploadedFile from "../../../utils/uploadFile.js";
import removeFiles from "../../../utils/removeFiles.js";

// Utility: generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // 6 digits

// LOGIN
export const loginModel = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_REQUEST,
        null,
      );
    }

    const userDetails = await getUserDetailsService(email);

    if (!userDetails) {
      return error(
        res,
        HTTP_UNAUTHORIZED,
        APP_RESPONSE_CODE_ERROR,
        INVALID_CREDENTIALS,
        null,
      );
    }

    const isMatch = await bcrypt.compare(password, userDetails.password);
    if (!isMatch) {
      return error(
        res,
        HTTP_UNAUTHORIZED,
        APP_RESPONSE_CODE_ERROR,
        INVALID_CREDENTIALS,
        null,
      );
    }
    const token = jwt.sign({ user_id: userDetails.user_id }, JWT_SECRET, {
      expiresIn: rememberMe ? "30d" : "1d",
    });

    const { password: pwd, ...safeUser } = userDetails;

    return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, LOGIN_SUCCESS, {
      ...safeUser,
      token: "Bearer " + token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      LOGIN_ERROR,
      null,
    );
  }
};

// RESET PASSWORD
export const resetPasswordModel = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    const userDetails = await getUserByIdService(userId);
    if (!userDetails) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        USER_NOT_FOUND,
        null,
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, userDetails.password);
    if (!isMatch) {
      return error(
        res,
        HTTP_UNAUTHORIZED,
        APP_RESPONSE_CODE_ERROR,
        INVALID_CREDENTIALS,
        null,
      );
    }

    if (currentPassword === newPassword) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        PASSWORD_SAME_AS_OLD,
        null,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await updatePasswordService(userId, hashedPassword);

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      PASSWORD_RESET_SUCCESS,
      null,
    );
  } catch (err) {
    console.error("Reset Password error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      PASSWORD_RESET_FAILED,
      null,
    );
  }
};

// VERIFY OTP + SET NEW PASSWORD
export const verifyOtpAndSetPasswordModel = async (req, res) => {
  try {
    const { otp, new_password } = req.body;
    const userId = req.userId;

    if (!otp || !new_password) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_REQUEST,
        null,
      );
    }

    const otpRecord = await getOtpByUserIdService(userId);
    if (!otpRecord) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_CREDENTIALS,
        null,
      );
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      await clearOtpService(userId);
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        "OTP expired",
        null,
      );
    }

    const isMatch = await bcrypt.compare(String(otp), otpRecord.otp_hash);
    if (!isMatch) {
      return error(
        res,
        HTTP_UNAUTHORIZED,
        APP_RESPONSE_CODE_ERROR,
        INVALID_CREDENTIALS,
        null,
      );
    }

    const hashedPassword = await bcrypt.hash(new_password, BCRYPT_SALT_ROUNDS);
    await updatePasswordService(userId, hashedPassword);
    await clearOtpService(userId);

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      PASSWORD_RESET_SUCCESS,
      null,
    );
  } catch (err) {
    console.error("Verify OTP error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      PASSWORD_RESET_FAILED,
      null,
    );
  }
};

export const updateProfileModel = async (req, res) => {
  try {
    const { userId } = req;
    const { name, contact_number, dob, gender, email } = req.body;

    // 1️⃣ Fetch previous user details
    const prevUserDetails = await getUserDetailsByIdService(userId);

    if (!prevUserDetails || prevUserDetails === -1) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        NO_RECORD_FOUND,
        null,
      );
    }

    // 2️⃣ Handle Profile Picture (optional)
    let profilePictureUrl = prevUserDetails.profile_picture_url;

    if (req.file) {
      const safeName = name.replace(/[^a-zA-Z0-9-_]/g, "_");

      profilePictureUrl = saveUploadedFile(
        req.file,
        "profile-pictures",
        safeName,
      );

      if (prevUserDetails.profile_picture_url) {
        await removeFiles([prevUserDetails.profile_picture_url]);
      }
    }

    // 3️⃣ Update DB
    const result = await updateProfileService(
      userId,
      name,
      contact_number,
      dob,
      gender,
      email,
      profilePictureUrl,
    );

    // ❗ Handle all three cases
    if (result === -1) {
      return error(
        res,
        HTTP_INTERNAL_SERVER_ERROR,
        APP_RESPONSE_CODE_ERROR,
        "Database error while updating profile",
        null,
      );
    }

    if (result === false) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        NO_RECORD_FOUND,
        null,
      );
    }
    // 4️⃣ Success Response
    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      "Profile updated successfully",
      {
        user_id: userId,
        name,
        contact_number,
        dob,
        gender,
        email,
        profile_picture_url: profilePictureUrl,
      },
    );
  } catch (err) {
    console.error("Update Profile Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      "Unexpected error occurred",
      null,
    );
  }
};

export const sendOtpModel = async (req, res) => {
  try {
    const userId = req.userId;
    const { email } = req.body;

    // 1️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 2️⃣ Save OTP in USER table
    const saved = await saveUserOtpService(userId, otp, expiresAt, email);
    if (!saved) {
      return res.status(500).json({
        success: false,
        message: "Failed to store OTP",
      });
    }

    // 3️⃣ Send Email
    const htmlBody = `
			<h3>Your One Time Password</h3>
			<p style="font-size: 18px; font-weight: bold;">${otp}</p>
			<p>OTP is valid for 10 minutes. Do not share it with anyone.</p>
		`;

    const mailSent = await sendMail(email, "Your OTP Code", htmlBody);

    if (!mailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    // 4️⃣ Success
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      email,
    });
  } catch (err) {
    console.error("sendOtpModel Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyOtpModel = async (req, res) => {
  try {
    const userId = req.userId;
    const { otp } = req.body;

    // 1️⃣ Validate input
    if (!otp) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        "OTP is required",
        null,
      );
    }

    // 2️⃣ Fetch OTP from DB
    const otpRecord = await getOtpByUserIdService(userId);

    if (!otpRecord) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        "No OTP found or OTP expired",
        null,
      );
    }

    // 🟢 Matching your DB response
    const { otp: storedOtp, expires_at } = otpRecord;

    // 3️⃣ Check expiration
    if (new Date() > new Date(expires_at)) {
      await clearOtpService(userId);

      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        "OTP expired",
        null,
      );
    }

    // 4️⃣ Check OTP match
    if (String(otp) !== String(storedOtp)) {
      return error(
        res,
        HTTP_UNAUTHORIZED,
        APP_RESPONSE_CODE_ERROR,
        "Invalid OTP",
        null,
      );
    }

    // 5️⃣ OTP valid → clear it
    await clearOtpService(userId);

    // 6️⃣ Success
    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      "OTP verified successfully",
      { verified: true },
    );
  } catch (err) {
    console.error("verifyOtpModel Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      "Internal server error",
      null,
    );
  }
};

// update language
export const updateLanguageModel = async (req, res) => {
  try {
    const userId = req.userId; // from token

    const rawLang = req.body?.language || req.body?.lang;

    const language = typeof rawLang === "object" ? rawLang?.lang : rawLang;

    if (!userId || !language) {
      console.log("DEBUG FAIL:", { userId, language, body: req.body });

      return errorResponse(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        "UserId and language are required",
        null,
      );
    }

    if (typeof language !== "string") {
      throw new Error("Invalid language format");
    }
    
    const languageRecord = await updateLanguageService(userId, language);

    if (!languageRecord) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        USER_NOT_FOUND,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      "Language updated successfully",
      languageRecord,
    );
  } catch (err) {
    console.error("updateLanguageModel Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      "Internal server error",
      null,
    );
  }
};
