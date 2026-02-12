import { 
	getDashboardDataModel,
	getUserCountsModel
} from "../models/dashboard.js";

// get dashboard data
export const getDashboardDataService = (req, res) => getDashboardDataModel(req, res);

// get user counts
export const getUserCountsService = (req, res) => getUserCountsModel(req, res);
