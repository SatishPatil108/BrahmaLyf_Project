import {
    error,
    success,
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_OK,
    HTTP_NOT_FOUND,
    HTTP_INTERNAL_SERVER_ERROR,
    APP_RESPONSE_CODE_ERROR,
    APP_RESPONSE_CODE_SUCCESS,
} from "../../../response/response.js";
import removeFiles from "../../../utils/removeFiles.js";
import saveUploadedFile from "../../../utils/uploadFile.js";
import {
    MUSIC_ADDED_SUCCESS,
    MUSIC_ADDED_FAILED,
    MUSIC_UPDATED_SUCCESS,
    MUSIC_DELETED_SUCCESS,
    ALL_MUSIC_LIST,
    MUSIC_NOT_FOUND,
    INVALID_REQUEST,
    MUSIC_FOUND,
    SOMETHING_WENT_WRONG,
    INVALID_MUSIC_ID
} from "../messages/music.js";
import {
    postMusicService,
    getMusicsService,
    getMusicService,
    updateMusicService,
    deleteMusicService
} from "../services/music.js";

export const postMusicModel = async (req, res) => {
    try {
        const { music_title, music_description, music_duration } = req.body;

        // ----------------------------------------------
        // Safe filename base
        // ----------------------------------------------
        const safeTitle = music_title.replace(/[^a-zA-Z0-9-_]/g, "_");

        // ----------------------------------------------
        // Thumbnail (required by validator)
        // ----------------------------------------------
        const thumbnailFile = req.files?.music_thumbnail?.[0] || null;
        const musicThumbnail = thumbnailFile
            ? saveUploadedFile(thumbnailFile, "music-thumbnails", safeTitle)
            : null;


        // ----------------------------------------------
        // Music file (required by validator)
        // ----------------------------------------------
        const musicFile = req.files?.music_file?.[0] || null;
        const musicFilePath = musicFile
            ? saveUploadedFile(musicFile, "musics", safeTitle)
            : null;

        // ----------------------------------------------
        // Insert DB record
        // ----------------------------------------------
        const response = await postMusicService(
            music_title,
            music_description,
            music_duration,
            musicThumbnail,
            musicFilePath
        );

        if (!response) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                MUSIC_ADDED_FAILED,
                null
            );
        }

        return success(
            res,
            HTTP_CREATED,
            APP_RESPONSE_CODE_SUCCESS,
            MUSIC_ADDED_SUCCESS,
            response
        );

    } catch (err) {
        console.error("Add Music Error:", err);
        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
}

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

export const updateMusicModel = async (req, res) => {
    try {
        const musicId = parseInt(req.params.musicId);

        // ---------------------------------------------------
        // Validate ID
        // ---------------------------------------------------
        if (isNaN(musicId)) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                INVALID_MUSIC_ID,
                null
            );
        }

        const { music_title, music_description, music_duration } = req.body;

        // ---------------------------------------------------
        // Fetch existing music record
        // ---------------------------------------------------
        const existingMusic = await getMusicService(musicId);

        if (!existingMusic || existingMusic === -1) {
            return error(
                res,
                HTTP_NOT_FOUND,
                APP_RESPONSE_CODE_ERROR,
                MUSIC_NOT_FOUND,
                null
            );
        }

        // ---------------------------------------------------
        // Safe filename from music title
        // ---------------------------------------------------
        const safeTitle = music_title.replace(/[^a-zA-Z0-9-_]/g, "_");

        // ---------------------------------------------------
        // Handle thumbnail (optional)
        // ---------------------------------------------------
        let newThumbnail = existingMusic.music_thumbnail;

        const incomingThumbnail = req.files?.music_thumbnail?.[0] || null;
        if (incomingThumbnail) {
            // Save new thumbnail
            newThumbnail = saveUploadedFile(
                incomingThumbnail,
                "music-thumbnails",
                safeTitle
            );

            // Remove old thumbnail
            if (existingMusic.music_thumbnail) {
                await removeFiles([existingMusic.music_thumbnail]);
            }
        }

        // ---------------------------------------------------
        // Handle music file (optional)
        // ---------------------------------------------------
        let newMusicFile = existingMusic.music_file;

        const incomingMusicFile = req.files?.music_file?.[0] || null;
        if (incomingMusicFile) {
            // Save new music file
            newMusicFile = saveUploadedFile(
                incomingMusicFile,
                "musics",
                safeTitle
            );

            // Remove old music file
            if (existingMusic.music_file) {
                await removeFiles([existingMusic.music_file]);
            }
        }

        // ---------------------------------------------------
        // Update DB
        // ---------------------------------------------------
        const updatedMusic = await updateMusicService(
            musicId,
            music_title,
            music_description,
            music_duration,
            newThumbnail,
            newMusicFile
        );

        if (!updatedMusic || updatedMusic === -1) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                INVALID_REQUEST,
                null
            );
        }

        // ---------------------------------------------------
        // Success response
        // ---------------------------------------------------
        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            MUSIC_UPDATED_SUCCESS,
            {
                music_id: updatedMusic.id,
                music_title: updatedMusic.music_title,
                music_description: updatedMusic.music_description,
                music_duration: updatedMusic.music_duration,
                music_thumbnail: updatedMusic.music_thumbnail,
                music_file: updatedMusic.music_file,
                updated_on: updatedMusic.updated_on
            }
        );

    } catch (err) {
        console.error("Update Music Error:", err);
        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
}

export const deleteMusicModel = async (req, res) => {
    try {
        const musicId = parseInt(req.params.musicId);
        if (isNaN(musicId)) {
            return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_MUSIC_ID, null);
        }
        const existingMusic = await getMusicService(musicId);
        if (!existingMusic) {
            return error(res, HTTP_NOT_FOUND, APP_RESPONSE_CODE_ERROR, MUSIC_NOT_FOUND, null);
        }
        const deletedMusic = await deleteMusicService(musicId);
        if (!deletedMusic) {
            return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST, null);
        }
        const filesToDelete = [];
        if (existingMusic.music_thumbnail) filesToDelete.push(existingMusic.music_thumbnail);
        if (existingMusic.music_file) filesToDelete.push(existingMusic.music_file);
        if (filesToDelete.length) {
            await removeFiles(filesToDelete);
        }
        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            MUSIC_DELETED_SUCCESS,
            { music_id: musicId }
        );
    } catch (err) {
        console.error("Delete Music Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
}