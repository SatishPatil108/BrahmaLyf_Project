import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import {
  ClipboardList,
  CheckCircle,
  Send,
  Star,
  Lock,
  X,
  ChevronRight,
  BadgeInfo,
} from "lucide-react";

import { postUserProgressAPI } from "@/store/feature/user";
import useUserProgressDetails from "./useUserProgressDetails";
import {
  markScopedDayCompleted,
  markQuestionSubmitted,
} from "@/store/feature/user/userSlice";
import useUserCompletedMessage from "./useUserCompletedMessage";
import QuestionCard from "./QuestionCard";

// ─── Inject styles once at module level ───────────────────────────────────────
if (
  typeof document !== "undefined" &&
  !document.getElementById("progress-form-styles")
) {
  const style = document.createElement("style");
  style.id = "progress-form-styles";
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to   { opacity: 0; transform: translateY(-10px); }
    }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
    .animate-fadeOut { animation: fadeOut 0.5s ease-out forwards; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(style);
}

// ─── SectionDivider ────────────────────────────────────────────────────────────
const SectionDivider = ({ color }) => (
  <div className="flex justify-center items-center gap-2 my-4">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
  </div>
);

// ─── PillLabel ─────────────────────────────────────────────────────────────────
const PillLabel = ({ emoji, label, color }) => (
  <div className="flex justify-center mb-3">
    <div
      className={`flex items-center gap-2 bg-${color}-50 dark:bg-${color}-900/30 px-4 py-1.5 rounded-full border border-${color}-200 dark:border-${color}-800`}
    >
      <span className={`text-${color}-600 dark:text-${color}-400 text-sm`}>
        {emoji}
      </span>
      <span
        className={`text-xs font-bold tracking-wider text-${color}-700 dark:text-${color}-300`}
      >
        {label}
      </span>
    </div>
  </div>
);

// ─── WeeklyThemeCard ───────────────────────────────────────────────────────────
const WeeklyThemeCard = ({ t, borderColor, bgColor, textColor }) => (
  <div
    className={`rounded-xl border ${borderColor.primary} ${bgColor.secondary} p-6 text-center shadow-sm hover:shadow-md transition-shadow`}
  >
    <div className="flex justify-center mb-4">
      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
        <span className="text-blue-600 dark:text-blue-400 text-sm">🏷️</span>
        <span className="text-xs font-bold tracking-wider text-blue-700 dark:text-blue-300">
          This Week's Theme
        </span>
      </div>
    </div>

    <h3
      className={`sm:text-lg text-sm font-bold ${textColor.primary} mb-6 py-2`}
      dangerouslySetInnerHTML={{ __html: t.theme }}
    />

    {t.weekly_target && (
      <>
        <SectionDivider color="bg-green-500" />
        <PillLabel emoji="🎯" label="This Week's Target" color="green" />
        <p
          className={`sm:text-lg text-sm ${textColor.muted} max-w-md mx-auto py-2`}
          dangerouslySetInnerHTML={{ __html: t.weekly_target }}
        />
      </>
    )}

    {t.outcomes && (
      <>
        <SectionDivider color="bg-purple-500" />
        <PillLabel emoji="✨" label="Outcomes" color="purple" />
        <p
          className={`sm:text-lg text-sm ${textColor.muted} max-w-md mx-auto py-2`}
          dangerouslySetInnerHTML={{ __html: t.outcomes }}
        />
      </>
    )}
  </div>
);

