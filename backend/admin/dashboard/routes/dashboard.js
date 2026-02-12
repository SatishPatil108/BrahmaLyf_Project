import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import { getDashboardDataService, getUserCountsService } from "../controller/dashboard.js";

export default (app) => {
	app.get("/apis/admin/dashboard/dashboard-data", verifyAdminToken, getDashboardDataService);
	app.get("/apis/admin/dashboard/user-counts", getUserCountsService);
};