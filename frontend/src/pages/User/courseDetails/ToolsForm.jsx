import React, { useState, useCallback, useMemo, memo } from "react";
import {
  Lock,
  Calendar,
  LayoutList,
  Send,
  AlertCircle,
  Check,
  ThumbsUp,
  Clock,
  Award,
  Zap,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

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
    cardHover: isDark
      ? "hover:border-gray-700"
      : "hover:border-gray-300 hover:shadow-xl hover:shadow-violet-500/5",
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
      ? "bg-gray-800/50 border-gray-700 focus:border-violet-500 focus:ring-violet-500"
      : "bg-gray-50 border-gray-200 focus:border-violet-400 focus:ring-violet-400",
    badge: isDark
      ? "bg-gray-800 border-gray-700"
      : "bg-gray-100 border-gray-200",
    lockedBadge: isDark
      ? "bg-violet-950/60 border-violet-700 text-violet-400"
      : "bg-violet-50 border-violet-200 text-violet-600",
  };
};

// ─── Question Card Component ────────────────────────────────────────────────

const QuestionCard = memo(
  ({ question, index, isLocked, tokens, onAnswerChange }) => {
    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAnswerChange = useCallback(
      (e) => {
        const value = e.target.value;
        setAnswer(value);
        if (onAnswerChange) {
          onAnswerChange(question.question_id, value);
        }
      },
      [onAnswerChange, question.question_id],
    );

    const handleSubmit = useCallback(async () => {
      if (isLocked || !answer.trim()) return;
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsSubmitting(false);
    }, [isLocked, answer]);

    const hasAnswer = answer && answer.trim().length > 0;

    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`
          relative rounded-2xl transition-all duration-300 overflow-hidden
          ${isLocked ? `${tokens.card} opacity-75` : `${tokens.card} ${tokens.cardHover}`}
        `}
      >
        <div className="md:p-2">
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
                 
              </div>
            </div>

            {isLocked && (
              <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800/50 text-amber-300 shrink-0">
                <Lock className="w-3.5 h-3.5" />
                Locked
              </div>
            )}
          </div>

          {/* Textarea Input - Only input type */}
          <div>
            <textarea
              value={answer}
              onChange={handleAnswerChange}
              disabled={isLocked}
              rows={5}
              placeholder={
                isLocked
                  ? "Locked - Complete prerequisites to answer"
                  : "Share your thoughts..."
              }
              className={`
                w-full px-4 py-3 rounded-xl border text-sm leading-relaxed resize-y
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:border-transparent
                ${tokens.input} ${tokens.text}
                ${isLocked ? "cursor-not-allowed opacity-60" : "cursor-text"}
              `}
            />
          </div>

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

export default function ToolsForm({
  courseId,
  weekNo,
  toolQuestions = [],
  isLocked = true,
  onSubmit,
}) {
  const { theme } = useTheme();
  const tokens = useMemo(() => createThemeTokens(theme), [theme]);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;

  const totalPages = Math.ceil(toolQuestions.length / questionsPerPage);
  const paginatedQuestions = toolQuestions.slice(
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
  }, [answers, onSubmit]);

  const answeredCount = Object.keys(answers).filter((id) =>
    answers[id]?.trim(),
  ).length;
  const progress = toolQuestions.length
    ? (answeredCount / toolQuestions.length) * 100
    : 0;

  return (
    <div>
      <div className="max-w-4xl mx-auto py-6 md:py-10">
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
          {!isLocked && toolQuestions.length > 0 && (
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
                {answeredCount} of {toolQuestions.length} questions answered
              </p>
            </div>
          )}
        </div>

        {/* Metadata Pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { icon: Clock, label: `Week ${weekNo}` },
            { icon: LayoutList, label: `${toolQuestions.length} Questions` },
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
        {toolQuestions.length > 0 ? (
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

            {/* Pagination with arrows */}
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
            {!isLocked &&
              answeredCount === toolQuestions.length &&
              toolQuestions.length > 0 && (
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