// ─── DayCompletionPopup ────────────────────────────────────────────────────────
const DayCompletionPopup = ({ popupDayNo, completedMessage, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <X className="w-5 h-5" />
      </button>

      {completedMessage.map((msg, idx) => (
        <div key={idx} className="text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🎉 Day {popupDayNo} Complete! 🎉
          </h3>
          <p
            className="text-gray-600 dark:text-gray-300 mb-4"
            dangerouslySetInnerHTML={{ __html: msg.message }}
          />
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            Keep up the great work! 🌟
          </span>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={onClose}
          className="order-2 sm:order-1 px-4 py-2.5 rounded-xl
            border-2 border-emerald-500 dark:border-emerald-400
            text-emerald-600 dark:text-emerald-400 font-semibold
            hover:bg-emerald-50 dark:hover:bg-emerald-950/30
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500
            flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
        <button
          onClick={onClose}
          className="order-1 sm:order-2 flex-1 px-6 py-2.5 rounded-xl
            bg-gradient-to-r from-emerald-500 to-teal-600
            hover:from-emerald-600 hover:to-teal-700
            text-white font-semibold shadow-md hover:shadow-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
            flex items-center justify-center gap-2"
        >
          <span>Continue to Next Day</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

// ─── DaySection ────────────────────────────────────────────────────────────────
// Isolated per-day component so useUserCompletedMessage can be called
const DaySection = ({
  dNo,
  questions,
  courseId,
  weekNo,
  reduxSubmittedQuestions,
  textColor,
  bgColor,
  borderColor,
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
  // Each day fetches its own short intro message
  const { completedMessage } = useUserCompletedMessage(courseId, weekNo, dNo);

  const daySubmittedCount = questions.filter(
    (q) => reduxSubmittedQuestions?.[q.id],
  ).length;
  const dayCompleted = daySubmittedCount === questions.length;

  return (
    <div className="mb-4">
      {/* Day header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-emerald-200 dark:border-emerald-800">
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            dayCompleted
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
        >
          Day {dNo}
        </div>
        <span className={`text-xs ${textColor.muted}`}>
          {daySubmittedCount}/{questions.length} Completed
        </span>
        {dayCompleted && (
          <CheckCircle className="w-4 h-4 text-emerald-500 ml-2" />
        )}
      </div>

      {/* Per-day short intro — shown above that day's questions */}
      {completedMessage.map((msg, idx) =>
        msg.short_intro ? (
          <div
            key={idx}
            className={`w-full h-22 my-2 sm:h-12 px-4 py-2.5 rounded-lg text-sm border transition-all duration-150 mb-8
              ${bgColor.primary} ${textColor.primary} ${borderColor.secondary}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <BadgeInfo className="w-6 h-6 text-green-400 mb-4" />
              </div>
              <div className="flex-1">
                <p
                  className=" text-sm leading-relaxed mt-1"
                  dangerouslySetInnerHTML={{ __html: msg.short_intro }}
                />
              </div>
            </div>
          </div>
        ) : null,
      )}

      {/* Questions */}
      <div className="flex flex-col gap-5">
        {questions.map((question, idx) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={idx}
            answers={answers}
            hoverRating={hoverRating}
            setHoverRating={setHoverRating}
            theme={theme}
            textColor={textColor}
            bgColor={bgColor}
            borderColor={borderColor}
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

// ─── Theme factory ─────────────────────────────────────────────────────────────
const makeTheme = (isDark) => ({
  textColor: {
    primary: isDark ? "text-gray-100" : "text-gray-800",
    secondary: isDark ? "text-gray-300" : "text-gray-700",
    muted: isDark ? "text-gray-400" : "text-gray-600",
  },
  bgColor: {
    primary: isDark ? "bg-gray-900" : "bg-white",
    secondary: isDark ? "bg-gray-800" : "bg-gray-50",
    card: isDark ? "bg-gray-800/90" : "bg-white",
    hover: isDark ? "hover:bg-gray-700" : "hover:bg-gray-100",
  },
  borderColor: {
    primary: isDark ? "border-gray-800" : "border-gray-200",
    secondary: isDark ? "border-gray-700" : "border-gray-300",
  },
});

// ─── ProgressPracticeForm ──────────────────────────────────────────────────────
const ProgressPracticeForm = ({
  courseId,
  theme = "light",
  onSubmitSuccess,
}) => {
  const dispatch = useDispatch();

  const {
    weekData,
    isLoading,
    error,
    submittedQuestions: reduxSubmittedQuestions,
    submittedAnswers: reduxSubmittedAnswers,
    completedDays,
  } = useUserProgressDetails(courseId);

  const weekNo = weekData?.week_no ?? 1;
  const dayNo = weekData?.day_no ?? 1;
  const totalDays = weekData?.total_days ?? 7;
  const allDaysData = weekData?.data ?? [];

  const [answers, setAnswers] = useState({});
  const [hoverRating, setHoverRating] = useState({});
  const [submittingQuestion, setSubmittingQuestion] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showDayCompletionPopup, setShowDayCompletionPopup] = useState(false);
  const [popupDayNo, setPopupDayNo] = useState(null);

  // weeklyTheme only — completedMessage now lives inside DaySection
  const { weeklyTheme, completedMessage: popupCompletedMessage } =
    useUserCompletedMessage(courseId, weekNo, popupDayNo ?? dayNo);

  // ── Derived data ─────────────────────────────────────────────────────────────
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
      if (day.questions?.length) {
        grouped[day.day_no] = { dayNo: day.day_no, questions: day.questions };
      }
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

  const { textColor, bgColor, borderColor } = useMemo(
    () => makeTheme(theme === "dark"),
    [theme],
  );

  // ── Hydrate local answers from Redux ─────────────────────────────────────────
  useEffect(() => {
    if (reduxSubmittedAnswers === undefined) return;
    const merged = {};
    Object.values(reduxSubmittedAnswers).forEach((dayAnswers) => {
      if (dayAnswers && typeof dayAnswers === "object") {
        Object.assign(merged, dayAnswers);
      }
    });
    setAnswers(merged);
    setIsDataLoaded(true);
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

    const newlyCompleted = Object.keys(completedDays).find(
      (day) => completedDays[day] && !prevCompletedDaysRef.current?.[day],
    );

    if (newlyCompleted) {
      setPopupDayNo(Number(newlyCompleted));
      setShowDayCompletionPopup(true);
    }

    prevCompletedDaysRef.current = { ...completedDays };
  }, [completedDays, isDataLoaded]);

  // ── Answer handlers ───────────────────────────────────────────────────────────
  const handleText = useCallback((id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleRadio = useCallback((id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleDropdown = useCallback((id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleMultiSelect = useCallback((id, value) => {
    setAnswers((prev) => {
      const current = prev[id] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [id]: next };
    });
  }, []);

  const handleRating = useCallback((id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  // ── Question submission ───────────────────────────────────────────────────────
  const handleQuestionSubmit = useCallback(
    async (questionId, qDayNo) => {
      const answer = answers[questionId];
      const hasAnswer =
        answer !== undefined &&
        (Array.isArray(answer)
          ? answer.length > 0
          : String(answer).trim() !== "");

      if (!hasAnswer || reduxSubmittedQuestions?.[questionId]) return;

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

        dispatch(markQuestionSubmitted({ courseId, questionId }));

        const dayQuestions = allQuestions.filter((q) => q.day_no === qDayNo);
        const updatedSubmitted = {
          ...reduxSubmittedQuestions,
          [questionId]: true,
        };
        const allDone = dayQuestions.every((q) => updatedSubmitted[q.id]);

        if (allDone) {
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
        console.error("Progress Submit error:", err);
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
    setShowDayCompletionPopup(false);
    setPopupDayNo(null);
  }, []);

  // ── Guards ────────────────────────────────────────────────────────────────────
  if (isLoading || !isDataLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="relative w-10 h-10">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-gray-700" />
          <div className="absolute inset-0 w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
        <p className={`ml-4 text-sm ${textColor.muted}`}>
          Loading progress questions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`relative overflow-hidden ${bgColor.card} rounded-xl shadow-sm border ${borderColor.primary} transition-all duration-300 hover:shadow-md`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  theme === "dark" ? "bg-emerald-900/30" : "bg-emerald-100"
                }`}
              >
                <ClipboardList
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </div>
              <div>
                <h2
                  className={`text-lg sm:text-xl font-bold ${textColor.primary}`}
                >
                  Daily Practice Check-in
                </h2>
                <p className={`text-sm ${textColor.muted}`}>
                  Week {weekNo} · All Days ({totalDays} days)
                </p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                theme === "dark"
                  ? "bg-emerald-900/30 text-emerald-400"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {submittedCount}/{totalQuestions} Submitted
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${textColor.muted}`}>
                Overall Progress
              </span>
              <span
                className={`text-xs font-medium ${
                  progressPct === 100 ? "text-emerald-500" : textColor.muted
                }`}
              >
                {progressPct}%
              </span>
            </div>
            <div
              className={`h-2 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex flex-col gap-6 max-h-[100vh] overflow-y-auto pr-2 scrollbar-hide">
            {/* Weekly theme — shown once at the top */}
            {weeklyTheme?.length > 0 && (
              <div className="mb-6 space-y-4">
                {weeklyTheme.map((t, idx) => (
                  <WeeklyThemeCard
                    key={idx}
                    t={t}
                    borderColor={borderColor}
                    bgColor={bgColor}
                    textColor={textColor}
                  />
                ))}
              </div>
            )}

            {/* Days — each renders its own short intro then its questions */}
            {Object.keys(questionsByDay).map((dNo) => (
              <DaySection
                key={dNo}
                dNo={Number(dNo)}
                questions={questionsByDay[dNo].questions}
                courseId={courseId}
                weekNo={weekNo}
                reduxSubmittedQuestions={reduxSubmittedQuestions}
                textColor={textColor}
                bgColor={bgColor}
                borderColor={borderColor}
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
            ))}

            {allQuestions.length === 0 && (
              <p className={`text-sm ${textColor.muted} text-center py-12`}>
                No questions available.
              </p>
            )}
          </div>

          {/* Day completion popup */}
          {showDayCompletionPopup && (
            <DayCompletionPopup
              popupDayNo={popupDayNo}
              completedMessage={popupCompletedMessage}
              onClose={handleClosePopup}
            />
          )}

          <div className={`mt-6 pt-4 border-t ${borderColor.primary}`}>
            <p className={`text-xs ${textColor.muted} text-center`}>
              Your responses are saved securely and used to track your learning
              progress. 📚
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPracticeForm;
