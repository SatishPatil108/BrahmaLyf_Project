import {
  getAllProgressTasksQuestionsModel,
  getProgressTasksQuestionModel,
  postProgressTasksQuestionModel,
  updateProgressTasksQuestionModel,
  deleteProgressTasksQuestionModel,
} from "../model/question.js";

export const getProgressTasksQuestionController = (req, res) => {
  getProgressTasksQuestionModel(req, res);
};

export const getAllProgressTasksQuestionsController = (req, res) => {
  getAllProgressTasksQuestionsModel(req, res);
};

export const postProgressTasksQuestionController = (req, res) => {
  postProgressTasksQuestionModel(req, res);
};

export const updateProgressTasksQuestionController = (req, res) => {
  updateProgressTasksQuestionModel(req, res);
};

export const deleteProgressTasksQuestionController = (req, res) => {
  deleteProgressTasksQuestionModel(req, res);
};
