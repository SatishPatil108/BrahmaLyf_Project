import {
    error,
    success,
    HTTP_OK,
    HTTP_INTERNAL_SERVER_ERROR,
    APP_RESPONSE_CODE_ERROR,
    APP_RESPONSE_CODE_SUCCESS,
} from "../../../response/response.js";
import {
    ALL_COURSE_LIST,
    SOMETHING_WENT_WRONG
} from "../messages/searchCourse.js";
import {
    getCoursesService,
} from "../services/searchCourse.js";

export const getCoursesModel = async (req, res) => {
    try {
        const { query } = req.params;
        const result = await getCoursesService(query);

        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            ALL_COURSE_LIST,
            result
        );
    } catch (err) {
        console.error("Get Courses Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
} 