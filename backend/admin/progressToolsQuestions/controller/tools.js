import {
  getAllProgressToolsQuestionsModel,
  postProgressToolsQuestionModel,
  updateProgressToolsQuestionModel,
  deleteProgressToolsQuestionModel,
} from "../model/tools.js";

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
