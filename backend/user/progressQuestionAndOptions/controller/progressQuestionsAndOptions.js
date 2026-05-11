import {
  getQuestionsWithOptionsModel,
  getUserResponseModel,
  getUserTasksWeekQuestionsModel,
  postUserProgressModel,
} from "../models/progressQuestionsAndOptions.js";

export const getQuestionsWithOptionsController = getQuestionsWithOptionsModel;

export const getUserTasksWeekQuestionsController = getUserTasksWeekQuestionsModel;

export const getUserResponseController = getUserResponseModel;

export const postUserProgressController = postUserProgressModel;
