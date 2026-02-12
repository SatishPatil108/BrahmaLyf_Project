// userThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as userAPI from "./userApi";

// Fetch all course categories 
export const fetchCoursesCategoriesAPI = createAsyncThunk(
  "user/fetchCoursesCategories",
  async ({ pageNo, pageSize }, thunkAPI) => {
    try {
      const response = await userAPI.fetchCoursesCategories(pageNo, pageSize);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch subcategories for a specific domain
export const fetchSubdomainsDetailsAPI = createAsyncThunk(
  "user/fetchSubcategories",
  async ({ domainId, pageNo, pageSize }, thunkAPI) => {
    try {
      const response = await userAPI.fetchSubcategories(pageNo, pageSize, domainId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch coaches videos
export const fetchCoachesVideosAPI = createAsyncThunk(
  "user/fetchCoachesVideos",
  async ({ pageNo = 1, pageSize = 10, subdomainId, coachId }, thunkAPI) => {
    try {
      const response = await userAPI.fetchCoachesVideos(pageNo, pageSize, subdomainId, coachId);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch coach details by video ID
export const fetchCoachDetailsAPI = createAsyncThunk(
  "user/fetchCoachDetails",
  async (videoId, thunkAPI) => {
    try {
      const response = await userAPI.fetchCoachDetails(videoId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch coach profile by coach ID
export const fetchCoachProfileAPI = createAsyncThunk(
  "user/fetchCoachProfile",
  async (coachId, thunkAPI) => {
    try {
      const response = await userAPI.fetchCoachProfile(coachId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch course details by course ID
export const fetchCourseDetailsById = createAsyncThunk(
  "user/fetchCourseDetails",
  async (courseId, thunkAPI) => {
    try {
      const response = await userAPI.fetchCourseDetailsAPI(courseId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch all coaches
export const fetchAllCoachesAPI = createAsyncThunk(
  "user/fetchAllCoaches",
  async ({ pageNo = 1, pageSize = 10 }, thunkAPI) => {
    try {
      const response = await userAPI.fetchAllCoaches(pageNo, pageSize);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Enroll in a course
export const enrollInCourseAPI = createAsyncThunk(
  "user/enrollInCourse",
  async (courseId, thunkAPI) => {
    try {
      const response = await userAPI.enrollInCourseAPIById(courseId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch enrolled courses
export const fetchMyCoursesAPI = createAsyncThunk(
  "user/fetchMyCourses",
  async ({ pageNo, pageSize }, thunkAPI) => {
    try {
      const response = await userAPI.fetchMyCourses(pageNo, pageSize);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch enrolled course details
export const fetchEnrolledCourseDetailsAPI = createAsyncThunk(
  "user/fetchEnrolledCourseDetails",
  async (courseId, thunkAPI) => {
    try {
      const response = await userAPI.fetchEnrolledCourseDetails(courseId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Fetch enrolled course details
export const fetchModuleDetailsAPI = createAsyncThunk(
  "user/fetchModuleDetails",
  async (moduleId, thunkAPI) => {
    try {
      const response = await userAPI.fetchModuleDetails(moduleId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//get user dashboard data
export const fetchUserDashboardDataAPI = createAsyncThunk(
  "user/fetchUserDashboardData",
  async (_, thunkAPI) => {
    try {
      const response = await userAPI.fetchDashboardData();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
//get frequently asked questions with pagination
export const fetchFAQsAPI = createAsyncThunk(
  "user/fetchFAQs",
  async ({ pageNo = 1, pageSize = 10 }, thunkAPI) => {
    try {
      const response = await userAPI.fetchFAQList(pageNo, pageSize);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//get all courses feedback with pagination
export const fetchAllCoursesFeedbackAPI = createAsyncThunk(
  "user/fetchAllCoursesFeedback",
  async ({ pageNo = 1, pageSize = 10 }, thunkAPI) => {
    try {
      const response = await userAPI.fetchAllCourseFeedback(pageNo, pageSize);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//get course feedback by course ID with pagination
export const fetchCourseFeedbackById = createAsyncThunk(
  "user/fetchCourseFeedback",
  async ({ courseId, pageNo = 1, pageSize = 10 }, thunkAPI) => {
    try {
      const response = await userAPI.fetchCourseFeedback(courseId, pageNo, pageSize);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//post course feedback
export const postCourseFeedbackAPI = createAsyncThunk(
  "user/postCourseFeedback",
  async (feedbackData, thunkAPI) => {
    try {
      const response = await userAPI.postCourseFeedback(feedbackData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// fetch all musics
export const fetchMusicListAPI = createAsyncThunk('user/fetchMusicList',
  async ({ pageNo = 1, pageSize = 10 }, thunkAPI) => {
    try {
      const response = await userAPI.fetchMusicList(pageNo, pageSize);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// search
export const searchAPI = createAsyncThunk('user/search',
  async (searchStr, thunkAPI) => {
    try {
      const response = await userAPI.search(searchStr);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
)

// Contact
export const contactAPI = createAsyncThunk('user/contact',
  async (contactMsg, thunkAPI) => {
    try {
      const response = await userAPI.postContact(contactMsg);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
)
export const subscribeToNewsletterAPI = createAsyncThunk('user/subscribeToNewsletter',
  async (email, thunkAPI) => {
    try {
      const response = await userAPI.subscribeToNewsletter(email);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
)




