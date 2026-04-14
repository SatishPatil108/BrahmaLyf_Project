import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  ClipboardList,
  CheckCircle,
  ChevronRight,
  Send,
  Star,
  Lock,
} from "lucide-react";

import { postUserProgressAPI } from "@/store/feature/user";

import useUserProgressDetails from "./useUserProgressDetails";
import {
  markDayCompleted,
  markQuestionSubmitted,
  setCurrentDayIndex,
} from "@/store/feature/user/userSlice";

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
    .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
  `;
  document.head.appendChild(style);
}

const ProgressTrackingForm = ({
  courseId,
  theme = "light",
  onSubmitSuccess,
}) => {
  const dispatch = useDispatch();

  const {
    weekData,
    isLoading,
    error,
    submittedToday,
    submittedQuestions,
    submittedAnswers,
    completedDays,
    currentDayIndex,
  } = useUserProgressDetails(courseId);

  const [answers, setAnswers] = useState({});
  const [answersByDay, setAnswersByDay] = useState({});

  const [hoverRating, setHoverRating] = useState({});
  const [submittingQuestion, setSubmittingQuestion] = useState(null);

  const weekNo = weekData?.week_no || 1;
  const totalDays = weekData?.total_days || 7;
  const allDaysData = weekData?.data || [];

  const currentDayData = allDaysData[currentDayIndex] || {};

  const questions = currentDayData?.questions || [];
  const dayNo = currentDayData?.day_no || 1;
  const hasMoreDays = currentDayIndex < allDaysData.length - 1;

  // ✅ Derived from Redux — survives re-renders
  const dayCompleted =
    questions.length > 0 && questions.every((q) => submittedQuestions?.[q.id]);

  // Reset answers only (not submitted state) when day changes
  useEffect(() => {
    if (!submittedAnswers || Object.keys(submittedAnswers).length === 0) {
      setAnswers(answersByDay[dayNo] || {});
    }
  }, [currentDayIndex]);

  useEffect(() => {
    if (submittedAnswers && Object.keys(submittedAnswers).length > 0) {
      setAnswers(submittedAnswers);
    }
  }, [submittedAnswers]);

  useEffect(() => {
    setAnswersByDay((prev) => ({
      ...prev,
      [dayNo]: answers,
    }));
  }, [answers]);
  const handleText = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleRadio = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleDropdown = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleMultiSelect = (id, value) => {
    setAnswers((prev) => {
      const current = prev[id] || [];
      return {
        ...prev,
        [id]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const handleRating = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleQuestionSubmit = async (questionId) => {
    const answer = answers[questionId];
    const hasAnswer =
      answer !== undefined &&
      (Array.isArray(answer)
        ? answer.length > 0
        : String(answer).trim() !== "");

    if (!hasAnswer || submittedQuestions[questionId]) return;

    setSubmittingQuestion(questionId);
    try {
      await dispatch(
        postUserProgressAPI({
          weekNo,
          dayNo,
          courseId,
          answers: { [questionId]: answer },
        }),
      ).unwrap();

      // ✅ Persist to Redux
      dispatch(markQuestionSubmitted({ questionId }));

      // Check if all questions in this day are now done
      const updatedSubmitted = { ...submittedQuestions, [questionId]: true };
      const allDone = questions.every((q) => updatedSubmitted[q.id]);
      if (allDone) {
        dispatch(markDayCompleted({ dayNo }));
      }

      onSubmitSuccess?.();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmittingQuestion(null);
    }
  };

  const handleNextDay = () => {
    if (hasMoreDays) {
      dispatch(setCurrentDayIndex(currentDayIndex + 1)); // ✅ Redux
    }
  };

  // Theme helpers
  const textColor = {
    primary: theme === "dark" ? "text-gray-100" : "text-gray-800",
    secondary: theme === "dark" ? "text-gray-300" : "text-gray-700",
    muted: theme === "dark" ? "text-gray-400" : "text-gray-600",
  };
  const bgColor = {
    primary: theme === "dark" ? "bg-gray-900" : "bg-white",
    secondary: theme === "dark" ? "bg-gray-800" : "bg-gray-50",
    card: theme === "dark" ? "bg-gray-800/90" : "bg-white",
    hover: theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100",
  };
  const borderColor = {
    primary: theme === "dark" ? "border-gray-800" : "border-gray-200",
    secondary: theme === "dark" ? "border-gray-700" : "border-gray-300",
  };

  const totalQuestions = questions.length;
  // count only current day's submitted questions
  const submittedCount = questions.filter(
    (q) => submittedQuestions[q.id],
  ).length;

  const progressPct =
    totalQuestions > 0
      ? Math.round((submittedCount / totalQuestions) * 100)
      : 0;

  // ── States ────────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="relative w-10 h-10">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-gray-700" />
          <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
        <p className={`ml-4 text-sm ${textColor.muted}`}>
          Loading questions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-400">
          {error || "Something went wrong."}
        </p>
      </div>
    );
  }

  // ── All days complete ─────────────────────────────────────────────────────────
  if (dayCompleted && !hasMoreDays) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div
          className={`relative overflow-hidden ${bgColor.card} rounded-xl shadow-sm border ${borderColor.primary}`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <div className="p-6 text-center animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className={`text-xl font-bold ${textColor.primary} mb-2`}>
              Week {weekNo} Complete! 🎉
            </h3>
            <p className={`${textColor.secondary} mb-4`}>
              You've completed all {totalDays} days!
            </p>
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {[...Array(totalDays)].map((_, i) => (
                <CheckCircle key={i} className="w-5 h-5 text-emerald-500" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Form ─────────────────────────────────────────────────────────────────
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
                className={`p-2.5 rounded-lg ${theme === "dark" ? "bg-emerald-900/30" : "bg-emerald-100"}`}
              >
                <ClipboardList
                  className={`w-5 h-5 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
                />
              </div>
              <div>
                <h2
                  className={`text-lg sm:text-xl font-bold ${textColor.primary}`}
                >
                  Daily Progress Check-in
                </h2>
                <p className={`text-sm ${textColor.muted}`}>
                  Week {weekNo} · Day {dayNo} of {totalDays}
                </p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${theme === "dark" ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}
            >
              {submittedCount}/{totalQuestions} Submitted
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${textColor.muted}`}>
                Progress
              </span>
              <span
                className={`text-xs font-medium ${progressPct === 100 ? "text-emerald-500" : textColor.muted}`}
              >
                {progressPct}%
              </span>
            </div>
            <div
              className={`h-2 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <div
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-5 mb-6">
            {questions.length > 0 ? (
              questions.map((question, idx) => (
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
                  onText={handleText}
                  onRadio={handleRadio}
                  onDropdown={handleDropdown}
                  onMultiSelect={handleMultiSelect}
                  onRating={handleRating}
                  isSubmitted={!!submittedQuestions[question.id]} // ✅ locked state
                  isSubmitting={submittingQuestion === question.id} // ✅ loading state
                  onQuestionSubmit={() => handleQuestionSubmit(question.id)} // ✅ per-question submit
                />
              ))
            ) : (
              <p className={`text-sm ${textColor.muted} text-center py-12`}>
                No questions available for this day.
              </p>
            )}
          </div>

          {/* Next Day Button — shown after all questions submitted and more days exist */}
          {dayCompleted && hasMoreDays && (
            <div className="flex justify-end pt-4 border-t border-dashed border-emerald-300 dark:border-emerald-700">
              <button
                onClick={handleNextDay}
                className="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md flex items-center gap-2 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                Next Day (Day {allDaysData[currentDayIndex + 1]?.day_no})
              </button>
            </div>
          )}

          {/* Footer */}
          <div className={`mt-4 pt-4 border-t ${borderColor.primary}`}>
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

