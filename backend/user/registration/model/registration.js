// registration_controller.js
import {
	error,
	success,
	HTTP_OK,
	HTTP_CREATED,
	APP_RESPONSE_CODE_ERROR,
	APP_RESPONSE_CODE_SUCCESS
} from "../../../response/response.js";
import {
	EXISTING_USER,
	USER_REGISTRATION_FAILED,
	REGISTRATION_SUCCESS
} from "../message/message.js";
import {
	existingUserService,
	userRegistrationService,
	userRegistrationPasswordService
} from "../services/registration.js";
import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../../../config/config.js";
import { runTransaction } from "../../../database/transaction.js";

export const registrationModel = async (req, res) => {
	try {
		const {
			name,
			email,
			contact_number,
			password,
			dob,
			gender,
			profile_picture_url
		} = req.body;

		// ------------------------------------------
		// 1. Check if user already exists
		// ------------------------------------------
		const existingUser = await existingUserService(email, contact_number);

		if (existingUser) {
			return error(
				res,
				HTTP_OK,
				APP_RESPONSE_CODE_ERROR,
				EXISTING_USER,
				null
			);
		}

		// ------------------------------------------
		// 2. HASH PASSWORD
		// ------------------------------------------
		const hashedPassword = await bcrypt.hash(password, Number(BCRYPT_SALT_ROUNDS));

		const status = 1;
		const createdOn = new Date();

		// ------------------------------------------
		// 3. Run safe transaction
		// ------------------------------------------
		const newUser = await runTransaction(async (client) => {

			// Insert user main profile
			const userRecord = await userRegistrationService(
				name,
				email,
				contact_number,
				dob,
				gender,
				profile_picture_url,
				createdOn,
				status,
				client
			);

			if (!userRecord) {
				throw new Error("User main record insert failed");
			}

			const userId = userRecord.id;

			// Insert hashed password
			const passwordRecord = await userRegistrationPasswordService(
				userId,
				hashedPassword,
				status,
				client
			);

			if (!passwordRecord) {
				throw new Error("Password insert failed");
			}

			// Return inserted user information
			return userRecord;
		});

		// ------------------------------------------
		// 4. SUCCESS RESPONSE
		// ------------------------------------------
		return success(
			res,
			HTTP_CREATED,
			APP_RESPONSE_CODE_SUCCESS,
			REGISTRATION_SUCCESS,
			newUser
		);

	} catch (err) {
		console.error("Registration Error:", err);

		return error(
			res,
			HTTP_OK,
			APP_RESPONSE_CODE_ERROR,
			USER_REGISTRATION_FAILED,
			err.message
		);
	}
};