import { useTheme } from "@/contexts/ThemeContext";
import { CheckCircle2, ChevronRight, Lock, Send, Star } from "lucide-react";
import React, { useMemo } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

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

// ─── Shared option item styles ────────────────────────────────────────────────

const optionBase =
  "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-150 w-full text-left";

// ─── Sub-components ───────────────────────────────────────────────────────────

const SubmittedBadge = ({ isDark = false }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500 dark:bg-green-800 text-black dark:text-gray-400`}
    >
      <Lock className="w-2.5 h-2.5" aria-hidden="true" />
      Submitted
    </span>
  );
};

const SubmitButton = ({ hasAnswer, isSubmitting, onClick, isDark = false }) => {
  return (
    <div className="mt-4 flex justify-end">
      <button
        onClick={onClick}
        disabled={!hasAnswer || isSubmitting}
        aria-disabled={!hasAnswer || isSubmitting}
        className={`inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all ${
          hasAnswer && !isSubmitting
            ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
        } ${hasAnswer && !isSubmitting ? "shadow-sm" : "cursor-not-allowed"}`}
      >
        {isSubmitting ? (
          <>
            <span
              className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"
              aria-hidden="true"
            />
            Submitting…
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            Submit
          </>
        )}
      </button>
    </div>
  );
};

// ─── Input renderers ──────────────────────────────────────────────────────────

const TextInput = ({ id, value, isSubmitted, onText, isDark = false }) => {
  return (
    <textarea
      value={value ?? ""}
      onChange={(e) => onText(id, e.target.value)}
      disabled={isSubmitted}
      readOnly={isSubmitted}
      rows={4}
      placeholder={isSubmitted ? "Answer submitted" : "Write your answer here…"}
      className={`w-full px-4 py-3 rounded-xl border text-sm resize-none text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all ${
        isSubmitted
          ? "bg-green-200 dark:bg-gray-800/50 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-60"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    />
  );
};

const RadioInput = ({
  id,
  optionList,
  currentAnswer,
  isSubmitted,
  onRadio,
  isDark = false,
}) => {
  return (
    <div className="flex flex-col gap-2" role="radiogroup">
      {optionList.map((opt) => {
        const selected = currentAnswer === opt.id;
        return (
          <label
            key={opt.id}
            className={`${optionBase} transition-all duration-200 cursor-pointer ${
              selected
                ? "border-green-400 bg-green-50 dark:bg-green-450/30 ring-2 ring-green-400/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
            } ${isSubmitted ? "cursor-not-allowed opacity-60 bg-green-200" : ""}`}
          >
            <input
              type="radio"
              name={`q_${id}`}
              value={opt.id}
              checked={selected}
              onChange={() => onRadio(id, opt.id)}
              disabled={isSubmitted}
              className={`w-4 h-4 flex-shrink-0 accent-blue-600 dark:accent-blue-500`}
            />
            <span className="flex-1">{opt.text}</span>
            {selected &&
              (isSubmitted ? (
                <CheckCircle2
                  className="w-4 h-4 flex-shrink-0 text-green-600 dark:text-green-500"
                  aria-hidden="true"
                />
              ) : (
                <ChevronRight
                  className="w-4 h-4 flex-shrink-0 text-blue-500"
                  aria-hidden="true"
                />
              ))}
          </label>
        );
      })}
    </div>
  );
};

const DropdownInput = ({
  id,
  optionList,
  currentAnswer,
  isSubmitted,
  onDropdown,
  isDark = false,
}) => {
  return (
    <select
      value={currentAnswer ?? ""}
      onChange={(e) => onDropdown(id, parseInt(e.target.value))}
      disabled={isSubmitted}
      className={`w-full px-4 py-3 rounded-xl text-sm border transition-all duration-150 appearance-none ${
        isSubmitted
          ? "bg-green-200 dark:bg-green-800/50 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
      }`}
    >
      <option value="">— Select an option —</option>
      {optionList.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.text}
        </option>
      ))}
    </select>
  );
};

