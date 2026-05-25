import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import {
  getAllProgressToolsQuestionsController,
  postProgressToolsQuestionController,
  updateProgressToolsQuestionController,
  deleteProgressToolsQuestionController,
} from "../controller/tools.js";

import {
  postProgressToolsQuestionValidator,
  updateProgressToolsQuestionValidator,
} from "../middleware/tools.js";

export default (app) => {
  app.post(
    "/apis/admin/progress-tools/questions/:courseId",
    verifyAdminToken,
    postProgressToolsQuestionValidator,
    postProgressToolsQuestionController,
  );

  app.put(
    "/apis/admin/progress-tools/questions/:courseId/:tools_question_id",
    verifyAdminToken,
    updateProgressToolsQuestionValidator,
    updateProgressToolsQuestionController,
  );

  app.get(
    "/apis/admin/progress-tools/questions",
    verifyAdminToken,
    getAllProgressToolsQuestionsController,
  );

  app.delete(
    "/apis/admin/progress-tools/questions/:tools_question_id",
    verifyAdminToken,
    deleteProgressToolsQuestionController,
  );
};
