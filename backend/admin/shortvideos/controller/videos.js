import {
    postShortVideoModel,
    getShortVideosModel,
    getShortVideoModel,
    updateShortVideoModel,
    deleteShortVideoModel
} from "../models/video.js";

export const postShortVideoController = (req, res) => postShortVideoModel(req, res);

export const getShortVideosController = (req, res) => getShortVideosModel(req, res);

export const getShortVideoController = (req, res) => getShortVideoModel(req, res);

export const updateShortVideoController = (req, res) => updateShortVideoModel(req, res);

export const deleteShortVideoController = (req, res) => deleteShortVideoModel(req, res);