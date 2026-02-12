// auth_admin.js
import Joi from "joi";
import { error as _error, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR } from "../../../response/response.js";
import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";

// handle validation error
const handleValidationError = (res, error) => {
	if (error) {
		return _error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST_PARAMETER, null);
	}
};

// login validation
export const loginValidator = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().trim().email().required(),
		password: Joi.string().min(8).max(20).required()
	});

	const { error } = schema.validate(req.body);
	const result = handleValidationError(res, error);
	if (result) return;

	next();
};

// reset password validation
export const resetPasswordValidator = (req, res, next) => {
	const schema = Joi.object({
		current_password: Joi.string().min(6).required(),
		new_password: Joi.string().min(6).required()
	});

	const { error } = schema.validate(req.body);
	const result = handleValidationError(res, error);
	if (result) return;

	next();
};

// forget password validation
export const forgetPasswordValidator = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().trim().email().required()
	});

	const { error } = schema.validate(req.body);
	const result = handleValidationError(res, error);
	if (result) return;

	next();
};
