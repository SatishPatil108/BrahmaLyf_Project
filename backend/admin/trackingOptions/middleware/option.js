import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";
import {
    error as _error,
    HTTP_BAD_REQUEST,
    APP_RESPONSE_CODE_ERROR
} from "../../../response/response.js";
import joi from "joi";

export const postProgressTrackingOptionValidator = (req, res, next) => {
    const schema = joi.object({
        question_id: joi.number().integer().positive().required(),
        options: joi.array().items(joi.string()).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        console.error(error);
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            INVALID_REQUEST_PARAMETER,
            null
        );
    }
    next();
};


export const updateProgressTrackingOptionValidator = (req, res, next) => {
    const paramsSchema = joi.object({
        option_id: joi.number().integer().positive().required(),
    });

    const bodySchema = joi.object({
        question_id: joi.number().integer().positive().required(),
        options: joi.array().items(joi.string()).required()

    });

    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) {
        console.error(paramsError);
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            INVALID_REQUEST_PARAMETER,
            null
        );
    }

    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
        console.error(bodyError);
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            INVALID_REQUEST_PARAMETER,
            null
        );
    }

    next();
};