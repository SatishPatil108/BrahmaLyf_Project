import React, { useState, useCallback, useMemo, memo } from "react";
import {
  Lock,
  Calendar,
  BookOpen,
  LayoutList,
  Star,
  CheckCircle,
  ChevronRight,
  Send,
  AlertCircle,
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
  ThumbsUp,
  Clock,
  Award,
  Zap,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ──────────────────────────────────────────────────────────────

const OPTION_TYPES = {
  1: { label: "Text", icon: "📝", description: "Free text response" },
  2: { label: "Multiple Choice", icon: "🔘", description: "Select one option" },
  3: { label: "Dropdown", icon: "📋", description: "Choose from list" },
  4: {
    label: "Checkboxes",
    icon: "☑️",
    description: "Select multiple options",
  },
  5: { label: "Rating", icon: "⭐", description: "Rate from 1-5" },
  6: {
    label: "Progress",
    icon: "📊",
    description: "Set completion percentage",
  },
};

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

// ─── Theme System ───────────────────────────────────────────────────────────

const createThemeTokens = (theme) => {
  const isDark = theme === "dark";

  return {
    background: isDark
      ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
      : "bg-gradient-to-br from-gray-50 via-white to-gray-50",
    card: isDark
      ? "bg-gray-900/80 backdrop-blur-sm border-gray-800"
      : "bg-white/80 backdrop-blur-sm border-gray-200",
    cardHover: isDark ? "hover:border-gray-700" : "hover:border-gray-300",
    bannerLocked: isDark
      ? "bg-amber-950/30 border-amber-800/50 text-amber-200"
      : "bg-amber-50 border-amber-200 text-amber-800",
    bannerOpen: isDark
      ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-200"
      : "bg-emerald-50 border-emerald-200 text-emerald-800",
    accent: isDark
      ? "from-violet-600 to-purple-600"
      : "from-violet-500 to-purple-500",
    accentHover: isDark
      ? "from-violet-500 to-purple-500"
      : "from-violet-600 to-purple-600",
    text: isDark ? "text-gray-100" : "text-gray-900",
    textSecondary: isDark ? "text-gray-400" : "text-gray-600",
    textMuted: isDark ? "text-gray-500" : "text-gray-400",
    border: isDark ? "border-gray-800" : "border-gray-200",
    input: isDark
      ? "bg-gray-800/50 border-gray-700 focus:border-violet-500"
      : "bg-gray-50 border-gray-200 focus:border-violet-400",
    badge: isDark
      ? "bg-gray-800 border-gray-700"
      : "bg-gray-100 border-gray-200",
  };
};

// ─── Helper Functions ───────────────────────────────────────────────────────

const parseOptions = (options) => {
  if (!options || !Array.isArray(options) || options.length === 0) return [];

  return options
    .flatMap((opt) => {
      const texts = Array.isArray(opt.option_text)
        ? opt.option_text
        : [String(opt.option_text || "")];
      return texts.map((text, i) => ({
        id: `${opt.option_id}-${i}`,
        text: String(text).trim(),
      }));
    })
    .filter((opt) => opt.text);
};

// ─── Components ─────────────────────────────────────────────────────────────

const OptionItem = memo(
  ({
    checked,
    onChange,
    disabled,
    type = "radio",
    label,
    name,
    value,
    tokens,
  }) => {
    const inputId = `${name}-${value}`;

    return (
      <motion.label
        htmlFor={inputId}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
        className={`
        group relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        ${
          checked
            ? `${tokens.border} bg-gradient-to-r ${type === "radio" ? "from-violet-50/50 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/30" : "from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30"} border-${type === "radio" ? "violet" : "emerald"}-300 dark:border-${type === "radio" ? "violet" : "emerald"}-700`
            : `${tokens.border} ${tokens.input} hover:border-gray-300 dark:hover:border-gray-600`
        }
      `}
      >
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
          w-4 h-4 rounded-full transition-all duration-200
          ${type === "checkbox" && "rounded"}
          focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
          ${checked ? "text-violet-600" : "text-gray-400"}
        `}
        />
        <span className={`flex-1 text-sm font-medium ${tokens.text}`}>
          {label}
        </span>
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="shrink-0"
          >
            {type === "radio" ? (
              <ChevronRight className="w-4 h-4 text-violet-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            )}
          </motion.div>
        )}
      </motion.label>
    );
  },
);

OptionItem.displayName = "OptionItem";

const RatingInput = memo(({ value, onChange, disabled, tokens }) => {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 flex-wrap">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={!disabled ? { scale: 1.1 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => !disabled && setHover(0)}
            disabled={disabled}
            className={`
              p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500
              ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 dark:hover:from-amber-950/30 dark:hover:to-yellow-950/30"}
            `}
            aria-label={`${star} star${star > 1 ? "s" : ""} - ${RATING_LABELS[star]}`}
          >
            <Star
              className={`
                w-8 h-8 transition-all duration-200
                ${
                  star <= display
                    ? "fill-amber-400 text-amber-400 drop-shadow-lg"
                    : "text-gray-300 dark:text-gray-600"
                }
              `}
            />
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {value > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span
              className={`
              inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border
              ${tokens.badge} ${tokens.textSecondary}
            `}
            >
              <Sparkles className="w-3 h-3" />
              {RATING_LABELS[value]} · {value}/5
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

RatingInput.displayName = "RatingInput";

const ProgressInput = memo(({ value, onChange, disabled, tokens }) => {
  const handleKey = useCallback(
    (e) => {
      if (disabled) return;
      if (e.key === "ArrowRight" || e.key === "ArrowUp")
        onChange(Math.min(100, value + 10));
      if (e.key === "ArrowLeft" || e.key === "ArrowDown")
        onChange(Math.max(0, value - 10));
    },
    [disabled, value, onChange],
  );

  const status =
    value === 0
      ? "Not started"
      : value === 100
        ? "Completed"
        : `${value}% complete`;
  const color = value === 100 ? "emerald" : value > 50 ? "violet" : "amber";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <motion.button
          whileHover={!disabled && value > 0 ? { scale: 1.05 } : {}}
          whileTap={!disabled && value > 0 ? { scale: 0.95 } : {}}
          disabled={disabled || value === 0}
          onClick={() => onChange(Math.max(0, value - 10))}
          className={`
            w-10 h-10 rounded-xl border flex items-center justify-center text-lg font-medium transition-all
            ${disabled || value === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-white"}
            ${tokens.border} ${tokens.text}
          `}
        >
          −
        </motion.button>

        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKey}
          className={`
            flex-1 min-w-[120px] relative cursor-pointer group
            ${disabled ? "cursor-not-allowed opacity-60" : ""}
          `}
          onClick={(e) => {
            if (disabled) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            onChange(Math.round(percent / 10) * 10);
          }}
        >
          <div
            className={`h-2 rounded-full overflow-hidden border ${tokens.border}`}
          >
            <motion.div
              className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600`}
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <motion.button
          whileHover={!disabled && value < 100 ? { scale: 1.05 } : {}}
          whileTap={!disabled && value < 100 ? { scale: 0.95 } : {}}
          disabled={disabled || value === 100}
          onClick={() => onChange(Math.min(100, value + 10))}
          className={`
            w-10 h-10 rounded-xl border flex items-center justify-center text-lg font-medium transition-all
            ${disabled || value === 100 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
            ${tokens.border} ${tokens.text}
          `}
        >
          +
        </motion.button>

        <div
          className={`text-sm font-bold tabular-nums min-w-[50px] text-right text-${color}-600 dark:text-${color}-400`}
        >
          {value}%
        </div>
      </div>

      <div
        className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border w-fit ${tokens.badge} ${tokens.textSecondary}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
        {status}
      </div>
    </div>
  );
});

ProgressInput.displayName = "ProgressInput";

const QuestionCard = memo(
  ({ question, index, isLocked, tokens, onAnswerChange }) => {
    const [answer, setAnswer] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const optionList = useMemo(
      () => parseOptions(question.options),
      [question.options],
    );
    const optionType = OPTION_TYPES[question.option_type];

    const handleAnswer = useCallback(
      (value) => {
        const newAnswer = { ...answer, ...value };
        setAnswer(newAnswer);
        if (onAnswerChange) {
          onAnswerChange(question.question_id, newAnswer);
        }
      },
      [answer, onAnswerChange, question.question_id],
    );

    const handleSubmit = useCallback(async () => {
      if (isLocked) return;
      setIsSubmitting(true);
      // Simulate submit - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsSubmitting(false);
    }, [isLocked]);

    const renderInput = () => {
      const commonProps = { disabled: isLocked, tokens };

      switch (question.option_type) {
        case 1:
          return (
            <textarea
              value={answer.text || ""}
              onChange={(e) => handleAnswer({ text: e.target.value })}
              rows={4}
              placeholder={
                isLocked
                  ? "Locked - Complete prerequisites to answer"
                  : "Share your thoughts..."
              }
              className={`
              w-full px-4 py-3 rounded-xl border text-sm leading-relaxed resize-y transition-all
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
              ${tokens.input} ${tokens.text}
              ${isLocked ? "cursor-not-allowed opacity-60" : ""}
            `}
            />
          );

        case 2:
          return (
            <div className="flex flex-col gap-2">
              {optionList.map((opt) => (
                <OptionItem
                  key={opt.id}
                  type="radio"
                  name={`q_${question.question_id}`}
                  value={opt.id}
                  label={opt.text}
                  checked={answer.selectedOption === opt.id}
                  onChange={() => handleAnswer({ selectedOption: opt.id })}
                  disabled={isLocked}
                  tokens={tokens}
                />
              ))}
            </div>
          );

        case 3:
          return (
            <select
              value={answer.selectedOption || ""}
              onChange={(e) =>
                handleAnswer({ selectedOption: e.target.value || undefined })
              }
              disabled={isLocked}
              className={`
              w-full px-4 py-2.5 rounded-xl border text-sm transition-all cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
              ${tokens.input} ${tokens.text}
              ${isLocked ? "cursor-not-allowed opacity-60" : ""}
            `}
            >
              <option value="">Select an option...</option>
              {optionList.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.text}
                </option>
              ))}
            </select>
          );

        case 4:
          return (
            <div className="flex flex-col gap-2">
              <p className={`text-xs font-medium ${tokens.textMuted}`}>
                Select all that apply
              </p>
              {optionList.map((opt) => (
                <OptionItem
                  key={opt.id}
                  type="checkbox"
                  name={`q_${question.question_id}_${opt.id}`}
                  value={opt.id}
                  label={opt.text}
                  checked={answer.selectedOptions?.includes(opt.id) || false}
                  onChange={() => {
                    const current = answer.selectedOptions || [];
                    const updated = current.includes(opt.id)
                      ? current.filter((id) => id !== opt.id)
                      : [...current, opt.id];
                    handleAnswer({ selectedOptions: updated });
                  }}
                  disabled={isLocked}
                  tokens={tokens}
                />
              ))}
            </div>
          );

        case 5:
          return (
            <RatingInput
              value={answer.rating || 0}
              onChange={(val) => handleAnswer({ rating: val })}
              disabled={isLocked}
              tokens={tokens}
            />
          );

        case 6:
          return (
            <ProgressInput
              value={answer.progress || 0}
              onChange={(val) => handleAnswer({ progress: val })}
              disabled={isLocked}
              tokens={tokens}
            />
          );

        default:
          return null;
      }
    };

    const hasAnswer = useMemo(() => {
      if (!answer) return false;
      return (
        answer.text ||
        answer.selectedOption ||
        (answer.selectedOptions && answer.selectedOptions.length) ||
        answer.rating ||
        answer.progress
      );
    }, [answer]);

    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`
        relative rounded-2xl transition-all duration-300 overflow-hidden
        ${isLocked ? `${tokens.card} opacity-75` : `${tokens.card} ${tokens.cardHover} hover:shadow-xl hover:shadow-violet-500/5`}
      `}
      >
        
        <div className="md:p-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div className="flex items-start gap-3">
              <div
                className={`
              w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              bg-gradient-to-br ${tokens.accent} shadow-lg
            `}
              >
                <span className="text-white text-sm font-bold">
                  {index + 1}
                </span>
              </div>

              <div className="flex-1">
                <h3
                  className={`text-sm md:text-lg font-semibold leading-relaxed ${tokens.text}`}
                  dangerouslySetInnerHTML={{ __html: question.question_text }}
                />
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    className={`
                  inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg
                  ${tokens.badge} ${tokens.textMuted}
                `}
                  >
                    <span>{optionType?.icon}</span>
                    <span>{optionType?.label}</span>
                  </span>
                  <div
                    className={`
                  inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg
                  ${tokens.badge} ${tokens.textSecondary}
                `}
                  >
                    <Calendar className="w-3 h-3" />
                    Day {question.day_no}
                  </div>
                </div>
              </div>
            </div>

            {isLocked && (
              <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800/50 text-amber-300 shrink-0">
                <Lock className="w-3.5 h-3.5" />
                Locked
              </div>
            )}
          </div>

          {/* Input area */}
          <div>{renderInput()}</div>

          {/* Footer */}
          <div className="pl-12 md:pl-14 mt-5 flex items-center justify-between gap-3 flex-wrap">
            {!hasAnswer && !isLocked && (
              <p
                className={`text-xs ${tokens.textMuted} flex items-center gap-1`}
              >
                <AlertCircle className="w-3 h-3" />
                No answer yet
              </p>
            )}

            {hasAnswer && !isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <Check className="w-3.5 h-3.5" />
                Answer saved
              </motion.div>
            )}

            {!isLocked && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting || !hasAnswer}
                className={`
                ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
                ${
                  !hasAnswer || isSubmitting
                    ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed"
                    : `bg-gradient-to-r ${tokens.accent} text-white shadow-md hover:shadow-lg`
                }
              `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : showSuccess ? (
                  <>
                    <ThumbsUp className="w-4 h-4" />
                    Submitted!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Answer
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.article>
    );
  },
);

