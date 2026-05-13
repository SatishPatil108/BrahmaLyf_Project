import {
  getAllProgressTasksQuestionsModel,
  getProgressTasksQuestionModel,
  postProgressTasksQuestionModel,
  updateProgressTasksQuestionModel,
  deleteProgressTasksQuestionModel,
  getProgressPracticeMessageModel,
  getAllProgressPracticeMessagesModel,
  postProgressPracticeMessageModel,
  updateProgressPracticeMessageModel,
  deleteProgressPracticeMessageModel,
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

// practice messages controllers
export const getProgressPracticeMessageController = (req, res) => {
  getProgressPracticeMessageModel(req, res);
};

export const getAllProgressPracticeMessagesController = (req, res) => {
  getAllProgressPracticeMessagesModel(req, res);
};

export const postProgressPracticeMessageController = (req, res) => {
  postProgressPracticeMessageModel(req, res);
};

export const updateProgressPracticeMessageController = (req, res) => {
  updateProgressPracticeMessageModel(req, res);
};

export const deleteProgressPracticeMessageController = (req, res) => {
  deleteProgressPracticeMessageModel(req, res);
};
