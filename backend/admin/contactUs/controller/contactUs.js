import {
    postReplyModel,
    deleteQueryModel,
    getQueryModel,
    getQueriesModel,
} from "../models/contactUs.js";

export const postReplyController = (req, res) => postReplyModel(req, res);
export const deleteQueryController = (req, res) => deleteQueryModel(req, res);
export const getQueryController = (req, res) => getQueryModel(req, res);
export const getQueriesController = (req, res) => getQueriesModel(req, res);