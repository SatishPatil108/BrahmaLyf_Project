import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addCourseCurriculum,
  addCourseVideos,
  addDomain,
  addIntroVideo,
  addNewCoach,
  addNewCourse,
  addNewFAQ,
  addSubDomain,
  deleteCoach,
  deleteCourse,
  deleteDomain,
  deleteFAQ,
  deleteSubDomain,
  fetchAdminDashboardData,
  fetchAllCoaches,
  fetchAllCourses,
  fetchAllDomains,
  fetchCoachDetails,
  fetchCoaches,
  fetchCourseDetails,
  fetchFAQs,
  fetchSubDomains,
  updateCoach,
  updateCourse,
  updateDomain,
  updateFAQ,
  updateSubDomain,
  deleteCourseCurriculum,
  updateCurriculumItem,
  postMusic,
  fetchMusics,
  updateMusic,
  deleteMusic,
  fetchInquiries,
  sendReply,
}
  from "./adminApi";

export const getAdminDashboardData = createAsyncThunk(
  "admin/getDashboardData",
  async (_, thunkAPI) => {
    try {
      const response = await fetchAdminDashboardData();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

//get all Domains List
export const getAllDomains = createAsyncThunk(
  "admin/getAllDomains",
  async ({ pageNo, pageSize }, thunkAPI) => {
    try {
      const response = await fetchAllDomains(pageNo, pageSize);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch domains"
      );
    }
  }
);

// Add New Domain
export const addNewDomain = createAsyncThunk(
  "admin/addNewDomain",
  async (domainData, thunkAPI) => {
    try {
      const response = await addDomain(domainData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add new domain"
      );
    }
  }
);
// Update Domain
export const updateDomainAPI = createAsyncThunk(
  "admin/updateDomain",
  async ({ domainId, domainData }, thunkAPI) => {
    try {
      const response = await updateDomain(domainId, domainData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update domain"
      );
    }
  }
);

// Delete Domain
export const deleteDomainAPI = createAsyncThunk(
  "admin/deleteDomain",
  async (domainId, thunkAPI) => {
    try {
      await deleteDomain(domainId);
      return domainId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete domain"
      );
    }
  }
);




export const fetchAllSubDomainsAPI = createAsyncThunk(
  "subdomains/fetchAll",
  async ({ pageNo, pageSize, domainId }, { rejectWithValue }) => {
    try {
      const response = await fetchSubDomains(pageNo, pageSize, domainId);
      // return the whole response object
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add New Subdomain
export const addNewSubDomain = createAsyncThunk(
  "subdomains/addNew",
  async (subdomainData, { rejectWithValue }) => {
    try {
      const response = await addSubDomain(subdomainData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//update Subdomain
export const updateSubDomainAPI = createAsyncThunk(
  "subdomains/update",
  async ({ subdomainId, data }, { rejectWithValue }) => {
    try {
      const response = await updateSubDomain(subdomainId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


//Delete subdomain


export const deleteSubDomainAPI = createAsyncThunk(
  "admin/deleteSubDomain",
  async (subdomainId, thunkAPI) => {
    try {
      const response = await deleteSubDomain(subdomainId);
      return { subdomain_id: subdomainId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete subdomain"
      );
    }
  }
);


//fetch all coaches with pagination
export const fetchAllCoachesAPI = createAsyncThunk(
  "coaches/fetchAll",
  async ({ pageNo = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await fetchAllCoaches(pageNo, pageSize);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add New Coach
export const addNewCoachAPI = createAsyncThunk(
  "admin/coaches",
  async (coachData, thunkAPI) => {
    try {
      const response = await addNewCoach(coachData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add new coach"
      );
    }
  }
);
//update coach
export const updateCoachAPI = createAsyncThunk(
  "admin/updateCoach",
  async ({ coachId, coachData }, thunkAPI) => {
    try {
      const response = await updateCoach(coachId, coachData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update coach"
      );
    }
  }
);
//delete a coach
export const deleteCoachAPI = createAsyncThunk(
  "admin/deleteCoach",
  async (coachId, thunkAPI) => {
    try {
      await deleteCoach(coachId);
      return coachId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete coach"
      );
    }
  }
);

//fetch coach details
export const fetchCoachDetailsAPI = createAsyncThunk(
  "admin/fetchCoachDetails",
  async (coachId, thunkAPI) => {
    try {
      const response = await fetchCoachDetails(coachId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch coach details"
      );
    }
  }
);

// Fetch all courses with pagination
export const fetchAllCoursesAPI = createAsyncThunk(
  "courses/fetchAll",
  async ({ pageNo, pageSize }, { rejectWithValue }) => {
    try {
      const response = await fetchAllCourses(pageNo, pageSize);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//course details
export const fetchCourseDetailsAPI = createAsyncThunk(
  "admin/fetchCourseDetails",
  async (courseId, thunkAPI) => {
    try {
      const response = await fetchCourseDetails(courseId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch course details"
      );
    }
  }
);

// new Code
export const addNewCourseAPI = createAsyncThunk(
  "admin/addNewCourse",
  async (courseData, thunkAPI) => {
    try {
      const response = await addNewCourse(courseData);
      return response.data;
    } catch (error) {
      console.error("error: ", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add new course"
      );
    }
  }
);

//fetch coaches in dropdown
export const fetchCoachesDropdownAPI = createAsyncThunk(
  "admin/fetchCoachesDropdown",
  async (_, thunkAPI) => {
    try {
      const response = await fetchCoaches();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch coaches dropdown"
      );
    }
  }
);

//delete course
export const deleteCourseAPI = createAsyncThunk(
  "admin/deleteCourse",
  async (courseId, thunkAPI) => {
    try {
      await deleteCourse(courseId);
      return courseId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete course"
      );
    }
  }
);

// delete curriculum item
export const deleteCurriculumItemAPI = createAsyncThunk(
  "admin/deleteCurriculumItem",
  async (data, thunkAPI) => {
    const { courseId, curriculumId } = data;

    try {
      // Assuming there's an API function to delete curriculum item
      await deleteCourseCurriculum(courseId, curriculumId);
      return curriculumId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete curriculum item"
      );
    }
  }
);

//update course
export const updateCourseAPI = createAsyncThunk(
  "admin/updateCourse",
  async ({ courseId, courseData }, thunkAPI) => {
    try {
      const response = await updateCourse(courseId, courseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update course"
      );
    }
  }
);

// add curriculum item
export const addCurriculumItemAPI = createAsyncThunk(
  "admin/addCurriculumItem",
  async ({ courseId, curriculumData }, thunkAPI) => {
    try {
      const response = await addCourseCurriculum(courseId, curriculumData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add curriculum item"
      );
    }
  }
);

// update curriculum item
export const updateCurriculumItemAPI = createAsyncThunk(
  "admin/updateCurriculumItem",
  async ({ curriculumId, curriculumData }, thunkAPI) => {
    try {
      const response = await updateCurriculumItem(curriculumId, curriculumData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update curriculum item"
      );
    }
  }
);

//fetch frequently ask questions list
// fetch FAQs thunk
export const fetchFAQsAPI = createAsyncThunk(
  "admin/fetchFAQs",
  async ({ pageNo, pageSize }, thunkAPI) => {
    try {
      const response = await fetchFAQs(pageNo, pageSize);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch FAQs"
      );
    }
  }
);

//add new FAQ
export const addNewFAQAPI = createAsyncThunk(
  "admin/addNewFAQ",
  async (faqData, thunkAPI) => {
    try {
      const response = await addNewFAQ(faqData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add new FAQ"
      );
    }
  }
);

//update FAQ
export const updateFAQAPI = createAsyncThunk(
  "admin/updateFAQ",
  async ({ faqId, faqData }, thunkAPI) => {
    try {
      const response = await updateFAQ(faqId, faqData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update FAQ"
      );
    }
  }
);

//delete FAQ
export const deleteFAQAPI = createAsyncThunk(
  "admin/deleteFAQ",
  async (faqId, thunkAPI) => {
    try {
      await deleteFAQ(faqId);
      return faqId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete FAQ"
      );
    }
  }
);


// music 
// post music
export const postMusicAPI = createAsyncThunk(
  "admin/postmusic",
  async (musicData, thunkAPI) => {
    try {
      const response = await postMusic(musicData);
      return response.data;
    } catch (error) {
      console.error(error)
      return thunkAPI.rejectWithValue(
        error.response?.message || "Failed to add music"
      );
    }
  }
);

// fetch All music list
export const fetchAllMusicsAPI = createAsyncThunk(
  "admin/get/musics",
  async ({ pageNo, pageSize }, thunkAPI) => {
    try {
      const response = await fetchMusics(pageNo, pageSize);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.message || "Failed to fetch musicAudios"
      );
    }
  }
);

// update music details
export const updateMusicAPI = createAsyncThunk(
  "admin/update/music",
  async ({ musicId, musicData }, thunkAPI) => {
    try {
      const response = await updateMusic(musicId, musicData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update music"
      );
    }
  }
);

// delete music 
export const deleteMusicAPI = createAsyncThunk(
  "admin/delete/music",
  async (musicId, thunkAPI) => {
    try {
      await deleteMusic(musicId);
      return musicId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete Music"
      );
    }
  }
);

export const getInquiriesAPI = createAsyncThunk(
  "admin/getInquiries",
  async ({ pageNo, pageSize }, thunkAPI) => {
    try {
      const response = await fetchInquiries(pageNo, pageSize);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch inquiries"
      );
    }
  }
);
export const sendReplyAPI = createAsyncThunk(
  "admin/sendReply",
  async ({ inquiry_id, formData }, thunkAPI) => {
    try {
      const response = await sendReply(inquiry_id, formData);
      return response ;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send reply"
      );
    }
  }
); 