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
  QUESTION_UPDATED_FAILED,
  QUESTION_DELETED_SUCCESS,
  QUESTION_FOUND,
  QUESTION_NOT_FOUND,
  QUESTION_UPDATED_SUCCESS,
  SOMETHING_WENT_WRONG,
  NO_RECORD_FOUND,
  MESSAGE_FOUND,
  MESSAGE_NOT_FOUND,
  PRACTICE_MESSAGE_ADDED_FAILED,
  PRACTICE_MESSAGE_ADDED_SUCCESS,
  PRACTICE_MESSAGE_NOT_FOUND,
  PRACTICE_MESSAGE_UPDATED_FAILED,
  PRACTICE_MESSAGE_UPDATED_SUCCESS,
  PRACTICE_MESSAGE_DELETED_FAILED,
  PRACTICE_MESSAGE_DELETED_SUCCESS,
  ALL_MESSAGE_LIST,
  COMPLETED_MESSAGE_NOT_FOUND,
  COMPLETED_MESSAGE_ADDED_FAILED,
  COMPLETED_MESSAGE_ADDED_SUCCESS,
  COMPLETED_MESSAGE_UPDATED_FAILED,
  COMPLETED_MESSAGE_UPDATED_SUCCESS,
  COMPLETED_MESSAGE_DELETED_FAILED,
  COMPLETED_MESSAGE_DELETED_SUCCESS,
  INVALID_MESSAGE_ID,
} from "../messages/question.js";

import {
  deleteCompletedMessageService,
  deleteProgressPracticeMessageService,
  deleteProgressTasksQuestionService,

  getAllCompletedMessagesService,
  getAllProgressPracticeMessagesService,
  getAllProgressTasksQuestionsService,

  getCompletedMessageService,
  getProgressPracticeMessageService,
  getProgressTasksQuestionService,

  postCompletedMessageService,
  postProgressPracticeMessageService,
  postProgressTasksQuestionService,

  updateCompletedMessageService,
  updateProgressPracticeMessageService,
  updateProgressTasksQuestionService,
} from "../services/question.js";

