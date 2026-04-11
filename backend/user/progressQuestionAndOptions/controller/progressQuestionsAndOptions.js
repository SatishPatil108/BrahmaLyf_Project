import {
  getNextUserProgressModel,
  getQuestionsWithOptionsModel,
  postUserProgressModel,
} from "../models/progressQuestionsAndOptions.js";

export const getQuestionsWithOptionsController = getQuestionsWithOptionsModel;

export const getNextUserProgressController = getNextUserProgressModel;

export const postUserProgressController = postUserProgressModel;
