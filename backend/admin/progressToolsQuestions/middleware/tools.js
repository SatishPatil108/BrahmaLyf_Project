import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";
import {
  error as _error,
  HTTP_BAD_REQUEST,
  APP_RESPONSE_CODE_ERROR,
} from "../../../response/response.js";
import joi from "joi";

export const postProgressToolsQuestionValidator = (req, res, next) => {
  const itemSchema = joi.object({
    tools_question: joi.string().min(3).required(),
    week_no: joi.number().integer().min(1).max(52).required(),
    day_no: joi.number().integer().min(1).max(7).required(),
    course_id: joi.number().integer().positive().required(),
  });

  // If you're sending array of tools
  const schema = joi.array().items(itemSchema).min(1).required();

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

export const updateProgressToolsQuestionValidator = (req, res, next) => {
  const paramsSchema = joi.object({
    tools_question_id: joi.number().integer().positive().required(),
  });

  const bodySchema = joi.object({
    tools_question: joi.string().min(3).required(),
    week_no: joi.number().integer().min(1).max(52).required(),
    day_no: joi.number().integer().min(1).max(7).required(),
    course_id: joi.number().integer().positive().required(),
  });

  // Validate params
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

  // Handle array body case
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
