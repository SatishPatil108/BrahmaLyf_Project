import verifyAdminToken from "../../../middleware/verifyAdminToken.js";
import {
	postCourseController,
	getAllCoursesController,
	getCourseByIdController,
	postCurriculumOutlineController,
	updateCourseController,
	deleteCourseController,
	deleteCurriculumOutlineController,
	updateCurriculumOutlineController
} from "../controller/course.js";
import {
	postCourseValidator,
	postCurriculumOutlineValidator,
	updateCourseValidator,
	updateCurriculumOutlineValidator
} from "../middlewares/course.js";
import universalUpload from "../../../../middleware/universalUpload.js";

export default (app) => {
	app.post(
		"/apis/admin/coaches/course",
		verifyAdminToken,
		universalUpload.any(),
		postCourseValidator,
		postCourseController
	);

	app.put(
		"/apis/admin/coaches/course/:courseId",
		verifyAdminToken,
		universalUpload.single("thumbnail_file"),
		updateCourseValidator,
		updateCourseController
	);

	app.get(
		"/apis/admin/coaches/courses/:pageNo/:pageSize",
		verifyAdminToken,
		getAllCoursesController
	);

	app.get(
		"/apis/admin/coaches/course/:courseId",
		verifyAdminToken,
		getCourseByIdController
	);

	app.delete(
		"/apis/admin/coaches/course/:courseId",
		verifyAdminToken,
		deleteCourseController
	);

	app.post(
		"/apis/admin/coaches/course/curriculum_outline/:courseId",
		verifyAdminToken,
		universalUpload.single("thumbnail_file"),
		postCurriculumOutlineValidator,
		postCurriculumOutlineController
	);

	app.put(
		"/apis/admin/coaches/course/curriculum_outline/:curriculumId",
		verifyAdminToken,
		universalUpload.single("thumbnail_file"),
		updateCurriculumOutlineValidator,
		updateCurriculumOutlineController
	);

	app.delete(
		"/apis/admin/coaches/course/curriculum_outline/:courseId/:curriculumId",
		verifyAdminToken,
		deleteCurriculumOutlineController
	);
};
