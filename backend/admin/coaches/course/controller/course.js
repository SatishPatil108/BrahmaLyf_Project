import {
	postCourseModel,
	getAllCoursesModel,
	getCourseByIdModel,
	postCurriculumOutlineModel,
	updateCourseModel,
	deleteCourseModel,
	deleteCurriculumOutlineModel,
	updateCurriculumOutlineModel
} from "../models/course.js";

export const postCourseController = (req, res) => postCourseModel(req, res);

export const getAllCoursesController = (req, res) => getAllCoursesModel(req, res);

export const getCourseByIdController = (req, res) => getCourseByIdModel(req, res);

export const postCurriculumOutlineController = (req, res) => postCurriculumOutlineModel(req, res);

export const updateCourseController = (req, res) => updateCourseModel(req, res);

export const deleteCourseController = (req, res) => deleteCourseModel(req, res);

export const deleteCurriculumOutlineController = (req, res) => deleteCurriculumOutlineModel(req, res);

export const updateCurriculumOutlineController = (req, res) => updateCurriculumOutlineModel(req, res);