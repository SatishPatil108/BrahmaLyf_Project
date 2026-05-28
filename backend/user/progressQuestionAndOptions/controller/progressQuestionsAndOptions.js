import {
  getQuestionsWithOptionsModel,
  getUserCompletedMessageModel,
  getUserProgressThemeModel,
  getUserResponseModel,
  getUserTasksWeekQuestionsModel,
  postUserProgressModel,
} from "../models/progressQuestionsAndOptions.js";

export const getQuestionsWithOptionsController = getQuestionsWithOptionsModel;

export const getUserTasksWeekQuestionsController =
  getUserTasksWeekQuestionsModel;

export const getUserResponseController = getUserResponseModel;

export const postUserProgressController = postUserProgressModel;

export const getUserCompletedMessageController = getUserCompletedMessageModel;

export const getUserProgressThemeController = getUserProgressThemeModel;
