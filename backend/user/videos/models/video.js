import {
    error,
    success,
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_OK,
    HTTP_NOT_FOUND,
    HTTP_INTERNAL_SERVER_ERROR,
    APP_RESPONSE_CODE_ERROR,
    APP_RESPONSE_CODE_SUCCESS,
} from "../../../response/response.js";
 
import {

    ALL_VIDEO_LIST,
    VIDEO_NOT_FOUND,
    VIDEO_FOUND,
    INVALID_REQUEST,
    SOMETHING_WENT_WRONG,
    INVALID_VIDEO_ID,
} from "../messages/video.js";

import {
    getShortVideoService,
    getShortVideosService,
}
    from "../services/video.js";

export const getShortVideosModel = async (req, res) => {
    try {
        const { pageNo, pageSize } = req.params;
        const domain_id = req.query.domain_id ? parseInt(req.query.domain_id) : null;

 
        const result = await getShortVideosService(pageNo, pageSize, domain_id);

        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            ALL_VIDEO_LIST,
            result
        );
    } catch (err) {
        console.error("Get Short Videos Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
}

export const getShortVideoModel = async (req, res) => {
    try {
        const shortVideoId = parseInt(req.params.shortVideoId);
        if (isNaN(shortVideoId)) {
            return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_VIDEO_ID, null);
        }
        const video = await getShortVideoService(shortVideoId);
        if (!video) {
            return error(res, HTTP_NOT_FOUND, APP_RESPONSE_CODE_ERROR, VIDEO_NOT_FOUND, null);
        }
        return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, VIDEO_FOUND, video);
    } catch (err) {
        console.error("Get Short Video Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
}



