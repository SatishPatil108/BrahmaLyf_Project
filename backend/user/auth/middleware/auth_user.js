import Joi from "joi";
import {
    error as _error,
    HTTP_BAD_REQUEST,
    HTTP_UNAUTHORIZED,
    APP_RESPONSE_CODE_ERROR
} from "../../../response/response.js";

import { NULL_TOKEN } from "../message/auth_user_mess.js";
import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";


// ------------------------------------------------------
// LOGIN VALIDATOR
// ------------------------------------------------------
export const loginValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(6).required(),
        rememberMe: Joi.bool().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
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


// ------------------------------------------------------
// RESET PASSWORD VALIDATOR
// ------------------------------------------------------
export const resetPasswordValidator = (req, res, next) => {
    // Token check
    if (!req.userId) {
        console.error(req.userId, 0);
        return _error(
            res,
            HTTP_UNAUTHORIZED,
            APP_RESPONSE_CODE_ERROR,
            NULL_TOKEN,
            null
        );
    }

    const schema = Joi.object({
        currentPassword: Joi.string()
            .min(6)
            .required(),

        newPassword: Joi.string()
            .min(8)
            .max(20)
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$"))
            .required()
            .messages({
                "string.min": "Password must be at least 8 characters",
                "string.max": "Password must not exceed 20 characters",
                "string.pattern.base":
                    "Password must include uppercase, lowercase, number, and special character (!@#$%^&*)"
            })
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


// ------------------------------------------------------
// FORGET PASSWORD VALIDATOR
// ------------------------------------------------------
export const forgetPasswordValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().email().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
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


// ------------------------------------------------------
// UPDATE PROFILE VALIDATOR
// ------------------------------------------------------
export const updateProfileValidator = (req, res, next) => {
    // 1️⃣ User must be logged in
    if (!req.userId) {
        return _error(
            res,
            HTTP_UNAUTHORIZED,
            APP_RESPONSE_CODE_ERROR,
            NULL_TOKEN,
            null
        );
    }

    // 2️⃣ Validate profile fields (all required except profile picture)
    const schema = Joi.object({
        name: Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Name is required',
                'string.min': 'Name must have at least 2 characters',
                'any.required': 'Name is required'
            }),

        email: Joi.string()
            .trim()
            .email()
            .required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please enter a valid email address',
                'any.required': 'Email is required'
            }),

        contact_number: Joi.string()
            .pattern(/^\d{10}$/)
            .required()
            .messages({
                'string.empty': 'Contact number is required',
                'string.pattern.base': 'Contact number must be exactly 10 digits',
                'any.required': 'Contact number is required'
            }),

        dob: Joi.date()
            .iso()
            .max('now')
            .required()
            .messages({
                'date.base': 'Date of birth is required',
                'date.format': 'Date of birth must be in YYYY-MM-DD format',
                'date.max': 'Date of birth cannot be in the future',
                'any.required': 'Date of birth is required'
            }),

        gender: Joi.string()
            .valid('-1', '0', '1')
            .required()
            .messages({
                'string.empty': 'Gender is required',
                'any.only': 'Gender must be 1 (Male), 0 (Female), or -1 (Other)',
                'any.required': 'Gender is required'
            })
            .custom((value, helpers) => {
                // Convert string to number for database
                return parseInt(value);
            }, 'Convert gender to number')
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        console.error("Profile Validation Error:", error.details);
        const errorMessages = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
        }));

        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            "Please fill all required fields",
            errorMessages
        );
    }

    // Update req.body with validated data
    req.body = value;

    // 3️⃣ Validate file (optional)
    if (req.file) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(req.file.mimetype)) {
            return _error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                "Invalid file type. Allowed: JPG, JPEG, PNG, WEBP",
                null
            );
        }

        if (req.file.size > maxSize) {
            return _error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`,
                null
            );
        }
    }

    next();
};


// ------------------------------------------------------
// SEND OTP VALIDATOR
// ------------------------------------------------------
export const sendOtpValidator = (req, res, next) => {

    // 1️⃣ User must be logged in
    if (!req.userId) {
        return _error(
            res,
            HTTP_UNAUTHORIZED,
            APP_RESPONSE_CODE_ERROR,
            NULL_TOKEN,
            null
        );
    }

    // 2️⃣ Joi schema for email
    const schema = Joi.object({
        email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        console.error(error)
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

export const verifyOtpValidator = (req, res, next) => {

    // 1️⃣ Check login token → userId must exist
    if (!req.userId) {
        console.error(req.userId, 1)
        return _error(
            res,
            HTTP_UNAUTHORIZED,
            APP_RESPONSE_CODE_ERROR,
            NULL_TOKEN,
            null
        );
    }

    // 2️⃣ Joi schema → validate 6 digit OTP
    const schema = Joi.object({
        otp: Joi.string()
            .pattern(/^\d{6}$/)  // exactly 6 digits
            .required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        console.error(error)
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