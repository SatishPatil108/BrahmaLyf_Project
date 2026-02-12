import {
	loginController,
	resetPasswordController,
	forgetPasswordController
} from "../controllers/auth_admin.js";
import {
	loginValidator,
	resetPasswordValidator,
	forgetPasswordValidator
} from "../middleware/auth_admin.js";
import verifyAdminToken from "../../middleware/verifyAdminToken.js";

// routes
export default (app) => {
	app.post("/apis/admin/auth/login",
		loginValidator,
		loginController);
	app.put("/apis/admin/auth/reset-password",
		verifyAdminToken,
		resetPasswordValidator,
		resetPasswordController);
	app.post("/apis/admin/auth/forget-password",
		forgetPasswordValidator,
		forgetPasswordController);
};
