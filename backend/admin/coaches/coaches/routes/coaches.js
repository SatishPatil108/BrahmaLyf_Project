import verifyAdminToken from "../../../middleware/verifyAdminToken.js";
import {
	postCoachesController,
	getCoachesController,
	getCoachByIdController,
	updateCoachesController,
	deleteCoachesController,
	getAllCoachesController
} from "../controller/coaches.js";
import {
	 postCoachValidator,
	 getCoachValidator,
	 updateCoachValidator,
	 deleteCoachValidator
} from "../middleware/coaches.js";
import universalUpload from "../../../../middleware/universalUpload.js";

export default (app) => {
	app.post(
		"/apis/admin/coach",
		verifyAdminToken,
		universalUpload.single("profile_picture"),
		postCoachValidator,
		postCoachesController
	);

	app.put(
		"/apis/admin/coach/:coachId",
		verifyAdminToken,
		universalUpload.single("profile_picture"),
		updateCoachValidator,
		updateCoachesController
	);

	app.delete(
		"/apis/admin/coach/:coachId",
		verifyAdminToken,
		deleteCoachValidator,
		deleteCoachesController
	);

	app.get(
		"/apis/admin/coaches/:pageNo/:pageSize",
		verifyAdminToken,
		getCoachesController
	);

	app.get(
		"/apis/admin/coach/:coachId",
		verifyAdminToken,
		getCoachValidator,
		getCoachByIdController
	);

	app.get(
		"/apis/admin/coaches",
		verifyAdminToken,
		getAllCoachesController
	);
};