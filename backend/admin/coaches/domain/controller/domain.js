import { 
	postDomainModel,
	getAllDomainsModel,
	updateDomainModel,
	deleteDomainModel,
	postSubdomainModel,
	getAllSubdomainsModel,
	getSubdomainsByDomainIdModel,
	updateSubdomainModel,
	deleteSubdomainModel
} from "../models/domain.js";

// post domain
export const postDomainController = (req, res) => postDomainModel(req, res);

// get all domains
export const getAllDomainsController = (req, res) => getAllDomainsModel(req, res);

// update domain
export const updateDomainController = (req, res) => updateDomainModel(req, res);

// delete domain
export const deleteDomainController = (req, res) => deleteDomainModel(req, res);

// post subdomain
export const postSubdomainController = (req, res) => postSubdomainModel(req, res);

// get all subdomains
export const getAllSubdomainsController = (req, res) => getAllSubdomainsModel(req, res);

// get subdomains by domain id
export const getSubdomainsByDomainIdController = (req, res) => getSubdomainsByDomainIdModel(req, res);

// update subdomain
export const updateSubdomainController = (req, res) => updateSubdomainModel(req, res);

// delete subdomain
export const deleteSubdomainController = (req, res) => deleteSubdomainModel(req, res);
