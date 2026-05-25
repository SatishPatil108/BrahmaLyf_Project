import {
  postProgressTasksQuestionModel,
  postProgressPracticeMessageModel,
  postCompletedMessageModel,
  getAllProgressTasksQuestionsModel,
  getAllProgressPracticeMessagesModel,
  getAllCompletedMessagesModel,
  updateProgressTasksQuestionModel,
  updateProgressPracticeMessageModel,
  updateCompletedMessageModel,
  deleteProgressTasksQuestionModel,
  deleteProgressPracticeMessageModel,
  deleteCompletedMessageModel,
} from "../model/question.js";

// progress tasks questions controllers
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

// practice weekly messages controllers

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

//  completed messages
export const postCompletedMessageController = (req, res) => {
  postCompletedMessageModel(req, res);
};

export const getAllCompletedMessagesController = (req, res) => {
  getAllCompletedMessagesModel(req, res);
};

export const updateCompletedMessageController = (req, res) => {
  updateCompletedMessageModel(req, res);
};

export const deleteCompletedMessageController = (req, res) => {
  deleteCompletedMessageModel(req, res);
};
