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
  Send,
  Lock,
  Pencil,
  X,
} from "lucide-react";

import {
  fetchUserToolsResponseAPI,
  postUserToolsProgressAPI,
  updateUserToolsResponseAPI,
} from "@/store/feature/user";
import useUserToolsDetails from "./useUserToolsDetails";
import {
  markScopedDayCompleted,
  markToolsQuestionSubmitted,
} from "@/store/feature/user/userSlice";

import RichTextEditor from "@/components/RichTextEditor/RichTextEditorWithLock";
import RichTextEditorWithLock from "@/components/RichTextEditor/RichTextEditorWithLock";

if (
  typeof document !== "undefined" &&
  !document.getElementById("tools-form-styles")
) {
  const style = document.createElement("style");
  style.id = "tools-form-styles";
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

const ProgressToolsForm = ({ courseId, theme = "light", onSubmitSuccess }) => {
  const dispatch = useDispatch();

  const {
    weekData,
    isLoading,
    error,
    submittedQuestions: reduxSubmittedQuestions,
    submittedAnswers: reduxSubmittedAnswers,
  } = useUserToolsDetails(courseId);

  const [answers, setAnswers] = useState({});
  const [submittingQuestion, setSubmittingQuestion] = useState(null);
  const [updatingQuestion, setUpdatingQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null); // questionId being edited
  const [editingAnswerBackup, setEditingAnswerBackup] = useState(null); // original answer before edit
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

  // Group questions by day
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
      dispatch(fetchUserToolsResponseAPI({ courseId }));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (
      reduxSubmittedAnswers &&
      Object.keys(reduxSubmittedAnswers).length > 0
    ) {
      const merged = {};

      Object.entries(reduxSubmittedAnswers).forEach(([dayKey, dayAnswers]) => {
        if (dayAnswers && typeof dayAnswers === "object") {
          Object.assign(merged, dayAnswers);
        } else {
          console.warn("⚠️ Invalid day answers structure:", {
            dayKey,
            dayAnswers,
          });
        }
      });

      setAnswers((prev) => ({
        ...prev,
        ...merged,
      }));
      setIsDataLoaded(true);
    }
  }, [reduxSubmittedAnswers]);

  const totalQuestions = allQuestions.length;
  const submittedCount = allQuestions.filter(
    (q) => reduxSubmittedQuestions[q.id],
  ).length;
  const allCompleted = totalQuestions > 0 && submittedCount === totalQuestions;

  // Show completion card then completed form
  useEffect(() => {
    if (allCompleted && !showCompletionCard && !showCompletedForm) {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
      setShowCompletionCard(true);
      completionTimeoutRef.current = setTimeout(() => {
        setShowCompletionCard(false);
        setShowCompletedForm(true);
      }, 4500);
    }
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, [allCompleted, showCompletionCard, showCompletedForm]);

  const forceRefreshAnswers = useCallback(async () => {
    if (!courseId) return;
    try {
      await dispatch(fetchUserToolsResponseAPI({ courseId })).unwrap();
    } catch (err) {
      console.error("Failed to refresh tools answers:", err);
    }
  }, [dispatch, courseId]);

  const handleText = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleEditStart = (questionId) => {
    setEditingAnswerBackup(answers[questionId]);
    setEditingQuestion(questionId);
  };

  const handleEditCancel = (questionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: editingAnswerBackup }));
    setEditingQuestion(null);
    setEditingAnswerBackup(null);
  };

  const handleQuestionUpdate = async (questionId, dayNo) => {
    const answer = answers[questionId]?.trim();
    if (!answer) return;

    setUpdatingQuestion(questionId);
    try {
      await dispatch(
        updateUserToolsResponseAPI({
          questionId,
          toolsData: { textAnswer: answer, courseId, weekNo, dayNo },
        }),
      ).unwrap();

      dispatch(
        markToolsQuestionSubmitted({
          courseId,
          questionId,
        }),
      );

      setEditingQuestion(null);
      setEditingAnswerBackup(null);
      await forceRefreshAnswers();
      onSubmitSuccess?.();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdatingQuestion(null);
    }
  };

  const handleQuestionSubmit = async (questionId, dayNo) => {
    const answer = answers[questionId];
    const hasAnswer = answer !== undefined && String(answer).trim() !== "";

    if (!hasAnswer || reduxSubmittedQuestions[questionId]) return;

    setSubmittingQuestion(questionId);
    try {
      await dispatch(
        postUserToolsProgressAPI({
          weekNo,
          dayNo,
          courseId,
          answers: [{ questionId, textAnswer: answer }],
        }),
      ).unwrap();

      dispatch(markToolsQuestionSubmitted({ courseId, questionId }));
      await forceRefreshAnswers();

      const dayQuestions = allQuestions.filter((q) => q.day_no === dayNo);
      const updatedSubmitted = {
        ...reduxSubmittedQuestions,
        [questionId]: true,
      };
      const allDone = dayQuestions.every((q) => updatedSubmitted[q.id]);
      if (allDone) {
        dispatch(
          markScopedDayCompleted({
            section: "userToolsDetails",
            courseId,
            dayNo,
          }),
        );
      }

      onSubmitSuccess?.();
    } catch (err) {
      console.error("Tools submit error:", err);
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
          <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>
        <p className={`ml-4 text-sm ${textColor.muted}`}>
          Loading tools questions...
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

  // Shared question renderer (used in both completed & regular form)
  const renderDays = (locked = false) =>
    Object.keys(questionsByDay).map((dayNo) => {
      const day = questionsByDay[dayNo];
      const dayQuestions = day.questions;
      const daySubmittedCount = dayQuestions.filter(
        (q) => reduxSubmittedQuestions[q.id],
      ).length;
      const dayCompleted = daySubmittedCount === dayQuestions.length;

      return (
        <div key={dayNo} className="mb-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-blue-200 dark:border-blue-800">
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                dayCompleted
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              Day {dayNo}
            </div>
            <span className={`text-xs ${textColor.muted}`}>
              {daySubmittedCount}/{dayQuestions.length} Completed
            </span>
            {dayCompleted && (
              <CheckCircle className="w-4 h-4 text-blue-500 ml-2" />
            )}
          </div>
          <div className="flex flex-col gap-5">
            {dayQuestions.map((question, idx) => (
              <ToolsQuestionCard
                key={question.id}
                question={question}
                index={idx}
                answers={answers}
                theme={theme}
                textColor={textColor}
                bgColor={bgColor}
                borderColor={borderColor}
                onText={handleText}
                isSubmitted={!!reduxSubmittedQuestions[question.id]}
                isSubmitting={submittingQuestion === question.id}
                isEditing={editingQuestion === question.id}
                isUpdating={updatingQuestion === question.id}
                onQuestionSubmit={() =>
                  handleQuestionSubmit(question.id, parseInt(dayNo))
                }
                onEditStart={() => handleEditStart(question.id)}
                onEditCancel={() => handleEditCancel(question.id)}
                onQuestionUpdate={() =>
                  handleQuestionUpdate(question.id, parseInt(dayNo))
                }
              />
            ))}
          </div>
        </div>
      );
    });

  // Completed form — show all submitted answers with edit support
  if (allCompleted && showCompletedForm) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div
          className={`relative overflow-hidden ${bgColor.card} rounded-xl shadow-sm border ${borderColor.primary} transition-all duration-300 hover:shadow-md`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg ${theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"}`}
                >
                  <ClipboardList
                    className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                  />
                </div>
                <div>
                  <h2
                    className={`text-lg sm:text-xl font-bold ${textColor.primary}`}
                  >
                    Your Submitted Tools Answers
                  </h2>
                  <p className={`text-sm ${textColor.muted}`}>
                    Week {weekNo} · All {totalQuestions} questions completed
                  </p>
                </div>
              </div>
              <div
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700"}`}
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
                <span className="text-xs font-medium text-blue-500">100%</span>
              </div>
              <div
                className={`h-2 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {/* Questions */}
            <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
              {renderDays(true)}
            </div>

            <div className={`mt-6 pt-4 border-t ${borderColor.primary}`}>
              <p className={`text-xs ${textColor.muted} text-center`}>
                All your tools responses have been saved successfully. Great
                job! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular form
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`relative overflow-hidden ${bgColor.card} rounded-xl shadow-sm border ${borderColor.primary} transition-all duration-300 hover:shadow-md`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"}`}
              >
                <ClipboardList
                  className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                />
              </div>
              <div>
                <h2
                  className={`text-lg sm:text-xl font-bold ${textColor.primary}`}
                >
                  Daily Tools Check-in
                </h2>
                <p className={`text-sm ${textColor.muted}`}>
                  Week {weekNo} · All Days ({totalDays} days)
                </p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700"}`}
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
                className={`text-xs font-medium ${progressPct === 100 ? "text-blue-500" : textColor.muted}`}
              >
                {progressPct}%
              </span>
            </div>
            <div
              className={`h-2 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
            {renderDays(false)}

            {allQuestions.length === 0 && (
              <p className={`text-sm ${textColor.muted} text-center py-12`}>
                No tools questions available.
              </p>
            )}
          </div>

          <div className={`mt-6 pt-4 border-t ${borderColor.primary}`}>
            <p className={`text-xs ${textColor.muted} text-center`}>
              Your tools responses are saved securely. 🛠️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Question Card ────────────────────────────────────────────────────────────
const ToolsQuestionCard = ({
  question,
  index,
  answers,
  theme,
  textColor,
  bgColor,
  borderColor,
  onText,
  isSubmitted,
  isSubmitting,
  isEditing,
  isUpdating,
  onQuestionSubmit,
  onEditStart,
  onEditCancel,
  onQuestionUpdate,
}) => {
  const { id, question_text } = question;
  const currentAnswer = answers[id];
  const hasAnswer =
    currentAnswer !== undefined && String(currentAnswer).trim() !== "";

  // A submitted question that is NOT currently being edited shows the locked style
  const isLocked = isSubmitted && !isEditing;

  const lockedOverlay = isLocked
    ? theme === "dark"
      ? "border-blue-700 bg-blue-900/10 opacity-80"
      : "border-blue-300 bg-blue-50/50 opacity-80"
    : "";

  const editingOverlay = isEditing
    ? theme === "dark"
      ? "border-yellow-600 bg-yellow-900/10"
      : "border-yellow-400 bg-yellow-50/50"
    : "";

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-4 sm:p-5 border transition-all duration-200
      ${isLocked ? lockedOverlay : isEditing ? editingOverlay : `${borderColor.secondary} ${bgColor.secondary}`}`}
    >
      {/* Left accent bar */}
      {isLocked && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-l-xl" />
      )}
      {isEditing && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-l-xl" />
      )}

      {/* Top-right badge */}
      {isLocked && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {/* Edit button */}
          <button
            onClick={onEditStart}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-150
              ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-yellow-800/40 text-gray-300 hover:text-yellow-400"
                  : "bg-gray-100 hover:bg-yellow-100 text-gray-500 hover:text-yellow-600"
              }`}
            title="Edit answer"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
          {/* Submitted badge */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              theme === "dark"
                ? "bg-blue-900/40 text-blue-400"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            <Lock className="w-3 h-3" />
            Submitted
          </div>
        </div>
      )}

      {isEditing && (
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            theme === "dark"
              ? "bg-yellow-900/40 text-yellow-400"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <Pencil className="w-3 h-3" />
          Editing
        </div>
      )}

      {/* Question text */}
      <div className="flex items-start gap-3 mb-4 pl-1">
        <span
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
          ${
            isLocked
              ? "bg-blue-500 text-white"
              : isEditing
                ? "bg-yellow-400 text-white"
                : theme === "dark"
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-200 text-gray-600"
          }`}
        >
          {isLocked ? "✓" : isEditing ? "✎" : index + 1}
        </span>
        <div className="flex-1 pr-32">
          <p
            className={`text-sm font-medium ${textColor.primary} leading-relaxed`}          
            dangerouslySetInnerHTML=
            {{
              __html: question_text,
            }}             
            />
            {!isSubmitted && <span className="text-red-500 ml-1">*</span>}
        </div>
      </div>

      {/* Answer area */}
      <div className="pl-9">
        <RichTextEditorWithLock
          value={currentAnswer || ""}
          onChange={(val) => onText(id, val)}
          isSubmitted={isLocked} // only lock editor when not editing
          bgColor={bgColor}
          textColor={textColor}
          borderColor={borderColor}
        />

        {/* Submit button (not yet submitted) */}
        {!isSubmitted && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onQuestionSubmit}
              disabled={!hasAnswer || isSubmitting}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200
                ${
                  hasAnswer && !isSubmitting
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md cursor-pointer"
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

        {/* Update / Cancel buttons (edit mode) */}
        {isEditing && (
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onEditCancel}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200
                ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              onClick={onQuestionUpdate}
              disabled={!hasAnswer || isUpdating}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200
                ${
                  hasAnswer && !isUpdating
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-sm hover:shadow-md cursor-pointer"
                    : theme === "dark"
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Update</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressToolsForm;
