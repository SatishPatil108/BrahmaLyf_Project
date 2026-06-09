import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import {
  CheckCircle2,
  X,
  Sparkles,
  BookOpen,
  Send,
  Lock,
  Pencil,
} from "lucide-react";

import {
  fetchUserToolsResponseAPI,
  postUserToolsProgressAPI,
  updateUserToolsResponseAPI,
} from "@/store/feature/user";
import useUserToolsDetails from "./useUserToolsDetails";
import {
  markScopedDayCompleted,
  markToolsQuestionSubmitted,
} from "@/store/feature/user/userSlice";

// ─── Theme Configuration ──────────────────────────────────────────────────────

const THEMES = {
  light: {
    primary: "emerald",
    primaryHover: "emerald-600",
    primaryBg: "emerald-50",
    primaryBgDark: "emerald-500/10",
    primaryText: "emerald-600",
    primaryTextDark: "emerald-400",
    weekTheme: "blue",
    weekTarget: "green",
    secondary: "gray",
    secondaryBg: "blue-50",
    secondaryBgDark: "blue-500/10",
    secondaryText: "blue-600",
    secondaryTextDark: "blue-400",
    accent: "violet",
    accentBg: "violet-50",
    accentBgDark: "violet-500/10",
    accentText: "violet-600",
    accentTextDark: "violet-400",
    border: "gray-200",
    borderDark: "white/[0.07]",
    text: "gray-900",
    textDark: "gray-100",
    textMuted: "gray-500",
    textMutedDark: "gray-400",
    bgCard: "white",
    bgCardDark: "[#111118]",
    progressFrom: "from-emerald-500",
    progressTo: "to-teal-500",
  },
  dark: {
    primary: "teal",
    primaryHover: "teal-500",
    primaryBg: "teal-50",
    primaryBgDark: "teal-500/10",
    primaryText: "teal-600",
    primaryTextDark: "teal-400",
    secondary: "gray-100",
    weekTheme: "blue",
    weekTarget: "green",
    secondaryBg: "indigo-50",
    secondaryBgDark: "indigo-500/10",
    secondaryText: "indigo-600",
    secondaryTextDark: "indigo-400",
    accent: "purple",
    accentBg: "purple-50",
    accentBgDark: "purple-500/10",
    accentText: "purple-600",
    accentTextDark: "purple-400",
    border: "gray-700",
    borderDark: "white/[0.1]",
    text: "gray-100",
    textDark: "gray-900",
    textMuted: "gray-400",
    textMutedDark: "gray-500",
    bgCard: "[#1a1a24]",
    bgCardDark: "white",
    progressFrom: "from-teal-500",
    progressTo: "to-cyan-500",
  },
};

// ─── ProgressRing ─────────────────────────────────────────────────────────────

const ProgressRing = ({
  value = 0,
  size = 36,
  stroke = 3,
  theme = "light",
}) => {
  const themeColors = THEMES[theme];
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="flex-shrink-0 -rotate-90"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        className="stroke-gray-200 dark:stroke-white/[0.08]"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={`stroke-${themeColors.primary}-500 transition-all duration-700 ease-out`}
      />
    </svg>
  );
};

// ─── ProgressBar ──────────────────────────────────────────────────────────────

const ProgressBar = ({ progressValue, progressLabel, theme = "light" }) => {
  const themeColors = THEMES[theme];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className={`text-xs text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}`}
        >
          {progressLabel}
        </span>
        <span
          className={`text-xs font-semibold tabular-nums ${
            progressValue === 100
              ? `text-${themeColors.primary}-500`
              : `text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}`
          }`}
          aria-hidden="true"
        >
          {progressValue}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${progressLabel}: ${progressValue}%`}
        className="h-2 rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden"
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${themeColors.progressFrom} ${themeColors.progressTo} transition-all duration-700 ease-out`}
          style={{ width: `${progressValue}%` }}
        />
      </div>
    </div>
  );
};

// ─── LoadingState ─────────────────────────────────────────────────────────────

