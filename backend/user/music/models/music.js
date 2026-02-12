import {
    error,
    success,
    HTTP_BAD_REQUEST,
    HTTP_OK,
    HTTP_NOT_FOUND,
    HTTP_INTERNAL_SERVER_ERROR,
    APP_RESPONSE_CODE_ERROR,
    APP_RESPONSE_CODE_SUCCESS,
} from "../../../response/response.js";
import {
    ALL_MUSIC_LIST,
    MUSIC_NOT_FOUND,
    MUSIC_FOUND,
    SOMETHING_WENT_WRONG,
    INVALID_MUSIC_ID
} from "../messages/music.js";
import {
    getMusicsService,
    getMusicService,
} from "../services/music.js";

export const getMusicsModel = async (req, res) => {
    try {
        const { pageNo, pageSize } = req.params;
        const result = await getMusicsService(pageNo, pageSize);

        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            ALL_MUSIC_LIST,
            result
        );
    } catch (err) {
        console.error("Get Musics Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
}

export const getMusicModel = async (req, res) => {
    try {
        const musicId = parseInt(req.params.musicId);
        if (isNaN(musicId)) {
            return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_MUSIC_ID, null);
        }
        const music = await getMusicService(musicId);
        if (!music) {
            return error(res, HTTP_NOT_FOUND, APP_RESPONSE_CODE_ERROR, MUSIC_NOT_FOUND, null);
        }
        return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, MUSIC_FOUND, music);
    } catch (err) {
        console.error("Get Music Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
}