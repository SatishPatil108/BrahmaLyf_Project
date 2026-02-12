import {
	error,
	HTTP_BAD_REQUEST,
	APP_RESPONSE_CODE_ERROR,
	success,
	HTTP_CREATED,
	APP_RESPONSE_CODE_SUCCESS,
	HTTP_OK
} from "../../../response/response.js";
import {
	FAQ_ADDED_FAILED,
	FAQ_ADDED_SUCCESS,
	NO_RECORD_FOUND,
	ALL_FAQ_LIST,
	FAQ_UPDATED_FAILED,
	FAQ_UPDATED_SUCCESS,
	FAQ_DELETED_FAILED,
	FAQ_DELETED_SUCCESS
} from "../messages/faq.js";
import {
	postFaqService,
	getFaqService,
	updateFaqService,
	deleteFaqService
} from "../services/faq.js";

// CREATE FAQ
export const postFaqModel = async (req, res) => {
	const { question, answer } = req.body;
	const status = 1;
	const result = await postFaqService(question, answer, status);
	if (result === -1) {
		return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, FAQ_ADDED_FAILED, null);
	}
	return success(res, HTTP_CREATED, APP_RESPONSE_CODE_SUCCESS, FAQ_ADDED_SUCCESS, result);
};

// GET FAQ LIST
export const getFaqModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const result = await getFaqService(pageNo, pageSize);
	if (result === -1) {
		return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, ALL_FAQ_LIST, result);
};

// UPDATE FAQ
export const updateFaqModel = async (req, res) => {
	const { faqId } = req.params;
	const { question, answer } = req.body;
	const status = 1;
	const result = await updateFaqService(faqId, question, answer, status);
	if (result === -1) {
		console.error(result)
		return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, FAQ_UPDATED_FAILED, null);
	}
	return success(
		res,
		HTTP_CREATED,
		APP_RESPONSE_CODE_SUCCESS,
		FAQ_UPDATED_SUCCESS,
		{ faq_id: faqId }
	);
};

// DELETE FAQ
export const deleteFaqModel = async (req, res) => {
	const { faqId } = req.params;
	const result = await deleteFaqService(faqId);
	if (result === -1) {
		return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, FAQ_DELETED_FAILED, null);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		FAQ_DELETED_SUCCESS,
		{ faq_id: faqId }
	);
};
