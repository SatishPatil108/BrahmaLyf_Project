import { getAllCoachesController, getCoachByIdController } from "../controller/coaches.js";

export default (app) => {
	app.get(
		"/apis/user/courses/coaches/:pageNo/:pageSize",
		getAllCoachesController
	);

	app.get(
		"/apis/user/courses/coach/:coachId",
		getCoachByIdController
	);
};