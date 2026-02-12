import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import {
	postFaqController,
	getFaqController,
	updateFaqController,
	deleteFaqController
} from "../controller/faq.js";
import {
	postFaqValidator,
	updateFaqValidator
} from "../middlewares/faq.js";

export default (app) => {
	app.post(
		"/apis/admin/faq",
		verifyAdminToken,
		postFaqValidator,
		postFaqController
	);

	app.put(
		"/apis/admin/faq/:faqId",
		verifyAdminToken,
		updateFaqValidator,
		updateFaqController
	);

	app.get(
		"/apis/admin/faqs/:pageNo/:pageSize",    
		verifyAdminToken,
		getFaqController
	);

	app.delete(
		"/apis/admin/faq/:faqId",
		verifyAdminToken,
		deleteFaqController
	);
};