import { 
	getAllDomainsModel, 
	getAllSubdomainsModel, 
	getSubdomainsByDomainIdModel 
} from "../models/domain.js";

export const getAllDomainsController = getAllDomainsModel;

export const getAllSubdomainsController = getAllSubdomainsModel;

export const getSubdomainsByDomainIdController = getSubdomainsByDomainIdModel;
