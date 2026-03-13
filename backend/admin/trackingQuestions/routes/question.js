import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import {
    deleteProgressTrackingQuestionController,
    getAllProgressTrackingQuestionsController,
    getProgressTrackingQuestionController,
    postProgressTrackingQuestionController,
    updateProgressTrackingQuestionController
} from "../controller/question.js";

import { postProgressTrackingQuestionValidator, updateProgressTrackingQuestionValidator } from "../middleware/question.js";

export default (app) => {

    app.post(
        "/apis/admin/progress-tracking/questions",
        verifyAdminToken,
        postProgressTrackingQuestionValidator,
        postProgressTrackingQuestionController
    );

    app.put(
        "/apis/admin/progress-tracking/questions/:question_id",
        verifyAdminToken,
        updateProgressTrackingQuestionValidator,
        updateProgressTrackingQuestionController
    );

    app.get(
        "/apis/admin/progress-tracking/questions",
        verifyAdminToken,
        getAllProgressTrackingQuestionsController
    );

    app.get(
        "/apis/admin/progress-tracking/questions/:question_id",
        verifyAdminToken,
        getProgressTrackingQuestionController
    );

    app.delete(
        "/apis/admin/progress-tracking/questions/:question_id",
        verifyAdminToken,
        deleteProgressTrackingQuestionController
    );
};