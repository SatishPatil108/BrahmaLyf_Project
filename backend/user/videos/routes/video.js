
import verifyUserToken from "../../middleware/verifyUserToken.js";
import { getShortVideoController, getShortVideosController } from "../controller/video.js";
 

export default (app) => {

    app.get("/apis/user/short-videos/:pageNo/:pageSize", getShortVideosController);

    app.get("/apis/user/short-video/:shortVideoId", verifyUserToken, getShortVideoController);

};