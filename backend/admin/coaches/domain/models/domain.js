import {
	error,
	HTTP_BAD_REQUEST,
	APP_RESPONSE_CODE_ERROR,
	success,
	HTTP_CREATED,
	APP_RESPONSE_CODE_SUCCESS,
	HTTP_OK,
	HTTP_NOT_FOUND,
	HTTP_INTERNAL_SERVER_ERROR
} from "../../../../response/response.js";
import  removeFiles from "../../../../utils/removeFiles.js";
import saveUploadedFile from "../../../../utils/uploadFile.js";
import {
	DOMAIN_ADDED_FAILED,
	DOMAIN_ADDED_SUCCESS,
	NO_RECORD_FOUND,
	ALL_DOMAINS_LIST,
	INVALID_REQUEST,
	DOMAIN_UPDATED_SUCCESS,
	DOMAIN_DELETED_SUCCESS,
	SUBDOMAIN_ADDED_FAILED,
	SUBDOMAIN_ADDED_SUCCESS,
	ALL_SUBDOMAINS_LIST,
	ALL_SUBDOMAINS_BY_DOMAIN_LIST,
	SUBDOMAIN_UPDATED_SUCCESS,
	SUBDOMAIN_DELETED_SUCCESS
} from "../messages/domain.js";
import {
	postDomainService,
	postSubdomainService,
	updateDomainService,
	updateSubdomainService,
	deleteDomainService,
	deleteSubdomainService,
	deleteSubdomainsService,
	getAllDomainsService,
	getDomainByIdService,
	getAllSubdomainsService,
	getSubdomainsByDomainIdService,
	getSubdomainByIdService,
} from "../services/domain.js";

export const postDomainModel = async (req, res) => {
	try {
		const domainName = req.body.domain_name;

		// sanitize for safe file naming
		const safeName = domainName.replace(/[^a-zA-Z0-9-_]/g, "_");

		// Save thumbnail (required by validator)
		const thumbnailUrl = req.file
			? saveUploadedFile(req.file, "domain-thumbnails", safeName)
			: null;

		const status = 1;

		const response = await postDomainService(domainName, thumbnailUrl, status);

		if (!response || response === -1) {
			return error(
				res,
				HTTP_BAD_REQUEST,
				APP_RESPONSE_CODE_ERROR,
				DOMAIN_ADDED_FAILED,
				null
			);
		}

		return success(
			res,
			HTTP_CREATED,
			APP_RESPONSE_CODE_SUCCESS,
			DOMAIN_ADDED_SUCCESS,
			response
		);

	} catch (err) {
		console.error("Error adding domain:", err);
		return error(
			res,
			HTTP_INTERNAL_SERVER_ERROR,
			APP_RESPONSE_CODE_ERROR,
			SOMETHING_WENT_WRONG,
			null
		);
	}
};

export const getAllDomainsModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const response = await getAllDomainsService(pageNo, pageSize);
	if (response === -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, ALL_DOMAINS_LIST, response);
};

export const updateDomainModel = async (req, res) => {
	try {
		const domainId = req.params.domain_id;
		const domainName = req.body.domain_name;

		// ----------------------------------------------------
		// Fetch existing domain
		// ----------------------------------------------------
		const existing = await getDomainByIdService(domainId);

		if (!existing || existing === -1) {
			return error(
				res,
				HTTP_NOT_FOUND,
				APP_RESPONSE_CODE_ERROR,
				NO_RECORD_FOUND,
				null
			);
		}

		// ----------------------------------------------------
		// Handle thumbnail update (optional)
		// ----------------------------------------------------
		let domainThumbnail = existing.domain_thumbnail;

		if (req.file) {
			// Safe filename based on domain name
			const safeName = domainName.replace(/[^a-zA-Z0-9-_]/g, "_");

			// Save new file
			domainThumbnail = saveUploadedFile(
				req.file,
				"domain-thumbnails",
				safeName
			);

			// Delete old file
			if (existing.domain_thumbnail) {
				await removeFiles([existing.domain_thumbnail]);
			}
		}

		// ----------------------------------------------------
		// Update DB
		// ----------------------------------------------------
		const updateResponse = await updateDomainService(
			domainId,
			domainName,
			domainThumbnail
		);

		if (!updateResponse || updateResponse === -1) {
			return error(
				res,
				HTTP_BAD_REQUEST,
				APP_RESPONSE_CODE_ERROR,
				INVALID_REQUEST,
				null
			);
		}

		// ----------------------------------------------------
		// Success response
		// ----------------------------------------------------
		return success(
			res,
			HTTP_OK,
			APP_RESPONSE_CODE_SUCCESS,
			DOMAIN_UPDATED_SUCCESS,
			{
				domain_id: domainId,
				domain_name: domainName,
				domain_thumbnail: domainThumbnail
			}
		);

	} catch (err) {
		console.error("Update Domain Error:", err);
		return error(
			res,
			HTTP_INTERNAL_SERVER_ERROR,
			APP_RESPONSE_CODE_ERROR,
			"Something went wrong",
			null
		);
	}
};

