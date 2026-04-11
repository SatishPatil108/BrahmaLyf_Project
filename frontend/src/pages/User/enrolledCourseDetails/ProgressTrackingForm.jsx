import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  ClipboardList,
  CheckCircle,
  ChevronRight,
  Send,
  Star,
  Calendar,
} from "lucide-react";

import { postUserProgressAPI } from "@/store/feature/user";
import useUserProgressDetails from "./useUserProgressDetails";

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

const ProgressTrackingForm = ({ courseId, theme, onSubmitSuccess }) => {
  const dispatch = useDispatch();

  const {
    progressTrackingQuestionsDetails,
    isLoading,
    error,
    effectiveWeek,
    effectiveDay,
    submittedToday,
    questions,
  } = useUserProgressDetails(courseId);

  const hasSubmittedToday = submittedToday;
  const totalQuestions = questions.length;

  const [answers, setAnswers] = useState({});
  const [hoverRating, setHoverRating] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAnswers({});
  }, [effectiveWeek, effectiveDay, courseId]);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;
  const progressPct =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const isInitialized =
    !isLoading && (questions.length > 0 || hasSubmittedToday);

  const handleText = (questionId, value) => {
    if (value.trim()) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    } else {
      setAnswers((prev) => {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleRadio = (questionId, value) =>
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  const handleDropdown = (questionId, value) => {
    if (value) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    } else {
      setAnswers((prev) => {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleMultiSelect = (questionId, value) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (updated.length === 0) {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [questionId]: updated };
    });
  };

  const handleRating = (questionId, value) =>
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        postUserProgressAPI({
          weekNo: effectiveWeek,
          dayNo: effectiveDay,
          courseId,
          answers,
        }),
      ).unwrap();
      onSubmitSuccess?.();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Theme helpers ─────────────────────────────────────────────────────────────
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

  // ── Loading / Error ─────────────────────────────────────────────

  if (isLoading && !hasSubmittedToday)
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

  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-400">
          {error || "Something went wrong."}
        </p>
      </div>
    );

  // ✅ Single flag — true if API says already submitted OR user just submitted
  const showSubmittedCard = hasSubmittedToday;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`
          relative overflow-hidden
          ${bgColor.card} rounded-xl shadow-sm
          border ${borderColor.primary}
          transition-all duration-300 hover:shadow-md
        `}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="p-4 sm:p-6 md:p-8">
          {showSubmittedCard ? (
            <div className="text-center animate-fadeIn py-4">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>

              <h3 className={`text-xl font-bold ${textColor.primary} mb-2`}>
                Progress Recorded! 🎉
              </h3>

              <p className={`${textColor.secondary} mb-5`}>
                Your responses for Week {effectiveWeek} · Day {effectiveDay}{" "}
                have been saved.
              </p>

              <div className="flex items-center justify-center gap-1 mb-5">
                {[...Array(totalQuestions)].map((_, i) => (
                  <CheckCircle
                    key={i}
                    className="w-5 h-5 text-emerald-500 dark:text-emerald-400"
                  />
                ))}
              </div>

              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-emerald-900/20 text-emerald-300"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Response submitted</span>
              </div>

              <p className={`mt-6 text-sm ${textColor.muted}`}>
                Come back tomorrow for Day {effectiveDay + 1}! 🚀
              </p>
            </div>
          ) : (
            // ── Active form ───────────────────────────────────────────────────
            <>
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
                      Week {effectiveWeek} · Day {effectiveDay}
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
                  {answeredCount}/{totalQuestions} Answered
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-medium ${textColor.muted}`}>
                    Progress
                  </span>
                  <span
                    className={`text-xs font-medium ${allAnswered ? "text-emerald-500" : textColor.muted}`}
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
              <div className="flex flex-col gap-5 mb-8">
                {!isInitialized ? (
                  // ── Still waiting for real data ──────────────────────────────────
                  <div className="flex items-center justify-center py-12">
                    <div className="relative w-10 h-10">
                      <div className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-gray-700" />
                      <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                    </div>
                    <p className={`ml-4 text-sm ${textColor.muted}`}>
                      Loading questions...
                    </p>
                  </div>
                ) : questions.length > 0 ? (
                  // ── Render questions ─────────────────────────────────────────────
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
                    />
                  ))
                ) : (
                  // ── Only show this if truly no questions after loading ───────────
                  <p className={`text-sm ${textColor.muted} text-center py-12`}>
                    No questions available for this day. Please check back
                    later.
                  </p>
                )}
              </div>

              {/* Submit Row */}
              <div
                className={`flex flex-col sm:flex-row gap-3 sm:items-center justify-between pt-4 border-t ${borderColor.primary}`}
              >
                <p
                  className={`text-xs ${textColor.muted} flex items-center gap-1`}
                >
                  <span className="text-red-500">*</span> All questions required
                </p>
                <button
                  disabled={!allAnswered || isSubmitting}
                  onClick={handleSubmit}
                  className={`
                    relative px-6 py-3 rounded-lg font-medium text-sm sm:text-base
                    transition-all duration-200 flex items-center justify-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                    ${theme === "dark" ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}
                    transform hover:-translate-y-0.5 active:translate-y-0
                    ${
                      allAnswered
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg"
                        : theme === "dark"
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                      <Send className="w-4 h-4" />
                      <span>Submit Responses</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Footer — always visible */}
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

// ─── Question Card ────────────────────────────────────────────────────────────
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
}) => {
  const { id, question_text, option_type, options } = question;

  const isAnswered =
    answers[id] !== undefined &&
    (Array.isArray(answers[id])
      ? answers[id].length > 0
      : String(answers[id]).trim() !== "");

  const optionList = Array.isArray(options?.[0]?.text) ? options[0].text : [];

  const optionTypeLabel = {
    1: "Text",
    2: "Radio",
    3: "Dropdown",
    4: "Multiple Select",
    5: "Rating",
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl p-4 sm:p-5
        border transition-all duration-200
        ${
          isAnswered
            ? theme === "dark"
              ? "border-emerald-700 bg-emerald-900/10"
              : "border-emerald-300 bg-emerald-50/50"
            : `${borderColor.secondary} ${bgColor.secondary}`
        }
      `}
    >
      {isAnswered && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-l-xl" />
      )}

      <div className="flex items-start gap-3 mb-4 pl-1">
        <span
          className={`
          mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
          ${isAnswered ? "bg-emerald-500 text-white" : theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"}
        `}
        >
          {isAnswered ? "✓" : index + 1}
        </span>
        <div className="flex-1">
          <p
            className={`text-sm font-medium ${textColor.primary} leading-relaxed`}
          >
            {question_text}
            <span className="text-red-500 ml-1">*</span>
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
            placeholder="Type your answer here..."
            onChange={(e) => onText(id, e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg text-sm resize-none transition-all duration-200
              ${bgColor.primary} ${textColor.primary} border ${borderColor.secondary}
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
          />
        )}

        {option_type === 2 && (
          <div className="flex flex-col gap-2">
            {optionList.map((opt, i) => (
              <label
                key={i}
                className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer border transition-all duration-150
                ${
                  answers[id] === opt
                    ? theme === "dark"
                      ? "bg-emerald-900/30 border-emerald-600 text-emerald-300"
                      : "bg-emerald-50 border-emerald-400 text-emerald-800"
                    : `${borderColor.primary} ${bgColor.primary} ${bgColor.hover} ${textColor.secondary}`
                }`}
              >
                <input
                  type="radio"
                  name={`q_${id}`}
                  value={opt}
                  checked={answers[id] === opt}
                  onChange={() => onRadio(id, opt)}
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
            className={`w-full px-4 py-2.5 rounded-lg text-sm border transition-all duration-150 cursor-pointer
              ${bgColor.primary} ${textColor.primary} ${borderColor.secondary}
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
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
                  className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer border transition-all duration-150
                  ${
                    checked
                      ? theme === "dark"
                        ? "bg-emerald-900/30 border-emerald-600 text-emerald-300"
                        : "bg-emerald-50 border-emerald-400 text-emerald-800"
                      : `${borderColor.primary} ${bgColor.primary} ${bgColor.hover} ${textColor.secondary}`
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={checked}
                    onChange={() => onMultiSelect(id, opt)}
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
                      setHoverRating((prev) => ({ ...prev, [id]: star }))
                    }
                    onMouseLeave={() =>
                      setHoverRating((prev) => ({ ...prev, [id]: 0 }))
                    }
                    className={`p-1 rounded-lg transition-all duration-150 ${bgColor.hover} focus:outline-none`}
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
                className={`text-xs px-2 py-1 rounded-full ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
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
      </div>
    </div>
  );
};

export default ProgressTrackingForm;
