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
  ChevronRight,
  Info,
  Target,
  Sparkles,
  BookOpen,
  CircleDot,
  Circle,
} from "lucide-react";

import { postUserProgressAPI } from "@/store/feature/user";
import {
  markScopedDayCompleted,
  markQuestionSubmitted,
} from "@/store/feature/user/userSlice";
import useUserCompletedMessage from "./useUserCompletedMessage";
import QuestionCard from "./QuestionCard";

// ─── Theme Configuration ─────────────────────────────────────────────────────────────
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

// ─── WeeklyThemeCard ──────────────────────────────────────────────────────────

const WeeklyThemeCard = ({ t, theme = "light" }) => {
  const themeColors = THEMES[theme];

  return (
    <div
      className={`rounded-2xl border border-${themeColors.secondary}-200/60 dark:border-${themeColors.secondary}-500/20 dark:bg-${themeColors.secondary}-500/[0.06] p-5`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-6 h-6 rounded-lg bg-${themeColors.secondary}-100 dark:bg-${themeColors.secondary}-500/20 flex items-center justify-center flex-shrink-0`}
        >
          <BookOpen
            className={`w-3.5 h-3.5 text-${themeColors.weekTheme}-600 dark:text-${themeColors.weekTheme}-400`}
          />
        </div>
        <span
          className={`text-xs font-semibold uppercase tracking-wider text-${themeColors.weekTheme}-500 dark:text-${themeColors.weekTheme}-500`}
        >
          This week's theme
        </span>
      </div>

      <h3
        className={`text-sm  text-${themeColors.secondary} dark:text-${themeColors.secondary} leading-relaxed mb-0`}
        dangerouslySetInnerHTML={{ __html: t.theme }}
      />

      {t.weekly_target && (
        <div className="mt-4 pt-4 border-t border-blue-200/40 dark:border-blue-500/10">
          <div className="flex items-center gap-1.5 mb-2">
            <Target
              className={`w-3.5 h-3.5 text-${themeColors.weekTarget}-600 dark:text-${themeColors.weekTarget}-400 flex-shrink-0`}
            />
            <span
              className={`text-xs font-semibold uppercase tracking-wider text-${themeColors.weekTarget}-600 dark:text-${themeColors.weekTarget}-400`}
            >
              Weekly target
            </span>
          </div>
          <p
            className={`text-sm text-${themeColors.secondary} dark:text-${themeColors.secondary} leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: t.weekly_target }}
          />
        </div>
      )}

      {t.outcomes && (
        <div className="mt-4 pt-4 border-t border-blue-200/40 dark:border-blue-500/10">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles
              className={`w-3.5 h-3.5 text-${themeColors.accent}-600 dark:text-${themeColors.accent}-400 flex-shrink-0`}
            />
            <span
              className={`text-xs font-semibold uppercase tracking-wider text-${themeColors.accent}-600 dark:text-${themeColors.accent}-400`}
            >
              Outcomes
            </span>
          </div>
          <p
            className={`text-sm text-${themeColors.secondary} dark:text-${themeColors.secondary} leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: t.outcomes }}
          />
        </div>
      )}
    </div>
  );
};

// ─── DayCompletionModal ───────────────────────────────────────────────────────

const DayCompletionModal = ({ popupDayNo, completedMessage, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-complete-title"
    >
      <div
        className={`relative w-full max-w-sm 
         bg-white dark:bg-gray-800 
         rounded-2xl border border-gray-200 dark:border-gray-700 
         p-6 shadow-xl`}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className={`absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-2xl 
            bg-green-50 dark:bg-green-500/10 
            flex items-center justify-center mx-auto mb-4`}
          >
            <CheckCircle2 className={`w-7 h-7 text-green-500`} />
          </div>
          <h3
            id="day-complete-title"
            className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2`}
          >
            Day {popupDayNo} complete
          </h3>

          {completedMessage?.map((msg, idx) => (
            <p
              key={idx}
              className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed`}
              dangerouslySetInnerHTML={{ __html: msg.message }}
            />
          ))}

          <p
            className={`text-xs text-green-600 dark:text-green-400 mt-3 font-medium`}
          >
            Keep up the great work
          </p>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className={`flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/40`}
          >
            Close
          </button>
          <button
            onClick={onClose}
            className={`flex-1 h-10 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60`}
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DayIntroCard ─────────────────────────────────────────────────────────────

const DayIntroCard = ({ html, theme = "light" }) => {
  const themeColors = THEMES[theme];

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border border-green-300 mb-5`}
    >
      <Info
        className={`w-4 h-4 text-${themeColors.weekTarget}-600 dark:text-${themeColors.weekTarget}-400 flex-shrink-0 mt-0.5`}
      />
      <p
        className={`text-sm text-${themeColors.weekTarget}-600   leading-relaxed`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

// ─── DaySection ───────────────────────────────────────────────────────────────

const DaySection = ({
  dNo,
  questions,
  courseId,
  weekNo,
  reduxSubmittedQuestions,
  theme,
  answers,
  hoverRating,
  setHoverRating,
  submittingQuestion,
  handleQuestionSubmit,
  onText,
  onRadio,
  onDropdown,
  onMultiSelect,
  onRating,
}) => {
  const { completedMessage } = useUserCompletedMessage(courseId, weekNo, dNo);
  const themeColors = THEMES[theme];

  const submitted = questions.filter(
    (q) => reduxSubmittedQuestions?.[q.id],
  ).length;
  const total = questions.length;
  const isDayComplete = submitted === total && total > 0;
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;

  return (
    <div className="mb-8 last:mb-0">
      {/* Day header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Circle className={`text-sm  text-gray-200`} />
          <div>
            <span
              className={`text-sm font-semibold text-${themeColors.text} dark:text-${themeColors.textDark}`}
            >
              Day {dNo}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-600 ml-2">
              {submitted}/{total}
            </span>
          </div>
        </div>

        {isDayComplete && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-${themeColors.weekTarget}-50 dark:bg-${themeColors.primary}-500/10 text-${themeColors.primary}-600 dark:text-${themeColors.primary}-400 border border-${themeColors.primary}-200/50 dark:border-${themeColors.primary}-500/20`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Complete
          </span>
        )}

        <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.05]" />
      </div>

      {/* Day short intro */}
      {completedMessage.map((msg, idx) =>
        msg.short_intro ? (
          <DayIntroCard key={idx} html={msg.short_intro} theme={theme} />
        ) : null,
      )}

      {/* Questions */}
      <div className={`space-y-4`}>
        {questions.map((question, idx) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={idx}
            answers={answers}
            hoverRating={hoverRating}
            setHoverRating={setHoverRating}
            theme={theme}
            onText={onText}
            onRadio={onRadio}
            onDropdown={onDropdown}
            onMultiSelect={onMultiSelect}
            onRating={onRating}
            isSubmitted={!!reduxSubmittedQuestions?.[question.id]}
            isSubmitting={submittingQuestion === question.id}
            onQuestionSubmit={() =>
              handleQuestionSubmit(question.id, parseInt(dNo))
            }
          />
        ))}
      </div>
    </div>
  );
};

// ─── ProgressBar ──────────────────────────────────────────────────────────────

const ProgressBar = ({ value, label, theme = "light" }) => {
  const themeColors = THEMES[theme];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className={`text-xs text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}`}
        >
          {label}
        </span>
        <span
          className={`text-xs font-semibold tabular-nums ${value === 100 ? `text-${themeColors.primary}-500` : `text-${themeColors.textMuted} dark:text-${themeColors.textMutedDark}`}`}
          aria-hidden="true"
        >
          {value}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value}%`}
        className="h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden"
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${themeColors.progressFrom} ${themeColors.progressTo} transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

// ─── LoadingState ─────────────────────────────────────────────────────────────

const LoadingState = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-24 rounded-2xl bg-gray-100 dark:bg-white/[0.04]" />
    <div className="h-32 rounded-2xl bg-gray-100 dark:bg-white/[0.04]" />
    <div className="h-32 rounded-2xl bg-gray-100 dark:bg-white/[0.04]" />
  </div>
);

// ─── ProgressPracticeForm ─────────────────────────────────────────────────────

const ProgressPracticeForm = ({
  courseId,
  theme = "light",
  weekData,
  isLoading,
  error,
  onSubmitSuccess,
}) => {
  const dispatch = useDispatch();

  // Read only what we need from weekData (passed from parent, no duplicate fetch)
  const weekNo = weekData?.week_no ?? 1;
  const dayNo = weekData?.day_no ?? 1;
  const totalDays = weekData?.total_days ?? 7;
  const allDaysData = weekData?.data ?? [];

  // Redux submitted state lives on weekData (from parent's useUserProgressDetails)
  const reduxSubmittedQuestions = weekData?.submittedQuestions ?? {};
  const reduxSubmittedAnswers = weekData?.submittedAnswers ?? {};
  const completedDays = weekData?.completedDays ?? {};

  const [answers, setAnswers] = useState({});
  const [hoverRating, setHoverRating] = useState({});
  const [submittingQuestion, setSubmittingQuestion] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showDayPopup, setShowDayPopup] = useState(false);
  const [popupDayNo, setPopupDayNo] = useState(null);

  const { weeklyTheme, completedMessage: popupCompletedMessage } =
    useUserCompletedMessage(courseId, weekNo, popupDayNo ?? dayNo);

  // ── Derived ──────────────────────────────────────────────────────────────────

  const allQuestions = useMemo(
    () =>
      allDaysData.flatMap((day) =>
        (day.questions ?? []).map((q) => ({ ...q, day_no: day.day_no })),
      ),
    [allDaysData],
  );

  const questionsByDay = useMemo(() => {
    const grouped = {};
    allDaysData.forEach((day) => {
      if (day.questions?.length) grouped[day.day_no] = day.questions;
    });
    return grouped;
  }, [allDaysData]);

  const totalQuestions = allQuestions.length;

  const submittedCount = useMemo(
    () => allQuestions.filter((q) => reduxSubmittedQuestions?.[q.id]).length,
    [allQuestions, reduxSubmittedQuestions],
  );

  const progressPct =
    totalQuestions > 0
      ? Math.round((submittedCount / totalQuestions) * 100)
      : 0;

  // ── Hydrate answers ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (reduxSubmittedAnswers === undefined) return;

    const merged = {};

    Object.values(reduxSubmittedAnswers).forEach((val) => {
      if (val && typeof val === "object" && !Array.isArray(val)) {
        const isNested = Object.values(val).every(
          (v) => v && typeof v === "object" && !Array.isArray(v),
        );
        if (isNested) {
          Object.values(val).forEach((dayAnswers) =>
            Object.assign(merged, dayAnswers),
          );
        } else {
          Object.assign(merged, val);
        }
      }
    });

    setAnswers((prev) => ({ ...merged, ...prev }));
    setIsDataLoaded(true);
  }, [reduxSubmittedAnswers]);

  useEffect(() => {
    if (reduxSubmittedAnswers !== undefined) setIsDataLoaded(true);
  }, [reduxSubmittedAnswers]);

  // ── Day completion popup guard ────────────────────────────────────────────────

  const prevCompletedDaysRef = useRef(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isDataLoaded || !completedDays) return;
    if (!isInitializedRef.current) {
      prevCompletedDaysRef.current = { ...completedDays };
      isInitializedRef.current = true;
      return;
    }
    const newDay = Object.keys(completedDays).find(
      (d) => completedDays[d] && !prevCompletedDaysRef.current?.[d],
    );
    if (newDay) {
      setPopupDayNo(Number(newDay));
      setShowDayPopup(true);
    }
    prevCompletedDaysRef.current = { ...completedDays };
  }, [completedDays, isDataLoaded]);

  // ── Answer handlers ───────────────────────────────────────────────────────────

  const handleText = useCallback(
    (id, v) => setAnswers((p) => ({ ...p, [id]: v })),
    [],
  );
  const handleRadio = useCallback(
    (id, v) => setAnswers((p) => ({ ...p, [id]: v })),
    [],
  );
  const handleDropdown = useCallback(
    (id, v) => setAnswers((p) => ({ ...p, [id]: v })),
    [],
  );
  const handleRating = useCallback(
    (id, v) => setAnswers((p) => ({ ...p, [id]: v })),
    [],
  );

  const handleMultiSelect = useCallback((id, v) => {
    setAnswers((p) => {
      const cur = p[id] ?? [];
      return {
        ...p,
        [id]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v],
      };
    });
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────────

  const handleQuestionSubmit = useCallback(
    async (questionId, qDayNo) => {
      // Check if already submitted
      if (reduxSubmittedQuestions?.[questionId]) {
        console.log("Question already submitted:", questionId);
        return;
      }

      const answer = answers[questionId];
      const hasAnswer =
        answer !== undefined &&
        (Array.isArray(answer)
          ? answer.length > 0
          : String(answer).trim() !== "");

      if (!hasAnswer) {
        console.log("No answer provided for question:", questionId);
        return;
      }

      setSubmittingQuestion(questionId);
      try {
        await dispatch(
          postUserProgressAPI({
            weekNo,
            dayNo: qDayNo,
            courseId,
            answers: { [questionId]: answer },
          }),
        ).unwrap();

        // Mark question as submitted in Redux
        dispatch(markQuestionSubmitted({ courseId, questionId }));

        // Check if all questions for this day are now submitted
        const dayQs = allQuestions.filter((q) => q.day_no === qDayNo);
        const updatedSubmitted = {
          ...reduxSubmittedQuestions,
          [questionId]: true,
        };

        const allDayQuestionsSubmitted = dayQs.every(
          (q) => updatedSubmitted[q.id],
        );

        if (allDayQuestionsSubmitted) {
          dispatch(
            markScopedDayCompleted({
              section: "userProgressDetails",
              courseId,
              dayNo: qDayNo,
            }),
          );
        }

        onSubmitSuccess?.();
      } catch (err) {
        console.error("Progress submit error:", err);
      } finally {
        setSubmittingQuestion(null);
      }
    },
    [
      answers,
      reduxSubmittedQuestions,
      dispatch,
      weekNo,
      courseId,
      allQuestions,
      onSubmitSuccess,
    ],
  );

  const handleClosePopup = useCallback(() => {
    setShowDayPopup(false);
    setPopupDayNo(null);
  }, []);

  // ── Guards ────────────────────────────────────────────────────────────────────

  if (isLoading || !isDataLoaded) return <LoadingState />;

  if (error) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-red-400 dark:text-red-400">{error}</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full">
      {/* Progress summary row */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <ProgressBar
            value={progressPct}
            label={`Week ${weekNo} · ${totalDays} days`}
            theme={theme}
          />
        </div>
      </div>

      {/* Weekly theme — rendered once */}
      {weeklyTheme?.length > 0 && (
        <div className="mb-8 space-y-3">
          {weeklyTheme.map((t, idx) => (
            <WeeklyThemeCard key={idx} t={t} theme={theme} />
          ))}
        </div>
      )}

      {/* Day sections */}
      {Object.keys(questionsByDay).length > 0 ? (
        Object.keys(questionsByDay).map((dNo) => (
          <DaySection
            key={dNo}
            dNo={Number(dNo)}
            questions={questionsByDay[dNo]}
            courseId={courseId}
            weekNo={weekNo}
            reduxSubmittedQuestions={reduxSubmittedQuestions}
            theme={theme}
            answers={answers}
            hoverRating={hoverRating}
            setHoverRating={setHoverRating}
            submittingQuestion={submittingQuestion}
            handleQuestionSubmit={handleQuestionSubmit}
            onText={handleText}
            onRadio={handleRadio}
            onDropdown={handleDropdown}
            onMultiSelect={handleMultiSelect}
            onRating={handleRating}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-14 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center">
            <CircleDot className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            No practice questions yet
          </p>
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-6 pt-5 border-t border-gray-100 dark:border-white/[0.05]">
        Responses are saved automatically and used to track your learning
        progress.
      </p>

      {/* Day completion modal — in-flow, no position:fixed */}
      {showDayPopup && (
        <DayCompletionModal
          popupDayNo={popupDayNo}
          completedMessage={popupCompletedMessage}
          onClose={handleClosePopup}
          theme={theme}
        />
      )}
    </div>
  );
};

export default ProgressPracticeForm;
