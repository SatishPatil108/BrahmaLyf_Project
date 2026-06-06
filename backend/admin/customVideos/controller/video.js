import {
  deleteCustomVideoModel,
  getAllCustomVideosModel,
  getCustomVideoModel,
  postCustomVideoModel,
  updateCustomVideoModel,
} from "../models/video.js";

export const postCustomVideoController = (req, res) =>
  postCustomVideoModel(req, res);

export const getAllCustomVideosController = (req, res) =>
  getAllCustomVideosModel(req, res);

export const getCustomVideoController = (req, res) =>
  getCustomVideoModel(req, res);

export const updateCustomVideoController = (req, res) =>
  updateCustomVideoModel(req, res);

export const deleteCustomVideoController = (req, res) =>
  deleteCustomVideoModel(req, res);
