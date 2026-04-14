import {
  error,
  HTTP_UNAUTHORIZED,
  APP_RESPONSE_CODE_ERROR,
} from "../../response/response.js";

import { JWT_SECRET } from "../../config/config.js";
import {
  NULL_TOKEN,
  INVALID_TOKEN,
  TOKEN_EXPIRED,
} from "../auth/message/auth_user_mess.js";

import pkg from "jsonwebtoken";
const { verify } = pkg;

const verifyUserToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return error(
        res,
        HTTP_UNAUTHORIZED,
        APP_RESPONSE_CODE_ERROR,
        NULL_TOKEN,
        null,
      );
    }

    if (!authHeader.startsWith("Bearer ")) {
      return error(
        res,
        HTTP_UNAUTHORIZED,
        APP_RESPONSE_CODE_ERROR,
        INVALID_TOKEN,
        null,
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "undefined" || token === "null") {
      return error(
        res,
        HTTP_UNAUTHORIZED,
        APP_RESPONSE_CODE_ERROR,
        NULL_TOKEN,
        null,
      );
    }

    const decoded = verify(token, JWT_SECRET);

    if (!decoded || !decoded.user_id) {
      return error(
        res,
        HTTP_UNAUTHORIZED,
        APP_RESPONSE_CODE_ERROR,
        INVALID_TOKEN,
        null,
      );
    }

    req.userId = decoded.user_id;
    return next();
  } catch (err) {
    console.error("JWT Verify Error (User):", err);

    if (err.name === "TokenExpiredError") {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        code: APP_RESPONSE_CODE_ERROR,
        message: TOKEN_EXPIRED, 
        tokenExpired: true, 
      });
    }

    return error(
      res,
      HTTP_UNAUTHORIZED,
      APP_RESPONSE_CODE_ERROR,
      INVALID_TOKEN,
      null,
    );
  }
};

export default verifyUserToken;
