import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postCourseFeedbackAPI } from "@/store/feature/user";
import { Star, Send, CheckCircle, MessageSquare, ThumbsUp } from "lucide-react";

const FeedbackForm = ({ courseId, enrollmentId, theme, onSuccess }) => {
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Theme configurations
  const textColor = {
    primary: theme === "dark" ? "text-gray-100" : "text-gray-800",
    secondary: theme === "dark" ? "text-gray-300" : "text-gray-700",
    muted: theme === "dark" ? "text-gray-400" : "text-gray-600",
    inverse: theme === "dark" ? "text-gray-800" : "text-gray-100",
  };

  const bgColor = {
    primary: theme === "dark" ? "bg-gray-900" : "bg-white",
    secondary: theme === "dark" ? "bg-gray-800" : "bg-gray-50",
    tertiary: theme === "dark" ? "bg-gray-950" : "bg-gray-100",
    card: theme === "dark" ? "bg-gray-800/90" : "bg-white",
    hover: theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100",
  };

  const borderColor = {
    primary: theme === "dark" ? "border-gray-800" : "border-gray-200",
    secondary: theme === "dark" ? "border-gray-700" : "border-gray-300",
    focus: theme === "dark" ? "border-blue-500" : "border-blue-500",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    if (!comments.trim()) {
      alert("Please enter your comments before submitting.");
      return;
    }

    setIsSubmitting(true);

    const feedbackData = {
      enrollment_id: enrollmentId,
      course_id: courseId,
      rating,
      comments: comments.trim(),
    };

    try {
      await dispatch(postCourseFeedbackAPI(feedbackData)).unwrap();
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setComments("");
        setRating(0);
        if (onSuccess) onSuccess();
      }, 3000);
    } catch (err) {
      alert("Failed to submit feedback. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = () => {
    const labels = {
      1: { text: "Poor", emoji: "😕", color: "text-red-500" },
      2: { text: "Fair", emoji: "😐", color: "text-orange-500" },
      3: { text: "Good", emoji: "🙂", color: "text-yellow-500" },
      4: { text: "Very Good", emoji: "😊", color: "text-blue-500" },
      5: { text: "Excellent", emoji: "🌟", color: "text-green-500" },
    };
    return labels[rating] || { text: "Select rating", emoji: "⭐", color: textColor.muted };
  };

  const ratingInfo = getRatingLabel();

  if (isSubmitted) {
    return (
      <div className={`${bgColor.card} rounded-xl p-6 md:p-8 text-center animate-fadeIn`}>
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h3 className={`text-xl font-bold ${textColor.primary} mb-2`}>
          Thank You for Your Feedback!
        </h3>
        <p className={`${textColor.secondary} mb-4`}>
          Your insights help us improve the learning experience.
        </p>
        <div className="flex items-center justify-center gap-1">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className={`
          relative overflow-hidden
          ${bgColor.card} rounded-xl shadow-sm 
          border ${borderColor.primary}
          transition-all duration-300 hover:shadow-md
        `}
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${
                theme === "dark" ? "bg-purple-900/30" : "bg-purple-100"
              }`}>
                <MessageSquare className={`w-5 h-5 ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`} />
              </div>
              <div>
                <h2 className={`text-lg sm:text-xl font-bold ${textColor.primary}`}>
                  Share Your Experience
                </h2>
                <p className={`text-sm ${textColor.muted}`}>
                  Your feedback helps us improve
                </p>
              </div>
            </div>
            
            {/* Optional: Add course completion badge */}
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              theme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
            }`}>
              Course Completed
            </span>
          </div>

          {/* Rating Section - Modern Redesign */}
          <div className="mb-8">
            <label className={`block text-sm font-medium ${textColor.secondary} mb-3`}>
              How would you rate this course?
              <span className="text-red-500 ml-1">*</span>
            </label>
            
            <div className="flex flex-col items-center">
              {/* Interactive Stars - Responsive sizing */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoverRating || rating);
                  
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`
                        relative p-1 rounded-lg transition-all duration-200
                        ${bgColor.hover} focus:outline-none focus:ring-2 
                        focus:ring-blue-500 focus:ring-offset-2
                        ${theme === "dark" ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}
                      `}
                    >
                      <Star 
                        className={`
                          w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                          transition-all duration-200
                          ${isFilled 
                            ? 'fill-yellow-400 text-yellow-400 scale-110' 
                            : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500'
                          }
                          ${hoverRating >= star ? 'animate-pulse' : ''}
                        `}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Rating Label with Emoji */}
              <div className="flex items-center gap-3">
                <div className={`
                  px-3 py-1.5 rounded-full text-sm font-medium
                  ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
                `}>
                  <span className={ratingInfo.color}>
                    {ratingInfo.emoji} {ratingInfo.text}
                  </span>
                </div>
                {rating > 0 && (
                  <span className={`text-sm ${textColor.muted}`}>
                    {rating}/5 stars
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section - Redesigned */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className={`block text-sm font-medium ${textColor.secondary}`}>
                Your Comments
                <span className="text-red-500 ml-1">*</span>
              </label>
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${comments.length > 0 ? bgColor.secondary : ''}
                ${textColor.muted}
              `}>
                {comments.length}/500
              </span>
            </div>
            
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value.slice(0, 500))}
              rows="4"
              placeholder="What did you think about the course content, instructor, and your overall learning experience?"
              className={`
                w-full px-4 py-3 rounded-lg text-sm sm:text-base
                transition-all duration-200
                ${bgColor.secondary} ${textColor.primary}
                border ${borderColor.secondary}
                placeholder:text-sm placeholder:${textColor.muted}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                resize-none
              `}
            />

            {/* Quick feedback tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {["Excellent content", "Great instructor", "Well structured", "Practical examples", "Good pace", "Challenging"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setComments(prev => 
                    prev.includes(tag) ? prev : prev + (prev ? `, ${tag}` : tag)
                  )}
                  className={`
                    px-3 py-1.5 text-xs sm:text-sm rounded-full
                    transition-all duration-200
                    ${bgColor.secondary} ${textColor.secondary}
                    border ${borderColor.primary}
                    hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button - Redesigned */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <p className={`text-xs ${textColor.muted} flex items-center gap-1`}>
              <span className="text-red-500">*</span> Required fields
            </p>
            
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comments.trim()}
              className={`
                relative px-6 py-3 rounded-lg font-medium text-sm sm:text-base
                transition-all duration-200
                flex items-center justify-center gap-2
                ${rating > 0 && comments.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
                  : theme === "dark"
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${theme === "dark" ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}
                transform hover:-translate-y-0.5 active:translate-y-0
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>

          {/* Footer note */}
          <div className={`mt-4 pt-4 border-t ${borderColor.primary}`}>
            <p className={`text-xs ${textColor.muted} text-center`}>
              Your feedback is anonymous and will only be used to improve course quality.
              Thank you for helping us grow! 🌟
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

// Add this to your global CSS or in a style tag
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
`;
document.head.appendChild(style);

export default FeedbackForm;