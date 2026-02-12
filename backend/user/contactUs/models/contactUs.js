import {
  error,
  success,
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_INTERNAL_SERVER_ERROR,
  APP_RESPONSE_CODE_ERROR,
  APP_RESPONSE_CODE_SUCCESS,
  HTTP_CONFLICT,
} from "../../../response/response.js";
import {
  CONTACT_US_ADD_SUCCESS,
  CONTACT_US_ADD_FAILURE,
  SOMETHING_WENT_WRONG,
  NEWSLETTER_SUBSCRIBE_SUCCESS,
  NEWSLETTER_SUBSCRIBE_FAILURE,
  NEWSLETTER_ALREADY_SUBSCRIBED,
  NEWSLETTER_REACTIVATED_SUCCESS,
} from "../messages/contactUs.js";
import {
  postContactUsService,
  postSubscribeToNewsletterService,
} from "../services/contactUs.js";

export const postContactUsModel = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const userId = req.userId ?? null;

    const response = await postContactUsService(userId, name, email, message);

    if (!response) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        CONTACT_US_ADD_FAILURE,
        null
      );
    }

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      CONTACT_US_ADD_SUCCESS,
      response
    );
  } catch (err) {
    console.error("Post Contact Us Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null
    );
  }
};

export const postSubscribeToNewsletterModel = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.userId ?? null;

    const response = await postSubscribeToNewsletterService(userId, email);

    // 🛑 Already subscribed (status = 1)
    if (response?.alreadySubscribed) {
      return error(
        res,
        HTTP_CONFLICT,
        APP_RESPONSE_CODE_ERROR,
        NEWSLETTER_ALREADY_SUBSCRIBED,
        null
      );
    }

    // 🆕 New subscription
    if (response?.subscribed) {
      return success(
        res,
        HTTP_CREATED,
        APP_RESPONSE_CODE_SUCCESS,
        NEWSLETTER_SUBSCRIBE_SUCCESS,
        response.data
      );
    }

    // 🔁 Reactivated subscription
    if (response?.reactivated) {
      return success(
        res,
        HTTP_CREATED,
        APP_RESPONSE_CODE_SUCCESS,
        NEWSLETTER_REACTIVATED_SUCCESS,
        response.data
      );
    }

    // ❌ Safety fallback
    return error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      NEWSLETTER_SUBSCRIBE_FAILURE,
      null
    );
  } catch (err) {
    console.error("Post Subscribe Newsletter Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null
    );
  }
};
