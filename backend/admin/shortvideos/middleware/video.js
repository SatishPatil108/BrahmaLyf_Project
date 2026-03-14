import joi from "joi";
import {
    error as _error,
    HTTP_BAD_REQUEST,
    APP_RESPONSE_CODE_ERROR,
} from "../../../response/response.js";
import { VIDEO_THUMBNAIL_AND_FILE_REQUIRED } from "../messages/video.js";
import validateFile from "../../../utils/validateFile.js";
import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";

const baseShortVideoSchema = {
    video_title: joi.string().min(2).max(100).required(),
    video_description: joi.string().min(2).max(1000).required(),
    video_file: joi.string().uri().optional(),
    domain_id: joi.number().integer().required(), // ✅ ADD THIS
};

// Allowed MIME types
const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const VALID_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

// Size limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export const postShortVideoValidator = (req, res, next) => {
    // -----------------------------------------------
    // Validate body
    // -----------------------------------------------
    const schema = joi.object({
        ...baseShortVideoSchema,
    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.error("POST Validation Error:", error.details);
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            INVALID_REQUEST_PARAMETER,
            error.details
        );
    }

    // -----------------------------------------------
    // Validate files/url (thumbnail required, video = file OR url)
    // -----------------------------------------------
    const thumbnail = req.files?.video_thumbnail?.[0] || null;
    const shortVideoFile = req.files?.video_file?.[0] || null;
    const videoUrl = req.body?.video_file || null;

    // Thumbnail is always required as a file
    if (!thumbnail) {
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            VIDEO_THUMBNAIL_AND_FILE_REQUIRED,
            null
        );
    }

    // Video must be either an uploaded file OR a URL string
    if (!shortVideoFile && !videoUrl) {
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            VIDEO_THUMBNAIL_AND_FILE_REQUIRED,
            null
        );
    }

    // Validate thumbnail file
    const thumbError = validateFile(
        thumbnail,
        true,
        VALID_IMAGE_TYPES,
        MAX_IMAGE_SIZE,
        VALID_VIDEO_TYPES,
        MAX_VIDEO_SIZE,
        "shortVideo-thumbnails"
    );

    if (thumbError) {
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            thumbError,
            null
        );
    }

    // Only validate as file if it's an actual upload (skip if it's a URL)
    if (shortVideoFile) {
        const videoError = validateFile(
            shortVideoFile,
            true,
            VALID_IMAGE_TYPES,
            MAX_IMAGE_SIZE,
            VALID_VIDEO_TYPES,
            MAX_VIDEO_SIZE,
            "video_file"
        );
        if (videoError) {
            return _error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                videoError,
                null
            );
        }
    }

    next();
};

export const updateShortVideoValidator = (req, res, next) => {
    // ----------------------------------------------------
    // Validate Params + Body together
    // ----------------------------------------------------
    const schema = joi.object({
        shortVideoId: joi.number().integer().min(1).required(),
        ...baseShortVideoSchema,
    });

    const { error } = schema.validate({ ...req.params, ...req.body });
    if (error) {
        console.error("PUT Validation Error:", error.details);
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            INVALID_REQUEST_PARAMETER,
            error.details
        );
    }

    // -----------------------------------------------
    // Files are OPTIONAL on update — user may keep existing ones
    // -----------------------------------------------
    const thumbnail = req.files?.video_thumbnail?.[0] || null;
    const shortVideoFile = req.files?.video_file?.[0] || null;
    const videoUrl = req.body?.video_file || null;

    // ✅ Only validate thumbnail if a new one was uploaded
    if (thumbnail) {
        const thumbError = validateFile(
            thumbnail,
            true,
            VALID_IMAGE_TYPES,
            MAX_IMAGE_SIZE,
            VALID_VIDEO_TYPES,
            MAX_VIDEO_SIZE,
            "shortVideo-thumbnails"
        );
        if (thumbError) {
            return _error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, thumbError, null);
        }
    }

    // ✅ Only validate video file if a new one was uploaded
    if (shortVideoFile) {
        const videoError = validateFile(
            shortVideoFile,
            true,
            VALID_IMAGE_TYPES,
            MAX_IMAGE_SIZE,
            VALID_VIDEO_TYPES,
            MAX_VIDEO_SIZE,
            "video_file"
        );
        if (videoError) {
            return _error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, videoError, null);
        }
    }

    // ✅ If a video_file body string is provided, ensure it's a valid URL
    if (videoUrl && typeof videoUrl !== "string") {
        return _error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_REQUEST_PARAMETER, null);
    }

    next();
};