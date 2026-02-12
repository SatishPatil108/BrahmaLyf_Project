import {
	error,
	HTTP_OK,
	APP_RESPONSE_CODE_ERROR,
	success,
	APP_RESPONSE_CODE_SUCCESS
} from "../../../../response/response.js";
import {
	NO_RECORD_FOUND,
	ALL_VIDEOS_LIST,
	ALL_VIDEOS_SUBDOMAIN_ID_LIST,
	VIDEO_DETAILS_SUCCESS,
	MY_COURSE_VIDEO_LIST_FETCHED_SUCCESS
} from "../messages/videos.js";
import {
	getAllVideosService,
	getVideosBySubdomainIdService,
	getVideoByIdService,
	getMyCourseVideosService,
	getModuleService
} from "../services/videos.js";

export const getAllVideosModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const response = await getAllVideosService(pageNo, pageSize);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		ALL_VIDEOS_LIST,
		response
	);
};

export const getVideosBySubdomainIdModel = async (req, res) => {
	const { pageNo, pageSize, subdomainId, coachId } = req.params;
	const response = await getVideosBySubdomainIdService(
		pageNo,
		pageSize,
		subdomainId,
		coachId
	);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		ALL_VIDEOS_SUBDOMAIN_ID_LIST,
		response
	);
};

export const getVideoByIdModel = async (req, res) => {
	const videoId = req.params.videoId;
	const response = await getVideoByIdService(videoId);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		VIDEO_DETAILS_SUCCESS,
		response
	);
};

export const getMyCourseVideosModel = async (req, res) => {
	const courseId = req.params.courseId;
	const response = await getMyCourseVideosService(courseId);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		MY_COURSE_VIDEO_LIST_FETCHED_SUCCESS,
		response
	);
};
export const getModuleModel = async (req, res) => {
	const moduleId = req.params.moduleId;
	const response = await getModuleService(moduleId);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		MY_COURSE_VIDEO_LIST_FETCHED_SUCCESS,
		response
	);
};