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
  PROGRESS_FETCH_FAILED,
  PROGRESS_FETCH_SUCCESS,
  PROGRESS_QUESTIONS_AND_OPTIONS_FETCHED_SUCCESS,
  PROGRESS_SUBMIT_FAILED,
  PROGRESS_SUBMIT_SUCCESS,
} from "../messages/progressQuestionsAndOptions.js";

import {
  checkUserAlreadySubmittedService,
  getNextUserProgressService,
  getQuestionsWithOptionsService,
  postUserResponseService,
} from "../services/progressQuestionsAndOptions.js";

// fetch questions with options for a given weekNo, dayNo, courseId
export const getQuestionsWithOptionsModel = async (req, res) => {
  try {
    let { weekNo, dayNo, courseId } = req.query;
    const userId = req.userId;

    weekNo = parseInt(weekNo, 10);
    dayNo = parseInt(dayNo, 10);
    courseId = parseInt(courseId, 10);

    const submissionCheck = await checkUserAlreadySubmittedService(
      userId,
      courseId,
      weekNo,
      dayNo,
    );

    if (submissionCheck.alreadySubmitted) {
      return success(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_SUCCESS,
        "You have already completed today's progress ✅",
        {
          alreadySubmitted: true,
          submission: submissionCheck.data,
        },
      );
    }

    const data = await getQuestionsWithOptionsService(weekNo, dayNo, courseId);

    if (data === -1) {
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
      PROGRESS_QUESTIONS_AND_OPTIONS_FETCHED_SUCCESS,
      {
        alreadySubmitted: false,
        ...data,
      },
    );
  } catch (err) {
    console.error("getQuestionsWithOptionsController error:", err);
    return error(
      res,
      500,
      APP_RESPONSE_CODE_ERROR,
      "Internal server error",
      null,
    );
  }
};
// fetch questions with options for a given weekNo, dayNo, courseId
export const getNextUserProgressModel = async (req, res) => {
  const { courseId, weekNo, dayNo } = req.query;
  const userId = req.userId; // ✅ from token

  if (!userId || !courseId || weekNo === undefined || dayNo === undefined) {
    return error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      "Missing required fields",
      null,
    );
  }

  const result = await getNextUserProgressService(
    userId,
    parseInt(courseId),
    parseInt(weekNo),
    parseInt(dayNo),
  );

  if (result === -1) {
    return error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      PROGRESS_FETCH_FAILED,
      null,
    );
  }

  return success(
    res,
    HTTP_OK,
    APP_RESPONSE_CODE_SUCCESS,
    PROGRESS_FETCH_SUCCESS,
    result,
  );
};

// submit user responses for a given weekNo, dayNo, courseId
export const postUserProgressModel = async (req, res) => {
  try {
    const { weekNo, dayNo, courseId, answers } = req.body;
    const userId = req.userId;

    console.log(req.body);

    if (!userId) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        "User ID is required",
        null,
      );
    }

    const result = await postUserResponseService(
      userId,
      courseId,
      dayNo,
      weekNo,
      answers,
    );

    if (result === -1) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        PROGRESS_SUBMIT_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      PROGRESS_SUBMIT_SUCCESS,
      result,
    );
  } catch (catchError) {
    console.error("PostUserProgressModel error:", catchError);
    return error(
      res,
      500,
      APP_RESPONSE_CODE_ERROR,
      "Internal server error",
      null,
    );
  }
};
