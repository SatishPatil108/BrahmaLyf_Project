// src/store/feature/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCoursesCategoriesAPI,
  fetchSubdomainsDetailsAPI,
  fetchCoachesVideosAPI,
  fetchCoachDetailsAPI,
  fetchCoachProfileAPI,
  fetchCourseDetailsById,
  enrollInCourseAPI,
  fetchMyCoursesAPI,
  fetchEnrolledCourseDetailsAPI,
  fetchUserDashboardDataAPI,
  fetchFAQsAPI,
  fetchAllCoursesFeedbackAPI,
  fetchCourseFeedbackById,
  postCourseFeedbackAPI,
  fetchAllCoachesAPI,
  fetchMusicListAPI,
  searchAPI,
  fetchModuleDetailsAPI,
  fetchShortVideoListAPI,
  fetchUserNotesAPI,
  postUserNotesAPI,
  updateUserNotesAPI,
  deleteUserNotesAPI,
  fetchUserProgressQuestionsAndOptionsAPI,
  postUserProgressAPI,
  fetchUserResponseAPI,
  updateUserLanguageAPI,
} from "./userThunk";

const initialState = {
  language: "en",
  isLoading: false,
  isSpin: false,
  error: {
    dailyShort: null,
    message: null,
    details: null,
  },
  domainsDetails: { domains: [] },
  subdomainsDetails: {},
  videosDetails: { videos: [] },
  coachDetails: null,
  coachProfile: null,
  courseDetails: null,
  coachesDetails: { coaches: [] },
  myCoursesDetails: { courses: [] },
  dashboardData: {
    total_courses: 0,
    total_coaches: 0,
    total_users: 0,
    total_videos: 0,
    video_thumbnails: [],
    coaches: [],
  },
  enrolledCourseDetails: null,
  FAQsDetails: { faqs: [] },
  musicsDetails: {},
  shortVideosDetails: {},
  searchDetails: {},
  allCoursesFeedback: [],
  userNotesDetails: { notes: [] },
  courses: [],
  moduleDetails: null,

  userProgressDetails: {
    lastSubmittedDate: null,
    alreadySubmitted: false,
    loading: false,
    error: null,
    weekNo: 1,
    currentDayIndex: 0,
    submittedQuestions: {},
    submittedAnswers: {},
    completedDays: {},
    userResponse: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearSubcategories: (state) => {
      state.subdomainsDetails = {};
    },
    resetCoachesVideos: (state) => {
      state.videosDetails.videos = [];
      state.error = null;
      state.isLoading = false;
    },
    clearEnrolledCourseDetails: (state) => {
      state.enrolledCourseDetails = null;
      state.moduleDetails = null;
    },
    resetUserProgress: (state) => {
      state.userProgressDetails = {
        lastSubmittedDate: null,
        alreadySubmitted: false,
        loading: false,
        error: null,
        weekNo: 1,
        currentDayIndex: 0,
        submittedQuestions: {},
        submittedAnswers: {},
        completedDays: {},
        userResponse: null,
      };
    },

    resetUserLanguage: (state) => {
      state.language = "en";
    },

    // set the language
    setLanguage: (state, action) => {
      state.language = action.payload || "en";
    },

    // ✅ Mark a single question as submitted
    markQuestionSubmitted: (state, action) => {
      const { questionId } = action.payload;
      state.userProgressDetails.submittedQuestions[questionId] = true;
    },
    // ✅ Mark a full day as completed
    markDayCompleted: (state, action) => {
      const { dayNo } = action.payload;
      state.userProgressDetails.completedDays[dayNo] = true;
    },

    // ✅ Move to next day
    setCurrentDayIndex: (state, action) => {
      state.userProgressDetails.currentDayIndex = action.payload;
    },

    // ✅ Mark all as submitted (alreadySubmitted from API)
    setAlreadySubmitted: (state, action) => {
      state.userProgressDetails.alreadySubmitted = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesCategoriesAPI.fulfilled, (state, action) => {
        const res = action.payload;
        state.domainsDetails = res?.data || [];
      })

      .addCase(fetchSubdomainsDetailsAPI.fulfilled, (state, action) => {
        const res = action.payload;
        const domainId = res?.data?.subdomains?.[0]?.domain_id;
        state.subdomainsDetails[domainId] = res?.data || [];
      })

      .addCase(fetchCoachesVideosAPI.fulfilled, (state, action) => {
        state.videosDetails = action.payload;
      })

      .addCase(fetchCoachDetailsAPI.fulfilled, (state, action) => {
        state.coachDetails = action.payload?.data || null;
      })

      .addCase(fetchCoachProfileAPI.fulfilled, (state, action) => {
        state.coachProfile = action.payload;
      })

      .addCase(fetchCourseDetailsById.fulfilled, (state, action) => {
        state.courseDetails = action.payload?.data || null;
      })

      .addCase(fetchAllCoachesAPI.fulfilled, (state, action) => {
        state.coachesDetails = action.payload;
      })

      .addCase(fetchMyCoursesAPI.fulfilled, (state, action) => {
        state.myCoursesDetails = action.payload;
      })

      .addCase(fetchEnrolledCourseDetailsAPI.fulfilled, (state, action) => {
        state.enrolledCourseDetails = action.payload;
      })

      .addCase(fetchModuleDetailsAPI.fulfilled, (state, action) => {
        state.moduleDetails = action.payload;
      })

      .addCase(fetchUserDashboardDataAPI.fulfilled, (state, action) => {
        state.dashboardData = action.payload?.data || null;
      })

      .addCase(fetchFAQsAPI.fulfilled, (state, action) => {
        state.FAQsDetails = action.payload;
      })

      .addCase(fetchMusicListAPI.fulfilled, (state, action) => {
        state.musicsDetails = action.payload;
      })

      .addCase(fetchShortVideoListAPI.fulfilled, (state, action) => {
        state.shortVideosDetails = action.payload;
      })

      .addCase(fetchAllCoursesFeedbackAPI.fulfilled, (state, action) => {
        state.allCoursesFeedback = action.payload?.data || [];
      })

      .addCase(fetchCourseFeedbackById.fulfilled, (state, action) => {
        const res = action.payload;
        const feedbacks = res?.data?.data || res?.data || [];
        state.allCoursesFeedback = feedbacks;
      })

      .addCase(postCourseFeedbackAPI.fulfilled, (state, action) => {
        const res = action.payload;
        if (res?.response_code === 1 && res?.data) {
          state.allCoursesFeedback = [
            res.data,
            ...(state.allCoursesFeedback || []),
          ];
        }
      })

      // update user language
      .addCase(updateUserLanguageAPI.fulfilled, (state, action) => {
        state.language = action.payload?.language;
      })

      .addCase(searchAPI.pending, (state) => {
        state.isSpin = true;
      })
      .addCase(searchAPI.fulfilled, (state, action) => {
        state.searchDetails = action.payload;
        state.isSpin = false;
      })
      .addCase(searchAPI.rejected, (state, action) => {
        state.isSpin = false;
      })

      // fetch user progress questions
      .addCase(fetchUserProgressQuestionsAndOptionsAPI.pending, (state) => {
        if (!state.userProgressDetails.alreadySubmitted) {
          state.userProgressDetails.loading = true;
          state.userProgressDetails.error = null;
        }
      })

      .addCase(
        fetchUserProgressQuestionsAndOptionsAPI.fulfilled,
        (state, action) => {
          const payload = action.payload;
          state.userProgressDetails.loading = false;

          if (payload?.alreadySubmitted) {
            // ✅ Consistent with hook's .unwrap() check
            state.userProgressDetails.alreadySubmitted = true;
            state.userProgressDetails.lastSubmittedDate =
              payload?.timestamp || new Date().toISOString();
          } else {
            state.userProgressDetails.alreadySubmitted = false;
            state.userProgressDetails.dayNo = payload?.day_no || 1;

            // ✅ Fix: was payload?.weekNo — API returns week_no (snake_case)
            state.userProgressDetails.weekNo =
              payload?.week_no || state.userProgressDetails.weekNo;
          }
        },
      )

      .addCase(
        fetchUserProgressQuestionsAndOptionsAPI.rejected,
        (state, action) => {
          state.userProgressDetails.loading = false;
          state.userProgressDetails.error = action.error.message;
        },
      )

      .addCase(fetchUserResponseAPI.fulfilled, (state, action) => {
        const submissions = action.payload?.submission ?? [];

        if (!submissions.length) return;

        const normalizedAnswers = {};
        const submittedQuestions = {};

        submissions.forEach((submission) => {
          const { day_no, answers } = submission;

          if (!normalizedAnswers[day_no]) {
            normalizedAnswers[day_no] = {};
          }

          answers.forEach(
            ({ questionId, optionId, multipleAnswers, textAnswer }) => {
              if (optionId !== undefined) {
                normalizedAnswers[day_no][questionId] = optionId;
              } else if (multipleAnswers !== undefined) {
                normalizedAnswers[day_no][questionId] = multipleAnswers;
              } else if (textAnswer !== undefined) {
                normalizedAnswers[day_no][questionId] = textAnswer;
              }

              submittedQuestions[questionId] = true;
            },
          );
        });

        state.userProgressDetails.submittedAnswers = normalizedAnswers;
        state.userProgressDetails.submittedQuestions = {
          ...state.userProgressDetails.submittedQuestions,
          ...submittedQuestions,
        };
      })

      // post user progress answer
      .addCase(postUserProgressAPI.pending, (state) => {
        state.userProgressDetails.loading = true;
        state.userProgressDetails.error = null;
      })

      .addCase(postUserProgressAPI.fulfilled, (state, action) => {
        state.userProgressDetails.alreadySubmitted = true;
        state.userProgressDetails.lastSubmittedDate = new Date().toISOString();
      })

      .addCase(postUserProgressAPI.rejected, (state, action) => {
        state.userProgressDetails.loading = false;
        state.userProgressDetails.error = action.error.message;
      })

      // user Notes
      .addCase(fetchUserNotesAPI.fulfilled, (state, action) => {
        state.userNotesDetails = action.payload || [];
      })

      .addCase(postUserNotesAPI.fulfilled, (state, action) => {
        state.userNotesDetails.notes.push(action.payload);
      })

      .addCase(updateUserNotesAPI.fulfilled, (state, action) => {
        const index = state.userNotesDetails.notes.findIndex(
          (f) => f.id === action.payload.id,
        );
        if (index !== -1) state.userNotesDetails.notes[index] = action.payload;
      })

      .addCase(deleteUserNotesAPI.fulfilled, (state, action) => {
        state.userNotesDetails.notes = state.userNotesDetails.notes.filter(
          (f) => f.id !== action.payload.id,
        );
      })

      // 🔥 Universal loaders
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.isLoading = false;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || "Something went wrong";
        },
      );
  },
});

export const {
  clearUserError,
  clearSubcategories,
  resetCoachesVideos,
  clearEnrolledCourseDetails,
  resetUserProgress,
  markQuestionSubmitted,
  markDayCompleted,
  setCurrentDayIndex,
  setAlreadySubmitted,
} = userSlice.actions;

export default userSlice.reducer;
