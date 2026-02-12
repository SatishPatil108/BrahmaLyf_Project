import {
    loginModel,
    resetPasswordModel,
    forgetPasswordModel
} from "../models/auth_admin.js";

// login
export const loginController = (req, res) => loginModel(req, res);

// reset password
export const resetPasswordController = (req, res) => resetPasswordModel(req, res);

// forget password
export const forgetPasswordController = (req, res) => forgetPasswordModel(req, res);
