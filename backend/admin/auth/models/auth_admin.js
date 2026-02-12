// auth_admin_controller.js
import {
	error,
	success,
	HTTP_BAD_REQUEST,
	HTTP_INTERNAL_SERVER_ERROR,
	HTTP_UNAUTHORIZED,
	HTTP_NOT_FOUND,
	HTTP_OK,
	APP_RESPONSE_CODE_ERROR,
	APP_RESPONSE_CODE_SUCCESS,
} from "../../../response/response.js";

import {
	INVALID_REQUEST,
	INVALID_CREDENTIALS,
	LOGIN_SUCCESS,
	LOGIN_ERROR,
	ADMIN_NOT_FOUND,
	PASSWORD_SAME_AS_OLD,
	PASSWORD_RESET_SUCCESS,
	PASSWORD_RESET_FAILED,
	PASSWORD_EMAIL_SENT,
	OTP_SENT_SUCCESS,
	OTP_VERIFY_SUCCESS
} from "../message/auth_admin_mess.js";

import {
	getAdminDetailsService,
	getAdminByIdService,
	updateAdminPasswordService,
	saveOtpService,
	getOtpByAdminIdService,
	clearOtpService
} from "../services/auth_admin.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../../../utils/send_email.js";

// ⭐ IMPORT FROM CONFIG (BEST PRACTICE)
import {
	JWT_SECRET,
	BCRYPT_SALT_ROUNDS,
	OTP_TTL_MINUTES
} from "../../../config/config.js";

const SALT = Number(BCRYPT_SALT_ROUNDS);

// OTP Generator
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// LOGIN
export const loginModel = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST, null);
		}

		const admin = await getAdminDetailsService(email);
		if (!admin) {
			return error(res, HTTP_UNAUTHORIZED, APP_RESPONSE_CODE_ERROR, INVALID_CREDENTIALS, null);
		}

		const isMatch = await bcrypt.compare(password, admin.password);
		if (!isMatch) {
			return error(res, HTTP_UNAUTHORIZED, APP_RESPONSE_CODE_ERROR, INVALID_CREDENTIALS, null);
		}

		const token = jwt.sign(
			{ admin_id: admin.admin_id },
			JWT_SECRET, { expiresIn: "7d" }
		);

		const { password: pwd, ...safeAdmin } = admin;

		return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, LOGIN_SUCCESS, {
			...safeAdmin,
			token: "Bearer " + token,
		});

	} catch (err) {
		console.error("Login error:", err);
		return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, LOGIN_ERROR, null);
	}
};

// RESET PASSWORD
export const resetPasswordModel = async (req, res) => {
	try {
		const { current_password, new_password } = req.body;
		const adminId = req.adminId;

		const admin = await getAdminByIdService(adminId);
		if (!admin) {
			return error(res, HTTP_NOT_FOUND, APP_RESPONSE_CODE_ERROR, ADMIN_NOT_FOUND, null);
		}

		const isMatch = await bcrypt.compare(current_password, admin.password);
		if (!isMatch) {
			return error(res, HTTP_UNAUTHORIZED, APP_RESPONSE_CODE_ERROR, INVALID_CREDENTIALS, null);
		}

		if (current_password === new_password) {
			return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, PASSWORD_SAME_AS_OLD, null);
		}

		const hashedPassword = await bcrypt.hash(new_password, SALT);
		await updateAdminPasswordService(adminId, hashedPassword);

		return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, PASSWORD_RESET_SUCCESS, null);

	} catch (err) {
		console.error("Reset Password error:", err);
		return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, PASSWORD_RESET_FAILED, null);
	}
};

// FORGOT PASSWORD → SEND OTP
export const forgetPasswordModel = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST, null);
		}

		const admin = await getAdminDetailsService(email);
		if (!admin) {
			return error(res, HTTP_NOT_FOUND, APP_RESPONSE_CODE_ERROR, ADMIN_NOT_FOUND, null);
		}

		const otp = generateOtp();
		const otpHash = await bcrypt.hash(String(otp), SALT);
		const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

		await saveOtpService(admin.admin_id, otpHash, expiresAt);

		const emailBody = `
			<h3>Password Reset OTP</h3>
			<p>Your admin OTP is <b>${otp}</b></p>
			<p>This OTP expires in ${OTP_TTL_MINUTES} minutes.</p>
		`;

		await sendMail(email, "Admin Password Reset OTP", emailBody);

		return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, PASSWORD_EMAIL_SENT, null);

	} catch (err) {
		console.error("Forget Password error:", err);
		return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, PASSWORD_RESET_FAILED, null);
	}
};

// VERIFY OTP → SET NEW PASSWORD
export const verifyOtpAndSetPasswordModel = async (req, res) => {
	try {
		const { otp, new_password } = req.body;
		const adminId = req.adminId;

		if (!otp || !new_password) {
			return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST, null);
		}

		const otpRecord = await getOtpByAdminIdService(adminId);
		if (!otpRecord) {
			return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_CREDENTIALS, null);
		}

		if (new Date() > new Date(otpRecord.expires_at)) {
			await clearOtpService(adminId);
			return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, "OTP expired", null);
		}

		const isMatch = await bcrypt.compare(String(otp), otpRecord.otp_hash);
		if (!isMatch) {
			return error(res, HTTP_UNAUTHORIZED, APP_RESPONSE_CODE_ERROR, INVALID_CREDENTIALS, null);
		}

		const hashedPassword = await bcrypt.hash(new_password, SALT);
		await updateAdminPasswordService(adminId, hashedPassword);
		await clearOtpService(adminId);

		return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, PASSWORD_RESET_SUCCESS, null);

	} catch (err) {
		console.error("Verify OTP error:", err);
		return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, PASSWORD_RESET_FAILED, null);
	}
};