export const deleteDomainModel = async (req, res) => {
	const domainId = req.params.domain_id;
	const deleteSubdomainsResponse = await deleteSubdomainsService(domainId);
	if (deleteSubdomainsResponse.status === -1) {
		return error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST,
			null
		);
	}
	removeFiles(deleteSubdomainsResponse.thumbnails);
	const deleteDomainResponse = await deleteDomainService(domainId);
	if (deleteDomainResponse.status === -1) {
		return error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST,
			null
		);
	}
	removeFiles([deleteDomainResponse.thumbnail]);
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		DOMAIN_DELETED_SUCCESS,
		{ domain_id: domainId }
	);
};

export const postSubdomainModel = async (req, res) => {
	try {
		const domainId = req.body.domain_id;
		const subdomainName = req.body.subdomain_name;
		const progressiveDifficulty = req.body.progressive_difficulty;

		// Safe filename for saving
		const safeName = subdomainName.replace(/[^a-zA-Z0-9-_]/g, "_");

		// Save thumbnail (required — validator guarantees req.file exists)
		const thumbnailUrl = req.file
			? saveUploadedFile(req.file, "subdomain-thumbnails", safeName)
			: null;

		const status = 1;

		const response = await postSubdomainService(
			domainId,
			subdomainName,
			progressiveDifficulty,
			thumbnailUrl,
			status
		);

		if (!response || response === -1) {
			return error(
				res,
				HTTP_BAD_REQUEST,
				APP_RESPONSE_CODE_ERROR,
				SUBDOMAIN_ADDED_FAILED,
				null
			);
		}

		return success(
			res,
			HTTP_CREATED,
			APP_RESPONSE_CODE_SUCCESS,
			SUBDOMAIN_ADDED_SUCCESS,
			response
		);

	} catch (err) {
		console.error("Post Subdomain Error:", err);
		return error(
			res,
			HTTP_INTERNAL_SERVER_ERROR,
			APP_RESPONSE_CODE_ERROR,
			"Something went wrong",
			null
		);
	}
};

export const getAllSubdomainsModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const response = await getAllSubdomainsService(pageNo, pageSize);
	if (response === -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, ALL_SUBDOMAINS_LIST, response);
};

export const getSubdomainsByDomainIdModel = async (req, res) => {
	const { pageNo, pageSize, domainId } = req.params;
	const response = await getSubdomainsByDomainIdService(pageNo, pageSize, domainId);
	if (response === -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, ALL_SUBDOMAINS_BY_DOMAIN_LIST, response);
};

export const updateSubdomainModel = async (req, res) => {
	try {
		const subdomainId = req.params.subdomain_id;
		const domainId = req.body.domain_id;
		const subdomainName = req.body.subdomain_name;
		const progressiveDifficulty = req.body.progressive_difficulty;

		// -------------------------------------------------------
		// 1. Fetch existing subdomain record
		// -------------------------------------------------------
		const existing = await getSubdomainByIdService(subdomainId, domainId);

		if (!existing || existing === -1) {
			return error(
				res,
				HTTP_NOT_FOUND,
				APP_RESPONSE_CODE_ERROR,
				NO_RECORD_FOUND,
				null
			);
		}

		// -------------------------------------------------------
		// 2. Save thumbnail (optional)
		// -------------------------------------------------------
		let subdomainThumbnail = existing.subdomain_thumbnail;

		if (req.file) {
			// Safe filename
			const safeName = subdomainName.replace(/[^a-zA-Z0-9-_]/g, "_");

			// Save new thumbnail
			subdomainThumbnail = saveUploadedFile(
				req.file,
				"subdomain-thumbnails",
				safeName
			);

			// Remove old thumbnail
			if (existing.subdomain_thumbnail) {
				await removeFiles([existing.subdomain_thumbnail]);
			}
		}

		// -------------------------------------------------------
		// 3. Update DB
		// -------------------------------------------------------
		const updateResponse = await updateSubdomainService(
			subdomainId,
			domainId,
			subdomainName,
			progressiveDifficulty,
			subdomainThumbnail
		);

		if (!updateResponse || updateResponse === -1) {
			return error(
				res,
				HTTP_BAD_REQUEST,
				APP_RESPONSE_CODE_ERROR,
				INVALID_REQUEST,
				null
			);
		}

		// -------------------------------------------------------
		// 4. Final Response
		// -------------------------------------------------------
		return success(
			res,
			HTTP_OK,
			APP_RESPONSE_CODE_SUCCESS,
			SUBDOMAIN_UPDATED_SUCCESS,
			{
				subdomain_id: subdomainId,
				subdomain_name: subdomainName,
				domain_id: domainId,
				progressive_difficulty: progressiveDifficulty,
				subdomain_thumbnail: subdomainThumbnail
			}
		);

	} catch (err) {
		console.error("Update Subdomain Error:", err);
		return error(
			res,
			HTTP_INTERNAL_SERVER_ERROR,
			APP_RESPONSE_CODE_ERROR,
			"Something went wrong",
			null
		);
	}
};

export const deleteSubdomainModel = async (req, res) => {
	const subdomainId = req.params.subdomain_id;
	const response = await deleteSubdomainService(subdomainId);
	if (response.status === -1) {
		return error(
			res,
			HTTP_BAD_REQUEST,
			APP_RESPONSE_CODE_ERROR,
			INVALID_REQUEST,
			null
		);
	}
	if (response.thumbnail) {
		removeFiles([response.thumbnail]);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		SUBDOMAIN_DELETED_SUCCESS,
		{ subdomain_id: subdomainId }
	);
};