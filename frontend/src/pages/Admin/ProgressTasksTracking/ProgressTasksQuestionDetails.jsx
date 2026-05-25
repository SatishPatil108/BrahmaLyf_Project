import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  SquarePen,
  Trash2,
  AlertCircle,
  CheckCircle,
  BadgeQuestionMarkIcon,
  X,
  Edit,
  List,
  ChevronRight,
  Filter,
  MessageSquare,
} from "lucide-react";
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import useProgressTaskDetails from "./useProgressTaskDetails";
import useCompletedMessage from "./useCompletedMessage";
import { cleanHtml } from "@/components/RichTextEditor/cleanHtml";
import ViewQuestionDrawer from "./ViewQuestionDrawer";
import QuestionForm from "./QuestionForm";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";

const OPTION_TYPE_LABELS = {
  1: "Text",
  2: "Radio Buttons",
  3: "Dropdown",
  4: "Multiple Select",
  5: "Rating",
  6: "Progress Bar",
};
const OPTION_TYPE_ICONS = {
  1: "📝",
  2: "🔘",
  3: "📋",
  4: "✅",
  5: "⭐",
  6: "📊",
};
const OPTION_TYPES_WITH_OPTIONS = [2, 3, 4];

const ProgressTasksQuestionDetails = ({ isOpen, onClose }) => {
  const [weekNo, setWeekNo] = useState(1);
  const [dayNo, setDayNo] = useState(1);
  const { courseId } = useParams();

  // ── Questions Hook ──
  const {
    progressTasksQuestions,
    loading,
    error,
    isSubmitting,
    actionMessage,
    clearMessage,
    addQuestion,
    updateQuestion,
    handleDeleteQuestion,
  } = useProgressTaskDetails(courseId, weekNo, dayNo);

  // ── Completed Message Hook ──
  const {
    completedMessage,
    isLoadingMessage,
    isSubmittingMessage,
    messageActionMessage,
    clearMessageActionMessage,
    addCompletedMessage,
    updateCompletedMessage,
    deleteCompletedMessage,
  } = useCompletedMessage(courseId, weekNo, dayNo);

  const questions = progressTasksQuestions?.questions || [];

  // ── Drawer  State ──
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isMessageMode, setIsMessageMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [errors, setErrors] = useState({});

  // ── Question Form Data ──
  const [formData, setFormData] = useState({
    id: null,
    question_text: "",
    option_type: "",
    week_no: weekNo,
    day_no: dayNo,
    options: ["", ""],
  });

  // ── Message Form Data ──
  const [messageFormData, setMessageFormData] = useState({
    message_id: null,
    completed_message: "",
    week_no: weekNo,
    day_no: dayNo,
  });

  useEffect(() => {
    if (!isEditing && !isMessageMode) {
      setFormData((prev) => ({ ...prev, week_no: weekNo, day_no: dayNo }));
    }
  }, [weekNo, dayNo, isEditing, isMessageMode]);

  // ── Question Form Handlers ──
  const handleRichTextChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["option_type", "week_no", "day_no"].includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
      ...(name === "option_type" ? { options: ["", ""] } : {}),
    }));
  };

  const handleOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  const addOption = () => {
    if (formData.options.length < 10)
      setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // ── Message Rich Text Handler ──
  const handleMessageRichTextChange = (value) => {
    setMessageFormData((prev) => ({ ...prev, completed_message: value }));
    if (errors.completed_message)
      setErrors((prev) => ({ ...prev, completed_message: undefined }));
  };

  // ── Reset ──
  const resetForm = () => {
    setIsFormDrawerOpen(false);
    setIsEditing(false);
    setIsMessageMode(false);
    setErrors({});
    clearMessage();
    clearMessageActionMessage();
  };

  // ── Open: Add Message ──
  const openAddMessageForm = () => {
    setIsMessageMode(true);
    setIsEditing(false);
    setMessageFormData({
      message_id: null,
      completed_message: "",
      week_no: weekNo,
      day_no: dayNo,
    });
    setErrors({});
    clearMessageActionMessage();
    setIsFormDrawerOpen(true);
  };

  const openEditMessageForm = () => {
    setIsMessageMode(true);
    setIsEditing(true);
    setMessageFormData({
      message_id: completedMessage.message_id,
      completed_message: completedMessage.completed_message,
      week_no: completedMessage.week_no,
      day_no: completedMessage.day_no,
    });
    setErrors({});
    clearMessageActionMessage();
    setIsFormDrawerOpen(true);
  };

  // ── Open: Add Question ──
  const openAddQuestionForm = () => {
    setIsMessageMode(false);
    setIsEditing(false);
    setFormData({
      id: null,
      question_text: "",
      option_type: "",
      week_no: weekNo,
      day_no: dayNo,
      options: ["", ""],
    });
    setErrors({});
    clearMessage();
    setIsFormDrawerOpen(true);
  };

  const openEditQuestionForm = (question) => {
    setIsMessageMode(false);
    setIsEditing(true);
    setFormData({
      id: question.question_id,
      question_text: question.question_text,
      option_type: question.option_type,
      week_no: question.week_no,
      day_no: question.day_no,
      options: question.options?.length > 0 ? question.options : ["", ""],
    });
    setErrors({});
    clearMessage();
    setIsFormDrawerOpen(true);
  };

  const openViewDrawer = (question) => {
    setSelectedQuestion(question);
    setIsViewDrawerOpen(true);
  };

  // ── Validate Message ──
  const validateMessageForm = () => {
    const newErrors = {};
    const plain = cleanHtml(messageFormData.completed_message);
    if (!messageFormData.completed_message?.trim())
      newErrors.completed_message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Validate Question ───
  const validateForm = () => {
    const newErrors = {};
    const plainQuestion = cleanHtml(formData.question_text);
    if (!formData.question_text.trim())
      newErrors.question_text = "Question is required";
    else if (plainQuestion.length < 10)
      newErrors.question_text = "Question should be at least 10 characters";
    else if (plainQuestion.length > 500)
      newErrors.question_text = "Question should not exceed 500 characters";
    if (!formData.option_type)
      newErrors.option_type = "Answer type is required";
    else if (![1, 2, 3, 4, 5, 6].includes(Number(formData.option_type)))
      newErrors.option_type = "Invalid answer type selected";
    if (!formData.week_no) newErrors.week_no = "Week number is required";
    else if (formData.week_no < 1 || formData.week_no > 52)
      newErrors.week_no = "Week must be between 1 and 52";
    if (!formData.day_no) newErrors.day_no = "Day number is required";
    else if (formData.day_no < 1 || formData.day_no > 7)
      newErrors.day_no = "Day must be between 1 and 7";
    if (OPTION_TYPES_WITH_OPTIONS.includes(Number(formData.option_type))) {
      const filled = formData.options.filter((o) => o.trim() !== "");
      if (filled.length < 2)
        newErrors.options = "Please provide at least 2 options";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit: Message ──
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!validateMessageForm() || !courseId) return;
    const payload = {
      completed_message: messageFormData.completed_message.trim(),
      week_no: Number(messageFormData.week_no),
      day_no: Number(messageFormData.day_no),
    };
    try {
      if (isEditing)
        await updateCompletedMessage(
          messageFormData.message_id,
          courseId,
          payload,
        );
      else await addCompletedMessage(courseId, payload);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Delete: Message ──
  const handleDeleteMessage = async (messageId) => {
    if (
      !window.confirm("Are you sure you want to delete this completed message?")
    )
      return;
    await deleteCompletedMessage(messageId);
  };

  // ── Submit: Question ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !courseId) return;
    const payload = {
      question_text: formData.question_text.trim(),
      option_type: Number(formData.option_type),
      week_no: Number(formData.week_no),
      day_no: Number(formData.day_no),
      options: OPTION_TYPES_WITH_OPTIONS.includes(Number(formData.option_type))
        ? formData.options.filter((o) => o.trim() !== "")
        : [],
    };
    try {
      if (isEditing) await updateQuestion(formData.id, courseId, payload);
      else await addQuestion(courseId, [payload]);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Delete: Question ──
  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    await handleDeleteQuestion(questionId);
  };

  // ── Active action message (questions or message drawer) ──
  const activeActionMessage = isMessageMode
    ? messageActionMessage
    : actionMessage;
  const activeClearMessage = isMessageMode
    ? clearMessageActionMessage
    : clearMessage;
  const activeIsSubmitting = isMessageMode ? isSubmittingMessage : isSubmitting;

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <List className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Questions List
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage all your progress tracking questions
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ── Loading ─────────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700" />
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
            </div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Loading Questions...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Please wait while we fetch your questions
            </p>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────────── */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Failed to Load Questions
            </h2>
            <CustomButton
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </CustomButton>
          </div>
        )}

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        {!loading && !error && (
          <>
            {/* Filter */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter Questions
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Week
                  </label>
                  <select
                    value={weekNo}
                    onChange={(e) => setWeekNo(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all duration-200"
                  >
                    {[...Array(52)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Week {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Day
                  </label>
                  <select
                    value={dayNo}
                    onChange={(e) => setDayNo(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all duration-200"
                  >
                    {[...Array(7)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Day {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Showing questions for Week {weekNo}, Day {dayNo}
              </p>
            </div>

            {/* ── Completed Message Section ─────────────────────────────────── */}
            {isLoadingMessage ? (
              <div className="h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ) : completedMessage ? (
              // Saved message card — hides the Add button
              <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1 uppercase tracking-wide">
                        Completed Message
                      </p>
                      <div
                        className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3 prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: completedMessage.completed_message,
                        }}
                      />
                    </div>
                  </div>
                  {/* Edit / Delete */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={openEditMessageForm}
                      className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-200 dark:border-gray-700 transition-all"
                      title="Edit Message"
                    >
                      <SquarePen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(completedMessage.message_id);
                      }}
                      disabled={isSubmittingMessage}
                      className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-700 transition-all disabled:opacity-50"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Show button only when no message exists for this week/day
              <CustomButton
                onClick={openAddMessageForm}
                variant="outline"
                className="w-full px-6 py-3 rounded-xl border-2 border-dashed border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Add Completed Message
              </CustomButton>
            )}

            {/* Add Question Button */}
            <CustomButton
              onClick={openAddQuestionForm}
              variant="primary"
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Question
            </CustomButton>

            {/* Questions List */}
            {questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
                <BadgeQuestionMarkIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No questions found
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  No questions available for Week {weekNo}, Day {dayNo}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Click the button above to add your first question
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question.question_id || index}
                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => openViewDrawer(question)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                              Q{index + 1}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
                              {OPTION_TYPE_ICONS[question.option_type]}
                              {OPTION_TYPE_LABELS[question.option_type]}
                            </span>
                            {OPTION_TYPES_WITH_OPTIONS.includes(
                              question.option_type,
                            ) &&
                              question.options?.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-xs text-indigo-600 dark:text-indigo-400">
                                  {question.options.length} options
                                </span>
                              )}
                          </div>
                          <h4
                            className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2"
                            dangerouslySetInnerHTML={{
                              __html: question.question_text,
                            }}
                          />
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>Week {question.week_no}</span>
                            <span>•</span>
                            <span>Day {question.day_no}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditQuestionForm(question);
                            }}
                            className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
                            title="Edit Question"
                          >
                            <SquarePen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(question.question_id);
                            }}
                            disabled={isSubmitting}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all disabled:opacity-50"
                            title="Delete Question"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Nested Form Drawer ──────────────────────────────────────────────── */}
      <CustomDrawer
        isOpen={isFormDrawerOpen}
        onClose={resetForm}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
              {isMessageMode ? (
                <MessageSquare className="w-5 h-5 text-green-600" />
              ) : isEditing ? (
                <Edit className="w-5 h-5 text-indigo-600" />
              ) : (
                <Plus className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {isMessageMode
                  ? isEditing
                    ? "Edit Completed Message"
                    : "Add Completed Message"
                  : isEditing
                    ? "Edit Question"
                    : "Add New Question"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isMessageMode
                  ? "Set the message shown when this day is completed"
                  : isEditing
                    ? "Update question and option type"
                    : "Create a new progress tracking question"}
              </p>
            </div>
          </div>
        }
      >
        {/* Action Message Banner */}
        {activeActionMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
              activeActionMessage.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            {activeActionMessage.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  activeActionMessage.type === "success"
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {activeActionMessage.text}
              </p>
              {activeActionMessage.details && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activeActionMessage.details}
                </p>
              )}
            </div>
            <button
              onClick={activeClearMessage}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Message Form ──────────────────────────────────────────────────── */}
        {isMessageMode ? (
          <form onSubmit={handleMessageSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Completed Message <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={messageFormData.completed_message}
                onChange={handleMessageRichTextChange}
              />
              {errors.completed_message && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.completed_message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-400 text-right">
                {cleanHtml(messageFormData.completed_message).length} / 1000
                characters
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <CustomButton
                type="button"
                variant="outline"
                onClick={resetForm}
                className="flex-1"
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="submit"
                variant="primary"
                disabled={activeIsSubmitting}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {activeIsSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Saving..."
                  : isEditing
                    ? "Update Message"
                    : "Save Message"}
              </CustomButton>
            </div>
          </form>
        ) : (
          <QuestionForm
            formData={formData}
            errors={errors}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            handleRichTextChange={handleRichTextChange}
            handleChange={handleChange}
            handleOptionChange={handleOptionChange}
            addOption={addOption}
            removeOption={removeOption}
            onCancel={resetForm}
            onSubmit={handleSubmit}
          />
        )}
      </CustomDrawer>

      <ViewQuestionDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setSelectedQuestion(null);
          setIsViewDrawerOpen(false);
        }}
        question={selectedQuestion}
      />
    </CustomDrawer>
  );
};

export default ProgressTasksQuestionDetails;
