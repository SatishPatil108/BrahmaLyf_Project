import joi from "joi";
import {
  error as _error,
  HTTP_BAD_REQUEST,
  APP_RESPONSE_CODE_ERROR
} from "../../../response/response.js";
import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";

export const postReplyValidator = (req, res, next) => {
  const schema = joi.object({
    query_id: joi.number().integer().min(1).required(),
    reply_subject: joi.string().min(2).max(255).required(),
    reply_message: joi.string().min(2).max(2000).required()
  }).unknown(false);

  const { error } = schema.validate(
    { ...req.params, ...req.body },
    { abortEarly: false }
  );

  if (error) {
    console.error("Post Reply Validation Error:", error.details);
    return _error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      INVALID_REQUEST_PARAMETER,
      error.details // Or error.details[0].message if you prefer
    );
  }

  next();
};
