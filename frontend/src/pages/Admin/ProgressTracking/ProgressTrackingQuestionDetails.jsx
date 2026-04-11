import React, { useState } from "react";
import useProgressTrackingQuestionsDetails from "./useProgressTrackingQuestionsDetails";
import {
  Plus,
  SquarePen,
  Trash2,
  AlertCircle,
  CheckCircle,
  BadgeQuestionMarkIcon,
  X,
  Edit,
  PlusCircle,
} from "lucide-react";

import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import {
  fetchProgressTrackingQuestionsAPI,
  postProgressTrackingQuestionAPI,
  updateProgressTrackingQuestionAPI,
} from "@/store/feature/admin";
import { useDispatch, useSelector } from "react-redux";

const OPTION_TYPE_LABELS = {
  1: "Text",
  2: "Radio Buttons",
  3: "Dropdown",
  4: "Multiple Select",
  5: "Rating",
};

const OPTION_TYPE_ICONS = {
  1: "📝",
  2: "🔘",
  3: "📋",
  4: "✅",
  5: "⭐",
};

const OPTION_TYPES_WITH_OPTIONS = [2, 3, 4];

const ProgressTrackingQuestionDetails = () => {
  const [weekNo, setWeekNo] = useState(1);
  const [dayNo, setDayNo] = useState(1);
  const dispatch = useDispatch();

  const {
    progressTrackingQuestionsDetails,
    loading,
    error,
    deleteTrackingQuestion,
  } = useProgressTrackingQuestionsDetails(weekNo, dayNo);

  const { coursesDetails } = useSelector((state) => state.admin);

  const questions = progressTrackingQuestionsDetails?.questions || [];
  const courses = coursesDetails?.courses || [];

  const [openIndex, setOpenIndex] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    question_text: "",
    option_type: "",
    week_no: weekNo,
    day_no: dayNo,
    course_id: "",
    options: ["", ""],
  });

  const clearMessage = () => setActionMessage(null);
  const toggleQuestion = (index) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  // ─── Options Handlers ────────────────────────────────────────────
  const handleOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const removeOption = (index) => {
    const updated = formData.options.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  // ─── Form Handlers ────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "option_type" ||
        name === "course_id" ||
        name === "week_no" ||
        name === "day_no"
          ? value === ""
            ? ""
            : Number(value)
          : value,
      // Reset options when switching answer type
      ...(name === "option_type" ? { options: ["", ""] } : {}),
    }));
  };

  const handleAddQuestion = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      question_text: "",
      option_type: "",
      week_no: weekNo,
      day_no: dayNo,
      course_id: "",
      options: ["", ""],
    });
    setErrors({});
    setIsDrawerOpen(true);
    clearMessage();
  };

  const handleEditQuestion = (question) => {
    console.log("question.options:", question.options);
    setIsEditing(true);
    setErrors({});
    setFormData({
      id: question.question_id,
      question_text: question.question_text,
      option_type: question.option_type,
      week_no: question.week_no,
      day_no: question.day_no,
      course_id: question.course_id ?? "",
      options: question.options?.length > 0 ? question.options : ["", ""],
    });
    setIsDrawerOpen(true);
    clearMessage();
  };

  const resetForm = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setErrors({});
    clearMessage();
  };

  // ─── Validation ───────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    if (!formData.course_id) {
      newErrors.course_id = "Must select a course";
    }

    if (!formData.question_text.trim()) {
      newErrors.question_text = "Question is required";
    } else if (formData.question_text.trim().length < 10) {
      newErrors.question_text = "Question should be at least 10 characters";
    } else if (formData.question_text.trim().length > 500) {
      newErrors.question_text = "Question should not exceed 500 characters";
    }

    if (!formData.option_type) {
      newErrors.option_type = "Answer type is required";
    } else if (![1, 2, 3, 4, 5].includes(Number(formData.option_type))) {
      newErrors.option_type = "Invalid answer type selected";
    }

    if (!formData.week_no) {
      newErrors.week_no = "Week number is required";
    } else if (formData.week_no < 1 || formData.week_no > 52) {
      newErrors.week_no = "Week must be between 1 and 52";
    }

    if (!formData.day_no) {
      newErrors.day_no = "Day number is required";
    } else if (formData.day_no < 1 || formData.day_no > 7) {
      newErrors.day_no = "Day must be between 1 and 7";
    }

    // Options validation for types 2, 3, 4
    if (OPTION_TYPES_WITH_OPTIONS.includes(Number(formData.option_type))) {
      const filledOptions = formData.options.filter((o) => o.trim() !== "");
      if (filledOptions.length < 2) {
        newErrors.options = "Please provide at least 2 options";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessage();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload = [
        {
          question_text: formData.question_text.trim(),
          option_type: Number(formData.option_type),
          course_id: Number(formData.course_id),
          week_no: Number(formData.week_no),
          day_no: Number(formData.day_no),
          // Only send options for types 2, 3, 4
          options: OPTION_TYPES_WITH_OPTIONS.includes(
            Number(formData.option_type),
          )
            ? formData.options.filter((o) => o.trim() !== "")
            : [],
        },
      ];

      if (isEditing) {
        await dispatch(
          updateProgressTrackingQuestionAPI({
            questionId: formData.id,
            questionData: payload[0], // send single object for update
          }),
        ).unwrap();
        setActionMessage({
          type: "success",
          text: "Progress question updated successfully",
          details: "Your changes have been saved",
        });
      } else {
        await dispatch(postProgressTrackingQuestionAPI(payload)).unwrap();
        setActionMessage({
          type: "success",
          text: "Progress question added successfully",
          details: "New progress question has been created",
        });
      }

      setFormData({
        id: null,
        question_text: "",
        option_type: "",
        week_no: weekNo,
        day_no: dayNo,
        course_id: "",
        options: ["", ""],
      });

      dispatch(fetchProgressTrackingQuestionsAPI({ weekNo, dayNo }));
      setIsDrawerOpen(false);
    } catch (err) {
      setActionMessage({
        type: "error",
        text: isEditing
          ? "Failed to update Progress question"
          : "Failed to add Progress question",
        details: err.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (questionId) => {
    try {
      setIsSubmitting(true);
      await deleteTrackingQuestion(questionId);
      setActionMessage({
        type: "success",
        text: "Question deleted successfully.",
      });
      dispatch(fetchProgressTrackingQuestionsAPI({ weekNo, dayNo }));
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to delete question.",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-20"></div>
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <BadgeQuestionMarkIcon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Progress Questions
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <select
                    value={weekNo}
                    onChange={(e) => setWeekNo(Number(e.target.value))}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
                      text-gray-700 dark:text-gray-300 text-sm font-medium shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all duration-200"
                  >
                    {[...Array(52)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Week {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <select
                    value={dayNo}
                    onChange={(e) => setDayNo(Number(e.target.value))}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
                      text-gray-700 dark:text-gray-300 text-sm font-medium shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all duration-200"
                  >
                    {[...Array(7)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Day {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <CustomButton
              onClick={handleAddQuestion}
              variant="primary"
              className="relative group overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Add New Question
            </CustomButton>
          </div>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
              actionMessage.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            {actionMessage.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  actionMessage.type === "success"
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {actionMessage.text}
              </p>
              {actionMessage.details && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {actionMessage.details}
                </p>
              )}
            </div>
            <button
              onClick={clearMessage}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Questions List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Loading Questions...
            </p>
          </div>
        ) : error ? (
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
        ) : questions.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800/50">
            <BadgeQuestionMarkIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Questions Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by adding your first question.
            </p>
            <CustomButton
              onClick={handleAddQuestion}
              variant="primary"
              className="mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Question
            </CustomButton>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Total {questions.length} question
              {questions.length !== 1 ? "s" : ""}
            </div>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between p-5 sm:p-6">
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="flex-1 text-left flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          Q{index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {question.question_text}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
                            {OPTION_TYPE_ICONS[question.option_type]}
                            {OPTION_TYPE_LABELS[question.option_type]}
                          </span>
                          {/* Show options count badge for types 2,3,4 */}
                          {OPTION_TYPES_WITH_OPTIONS.includes(
                            question.option_type,
                          ) &&
                            question.options?.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-xs text-indigo-600 dark:text-indigo-400">
                                {question.options.length} options
                              </span>
                            )}
                          <span className="text-xs text-gray-400">
                            {openIndex === index
                              ? "▼ Hide details"
                              : "▶ View details"}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 mt-4 sm:mt-0 ml-0 sm:ml-4">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all hover:scale-105"
                        title="Edit Question"
                      >
                        <SquarePen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.question_id)}
                        disabled={isSubmitting}
                        className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all hover:scale-105 disabled:opacity-50"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {openIndex === index && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top duration-200">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            A
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Answer Type:</span>{" "}
                            {OPTION_TYPE_LABELS[question.option_type] ||
                              "Unknown"}
                          </p>

                          {/* Show options list for types 2, 3, 4 */}
                          {OPTION_TYPES_WITH_OPTIONS.includes(
                            question.option_type,
                          ) &&
                            question.options?.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                  Options:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {question.options.map((opt, optIndex) => (
                                    <span
                                      key={optIndex}
                                      className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-sm text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                                    >
                                      {optIndex + 1}. {opt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            This question expects a{" "}
                            {OPTION_TYPE_LABELS[
                              question.option_type
                            ]?.toLowerCase()}{" "}
                            response.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Drawer */}
        <CustomDrawer
          isOpen={isDrawerOpen}
          onClose={resetForm}
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                {isEditing ? (
                  <Edit className="w-5 h-5 text-indigo-600" />
                ) : (
                  <Plus className="w-5 h-5 text-indigo-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {isEditing ? "Edit Question" : "Add New Question"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isEditing
                    ? "Update question and option type"
                    : "Create a new progress tracking question"}
                </p>
              </div>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                  focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer
                  ${
                    errors.course_id
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                  }`}
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
              {errors.course_id && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.course_id}
                </p>
              )}
            </div>

            {/* Question */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                name="question_text"
                value={formData.question_text}
                onChange={handleChange}
                rows={4}
                placeholder="Enter the question (e.g., How do you feel today?)"
                className={`w-full px-4 py-3 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                  placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 resize-none
                  ${
                    errors.question_text
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                  }`}
              />
              {errors.question_text && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.question_text}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Tip: Make your question clear and specific (10-500 characters)
              </p>
            </div>

            {/* Answer Type */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Answer Type <span className="text-red-500">*</span>
              </label>
              <select
                name="option_type"
                value={formData.option_type}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                  focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer
                  ${
                    errors.option_type
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                  }`}
              >
                <option value="">Select answer type</option>
                <option value={1}>📝 Text</option>
                <option value={2}>🔘 Radio Buttons</option>
                <option value={3}>📋 Dropdown</option>
                <option value={4}>✅ Multiple Select</option>
                <option value={5}>⭐ Rating</option>
              </select>
              {errors.option_type && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.option_type}
                </p>
              )}
            </div>

            {/* ── Dynamic Options (only for types 2, 3, 4) ── */}
            {OPTION_TYPES_WITH_OPTIONS.includes(
              Number(formData.option_type),
            ) && (
              <div>
                <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                  Options <span className="text-red-500">*</span>
                </label>

                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-6 text-right flex-shrink-0">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        className={`flex-1 px-4 py-2.5 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100
                          bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500
                          focus:outline-none focus:ring-2 transition-all duration-200
                          ${
                            errors.options
                              ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                          }`}
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {formData.options.length < 10 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-3 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400
                      hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Option
                  </button>
                )}

                {errors.options && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.options}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Add between 2–10 options for the respondent to choose from.
                </p>
              </div>
            )}

            {/* Week & Day */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Week & Day <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <select
                    name="week_no"
                    value={formData.week_no}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                      focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer
                      ${
                        errors.week_no
                          ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                      }`}
                  >
                    <option value="">Select week</option>
                    {[...Array(52)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Week {i + 1}
                      </option>
                    ))}
                  </select>
                  {errors.week_no && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.week_no}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <select
                    name="day_no"
                    value={formData.day_no}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                      focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer
                      ${
                        errors.day_no
                          ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                      }`}
                  >
                    <option value="">Select day</option>
                    {[...Array(7)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Day {i + 1}
                      </option>
                    ))}
                  </select>
                  {errors.day_no && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.day_no}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 pt-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 -mx-6 px-6">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="order-2 sm:order-1"
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="order-1 sm:order-2 min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isEditing ? "Update Question" : "Create Question"}
                    </>
                  )}
                </CustomButton>
              </div>
            </div>
          </form>
        </CustomDrawer>
      </div>
    </div>
  );
};

export default ProgressTrackingQuestionDetails;
