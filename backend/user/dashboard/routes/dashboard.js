import { getDashboardDataController, getFaqController } from "../controller/dashboard.js";

export default (app) => {
	app.get("/apis/user/dashboard", getDashboardDataController);
	app.get("/apis/user/faq/:pageNo/:pageSize", getFaqController);
};