import {
    getCoursesModel,
} from "../models/searchCourse.js";

export const getCoursesController = (req, res) => getCoursesModel(req, res);