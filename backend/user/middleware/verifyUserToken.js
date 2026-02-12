import {
	error,
	HTTP_UNAUTHORIZED,
	APP_RESPONSE_CODE_ERROR
} from "../../response/response.js";

import { JWT_SECRET } from "../../config/config.js";
import { NULL_TOKEN, INVALID_TOKEN } from "../auth/message/auth_user_mess.js";

import pkg from "jsonwebtoken";
const { verify } = pkg;

const verifyUserToken = (req, res, next) => {
	try {
		const authHeader =
			req.headers.authorization || req.headers.Authorization;

		// No Authorization header at all
		if (!authHeader) {
			return error(
				res,
				HTTP_UNAUTHORIZED,
				APP_RESPONSE_CODE_ERROR,
				NULL_TOKEN,
				null
			);
		}

		// Must start with "Bearer "
		if (!authHeader.startsWith("Bearer ")) {
			return error(
				res,
				HTTP_UNAUTHORIZED,
				APP_RESPONSE_CODE_ERROR,
				INVALID_TOKEN,
				null
			);
		}

		const token = authHeader.split(" ")[1];

		// Empty or invalid token
		if (!token || token === "undefined" || token === "null") {
			return error(
				res,
				HTTP_UNAUTHORIZED,
				APP_RESPONSE_CODE_ERROR,
				NULL_TOKEN,
				null
			);
		}

		// Verify the token
		const decoded = verify(token, JWT_SECRET);

		if (!decoded || !decoded.user_id) {
			return error(
				res,
				HTTP_UNAUTHORIZED,
				APP_RESPONSE_CODE_ERROR,
				INVALID_TOKEN,
				null
			);
		}

		// Attach user id to request
		req.userId = decoded.user_id;

		return next();

	} catch (err) {
		console.error("JWT Verify Error (User):", err);

		return error(
			res,
			HTTP_UNAUTHORIZED,
			APP_RESPONSE_CODE_ERROR,
			INVALID_TOKEN,
			null
		);
	}
};

export default verifyUserToken;
