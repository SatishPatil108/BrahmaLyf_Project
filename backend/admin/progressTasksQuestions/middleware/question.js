import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";
import {
  error as _error,
  HTTP_BAD_REQUEST,
  APP_RESPONSE_CODE_ERROR,
} from "../../../response/response.js";
import joi from "joi";

export const postProgressTasksQuestionValidator = (req, res, next) => {
  const itemSchema = joi.object({
    question_text: joi.string().min(3).required(),
    option_type: joi.number().integer().valid(1, 2, 3, 4, 5, 6).required(),
    week_no: joi.number().integer().min(1).max(52).required(),
    day_no: joi.number().integer().min(1).max(7).required(),
    options: joi.when("option_type", {
      is: joi.valid(2, 3, 4),
      then: joi.array().items(joi.string()).min(1).required(),
      otherwise: joi.array().items(joi.string()).optional(),
    }),
  });

  const schema = joi.array().items(itemSchema).min(1).required(); // ← wrap in array

  const { error } = schema.validate(req.body);

  if (error) {
    console.error(error);
    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      null,
    );
  }

  next();
};

export const updateProgressTasksQuestionValidator = (req, res, next) => {
  const paramsSchema = joi.object({
    courseId: joi.number().integer().required(),
    questionId: joi.number().integer().required(),
  });

  const bodySchema = joi.object({
    question_text: joi.string().min(3).required(),
    option_type: joi.number().integer().valid(1, 2, 3, 4, 5, 6).required(),
    week_no: joi.number().integer().min(1).max(52).required(),
    day_no: joi.number().integer().min(1).max(7).required(),
    options: joi.when("option_type", {
      is: joi.valid(2, 3, 4),
      then: joi.array().items(joi.string()).min(1).required(),
      otherwise: joi.array().items(joi.string()).optional(),
    }),
  });

  const { error: paramsError } = paramsSchema.validate(req.params, {
    convert: true,
  });

  if (paramsError) {
    console.error("Params error:", paramsError.message);

    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      null,
    );
  }

  const body = Array.isArray(req.body) ? req.body[0] : req.body;

  const { error: bodyError } = bodySchema.validate(body, {
    convert: true,
  });

  if (bodyError) {
    console.error("Body error:", bodyError.message);

    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      null,
    );
  }

  req.body = body;

  next();
};

export const postProgressPracticeMessageValidator = (req, res, next) => {
  const itemSchema = joi.object({
    week_no: joi.number().integer().min(1).max(52).required(),
    themes: joi.string().trim().min(1).required(),
    weekly_target: joi.string().trim().min(1).required(),
    outcomes: joi.string().trim().min(1).required(),
    outcome_order: joi.number().integer().min(1).default(1),
  });

  const schema = joi.array().items(itemSchema).min(1).required(); // ← wrap in array

  const { error } = schema.validate(req.body);

  if (error) {
    console.error(error);
    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      null,
    );
  }

  next();
};

export const updateProgressPracticeMessageValidator = (req, res, next) => {
  const paramsSchema = joi.object({
    courseId: joi.number().integer().required(),
    messageId: joi.number().integer().required(),
  });

  const bodySchema = joi.object({
    week_no: joi.number().integer().min(1).max(52).required(),
    themes: joi.string().trim().min(1).required(),
    weekly_target: joi.string().trim().min(1).required(),
    outcomes: joi.string().trim().min(1).required(),
    outcome_order: joi.number().integer().min(1).default(1),
  });

  const { error: paramsError } = paramsSchema.validate(req.params, {
    convert: true,
    abortEarly: false,
  });

  if (paramsError) {
    console.error("Params Error:", paramsError.details);

    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      null,
    );
  }

  const body = Array.isArray(req.body) ? req.body[0] : req.body;

  const { error: bodyError } = bodySchema.validate(body, {
    convert: true,
  });

  if (bodyError) {
    console.error("Body error:", bodyError.message);

    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      null,
    );
  }

  req.body = body;

  next();
};

// post and update validator for completed messages
export const postCompletedMessageValidator = (req, res, next) => {
  const schema = joi.object({
    week_no: joi.number().integer().min(1).max(52).required(),
    day_no: joi.number().integer().min(1).max(7).required(),
    completed_message: joi.string().trim().min(1).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    console.error(error);
    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      null,
    );
  }

  next();
};

export const updateCompletedMessageValidator = (req, res, next) => {
  const paramsSchema = joi.object({
    courseId: joi.number().integer().required(),
    messageId: joi.number().integer().required(),
  });

  const bodySchema = joi.object({
    week_no: joi.number().integer().min(1).max(52).required(),
    day_no: joi.number().integer().min(1).max(7).required(),
    completed_message: joi.string().trim().min(1).required(),
  });

  const { error: paramsError } = paramsSchema.validate(req.params, {
    convert: true,
    abortEarly: false,
  });

  if (paramsError) {
    console.error("Params Error:", paramsError.details);

    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      null,
    );
  }

  const body = Array.isArray(req.body) ? req.body[0] : req.body;

  const { error: bodyError } = bodySchema.validate(body, {
    convert: true,
  });

  if (bodyError) {
    console.error("Body error:", bodyError.message);

    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      null,
    );
  }

  req.body = body;

  next();
};
