import universalUpload from "../../../../middleware/universalUpload.js";
import verifyAdminToken from "../../../middleware/verifyAdminToken.js";
import {
	postDomainController,
	getAllDomainsController,
	updateDomainController,
	deleteDomainController,
	postSubdomainController,
	getAllSubdomainsController,
	getSubdomainsByDomainIdController,
	updateSubdomainController,
	deleteSubdomainController
} from "../controller/domain.js";
import {
	postDomainValidator,
	postSubdomainValidator,
	updateDomainValidator,
	updateSubdomainValidator
} from "../middlewares/domain.js";

export default (app) => {
	// add domain
	app.post(
		"/apis/admin/domain",
		verifyAdminToken,
		universalUpload.single("domain_thumbnail"),
		postDomainValidator,
		postDomainController
	);

	// update domain
	app.put(
		"/apis/admin/domain/:domain_id",
		verifyAdminToken,
		universalUpload.single("domain_thumbnail"),
		updateDomainValidator,
		updateDomainController
	);

	// get all domains
	app.get(
		"/apis/admin/domains/:pageNo/:pageSize",
		verifyAdminToken,
		getAllDomainsController
	);

	// delete domain
	app.delete(
		"/apis/admin/domain/:domain_id",
		verifyAdminToken,
		deleteDomainController
	);

	// add subdomain
	app.post(
		"/apis/admin/subdomain",
		verifyAdminToken,
		universalUpload.single("domain_thumbnail"),
		postSubdomainValidator,
		postSubdomainController
	);

	// update subdomain
	app.put(
		"/apis/admin/subdomain/:subdomain_id",
		verifyAdminToken,
		universalUpload.single("domain_thumbnail"),
		updateSubdomainValidator,
		updateSubdomainController
	);

	// get all subdomains
	app.get(
		"/apis/admin/subdomains/:pageNo/:pageSize",
		verifyAdminToken,
		getAllSubdomainsController
	);

	// get subdomains by domain id
	app.get(
		"/apis/admin/subdomains/:pageNo/:pageSize/:domainId",
		verifyAdminToken,
		getSubdomainsByDomainIdController
	);

	// delete subdomain
	app.delete(
		"/apis/admin/subdomain/:subdomain_id",
		verifyAdminToken,
		deleteSubdomainController
	);
};