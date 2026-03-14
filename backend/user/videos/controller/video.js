import {
    getShortVideosModel,
    getShortVideoModel
} from "../models/video.js"

export const getShortVideosController = (req, res) => getShortVideosModel(req, res);

export const getShortVideoController = (req, res) => getShortVideoModel(req, res);

