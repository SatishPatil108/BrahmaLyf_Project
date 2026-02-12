import joi from "joi";
import {
	error as _error,
	HTTP_BAD_REQUEST,
	APP_RESPONSE_CODE_ERROR
} from "../../../../response/response.js";
import validateFile from "../../../../utils/validateFile.js";
import { INVALID_REQUEST_PARAMETER } from "../../../../message/message.js";

const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const sendValidationError = (res, error) => {
	console.error("❌ VALIDATION ERROR:");
	console.error("👉 Message:", error.message);
	console.error("👉 Details:", JSON.stringify(error.details ?? [], null, 2));
	return _error(
		res,
		HTTP_BAD_REQUEST,
		APP_RESPONSE_CODE_ERROR,
		INVALID_REQUEST_PARAMETER,
		null
	);
};

export const postCourseValidator = (req, res, next) => {
	const curriculumSchema = joi.object({
		header_type: joi.string().valid("Chapter", "Section", "Lesson").required(),
		sequence_no: joi.number().integer().min(1).required(),
		title: joi.string().min(2).max(200).required(),
		description: joi.string().min(2).max(2000).required(),
		video_url: joi.string().uri().required()
	});

	const schema = joi.object({
		domain: joi.number().integer().min(1).required(),
		subdomain: joi.number().integer().min(1).required(),
		coachId: joi.number().integer().min(1).required(),

		courseName: joi.string().min(2).max(100).required(),
		targetedAudience: joi.string().min(2).max(1000).required(),
		learningOutcome: joi.string().min(2).max(1000).required(),
		curriculumDesc: joi.string().min(2).max(2000).required(),

		courseDurationHours: joi.number().integer().min(0).max(200).required(),
		courseDurationMinutes: joi.number().integer().min(0).max(59).required(),

		videoTitle: joi.string().min(2).max(200).required(),
		videoDesc: joi.string().min(2).max(2000).required(),
		videoUrl: joi.string().uri().required(),

		curriculums: joi.array().items(curriculumSchema).min(1).required()
	});

	const { error } = schema.validate(req.body);
	if (error) return sendValidationError(res, error);

	// ---------------------------
	// MAIN COURSE THUMBNAIL
	// ---------------------------
	const mainThumb = req.files.find(f => f.fieldname === "videoThumbnail");

	const mainThumbErr = validateFile(
		mainThumb,
		true,                     // required
		VALID_IMAGE_TYPES,
		MAX_IMAGE_SIZE,
		"videoThumbnail"
	);

	if (mainThumbErr) {
		return _error(
			res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER, mainThumbErr
		);
	}

	// ---------------------------
	// CURRICULUM THUMBNAILS
	// ---------------------------
	for (let i = 0; i < req.body.curriculums.length; i++) {
		// SUPPORT ANY FIELD FORMAT
		const possibleFields = [
			`curriculums[${i}][thumbnail_file]`,
			`curriculums.${i}.thumbnail_file`,
			`curriculums[${i}].thumbnail_file`,
			`curriculums.${i}[thumbnail_file]`
		];

		const file = req.files.find(f => possibleFields.includes(f.fieldname));

		const err = validateFile(
			file,
			true,                       // required for each curriculum
			VALID_IMAGE_TYPES,
			MAX_IMAGE_SIZE,
			`curriculums[${i}].thumbnail_file`
		);

		if (err) {
			return _error(
				res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR,
				INVALID_REQUEST_PARAMETER, err
			);
		}
	}

	next();
};

export const updateCourseValidator = (req, res, next) => {
	// --------------------------------
	// Validate route params
	// --------------------------------
	const paramsSchema = joi.object({
		courseId: joi.number().integer().min(1).required()
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

	// --------------------------------
	// Validate request body
	// --------------------------------
	const bodySchema = joi.object({
		course_name: joi.string().min(2).max(100).required(),
		target_audience: joi.string().min(2).max(1000).required(),
		learning_outcomes: joi.string().min(2).max(1000).required(),
		curriculum_description: joi.string().min(2).max(2000).required(),

		coach_id: joi.number().integer().min(1).required(),
		domain_id: joi.number().integer().min(1).required(),
		subdomain_id: joi.number().integer().min(1).required(),

		duration: joi.string().pattern(/^\d{1,3}h\s\d{1,2}m$/).required(),

		video_id: joi.number().integer().min(1).required(),

		title: joi.string().min(2).max(200).required(),
		description: joi.string().min(2).max(2000).required(),
		video_url: joi.string().uri().required()
	});

	const bodyValidation = bodySchema.validate(req.body);
	if (bodyValidation.error) {
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			bodyValidation.error.details
		);
	}

	// --------------------------------
	// File validation (optional)
	// --------------------------------
	const fileError = validateFile(
		req.file,
		false,               // optional
		VALID_IMAGE_TYPES,
		MAX_IMAGE_SIZE,
		"thumbnail_file"
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

export const postCurriculumOutlineValidator = (req, res, next) => {
	// -------------------------------------
	// Validate params (courseId)
	// -------------------------------------
	const paramsSchema = joi.object({
		courseId: joi.number().integer().min(1).required()
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

	// -------------------------------------
	// Validate body
	// -------------------------------------
	const bodySchema = joi.object({
		header_type: joi.string().valid("Chapter", "Section", "Lesson").required(),
		sequence_no: joi.number().integer().min(1).required(),
		title: joi.string().min(2).max(255).required(),
		description: joi.string().min(2).max(1000).required(),
		video_url: joi.string().uri().required()
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

	// -------------------------------------
	// Validate thumbnail_file (REQUIRED)
	// -------------------------------------
	const fileError = validateFile(
		req.file,
		true,                      // required
		VALID_IMAGE_TYPES,
		MAX_IMAGE_SIZE,
		"thumbnail_file"
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

export const updateCurriculumOutlineValidator = (req, res, next) => {
	// -------------------------------------
	// Validate params (curriculumId)
	// -------------------------------------
	const paramsSchema = joi.object({
		curriculumId: joi.number().integer().min(1).required()
	});

	const { error: paramError } = paramsSchema.validate(req.params);
	if (paramError) {
		console.error("❌ VALIDATION ERROR:params");
		console.error("👉 Message:", paramError.message);
		console.error("👉 Details:", JSON.stringify(paramError.details ?? [], null, 2));
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			paramError.details
		);
	}

	// -------------------------------------
	// Validate body
	// -------------------------------------
	const bodySchema = joi.object({
		header_type: joi.string().valid("Chapter", "Section", "Lesson").required(),
		sequence_no: joi.number().integer().min(1).required(),
		title: joi.string().min(2).max(255).required(),
		description: joi.string().min(2).max(1000).required(),
		video_url: joi.string().uri().required(),
		video_id: joi.number().integer().min(1).required()
	});

	const { error: bodyError } = bodySchema.validate(req.body);
	if (bodyError) {
		console.error("❌ VALIDATION ERROR:body");
		console.error("👉 Message:", bodyError.message);
		console.error("👉 Details:", JSON.stringify(bodyError.details ?? [], null, 2));
		return _error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST_PARAMETER,
			bodyError.details
		);
	}

	// -------------------------------------
	// OPTIONAL thumbnail file
	// -------------------------------------
	const fileError = validateFile(
		req.file,
		false,                // OPTIONAL
		VALID_IMAGE_TYPES,
		MAX_IMAGE_SIZE,
		"thumbnail_file"
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