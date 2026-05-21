import { useState } from "react";
import { Lock, Calendar, Book, List, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import RichTextEditorWithLock from "@/components/RichTextEditor/RichTextEditorWithLock";

function QuestionCard({ question, index, theme, isLocked = true }) {
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  // Parse options
  const getOptionList = () => {
    const options = question.options;
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

  // Theme colors
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
      radioBg: "bg-gray-800",
      radioBorder: "border-gray-600",
      radioText: "text-gray-300",
      lockedOverlay: "border-purple-700 bg-purple-900/10 opacity-80",
      lockedBadgeBg: "bg-purple-900/40",
      lockedBadgeText: "text-purple-400",
      lockedBar: "from-purple-500 to-pink-500",
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
      radioBg: "bg-white",
      radioBorder: "border-gray-300",
      radioText: "text-gray-700",
      lockedOverlay: "border-purple-300 bg-purple-50/50 opacity-80",
      lockedBadgeBg: "bg-purple-100",
      lockedBadgeText: "text-purple-700",
      lockedBar: "from-purple-500 to-pink-400",
    },
  };

  const colors = themeColors[theme] || themeColors.light;
  const lockedOverlay = isLocked ? colors.lockedOverlay : "";

  // Render radio button options (single option type)
  const renderRadioOptions = () => {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-3">
          {optionList.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-150 w-full
                ${isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                ${
                  selectedOption === opt.id
                    ? theme === "dark"
                      ? "bg-purple-900/30 border-purple-600 text-purple-300"
                      : "bg-purple-50 border-purple-400 text-purple-800"
                    : `${colors.radioBorder} ${colors.radioBg} ${!isLocked ? "hover:bg-gray-50 dark:hover:bg-gray-700" : ""} ${colors.radioText}`
                }`}
            >
              <input
                type="radio"
                name={`q_${question.question_id}`}
                value={opt.id}
                checked={selectedOption === opt.id}
                onChange={() => setSelectedOption(opt.id)}
                disabled={isLocked}
                className="accent-purple-600 w-4 h-4 shrink-0"
              />
              <span className="text-sm flex-1">{opt.text}</span>
              {selectedOption === opt.id && (
                <ChevronRight className="w-4 h-4 text-purple-500" />
              )}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative overflow-hidden ${colors.cardBg} border ${colors.cardBorder} rounded-xl p-4 sm:p-5 shadow-sm transition-all duration-300 ${colors.cardHover} ${lockedOverlay}`}
    >
      {/* Locked indicator bar */}
      {isLocked && (
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colors.lockedBar} rounded-l-xl`}
        />
      )}

      {/* Locked badge */}
      {isLocked && (
        <div
          className={`absolute top-1 right-1 sm:top-5 sm:right-28 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium z-10
            ${colors.lockedBadgeBg} ${colors.lockedBadgeText}`}
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
              dangerouslySetInnerHTML={{
                __html: question.question_text,
              }}
            />
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
        {renderRadioOptions()}
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

export default function ToolsForm({
  courseId,
  weekNo,
  toolQuestions,
  isLocked = true,
}) {
  const { theme } = useTheme();

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
          {toolQuestions?.length || 0} Questions
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4 sm:space-y-5">
        {toolQuestions?.map((q, i) => (
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
