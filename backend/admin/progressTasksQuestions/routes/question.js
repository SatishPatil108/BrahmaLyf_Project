import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import {
  postProgressTasksQuestionController,
  updateProgressTasksQuestionController,
  deleteProgressTasksQuestionController,
  getAllProgressTasksQuestionsController,
  getAllProgressPracticeMessagesController,
  updateProgressPracticeMessageController,
  postProgressPracticeMessageController,
  deleteProgressPracticeMessageController,
  getAllCompletedMessagesController,
  postCompletedMessageController,
  updateCompletedMessageController,
  deleteCompletedMessageController,
} from "../controller/question.js";

import {
  postCompletedMessageValidator,
  postProgressPracticeMessageValidator,
  postProgressTasksQuestionValidator,
  updateCompletedMessageValidator,
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

  app.delete(
    "/apis/admin/progress-tasks/questions/:question_id",
    verifyAdminToken,
    deleteProgressTasksQuestionController,
  );

  // Additional routes for progress practice messages
  app.get(
    "/apis/admin/progress-practice/message",
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
    "/apis/admin/progress-practice/message/:courseId/:messageId",
    verifyAdminToken,
    updateProgressPracticeMessageValidator,
    updateProgressPracticeMessageController,
  );

  app.delete(
    "/apis/admin/progress-practice/message/:messageId",
    verifyAdminToken,
    deleteProgressPracticeMessageController,
  );

  // routes for completed messages

  app.get(
    "/apis/admin/completed/message",
    verifyAdminToken,
    getAllCompletedMessagesController,
  );

  app.post(
    "/apis/admin/completed/message/:courseId",
    verifyAdminToken,
    postCompletedMessageValidator,
    postCompletedMessageController,
  );

  app.put(
    "/apis/admin/completed/message/:courseId/:messageId",
    verifyAdminToken,
    updateCompletedMessageValidator,
    updateCompletedMessageController,
  );

  app.delete(
    "/apis/admin/completed/message/:messageId",
    verifyAdminToken,
    deleteCompletedMessageController,
  );
};