// ─── Question Card ─────────────────────────────────────────────────────────────
const QuestionCard = ({
  question,
  index,
  answers,
  hoverRating,
  setHoverRating,
  theme,
  textColor,
  bgColor,
  borderColor,
  onText,
  onRadio,
  onDropdown,
  onMultiSelect,
  onRating,
  isSubmitted, // ✅ locks the question
  isSubmitting, // ✅ shows spinner on this question's button
  onQuestionSubmit, // ✅ submits only this question
}) => {
  const { id, question_text, option_type, options } = question;

  const hasAnswer =
    answers[id] !== undefined &&
    (Array.isArray(answers[id])
      ? answers[id].length > 0
      : String(answers[id]).trim() !== "");

  const getOptionList = () => {
    if (!options) return [];

    if (Array.isArray(options)) {
      if (typeof options[0] === "string") return options;
      if (options[0]?.text) {
        return Array.isArray(options[0].text)
          ? options[0].text
          : [options[0].text];
      }
    }

    return [];
  };

  const optionList = getOptionList();

  const optionTypeLabel = {
    1: "Text",
    2: "Radio",
    3: "Dropdown",
    4: "Multiple Select",
    5: "Rating",
  };

  // Disabled styles when locked
  const lockedOverlay = isSubmitted
    ? theme === "dark"
      ? "border-emerald-700 bg-emerald-900/10 opacity-80"
      : "border-emerald-300 bg-emerald-50/50 opacity-80"
    : "";

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-4 sm:p-5 border transition-all duration-200
      ${isSubmitted ? lockedOverlay : `${borderColor.secondary} ${bgColor.secondary}`}`}
    >
      {/* Left accent bar when submitted */}
      {isSubmitted && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-l-xl" />
      )}

      {/* Lock badge */}
      {isSubmitted && (
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            theme === "dark"
              ? "bg-emerald-900/40 text-emerald-400"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          <Lock className="w-3 h-3" />
          Submitted
        </div>
      )}

      {/* Question header */}
      <div className="flex items-start gap-3 mb-4 pl-1">
        <span
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
          ${isSubmitted ? "bg-emerald-500 text-white" : theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"}`}
        >
          {isSubmitted ? "✓" : index + 1}
        </span>
        <div className="flex-1 pr-20">
          <p
            className={`text-sm font-medium ${textColor.primary} leading-relaxed`}
          >
            {question_text}
            {!isSubmitted && <span className="text-red-500 ml-1">*</span>}
          </p>
          <span
            className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
              theme === "dark"
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {optionTypeLabel[option_type] || "Unknown"}
          </span>
        </div>
      </div>

      {/* Answer inputs — disabled when submitted */}
      <div className="pl-9">
        {option_type === 1 && (
          <textarea
            placeholder={isSubmitted ? "" : "Type your answer here..."}
            value={answers[id] || ""}
            onChange={(e) => onText(id, e.target.value)}
            disabled={isSubmitted}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg text-sm resize-none transition-all duration-200
              ${bgColor.primary} ${textColor.primary} border ${borderColor.secondary}
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
              ${isSubmitted ? "cursor-not-allowed opacity-60" : ""}`}
          />
        )}

        {option_type === 2 && (
          <div className="flex flex-col gap-2">
            {optionList.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-150
                ${isSubmitted ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                ${
                  answers[id] === opt
                    ? theme === "dark"
                      ? "bg-emerald-900/30 border-emerald-600 text-emerald-300"
                      : "bg-emerald-50 border-emerald-400 text-emerald-800"
                    : `${borderColor.primary} ${bgColor.primary} ${!isSubmitted ? bgColor.hover : ""} ${textColor.secondary}`
                }`}
              >
                <input
                  type="radio"
                  name={`q_${id}`}
                  value={opt}
                  checked={answers[id] === opt}
                  onChange={() => onRadio(id, opt)}
                  disabled={isSubmitted}
                  className="accent-emerald-600 w-4 h-4 shrink-0"
                />
                <span className="text-sm">{opt}</span>
                {answers[id] === opt && (
                  <ChevronRight className="w-4 h-4 ml-auto text-emerald-500" />
                )}
              </label>
            ))}
          </div>
        )}

        {option_type === 3 && (
          <select
            value={answers[id] || ""}
            onChange={(e) => onDropdown(id, e.target.value)}
            disabled={isSubmitted}
            className={`w-full px-4 py-2.5 rounded-lg text-sm border transition-all duration-150
              ${bgColor.primary} ${textColor.primary} ${borderColor.secondary}
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
              ${isSubmitted ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
              ${answers[id] ? (theme === "dark" ? "border-emerald-600" : "border-emerald-400") : ""}`}
          >
            <option value="">— Select an option —</option>
            {optionList.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {option_type === 4 && (
          <div className="flex flex-col gap-2">
            <p className={`text-xs ${textColor.muted} mb-1`}>
              Select all that apply
            </p>
            {optionList.map((opt, i) => {
              const checked =
                Array.isArray(answers[id]) && answers[id].includes(opt);
              return (
                <label
                  key={i}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-150
                  ${isSubmitted ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                  ${
                    checked
                      ? theme === "dark"
                        ? "bg-emerald-900/30 border-emerald-600 text-emerald-300"
                        : "bg-emerald-50 border-emerald-400 text-emerald-800"
                      : `${borderColor.primary} ${bgColor.primary} ${!isSubmitted ? bgColor.hover : ""} ${textColor.secondary}`
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={checked}
                    onChange={() => onMultiSelect(id, opt)}
                    disabled={isSubmitted}
                    className="accent-emerald-600 w-4 h-4 shrink-0"
                  />
                  <span className="text-sm">{opt}</span>
                  {checked && (
                    <CheckCircle className="w-4 h-4 ml-auto text-emerald-500" />
                  )}
                </label>
              );
            })}
          </div>
        )}

        {option_type === 5 && (
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hoverRating[id] || answers[id] || 0);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => onRating(id, star)}
                    onMouseEnter={() =>
                      !isSubmitted &&
                      setHoverRating((prev) => ({ ...prev, [id]: star }))
                    }
                    onMouseLeave={() =>
                      !isSubmitted &&
                      setHoverRating((prev) => ({ ...prev, [id]: 0 }))
                    }
                    disabled={isSubmitted}
                    className={`p-1 rounded-lg transition-all duration-150 ${!isSubmitted ? bgColor.hover : "cursor-not-allowed"} focus:outline-none`}
                  >
                    <Star
                      className={`w-8 h-8 transition-all duration-150 ${
                        filled
                          ? "fill-yellow-400 text-yellow-400 scale-110"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            {answers[id] > 0 && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
              >
                {
                  ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                    answers[id]
                  ]
                }{" "}
                · {answers[id]}/5
              </span>
            )}
          </div>
        )}

        {/* ✅ Per-question Submit Button */}
        {!isSubmitted && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onQuestionSubmit}
              disabled={!hasAnswer || isSubmitting}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200
                ${
                  hasAnswer && !isSubmitting
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm hover:shadow-md cursor-pointer"
                    : theme === "dark"
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTrackingForm;
