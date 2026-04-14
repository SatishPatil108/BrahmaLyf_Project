import verifyUserToken from "../../middleware/verifyUserToken.js";

import {
  getQuestionsWithOptionsController,
  postUserProgressController,
} from "../controller/progressQuestionsAndOptions.js";

export default (app) => {
  app.get(
    "/apis/user/fetchProgressQuestionsAndOptions",
    verifyUserToken,
    getQuestionsWithOptionsController,
  );

  app.post(
    "/apis/user/progress-tracking",
    verifyUserToken,
    postUserProgressController,
  );
};
