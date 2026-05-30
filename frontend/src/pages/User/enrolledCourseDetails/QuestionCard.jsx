import { CheckCircle, ChevronRight, Lock, Send, Star } from "lucide-react";
import React, { useMemo } from "react";
// ─── QuestionCard ──────────────────────────────────────────────────────────────
const OPTION_TYPE_LABELS = {
  1: "Text",
  2: "Radio",
  3: "Dropdown",
  4: "Multiple Select",
  5: "Rating",
  6: "Progress Bar",
};

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const PROGRESS_LABELS = {
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

const getProgressColor = (v) => {
  if (v === 0) return undefined;
  if (v <= 20) return "#ef4444";
  if (v <= 40) return "#f97316";
  if (v <= 50) return "#eab308";
  if (v <= 60) return "#84cc16";
  return "#22c55e";
};

const getOptionList = (options) => {
  if (!options?.length) return [];
  if (options[0]?.text) {
    const arr = Array.isArray(options[0].text)
      ? options[0].text
      : [options[0].text];
    return arr.map((text, i) => ({ id: i + 1, text }));
  }
  return options;
};

const QuestionCard = React.memo(
  ({
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
    const optionList = useMemo(() => getOptionList(options), [options]);

    const hasAnswer =
      currentAnswer !== undefined &&
      (Array.isArray(currentAnswer)
        ? currentAnswer.length > 0
        : String(currentAnswer).trim() !== "");

    const lockedOverlay = isSubmitted
      ? theme === "dark"
        ? "border-emerald-700 bg-emerald-900/10"
        : "border-emerald-300 bg-emerald-50/50"
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
            className={`absolute mt-6 lg:mt-0 top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
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
            ${
              isSubmitted
                ? "bg-emerald-500 text-white"
                : theme === "dark"
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            {isSubmitted ? "✓" : index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs sm:text-sm font-medium ${textColor.primary} leading-relaxed`}
              dangerouslySetInnerHTML={{ __html: question_text }}
            />
            {!isSubmitted && <span className="text-red-500 ml-1">*</span>}
            <span
              className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {OPTION_TYPE_LABELS[option_type] ?? "Unknown"}
            </span>
          </div>
        </div>

        <div className="pl-1">
          {option_type === 1 && (
            <textarea
              value={currentAnswer ?? ""}
              onChange={(e) => onText(id, e.target.value)}
              disabled={isSubmitted}
              readOnly={isSubmitted}
              className={`w-full h-40 px-4 py-2.5 rounded-lg text-sm border transition-all duration-150
              ${bgColor.primary} ${textColor.primary} ${borderColor.secondary}
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
              ${isSubmitted ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
              ${currentAnswer && !isSubmitted ? (theme === "dark" ? "border-emerald-600" : "border-emerald-400") : ""}`}
              placeholder={
                isSubmitted ? "Answer submitted" : "Enter your answer..."
              }
            />
          )}

          {option_type === 2 && (
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
                  {currentAnswer === opt.id &&
                    (isSubmitted ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-emerald-500" />
                    ))}
                </label>
              ))}
            </div>
          )}

          {option_type === 3 && (
            <select
              value={currentAnswer ?? ""}
              onChange={(e) => onDropdown(id, parseInt(e.target.value))}
              disabled={isSubmitted}
              className={`w-full px-4 py-2.5 rounded-lg text-sm border transition-all duration-150
              ${bgColor.primary} ${textColor.primary} ${borderColor.secondary}
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
              ${isSubmitted ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
              ${currentAnswer && !isSubmitted ? (theme === "dark" ? "border-emerald-600" : "border-emerald-400") : ""}`}
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
            <div>
              <p className={`text-xs ${textColor.muted} mb-2`}>
                {isSubmitted ? "Selected answers:" : "Select all that apply"}
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
                  const filled =
                    star <= (hoverRating[id] || currentAnswer || 0);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => !isSubmitted && onRating(id, star)}
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
                  {RATING_LABELS[currentAnswer]} · {currentAnswer}/5
                </span>
              )}
            </div>
          )}

          {option_type === 6 &&
            (() => {
              const val = currentAnswer ?? 0;
              const color = getProgressColor(val);

              const adjust = (delta) => {
                if (isSubmitted) return;
                onRating(id, Math.max(0, Math.min(100, val + delta)));
              };

              const handleBarClick = (e) => {
                if (isSubmitted) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const snapped =
                  Math.round(
                    Math.round(((e.clientX - rect.left) / rect.width) * 100) /
                      10,
                  ) * 10;
                onRating(id, Math.max(0, Math.min(100, snapped)));
              };

              return (
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isSubmitted || val <= 0}
                      onClick={() => adjust(-10)}
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-lg text-gray-400 flex items-center justify-center flex-shrink-0 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <div
                      onClick={handleBarClick}
                      className={`flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden ${!isSubmitted ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
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
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-lg text-gray-400 flex items-center justify-center flex-shrink-0 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <div className="mx-auto p-3 flex items-center gap-5">
                    <span
                      className="text-sm font-medium min-w-[42px] text-right tabular-nums"
                      style={{ color: color ?? undefined }}
                    >
                      {val}%
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border self-start ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-gray-300"
                          : "bg-gray-50 border-gray-200 text-gray-500"
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: color ?? "#888" }}
                      />
                      {PROGRESS_LABELS[val] ?? `${val}%`}
                      {val > 0 ? ` · ${val}%` : ""}
                    </span>
                  </div>
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
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
  },
);

export default QuestionCard

