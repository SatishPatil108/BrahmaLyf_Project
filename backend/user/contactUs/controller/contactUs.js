import {
  postContactUsModel,
  postSubscribeToNewsletterModel,
} from "../models/contactUs.js";

export const postContactUsController = (req, res) =>
  postContactUsModel(req, res);
export const postSubscribeToNewsletterController = (req, res) =>
  postSubscribeToNewsletterModel(req, res);
