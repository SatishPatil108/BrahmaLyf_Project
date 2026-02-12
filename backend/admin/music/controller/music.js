import {
  postMusicModel,
  getMusicsModel,
  getMusicModel,
  updateMusicModel,
  deleteMusicModel,
} from "../models/music.js";

export const postMusicController = (req, res) => postMusicModel(req, res);

export const getMusicsController = (req, res) => getMusicsModel(req, res);

export const getMusicController = (req, res) => getMusicModel(req, res);

export const updateMusicController = (req, res) => updateMusicModel(req, res);

export const deleteMusicController = (req, res) => deleteMusicModel(req, res);
