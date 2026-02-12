import joi from "joi";
import { 
	error as sendError, 
	HTTP_BAD_REQUEST, 
	APP_RESPONSE_CODE_ERROR 
} from "../../../../response/response.js";
import { INVALID_REQUEST_PARAMETER } from "../../../../message/message.js";

// ===================== ENROLL IN COURSE VALIDATION =====================
export const enrollInCourseValidator = (req, res, next) => {
	const schema = joi.object({
		course_id: joi.number().integer().min(1).required()
	});
	const { error } = schema.validate(req.body);
	if (error) {
		return sendError(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			null
		);
	}
	next();
};

// ===================== COURSE FEEDBACK VALIDATION =====================
export const courseFeedbackValidator = (req, res, next) => {
	const schema = joi.object({
		enrollment_id: joi.number().integer().min(1).required(),
		course_id: joi.number().integer().min(1).required(),
		rating: joi.number().integer().min(1).max(5).required(),
		comments: joi.string().min(2).max(1000).allow("").optional()
	});
	const { error } = schema.validate(req.body);
	if (error) {
		return sendError(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			null
		);
	}
	next();
};