export const getAllProgressTasksQuestionsModel = async (req, res) => {
  try {
    const courseId = Number(req.query.courseId);
    const weekNo = Number(req.query.weekNo);
    const dayNo = Number(req.query.dayNo);

    const response = await getAllProgressTasksQuestionsService(
      courseId,
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

export const postProgressTasksQuestionModel = async (req, res) => {
  try {
    const questions = req.body;
    const { courseId } = req.params;

    const results = await Promise.all(
      questions.map(
        ({ question_text, option_type, week_no, day_no, options }) =>
          postProgressTasksQuestionService(
            question_text,
            option_type,
            week_no,
            day_no,
            Number(courseId),
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

export const updateProgressTasksQuestionModel = async (req, res) => {
  try {
    const { courseId, questionId } = req.params;

    const { question_text, option_type, week_no, day_no, options } = req.body;

    // ----------------------------------------------
    // Check if question exists
    // ----------------------------------------------
    const existingQuestion = await getProgressTasksQuestionService(questionId);

    if (!existingQuestion) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_NOT_FOUND,
        null,
      );
    }

    const result = await updateProgressTasksQuestionService(
      Number(questionId),
      question_text,
      option_type,
      week_no,
      day_no,
      Number(courseId),
      options || [],
    );

    if (!result) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        QUESTION_UPDATED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      QUESTION_UPDATED_SUCCESS,
      result,
    );
  } catch (err) {
    console.error("Update Progress Question Error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const deleteProgressTasksQuestionModel = async (req, res) => {
  try {
    const { question_id } = req.params;

    // ----------------------------------------------
    // Check if question exists
    // ----------------------------------------------
    const existingQuestion = await getProgressTasksQuestionService(question_id);

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
    const response = await deleteProgressTasksQuestionService(question_id);

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

// practice messages models

export const getAllProgressPracticeMessagesModel = async (req, res) => {
  try {
    const courseId = Number(req.query.courseId);
    const weekNo = Number(req.query.weekNo);

    const response = await getAllProgressPracticeMessagesService(
      courseId,
      weekNo,
    );

    if (!response) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        MESSAGE_NOT_FOUND,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      ALL_MESSAGE_LIST,
      response,
    );
  } catch (err) {
    console.error("Get Progress Practice Message Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const postProgressPracticeMessageModel = async (req, res) => {
  try {
    const practiceMessages = req.body;
    const { courseId } = req.params;

    const results = await Promise.all(
      practiceMessages.map(
        ({ week_no, themes, weekly_target, outcomes, outcome_order = 1 }) =>
          postProgressPracticeMessageService(
            week_no,
            Number(courseId),
            themes,
            weekly_target,
            outcomes,
            outcome_order,
          ),
      ),
    );

    if (!results || results.length === 0) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        PRACTICE_MESSAGE_ADDED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      PRACTICE_MESSAGE_ADDED_SUCCESS,
      results,
    );
  } catch (err) {
    console.error("Practice Message Error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const updateProgressPracticeMessageModel = async (req, res) => {
  try {
    const { courseId, messageId } = req.params;

    const {
      week_no,
      themes,
      weekly_target,
      outcomes,
      outcome_order = 1,
    } = req.body;

    // Check if practice message exists
    const existingPracticeMessage = await getProgressPracticeMessageService(
      Number(courseId),
      Number(messageId),
    );

    if (!existingPracticeMessage) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        PRACTICE_MESSAGE_NOT_FOUND,
        null,
      );
    }

    const result = await updateProgressPracticeMessageService(
      existingPracticeMessage.id,
      week_no,
      Number(courseId),
      themes,
      weekly_target,
      outcomes,
      outcome_order,
    );

    if (!result) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        PRACTICE_MESSAGE_UPDATED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      PRACTICE_MESSAGE_UPDATED_SUCCESS,
      result,
    );
  } catch (err) {
    console.error("Update Practice Message Error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const deleteProgressPracticeMessageModel = async (req, res) => {
  try {
    const { messageId } = req.params;

    // ----------------------------------------------
    // Check if practice message exists
    // ----------------------------------------------
    const existingPracticeMessage = await getProgressPracticeMessageService(
      Number(messageId),
    );

    if (!existingPracticeMessage) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        PRACTICE_MESSAGE_NOT_FOUND,
        null,
      );
    }

    // ----------------------------------------------
    // Soft delete DB record
    // ----------------------------------------------
    const response = await deleteProgressPracticeMessageService(
      Number(messageId),
    );

    if (!response) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        PRACTICE_MESSAGE_DELETED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      PRACTICE_MESSAGE_DELETED_SUCCESS,
      response,
    );
  } catch (err) {
    console.error("Progress Practice Message Delete Error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

// models for completed message
export const postCompletedMessageModel = async (req, res) => {
  try {
    const { week_no, day_no, completed_message } = req.body;
    const { courseId } = req.params;

    const results = await postCompletedMessageService(
      Number(courseId),
      week_no,
      day_no,
      completed_message,
    );

    if (!results) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        COMPLETED_MESSAGE_ADDED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      COMPLETED_MESSAGE_ADDED_SUCCESS,
      results,
    );
  } catch (err) {
    console.error("Completed Message Error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const getAllCompletedMessagesModel = async (req, res) => {
  try {
    const courseId = Number(req.query.courseId);
    const weekNo = Number(req.query.weekNo);
    const dayNo = Number(req.query.dayNo);

    const response = await getAllCompletedMessagesService(
      courseId,
      weekNo,
      dayNo,
    );

    if (!response) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        MESSAGE_NOT_FOUND,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      ALL_MESSAGE_LIST,
      response,
    );
  } catch (err) {
    console.error("Get Completed Message Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const updateCompletedMessageModel = async (req, res) => {
  try {
    const { courseId, messageId } = req.params;

    const { week_no, day_no, completed_message } = req.body;

    // Check if completed message exists
    const existingCompletedMessage = await getCompletedMessageService(
      Number(courseId),
      Number(messageId),
    );

    if (!existingCompletedMessage) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        COMPLETED_MESSAGE_NOT_FOUND,
        null,
      );
    }

    const result = await updateCompletedMessageService(
      existingCompletedMessage.id,
      Number(courseId),
      week_no,
      day_no,
      completed_message,
    );

    if (!result) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        COMPLETED_MESSAGE_UPDATED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      COMPLETED_MESSAGE_UPDATED_SUCCESS,
      result,
    );
  } catch (err) {
    console.error("Update Completed Message Error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const deleteCompletedMessageModel = async (req, res) => {
  try {
    const { messageId } = req.params;

    // ----------------------------------------------
    // Check if completed message exists
    // ----------------------------------------------
    const existingCompletedMessage = await getCompletedMessageService(
      Number(messageId),
    );

    if (!existingCompletedMessage) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        COMPLETED_MESSAGE_NOT_FOUND,
        null,
      );
    }

    // ----------------------------------------------
    // Soft delete DB record
    // ----------------------------------------------
    const response = await deleteCompletedMessageService(Number(messageId));

    if (!response) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        COMPLETED_MESSAGE_DELETED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      COMPLETED_MESSAGE_DELETED_SUCCESS,
      response,
    );
  } catch (err) {
    console.error("Progress Completed Message Delete Error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};
