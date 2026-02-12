// import verifyUserToken from "../../middleware/verifyUserToken.js";
import {
    getCoursesController,
} from "../controller/searchCourse.js";

export default (app) => {
    app.get("/apis/user/search/:query", getCoursesController);
};