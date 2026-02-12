import { 
	getAllVideosModel,
	getVideosBySubdomainIdModel,
	getVideoByIdModel,
	getMyCourseVideosModel,
	getModuleModel
} from "../models/videos.js";

export const getAllVideosController = getAllVideosModel;

export const getVideosBySubdomainIdController = getVideosBySubdomainIdModel;

export const getVideoByIdController = getVideoByIdModel;

export const getMyCourseVideosController = getMyCourseVideosModel;
export const getModuleController = getModuleModel;