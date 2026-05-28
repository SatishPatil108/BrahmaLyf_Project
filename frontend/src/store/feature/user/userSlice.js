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
  fetchUserToolsQuestionsAPI,
  postUserToolsProgressAPI,
  fetchUserToolsResponseAPI,
  updateUserToolsResponseAPI,
  fetchUserTaskQuestionsAPI,
  fetchUserToolQuestionsAPI,
  fetchUserProgressThemesAPI,
  fetchUserCompletedMessageAPI,
} from "./userThunk";

const createCourseScopedState = () => ({
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
});

const getScopedCourseState = (rootState, section, courseId) => {
  if (!rootState[section].byCourse[courseId]) {
    rootState[section].byCourse[courseId] = createCourseScopedState();
  }

  return rootState[section].byCourse[courseId];
};

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
    byCourse: {},
  },

  userToolsDetails: {
    byCourse: {},
  },

  PracticeDetails: {
    tasks: [],
    courseId: null,
    weekNo: null,
    totalRecords: 0,
  },

  ThemeDetails: {
    themes: [],
    courseId: null,
    weekNo: null,
    totalRecords: 0,
  },

  CompletedMessageDetails: {
    messages: [],
    courseId: null,
    weekNo: null,
    dayNo: null,
    totalRecords: 0,
  },

  ToolsDetails: {
    tools: [],
    courseId: null,
    weekNo: null,
    totalRecords: 0,
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

    resetScopedCourseState: (state, action) => {
      const { section, courseId } = action.payload;

      if (courseId) {
        delete state[section].byCourse[courseId];
      } else {
        state[section].byCourse = {};
      }
    },

    resetUserLanguage: (state) => {
      state.language = "en";
    },

    // set the language
    setLanguage: (state, action) => {
      state.language = action.payload || "en";
    },

    markQuestionSubmitted: (state, action) => {
      const { courseId, questionId } = action.payload;

      const courseState = getScopedCourseState(
        state,
        "userProgressDetails",
        courseId,
      );

      courseState.submittedQuestions[questionId] = true;
    },

    markToolsQuestionSubmitted: (state, action) => {
      const { courseId, questionId } = action.payload;

      const courseState = getScopedCourseState(
        state,
        "userToolsDetails",
        courseId,
      );

      courseState.submittedQuestions[questionId] = true;
    },

    markScopedDayCompleted: (state, action) => {
      const { section, courseId, dayNo } = action.payload;

      if (!state[section]) state[section] = {};
      if (!state[section].byCourse) state[section].byCourse = {};
      if (!state[section].byCourse[courseId]) {
        state[section].byCourse[courseId] = createCourseScopedState();
      }
      if (!state[section].byCourse[courseId].completedDays) {
        state[section].byCourse[courseId].completedDays = {};
      }

      state[section].byCourse[courseId].completedDays[dayNo] = true;
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

      // fetch user themes by specific week
      .addCase(fetchUserProgressThemesAPI.fulfilled, (state, action) => {
        const { themes, courseId, weekNo, totalRecords } = action.payload;
        state.ThemeDetails.themes = themes;
        state.ThemeDetails.courseId = courseId;
        state.ThemeDetails.weekNo = weekNo;
        state.ThemeDetails.totalRecords = totalRecords;
      })

      // fetch user completed messages by specific day wise
      .addCase(fetchUserCompletedMessageAPI.fulfilled, (state, action) => {
        const { messages, courseId, weekNo, dayNo, totalRecords } =
          action.payload;
        state.CompletedMessageDetails.messages = messages;
        state.CompletedMessageDetails.courseId = courseId;
        state.CompletedMessageDetails.weekNo = weekNo;
        state.CompletedMessageDetails.dayNo = dayNo;
        state.CompletedMessageDetails.totalRecords = totalRecords;
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
          const courseId = action.meta.arg.courseId;

          const payload = action.payload;

          const courseState = getScopedCourseState(
            state,
            "userProgressDetails",
            courseId,
          );

          courseState.loading = false;

          courseState.alreadySubmitted = payload?.alreadySubmitted || false;

          courseState.weekNo = payload?.week_no || 1;
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
        const courseId = action.payload?.courseId;

        if (!courseId || !submissions.length) return;

        const normalizedAnswers = {};
        const submittedQuestions = {};
        const completedDays = {}; 

        submissions.forEach(({ day_no, answers }) => {
          if (!normalizedAnswers[day_no]) normalizedAnswers[day_no] = {};

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

          // ✅ mark day completed if it has any submissions
          if (answers.length > 0) {
            completedDays[day_no] = true;
          }
        });

        if (!state.userProgressDetails.byCourse[courseId]) {
          state.userProgressDetails.byCourse[courseId] =
            createCourseScopedState();
        }

        state.userProgressDetails.byCourse[courseId].submittedAnswers =
          normalizedAnswers;
        state.userProgressDetails.byCourse[courseId].submittedQuestions = {
          ...state.userProgressDetails.byCourse[courseId].submittedQuestions,
          ...submittedQuestions,
        };

        state.userProgressDetails.byCourse[courseId].completedDays = {
          ...state.userProgressDetails.byCourse[courseId].completedDays,
          ...completedDays,
        };
      })

      // post user progress answer
      .addCase(postUserProgressAPI.fulfilled, (state, action) => {
        const courseId = action.payload?.courseId;
        if (!state.userProgressDetails.byCourse[courseId]) {
          state.userProgressDetails.byCourse[courseId] = {};
        }
        state.userProgressDetails.byCourse[courseId].alreadySubmitted = true;
        state.userProgressDetails.byCourse[courseId].lastSubmittedDate =
          new Date().toISOString();
      })

      .addCase(postUserProgressAPI.rejected, (state, action) => {
        const courseId = action.meta.arg.courseId;
        if (state.userProgressDetails.byCourse?.[courseId]) {
          state.userProgressDetails.byCourse[courseId].loading = false;
          state.userProgressDetails.byCourse[courseId].error =
            action.error.message;
        }
      })

      // tools section
      .addCase(fetchUserToolsQuestionsAPI.fulfilled, (state, action) => {
        const courseId = action.meta.arg.courseId;

        const payload = action.payload;

        const courseState = getScopedCourseState(
          state,
          "userToolsDetails",
          courseId,
        );

        courseState.loading = false;

        courseState.alreadySubmitted = payload?.alreadySubmitted || false;

        courseState.weekNo = payload?.week_no || 1;
      })

      // post tools
      .addCase(postUserToolsProgressAPI.fulfilled, (state, action) => {
        state.userToolsDetails.alreadySubmitted = true;
        state.userToolsDetails.lastSubmittedDate = new Date().toISOString();
      })

      .addCase(fetchUserToolsResponseAPI.fulfilled, (state, action) => {
        const courseId = action.meta.arg.courseId;

        const courseState = getScopedCourseState(
          state,
          "userToolsDetails",
          courseId,
        );

        const submissions = action.payload?.submission ?? [];

        if (!submissions.length) return;

        const normalizedAnswers = {};

        const submittedQuestions = {};

        const completedDays = {};

        submissions.forEach((submission) => {
          const { day_no, answers } = submission;

          if (!normalizedAnswers[day_no]) {
            normalizedAnswers[day_no] = {};
          }

          answers.forEach(({ questionId, textAnswer }) => {
            normalizedAnswers[day_no][questionId] = textAnswer || "";

            submittedQuestions[questionId] = true;
          });

          completedDays[day_no] = true;
        });

        courseState.submittedAnswers = normalizedAnswers;

        courseState.submittedQuestions = submittedQuestions;

        courseState.completedDays = completedDays;
      })

      .addCase(updateUserToolsResponseAPI.fulfilled, (state, action) => {
        const { courseId, dayNo, questionId, textAnswer } = action.meta.arg;

        // create course state if not exists
        if (!state.userToolsDetails.byCourse[courseId]) {
          state.userToolsDetails.byCourse[courseId] = {
            submittedAnswers: {},
            submittedQuestions: {},
          };
        }

        const courseState = state.userToolsDetails.byCourse[courseId];

        // create day state if not exists
        if (!courseState.submittedAnswers[dayNo]) {
          courseState.submittedAnswers[dayNo] = {};
        }

        // update answer
        courseState.submittedAnswers[dayNo][questionId] = textAnswer;

        // mark submitted
        courseState.submittedQuestions[questionId] = true;
      })

      // Tasks and Tools API for only week 1
      .addCase(fetchUserTaskQuestionsAPI.fulfilled, (state, action) => {
        const payload = action.payload || {};

        state.PracticeDetails = {
          courseId: payload.courseId,
          weekNo: payload.weekNo,
          totalRecords: payload.totalRecords || 0,
          tasks: payload.questions || [],
        };
      })

      .addCase(fetchUserToolQuestionsAPI.fulfilled, (state, action) => {
        const payload = action.payload || {};

        state.ToolsDetails = {
          courseId: payload.courseId,
          weekNo: payload.weekNo,
          totalRecords: payload.totalRecords || 0,
          tools: payload.questions || [],
        };
      })

      // user Notes
      .addCase(fetchUserNotesAPI.fulfilled, (state, action) => {
        state.userNotesDetails.notes = action.payload?.notes || [];
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

  markQuestionSubmitted,
  markToolsQuestionSubmitted,

  markScopedDayCompleted,
  resetScopedCourseState,

  resetUserLanguage,
  setLanguage,
} = userSlice.actions;

export default userSlice.reducer;
