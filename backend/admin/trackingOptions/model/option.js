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
    ALL_OPTION_LIST,
    OPTION_ADDED_FAILED,
    OPTION_ADDED_SUCCESS,
    OPTION_DELETED_SUCCESS,
    OPTION_FOUND,
    OPTION_NOT_FOUND,
    OPTION_UPDATED_SUCCESS,
    SOMETHING_WENT_WRONG
} from "../messages/option.js";


import {
    deleteProgressTrackingOptionService,
    getAllProgressTrackingOptionsService,
    getProgressTrackingOptionService,
    postProgressTrackingOptionService,
    updateProgressTrackingOptionService
} from "../services/option.js";


export const getProgressTrackingOptionModel = async (req, res) => {
    try {
        const option_id = parseInt(req.params.option_id);
        if (isNaN(option_id)) {
            return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_OPTION_ID, null);
        }
        const option = await getProgressTrackingOptionService(option_id);
        if (!option) {
            return error(res, HTTP_NOT_FOUND, APP_RESPONSE_CODE_ERROR, OPTION_NOT_FOUND, null);
        }
        return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, OPTION_FOUND, option);
    } catch (err) {
        console.error("Get Progress Tracking Option Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
};


export const getAllProgressTrackingOptionsModel = async (req, res) => {
    try {
        const response = await getAllProgressTrackingOptionsService();
        if (response === -1) {
            return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
        }
        return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, ALL_OPTION_LIST, response);
    } catch (err) {
        console.error("Get All Progress Tracking Options Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
};

export const postProgressTrackingOptionModel = async (req, res) => {
    try {
        const { question_id, options } = req.body;

        // ----------------------------------------------
        // Insert DB record
        // ----------------------------------------------
        const response = await postProgressTrackingOptionService(
            question_id,
            options
        );

        if (!response) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                OPTION_ADDED_FAILED,
                null
            );
        }

        return success(
            res,
            HTTP_CREATED,
            APP_RESPONSE_CODE_SUCCESS,
            OPTION_ADDED_SUCCESS,
            response
        );

    } catch (err) {
        console.error("Progress Tracking Option Error:", err);
        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
};


export const updateProgressTrackingOptionModel = async (req, res) => {
    try {
        const { option_id } = req.params;
        const { question_id, options } = req.body;

        // ----------------------------------------------
        // Check if option exists
        // ----------------------------------------------
        const existingOption = await getProgressTrackingOptionService(option_id);

        if (!existingOption) {
            return error(
                res,
                HTTP_NOT_FOUND,
                APP_RESPONSE_CODE_ERROR,
                OPTION_NOT_FOUND,
                null
            );
        }

        // ----------------------------------------------
        // Update DB record
        // ----------------------------------------------
        const response = await updateProgressTrackingOptionService(
            option_id,
            question_id,
            options
        );

        if (!response) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                SOMETHING_WENT_WRONG,
                null
            );
        }

        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            OPTION_UPDATED_SUCCESS,
            response
        );

    } catch (err) {
        console.error("Progress Tracking Update Option Error:", err);
        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
};


export const deleteProgressTrackingOptionModel = async (req, res) => {
    try {
        const { option_id } = req.params;

        const existingOption = await getProgressTrackingOptionService(option_id);

        if (!existingOption) {
            return error(
                res,
                HTTP_NOT_FOUND,
                APP_RESPONSE_CODE_ERROR,
                OPTION_NOT_FOUND,
                null
            );
        }

        const response = await deleteProgressTrackingOptionService(option_id);

        if (!response) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                SOMETHING_WENT_WRONG,
                null
            );
        }

        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            OPTION_DELETED_SUCCESS,
            response
        );

    } catch (err) {
        console.error("Progress Tracking Delete Option Error:", err);
        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
};