import verifyUserToken from "../../middleware/verifyUserToken.js";

import {
  getQuestionsWithOptionsController,
  getUserResponseController,
  postUserProgressController,
} from "../controller/progressQuestionsAndOptions.js";

export default (app) => {
  app.get(
    "/apis/user/fetchProgressQuestionsAndOptions",
    verifyUserToken,
    getQuestionsWithOptionsController,
  );

  app.get(
    "/apis/user/fetchUserResponse",
    verifyUserToken,
    getUserResponseController,
  );

  app.post(
    "/apis/user/progress-tracking",
    verifyUserToken,
    postUserProgressController,
  );
};
