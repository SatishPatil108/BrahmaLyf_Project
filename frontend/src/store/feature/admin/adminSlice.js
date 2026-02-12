import { createSlice } from "@reduxjs/toolkit";
import {
  addNewDomain,
  getAdminDashboardData,
  getAllDomains,
  updateDomainAPI,
  deleteDomainAPI,
  fetchAllSubDomainsAPI,
  addNewSubDomain,
  updateSubDomainAPI,
  deleteSubDomainAPI,
  fetchAllCoachesAPI,
  addNewCoachAPI,
  updateCoachAPI,
  deleteCoachAPI,
  fetchCoachDetailsAPI,
  fetchAllCoursesAPI,
  fetchCourseDetailsAPI,
  addNewCourseAPI,
  fetchCoachesDropdownAPI,
  deleteCourseAPI,
  updateCourseAPI,
  fetchFAQsAPI,
  addNewFAQAPI,
  updateFAQAPI,
  deleteFAQAPI,
  addCurriculumItemAPI,
  updateCurriculumItemAPI,
  deleteCurriculumItemAPI,
  fetchAllMusicsAPI,
  postMusicAPI,
  updateMusicAPI,
  deleteMusicAPI,
  getInquiriesAPI,
} from "./adminThunk";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dashboardData: null,
    domainsDetails: { domains: [] },
    subdomainsDetails: { subdomains: [] },
    coachesDetails: { coaches: [] },
    coursesDetails: { courses: [] },
    faqsDetails: { faqs: [] },
    audiosDetails: { audios: [] },
    inquiriesDetails: { inquiries: [] },
    coachesList: [],
    courseDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(getAdminDashboardData.fulfilled, (state, action) => {
        state.dashboardData = action.payload;
      })

      // Domains
      .addCase(getAllDomains.fulfilled, (state, action) => {
        state.domainsDetails = action.payload || [];
      })
      .addCase(addNewDomain.fulfilled, (state, action) => {
        state.domainsDetails.domains.push(action.payload);
      })
      .addCase(updateDomainAPI.fulfilled, (state, action) => {
        const index = state.domainsDetails.domains.findIndex((d) => d.domain_id == action.payload.domain_id);
        if (index !== -1) state.domainsDetails.domains[index] = action.payload;
      })
      .addCase(deleteDomainAPI.fulfilled, (state, action) => {
        state.domainsDetails.domains = state.domainsDetails.domains.filter((d) => d.id !== action.payload.id);
      })

      // Subdomains
      .addCase(fetchAllSubDomainsAPI.fulfilled, (state, action) => {
        state.subdomainsDetails = action.payload || [];
      })
      .addCase(addNewSubDomain.fulfilled, (state, action) => {
        state.subdomainsDetails.subdomains.push(action.payload);
      })
      .addCase(updateSubDomainAPI.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        const index = state.subdomainsDetails.subdomains.findIndex(
          (s) => s.subdomain_id === updated.subdomain_id
        );
        if (index !== -1) state.subdomainsDetails.subdomains[index] = updated;
      })
      .addCase(deleteSubDomainAPI.fulfilled, (state, action) => {
        state.subdomainsDetails.subdomains = state.subdomainsDetails.subdomains.filter(
          (s) => s.subdomain_id !== action.payload.subdomain_id
        );
      })

      // Coaches
      .addCase(fetchAllCoachesAPI.fulfilled, (state, action) => {
        state.coachesDetails = action.payload || {};
      })
      .addCase(addNewCoachAPI.fulfilled, (state, action) => {
        state.coachesDetails.coaches.push({ coach_id: action.payload.id, ...action.payload });
      })
      .addCase(updateCoachAPI.fulfilled, (state, action) => {
        const index = state.coachesDetails.coaches.findIndex(
          (c) => c.coach_id === action.payload.id
        );
        if (index !== -1)
          state.coachesDetails.coaches[index] = { coach_id: action.payload.id, ...action.payload };
      })
      .addCase(deleteCoachAPI.fulfilled, (state, action) => {
        state.coachesDetails.coaches = state.coachesDetails.coaches.filter((c) => c.coach_id !== action.payload);
      })
      .addCase(fetchCoachDetailsAPI.fulfilled, (state, action) => {
        const index = state.coachesDetails.coaches.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.coachesDetails.coaches[index] = action.payload;
        else state.coachesDetails.coaches.push(action.payload);
      })

      // Courses
      .addCase(fetchAllCoursesAPI.fulfilled, (state, action) => {
        state.coursesDetails = action.payload || [];
      })
      .addCase(fetchCourseDetailsAPI.fulfilled, (state, action) => {
        state.courseDetails = action.payload;
      })
      .addCase(addNewCourseAPI.fulfilled, (state, action) => {
        state.coursesDetails.courses.unshift(action.payload);
        state.coursesDetails.courses.pop();
      })
      .addCase(fetchCoachesDropdownAPI.fulfilled, (state, action) => {
        state.coachesList = action.payload || [];
      })
      .addCase(deleteCourseAPI.fulfilled, (state, action) => {
        state.coursesDetails.courses = state.coursesDetails.courses.filter((c) => c.id !== action.payload.id);
      })
      .addCase(updateCourseAPI.fulfilled, (state, action) => {
        state.courseDetails = {
          ...state.courseDetails,
          course_id: action.payload.course.id,
          ...action.payload.course,
          intro_video: action.payload.video,
        };
      })

      // FAQs
      .addCase(fetchFAQsAPI.fulfilled, (state, action) => {
        state.faqsDetails = action.payload || [];
      })
      .addCase(addNewFAQAPI.fulfilled, (state, action) => {
        state.faqsDetails.faqs.push(action.payload);
      })
      .addCase(updateFAQAPI.fulfilled, (state, action) => {
        const index = state.faqsDetails.faqs.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) state.faqsDetails.faqs[index] = action.payload;
      })
      .addCase(deleteFAQAPI.fulfilled, (state, action) => {
        state.faqsDetails.faqs = state.faqsDetails.faqs.filter((f) => f.id !== action.payload.id);
      })

      // Curriculum
      .addCase(addCurriculumItemAPI.fulfilled, (state, action) => {
        state.courseDetails.curriculum_outline.push(action.payload.curriculum);
        state.courseDetails.videos.push(action.payload.video);
      })
      .addCase(updateCurriculumItemAPI.fulfilled, (state, action) => {
        const { curriculum, video } = action.payload;
        state.courseDetails.curriculum_outline = state.courseDetails.curriculum_outline.map((item) =>
          item.id === curriculum.id ? curriculum : item
        );
        state.courseDetails.videos = state.courseDetails.videos.map((v) =>
          v.id === video.id ? video : v
        );
      })
      .addCase(deleteCurriculumItemAPI.fulfilled, (state, action) => {
        const id = action.payload;
        if (state.courseDetails) {
          state.courseDetails.curriculum_outline = state.courseDetails.curriculum_outline.filter(
            (item) => item.id !== id
          );
          state.courseDetails.videos = state.courseDetails.videos.filter(
            (video) => video.curriculum_outline_id !== id
          );
        }
      })


      // meditation music 
      .addCase(postMusicAPI.fulfilled, (state, action) => {
        state.audiosDetails.audios.unshift(action.payload);
      })
      .addCase(fetchAllMusicsAPI.fulfilled, (state, action) => {
        state.audiosDetails = action.payload;
      })
      .addCase(updateMusicAPI.fulfilled, (state, action) => {
        state.audiosDetails.audios = state.audiosDetails.audios.map((music) => {
          if (music.id == action.payload.music_id)
            music = { id: action.payload.music_id, ...action.payload }
          return music
        })
      })

      .addCase(deleteMusicAPI.fulfilled, (state, action) => {
        state.audiosDetails.audios = state.audiosDetails.audios.filter((m) => m.id !== action.payload.id);
      })
      .addCase(getInquiriesAPI.fulfilled, (state, action) => {
        state.inquiriesDetails = action.payload || [];
      })
      // ✅ Global matchers
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          console.error("Error: ", action);
          state.error = action.payload || "Something went wrong";
        }
      );
  },
});
export const {
  clearAdminError
} = adminSlice.actions;
export default adminSlice.reducer;