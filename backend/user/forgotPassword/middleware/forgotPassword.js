import Joi from "joi";
import {
    error as _error,
    HTTP_BAD_REQUEST,
    APP_RESPONSE_CODE_ERROR
} from "../../../response/response.js";
import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";

export const sendOtpValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().email().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const message = error.details?.[0]?.message || INVALID_REQUEST_PARAMETER;

        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            message,
            null
        );
    }

    next();
};

export const verifyOtpValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().email().required(),
        otp: Joi.string()
            .pattern(/^\d{6}$/) // must be exactly 6 digits
            .required()
            .messages({
                "string.pattern.base": "OTP must be a 6-digit number"
            })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const message = error.details?.[0]?.message || INVALID_REQUEST_PARAMETER;

        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            message,
            null
        );
    }

    next();
};

export const resetPasswordValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .trim()
            .email()
            .required(),

        newPass: Joi.string()
            .min(8)
            .max(20)
            .pattern(
                new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$")
            )
            .required()
            .messages({
                "string.empty": "Password is required",
                "string.min": "Password must be at least 8 characters",
                "string.max": "Password must not exceed 20 characters",
                "string.pattern.base":
                    "Password must include uppercase, lowercase, number, and special character (!@#$%^&*)"
            })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const message = error.details?.[0]?.message || INVALID_REQUEST_PARAMETER;

        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            message,
            null
        );
    }

    next();
};