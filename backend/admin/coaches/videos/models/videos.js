import {
    error,
    HTTP_OK,
    APP_RESPONSE_CODE_ERROR,
    APP_RESPONSE_CODE_SUCCESS,
    success
} from "../../../../response/response.js";
import {
    NO_RECORD_FOUND,
    ALL_VIDEOS_LIST,
    VIDEO_DETAILS_SUCCESS,
    COURSE_VIDEOS_LIST_FETCHED_SUCCESS
} from "../messages/videos.js";
import {
    getAllVideosService,
    getVideoByIdService,
    getAllCourseVideosService
} from "../services/videos.js";

export const getAllVideosModel = async (req, res) => {
    const {pageNo,pageSize} = req.params;
    const response = await getAllVideosService(pageNo, pageSize);
    if (response === -1) {
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

export const getVideoByIdModel = async (req, res) => {
    const videoId = req.params.videoId;
    const response = await getVideoByIdService(videoId);
    if (response === -1) {
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

export const getAllCourseVideosModel = async (req, res) => {
    const {pageNo,pageSize} = req.params;
    const response = await getAllCourseVideosService(pageNo, pageSize);
    if (response === -1) {
        return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
    }
    return success(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_SUCCESS,
        COURSE_VIDEOS_LIST_FETCHED_SUCCESS,
        response
    );
};