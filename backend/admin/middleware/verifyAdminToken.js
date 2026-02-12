import {
    error,
    HTTP_UNAUTHORIZED,
    APP_RESPONSE_CODE_ERROR
} from "../../response/response.js";

import { JWT_SECRET } from "../../config/config.js";
import { NULL_TOKEN, INVALID_TOKEN } from "../auth/message/auth_admin_mess.js";

import pkg from "jsonwebtoken";
const { verify } = pkg;

const verifyAdminToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        // No token provided
        if (!authHeader) {
            return error(res, HTTP_UNAUTHORIZED, APP_RESPONSE_CODE_ERROR, NULL_TOKEN, null);
        }

        // Must be Bearer token
        if (!authHeader.startsWith("Bearer ")) {
            return error(res, HTTP_UNAUTHORIZED, APP_RESPONSE_CODE_ERROR, INVALID_TOKEN, null);
        }

        const token = authHeader.split(" ")[1];

        // Token invalid or empty
        if (!token || token === "undefined" || token === "null") {
            return error(res, HTTP_UNAUTHORIZED, APP_RESPONSE_CODE_ERROR, NULL_TOKEN, null);
        }

        // Verify JWT
        const decoded = verify(token, JWT_SECRET);

        if (!decoded || !decoded.admin_id) {
            return error(res, HTTP_UNAUTHORIZED, APP_RESPONSE_CODE_ERROR, INVALID_TOKEN, null);
        }

        // Attach adminId to req object
        req.adminId = decoded.admin_id;

        return next();

    } catch (err) {
        console.error("JWT Verify Error:", err);
        return error(res, HTTP_UNAUTHORIZED, APP_RESPONSE_CODE_ERROR, INVALID_TOKEN, null);
    }
};

export default verifyAdminToken;