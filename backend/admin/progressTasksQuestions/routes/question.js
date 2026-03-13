import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import {
  postProgressTasksQuestionController,
  updateProgressTasksQuestionController,
  deleteProgressTasksQuestionController,
  getProgressTasksQuestionController,
  getAllProgressTasksQuestionsController,
} from "../controller/question.js";

import {
  postProgressTasksQuestionValidator,
  updateProgressTasksQuestionValidator,
} from "../middleware/question.js";

export default (app) => {
  app.post(
    "/apis/admin/progress-tasks/questions",
    verifyAdminToken,
    postProgressTasksQuestionValidator,
    postProgressTasksQuestionController,
  );

  app.put(
    "/apis/admin/progress-tasks/questions/:question_id",
    verifyAdminToken,
    updateProgressTasksQuestionValidator,
    updateProgressTasksQuestionController,
  );

  app.get(
    "/apis/admin/progress-tasks/questions",
    verifyAdminToken,
    getAllProgressTasksQuestionsController,
  );

  app.get(
    "/apis/admin/progress-tasks/questions/:question_id",
    verifyAdminToken,
    getProgressTasksQuestionController,
  );

  app.delete(
    "/apis/admin/progress-tasks/questions/:question_id",
    verifyAdminToken,
    deleteProgressTasksQuestionController,
  );
};
