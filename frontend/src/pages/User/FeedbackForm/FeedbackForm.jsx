import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { postCourseFeedbackAPI } from "@/store/feature/user";
import { Send, CheckCircle, Lock, AlertCircle, Loader2 } from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const RATING_LABELS = {
  1: "Not what I expected",
  2: "Could be better",
  3: "Pretty good",
  4: "Really enjoyed it",
  5: "Excellent — highly recommend",
};

const QUICK_TAGS = [
  "Great content",
  "Clear explanations",
  "Well paced",
  "Practical examples",
  "Needs more depth",
  "Too fast",
];

const MAX_CHARS = 500;

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarIcon({ filled, hovered }) {
  const path =
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  if (filled)
    return (
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full fill-amber-400 stroke-amber-400"
      >
        <path d={path} />
      </svg>
    );
  if (hovered)
    return (
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full fill-amber-100 stroke-amber-400 dark:fill-amber-900/30"
      >
        <path d={path} />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-full h-full fill-none stroke-gray-300 dark:stroke-gray-600"
    >
      <path d={path} />
    </svg>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mt-2 flex items-center gap-1.5 text-xs text-rose-500"
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5">
      {children}
    </p>
  );
}

function ProgressSteps({ hasRating, hasComment }) {
  const steps = [
    { done: hasRating, label: "Rate the course" },
    { done: hasComment, label: "Add a comment" },
  ];
  return (
    <div className="flex flex-col gap-1.5">
      {steps.map(({ done, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${
              done ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
          <span
            className={`text-xs transition-colors duration-300 ${
              done
                ? "text-gray-600 dark:text-gray-300"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const FeedbackForm = ({ courseId, enrollmentId, onSuccess }) => {
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeTags, setActiveTags] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({ rating: "", comment: "" });

  const hasRating = rating > 0;
  const hasComment = comment.trim().length > 0;
  const canSubmit = hasRating && hasComment && !isSubmitting;
  const progress =
    hasRating && hasComment ? 100 : hasRating || hasComment ? 50 : 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleRating = useCallback((value) => {
    setRating(value);
    setErrors((e) => ({ ...e, rating: "" }));
  }, []);

  const handleStarKeyDown = useCallback(
    (e, star) => {
      if (e.key === "ArrowRight" && star < 5) {
        document.getElementById(`star-${star + 1}`)?.focus();
        handleRating(star + 1);
      }
      if (e.key === "ArrowLeft" && star > 1) {
        document.getElementById(`star-${star - 1}`)?.focus();
        handleRating(star - 1);
      }
    },
    [handleRating],
  );

  const handleCommentChange = useCallback((e) => {
    setComment(e.target.value.slice(0, MAX_CHARS));
    setErrors((err) => ({ ...err, comment: "" }));
  }, []);

  const handleTagToggle = useCallback((tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
        setComment((c) =>
          c
            .replace(
              new RegExp(
                `(?:, |^)${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
                "g",
              ),
              "",
            )
            .replace(/^, /, "")
            .trim(),
        );
      } else {
        next.add(tag);
        setComment((c) => (c ? `${c}, ${tag}` : tag));
      }
      return next;
    });
    setErrors((err) => ({ ...err, comment: "" }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const newErrors = {
      rating: rating === 0 ? "Please select a rating" : "",
      comment: !comment.trim() ? "Please add a comment" : "",
    };
    setErrors(newErrors);
    if (newErrors.rating || newErrors.comment) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        postCourseFeedbackAPI({
          enrollment_id: enrollmentId,
          course_id: courseId,
          rating,
          comments: comment.trim(),
        }),
      ).unwrap();
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setComment("");
        setRating(0);
        setActiveTags(new Set());
        if (onSuccess) onSuccess();
      }, 4000);
    } catch (err) {
      setErrors((e) => ({
        ...e,
        comment: "Submission failed — please try again.",
      }));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [rating, comment, courseId, enrollmentId, dispatch, onSuccess]);

  // ── Success state ─────────────────────────────────────────────────────────

  if (isSubmitted) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="h-0.5 bg-blue-500" />
          <div className="px-5 py-10 sm:px-8 sm:py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Feedback received
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
              Thank you — this helps instructors improve the course for everyone
              who takes it next.
            </p>
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(rating)].map((_, i) => (
                <div key={i} className="w-5 h-5">
                  <StarIcon filled />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-7">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-0.5">
              How was this course?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
              Takes 30 seconds · helps future learners
            </p>
          </div>

          {/* ── Rating ── */}
          <fieldset className="border-none p-0 m-0">
            <legend className="sr-only">Course rating</legend>
            <SectionLabel>Your rating</SectionLabel>

            {/*
              Stars: 44px tap targets on mobile (w-11 h-11), scale up on desktop.
              No hover state on touch — onMouseEnter only fires on pointer devices.
            */}
            <div
              className="flex items-center gap-0.5 mb-2"
              role="radiogroup"
              aria-label="Course rating"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  id={`star-${star}`}
                  type="button"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  aria-checked={rating === star}
                  role="radio"
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onKeyDown={(e) => handleStarKeyDown(e, star)}
                  className="
                    w-11 h-11 sm:w-10 sm:h-10 p-1.5 sm:p-1
                    rounded-xl flex items-center justify-center
                    transition-transform duration-150
                    active:scale-95 hover:scale-110
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-blue-500 focus-visible:ring-offset-2
                    dark:focus-visible:ring-offset-gray-900
                    -webkit-tap-highlight-color-transparent
                  "
                >
                  <StarIcon
                    filled={star <= (hoverRating || rating)}
                    hovered={
                      hoverRating > 0 && star <= hoverRating && star > rating
                    }
                  />
                </button>
              ))}
            </div>

            <p
              className={`text-sm min-h-[20px] transition-colors duration-200 ${
                rating > 0
                  ? "text-gray-700 dark:text-gray-300"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {rating > 0 ? RATING_LABELS[rating] : "Tap to rate"}
            </p>
            <FieldError message={errors.rating} />
          </fieldset>

          <div className="my-5 border-t border-gray-100 dark:border-gray-800" />

          {/* ── Comment ── */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <SectionLabel>Your thoughts</SectionLabel>
              <span
                className={`text-[11px] tabular-nums transition-colors ${
                  comment.length > MAX_CHARS * 0.9
                    ? "text-amber-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {comment.length} / {MAX_CHARS}
              </span>
            </div>

            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              rows={4}
              placeholder="What worked well? What could be better? Be as specific as you like."
              className="
                w-full px-3.5 py-3
                text-sm leading-relaxed
                rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-900
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-600
                resize-none outline-none
                transition-all duration-150
                focus:border-blue-500 focus:ring-4 focus:ring-blue-500/[0.08]
                hover:border-gray-300 dark:hover:border-gray-600
                /* Remove iOS inner shadow */
                appearance-none [-webkit-appearance:none]
              "
            />
            <FieldError message={errors.comment} />

            {/* Quick tags — natural flex-wrap, full touch targets */}
            <div
              className="flex flex-wrap gap-2 mt-3"
              role="group"
              aria-label="Quick tags"
            >
              {QUICK_TAGS.map((tag) => {
                const active = activeTags.has(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleTagToggle(tag)}
                    className={`
                      px-3 py-1.5 text-xs rounded-full border
                      min-h-[32px] /* minimum tap height */
                      transition-all duration-150 outline-none
                      focus-visible:ring-2 focus-visible:ring-blue-500
                      active:scale-95
                      ${
                        active
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                          : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                      }
                    `}
                  >
                    {active ? "✓ " : ""}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-5 border-t border-gray-100 dark:border-gray-800" />

          {/* ── Progress checklist ── */}
          <div className="px-3 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4">
            <ProgressSteps hasRating={hasRating} hasComment={hasComment} />
          </div>

          {/* ── Submit — full-width on mobile ── */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            className={`
              w-full flex items-center justify-center gap-2
              px-5 py-3.5 sm:py-3
              rounded-xl text-sm font-medium
              transition-all duration-200 outline-none
              min-h-[48px] /* WCAG touch target */
              focus-visible:ring-2 focus-visible:ring-blue-500
              focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
              active:scale-[0.98]
              ${
                canSubmit
                  ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm"
                  : isSubmitting
                    ? "bg-blue-600 text-white opacity-75 cursor-default"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                <span>Submitting…</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" aria-hidden />
                <span>Submit feedback</span>
              </>
            )}
          </button>

          {/* Trust signal */}
          <p className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-gray-400 dark:text-gray-500">
            <Lock className="w-3 h-3" aria-hidden />
            Anonymous · used internally only
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
