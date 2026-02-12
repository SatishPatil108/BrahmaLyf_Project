import {
	error,
	HTTP_OK,
	APP_RESPONSE_CODE_ERROR,
	success,
	APP_RESPONSE_CODE_SUCCESS
} from "../../../../response/response.js";
import {
	NO_RECORD_FOUND,
	ALL_DOMAINS_LIST,
	ALL_SUBDOMAINS_LIST,
	ALL_SUBDOMAINS_BY_DOMAIN_LIST
} from "../messages/domain.js";
import {
	getAllDomainsService,
	getAllSubdomainsService,
	getSubdomainsByDomainIdService
} from "../services/domain.js";

export const getAllDomainsModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const response = await getAllDomainsService(pageNo, pageSize);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		ALL_DOMAINS_LIST,
		response
	);
};

export const getAllSubdomainsModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const response = await getAllSubdomainsService(pageNo, pageSize);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		ALL_SUBDOMAINS_LIST,
		response
	);
};

export const getSubdomainsByDomainIdModel = async (req, res) => {
	const { pageNo, pageSize, domainId } = req.params;
	const response = await getSubdomainsByDomainIdService(
		pageNo,
		pageSize,
		domainId
	);
	if (response == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		ALL_SUBDOMAINS_BY_DOMAIN_LIST,
		response
	);
};