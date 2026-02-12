import userRoutes from "../user/user_route.js";
import adminRoutes from "../admin/admin_route.js";

export default (app) => {
	app.get("/", (req, res) => {
		res.status(200).send("Hello World!");
	});
	userRoutes(app);
	adminRoutes(app);
};