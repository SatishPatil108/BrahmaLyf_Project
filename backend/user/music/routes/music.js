import verifyUserToken from "../../middleware/verifyUserToken.js";
import {
    getMusicsController,
    getMusicController,
} from "../controller/music.js";

export default (app) => {

    app.get("/apis/user/musics/:pageNo/:pageSize",  getMusicsController);

    app.get("/apis/user/music/:musicId", verifyUserToken, getMusicController);

};