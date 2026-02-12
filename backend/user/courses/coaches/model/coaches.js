import {
	error,
	HTTP_OK,
	APP_RESPONSE_CODE_ERROR,
	success,
	APP_RESPONSE_CODE_SUCCESS
} from "../../../../response/response.js";
import {
	NO_RECORD_FOUND,
	ALL_COACHES_LIST,
	COACH_DETAILS_FETCHED_SUCCESS
} from "../message/coaches.js";
import {
	getAllCoachesService,
	getCoachByIdService
} from "../services/coaches.js";

export const getAllCoachesModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const response = await getAllCoachesService(pageNo, pageSize);
	if (response == -1) {
		return error(
			res,
			HTTP_OK,
			APP_RESPONSE_CODE_ERROR,
			NO_RECORD_FOUND,
			null
		);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		ALL_COACHES_LIST,
		response
	);
};

export const getCoachByIdModel = async (req, res) => {
	const coachId = req.params.coachId;
	const response = await getCoachByIdService(coachId);
	if (response == -1) {
		return error(
			res,
			HTTP_OK,
			APP_RESPONSE_CODE_ERROR,
			NO_RECORD_FOUND,
			null
		);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		COACH_DETAILS_FETCHED_SUCCESS,
		response
	);
};