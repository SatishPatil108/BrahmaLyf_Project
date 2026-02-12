import {
	postFaqModel,
	getFaqModel,
	updateFaqModel,
	deleteFaqModel
} from "../models/faq.js";

export const postFaqController = (req, res) => postFaqModel(req, res);

export const getFaqController = (req, res) => getFaqModel(req, res);

export const updateFaqController = (req, res) => updateFaqModel(req, res);

export const deleteFaqController = (req, res) => deleteFaqModel(req, res);
