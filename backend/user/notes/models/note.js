import {
    error,
    HTTP_BAD_REQUEST,
    APP_RESPONSE_CODE_ERROR,
    HTTP_INTERNAL_SERVER_ERROR,
    success,
    HTTP_CREATED,
    APP_RESPONSE_CODE_SUCCESS,
    HTTP_OK
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
    SOMETHING_WENT_WRONG
} from "../messages/note.js";
import {
    deleteNoteService,
    getNoteService,
    getNotesService,
    postNoteService,
    updateNoteService
} from "../services/note.js";

// CREATE NOTE
export const postUserNoteModel = async (req, res) => {
    const { user_note } = req.body;

    const userId = req.userId;   // ✅ from token
    
    if (!userId) {
        return error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            "User ID is required",
            null
        );
    }

    const result = await postNoteService(user_note, userId);

    if (result === -1) {
        return error(
            res,
            HTTP_BAD_REQUEST,
            APP_RESPONSE_CODE_ERROR,
            NOTE_ADDED_FAILED,
            null
        );
    }

    return success(
        res,
        HTTP_CREATED,
        APP_RESPONSE_CODE_SUCCESS,
        NOTE_ADDED_SUCCESS,
        result
    );
};

// GET NOTE LIST
export const getUserNotesModel = async (req, res) => {
    const { pageNo, pageSize } = req.params;
    const result = await getNotesService(pageNo, pageSize);
    if (result === -1) {
        return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, NOTE_NOT_FOUND, null);
    }
    return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, ALL_NOTE_LIST, result);
};


// GET SINGLE NOTE
export const getUserNoteModel = async (req, res) => {
    try {
        const noteId = parseInt(req.params.noteId);
        if (isNaN(noteId)) {
            return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, INVALID_MUSIC_ID, null);
        }
        const note = await getNoteService(noteId);
        if (!note) {
            return error(res, HTTP_NOT_FOUND, APP_RESPONSE_CODE_ERROR, NOTE_NOT_FOUND, null);
        }
        return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, NOTE_FOUND, note);
    } catch (err) {
        console.error("Get Note Error:", err);
        return error(res, HTTP_INTERNAL_SERVER_ERROR, APP_RESPONSE_CODE_ERROR, SOMETHING_WENT_WRONG, null);
    }
}

// UPDATE NOTE
export const updateUserNoteModel = async (req, res) => {
    const { noteId } = req.params;
    const { user_note } = req.body;
    const status = 1;
    const result = await updateNoteService(noteId, user_note, status);
    if (result === -1) {
        console.error(result)
        return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, NOTE_UPDATED_FAILED, null);
    }
    return success(
        res,
        HTTP_CREATED,
        APP_RESPONSE_CODE_SUCCESS,
        NOTE_UPDATED_SUCCESS,
        { note_id: noteId }
    );
};

// DELETE NOTE
export const deleteUserNoteModel = async (req, res) => {
    const { noteId } = req.params;
    const result = await deleteNoteService(noteId);
    if (result === -1) {
        return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, NOTE_DELETED_FAILED, null);
    }
    return success(
        res,
        HTTP_OK,
        APP_RESPONSE_CODE_SUCCESS,
        NOTE_DELETED_SUCCESS,
        { note_id: noteId }
    );
};
