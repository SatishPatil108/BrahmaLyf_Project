import verifyUserToken from "../../../middleware/verifyUserToken.js";
import {
	getAllVideosController,
	getVideosBySubdomainIdController,
	getVideoByIdController,
	getMyCourseVideosController,
	getModuleController
} from "../controller/videos.js";

export default (app) => {
	// Protected route: Video list (coach videos)
	app.get(
		"/apis/user/coaches/videos/:pageNo/:pageSize",
		verifyUserToken,
		getAllVideosController
	);
	// Public: Videos by subdomain & coach
	app.get(
		"/apis/user/coaches/videos/:pageNo/:pageSize/:subdomainId/:coachId",
		getVideosBySubdomainIdController
	);
	// Public: Video details by ID
	app.get(
		"/apis/user/coaches/video/:videoId",
		getVideoByIdController
	);
	// Protected: My course videos
	app.get(
		"/apis/user/coaches/my-course-videos/:courseId",
		verifyUserToken,
		getMyCourseVideosController
	);
	app.get(
		"/apis/user/coaches/my-course-module/:moduleId",
		verifyUserToken,
		getModuleController
	);
};