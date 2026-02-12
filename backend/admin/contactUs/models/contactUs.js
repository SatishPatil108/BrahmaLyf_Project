import {
    error,
    success,
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    APP_RESPONSE_CODE_ERROR,
    APP_RESPONSE_CODE_SUCCESS,
} from "../../../response/response.js";
import sendMail from "../../../utils/send_email.js";

import {
    REPLY_ADDED_SUCCESS,
    REPLY_ADDED_FAILED,
    QUERY_LIST_SUCCESS,
    QUERY_LIST_FAILED,
    QUERY_FETCH_SUCCESS,
    QUERY_FETCH_FAILED,
    QUERY_DELETE_SUCCESS,
    QUERY_DELETE_FAILED,
    SOMETHING_WENT_WRONG
} from "../messages/contactUs.js";

import {
    postReplyService,
    getQueriesService,
    getQueryService,
    deleteQueryService
} from "../services/contactUs.js";

/* --------------------- ADD REPLY --------------------- */
export const postReplyModel = async (req, res) => {
    try {
        // Joi has already validated this before controller layer
        const queryId = req.params.inquiry_id || req.params.query_id;
        const { reply_subject, reply_message } = req.body;

        // Save reply in DB
        const response = await postReplyService(queryId, reply_subject, reply_message);

        if (!response) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                REPLY_ADDED_FAILED,
                null
            );
        }

        // Attempt to send email (email failing should NOT cause reply failure)
        let mailSent = false;
        try {
            mailSent = await sendMail(response.email, reply_subject, reply_message);
        } catch (mailErr) {
            console.error("Email sending failed:", mailErr);
        }

        // Always return success because DB operation succeeded
        return success(
            res,
            HTTP_CREATED,
            APP_RESPONSE_CODE_SUCCESS,
            REPLY_ADDED_SUCCESS,
            {
                ...response,
                emailSent: mailSent
            }
        );

    } catch (err) {
        console.error("Reply Error:", err);

        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
};


/* --------------------- GET ALL QUERIES --------------------- */
export const getQueriesModel = async (req, res) => {
    const { pageNo, pageSize } = req.params;
    try {
        const response = await getQueriesService(pageNo, pageSize);

        if (!response) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                QUERY_LIST_FAILED,
                null
            );
        }

        return success(
            res,
            200,
            APP_RESPONSE_CODE_SUCCESS,
            QUERY_LIST_SUCCESS,
            response
        );

    } catch (err) {
        console.error("Get Queries Error:", err);

        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
};

/* --------------------- GET SINGLE QUERY --------------------- */
export const getQueryModel = async (req, res) => {
    const { query_id } = req.params;

    try {
        const response = await getQueryService(query_id);

        if (!response) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                QUERY_FETCH_FAILED,
                null
            );
        }

        return success(
            res,
            200,
            APP_RESPONSE_CODE_SUCCESS,
            QUERY_FETCH_SUCCESS,
            response
        );

    } catch (err) {
        console.error("Get Query Error:", err);

        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
};

/* --------------------- DELETE QUERY --------------------- */
export const deleteQueryModel = async (req, res) => {
    const { query_id } = req.params;

    try {
        const response = await deleteQueryService(query_id);

        if (!response) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                QUERY_DELETE_FAILED,
                null
            );
        }

        return success(
            res,
            200,
            APP_RESPONSE_CODE_SUCCESS,
            QUERY_DELETE_SUCCESS,
            response
        );

    } catch (err) {
        console.error("Delete Query Error:", err);

        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
};
