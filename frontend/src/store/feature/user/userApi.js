// userApi.js
import { makeRequest, API_METHODS } from "../../../api/axiosClient";

// Fetch all course categories
export const fetchCoursesCategories = async (pageNo, pageSize) => {
  return await makeRequest({
    service: `user/domains/${pageNo}/${pageSize}`,
    method: API_METHODS.GET,
    authRequired: false,
  });
};

// Fetch subcategories for a specific domain
export const fetchSubcategories = async (pageNo, pageSize, domainId) => {
  return await makeRequest({
    service: `user/subdomains/${pageNo}/${pageSize}/${domainId}`,
    method: API_METHODS.GET,
    authRequired: true,
  });
};

// Fetch coaches  for a specific subdomain

export const fetchCoachesVideos = async (
  pageNo = 1,
  pageSize = 10,
  subdomainId,
  coachId
) => {
  return await makeRequest({
    service: `user/coaches/videos/${pageNo}/${pageSize}/${subdomainId}/${coachId}`,
    method: API_METHODS.GET,
    authRequired: true,
  });
};

// Fetch coach details by video ID

export const fetchCoachDetails = async (videoId) => {
  return await makeRequest({
    service: `user/coaches/video/${videoId}`,
    method: API_METHODS.GET,
    authRequired: true,
  });
};

// Fetch coach profile by coach ID
export const fetchCoachProfile = async (coachId) => {
  return await makeRequest({
    service: `user/courses/coach/${coachId}`,
    method: API_METHODS.GET,
    authRequired: true,
  });
};

//Fetch course details by course ID
export const fetchCourseDetailsAPI = async (courseId) => {
  return await makeRequest({
    service: `user/courses/course/${courseId}`,
    method: API_METHODS.GET,
    authRequired: true,
  });
};

//Fetch all coaches
export const fetchAllCoaches = async (pageNo, pageSize) => {
  return await makeRequest({
    service: `user/courses/coaches/${pageNo}/${pageSize}`,
    method: API_METHODS.GET,
    authRequired: false,
  });
};

// Enroll in a course
export const enrollInCourseAPIById = async (courseId) => {
  return await makeRequest({
    service: `user/courses/course/enrollment`,
    method: API_METHODS.POST,
    authRequired: true,
    data: { course_id: courseId },
  });
};

// This function fetches the courses that the user is enrolled in
export const fetchMyCourses = async (pageNo, pageSize) => {
  return await makeRequest({
    service: `user/courses/course/my-courses/${pageNo}/${pageSize}`,
    method: API_METHODS.GET,
    authRequired: true,
  });
};

//enrolled course details
export const fetchEnrolledCourseDetails = async (courseId) => {
  return await makeRequest({
    service: `user/coaches/my-course-videos/${courseId}`,
    method: API_METHODS.GET,
    authRequired: true,
  });
};
export const fetchModuleDetails = async (moduleId) => {
  return await makeRequest({
    service: `user/coaches/my-course-module/${moduleId}`,
    method: API_METHODS.GET,
    authRequired: true,
  });
};

//get user dashboard data
export const fetchDashboardData = async () => {
  return await makeRequest({
    service: "user/dashboard",
    method: API_METHODS.GET,
    authRequired: false,
  });
};

//get frequently asked questions with pagination
export const fetchFAQList = async (pageNo = 1, pageSize = 10) => {
  return await makeRequest({
    service: `user/faq/${pageNo}/${pageSize}`,
    method: API_METHODS.GET,
    authRequired: false,
  });
};

//getall musiclist with pagination
export const fetchMusicList = async (pageNo = 1, pageSize = 10) => {
  return await makeRequest({
    service: `user/musics/${pageNo}/${pageSize}`,
    method: API_METHODS.GET,
    authRequired: false,
  });
};

//get all courses feedback with pagination
export const fetchAllCourseFeedback = async (pageNo = 1, pageSize = 10) => {
  return await makeRequest({
    service: `user/courses/course/all-courses-feedbacks/${pageNo}/${pageSize}`,
    method: API_METHODS.GET,
    authRequired: false,
  });
};

//get course feedback by course ID with pagination
export const fetchCourseFeedback = async (
  courseId,
  pageNo = 1,
  pageSize = 10
) => {
  return await makeRequest({
    service: `user/courses/course/course-feedbacks/${pageNo}/${pageSize}/${courseId}`,
    method: API_METHODS.GET,
    authRequired: true,
  });
};

//post feedback for a course
export const postCourseFeedback = async (feedbackData) => {
  return await makeRequest({
    service: `user/courses/course/course-feedback`,
    method: API_METHODS.POST,
    authRequired: true,
    data: feedbackData,
  });
};

//search courses by keyword
export const search = async (searchStr) => {
  return await makeRequest({
    service: `user/search/${searchStr}`,
    method: API_METHODS.GET,
    authRequired: true,
  });
};

//search courses by keyword
export const postContact = async (contactMsg) => {
  return await makeRequest({
    service: `user/contact`,
    method: API_METHODS.POST,
    data: contactMsg,
    authRequired: true,
  });
};
export const subscribeToNewsletter = async (email) => {
  console.log(email);
  return await makeRequest({
    service: `user/subscribeToNewsletter`,
    method: API_METHODS.POST,
    data: {email},
    authRequired: true,
  });
};
