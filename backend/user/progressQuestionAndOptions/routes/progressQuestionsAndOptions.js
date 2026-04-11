import verifyUserToken from "../../middleware/verifyUserToken.js";

import {
  getNextUserProgressController,
  getQuestionsWithOptionsController,
  postUserProgressController,
} from "../controller/progressQuestionsAndOptions.js";

export default (app) => {
  app.get(
    "/apis/user/fetchProgressQuestionsAndOptions",
    verifyUserToken,
    getQuestionsWithOptionsController,
  );

  app.get(
    "/apis/user/nextProgressQuestion",
    verifyUserToken,
    getNextUserProgressController,
  );

  app.post(
    "/apis/user/progress-tracking",
    verifyUserToken,
    postUserProgressController,
  );
};
