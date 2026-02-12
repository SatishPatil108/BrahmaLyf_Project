import {
	postCoachModel,
	getCoachModel,
	getCoachByIdModel,
	updateCoachModel,
	deleteCoachModel,
	getAllCoachesModel
} from "../model/coaches.js";

// post coach
export const postCoachesController = (req, res) => postCoachModel(req, res);

// get coaches paginated
export const getCoachesController = (req, res) => getCoachModel(req, res);

// get coach by id
export const getCoachByIdController = (req, res) => getCoachByIdModel(req, res);

// update coach
export const updateCoachesController = (req, res) => updateCoachModel(req, res);

// delete coach
export const deleteCoachesController = (req, res) => deleteCoachModel(req, res);

// get all coaches
export const getAllCoachesController = (req, res) => getAllCoachesModel(req, res);