import {
  error,
  success,
  HTTP_OK,
  APP_RESPONSE_CODE_ERROR,
  APP_RESPONSE_CODE_SUCCESS,
  HTTP_CREATED,
} from "../../../response/response.js";

import {
  NO_RECORD_FOUND,
  TOOLS_FETCH_FAILED,
  TOOLS_FETCH_SUCCESS,
  TOOLS_QUESTIONS_AND_OPTIONS_FETCHED_SUCCESS,
  TOOLS_SUBMIT_FAILED,
  TOOLS_SUBMIT_SUCCESS,
  TOOLS_UPDATE_FAILED,
  TOOLS_UPDATE_SUCCESS,
} from "../messages/progressToolsQuestions.js";

import {
  checkUserAlreadySubmittedToolsService,
  getToolsQuestionsService,
  getUserToolsResponseService,
  postUserToolsResponseService,
  updateUserToolsResponseService,
} from "../services/progressToolsQuestions.js";

// Fetch tools questions with options for a given weekNo, courseId
export const getProgressToolsQuestionsModel = async (req, res) => {
  try {
    let { courseId } = req.query;
    const userId = req.userId;

    courseId = parseInt(courseId, 10);

    if (isNaN(courseId)) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        "Invalid courseId",
        null,
      );
    }

    const jsDay = new Date().getDay();
    const dayNo = jsDay === 0 ? 7 : jsDay;

    const toolsData = await getToolsQuestionsService(courseId);

    if (toolsData === -1) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        NO_RECORD_FOUND,
        null,
      );
    }

    const submissionCheck = await checkUserAlreadySubmittedToolsService(
      userId,
      courseId,
      toolsData.week_no,
      dayNo,
    );

    if (submissionCheck.alreadySubmitted) {
      return success(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_SUCCESS,
        "You have already completed today's tools questions ✅",
        { alreadySubmitted: true, submission: submissionCheck.data },
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      TOOLS_QUESTIONS_AND_OPTIONS_FETCHED_SUCCESS,
      { alreadySubmitted: false, ...toolsData },
    );
  } catch (err) {
    console.error("getProgressToolsQuestionsModel error:", err);
    return error(
      res,
      500,
      APP_RESPONSE_CODE_ERROR,
      "Internal server error",
      null,
    );
  }
};

// Get user's previously submitted tools responses
export const getProgressToolsUserResponseModel = async (req, res) => {
  try {
    let { courseId } = req.query;
    const userId = req.userId;

    courseId = parseInt(courseId, 10);

    if (isNaN(courseId)) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        "Invalid courseId",
        null,
      );
    }

    const data = await getUserToolsResponseService(userId, courseId);

    if (!data || data.length === 0) {
      return success(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_SUCCESS,
        "No tools response found",
        { alreadySubmitted: false },
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      "User tools response fetched successfully",
      {
        alreadySubmitted: true,
        submission: data,
      },
    );
  } catch (err) {
    console.error("getProgressToolsUserResponseModel error:", err);
    return error(
      res,
      500,
      APP_RESPONSE_CODE_ERROR,
      "Internal server error",
      null,
    );
  }
};

// Submit user responses for tools questions
export const postProgressToolsUserResponseModel = async (req, res) => {
  try {
    const { weekNo, dayNo, courseId, answers } = req.body;
    const userId = req.userId;

    if (!userId) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        "User ID is required",
        null,
      );
    }

    if (!courseId || !weekNo || !dayNo || !answers || !Array.isArray(answers)) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        "courseId, weekNo, dayNo and answers are required",
        null,
      );
    }

    if (answers.length === 0) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        "Answers array cannot be empty",
        null,
      );
    }

    const result = await postUserToolsResponseService(
      userId,
      courseId,
      dayNo,
      weekNo,
      answers,
    );

    if (result === -1) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        TOOLS_SUBMIT_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      TOOLS_SUBMIT_SUCCESS,
      result,
    );
  } catch (err) {
    console.error("postProgressToolsUserResponseModel error:", err);
    return error(
      res,
      500,
      APP_RESPONSE_CODE_ERROR,
      "Internal server error",
      null,
    );
  }
};

export const updateProgressToolsUserResponseModel = async (req, res) => {
  try {
    const { textAnswer, courseId, weekNo, dayNo } = req.body;
    const { questionId } = req.params;

    const userId = req.userId;

    if (!userId) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        "User ID is required",
        null,
      );
    }

    if (
      !questionId ||
      textAnswer === undefined ||
      String(textAnswer).trim() === ""
    ) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        "questionId and answers are required",
        null,
      );
    }

    const result = await updateUserToolsResponseService(
      userId,
      courseId,
      weekNo,
      dayNo,
      Number(questionId),
      textAnswer.trim(),
    );

    if (result === -1) {
      return error(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_ERROR,
        TOOLS_UPDATE_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      TOOLS_UPDATE_SUCCESS,
      result,
    );
  } catch (err) {
    console.error("updateProgressToolsUserResponseModel error:", err);

    return error(
      res,
      500,
      APP_RESPONSE_CODE_ERROR,
      "Internal server error",
      null,
    );
  }
};
