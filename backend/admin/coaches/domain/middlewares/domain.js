import { INVALID_REQUEST_PARAMETER } from "../../../../message/message.js";
import { error as _error, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR } from "../../../../response/response.js";
import validateFile from "../../../../utils/validateFile.js";
import joi from "joi";

const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const postDomainValidator = (req, res, next) => {

	// ---------------------------------------------
	// Validate body
	// ---------------------------------------------
	const schema = joi.object({
		domain_name: joi.string().min(2).max(100).required()
	});

	const { error } = schema.validate(req.body);
	if (error) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			error.details
		);
	}

	// ---------------------------------------------
	// Validate domain_thumbnail (REQUIRED)
	// ---------------------------------------------
	const fileError = validateFile(
		req.file,
		true,                     // required
		VALID_IMAGE_TYPES,
		MAX_IMAGE_SIZE,
		"domain_thumbnail"
	);

	if (fileError) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			fileError
		);
	}

	next();
};

export const postSubdomainValidator = (req, res, next) => {
	// ---------------------------------------------
	// Validate BODY
	// ---------------------------------------------
	const schema = joi.object({
		domain_id: joi.number().integer().min(1).required(),
		subdomain_name: joi.string().min(2).max(100).required(),
		progressive_difficulty: joi.number().integer().min(1).max(3).required()
	});

	const { error } = schema.validate(req.body);

	if (error) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			error.details
		);
	}

	// ---------------------------------------------
	// Validate subdomain_thumbnail (REQUIRED)
	// ---------------------------------------------
	const fileError = validateFile(
		req.file,
		true,                        // required
		VALID_IMAGE_TYPES,
		MAX_IMAGE_SIZE,
		"subdomain_thumbnail"
	);

	if (fileError) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			fileError
		);
	}

	next();
};


export const updateDomainValidator = (req, res, next) => {
	// ---------------------------------------------
	// Validate params
	// ---------------------------------------------
	const paramsSchema = joi.object({
		domain_id: joi.number().integer().min(1).required()
	});

	const { error: paramError } = paramsSchema.validate(req.params);
	if (paramError) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			paramError.details
		);
	}

	// ---------------------------------------------
	// Validate body
	// ---------------------------------------------
	const bodySchema = joi.object({
		domain_name: joi.string().min(2).max(100).required()
	});

	const { error: bodyError } = bodySchema.validate(req.body);
	if (bodyError) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			bodyError.details
		);
	}

	// ---------------------------------------------
	// Validate thumbnail (OPTIONAL)
	// ---------------------------------------------
	const fileError = validateFile(
		req.file,
		false,                    // OPTIONAL for update
		VALID_IMAGE_TYPES,
		MAX_IMAGE_SIZE,
		"domain_thumbnail"
	);

	if (fileError) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			fileError
		);
	}

	next();
};

export const updateSubdomainValidator = (req, res, next) => {
	// ---------------------------------------------
	// Validate params
	// ---------------------------------------------
	const paramsSchema = joi.object({
		subdomain_id: joi.number().integer().min(1).required()
	});

	const { error: paramError } = paramsSchema.validate(req.params);
	if (paramError) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			paramError.details
		);
	}

	// ---------------------------------------------
	// Validate body
	// ---------------------------------------------
	const bodySchema = joi.object({
		domain_id: joi.number().integer().min(1).required(),
		subdomain_name: joi.string().min(2).max(100).required(),
		progressive_difficulty: joi.number().integer().min(1).max(3).required()
	});

	const { error: bodyError } = bodySchema.validate(req.body);
	if (bodyError) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			bodyError.details
		);
	}

	// ---------------------------------------------
	// Thumbnail validation (OPTIONAL)
	// ---------------------------------------------
	const fileError = validateFile(
		req.file,
		false, // optional for update
		VALID_IMAGE_TYPES,
		MAX_IMAGE_SIZE,
		"subdomain_thumbnail"
	);

	if (fileError) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			fileError
		);
	}

	next();
};