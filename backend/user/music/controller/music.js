import {
  getMusicsModel,
  getMusicModel,
} from "../models/music.js";

export const getMusicsController = (req, res) => getMusicsModel(req, res);

export const getMusicController = (req, res) => getMusicModel(req, res);

