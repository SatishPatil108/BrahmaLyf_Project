import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import {
    deleteProgressTrackingOptionController,
    getAllProgressTrackingOptionsController,
    getProgressTrackingOptionController,
    postProgressTrackingOptionController,
    updateProgressTrackingOptionController
} from "../controller/option.js";

import { postProgressTrackingOptionValidator, updateProgressTrackingOptionValidator } from "../middleware/option.js";

export default (app) => {

    app.post(
        "/apis/admin/progress-tracking/questions/:questionId/options",
        verifyAdminToken,
        postProgressTrackingOptionValidator,
        postProgressTrackingOptionController
    );

    app.put(
        "/apis/admin/progress-tracking/options/:option_id",
        verifyAdminToken,
        updateProgressTrackingOptionValidator,
        updateProgressTrackingOptionController
    );

    app.get("/apis/admin/progress-tracking/options", verifyAdminToken, getAllProgressTrackingOptionsController);

    app.get("/apis/admin/progress-tracking/options/:optionId", verifyAdminToken, getProgressTrackingOptionController);

    app.delete("/apis/admin/progress-tracking/options/:optionId", verifyAdminToken, deleteProgressTrackingOptionController);
};