QuestionCard.displayName = "QuestionCard";

// ─── Main Component ─────────────────────────────────────────────────────────

export default function TasksForm({
  courseId,
  weekNo,
  taskQuestions = [],
  isLocked = true,
  onSubmit,
}) {
  const { theme } = useTheme();
  const tokens = useMemo(() => createThemeTokens(theme), [theme]);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;

  const totalPages = Math.ceil(taskQuestions.length / questionsPerPage);
  const paginatedQuestions = taskQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage,
  );

  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleSubmitAll = useCallback(async () => {
    if (onSubmit) {
      await onSubmit(answers);
    }
    // Add success toast/notification here
  }, [answers, onSubmit]);

  const answeredCount = Object.keys(answers).length;
  const progress = taskQuestions.length
    ? (answeredCount / taskQuestions.length) * 100
    : 0;

  return (
    <div className={`min-h-screen`}>
      <div className="max-w-4xl mx-auto  py-6 md:py-10">
        {/* Hero Section */}
        <div className="mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 mb-4">
              <Zap className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                Week {weekNo}
              </span>
            </div>

            <h1
              className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r ${tokens.accent} bg-clip-text text-transparent`}
            >
              Weekly Tasks & Assessment
            </h1>

            <p
              className={`text-sm md:text-base ${tokens.textSecondary} max-w-2xl mx-auto`}
            >
              Complete the following questions to track your progress and
              demonstrate your understanding.
            </p>
          </motion.div>

          {/* Progress Bar */}
          {!isLocked && taskQuestions.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className={`font-medium ${tokens.textSecondary}`}>
                  Overall Progress
                </span>
                <span className={`font-bold ${tokens.text}`}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                <motion.div
                  className={`h-full bg-gradient-to-r ${tokens.accent}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p
                className={`text-xs ${tokens.textMuted} mt-2 flex items-center gap-1`}
              >
                <Award className="w-3 h-3" />
                {answeredCount} of {taskQuestions.length} questions answered
              </p>
            </div>
          )}
        </div>

        {/* Metadata Pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { icon: Clock, label: `Week ${weekNo}` },
            { icon: LayoutList, label: `${taskQuestions.length} Questions` },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${tokens.badge} ${tokens.textSecondary}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
          ))}
        </div>

        {/* Questions Grid */}
        {taskQuestions.length > 0 ? (
          <>
            <div className="flex flex-col gap-5">
              <AnimatePresence mode="sync">
                {paginatedQuestions.map((question, idx) => (
                  <QuestionCard
                    key={question.question_id}
                    question={question}
                    index={currentPage * questionsPerPage + idx}
                    isLocked={isLocked}
                    tokens={tokens}
                    onAnswerChange={handleAnswerChange}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className={`
                    p-2 rounded-xl border transition-all
                    ${currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                    ${tokens.border}
                  `}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`
                        w-8 h-8 rounded-lg text-sm font-medium transition-all
                        ${
                          currentPage === i
                            ? `bg-gradient-to-r ${tokens.accent} text-white`
                            : `${tokens.badge} ${tokens.textSecondary} hover:bg-gray-100 dark:hover:bg-gray-800`
                        }
                      `}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className={`
                    p-2 rounded-xl border transition-all
                    ${currentPage === totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                    ${tokens.border}
                  `}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            {/* Global Submit Button */}
            {!isLocked && answeredCount === taskQuestions.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky bottom-4 mt-8"
              >
                <button
                  onClick={handleSubmitAll}
                  className={`
                    w-full py-4 rounded-xl font-semibold text-white shadow-lg
                    bg-gradient-to-r ${tokens.accent} hover:bg-gradient-to-r hover:${tokens.accentHover}
                    transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02]
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit All Answers
                  </div>
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`
              flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed
              ${tokens.border}
            `}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-r ${tokens.accent} bg-opacity-10`}
            >
              <LayoutList className={`w-8 h-8 ${tokens.textSecondary}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${tokens.text}`}>
              No Questions Available
            </h3>
            <p className={`text-sm ${tokens.textSecondary}`}>
              Check back later for new tasks and assessments.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
