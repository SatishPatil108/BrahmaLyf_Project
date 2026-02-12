import { registrationController } from "./../controller/registration.js";
import { registrationValidator } from "./../middleware/registration.js";

export default (app) => {
	app.post(
		"/apis/user/registration",
		registrationValidator,
		registrationController
	);
};