const MultiSelectInput = ({
  id,
  optionList,
  currentAnswer,
  isSubmitted,
  onMultiSelect,
  isDark = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {isSubmitted ? "Selected answers" : "Select all that apply"}
      </p>
      {optionList.map((opt) => {
        const checked =
          Array.isArray(currentAnswer) && currentAnswer.includes(opt.id);
        return (
          <label
            key={opt.id}
            className={`${optionBase} transition-all duration-200 cursor-pointer ${
              checked
                ? "border-green-500 bg-blue-50 dark:bg-green-950/30 ring-2 ring-green-500/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
            } ${isSubmitted ? "cursor-not-allowed opacity-60 bg-green-200" : ""}`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onMultiSelect(id, opt.id)}
              disabled={isSubmitted}
              className={`w-4 h-4 flex-shrink-0 rounded accent-blue-600 dark:accent-blue-500`}
            />
            <span className="flex-1">{opt.text}</span>
            {checked && (
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0 text-green-600 dark:text-green-500"
                aria-hidden="true"
              />
            )}
          </label>
        );
      })}
    </div>
  );
};

const StarInput = ({
  id,
  currentAnswer,
  hoverRating,
  setHoverRating,
  isSubmitted,
  onRating,
}) => {
  const active = hoverRating?.[id] || currentAnswer || 0;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex items-center gap-1"
        role="group"
        aria-label="Star rating"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !isSubmitted && onRating(id, star)}
            onMouseEnter={() =>
              !isSubmitted && setHoverRating((p) => ({ ...p, [id]: star }))
            }
            onMouseLeave={() =>
              !isSubmitted && setHoverRating((p) => ({ ...p, [id]: 0 }))
            }
            disabled={isSubmitted}
            className={`p-1 rounded-lg transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60 ${
              isSubmitted
                ? "cursor-not-allowed"
                : "hover:bg-yellow-50 dark:hover:bg-yellow-500/10"
            }`}
          >
            <Star
              className={`w-8 h-8 transition-all duration-100 ${
                star <= active
                  ? "fill-yellow-400 text-yellow-400 scale-110"
                  : "text-gray-300 dark:text-gray-600"
              }`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      {currentAnswer > 0 && (
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-400 self-start">
          {RATING_LABELS[currentAnswer]}
          <span className="text-gray-400 dark:text-gray-600">·</span>
          {currentAnswer}/5
        </span>
      )}
    </div>
  );
};

const ProgressBarInput = ({
  id,
  currentAnswer,
  isSubmitted,
  onRating,
  isDark = false,
}) => {
  const val = currentAnswer ?? 0;

  const getLabel = (value) => {
    if (value === 0) return "Not rated";
    if (value <= 20) return "Poor";
    if (value <= 40) return "Fair";
    if (value <= 50) return "Below average";
    if (value <= 60) return "Average";
    if (value <= 70) return "Above average";
    if (value <= 80) return "Good";
    if (value <= 90) return "Very good";
    if (value <= 99) return "Excellent";
    return "Outstanding";
  };

  const getColorClass = (value) => {
    if (value === 0) return "bg-gray-300 dark:bg-gray-600";
    if (value <= 20) return "bg-red-500";
    if (value <= 40) return "bg-orange-500";
    if (value <= 50) return "bg-yellow-500";
    if (value <= 60) return "bg-lime-500";
    if (value <= 70) return "bg-green-500";
    if (value <= 80) return "bg-emerald-500";
    if (value <= 90) return "bg-teal-500";
    return "bg-blue-600 dark:bg-blue-500";
  };

  const getDotClass = (value) => {
    if (value === 0) return "bg-gray-400";
    if (value <= 20) return "bg-red-500";
    if (value <= 40) return "bg-orange-500";
    if (value <= 50) return "bg-yellow-500";
    if (value <= 60) return "bg-lime-500";
    if (value <= 70) return "bg-green-500";
    if (value <= 80) return "bg-emerald-500";
    if (value <= 90) return "bg-teal-500";
    return "bg-blue-600 dark:bg-blue-500";
  };

  const adjust = (delta) => {
    if (isSubmitted) return;
    onRating(id, Math.max(0, Math.min(100, val + delta)));
  };

  const handleBarClick = (e) => {
    if (isSubmitted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const raw = ((e.clientX - rect.left) / rect.width) * 100;
    onRating(id, Math.max(0, Math.min(100, Math.round(raw / 10) * 10)));
  };

  const stepBtnClass = `w-8 h-8 rounded-lg border text-lg flex items-center justify-center flex-shrink-0 transition-colors
    border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-gray-400
    hover:bg-gray-100 dark:hover:bg-white/[0.06]
    disabled:opacity-30 disabled:cursor-not-allowed
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/40`;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={isSubmitted || val <= 0}
          onClick={() => adjust(-10)}
          className={stepBtnClass}
        >
          −
        </button>

        <div
          role="slider"
          onClick={handleBarClick}
          className={`flex-1 h-2.5 rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden ${
            isSubmitted ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${getColorClass(val)}`}
            style={{ width: `${val}%` }}
          />
        </div>

        <button
          type="button"
          disabled={isSubmitted || val >= 100}
          onClick={() => adjust(10)}
          className={stepBtnClass}
        >
          +
        </button>
      </div>

      <div className="flex items-center justify-center gap-3">
        <span
          className={`text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100`}
        >
          {val}%
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-gray-600 dark:text-gray-400">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getDotClass(val)}`}
            aria-hidden="true"
          />
          {getLabel(val)}
        </span>
      </div>
    </div>
  );
};