const LoadingState = () => (
  <div className="space-y-5 animate-pulse">
    <div className="h-28 rounded-2xl bg-gray-100 dark:bg-white/[0.04]" />
    <div className="h-36 rounded-2xl bg-gray-100 dark:bg-white/[0.04]" />
    <div className="h-36 rounded-2xl bg-gray-100 dark:bg-white/[0.04]" />
  </div>
);

// ─── ToolsQuestionCard ────────────────────────────────────────────────────────

const ToolsQuestionCard = ({
  questionItem,
  questionIndex,
  answerValues,
  theme = "light",
  onAnswerChange,
  isAnswerSubmitted,
  isSubmittingAnswer,
  isEditingAnswer,
  isUpdatingAnswer,
  onSubmitQuestion,
  onEditStart,
  onEditCancel,
  onUpdateQuestion,
}) => {
  const themeColors = THEMES[theme];
  const { id, question_text } = questionItem;
  const currentAnswer = answerValues[id];
  const hasAnswer =
    currentAnswer !== undefined && String(currentAnswer).trim() !== "";
  const isLocked = isAnswerSubmitted && !isEditingAnswer;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-${themeColors.border} dark:border-${themeColors.borderDark} bg-${themeColors.bgCard} dark:bg-${themeColors.bgCardDark} transition-all duration-200 hover:shadow-md`}
    >
      {/* Question header */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          {/* Left side: Question number and text */}
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <div
              className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                isLocked
                  ? `bg-${themeColors.primary}-500 text-white`
                  : isEditingAnswer
                    ? "bg-amber-500 text-white"
                    : `bg-gray-100 dark:bg-white/[0.08] text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}`
              }`}
            >
              {isLocked ? "✓" : isEditingAnswer ? "✎" : questionIndex + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium text-${themeColors.text} dark:text-${themeColors.textDark} leading-relaxed break-words`}
                dangerouslySetInnerHTML={{ __html: question_text }}
              />
              {!isAnswerSubmitted && (
                <span className="text-rose-500 text-xs ml-1 font-medium">
                  *Required
                </span>
              )}
            </div>
          </div>

          {/* Right side: Edit button only */}
          <div className="flex items-center gap-2 shrink-0">
            {isLocked && (
              <button
                onClick={onEditStart}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium
                  bg-gray-100 dark:bg-white/[0.08]
                  text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}
                  hover:bg-gray-200 dark:hover:bg-white/[0.12] transition-colors`}
                title="Edit answer"
              >
                <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="text-[11px] sm:text-xs">Edit</span>
              </button>
            )}
            {isEditingAnswer && (
              <span className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="text-[11px] sm:text-xs">Editing</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Answer area */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
        <textarea
          value={currentAnswer || ""}
          onChange={(e) => onAnswerChange(id, e.target.value)}
          disabled={isLocked}
          className={`w-full h-32 sm:h-40 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm border transition-all duration-150
            
            text-${themeColors.text} dark:text-${themeColors.textDark}
            border-${themeColors.border} dark:border-${themeColors.borderDark}
            focus:outline-none focus:ring-2 focus:ring-${themeColors.primary}-500/40 focus:border-${themeColors.primary}-500
            ${isLocked ? "cursor-not-allowed opacity-60 bg-green-200 dark:bg-green-500/5 text-slate-500" : "cursor-pointer"}
            ${currentAnswer ? `border-${themeColors.primary}-400 dark:border-${themeColors.primary}-500/50` : ""}`}
          placeholder="Type your answer here..."
        />

        {/* Submit / Update buttons */}
        <div className="mt-3 sm:mt-4 flex justify-end gap-2 sm:gap-3">
          {!isAnswerSubmitted && !isEditingAnswer && (
            <button
              onClick={onSubmitQuestion}
              disabled={!hasAnswer || isSubmittingAnswer}
              className={`h-9 sm:h-10 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all duration-200
                ${
                  hasAnswer && !isSubmittingAnswer
                    ? `bg-gradient-to-r ${themeColors.progressFrom} ${themeColors.progressTo}
                       hover:opacity-90 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer`
                    : "bg-gray-100 dark:bg-white/[0.06] text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
            >
              {isSubmittingAnswer ? (
                <>
                  <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Submit</span>
                </>
              )}
            </button>
          )}

          {isEditingAnswer && (
            <>
              <button
                onClick={onEditCancel}
                disabled={isUpdatingAnswer}
                className={`h-9 sm:h-10 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all duration-200
                  bg-gray-100 dark:bg-white/[0.06]
                  text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}
                  hover:bg-gray-200 dark:hover:bg-white/[0.1]
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={onUpdateQuestion}
                disabled={!hasAnswer || isUpdatingAnswer}
                className={`h-9 sm:h-10 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all duration-200
                  ${
                    hasAnswer && !isUpdatingAnswer
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer"
                      : "bg-gray-100 dark:bg-white/[0.06] text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
              >
                {isUpdatingAnswer ? (
                  <>
                    <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Update</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── ToolsDaySection ──────────────────────────────────────────────────────────

const ToolsDaySection = ({
  dayNumber,
  dayQuestions,
  answerValues,
  theme = "light",
  submittedAnswersMap,
  submittingQuestionId,
  updatingQuestionId,
  editingQuestionId,
  onSubmitQuestion,
  onAnswerChange,
  onEditStart,
  onEditCancel,
  onUpdateQuestion,
}) => {
  const themeColors = THEMES[theme];
  const submittedCount = dayQuestions.filter(
    (q) => submittedAnswersMap?.[q.id],
  ).length;
  const totalCount = dayQuestions.length;
  const isDayComplete = submittedCount === totalCount && totalCount > 0;
  const progressPercent =
    totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;

  return (
    <div className="mb-10 last:mb-0">
      {/* Day header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-3">
          <ProgressRing
            value={progressPercent}
            size={36}
            stroke={3}
            theme={theme}
          />
          <div>
            <span
              className={`text-base font-semibold text-${themeColors.text} dark:text-${themeColors.textDark}`}
            >
              Day {dayNumber}
            </span>
            <span
              className={`text-xs text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark} ml-2`}
            >
              {submittedCount}/{totalCount} completed
            </span>
          </div>
        </div>

        {isDayComplete && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
              bg-${themeColors.weekTarget}-50 dark:bg-${themeColors.weekTarget}-500/10
              text-${themeColors.primaryText} dark:text-${themeColors.primaryTextDark}
              border border-${themeColors.primary}-200/50 dark:border-${themeColors.primary}-500/20`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Day Complete
          </span>
        )}

        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-white/[0.05] to-transparent" />
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {dayQuestions.map((question, idx) => (
          <ToolsQuestionCard
            key={question.id}
            questionItem={question}
            questionIndex={idx}
            answerValues={answerValues}
            theme={theme}
            onAnswerChange={onAnswerChange}
            isAnswerSubmitted={!!submittedAnswersMap?.[question.id]}
            isSubmittingAnswer={submittingQuestionId === question.id}
            isEditingAnswer={editingQuestionId === question.id}
            isUpdatingAnswer={updatingQuestionId === question.id}
            onSubmitQuestion={() =>
              onSubmitQuestion(question.id, parseInt(dayNumber))
            }
            onEditStart={() => onEditStart(question.id)}
            onEditCancel={() => onEditCancel(question.id)}
            onUpdateQuestion={() =>
              onUpdateQuestion(question.id, parseInt(dayNumber))
            }
          />
        ))}
      </div>
    </div>
  );
};

