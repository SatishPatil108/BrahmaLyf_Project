import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";
import {
	error as _error,
	HTTP_BAD_REQUEST,
	APP_RESPONSE_CODE_ERROR
} from "../../../response/response.js";
import joi from "joi";

export const postFaqValidator = (req, res, next) => {
	const schema = joi.object({
		question: joi.string().min(2).max(100).required(),
		answer: joi.string().min(2).max(1000).required(),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		console.error(error)
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			null
		);
	}

	next();
};
export const updateFaqValidator = (req, res, next) => {
	// Validate params
	const paramsSchema = joi.object({
		faqId: joi.number().integer().min(1).required()
	});

	const paramsValidation = paramsSchema.validate(req.params);
	if (paramsValidation.error) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			paramsValidation.error.details
		);
	}

	// Validate body
	const bodySchema = joi.object({
		question: joi.string().min(2).max(100).required(),
		answer: joi.string().min(2).max(1000).required()
	});

	const { error } = bodySchema.validate(req.body);

	if (error) {
		console.error(error)
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			error.details
		);
	}

	next();
};
