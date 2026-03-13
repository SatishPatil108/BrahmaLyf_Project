import {
    getAllProgressTrackingOptionsModel,
    getProgressTrackingOptionModel,
    postProgressTrackingOptionModel,
    updateProgressTrackingOptionModel,
    deleteProgressTrackingOptionModel
} from "../model/option.js";


export const getProgressTrackingOptionController = (req, res) => { getProgressTrackingOptionModel(req, res) };

export const getAllProgressTrackingOptionsController = (req, res) => { getAllProgressTrackingOptionsModel(req, res) };

export const postProgressTrackingOptionController = (req, res) => { postProgressTrackingOptionModel(req, res) };

export const updateProgressTrackingOptionController = (req, res) => { updateProgressTrackingOptionModel(req, res) };

export const deleteProgressTrackingOptionController = (req, res) => { deleteProgressTrackingOptionModel(req, res) };    