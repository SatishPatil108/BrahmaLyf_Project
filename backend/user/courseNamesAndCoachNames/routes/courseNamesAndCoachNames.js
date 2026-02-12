import { getCourseNamesAndCoachNamesController } from "../controller/courseNamesAndCoachNames.js";

export default (app) => {
    app.get("/apis/user/course-names-coach-names", getCourseNamesAndCoachNamesController);
};