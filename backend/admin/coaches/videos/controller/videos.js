import {
	getAllVideosModel,
	getVideoByIdModel,
	getAllCourseVideosModel
} from "../models/videos.js";

export const getAllVideosController = (req, res) =>  getAllVideosModel(req, res);

export const getVideoByIdController = (req, res) =>  getVideoByIdModel(req, res);

export const getAllCourseVideosController = (req, res) =>  getAllCourseVideosModel(req, res);