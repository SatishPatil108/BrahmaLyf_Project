import verifyUserToken from "../../../middleware/verifyUserToken.js";
import { 
    getCourseByIdController, 
    enrollInCourseController, 
    getMyCoursesController, 
    courseFeedbackController, 
    getCourseFeedbacksByCourseIdController, 
    getCourseFeedbacksController, 
    searchCourseController 
} from "../controller/course.js";
import { 
    enrollInCourseValidator,
    courseFeedbackValidator 
} from "../middleware/course.js";

export default (app) => {
    app.post(
        "/apis/user/courses/course/enrollment",
        verifyUserToken,
        enrollInCourseValidator,
        enrollInCourseController
    );

    app.post(
        "/apis/user/courses/course/course-feedback",
        verifyUserToken,
        courseFeedbackValidator,
        courseFeedbackController
    );

    app.get(
        "/apis/user/courses/course/:courseId",
        getCourseByIdController
    );

    app.get(
        "/apis/user/courses/course/my-courses/:pageNo/:pageSize",
        verifyUserToken,
        getMyCoursesController
    );

    app.get(
        "/apis/user/courses/course/course-feedbacks/:pageNo/:pageSize/:courseId",
        getCourseFeedbacksByCourseIdController
    );

    app.get(
        "/apis/user/courses/course/all-courses-feedbacks/:pageNo/:pageSize",
        getCourseFeedbacksController
    );

    app.get(
        "/apis/user/courses/course/search/:courseName/:coachName/:pageNo/:pageSize",
        searchCourseController
    );
};
