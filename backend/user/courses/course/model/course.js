import {
	error,
	HTTP_OK,
	HTTP_BAD_REQUEST,
	APP_RESPONSE_CODE_ERROR,
	success,
	APP_RESPONSE_CODE_SUCCESS
} from "../../../../response/response.js";
import {
	NO_RECORD_FOUND,
	COURSE_DETAILS_FETCHED_SUCCESS,
	USER_ALREADY_ENROLLED,
	COURSE_ENROLLED_FAILED,
	COURSE_ENROLLED_SUCCESS,
	MY_COURSES_FETCHED_SUCCESS,
	COURSE_FEEDBACK_FAILED,
	COURSE_FEEDBACK_SUCCESS,
	COURSE_FEEDBACKS_FETCHED_SUCCESS,
	INVALID_REQUEST,
	FETCH_SEARCH_COURSES_SUCCESS
} from "../message/course.js";
import {
	getCourseByIdService,
	isUserAlreadyEnrolledService,
	enrollInCourseService,
	getMyCoursesService,
	courseFeedbackService,
	getCourseFeedbacksByCourseIdService,
	getCourseFeedbacksService,
	searchCourseService
} from "../services/course.js";

export const getCourseByIdModel = async (req, res) => {
	const { courseId } = req.params;
	const response = await getCourseByIdService(courseId);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, COURSE_DETAILS_FETCHED_SUCCESS, response);
};

export const enrollInCourseModel = async (req, res) => {
	const userId = req.userId;
	const { course_id: courseId } = req.body;
	const isAlready = await isUserAlreadyEnrolledService(userId, courseId);
	if (isAlready == -2) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, USER_ALREADY_ENROLLED, null);
	}
	const response = await enrollInCourseService(
		userId,
		courseId,
		new Date(),
		1
	);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, COURSE_ENROLLED_FAILED, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, COURSE_ENROLLED_SUCCESS, response);
};

export const getMyCoursesModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const userId = req.userId;
	const response = await getMyCoursesService(userId, pageNo, pageSize);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, MY_COURSES_FETCHED_SUCCESS, response);
};

export const courseFeedbackModel = async (req, res) => {
	const userId = req.userId;
	const { enrollment_id, course_id, rating, comments } = req.body;
	const response = await courseFeedbackService(
		enrollment_id,
		userId,
		course_id,
		rating,
		comments,
		new Date(),
		1
	);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, COURSE_FEEDBACK_FAILED, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, COURSE_FEEDBACK_SUCCESS, response);
};

export const getCourseFeedbacksByCourseIdModel = async (req, res) => {
	const { pageNo, pageSize, courseId } = req.params;
	const response = await getCourseFeedbacksByCourseIdService(courseId, pageNo, pageSize);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, COURSE_FEEDBACKS_FETCHED_SUCCESS, response);
};

export const getCourseFeedbacksModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const response = await getCourseFeedbacksService(pageNo, pageSize);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, COURSE_FEEDBACKS_FETCHED_SUCCESS, response);
};

export const searchCourseModel = async (req, res) => {
	const {
		pageNo,
		pageSize,
		courseName: cName,
		coachName: chName
	} = req.params;
	const courseName = cName === "null" ? "" : cName;
	const coachName = chName === "null" ? "" : chName;
	let whereClause = "";
	if (courseName.trim()) {
		whereClause += ` AND LOWER(c.course_name) LIKE LOWER('%${courseName}%') `;
	}
	if (coachName.trim()) {
		whereClause += ` AND LOWER(co.name) LIKE LOWER('%${coachName}%') `;
	}
	const response = await searchCourseService(pageNo, pageSize, whereClause);
	if (response == -1) {
		return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, FETCH_SEARCH_COURSES_SUCCESS, response);
};