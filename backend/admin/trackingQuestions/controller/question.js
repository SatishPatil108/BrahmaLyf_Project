import {
    getAllProgressTrackingQuestionsModel,
    getProgressTrackingQuestionModel,
    postProgressTrackingQuestionModel,
    updateProgressTrackingQuestionModel,
    deleteProgressTrackingQuestionModel
} from "../model/question.js";


export const getProgressTrackingQuestionController = (req, res) => { getProgressTrackingQuestionModel(req, res) };

export const getAllProgressTrackingQuestionsController = (req, res) => { getAllProgressTrackingQuestionsModel(req, res) };

export const postProgressTrackingQuestionController = (req, res) => { postProgressTrackingQuestionModel(req, res) };

export const updateProgressTrackingQuestionController = (req, res) => { updateProgressTrackingQuestionModel(req, res) };

export const deleteProgressTrackingQuestionController = (req, res) => { deleteProgressTrackingQuestionModel(req, res) };