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
  },
);

// Fetch subcategories for a specific domain
export const fetchSubdomainsDetailsAPI = createAsyncThunk(
  "user/fetchSubcategories",
  async ({ domainId, pageNo, pageSize }, thunkAPI) => {
    try {
      const response = await userAPI.fetchSubcategories(
        pageNo,
        pageSize,
        domainId,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Fetch coaches videos
export const fetchCoachesVideosAPI = createAsyncThunk(
  "user/fetchCoachesVideos",
  async ({ pageNo = 1, pageSize = 10, subdomainId, coachId }, thunkAPI) => {
    try {
      const response = await userAPI.fetchCoachesVideos(
        pageNo,
        pageSize,
        subdomainId,
        coachId,
      );
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
);

//get course feedback by course ID with pagination
export const fetchCourseFeedbackById = createAsyncThunk(
  "user/fetchCourseFeedback",
  async ({ courseId, pageNo = 1, pageSize = 10 }, thunkAPI) => {
    try {
      const response = await userAPI.fetchCourseFeedback(
        courseId,
        pageNo,
        pageSize,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
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
  },
);

// fetch all musics
export const fetchMusicListAPI = createAsyncThunk(
  "user/fetchMusicList",
  async ({ pageNo = 1, pageSize = 10 } = {}, thunkAPI) => {
    try {
      const response = await userAPI.fetchMusicList(pageNo, pageSize);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// fetch all short videos
export const fetchShortVideoListAPI = createAsyncThunk(
  "user/fetchShortVideoList",
  async ({ pageNo = 1, pageSize = 10 } = {}, thunkAPI) => {
    try {
      const response = await userAPI.fetchShortVideoList(pageNo, pageSize);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// search
export const searchAPI = createAsyncThunk(
  "user/search",
  async (searchStr, thunkAPI) => {
    try {
      const response = await userAPI.search(searchStr);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Contact
export const contactAPI = createAsyncThunk(
  "user/contact",
  async (contactMsg, thunkAPI) => {
    try {
      const response = await userAPI.postContact(contactMsg);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const subscribeToNewsletterAPI = createAsyncThunk(
  "user/subscribeToNewsletter",
  async (email, thunkAPI) => {
    try {
      const response = await userAPI.subscribeToNewsletter(email);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// fetch user notes thunk
export const fetchUserNotesAPI = createAsyncThunk(
  "user/fetchNotes",
  async ({ pageNo, pageSize }, thunkAPI) => {
    try {
      const response = await userAPI.fetchUserNotes(pageNo, pageSize);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch User Notes",
      );
    }
  },
);
// add new user notes
export const postUserNotesAPI = createAsyncThunk(
  "user/addUserNotes",
  async (notesData, thunkAPI) => {
    try {
      const response = await userAPI.postUserNotes(notesData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add new User notes",
      );
    }
  },
);

//update user notes
export const updateUserNotesAPI = createAsyncThunk(
  "user/updateUserNotes",
  async ({ noteId, notesData }, thunkAPI) => {
    try {
      const response = await userAPI.updateUserNotes(noteId, notesData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update user notes",
      );
    }
  },
);

//delete a user notes
export const deleteUserNotesAPI = createAsyncThunk(
  "user/deleteUserNotes",
  async (noteId, thunkAPI) => {
    try {
      await userAPI.deleteUserNotes(noteId);
      return noteId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete user notes",
      );
    }
  },
);

// fetch user progress tracking questions and options for a specific week and day
export const fetchUserProgressQuestionsAndOptionsAPI = createAsyncThunk(
  "user/fetchProgressQuestionsAndOptions",
  async ({ courseId }, thunkAPI) => {
    try {
      const response =
        await userAPI.fetchUserProgressQuestionsAndOptions(courseId);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch user progress tracking questions and options",
      );
    }
  },
);

// post user progress tracking answers
export const postUserProgressAPI = createAsyncThunk(
  "user/postUserProgress",
  async (progressData, thunkAPI) => {
    try {
      const response = await userAPI.postUserProgress(progressData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to post user progress tracking answers",
      );
    }
  },
);

// fetch user progress tracking questions and options for a specific week and day
export const fetchUserResponseAPI = createAsyncThunk(
  "user/fetchUserResponse",
  async ({ courseId }, thunkAPI) => {
    try {
      const response = await userAPI.fetchUserResponse(courseId);

      return {
        ...response.data,
        courseId,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user response",
      );
    }
  },
);

//update user language
export const updateUserLanguageAPI = createAsyncThunk(
  "user/updateUserLanguage",
  async (language, thunkAPI) => {
    try {
      const response = await userAPI.updateUserLanguage(language);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update user Language",
      );
    }
  },
);

export const fetchUserToolsQuestionsAPI = createAsyncThunk(
  "user/fetchProgressToolsQuestions",
  async ({ courseId }, thunkAPI) => {
    try {
      const response = await userAPI.fetchUserToolsQuestions(courseId);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch user progress tools questions",
      );
    }
  },
);

// post user progress tools answers
export const postUserToolsProgressAPI = createAsyncThunk(
  "user/postUserToolsProgress",
  async (toolsData, thunkAPI) => {
    try {
      const response = await userAPI.postUserToolsProgress(toolsData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to post user progress tools answers",
      );
    }
  },
);

// fetch user progress tools
export const fetchUserToolsResponseAPI = createAsyncThunk(
  "user/fetchUserToolsResponse",
  async ({ courseId }, thunkAPI) => {
    try {
      const response = await userAPI.fetchUserToolsResponse(courseId);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user tools response",
      );
    }
  },
);

// update user progress tools response
export const updateUserToolsResponseAPI = createAsyncThunk(
  "user/updateUserTools",
  async ({ questionId, toolsData }, thunkAPI) => {
    try {
      const response = await userAPI.updateUserToolsResponse(
        questionId,
        toolsData,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update user tools data",
      );
    }
  },
);

// fetch user progress tracking tasks questions and options for a specific week
export const fetchUserTaskQuestionsAPI = createAsyncThunk(
  "user/fetchUserTasksWeekQuestions",
  async ({ courseId, weekNo }, thunkAPI) => {
    try {
      const response = await userAPI.fetchUserTasksWeekQuestions(
        courseId,
        weekNo,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch user progress tracking questions and options",
      );
    }
  },
);

// fetch user progress tracking tools questions and options for a specific week
export const fetchUserToolQuestionsAPI = createAsyncThunk(
  "user/fetchUserToolsWeekQuestions",
  async ({ courseId, weekNo }, thunkAPI) => {
    try {
      const response = await userAPI.fetchUserToolsWeekQuestions(
        courseId,
        weekNo,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch user progress tracking questions and options",
      );
    }
  },
);

export const fetchUserCompletedMessageAPI = createAsyncThunk(
  "user/fetchUserCompletedMessage",
  async ({ courseId, weekNo, dayNo }, thunkAPI) => {
    try {
      const response = await userAPI.fetchUserCompletedMessage(
        courseId,
        weekNo,
        dayNo,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch user completed message",
      );
    }
  },
);

export const fetchUserProgressThemesAPI = createAsyncThunk(
  "user/fetchUserProgressThemes",
  async ({ courseId, weekNo }, thunkAPI) => {
    try {
      const response = await userAPI.fetchProgressPracticeThemes(
        courseId,
        weekNo,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch user progress theme details",
      );
    }
  },
);
