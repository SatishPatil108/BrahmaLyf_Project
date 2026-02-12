import joi from "joi";
import {
	error as sendError,
	HTTP_BAD_REQUEST,
	APP_RESPONSE_CODE_ERROR
} from "../../../response/response.js";
import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";

export const registrationValidator = (req, res, next) => {
	const schema = joi.object({
		name: joi.string().min(2).required().messages({
			"string.base": "Name must be a string",
			"string.empty": "Name is required",
			"string.min": "Name must have at least 2 characters",
			"any.required": "Name is required"
		}),
		email: joi.string().email().required().messages({
			"string.email": "Invalid email format",
			"any.required": "Email is required"
		}),
		password: joi.string().min(6).required().messages({
			"string.min": "Password must be at least 6 characters",
			"any.required": "Password is required"
		}),
		contact_number: joi.string()
			.pattern(/^[0-9]{10}$/)
			.optional()
			.allow('', null)
			.messages({
				"string.pattern.base": "Contact number must be exactly 10 digits"
			}),
		dob: joi.date().optional().allow('', null),
		gender: joi.number().valid(0, 1, null).optional().allow(null),
		profile_picture_url: joi.string().uri().optional().allow('', null)
	});
	
	const { error } = schema.validate(req.body, { abortEarly: false });
	if (error) {
		console.error("Validation Error:", error.details.map(e => e.message));
		return sendError(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			error.details.map(e => e.message)
		);
	}
	next();
}