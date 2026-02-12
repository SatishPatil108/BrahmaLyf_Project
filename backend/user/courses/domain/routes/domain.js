// import verifyUserToken from "../../../middleware/verifyUserToken.js";
import { 
	getAllDomainsController, 
	getAllSubdomainsController, 
	getSubdomainsByDomainIdController 
} from "../controller/domain.js";

// verifyUserToken intentionally removed as per requirement
export default (app) => {

	app.get(
		"/apis/user/domains/:pageNo/:pageSize",
		getAllDomainsController
	);

	app.get(
		"/apis/user/subdomains/:pageNo/:pageSize",
		getAllSubdomainsController
	);

	app.get(
		"/apis/user/subdomains/:pageNo/:pageSize/:domainId",
		getSubdomainsByDomainIdController
	);
};