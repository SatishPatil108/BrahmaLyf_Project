import joi from "joi";
import pkg from "jsonwebtoken";
import {
    error as _error,
    HTTP_BAD_REQUEST,
    APP_RESPONSE_CODE_ERROR
} from "../../../response/response.js";
import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";
import { JWT_SECRET } from "../../../config/config.js";

const { verify } = pkg;

// ---------------------------------------
// OPTIONAL USER AUTH MIDDLEWARE
// ---------------------------------------
export const optionalUserToken = (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            req.userId = null;
            return next();
        }

        const token = authHeader.split(" ")[1];

        if (!token || token === "undefined" || token === "null") {
            req.userId = null;
            return next();
        }

        const decoded = verify(token, JWT_SECRET);

        req.userId = decoded?.user_id || null;

        return next();

    } catch (err) {
        console.error("Optional Token Error:", err);
        req.userId = null;
        return next();
    }
};

// ---------------------------------------
// CONTACT US VALIDATOR
// ---------------------------------------
export const postContactUsValidator = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(2).max(100).trim().required(),
        email: joi.string().email().trim().required(),
        message: joi.string().min(2).max(2000).trim().required()
    });

    const { error } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const combinedMessages = error.details.map((d) => d.message).join(", ");

        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            INVALID_REQUEST_PARAMETER,
            combinedMessages
        );
    }

    next();
};
export const postSubscribeToNewsletterValidator = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().trim().lowercase().required(),
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const combinedMessages = error.details
      .map(d => d.message.replace(/"/g, ""))
      .join(", ");

    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      combinedMessages
    );
  }

  req.body = value; // ✅ sanitized input
  next();
};
