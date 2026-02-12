import verifyAdminToken from "../../middleware/verifyAdminToken.js";
import {
    postMusicValidator,
    updateMusicValidator,
} from "../middleware/music.js";
import {
    postMusicController,
    updateMusicController,
    getMusicsController,
    getMusicController,
    deleteMusicController,
} from "../controller/music.js";
import universalUpload from "../../../middleware/universalUpload.js";

export default (app) => {

    app.post(
        "/apis/admin/music",
        verifyAdminToken,
        universalUpload.fields([
            { name: "music_thumbnail", maxCount: 1 },
            { name: "music_file", maxCount: 1 },
        ]),
        postMusicValidator,
        postMusicController
    );

    app.put(
        "/apis/admin/music/:musicId",
        verifyAdminToken,
        universalUpload.fields([
            { name: "music_thumbnail", maxCount: 1 },
            { name: "music_file", maxCount: 1 },
        ]),
        updateMusicValidator,
        updateMusicController
    );

    app.get("/apis/admin/musics/:pageNo/:pageSize", verifyAdminToken, getMusicsController);

    app.get("/apis/admin/music/:musicId", verifyAdminToken, getMusicController);

    app.delete("/apis/admin/music/:musicId", verifyAdminToken, deleteMusicController);
};