// ─── QuestionCard ─────────────────────────────────────────────────────────────

const QuestionCard = React.memo(
  ({
    question,
    index,
    answers,
    hoverRating,
    setHoverRating,
    onText,
    onRadio,
    onDropdown,
    onMultiSelect,
    onRating,
    isSubmitted,
    isSubmitting,
    onQuestionSubmit,
  }) => {
    const isDark = useTheme();

    const { id, question_text, option_type, options } = question;
    const currentAnswer = answers[id];
    const optionList = useMemo(() => getOptionList(options), [options]);

    const hasAnswer =
      currentAnswer !== undefined &&
      (Array.isArray(currentAnswer)
        ? currentAnswer.length > 0
        : String(currentAnswer).trim() !== "");

    const getCardClasses = () => {
      if (isSubmitted) {
        return `border shadow-sm transition-all duration-200 ${
          isDark
            ? "border-gray-700 bg-gray-800/30"
            : "border-gray-200 bg-gray-50/80"
        }`;
      }
      return `border shadow-sm transition-all duration-200 ${
        isDark
          ? "border-gray-700/50 bg-gray-800/50"
          : "border-gray-200 bg-white"
      }`;
    };
    
    return (
      <div
        className={`relative overflow-hidden rounded-2xl ${getCardClasses()}`}
      >
        <div className="p-4 sm:p-5">
          {/* Question header */}
          <div className="flex items-start gap-3 mb-4">
            {/* Index / check badge */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isSubmitted
                  ? "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-500"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              {isSubmitted ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                index + 1
              )}
            </div>

            {/* Question text + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <p
                  className={`text-[15px] font-semibold leading-7 ${isDark ? "text-gray-100" : "text-gray-900"}`}
                  dangerouslySetInnerHTML={{ __html: question_text }}
                />
                {isSubmitted && <SubmittedBadge isDark={isDark} />}
              </div>
              {!isSubmitted && (
                <span
                  className="inline-block mt-1 text-xs text-red-500 dark:text-red-400"
                  aria-label="Required"
                >
                  Required
                </span>
              )}
            </div>
          </div>

          {/* Input section */}
          <div>
            {option_type === 1 && (
              <TextInput
                id={id}
                value={currentAnswer}
                isSubmitted={isSubmitted}
                onText={onText}
                isDark={isDark}
              />
            )}
            {option_type === 2 && (
              <RadioInput
                id={id}
                optionList={optionList}
                currentAnswer={currentAnswer}
                isSubmitted={isSubmitted}
                onRadio={onRadio}
                isDark={isDark}
              />
            )}
            {option_type === 3 && (
              <DropdownInput
                id={id}
                optionList={optionList}
                currentAnswer={currentAnswer}
                isSubmitted={isSubmitted}
                onDropdown={onDropdown}
                isDark={isDark}
              />
            )}
            {option_type === 4 && (
              <MultiSelectInput
                id={id}
                optionList={optionList}
                currentAnswer={currentAnswer}
                isSubmitted={isSubmitted}
                onMultiSelect={onMultiSelect}
                isDark={isDark}
              />
            )}
            {option_type === 5 && (
              <StarInput
                id={id}
                currentAnswer={currentAnswer}
                hoverRating={hoverRating}
                setHoverRating={setHoverRating}
                isSubmitted={isSubmitted}
                onRating={onRating}
              />
            )}
            {option_type === 6 && (
              <ProgressBarInput
                id={id}
                currentAnswer={currentAnswer}
                isSubmitted={isSubmitted}
                onRating={onRating}
                isDark={isDark}
              />
            )}

            {!isSubmitted && (
              <SubmitButton
                hasAnswer={hasAnswer}
                isSubmitting={isSubmitting}
                onClick={onQuestionSubmit}
                isDark={isDark}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

QuestionCard.displayName = "QuestionCard";
export default QuestionCard;
