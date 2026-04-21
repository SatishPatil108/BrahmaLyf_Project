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
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";

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
  const [showCompletionCard, setShowCompletionCard] = useState(false);
  const [showCompletedForm, setShowCompletedForm] = useState(false);
  const completionTimeoutRef = useRef(null);

  const weekNo = weekData?.week_no || 1;
  const totalDays = weekData?.total_days || 7;
  const allDaysData = weekData?.data || [];

  // Flatten all questions from all days
  const allQuestions = useMemo(() => {
    return allDaysData.flatMap((day) =>
      (day.questions || []).map((q) => ({
        ...q,
        day_no: day.day_no,
        day_index: day.day_no - 1,
      })),
    );
  }, [allDaysData]);

  // Group questions by day for better organization
  const questionsByDay = useMemo(() => {
    const grouped = {};
    allDaysData.forEach((day) => {
      if (day.questions && day.questions.length > 0) {
        grouped[day.day_no] = {
          dayNo: day.day_no,
          questions: day.questions,
        };
      }
    });
    return grouped;
  }, [allDaysData]);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchUserResponseAPI({ courseId }));
    }
  }, [courseId, dispatch]);

  // Load all answers across all days
  useEffect(() => {
    if (reduxSubmittedAnswers) {
      const merged = {};
      Object.keys(reduxSubmittedAnswers).forEach((dayKey) => {
        const dayAnswers = reduxSubmittedAnswers[dayKey];
        Object.assign(merged, dayAnswers);
      });
      setAnswers(merged);
      setIsDataLoaded(true);
    }
  }, [reduxSubmittedAnswers]);

  // Check for completion and show success card
  const totalQuestions = allQuestions.length;
  const submittedCount = allQuestions.filter(
    (q) => reduxSubmittedQuestions[q.id],
  ).length;
  const allCompleted = totalQuestions > 0 && submittedCount === totalQuestions;

  // Handle showing completion card and then showing filled form
  useEffect(() => {
    if (allCompleted && !showCompletionCard && !showCompletedForm) {
      // Clear any existing timeout
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }

      // Show completion card
      setShowCompletionCard(true);

      // After 4.5 seconds, hide completion card and show filled form
      completionTimeoutRef.current = setTimeout(() => {
        setShowCompletionCard(false);
        setShowCompletedForm(true);
      }, 4500);
    }

    // Cleanup timeout on unmount or when allCompleted becomes false
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, [allCompleted, showCompletionCard, showCompletedForm]);

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

  const handleQuestionSubmit = async (questionId, dayNo) => {
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

      // Force refresh answers from server
      await forceRefreshAnswers();

      // Check if all questions in this day are now done
      const dayQuestions = allQuestions.filter((q) => q.day_no === dayNo);
      const updatedSubmitted = {
        ...reduxSubmittedQuestions,
        [questionId]: true,
      };
      const allDone = dayQuestions.every((q) => updatedSubmitted[q.id]);
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

  // Show all questions with filled answers after completion card
  if (allCompleted && showCompletedForm) {
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
                    Your Submitted Answers
                  </h2>
                  <p className={`text-sm ${textColor.muted}`}>
                    Week {weekNo} · All {totalQuestions} questions completed
                  </p>
                </div>
              </div>
              <div
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${theme === "dark" ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}
              >
                Complete ✓
              </div>
            </div>

            {/* Progress Bar - 100% */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-medium ${textColor.muted}`}>
                  Overall Progress
                </span>
                <span className={`text-xs font-medium text-emerald-500`}>
                  100%
                </span>
              </div>
              <div
                className={`h-2 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {/* Questions with Vertical Scroll - All filled and locked */}
            <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
              {Object.keys(questionsByDay).map((dayNo) => {
                const day = questionsByDay[dayNo];
                const dayQuestions = day.questions;

                return (
                  <div key={dayNo} className="mb-4">
                    {/* Day Header */}
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-emerald-200 dark:border-emerald-800">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400`}
                      >
                        Day {dayNo}
                      </div>
                      <span className={`text-xs ${textColor.muted}`}>
                        {dayQuestions.length}/{dayQuestions.length} Completed
                      </span>
                      <CheckCircle className="w-4 h-4 text-emerald-500 ml-2" />
                    </div>

                    {/* Day's Questions - All locked with submitted answers */}
                    <div className="flex flex-col gap-5">
                      {dayQuestions.map((question, idx) => (
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
                          isSubmitted={true} // All questions are submitted
                          isSubmitting={false}
                          onQuestionSubmit={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className={`mt-6 pt-4 border-t ${borderColor.primary}`}>
              <p className={`text-xs ${textColor.muted} text-center`}>
                All your responses have been saved successfully. Great job
                completing this week! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show regular form (not all questions completed yet)
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
                  Week {weekNo} · All Days ({totalDays} days)
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
                Overall Progress
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

          {/* Questions with Vertical Scroll */}
          <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
            {Object.keys(questionsByDay).map((dayNo) => {
              const day = questionsByDay[dayNo];
              const dayQuestions = day.questions;
              const daySubmittedCount = dayQuestions.filter(
                (q) => reduxSubmittedQuestions[q.id],
              ).length;
              const dayCompleted = daySubmittedCount === dayQuestions.length;

              return (
                <div key={dayNo} className="mb-4">
                  {/* Day Header */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-emerald-200 dark:border-emerald-800">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        dayCompleted
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Day {dayNo}
                    </div>
                    <span className={`text-xs ${textColor.muted}`}>
                      {daySubmittedCount}/{dayQuestions.length} Completed
                    </span>
                    {dayCompleted && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 ml-2" />
                    )}
                  </div>

                  {/* Day's Questions */}
                  <div className="flex flex-col gap-5">
                    {dayQuestions.map((question, idx) => (
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
                        onQuestionSubmit={() =>
                          handleQuestionSubmit(question.id, parseInt(dayNo))
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {allQuestions.length === 0 && (
              <p className={`text-sm ${textColor.muted} text-center py-12`}>
                No questions available.
              </p>
            )}
          </div>

          {/* Footer */}
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

// QuestionCard component remains the same as your existing one
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
    6: "Progress Bar",
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
          <RichTextEditor
            value={currentAnswer || ""}
            onChange={(val) => onText(id, val)}
            isSubmitted={isSubmitted}
            bgColor={bgColor}
            textColor={textColor}
            borderColor={borderColor}
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

        {option_type === 6 &&
          (() => {
            const LABELS = {
              0: "Not rated",
              10: "Terrible",
              20: "Very poor",
              30: "Poor",
              40: "Below average",
              50: "Average",
              60: "Above average",
              70: "Good",
              80: "Very good",
              90: "Excellent",
              100: "Outstanding",
            };
            const getColor = (v) =>
              v === 0
                ? undefined
                : v <= 20
                  ? "#ef4444"
                  : v <= 40
                    ? "#f97316"
                    : v <= 50
                      ? "#eab308"
                      : v <= 60
                        ? "#84cc16"
                        : "#22c55e";

            const val = currentAnswer ?? 0;
            const color = getColor(val);

            const adjust = (delta) => {
              if (isSubmitted) return;
              const next = Math.max(0, Math.min(100, val + delta));
              onRating(id, next);
            };

            const handleBarClick = (e) => {
              if (isSubmitted) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const raw = Math.round(
                ((e.clientX - rect.left) / rect.width) * 100,
              );
              const snapped = Math.round(raw / 10) * 10;
              onRating(id, Math.max(0, Math.min(100, snapped)));
            };

            return (
              <div className="flex flex-col gap-3 w-full">
                {/* Bar row */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isSubmitted || val <= 0}
                    onClick={() => adjust(-10)}
                    className={`w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700
            text-lg text-gray-400 flex items-center justify-center flex-shrink-0
            transition-all hover:bg-gray-100 dark:hover:bg-gray-800
            disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    −
                  </button>

                  {/* Clickable progress bar */}
                  <div
                    onClick={handleBarClick}
                    className={`flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800
            border border-gray-200 dark:border-gray-700 overflow-hidden
            ${!isSubmitted ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${val}%`,
                        backgroundColor: color ?? "#888",
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitted || val >= 100}
                    onClick={() => adjust(10)}
                    className={`w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700
                    text-lg text-gray-400 flex items-center justify-center flex-shrink-0
                    transition-all hover:bg-gray-100 dark:hover:bg-gray-800
                    disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    +
                  </button>

                  <span
                    className="text-sm font-medium min-w-[42px] text-right tabular-nums"
                    style={{ color: color ?? undefined }}
                  >
                    {val}%
                  </span>
                </div>

                {/* Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border self-start
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-gray-300"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color ?? "#888" }}
                  />
                  {LABELS[val] ?? `${val}%`}
                  {val > 0 ? ` · ${val}%` : ""}
                </span>
              </div>
            );
          })()}

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
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Submitting...</span>
                </span>
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
