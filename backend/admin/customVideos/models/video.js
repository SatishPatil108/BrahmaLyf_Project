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
  deleteCustomVideoService,
  getAllCustomVideosService,
  getCustomVideoService,
  postCustomVideoService,
  updateCustomVideoService,
} from "../services/video.js";

export const postCustomVideoModel = async (req, res) => {
  try {
    const { video_title, category_id } = req.body;

    // ----------------------------------------------
    // Safe filename base
    // ----------------------------------------------
    const safeTitle = video_title.replace(/[^a-zA-Z0-9-_]/g, "_");

    // ----------------------------------------------
    // Thumbnail (required by validator)
    // ----------------------------------------------
    const thumbnailFile = req.files?.video_thumbnail?.[0] || null;
    const videoThumbnail = thumbnailFile
      ? saveUploadedFile(thumbnailFile, "customVideo-thumbnails", safeTitle)
      : null;

    // ----------------------------------------------
    // Video file (required by validator)
    // ----------------------------------------------

    const uploadedVideoFile = req.files?.video_file?.[0] || null;
    const videoUrlString = req.body?.video_file || null;

    const customVideoFilePath = uploadedVideoFile
      ? saveUploadedFile(uploadedVideoFile, "customVideo", safeTitle)
      : (videoUrlString ?? null);

    // ----------------------------------------------
    // Insert DB record
    // ----------------------------------------------
    const response = await postCustomVideoService(
      video_title,
      category_id,
      videoThumbnail,
      customVideoFilePath,
    );

    if (!response) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        VIDEO_ADDED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      VIDEO_ADDED_SUCCESS,
      response,
    );
  } catch (err) {
    console.error("Custom Video Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const getAllCustomVideosModel = async (req, res) => {
  try {
    const { pageNo, pageSize } = req.params;
    const result = await getAllCustomVideosService(pageNo, pageSize);

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      ALL_VIDEO_LIST,
      result,
    );
  } catch (err) {
    console.error("Get Custom Videos Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const getCustomVideoModel = async (req, res) => {
  try {
    const customVideoId = parseInt(req.params.customVideoId);
    if (isNaN(customVideoId)) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_VIDEO_ID,
        null,
      );
    }
    const video = await getCustomVideoService(customVideoId);
    if (!video) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        VIDEO_NOT_FOUND,
        null,
      );
    }
    return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, VIDEO_FOUND, video);
  } catch (err) {
    console.error("Get Custom Video Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const updateCustomVideoModel = async (req, res) => {
  try {
    const customVideoId = parseInt(req.params.customVideoId);

    // ---------------------------------------------------
    // Validate ID
    // ---------------------------------------------------
    if (isNaN(customVideoId)) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_VIDEO_ID,
        null,
      );
    }

    const { video_title, category_id } = req.body;

    // ---------------------------------------------------
    // Fetch existing video record
    // ---------------------------------------------------
    const existingVideo = await getCustomVideoService(customVideoId);

    if (!existingVideo || existingVideo === -1) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        VIDEO_NOT_FOUND,
        null,
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
        "customVideo-thumbnails",
        safeTitle,
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

    const customVideoFilePath = uploadedVideoFile
      ? saveUploadedFile(uploadedVideoFile, "customVideo", safeTitle)
      : (videoUrlString ?? null);
    let newVideoFile = existingVideo.video_file;

    if (customVideoFilePath) {
      newVideoFile = customVideoFilePath;

      // Remove old video file if it exists and is different from the new one
      if (
        existingVideo.video_file &&
        existingVideo.video_file !== newVideoFile
      ) {
        await removeFiles([existingVideo.video_file]);
      }
    }

    // ---------------------------------------------------
    // Update DB
    // ---------------------------------------------------
    const updatedCustomVideo = await updateCustomVideoService(
      customVideoId,
      video_title,
      category_id,
      newThumbnail,
      newVideoFile,
    );

    if (!updatedCustomVideo || updatedCustomVideo === -1) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_REQUEST,
        null,
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
        video_id: updatedCustomVideo.id,
        video_title: updatedCustomVideo.video_title,
        category_id: updatedCustomVideo.category_id,
        video_thumbnail: updatedCustomVideo.video_thumbnail,
        video_file: updatedCustomVideo.video_file,
        updated_on: updatedCustomVideo.updated_on,
      },
    );
  } catch (err) {
    console.error("Update Custom Video Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

export const deleteCustomVideoModel = async (req, res) => {
  try {
    const customVideoId = parseInt(req.params.customVideoId);
    if (isNaN(customVideoId)) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_VIDEO_ID,
        null,
      );
    }
    const existingVideo = await getCustomVideoService(customVideoId);
    if (!existingVideo) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        VIDEO_NOT_FOUND,
        null,
      );
    }
    const deletedVideo = await deleteCustomVideoService(customVideoId);
    if (!deletedVideo) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_REQUEST,
        null,
      );
    }
    const filesToDelete = [];
    if (existingVideo.video_thumbnail)
      filesToDelete.push(existingVideo.video_thumbnail);
    if (existingVideo.video_file) filesToDelete.push(existingVideo.video_file);
    if (filesToDelete.length) {
      await removeFiles(filesToDelete);
    }
    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      VIDEO_DELETED_SUCCESS,
      { video_id: customVideoId },
    );
  } catch (err) {
    console.error("Delete Custom Video Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};
