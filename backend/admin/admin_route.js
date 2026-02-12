import adminAuthRoutes from "./auth/routes/auth_admin.js";
import domainRoutes from "./coaches/domain/routes/domain.js";
import dashboardRoutes from "./dashboard/routes/dashboard.js";
import coachesRoutes from "./coaches/coaches/routes/coaches.js";
import videosRoutes from "./coaches/videos/routes/videos.js";
import courseRoutes from "./coaches/course/routes/course.js";
import faqRoutes from "./faq/routes/faq.js";
import musicRoutes from "./music/routes/music.js";
import contactUs from "./contactUs/routes/contactUs.js";

export default (app) => {
	app.get("/", (req, res) => {
		res.status(200).send("Admin Module Ready!");
	});

	adminAuthRoutes(app);
	domainRoutes(app);
	dashboardRoutes(app);
	courseRoutes(app);
	coachesRoutes(app);
	videosRoutes(app);
	faqRoutes(app);
	musicRoutes(app);
	contactUs(app);
};