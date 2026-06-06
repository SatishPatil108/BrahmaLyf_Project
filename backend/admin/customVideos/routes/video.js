import verifyAdminToken from "../../middleware/verifyAdminToken.js";

import {
  postCustomVideoValidator,
  updateCustomVideoValidator,
} from "../middleware/video.js";

import universalUpload from "../../../middleware/universalUpload.js";

import {
  deleteCustomVideoController,
  getAllCustomVideosController,
  getCustomVideoController,
  postCustomVideoController,
  updateCustomVideoController,
} from "../controller/video.js";

export default (app) => {
  app.post(
    "/apis/admin/custom-video",
    verifyAdminToken,
    universalUpload.fields([
      { name: "video_thumbnail", maxCount: 1 },
      { name: "video_file", maxCount: 1 },
    ]),
    postCustomVideoValidator,
    postCustomVideoController,
  );

  app.put(
    "/apis/admin/custom-video/:customVideoId",
    verifyAdminToken,
    universalUpload.fields([
      { name: "video_thumbnail", maxCount: 1 },
      { name: "video_file", maxCount: 1 },
    ]),
    updateCustomVideoValidator,
    updateCustomVideoController,
  );

  app.get(
    "/apis/admin/custom-videos/:pageNo/:pageSize",
    verifyAdminToken,
    getAllCustomVideosController,
  );

  app.get(
    "/apis/admin/custom-video/:customVideoId",
    verifyAdminToken,
    getCustomVideoController,
  );

  app.delete(
    "/apis/admin/custom-video/:customVideoId",
    verifyAdminToken,
    deleteCustomVideoController,
  );
};
