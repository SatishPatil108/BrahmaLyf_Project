import { deleteUserNoteModel, getUserNoteModel, getUserNotesModel, postUserNoteModel, updateUserNoteModel } from "../models/note.js";

export const postUserNoteController = (req, res) => postUserNoteModel(req, res);

export const getUserNotesController = (req, res) => getUserNotesModel(req, res);

export const getUserNoteController = (req, res) => getUserNoteModel(req, res);

export const updateUserNoteController = (req, res) => updateUserNoteModel(req, res);

export const deleteUserNoteController = (req, res) => deleteUserNoteModel(req, res);
