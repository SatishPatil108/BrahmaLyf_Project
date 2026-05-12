import verifyUserToken from "../../middleware/verifyUserToken.js";
import {
  getProgressToolsQuestionsController,
  getProgressToolsUserResponseController,
  getUserToolsWeekQuestionsController,
  postProgressToolsUserResponseController,
  updateProgressToolsUserResponseController,
} from "../controller/progressToolsQuestions.js";

export default (app) => {
  app.get(
    "/apis/user/fetchProgressToolsQuestions",
    verifyUserToken,
    getProgressToolsQuestionsController,
  );

  app.get(
    "/apis/user/fetchUserToolsWeekQuestions",
    getUserToolsWeekQuestionsController,
  );

  app.get(
    "/apis/user/fetchUserToolsResponse",
    verifyUserToken,
    getProgressToolsUserResponseController,
  );

  app.post(
    "/apis/user/progress-tools",
    verifyUserToken,
    postProgressToolsUserResponseController,
  );

  app.put(
    "/apis/user/progress-tools/:questionId",
    verifyUserToken,
    updateProgressToolsUserResponseController,
  );
};
