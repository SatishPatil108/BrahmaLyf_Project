import { 
	getCourseByIdModel,
	enrollInCourseModel,
	getMyCoursesModel,
	courseFeedbackModel,
	getCourseFeedbacksByCourseIdModel,
	getCourseFeedbacksModel,
	searchCourseModel
} from "../model/course.js";

export const getCourseByIdController = getCourseByIdModel;

export const enrollInCourseController = enrollInCourseModel;

export const getMyCoursesController = getMyCoursesModel;

export const courseFeedbackController = courseFeedbackModel;

export const getCourseFeedbacksByCourseIdController = getCourseFeedbacksByCourseIdModel;

export const getCourseFeedbacksController = getCourseFeedbacksModel;

export const searchCourseController = searchCourseModel;