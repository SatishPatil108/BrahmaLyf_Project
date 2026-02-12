import registrationRoutes from "./registration/routes/registration.js";
import authRoutes from "./auth/routes/auth_user.js";
import forgotPasswordRoutes from "./forgotPassword/routes/forgotPassword.js";
import domainRoutes from "./courses/domain/routes/domain.js";
import coachesRoutes from "./courses/coaches/routes/coaches.js";
import videosRoutes from "./courses/videos/routes/videos.js";
import courseRoutes from "./courses/course/routes/course.js";
import dashboardCourseRoutes from "./dashboard/routes/dashboard.js";
import courseNamesAndCoachNamesRoutes from "./courseNamesAndCoachNames/routes/courseNamesAndCoachNames.js";
import musicRoutes from "./music/routes/music.js";
import searchCourseRoutes from "./searchCourse/routes/searchCourse.js";
import contactUsRoutes from "./contactUs/routes/contactUs.js";

export default (app) => {
	app.get("/apis/", (req, res) => {
		res.status(200).send("user Module Ready!");
	});
	registrationRoutes(app);
	authRoutes(app);
	forgotPasswordRoutes(app);
	domainRoutes(app);
	coachesRoutes(app);
	videosRoutes(app);
	courseRoutes(app);
	dashboardCourseRoutes(app);
	courseNamesAndCoachNamesRoutes(app);
	musicRoutes(app);
	searchCourseRoutes(app);
	contactUsRoutes(app);
};