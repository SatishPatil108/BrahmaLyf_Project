import {
	error,
	HTTP_BAD_REQUEST,
	APP_RESPONSE_CODE_ERROR,
	success,
	HTTP_CREATED,
	APP_RESPONSE_CODE_SUCCESS,
	HTTP_OK,
	HTTP_NOT_FOUND,
	HTTP_INTERNAL_SERVER_ERROR
} from "../../../../response/response.js";
import {
	COACHES_ADDED_FAILED,
	COACHES_ADDED_SUCCESS,
	NO_RECORD_FOUND,
	ALL_COACHES_LIST,
	COACH_DETAILS_FETCHED_SUCCESS,
	COACHES_UPDATED_FAILED,
	COACHES_UPDATED_SUCCESS,
	COACH_DELETED_SUCCESS
} from "../message/coaches.js";
import {
	postCoachService,
	getCoachService,
	getCoachByIdService,
	updateCoachService,
	deleteCoachService,
	getAllCoachesService
} from "../services/coaches.js";
import removeFiles from "../../../../utils/removeFiles.js";
import saveUploadedFile from "../../../../utils/uploadFile.js";

export const postCoachModel = async (req, res) => {
	const {
		name,
		email,
		contact_number: contactNumber,
		domain_id: domainId,
		subdomain_id: subdomainId,
		experience,
		professional_title: professionalTitle,
		bio
	} = req.body;
	const safeName = name.replace(/[^a-zA-Z0-9-_]/g, "_");

	const filePath = req.file
		? saveUploadedFile(req.file, "coach-images", safeName)
		: null;
	const createdOn = new Date();
	const status = 1;
	const postResponse = await postCoachService(
		name,
		email,
		contactNumber,
		professionalTitle,
		bio,
		domainId,
		subdomainId,
		experience,
		filePath,
		createdOn,
		status
	);
	if (postResponse === -1) {
		return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, COACHES_ADDED_FAILED, null);
	}
	return success(res, HTTP_CREATED, APP_RESPONSE_CODE_SUCCESS, COACHES_ADDED_SUCCESS, postResponse);
};

export const getCoachModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const response = await getCoachService(pageNo, pageSize);
	if (response === -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, ALL_COACHES_LIST, response);
};

// get single coach
export const getCoachByIdModel = async (req, res) => {
	const coachId = req.params.coachId;
	const response = await getCoachByIdService(coachId);
	if (response === -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, COACH_DETAILS_FETCHED_SUCCESS, response);
};

export const updateCoachModel = async (req, res) => {
	try {
		const coachId = req.params.coachId;
		const {
			name,
			email,
			contact_number: contactNumber,
			domain_id: domainId,
			subdomain_id: subdomainId,
			experience,
			professional_title: professionalTitle,
			bio
		} = req.body;
		const createdOn = new Date();
		const status = 1;
		const oldCoach = await getCoachByIdService(coachId);
		if (!oldCoach) {
			return error(res, HTTP_NOT_FOUND, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
		}
		const safeName = name.replace(/[^a-zA-Z0-9-_]/g, "_");

		const filePath = req.file
			? saveUploadedFile(req.file, "coach-images", safeName)
			: oldCoach.profile_image_url;
		if (req.file && oldCoach.profile_image_url) {
			await removeFiles([oldCoach.profile_image_url]);
		}
		const updateResponse = await updateCoachService(
			coachId,
			name,
			email,
			contactNumber,
			professionalTitle,
			bio,
			domainId,
			subdomainId,
			experience,
			filePath,
			createdOn,
			status
		);
		if (updateResponse === -1) {
			return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, COACHES_UPDATED_FAILED, null);
		}
		return success(res, HTTP_CREATED, APP_RESPONSE_CODE_SUCCESS, COACHES_UPDATED_SUCCESS, updateResponse);
	} catch (err) {
		console.error("Update Coach Error:", err);
		return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, "Something went wrong", null);
	}
};

export const deleteCoachModel = async (req, res) => {
	const coachId = req.params.coachId;
	const response = await deleteCoachService(coachId);
	if (response === -1) {
		return error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			NO_RECORD_FOUND,
			null
		);
	}
	if (response.profile_image) {
		removeFiles([response.profile_image]);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		COACH_DELETED_SUCCESS,
		{ coach_id: coachId }
	);
};

export const getAllCoachesModel = async (req, res) => {
	const response = await getAllCoachesService(res);
	if (response === -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, ALL_COACHES_LIST, response);
};