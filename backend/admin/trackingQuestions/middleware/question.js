import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";
import {
    error as _error,
    HTTP_BAD_REQUEST,
    APP_RESPONSE_CODE_ERROR
} from "../../../response/response.js";
import joi from "joi";

export const postProgressTrackingQuestionValidator = (req, res, next) => {
    const schema = joi.array().items(
        joi.object({
            question_text: joi.string().min(3).required(),
            option_type: joi.number().integer().valid(1, 2, 3, 4, 5).required(),
            week_no: joi.number().integer().min(1).max(52).required(),
            day_no: joi.number().integer().min(1).max(7).required(),
        })
    ).min(1).required();

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


export const updateProgressTrackingQuestionValidator = (req, res, next) => {
    const paramsSchema = joi.object({
        question_id: joi.number().integer().positive().required(),
    });

    const bodySchema = joi.array().items(
        joi.object({
            question_text: joi.string().min(3).required(),
            option_type: joi.number().integer().valid(1, 2, 3, 4, 5).required(),
            week_no: joi.number().integer().min(1).max(52).required(),
            day_no: joi.number().integer().min(1).max(7).required(),
        })
    ).min(1).required();

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