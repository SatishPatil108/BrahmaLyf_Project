import {
  error,
  HTTP_BAD_REQUEST,
  APP_RESPONSE_CODE_ERROR,
  HTTP_INTERNAL_SERVER_ERROR,
  success,
  HTTP_CREATED,
  APP_RESPONSE_CODE_SUCCESS,
  HTTP_OK,
} from "../../../response/response.js";
import { getUserIdByEmailService } from "../../forgotPassword/services/forgotPassword.js";
import {
  NOTE_ADDED_SUCCESS,
  NOTE_ADDED_FAILED,
  NOTE_NOT_FOUND,
  NOTE_FOUND,
  ALL_NOTE_LIST,
  NOTE_UPDATED_SUCCESS,
  NOTE_UPDATED_FAILED,
  NOTE_DELETED_FAILED,
  NOTE_DELETED_SUCCESS,
  SOMETHING_WENT_WRONG,
} from "../messages/note.js";
import {
  deleteNoteService,
  getNoteService,
  getNotesService,
  postNoteService,
  updateNoteService,
} from "../services/note.js";

// CREATE NOTE
export const postUserNoteModel = async (req, res) => {
  try {
    const { user_note } = req.body;
    const userId = req.userId;

    if (!userId) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        "User ID is required",
        null,
      );
    }

    const result = await postNoteService(user_note, userId);

    if (!result) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        NOTE_ADDED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      NOTE_ADDED_SUCCESS,
      result,
    );
  } catch (err) {
    console.error("postUserNoteModel error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

// GET NOTE LIST
export const getUserNotesModel = async (req, res) => {
  try {
    const userId = req.userId;

    const { pageNo, pageSize } = req.params;

    const result = await getNotesService(userId, pageNo, pageSize);

    if (!result || result === -1) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        NOTE_NOT_FOUND,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      ALL_NOTE_LIST,
      result,
    );
  } catch (err) {
    console.error("getUserNotesModel error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      "Failed to fetch user notes",
      null,
    );
  }
};

// GET SINGLE NOTE
export const getUserNoteModel = async (req, res) => {
  try {
    const userId = req.userId;
    const noteId = parseInt(req.params.noteId);
    if (isNaN(noteId)) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        INVALID_MUSIC_ID,
        null,
      );
    }
    const note = await getNoteService(userId, noteId);
    if (!note) {
      return error(
        res,
        HTTP_NOT_FOUND,
        APP_RESPONSE_CODE_ERROR,
        NOTE_NOT_FOUND,
        null,
      );
    }
    return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, NOTE_FOUND, note);
  } catch (err) {
    console.error("Get Note Error:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

// UPDATE NOTE
export const updateUserNoteModel = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { user_note } = req.body;
    const userId = req.userId;

    const parsedNoteId = parseInt(noteId, 10);

    if (isNaN(parsedNoteId)) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        "INVALID_NOTE_ID",
        null,
      );
    }

    const result = await updateNoteService(parsedNoteId, user_note, userId);

    if (!result) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        NOTE_UPDATED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      NOTE_UPDATED_SUCCESS,
      result,
    );
  } catch (err) {
    console.error("updateUserNoteModel error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};

// DELETE NOTE
export const deleteUserNoteModel = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userId;

    const parsedNoteId = parseInt(noteId, 10);

    if (isNaN(parsedNoteId)) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        "INVALID_NOTE_ID",
        null,
      );
    }

    const result = await deleteNoteService(parsedNoteId, userId); 

    if (!result) {
      return error(
        res,
        HTTP_BAD_REQUEST,
        APP_RESPONSE_CODE_ERROR,
        NOTE_DELETED_FAILED,
        null,
      );
    }

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      NOTE_DELETED_SUCCESS,
      result,
    );
  } catch (err) {
    console.error("deleteUserNoteModel error:", err);

    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null,
    );
  }
};
