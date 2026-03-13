import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import {
    postShortVideoValidator,
    updateShortVideoValidator,
} from "../middleware/video.js";
import {
    postShortVideoController,
    getShortVideosController,
    getShortVideoController,
    updateShortVideoController,
    deleteShortVideoController,
} from "../controller/videos.js";
import universalUpload from "../../../middleware/universalUpload.js";

export default (app) => {

    app.post(
        "/apis/admin/short-video",
        verifyAdminToken,
        universalUpload.fields([
            { name: "video_thumbnail", maxCount: 1 },
            { name: "video_file", maxCount: 1 },
        ]),
        postShortVideoValidator,
        postShortVideoController
    );

    app.put(
        "/apis/admin/short-video/:shortVideoId",
        verifyAdminToken,
        universalUpload.fields([
            { name: "video_thumbnail", maxCount: 1 },
            { name: "video_file", maxCount: 1 },
        ]),
        updateShortVideoValidator,
        updateShortVideoController
    );

    app.get("/apis/admin/short-videos/:pageNo/:pageSize", verifyAdminToken, getShortVideosController);

    app.get("/apis/admin/short-video/:shortVideoId", verifyAdminToken, getShortVideoController);

    app.delete("/apis/admin/short-video/:shortVideoId", verifyAdminToken, deleteShortVideoController);
};