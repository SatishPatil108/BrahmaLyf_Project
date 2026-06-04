import {
  getProgressToolsQuestionsModel,
  getProgressToolsUserResponseModel,
  getShowToolsQuestionModel,
  getUserToolsWeekQuestionsModel,
  postProgressToolsUserResponseModel,
  updateProgressToolsUserResponseModel,
} from "../models/progressToolsQuestions.js";

export const getProgressToolsQuestionsController =
  getProgressToolsQuestionsModel;

export const getUserToolsWeekQuestionsController =
  getUserToolsWeekQuestionsModel;

export const getProgressToolsUserResponseController =
  getProgressToolsUserResponseModel;

export const postProgressToolsUserResponseController =
  postProgressToolsUserResponseModel;

export const updateProgressToolsUserResponseController =
  updateProgressToolsUserResponseModel;

export const getShowToolsQuestionController = getShowToolsQuestionModel;
