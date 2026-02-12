import {
	error,
	HTTP_OK,
	APP_RESPONSE_CODE_ERROR,
	success,
	APP_RESPONSE_CODE_SUCCESS
} from "../../../response/response.js";
import {
	NO_RECORD_FOUND,
	DASHBOARD_DATA_FETCHED_SUCCESS,
	USER_COUNT_FETCHED_SUCCESS
} from "../messages/dashboard.js";
import {
	getDashboardDataService,
	getUserCountsService
} from "../services/dashboard.js";

const validPeriods = ["7d", "15d", "1m", "3m", "6m", "1y", "5y"];

// get dashboard data
export const getDashboardDataModel = async (req, res) => {
	try {
		const data = await getDashboardDataService();

		if (data === -1) {
			return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
		}

		return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, DASHBOARD_DATA_FETCHED_SUCCESS, data);

	} catch (err) {
		return error(res, 500, APP_RESPONSE_CODE_ERROR, "Internal server error", null);
	}
};

// get user counts by period
export const getUserCountsModel = async (req, res) => {
	try {
		const period = req.query.period;

		if (!period || !validPeriods.includes(period)) {
			return error(
				res,
				HTTP_OK,
				APP_RESPONSE_CODE_ERROR,
				"Invalid or missing period parameter. Allowed: 7d, 15d, 1m, 3m, 6m, 1y, 5y.",
				null
			);
		}

		const data = await getUserCountsService(period);

		if (data === -1) {
			return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
		}

		return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, USER_COUNT_FETCHED_SUCCESS, data);

	} catch (err) {
		return error(res, 500, APP_RESPONSE_CODE_ERROR, "Internal server error", null);
	}
};
