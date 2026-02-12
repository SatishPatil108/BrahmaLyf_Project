import joi from "joi";
import {
    error as _error,
    HTTP_BAD_REQUEST,
    APP_RESPONSE_CODE_ERROR,
} from "../../../response/response.js";
import {  MUSIC_THUMBNAIL_AND_FILE_REQUIRED } from "../messages/music.js";
import validateFile from "../../../utils/validateFile.js";
import { INVALID_REQUEST_PARAMETER } from "../../../message/message.js";

const baseMusicSchema = {
    music_title: joi.string().min(2).max(100).required(),
    music_description: joi.string().min(2).max(1000).required(),
    music_duration: joi.string().min(3).max(10).required(),
};

// Allowed MIME types
const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const VALID_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/aac"];

// Size limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5MB
const MAX_AUDIO_SIZE = 20 * 1024 * 1024;  // 20MB

export const postMusicValidator = (req, res, next) => {
    // -----------------------------------------------
    // Validate body
    // -----------------------------------------------
    const schema = joi.object({
        ...baseMusicSchema,
    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.error("🎵 POST Validation Error:", error.details);
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            INVALID_REQUEST_PARAMETER,
            error.details
        );
    }

    // -----------------------------------------------
    // Validate files (both REQUIRED)
    // -----------------------------------------------
    const thumbnail = req.files?.music_thumbnail?.[0] || null;
    const musicFile = req.files?.music_file?.[0] || null;

    if (!thumbnail || !musicFile) {
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            MUSIC_THUMBNAIL_AND_FILE_REQUIRED,
            null
        );
    }

    // Validate thumbnail
    const thumbError = validateFile(
        thumbnail,
        true,
        VALID_IMAGE_TYPES,
        MAX_IMAGE_SIZE,
        "music_thumbnail"
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

    // Validate audio file
    const audioError = validateFile(
        musicFile,
        true,
        VALID_AUDIO_TYPES,
        MAX_AUDIO_SIZE,
        "music_file"
    );

    if (audioError) {
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            audioError,
            null
        );
    }

    next();
};

export const updateMusicValidator = (req, res, next) => {
    // ----------------------------------------------------
    // Validate Params + Body together
    // ----------------------------------------------------
    const schema = joi.object({
        musicId: joi.number().integer().min(1).required(),
        ...baseMusicSchema,
    });

    const { error } = schema.validate({ ...req.params, ...req.body });
    if (error) {
        console.error("🎵 PUT Validation Error:", error.details);
        return _error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            INVALID_REQUEST_PARAMETER,
            error.details
        );
    }

    // ----------------------------------------------------
    // Validate files (both OPTIONAL)
    // ----------------------------------------------------
    const thumbnail = req.files?.music_thumbnail?.[0] || null;
    const musicFile = req.files?.music_file?.[0] || null;

    // Thumbnail validation (optional)
    if (thumbnail) {
        const thumbError = validateFile(
            thumbnail,
            false,                    // optional
            VALID_IMAGE_TYPES,
            MAX_IMAGE_SIZE,
            "music_thumbnail"
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
    }

    // Music file validation (optional)
    if (musicFile) {
        const audioError = validateFile(
            musicFile,
            false,                    // optional
            VALID_AUDIO_TYPES,
            MAX_AUDIO_SIZE,
            "music_file"
        );

        if (audioError) {
            return _error(
                res,
                HTTP_BAD_REQUEST,
                APP_RESPONSE_CODE_ERROR,
                audioError,
                null
            );
        }
    }

    next();
};