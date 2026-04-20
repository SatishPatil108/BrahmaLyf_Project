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
  getQuestionsWithOptionsService,
  getUserResponseService,
  postUserResponseService,
} from "../services/progressQuestionsAndOptions.js";

// fetch questions with options for a given weekNo, dayNo, courseId
export const getQuestionsWithOptionsModel = async (req, res) => {
  try {
    let { courseId, weekNo } = req.query;
    const userId = req.userId;

    courseId = parseInt(courseId, 10);
    weekNo = parseInt(weekNo, 10);

    // Calculate day_no dynamically (Monday=1 ... Sunday=7)
    const jsDay = new Date().getDay();
    const dayNo = jsDay === 0 ? 7 : jsDay;

    const submissionCheck = await checkUserAlreadySubmittedService(
      userId,
      courseId,
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

    const data = await getQuestionsWithOptionsService(courseId, weekNo);

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

export const getUserResponseModel = async (req, res) => {
  try {
    const { courseId } = req.query;
    const userId = req.userId;

    const data = await getUserResponseService(userId, courseId);

    if (!data || data.length === 0) {
      return success(res, 200, APP_RESPONSE_CODE_SUCCESS, "No response found", {
        alreadySubmitted: false,
      });
    }

    return success(
      res,
      200,
      APP_RESPONSE_CODE_SUCCESS,
      "User response fetched successfully",
      {
        alreadySubmitted: true,
        submission: data,
      },
    );
  } catch (err) {
    console.error("getUserResponseModel error:", err);
    return error(res, 500, "Internal server error", null);
  }
};

// submit user responses for a given weekNo, dayNo, courseId
export const postUserProgressModel = async (req, res) => {
  try {
    const { weekNo, dayNo, courseId, answers } = req.body;
    const userId = req.userId;

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
