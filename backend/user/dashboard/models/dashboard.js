import { 
    error, 
    success, 
    HTTP_OK, 
    HTTP_BAD_REQUEST, 
    APP_RESPONSE_CODE_ERROR, 
    APP_RESPONSE_CODE_SUCCESS 
} from "../../../response/response.js";
import { 
    NO_RECORD_FOUND, 
    DASHBOARD_DATA_FETCHED_SUCCESS, 
    ALL_FAQ_LIST 
} from "../messages/dashboard.js";
import { 
    getDashboardDataService,
    getFaqService
} from "../services/dashboard.js";

// ====================== DASHBOARD ======================
export const getDashboardDataModel = async (req, res) => {
    const data = await getDashboardDataService();
    if (data === -1) {
        return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
    }
    return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, DASHBOARD_DATA_FETCHED_SUCCESS, data);
};

// ====================== FAQ LIST ======================
export const getFaqModel = async (req, res) => {
    const { pageNo, pageSize } = req.params;
    const data = await getFaqService(pageNo, pageSize);
    if (data === -1) {
        return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
    }
    return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, ALL_FAQ_LIST, data);
};