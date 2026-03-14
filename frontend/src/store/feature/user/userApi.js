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
    authRequired: false,
  });
};

// Fetch coaches  for a specific subdomain

export const fetchCoachesVideos = async (
  pageNo = 1,
  pageSize = 10,
  subdomainId,
  coachId,
) => {
  return await makeRequest({
    service: `user/coaches/videos/${pageNo}/${pageSize}/${subdomainId}/${coachId}`,
    method: API_METHODS.GET,
    authRequired: false,
  });
};

// Fetch coach details by video ID

export const fetchCoachDetails = async (videoId) => {
  return await makeRequest({
    service: `user/coaches/video/${videoId}`,
    method: API_METHODS.GET,
    authRequired: false,
  });
};

// Fetch coach profile by coach ID
export const fetchCoachProfile = async (coachId) => {
  return await makeRequest({
    service: `user/courses/coach/${coachId}`,
    method: API_METHODS.GET,
    authRequired: false,
  });
};

//Fetch course details by course ID
export const fetchCourseDetailsAPI = async (courseId) => {
  return await makeRequest({
    service: `user/courses/course/${courseId}`,
    method: API_METHODS.GET,
    authRequired: false,
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

//getall music list with pagination
export const fetchMusicList = async (pageNo = 1, pageSize = 10) => {
  return await makeRequest({
    service: `user/musics/${pageNo}/${pageSize}`,
    method: API_METHODS.GET,
    authRequired: false,
  });
};

//getall video list with pagination
export const fetchShortVideoList = async (pageNo = 1, pageSize = 10) => {
  return await makeRequest({
    service: `user/short-videos/${pageNo}/${pageSize}`,
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
  pageSize = 10,
) => {
  return await makeRequest({
    service: `user/courses/course/course-feedbacks/${pageNo}/${pageSize}/${courseId}`,
    method: API_METHODS.GET,
    authRequired: false,
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
    data: { email },
    authRequired: true,
  });
};

//add new user notes
export const postUserNotes = async (notesData) => {
  return await makeRequest({
    service: `user/notes`,
    method: API_METHODS.POST,
    authRequired: true,
    data: notesData,
    tokenType: "user",
  });
};

// update the user notes
export const updateUserNotes = async (id, notesData) => {
  return await makeRequest({
    service: `user/notes/${id}`,
    method: API_METHODS.PUT,
    data: notesData,
    authRequired: true,
    tokenType: "user",
  });
};

// delete the user notes
export const deleteUserNotes = async (noteId) => {
  return await makeRequest({
    service: `user/notes/${noteId}`,
    method: API_METHODS.DELETE,
    authRequired: true,
    tokenType: "user",
  });
};

// fetch user notes with pagination
export const fetchUserNotes = async (pageNo, pageSize) => {
  return await makeRequest({
    service: `user/fetchNotes?page=${pageNo}&page_size=${pageSize}`,
    method: API_METHODS.GET,
    authRequired: true,
    tokenType: "user",
  });
};

// fetch user progress tracking questions and options for a specific week and day
export const fetchUserProgressQuestionsAndOptions = async (courseId) => {
  return await makeRequest({
    service: `user/fetchProgressQuestionsAndOptions?courseId=${courseId}`,
    method: API_METHODS.GET,
    authRequired: true,
    tokenType: "user",
  });
};

// POST /user/progress to submit the user's answer for a progress tracking question
export const postUserProgress = async (progressData) => {
  return await makeRequest({
    service: `user/progress-tracking`,
    method: API_METHODS.POST,
    authRequired: true,
    tokenType: "user",
    data: progressData,
    contentType: "application/json",
  });
};

export const fetchUserResponse = async (courseId) => {
  return await makeRequest({
    service: `user/fetchUserResponse?courseId=${courseId}`,
    method: API_METHODS.GET,
    authRequired: true,
    tokenType: "user",
  });
};

// update the user languages
export const updateUserLanguage = async (language) => {
  return await makeRequest({
    service: `user/updateUserLanguage`,
    method: API_METHODS.PUT,
    data: language,
    authRequired: true,
    tokenType: "user",
    contentType: "application/json",
  });
};
