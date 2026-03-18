import verifyUserToken from "../../middleware/verifyUserToken.js";
import { deleteUserNoteController, getUserNoteController, getUserNotesController, postUserNoteController, updateUserNoteController } from "../controller/note.js";
import { postUserNoteValidator, updateUserNoteValidator } from "../middleware/note.js";

export default (app) => {
    app.post(
        "/apis/user/notes",
        verifyUserToken,
        postUserNoteValidator,
        postUserNoteController
    );

    app.get(
        "/apis/user/notes/:noteId",
        verifyUserToken,              
        getUserNoteController
    );

    app.get(
        "/apis/user/fetchNotes",      
        verifyUserToken,
        getUserNotesController
    );

    app.put(
        "/apis/user/notes/:noteId",
        verifyUserToken,
        updateUserNoteValidator,
        updateUserNoteController
    );

    app.delete(
        "/apis/user/notes/:noteId",
        verifyUserToken,
        deleteUserNoteController
    );
};