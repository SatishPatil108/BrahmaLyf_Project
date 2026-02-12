import verifyAdminToken from "../../../middleware/verifyAdminToken.js";
import {
	getAllVideosController,
	getVideoByIdController,
	getAllCourseVideosController
} from "../controller/videos.js";

export default (app) => {

	app.get(
		"/apis/admin/coaches/videos/:pageNo/:pageSize",
		verifyAdminToken,
		getAllVideosController
	);

	app.get(
		"/apis/admin/coaches/video/:videoId",
		verifyAdminToken,
		getVideoByIdController
	);

	app.get(
		"/apis/admin/coaches/videos/course-videos/:pageNo/:pageSize",
		verifyAdminToken,
		getAllCourseVideosController
	);
};
