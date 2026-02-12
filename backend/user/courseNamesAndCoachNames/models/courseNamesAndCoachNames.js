import { 
    error,
    success,
    HTTP_OK,
    APP_RESPONSE_CODE_ERROR,
    APP_RESPONSE_CODE_SUCCESS
} from "../../../response/response.js";
import { 
    NO_RECORD_FOUND,
    COURSE_NAMES_AND_COACH_NAMES_FETCHED_SUCCESS 
} from "../messages/courseNamesAndCoachNames.js";
import { 
     getCourseNamesAndCoachNamesService 
} from "../services/courseNamesAndCoachNames.js";

export const getCourseNamesAndCoachNamesModel = async (req, res) => {
    const data = await getCourseNamesAndCoachNamesService();
    if (data === -1) {
        return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
    }
    return success(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_SUCCESS,
        COURSE_NAMES_AND_COACH_NAMES_FETCHED_SUCCESS,
        data
    );
};