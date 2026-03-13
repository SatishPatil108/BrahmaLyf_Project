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
} from "../messages/tools.js";

import {
  deleteProgressToolsQuestionService,
  getAllProgressToolsQuestionsService,
  getProgressToolsQuestionService,
  postProgressToolsQuestionService,
  updateProgressToolsQuestionService,
} from "../services/tools.js";

// ✅ Get single tool question
export const getProgressToolsQuestionModel = async (req, res) => {
  try {
    const tools_question_id = parseInt(req.params.tools_question_id);

    if (isNaN(tools_question_id)) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_QUESTION_ID,
        null
      );
    }

    const question = await getProgressToolsQuestionService(tools_question_id);

    if (!question) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_NOT_FOUND,
        null
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      QUESTION_FOUND,
      question
    );
  } catch (err) {
    console.error("Get Tools Question Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null
    );
  }
};

// ✅ Get all tool questions
export const getAllProgressToolsQuestionsModel = async (req, res) => {
  try {
    const weekNo = Number(req.query.weekNo);
    const dayNo = Number(req.query.dayNo);

    const response = await getAllProgressToolsQuestionsService(
      weekNo,
      dayNo
    );

    if (response === -1) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        NO_RECORD_FOUND,
        null
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      ALL_QUESTION_LIST,
      response
    );
  } catch (err) {
    console.error("Get All Tools Questions Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null
    );
  }
};

// ✅ Create tool questions (bulk)
export const postProgressToolsQuestionModel = async (req, res) => {
  try {
    const questions = req.body;

    const results = await Promise.all(
      questions.map(({ tools_question, week_no, day_no, course_id }) =>
        postProgressToolsQuestionService(
          tools_question,
          week_no,
          day_no,
          course_id
        )
      )
    );

    if (!results || results.length === 0) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_ADDED_FAILED,
        null
      );
    }

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      QUESTION_ADDED_SUCCESS,
      results
    );
  } catch (err) {
    console.error("Tools Question Create Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null
    );
  }
};

// ✅ Update tool question
export const updateProgressToolsQuestionModel = async (req, res) => {
  try {
    const { tools_question_id } = req.params;
    const { tools_question, week_no, day_no, course_id } = req.body;

    const existingQuestion =
      await getProgressToolsQuestionService(tools_question_id);

    if (!existingQuestion) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_NOT_FOUND,
        null
      );
    }

    const response = await updateProgressToolsQuestionService(
      tools_question_id,
      tools_question,
      week_no,
      day_no,
      course_id
    );

    if (!response) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        SOMETHING_WENT_WRONG,
        null
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      QUESTION_UPDATED_SUCCESS,
      response
    );
  } catch (err) {
    console.error("Tools Question Update Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null
    );
  }
};

// ✅ Delete tool question
export const deleteProgressToolsQuestionModel = async (req, res) => {
  try {
    const { tools_question_id } = req.params;

    const existingQuestion =
      await getProgressToolsQuestionService(tools_question_id);

    if (!existingQuestion) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_NOT_FOUND,
        null
      );
    }

    const response =
      await deleteProgressToolsQuestionService(tools_question_id);

    if (!response) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        SOMETHING_WENT_WRONG,
        null
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      QUESTION_DELETED_SUCCESS,
      response
    );
  } catch (err) {
    console.error("Tools Question Delete Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null
    );
  }
};