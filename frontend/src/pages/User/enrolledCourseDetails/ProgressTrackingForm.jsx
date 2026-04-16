import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ClipboardList,
  CheckCircle,
  ChevronRight,
  Send,
  Star,
  Lock,
} from "lucide-react";

import {
  fetchUserResponseAPI,
  postUserProgressAPI,
} from "@/store/feature/user";

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
    submittedQuestions: reduxSubmittedQuestions,
    submittedAnswers: reduxSubmittedAnswers,
    completedDays,
    currentDayIndex,
  } = useUserProgressDetails(courseId);

  const [answers, setAnswers] = useState({});
  const [hoverRating, setHoverRating] = useState({});
  const [submittingQuestion, setSubmittingQuestion] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const weekNo = weekData?.week_no || 1;
  const totalDays = weekData?.total_days || 7;
  const allDaysData = weekData?.data || [];

  const currentDayData = allDaysData[currentDayIndex] || {};
  const questions = currentDayData?.questions || [];
  const dayNo = currentDayData?.day_no || 1;
  const hasMoreDays = currentDayIndex < allDaysData.length - 1;

  useEffect(() => {
    if (courseId) {
      dispatch(fetchUserResponseAPI({ courseId }));
    }
  }, [courseId, dispatch]);

  // Check if day is completed
  const dayCompleted = useMemo(() => {
    if (!questions.length) return false;
    return questions.every((q) => reduxSubmittedQuestions?.[q.id]);
  }, [questions, reduxSubmittedQuestions]);

  useEffect(() => {
    if (reduxSubmittedAnswers && reduxSubmittedAnswers[dayNo]) {
      const savedAnswers = reduxSubmittedAnswers[dayNo];
      setAnswers(savedAnswers);
      setIsDataLoaded(true);
    } else {
      setAnswers({});
      setIsDataLoaded(true);
    }
  }, [reduxSubmittedAnswers, dayNo, questions.length]);

  // Also load answers when the component first mounts and when weekData changes
  useEffect(() => {
    if (weekData && !isLoading && reduxSubmittedAnswers) {
      if (reduxSubmittedAnswers[dayNo]) {
        const savedAnswers = reduxSubmittedAnswers[dayNo];
        setAnswers(savedAnswers);
      }
    }
  }, [weekData, isLoading, reduxSubmittedAnswers, dayNo]);

  const forceRefreshAnswers = useCallback(async () => {
    if (!courseId) return;
    try {
      await dispatch(fetchUserResponseAPI({ courseId })).unwrap();
    } catch (err) {
      console.error("Failed to refresh answers:", err);
    }
  }, [dispatch, courseId]);

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
      const newValue = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return {
        ...prev,
        [id]: newValue,
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

    if (!hasAnswer || reduxSubmittedQuestions[questionId]) return;

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

      // Persist to Redux
      dispatch(markQuestionSubmitted({ questionId }));

      // ✅ Force refresh answers from server
      await forceRefreshAnswers();

      // Check if all questions in this day are now done
      const updatedSubmitted = {
        ...reduxSubmittedQuestions,
        [questionId]: true,
      };
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
      dispatch(setCurrentDayIndex(currentDayIndex + 1));
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
  const submittedCount = questions.filter(
    (q) => reduxSubmittedQuestions[q.id],
  ).length;
  const progressPct =
    totalQuestions > 0
      ? Math.round((submittedCount / totalQuestions) * 100)
      : 0;

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
              questions.map((question, idx) => {
                return (
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
                    isSubmitted={!!reduxSubmittedQuestions[question.id]}
                    isSubmitting={submittingQuestion === question.id}
                    onQuestionSubmit={() => handleQuestionSubmit(question.id)}
                  />
                );
              })
            ) : (
              <p className={`text-sm ${textColor.muted} text-center py-12`}>
                No questions available for this day.
              </p>
            )}
          </div>

          {/* Next Day Button */}
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

// QuestionCard component remains the same as in your code
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
  isSubmitted,
  isSubmitting,
  onQuestionSubmit,
}) => {
  const { id, question_text, option_type, options } = question;

  const currentAnswer = answers[id];

  const hasAnswer =
    currentAnswer !== undefined &&
    (Array.isArray(currentAnswer)
      ? currentAnswer.length > 0
      : String(currentAnswer).trim() !== "");

  const getOptionList = () => {
    if (!options) return [];

    if (Array.isArray(options) && options[0]?.text) {
      const arr = Array.isArray(options[0].text)
        ? options[0].text
        : [options[0].text];

      return arr.map((text, index) => ({
        id: index + 1,
        text,
      }));
    }

    if (Array.isArray(options)) return options;

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
      {isSubmitted && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-l-xl" />
      )}

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

      <div className="pl-9">
        {option_type === 1 && (
          <textarea
            placeholder={isSubmitted ? "" : "Type your answer here..."}
            value={currentAnswer || ""}
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
          <div className="w-full">
            <div className="flex flex-col gap-3">
              {optionList.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-150 w-full
                    ${isSubmitted ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                    ${
                      currentAnswer === opt.id
                        ? theme === "dark"
                          ? "bg-emerald-900/30 border-emerald-600 text-emerald-300"
                          : "bg-emerald-50 border-emerald-400 text-emerald-800"
                        : `${borderColor.primary} ${bgColor.primary} ${!isSubmitted ? bgColor.hover : ""} ${textColor.secondary}`
                    }`}
                >
                  <input
                    type="radio"
                    name={`q_${id}`}
                    value={opt.id}
                    checked={currentAnswer === opt.id}
                    onChange={() => onRadio(id, opt.id)}
                    disabled={isSubmitted}
                    className="accent-emerald-600 w-4 h-4 shrink-0"
                  />
                  <span className="text-sm flex-1">{opt.text}</span>
                  {currentAnswer === opt.id && (
                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {option_type === 3 && (
          <select
            value={currentAnswer || ""}
            onChange={(e) => onDropdown(id, parseInt(e.target.value))}
            disabled={isSubmitted}
            className={`w-full px-4 py-2.5 rounded-lg text-sm border transition-all duration-150
              ${bgColor.primary} ${textColor.primary} ${borderColor.secondary}
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
              ${isSubmitted ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
              ${currentAnswer ? (theme === "dark" ? "border-emerald-600" : "border-emerald-400") : ""}`}
          >
            <option value="">— Select an option —</option>
            {optionList.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.text}
              </option>
            ))}
          </select>
        )}

        {option_type === 4 && (
          <div className="w-full">
            <p className={`text-xs ${textColor.muted} mb-2`}>
              Select all that apply
            </p>
            <div className="flex flex-col gap-2">
              {optionList.map((opt) => {
                const checked =
                  Array.isArray(currentAnswer) &&
                  currentAnswer.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-150 w-full
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
                      checked={checked}
                      onChange={() => onMultiSelect(id, opt.id)}
                      disabled={isSubmitted}
                      className="accent-emerald-600 w-4 h-4 shrink-0"
                    />
                    <span className="text-sm flex-1">{opt.text}</span>
                    {checked && (
                      <CheckCircle className="w-4 h-4 ml-auto text-emerald-500" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {option_type === 5 && (
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-1 flex-wrap">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hoverRating[id] || currentAnswer || 0);
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
            {currentAnswer > 0 && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
              >
                {
                  ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                    currentAnswer
                  ]
                }{" "}
                · {currentAnswer}/5
              </span>
            )}
          </div>
        )}

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
