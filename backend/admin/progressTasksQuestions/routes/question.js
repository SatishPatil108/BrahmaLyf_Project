import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import {
  postProgressTasksQuestionController,
  updateProgressTasksQuestionController,
  deleteProgressTasksQuestionController,
  getProgressTasksQuestionController,
  getAllProgressTasksQuestionsController,
  getAllProgressPracticeMessagesController,
  updateProgressPracticeMessageController,
  postProgressPracticeMessageController,
  deleteProgressPracticeMessageController,
} from "../controller/question.js";

import {
  postProgressPracticeMessageValidator,
  postProgressTasksQuestionValidator,
  updateProgressPracticeMessageValidator,
  updateProgressTasksQuestionValidator,
} from "../middleware/question.js";

export default (app) => {
  app.post(
    "/apis/admin/progress-tasks/questions/:courseId",
    verifyAdminToken,
    postProgressTasksQuestionValidator,
    postProgressTasksQuestionController,
  );

  app.put(
    "/apis/admin/progress-tasks/questions/:courseId/:questionId",
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

  // Additional routes for progress practice messages can be added here following the same pattern
  app.get(
    "/apis/admin/progress-practice/message",
    verifyAdminToken,
    getAllProgressPracticeMessagesController,
  );

  app.get(
    "/apis/admin/progress-practice/message/:message_id",
    verifyAdminToken,
    getAllProgressPracticeMessagesController,
  );

  app.post(
    "/apis/admin/progress-practice/message/:courseId",
    verifyAdminToken,
    postProgressPracticeMessageValidator,
    postProgressPracticeMessageController,
  );

  app.put(
    "/apis/admin/progress-practice/message/:courseId/:weekNo",
    verifyAdminToken,
    updateProgressPracticeMessageValidator,
    updateProgressPracticeMessageController,
  );

  app.delete(
    "/apis/admin/progress-practice/message/:courseId/:weekNo",
    verifyAdminToken,
    deleteProgressPracticeMessageController,
  );
};
