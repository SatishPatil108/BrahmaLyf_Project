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
        "/apis/admin/progress-tools/questions",
        verifyAdminToken,
        postProgressTrackingQuestionValidator,
        postProgressTrackingQuestionController
    );

    app.put(
        "/apis/admin/progress-tools/questions/:question_id",
        verifyAdminToken,
        updateProgressTrackingQuestionValidator,
        updateProgressTrackingQuestionController
    );

    app.get(
        "/apis/admin/progress-tools/questions",
        verifyAdminToken,
        getAllProgressTrackingQuestionsController
    );

    app.get(
        "/apis/admin/progress-tools/questions/:question_id",
        verifyAdminToken,
        getProgressTrackingQuestionController
    );

    app.delete(
        "/apis/admin/progress-tools/questions/:question_id",
        verifyAdminToken,
        deleteProgressTrackingQuestionController
    );
};