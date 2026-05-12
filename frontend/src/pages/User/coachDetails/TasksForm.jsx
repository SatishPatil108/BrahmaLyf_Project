import { useState } from "react";
import {
  Lock,
  Calendar,
  Book,
  List,
  ChevronDown,
  Star,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditorWithLock";
import RichTextEditorWithLock from "@/components/RichTextEditor/RichTextEditorWithLock";

const optionTypeLabel = {
  1: "Text",
  2: "Radio",
  3: "Dropdown",
  4: "Multiple Select",
  5: "Rating",
  6: "Progress Bar",
};

function QuestionCard({ question, index, theme, isLocked = true }) {
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Helper function to parse options
  const getOptionList = () => {
    const options = question.options;
    if (!options) return [];

    // Handle nested options array format
    if (Array.isArray(options) && options[0]?.text) {
      const arr = Array.isArray(options[0].text)
        ? options[0].text
        : [options[0].text];

      return arr.map((text, index) => ({
        id: index + 1,
        text,
      }));
    }

    // Handle simple array format
    if (Array.isArray(options)) return options;

    return [];
  };

  const optionList = getOptionList();

  // Theme colors for QuestionCard
  const themeColors = {
    dark: {
      cardBg: "bg-gray-800/50 backdrop-blur-sm",
      cardBorder: "border-gray-700",
      cardHover: "hover:shadow-lg hover:shadow-purple-900/20",
      numberBg: "bg-gray-700",
      numberText: "text-gray-300",
      questionText: "text-gray-100",
      dayBadgeBg: "bg-gray-700",
      dayBadgeBorder: "border-gray-600",
      dayBadgeText: "text-gray-300",
      textareaBg: "bg-gray-800",
      textareaBorder: "border-gray-700",
      textareaText: "text-gray-200",
      buttonBg: "bg-gray-800",
      buttonBorder: "border-gray-700",
      buttonText: "text-gray-500",
      radioBg: "bg-gray-800",
      radioBorder: "border-gray-600",
      radioText: "text-gray-300",
      dropdownBg: "bg-gray-800",
      dropdownBorder: "border-gray-700",
      dropdownText: "text-gray-200",
      starColor: "text-gray-600",
      starHoverColor: "text-yellow-500",
      starSelectedColor: "text-yellow-500",
      progressBg: "bg-gray-700",
      progressFill: "bg-gradient-to-r from-purple-600 to-pink-500",
      lockedOverlay: "border-purple-700 bg-purple-900/10 opacity-80",
    },
    light: {
      cardBg: "bg-white",
      cardBorder: "border-gray-200",
      cardHover: "hover:shadow-md",
      numberBg: "bg-gray-100",
      numberText: "text-gray-600",
      questionText: "text-gray-900",
      dayBadgeBg: "bg-gray-100",
      dayBadgeBorder: "border-gray-200",
      dayBadgeText: "text-gray-600",
      textareaBg: "bg-gray-50",
      textareaBorder: "border-gray-200",
      textareaText: "text-gray-700",
      buttonBg: "bg-gray-100",
      buttonBorder: "border-gray-200",
      buttonText: "text-gray-400",
      radioBg: "bg-white",
      radioBorder: "border-gray-300",
      radioText: "text-gray-700",
      dropdownBg: "bg-white",
      dropdownBorder: "border-gray-200",
      dropdownText: "text-gray-900",
      starColor: "text-gray-300",
      starHoverColor: "text-yellow-400",
      starSelectedColor: "text-yellow-500",
      progressBg: "bg-gray-200",
      progressFill: "bg-gradient-to-r from-purple-500 to-pink-400",
      lockedOverlay: "border-purple-300 bg-purple-50/50 opacity-80",
    },
  };

  const colors = themeColors[theme] || themeColors.light;

  // Locked overlay classes
  const lockedOverlay = isLocked ? colors.lockedOverlay : "";

  // Render different input types based on option_type
  const renderInputField = () => {
    switch (question.option_type) {
      case 1: // Text
        return (
          <RichTextEditorWithLock
            value={answer}
            onChange={(val) => setAnswer(val)}
            isSubmitted={isLocked}
            bgColor={colors}
            textColor={colors}
            borderColor={colors}
          />
        );

      case 2: // Radio
        return (
          <div className="w-full">
            <div className="flex flex-col gap-3">
              {optionList.map((opt) => (
                <label
                  key={opt.option_id}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-150 w-full
                    ${isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                    ${
                      selectedOption === opt.option_id
                        ? theme === "dark"
                          ? "bg-purple-900/30 border-purple-600 text-purple-300"
                          : "bg-purple-50 border-purple-400 text-purple-800"
                        : `${colors.radioBorder} ${colors.radioBg} ${!isLocked ? "hover:bg-gray-50 dark:hover:bg-gray-700" : ""} ${colors.radioText}`
                    }`}
                >
                  <input
                    type="radio"
                    name={`q_${question.question_id}`}
                    value={opt.option_id}
                    checked={selectedOption === opt.option_id}
                    onChange={() => setSelectedOption(opt.option_id)}
                    disabled={isLocked}
                    className="accent-purple-600 w-4 h-4 shrink-0"
                  />
                  <span className="text-sm flex-1">{opt.text}</span>
                  {selectedOption === opt.option_id && (
                    <ChevronRight className="w-4 h-4 text-purple-500" />
                  )}
                </label>
              ))}
            </div>
          </div>
        );

      case 3: // Dropdown
        return (
          <select
            value={selectedOption || ""}
            onChange={(e) => setSelectedOption(parseInt(e.target.value))}
            disabled={isLocked}
            className={`w-full px-4 py-2.5 rounded-lg text-sm border transition-all duration-150
              ${colors.dropdownBg} ${colors.dropdownText} ${colors.dropdownBorder}
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
              ${isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
              ${selectedOption ? (theme === "dark" ? "border-purple-600" : "border-purple-400") : ""}`}
          >
            <option value="">— Select an option —</option>
            {optionList.map((opt) => (
              <option key={opt.option_id} value={opt.option_id}>
                {opt.text}
              </option>
            ))}
          </select>
        );

      case 4: // Multiple Select
        return (
          <div className="w-full">
            <p className={`text-xs ${colors.radioText} mb-2`}>
              Select all that apply
            </p>
            <div className="flex flex-col gap-2">
              {optionList.map((opt) => {
                const checked = selectedOptions.includes(opt.option_id);
                return (
                  <label
                    key={opt.option_id}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-150 w-full
                      ${isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                      ${
                        checked
                          ? theme === "dark"
                            ? "bg-purple-900/30 border-purple-600 text-purple-300"
                            : "bg-purple-50 border-purple-400 text-purple-800"
                          : `${colors.radioBorder} ${colors.radioBg} ${!isLocked ? "hover:bg-gray-50 dark:hover:bg-gray-700" : ""} ${colors.radioText}`
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        if (checked) {
                          setSelectedOptions(
                            selectedOptions.filter(
                              (id) => id !== opt.option_id,
                            ),
                          );
                        } else {
                          setSelectedOptions([
                            ...selectedOptions,
                            opt.option_id,
                          ]);
                        }
                      }}
                      disabled={isLocked}
                      className="accent-purple-600 w-4 h-4 shrink-0"
                    />
                    <span className="text-sm flex-1">{opt.text}</span>
                    {checked && (
                      <CheckCircle className="w-4 h-4 ml-auto text-purple-500" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 5: // Rating
        return (
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-1 flex-wrap">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => !isLocked && setRating(star)}
                    onMouseEnter={() => !isLocked && setHoverRating(star)}
                    onMouseLeave={() => !isLocked && setHoverRating(0)}
                    disabled={isLocked}
                    className={`p-1 rounded-lg transition-all duration-150 ${!isLocked ? "hover:bg-gray-100 dark:hover:bg-gray-700" : "cursor-not-allowed"} focus:outline-none`}
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
            {rating > 0 && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
              >
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}{" "}
                · {rating}/5
              </span>
            )}
          </div>
        );

      case 6: // Progress Bar
        return (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isLocked || rating <= 0}
                onClick={() => !isLocked && setRating(Math.max(0, rating - 10))}
                className={`w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700
                  text-lg text-gray-400 flex items-center justify-center flex-shrink-0
                  transition-all hover:bg-gray-100 dark:hover:bg-gray-800
                  disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                −
              </button>

              <div
                onClick={(e) => {
                  if (isLocked) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const raw = Math.round(
                    ((e.clientX - rect.left) / rect.width) * 100,
                  );
                  const snapped = Math.round(raw / 10) * 10;
                  setRating(Math.max(0, Math.min(100, snapped)));
                }}
                className={`flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700 overflow-hidden
                  ${!isLocked ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
              >
                <div
                  className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-400"
                  style={{ width: `${rating}%` }}
                />
              </div>

              <button
                type="button"
                disabled={isLocked || rating >= 100}
                onClick={() =>
                  !isLocked && setRating(Math.min(100, rating + 10))
                }
                className={`w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700
                  text-lg text-gray-400 flex items-center justify-center flex-shrink-0
                  transition-all hover:bg-gray-100 dark:hover:bg-gray-800
                  disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                +
              </button>

              <span className="text-sm font-medium min-w-[42px] text-right tabular-nums text-purple-600 dark:text-purple-400">
                {rating}%
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border self-start
              ${theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-500"}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              {rating === 0
                ? "Not started"
                : rating === 100
                  ? "Completed"
                  : `${rating}% Complete`}
            </span>
          </div>
        );

      default:
        return (
          <RichTextEditorWithLock
            value={answer}
            onChange={(val) => setAnswer(val)}
            isSubmitted={isLocked}
            bgColor={colors}
            textColor={colors}
            borderColor={colors}
          />
        );
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${colors.cardBg} border ${colors.cardBorder} rounded-xl p-4 sm:p-5 shadow-sm transition-all duration-300 ${colors.cardHover} ${lockedOverlay}`}
    >
      {/* Locked indicator bar */}
      {isLocked && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-l-xl" />
      )}

      {/* Locked badge */}
      {isLocked && (
        <div
          className={`absolute top-1 right-1 sm:top-5 sm:right-28 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium z-10 ${
            theme === "dark"
              ? "bg-purple-900/40 text-purple-400"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          <Lock className="w-3 h-3" />
          Locked
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-7 h-7 flex items-center justify-center ${colors.numberBg} rounded-full flex-shrink-0 ${
              isLocked ? "opacity-60" : ""
            }`}
          >
            <span className={`text-xs font-semibold ${colors.numberText}`}>
              Q{index + 1}
            </span>
          </div>
          <div className="flex-1">
            <p
              className={`text-sm sm:text-base font-semibold ${colors.questionText} leading-relaxed ${
                isLocked ? "opacity-80" : ""
              }`}
            >
              {question.question_text}
            </p>
            <span
              className={`inline-block text-xs ${colors.dayBadgeText} mt-1`}
            >
              Option Type: {optionTypeLabel[question.option_type]}
            </span>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 ${colors.dayBadgeBg} rounded-lg border ${colors.dayBadgeBorder} w-fit sm:flex-shrink-0 ${
            isLocked ? "opacity-60" : ""
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span className={`text-xs font-semibold ${colors.dayBadgeText}`}>
            Day {question.day_no}
          </span>
        </div>
      </div>

      <div className={`pl-9 ${isLocked ? "opacity-80" : ""}`}>
        {renderInputField()}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          disabled
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all
            ${
              isLocked
                ? `${colors.buttonText} ${colors.buttonBg} border ${colors.buttonBorder} cursor-not-allowed opacity-70`
                : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-sm hover:shadow-md cursor-pointer"
            } rounded-lg`}
        >
          <Lock className="w-4 h-4" />
          {isLocked ? "Locked - Submit Disabled" : "Submit Answer"}
        </button>
      </div>
    </div>
  );
}

export default function TasksForm({
  courseId,
  weekNo,
  taskQuestions,
  isLocked = true,
}) {
  const { theme } = useTheme();

  // Theme colors for main component
  const themeColors = {
    dark: {
      container: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      warningBg: "bg-amber-950/30",
      warningBorder: "border-amber-800",
      warningText: "text-amber-400",
      pillBg: "bg-gray-800",
      pillBorder: "border-gray-700",
      pillText: "text-gray-300",
    },
    light: {
      container: "bg-transparent",
      warningBg: "bg-amber-50",
      warningBorder: "border-amber-300",
      warningText: "text-amber-700",
      pillBg: "bg-gray-100",
      pillBorder: "border-gray-200",
      pillText: "text-gray-600",
    },
  };

  const colors = themeColors[theme] || themeColors.light;

  return (
    <div
      className={`max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 font-sans ${colors.container}`}
    >
      {/* Warning Banner */}
      <div
        className={`flex items-center gap-2 px-4 py-3 ${colors.warningBg} border ${colors.warningBorder} rounded-lg mb-6 transition-colors duration-300`}
      >
        <Lock className="w-4 h-4" />
        <span className={`text-sm font-medium ${colors.warningText}`}>
          {isLocked
            ? "These questions are currently locked. Submission is disabled until you complete the prerequisites."
            : "Answer the questions below and submit your responses."}
        </span>
      </div>

      {/* Meta Info Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colors.pillBg} border ${colors.pillBorder} rounded-lg text-xs sm:text-sm font-medium ${colors.pillText} transition-colors duration-300`}
        >
          <Book className="w-3.5 h-3.5" />
          Course {courseId}
        </div>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colors.pillBg} border ${colors.pillBorder} rounded-lg text-xs sm:text-sm font-medium ${colors.pillText} transition-colors duration-300`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Week {weekNo}
        </div>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colors.pillBg} border ${colors.pillBorder} rounded-lg text-xs sm:text-sm font-medium ${colors.pillText} transition-colors duration-300`}
        >
          <List className="w-3.5 h-3.5" />
          {taskQuestions?.length || 0} Questions
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4 sm:space-y-5">
        {taskQuestions?.map((q, i) => (
          <QuestionCard
            key={q.question_id}
            question={q}
            index={i}
            theme={theme}
            isLocked={isLocked}
          />
        ))}
      </div>
    </div>
  );
}
