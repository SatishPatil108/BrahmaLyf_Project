const sendResponse = (
  res,
  httpCode,
  appCode,
  message = "",
  data = null,
  success = false
) => {
  return res.status(httpCode).json({
    success,
    response_code: appCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const success = (res, httpCode, appCode, message, data) =>
  sendResponse(res, httpCode, appCode, message, data, true);

export const error = (res, httpCode, appCode, message, data) =>
  sendResponse(res, httpCode, appCode, message, data, false);

// Response Codes
export const APP_RESPONSE_CODE_SUCCESS = 1;
export const APP_RESPONSE_CODE_ERROR = 0;

// HTTP Status Codes
export const HTTP_OK = 200;
export const HTTP_CREATED = 201;
export const HTTP_BAD_REQUEST = 400;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_FORBIDDEN = 403;
export const HTTP_NOT_FOUND = 404;
export const HTTP_METHOD_NOT_ALLOWED = 405;
export const HTTP_NOT_ACCEPTABLE = 406;
export const HTTP_CONFLICT = 409;
export const HTTP_INTERNAL_SERVER_ERROR = 500;
export const HTTP_NO_CONTENT = 204; // Successful delete / empty response
export const HTTP_UNPROCESSABLE_ENTITY = 422; // Validation errors (alternative to 400)
export const HTTP_TOO_MANY_REQUESTS = 429; // Rate limiting
export const HTTP_SERVICE_UNAVAILABLE = 503; // Maintenance / downtime
