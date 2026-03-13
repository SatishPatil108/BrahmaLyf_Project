 import {
  getAllProgressToolsQuestionsModel,
  getProgressToolsQuestionModel,
  postProgressToolsQuestionModel,
  updateProgressToolsQuestionModel,
  deleteProgressToolsQuestionModel,
} from "../model/tools.js";

// Get single tool question
export const getProgressToolsQuestionController = (req, res) => {
  getProgressToolsQuestionModel(req, res);
};

// Get all tool questions
export const getAllProgressToolsQuestionsController = (req, res) => {
  getAllProgressToolsQuestionsModel(req, res);
};

// Create tool question
export const postProgressToolsQuestionController = (req, res) => {
  postProgressToolsQuestionModel(req, res);
};

// Update tool question
export const updateProgressToolsQuestionController = (req, res) => {
  updateProgressToolsQuestionModel(req, res);
};

// Delete tool question
export const deleteProgressToolsQuestionController = (req, res) => {
  deleteProgressToolsQuestionModel(req, res);
};