// ─── ProgressToolsForm ────────────────────────────────────────────────────────

const ProgressToolsForm = ({ courseId, theme = "light", onSubmitSuccess }) => {
  const themeColors = THEMES[theme];
  const dispatch = useDispatch();

  const {
    weekData,
    isLoading,
    error,
    submittedQuestions: reduxSubmittedQuestions,
    submittedAnswers: reduxSubmittedAnswers,
  } = useUserToolsDetails(courseId);

  const [answerValues, setAnswerValues] = useState({});
  const [submittingQuestionId, setSubmittingQuestionId] = useState(null);
  const [updatingQuestionId, setUpdatingQuestionId] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [backupAnswerValue, setBackupAnswerValue] = useState(null);
  const [isDataPreloaded, setIsDataPreloaded] = useState(false);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  const [showCompletedView, setShowCompletedView] = useState(false);
  const completionTimerRef = useRef(null);

  const weekNumber = weekData?.week_no || 1;
  const totalDaysCount = weekData?.total_days || 7;
  const allDaysData = weekData?.data || [];

  const allQuestionsList = useMemo(
    () =>
      allDaysData.flatMap((day) =>
        (day.questions || []).map((q) => ({ ...q, day_no: day.day_no })),
      ),
    [allDaysData],
  );

  const questionsByDayMap = useMemo(() => {
    const grouped = {};
    allDaysData.forEach((day) => {
      if (day.questions?.length) grouped[day.day_no] = day.questions;
    });
    return grouped;
  }, [allDaysData]);

  // Fetch tools responses
  useEffect(() => {
    if (courseId) dispatch(fetchUserToolsResponseAPI({ courseId }));
  }, [courseId, dispatch]);

  // Hydrate answers from Redux
  useEffect(() => {
    if (!reduxSubmittedAnswers) return;
    const mergedAnswers = {};
    Object.entries(reduxSubmittedAnswers).forEach(([, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const isDayObject = Object.values(value).some(
          (v) =>
            typeof v === "string" || typeof v === "number" || Array.isArray(v),
        );
        if (isDayObject) {
          Object.assign(mergedAnswers, value);
        } else {
          Object.values(value).forEach((dayAnswers) => {
            if (dayAnswers && typeof dayAnswers === "object")
              Object.assign(mergedAnswers, dayAnswers);
          });
        }
      } else {
        // value is a primitive keyed directly
      }
    });
    setAnswerValues((prev) => ({ ...prev, ...mergedAnswers }));
    setIsDataPreloaded(true);
  }, [reduxSubmittedAnswers]);

  const totalQuestionsCount = allQuestionsList.length;
  const totalSubmittedCount = allQuestionsList.filter(
    (q) => reduxSubmittedQuestions?.[q.id],
  ).length;
  const allItemsCompleted =
    isDataPreloaded &&
    totalQuestionsCount > 0 &&
    totalSubmittedCount === totalQuestionsCount;

  // Completion flow
  useEffect(() => {
    if (!allItemsCompleted || showCompletionAlert || showCompletedView) return;
    setShowCompletionAlert(true);
    completionTimerRef.current = setTimeout(() => {
      setShowCompletionAlert(false);
      setShowCompletedView(true);
    }, 4500);
    return () => clearTimeout(completionTimerRef.current);
  }, [allItemsCompleted, showCompletionAlert, showCompletedView]);

  const forceRefreshAnswers = useCallback(async () => {
    if (!courseId) return;
    try {
      await dispatch(fetchUserToolsResponseAPI({ courseId })).unwrap();
    } catch (err) {
      console.error("Failed to refresh tools answers:", err);
    }
  }, [dispatch, courseId]);

  const onAnswerChange = useCallback((questionId, answerValue) => {
    setAnswerValues((prev) => ({ ...prev, [questionId]: answerValue }));
  }, []);

  const onEditStart = useCallback(
    (questionId) => {
      setBackupAnswerValue(answerValues[questionId]);
      setEditingQuestionId(questionId);
    },
    [answerValues],
  );

  const onEditCancel = useCallback(
    (questionId) => {
      setAnswerValues((prev) => ({ ...prev, [questionId]: backupAnswerValue }));
      setEditingQuestionId(null);
      setBackupAnswerValue(null);
    },
    [backupAnswerValue],
  );

  const onUpdateQuestion = useCallback(
    async (questionId, dayNumber) => {
      const answer = answerValues[questionId]?.trim();
      if (!answer) return;
      setUpdatingQuestionId(questionId);
      try {
        await dispatch(
          updateUserToolsResponseAPI({
            questionId,
            toolsData: {
              textAnswer: answer,
              courseId,
              weekNo: weekNumber,
              dayNo: dayNumber,
            },
          }),
        ).unwrap();
        dispatch(markToolsQuestionSubmitted({ courseId, questionId }));
        setEditingQuestionId(null);
        setBackupAnswerValue(null);
        await forceRefreshAnswers();
        onSubmitSuccess?.();
      } catch (err) {
        console.error("Update failed:", err);
      } finally {
        setUpdatingQuestionId(null);
      }
    },
    [
      answerValues,
      dispatch,
      courseId,
      weekNumber,
      forceRefreshAnswers,
      onSubmitSuccess,
    ],
  );

  const onSubmitQuestion = useCallback(
    async (questionId, dayNumber) => {
      const answer = answerValues[questionId];
      const hasAnswer = answer !== undefined && String(answer).trim() !== "";
      if (!hasAnswer || reduxSubmittedQuestions?.[questionId]) return;
      setSubmittingQuestionId(questionId);
      try {
        await dispatch(
          postUserToolsProgressAPI({
            weekNo: weekNumber,
            dayNo: dayNumber,
            courseId,
            answers: [{ questionId, textAnswer: answer }],
          }),
        ).unwrap();
        dispatch(markToolsQuestionSubmitted({ courseId, questionId }));
        await forceRefreshAnswers();
        const dayQuestions = allQuestionsList.filter(
          (q) => q.day_no === dayNumber,
        );
        const updatedSubmitted = {
          ...reduxSubmittedQuestions,
          [questionId]: true,
        };
        if (dayQuestions.every((q) => updatedSubmitted[q.id])) {
          dispatch(
            markScopedDayCompleted({
              section: "userToolsDetails",
              courseId,
              dayNo: dayNumber,
            }),
          );
        }
        onSubmitSuccess?.();
      } catch (err) {
        console.error("Tools submit error:", err);
      } finally {
        setSubmittingQuestionId(null);
      }
    },
    [
      answerValues,
      reduxSubmittedQuestions,
      dispatch,
      weekNumber,
      courseId,
      allQuestionsList,
      forceRefreshAnswers,
      onSubmitSuccess,
    ],
  );

  const overallProgressPercent =
    totalQuestionsCount > 0
      ? Math.round((totalSubmittedCount / totalQuestionsCount) * 100)
      : 0;

  // ── Guards ────────────────────────────────────────────────────────────────────

  if (isLoading || !isDataPreloaded) return <LoadingState />;

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
            <X className="w-6 h-6 text-rose-500" />
          </div>
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      </div>
    );
  }

  // ── Completed view ────────────────────────────────────────────────────────────

  if (allItemsCompleted && showCompletedView) {
    return (
      <div className="relative w-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <ProgressBar
              progressValue={100}
              progressLabel={`Week ${weekNumber} · ${totalDaysCount} days`}
              theme={theme}
            />
          </div>
          <span
            className={`text-xs text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark} flex-shrink-0 tabular-nums font-medium`}
          >
            {totalSubmittedCount}/{totalQuestionsCount}
          </span>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl border border-${themeColors.border} dark:border-${themeColors.borderDark} bg-${themeColors.bgCard} dark:bg-${themeColors.bgCardDark}`}
        >
          {/* Top accent bar */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${themeColors.progressFrom} via-${themeColors.primary}-500 ${themeColors.progressTo}`}
          />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2
                  className={`text-xl font-bold text-${themeColors.text} dark:text-${themeColors.textDark}`}
                >
                  Completed Answers ✨
                </h2>
                <p
                  className={`text-sm text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark} mt-1`}
                >
                  Week {weekNumber} · All {totalQuestionsCount} questions
                  answered
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium
                  bg-${themeColors.primary}-50 dark:bg-${themeColors.primary}-500/10
                  text-${themeColors.primaryText} dark:text-${themeColors.primaryTextDark}
                  border border-${themeColors.primary}-200/50 dark:border-${themeColors.primary}-500/20`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </span>
            </div>

            {/* Day sections */}
            <div className="flex flex-col gap-8 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
              {Object.keys(questionsByDayMap).map((dayNum) => (
                <ToolsDaySection
                  key={dayNum}
                  dayNumber={Number(dayNum)}
                  dayQuestions={questionsByDayMap[dayNum]}
                  answerValues={answerValues}
                  theme={theme}
                  submittedAnswersMap={reduxSubmittedQuestions}
                  submittingQuestionId={submittingQuestionId}
                  updatingQuestionId={updatingQuestionId}
                  editingQuestionId={editingQuestionId}
                  onSubmitQuestion={onSubmitQuestion}
                  onAnswerChange={onAnswerChange}
                  onEditStart={onEditStart}
                  onEditCancel={onEditCancel}
                  onUpdateQuestion={onUpdateQuestion}
                />
              ))}
            </div>

            {/* Footer */}
            <div
              className={`mt-8 pt-5 border-t border-${themeColors.border} dark:border-${themeColors.borderDark}`}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles
                  className={`w-4 h-4 text-${themeColors.primary}-500`}
                />
                <p
                  className={`text-xs text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark} text-center`}
                >
                  All responses saved successfully. Great work! 🎉
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Regular form ──────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full">
      {/* Progress row */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <ProgressBar
            progressValue={overallProgressPercent}
            progressLabel={`Week ${weekNumber} · ${totalDaysCount} days`}
            theme={theme}
          />
        </div>
      </div>

      {/* Completion alert */}
      {showCompletionAlert && (
        <div
          className={`mb-6 p-4 rounded-xl bg-${themeColors.weekTarget}-100 from-${themeColors.primary}-500/10 to-${themeColors.progressTo.replace("to-", "")}/10 animate-in fade-in slide-in-from-top-2 duration-300`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-${themeColors.weekTarget}-100 dark:bg-${themeColors.weekTarget}-500/20 flex items-center justify-center animate-bounce`}
            >
              <CheckCircle2
                className={`w-5 h-5 text-${themeColors.weekTarget} dark:text-${themeColors.weekTarget}`}
              />
            </div>
            <div>
              <p className={`text-sm font-semibold text-black`}>
                All questions completed! 🎉
              </p>
              <p
                className={`text-xs text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}`}
              >
                Redirecting to completed view...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Day sections */}
      {Object.keys(questionsByDayMap).length > 0 ? (
        Object.keys(questionsByDayMap).map((dayNum) => (
          <ToolsDaySection
            key={dayNum}
            dayNumber={Number(dayNum)}
            dayQuestions={questionsByDayMap[dayNum]}
            answerValues={answerValues}
            theme={theme}
            submittedAnswersMap={reduxSubmittedQuestions}
            submittingQuestionId={submittingQuestionId}
            updatingQuestionId={updatingQuestionId}
            editingQuestionId={editingQuestionId}
            onSubmitQuestion={onSubmitQuestion}
            onAnswerChange={onAnswerChange}
            onEditStart={onEditStart}
            onEditCancel={onEditCancel}
            onUpdateQuestion={onUpdateQuestion}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div
            className={`w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center`}
          >
            <BookOpen
              className={`w-6 h-6 text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}`}
            />
          </div>
          <div className="text-center">
            <p
              className={`text-sm font-medium text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}`}
            >
              No tools questions available
            </p>
            <p
              className={`text-xs text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark} mt-1 opacity-70`}
            >
              Check back later for new content
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className={`mt-8 pt-5 border-t border-${themeColors.border} dark:border-${themeColors.borderDark}`}
      >
        <div className="flex items-center justify-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full bg-${themeColors.primary}-500`}
          />
          <p
            className={`text-xs text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}`}
          >
            Your responses are saved securely
          </p>
          <div
            className={`w-1.5 h-1.5 rounded-full bg-${themeColors.primary}-500`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressToolsForm;
