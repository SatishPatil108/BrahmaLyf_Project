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
    VIDEO_ADDED_SUCCESS,
    VIDEO_ADDED_FAILED,
    VIDEO_UPDATED_SUCCESS,
    VIDEO_DELETED_SUCCESS,
    ALL_VIDEO_LIST,
    VIDEO_NOT_FOUND,
    VIDEO_FOUND,
    INVALID_REQUEST,
    SOMETHING_WENT_WRONG,
    INVALID_VIDEO_ID,
} from "../messages/video.js";

import {
    postShortVideoService,
    getShortVideoService,
    getShortVideosService,
    updateShortVideoService,
    deleteShortVideoService
}
    from "../services/video.js";

export const postShortVideoModel = async (req, res) => {
    try {
        // const { video_title, video_description } = req.body;
        // ✅
        const { video_title, video_description, domain_id } = req.body;

        // ----------------------------------------------
        // Safe filename base
        // ----------------------------------------------
        const safeTitle = video_title.replace(/[^a-zA-Z0-9-_]/g, "_");

        // ----------------------------------------------
        // Thumbnail (required by validator)
        // ----------------------------------------------
        const thumbnailFile = req.files?.video_thumbnail?.[0] || null;
        const videoThumbnail = thumbnailFile
            ? saveUploadedFile(thumbnailFile, "shortVideo-thumbnails", safeTitle)
            : null;


        // ----------------------------------------------
        // Video file (required by validator)
        // ----------------------------------------------

        const uploadedVideoFile = req.files?.video_file?.[0] || null;
        const videoUrlString = req.body?.video_file || null;

        const shortVideoFilePath = uploadedVideoFile
            ? saveUploadedFile(uploadedVideoFile, "shortVideo", safeTitle)
            : videoUrlString ?? null;

        // ----------------------------------------------
        // Insert DB record
        // ----------------------------------------------
        const response = await postShortVideoService(
            video_title,
            video_description,
            domain_id,
            videoThumbnail,
            shortVideoFilePath
        );

        if (!response) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                VIDEO_ADDED_FAILED,
                null
            );
        }

        return success(
            res,
            HTTP_CREATED,
            APP_RESPONSE_CODE_SUCCESS,
            VIDEO_ADDED_SUCCESS,
            response
        );

    } catch (err) {
        console.error("Short Video Error:", err);
        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
}

export const getShortVideosModel = async (req, res) => {
    try {
        const { pageNo, pageSize } = req.params;
        const result = await getShortVideosService(pageNo, pageSize);

        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            ALL_VIDEO_LIST,
            result
        );
    } catch (err) {
        console.error("Get Short Videos Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
}

export const getShortVideoModel = async (req, res) => {
    try {
        const shortVideoId = parseInt(req.params.shortVideoId);
        if (isNaN(shortVideoId)) {
            return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_VIDEO_ID, null);
        }
        const video = await getShortVideoService(shortVideoId);
        if (!video) {
            return error(res, HTTP_NOT_FOUND, APP_RESPONSE_CODE_ERROR, VIDEO_NOT_FOUND, null);
        }
        return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, VIDEO_FOUND, video);
    } catch (err) {
        console.error("Get Short Video Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
}

export const updateShortVideoModel = async (req, res) => {
    try {
        const shortVideoId = parseInt(req.params.shortVideoId);

        // ---------------------------------------------------
        // Validate ID
        // ---------------------------------------------------
        if (isNaN(shortVideoId)) {
            return error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                INVALID_VIDEO_ID,
                null
            );
        }

        const { video_title, video_description, domain_id } = req.body;

        // ---------------------------------------------------
        // Fetch existing video record
        // ---------------------------------------------------
        const existingVideo = await getShortVideoService(shortVideoId);

        if (!existingVideo || existingVideo === -1) {
            return error(
                res,
                HTTP_NOT_FOUND,
                APP_RESPONSE_CODE_ERROR,
                VIDEO_NOT_FOUND,
                null
            );
        }

        // ---------------------------------------------------
        // Safe filename from video title
        // ---------------------------------------------------
        const safeTitle = video_title.replace(/[^a-zA-Z0-9-_]/g, "_");

        // ---------------------------------------------------
        // Handle thumbnail (optional)
        // ---------------------------------------------------
        let newThumbnail = existingVideo.video_thumbnail;

        const incomingThumbnail = req.files?.video_thumbnail?.[0] || null;
        if (incomingThumbnail) {
            // Save new thumbnail
            newThumbnail = saveUploadedFile(
                incomingThumbnail,
                "shortVideo-thumbnails",
                safeTitle
            );

            // Remove old thumbnail
            if (existingVideo.video_thumbnail) {
                await removeFiles([existingVideo.video_thumbnail]);
            }
        }

        // ---------------------------------------------------
        // Handle video file (optional)
        // ---------------------------------------------------
        const uploadedVideoFile = req.files?.video_file?.[0] || null;
        const videoUrlString = req.body?.video_file || null;

        const shortVideoFilePath = uploadedVideoFile
            ? saveUploadedFile(uploadedVideoFile, "shortVideo", safeTitle)
            : videoUrlString ?? null;
        let newVideoFile = existingVideo.video_file;

        if (shortVideoFilePath) {
            newVideoFile = shortVideoFilePath;

            // Remove old video file if it exists and is different from the new one
            if (existingVideo.video_file && existingVideo.video_file !== newVideoFile) {
                await removeFiles([existingVideo.video_file]);
            }
        }

        // ---------------------------------------------------
        // Update DB
        // ---------------------------------------------------
        const updatedShortVideo = await updateShortVideoService(
            shortVideoId,
            video_title,
            video_description,
            domain_id,
            newThumbnail,
            newVideoFile
        );

        if (!updatedShortVideo || updatedShortVideo === -1) {
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
            VIDEO_UPDATED_SUCCESS,
            {
                video_id: updatedShortVideo.id,
                video_title: updatedShortVideo.video_title,
                video_description: updatedShortVideo.video_description,
                domain_id: updatedShortVideo.domain_id,
                video_thumbnail: updatedShortVideo.video_thumbnail,
                video_file: updatedShortVideo.video_file,
                updated_on: updatedShortVideo.updated_on
            }
        );

    } catch (err) {
        console.error("Update Video Error:", err);
        return error(
            res,
            HTTP_INTERNAL_SERVER_ERROR,
            APP_RESPONSE_CODE_ERROR,
            SOMETHING_WENT_WRONG,
            null
        );
    }
}

export const deleteShortVideoModel = async (req, res) => {
    try {
        const shortVideoId = parseInt(req.params.shortVideoId);
        if (isNaN(shortVideoId)) {
            return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_VIDEO_ID, null);
        }
        const existingVideo = await getShortVideoService(shortVideoId);
        if (!existingVideo) {
            return error(res, HTTP_NOT_FOUND, APP_RESPONSE_CODE_ERROR, VIDEO_NOT_FOUND, null);
        }
        const deletedVideo = await deleteShortVideoService(shortVideoId);
        if (!deletedVideo) {
            return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST, null);
        }
        const filesToDelete = [];
        if (existingVideo.video_thumbnail) filesToDelete.push(existingVideo.video_thumbnail);
        if (existingVideo.video_file) filesToDelete.push(existingVideo.video_file);
        if (filesToDelete.length) {
            await removeFiles(filesToDelete);
        }
        return success(
            res,
            HTTP_OK,
            APP_RESPONSE_CODE_SUCCESS,
            VIDEO_DELETED_SUCCESS,
            { video_id: shortVideoId }
        );
    } catch (err) {
        console.error("Delete Video Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
}