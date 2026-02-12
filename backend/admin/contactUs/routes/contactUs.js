import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import {
    postReplyValidator,
} from "../middleware/contactUs.js";
import {
    postReplyController,
    getQueriesController,
    getQueryController,
    deleteQueryController,
} from "../controller/contactUs.js";

export default (app) => {
    app.post(
        "/apis/admin/inquiry/reply/:query_id",
        verifyAdminToken,
        postReplyValidator,
        postReplyController
    );

    app.get(
        "/apis/admin/inquiries/:pageNo/:pageSize",
        verifyAdminToken,
        getQueriesController
    );

    app.get(
        "/apis/admin/inquiry/:query_id",
        verifyAdminToken,
        getQueryController
    );

    app.delete(
        "/apis/admin/inquiry/:query_id",
        verifyAdminToken,
        deleteQueryController
    );
};