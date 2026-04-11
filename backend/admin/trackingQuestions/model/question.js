import {
  error,
  success,
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_OK,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
  APP_RESPONSE_CODE_ERROR,
  APP_RESPONSE_CODE_SUCCESS,
} from "../../../response/response.js";

import {
  ALL_QUESTION_LIST,
  INVALID_QUESTION_ID,
  QUESTION_ADDED_FAILED,
  QUESTION_ADDED_SUCCESS,
  QUESTION_DELETED_SUCCESS,
  QUESTION_FOUND,
  QUESTION_NOT_FOUND,
  QUESTION_UPDATED_SUCCESS,
  SOMETHING_WENT_WRONG,
  NO_RECORD_FOUND,
} from "../messages/question.js";

import {
  deleteProgressTrackingQuestionService,
  getAllProgressTrackingQuestionsService,
  getProgressTrackingQuestionService,
  postProgressTrackingQuestionService,
  updateProgressTrackingQuestionService,
} from "../services/question.js";

export const getProgressTrackingQuestionModel = async (req, res) => {
  try {
    const question_id = parseInt(req.params.question_id);
    if (isNaN(question_id)) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_QUESTION_ID,
        null,
      );
    }
    const question = await getProgressTrackingQuestionService(question_id);
    if (!question) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_NOT_FOUND,
        null,
      );
    }
    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      QUESTION_FOUND,
      question,
    );
  } catch (err) {
    console.error("Get Progress Tracking Question Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const getAllProgressTrackingQuestionsModel = async (req, res) => {
  try {
    const weekNo = Number(req.query.weekNo);
    const dayNo = Number(req.query.dayNo);

    const response = await getAllProgressTrackingQuestionsService(
      weekNo,
      dayNo,
    );
    if (response === -1) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        NO_RECORD_FOUND,
        null,
      );
    }
    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      ALL_QUESTION_LIST,
      response,
    );
  } catch (err) {
    console.error("Get All Progress Tracking Questions Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const postProgressTrackingQuestionModel = async (req, res) => {
  try {
    const questions = req.body;

    const results = await Promise.all(
      questions.map(
        ({ question_text, option_type, week_no, day_no, course_id, options }) =>
          postProgressTrackingQuestionService(
            question_text,
            option_type,
            week_no,
            day_no,
            course_id,
            options || [],
          ),
      ),
    );

    if (!results || results.length === 0) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_ADDED_FAILED,
        null,
      );
    }

    if (!results || results.length === 0) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_ADDED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      QUESTION_ADDED_SUCCESS,
      results,
    );
  } catch (err) {
    console.error("Progress Tracking Question Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const updateProgressTrackingQuestionModel = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { question_text, option_type, week_no, day_no, course_id, options } = req.body;

    // ----------------------------------------------
    // Check if question exists
    // ----------------------------------------------
    const existingQuestion =
      await getProgressTrackingQuestionService(question_id);

    if (!existingQuestion) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_NOT_FOUND,
        null,
      );
    }

    // ----------------------------------------------
    // Update DB record
    // ----------------------------------------------
    const response = await updateProgressTrackingQuestionService(
      question_id,
      question_text,
      option_type,
      week_no,
      day_no,
      course_id,
      options || [],
    );

    if (!response) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        SOMETHING_WENT_WRONG,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      QUESTION_UPDATED_SUCCESS,
      response,
    );
  } catch (err) {
    console.error("Progress Tracking Update Question Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const deleteProgressTrackingQuestionModel = async (req, res) => {
  try {
    const { question_id } = req.params;

    // ----------------------------------------------
    // Check if question exists
    // ----------------------------------------------
    const existingQuestion =
      await getProgressTrackingQuestionService(question_id);

    if (!existingQuestion) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_NOT_FOUND,
        null,
      );
    }

    // ----------------------------------------------
    // Soft delete DB record
    // ----------------------------------------------
    const response = await deleteProgressTrackingQuestionService(question_id);

    if (!response) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        SOMETHING_WENT_WRONG,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      QUESTION_DELETED_SUCCESS,
      response,
    );
  } catch (err) {
    console.error("Progress Tracking Delete Question Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};
