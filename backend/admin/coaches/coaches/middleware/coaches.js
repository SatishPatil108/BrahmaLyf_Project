import joi from "joi";
import {
	error as _error,
	HTTP_BAD_REQUEST,
	APP_RESPONSE_CODE_ERROR
} from "../../../../response/response.js";
import validateFile from "../../../../utils/validateFile.js";
import { INVALID_REQUEST_PARAMETER } from "../../../../message/message.js";

// constants
const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// -------- CREATE -------
export const postCoachValidator = (req, res, next) => {
	const schema = joi.object({
		name: joi.string().min(2).max(100).required(),
		email: joi.string().email().required(),
		contact_number: joi.string().min(10).max(15).required(),
		domain_id: joi.number().integer().min(1).required(),
		subdomain_id: joi.number().integer().min(1).required(),
		experience: joi.number().integer().min(1).required(),
		professional_title: joi.string().min(2).max(200).required(),
		bio: joi.string().min(2).max(2000).required()
	});

	const { error } = schema.validate(req.body);
	if (error) {
		return _error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST_PARAMETER, error.details);
	}

	const fileError = validateFile(req.file, true, VALID_IMAGE_TYPES, MAX_IMAGE_SIZE, "profile_picture");
	if (fileError) {
		return _error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST_PARAMETER, fileError);
	}

	next();
};

// -------- UPDATE -------
export const updateCoachValidator = (req, res, next) => {
	const paramsSchema = joi.object({
		coachId: joi.number().integer().min(1).required()
	});

	const paramsValidation = paramsSchema.validate(req.params);
	if (paramsValidation.error) {
		return _error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST_PARAMETER, paramsValidation.error.details);
	}

	const bodySchema = joi.object({
		name: joi.string().min(2).max(100).required(),
		email: joi.string().email().required(),
		contact_number: joi.string().min(10).max(15).required(),
		domain_id: joi.number().integer().min(1).required(),
		subdomain_id: joi.number().integer().min(1).required(),
		experience: joi.number().integer().min(1).required(),
		professional_title: joi.string().min(2).max(200).required(),
		bio: joi.string().min(2).max(2000).required()
	});

	const { error } = bodySchema.validate(req.body);
	if (error) {
		return _error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST_PARAMETER, error.details);
	}

	const fileError = validateFile(req.file, false, VALID_IMAGE_TYPES, MAX_IMAGE_SIZE, "profile_picture");
	if (fileError) {
		return _error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST_PARAMETER, fileError);
	}

	next();
};

// GET COACH BY ID VALIDATION
export const getCoachValidator = (req, res, next) => {
	const schema = joi.object({
		coachId: joi.number().integer().min(1).required()
	});

	const { error } = schema.validate(req.params);
	if (error) {
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

// DELETE COACH VALIDATION
export const deleteCoachValidator = (req, res, next) => {
	const schema = joi.object({
		coachId: joi.number().integer().min(1).required()
	});

	const { error } = schema.validate(req.params);
	if (error) {
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