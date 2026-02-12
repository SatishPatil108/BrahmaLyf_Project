import {
	loginController,
	resetPasswordController,
	updateProfileController,
	sendOtpController,
	verifyOtpController
} from "../controllers/auth_user.js";
import {
	loginValidator,
	resetPasswordValidator,
	updateProfileValidator,
	sendOtpValidator,
	verifyOtpValidator
} from "../middleware/auth_user.js";
import verifyUserToken from "../../middleware/verifyUserToken.js";
import universalUpload from "../../../middleware/universalUpload.js";

export default (app) => {
	app.post(
		"/apis/user/auth/login",
		loginValidator,
		loginController
	);

	app.post(
		"/apis/user/auth/reset-password",
		verifyUserToken,            // Token verification first
		resetPasswordValidator,    // Then validate body
		resetPasswordController    // Then run controller
	);
	app.post(
		"/apis/user/auth/send-otp",
		verifyUserToken,
		sendOtpValidator,
		sendOtpController
	);
	app.post(
		"/apis/user/auth/verify-otp",
		verifyUserToken,
		verifyOtpValidator,
		verifyOtpController
	);
	app.put(
		"/apis/user/auth/Profile",
		verifyUserToken,
		universalUpload.single("profile_picture"),
		updateProfileValidator,
		updateProfileController,
	);
};