import React, { useState } from "react";
import useProgressTrackingQuestionsDetails from "./useProgressTrackingQuestionsDetails";
import useWeekDay from "@/hooks/useWeekDay";
import {
  Plus,
  SquarePen,
  Trash2,
  AlertCircle,
  CheckCircle,
  BadgeQuestionMarkIcon,
  X,
  Edit,
} from "lucide-react";

import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import {
  fetchProgressTrackingQuestionsAPI,
  postProgressTrackingQuestionAPI,
  updateProgressTrackingQuestionAPI,
} from "@/store/feature/admin";
import { useDispatch, useSelector } from "react-redux";

const ProgressTrackingQuestionDetails = () => {
  const { weekNo, dayNo } = useWeekDay(1, 1);
  const dispatch = useDispatch();
  const {
    progressTrackingQuestionsDetails,
    loading,
    error,
    deleteTrackingQuestion,
  } = useProgressTrackingQuestionsDetails(weekNo, dayNo);

  const { coursesDetails } = useSelector((state) => state.admin);

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

  const questions = progressTrackingQuestionsDetails?.questions || [];
  const courses = coursesDetails?.courses || [];

  const [openIndex, setOpenIndex] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    question_text: "",
    option_type: "",
    week_no: weekNo,
    day_no: dayNo,
    course_id: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const clearMessage = () => setActionMessage(null);

  const toggleQuestion = (index) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  const handleAddQuestion = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      question_text: "",
      option_type: "",
      week_no: weekNo,
      day_no: dayNo,
      course_id: "",
    });
    setErrors({});
    setIsDrawerOpen(true);
    clearMessage();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "option_type" ? parseInt(value) : value,
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.course_id) {
      newErrors.course_id = "Must select a course";
      isValid = false;
    }

    if (!formData.question_text.trim()) {
      newErrors.question_text = "Question is required";
      isValid = false;
    } else if (formData.question_text.trim().length < 10) {
      newErrors.question_text = "Question should be at least 10 characters";
      isValid = false;
    }

    if (!formData.option_type) {
      newErrors.option_type = "Option type is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setErrors({});
    clearMessage();
  };

  const handleEditQuestion = (question) => {
    setIsEditing(true);
    setErrors({});
    setFormData({
      id: question.question_id,
      question_text: question.question_text,
      option_type: question.option_type,
      week_no: question.week_no,
      day_no: question.day_no,
      course_id: question.course_id ?? "",
    });
    setIsDrawerOpen(true);
    clearMessage();
  };

  const handleDelete = async (questionId) => {
    try {
      setIsSubmitting(true);
      await deleteTrackingQuestion(questionId);
      setActionMessage({
        type: "success",
        text: "Question deleted successfully.",
      });
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

  const handleSubmit = async (e) => {
    console.log("FORM SUBMIT TRIGGERED ✅");
    e.preventDefault();
    clearMessage();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await dispatch(
          updateProgressTrackingQuestionAPI({
            questionId: formData.id,
            questionData: {
              question_text: formData.question_text,
              option_type: formData.option_type,
              course_id: formData.course_id,
              week_no: formData.week_no,
              day_no: formData.day_no,
            },
          }),
        ).unwrap();

        setActionMessage({
          type: "success",
          text: "Progress question updated successfully",
          details: "Your changes have been saved",
        });
      } else {
        const { id, ...formData } = formData; // strip id
        await dispatch(postProgressTrackingQuestionAPI(formData)).unwrap();

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
      });
      dispatch(fetchProgressTrackingQuestionsAPI({ weekNo, dayNo }));
      setIsDrawerOpen(false);
    } catch (error) {
      setActionMessage({
        type: "error",
        text: isEditing
          ? "Failed to update Progress question"
          : "Failed to add Progress question",
        details: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
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
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Week {weekNo} • Day {dayNo}
                </p>
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

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Loading Questions...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Please wait while we fetch your questions
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Failed to Load Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              {error.message || "An error occurred while loading questions"}
            </p>
            <CustomButton
              variant="outline"
              onClick={() => window.location.reload()}
              className="px-6 py-3"
            >
              Try Again
            </CustomButton>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800/50 backdrop-blur-sm">
            <BadgeQuestionMarkIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Questions Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by adding your first question to the progress tracking
              system.
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
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Total {questions.length} question
              {questions.length !== 1 ? "s" : ""}
            </div>

            {/* Question List */}
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.question_id}
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
                            <span>
                              {OPTION_TYPE_ICONS[question.option_type]}
                            </span>
                            {OPTION_TYPE_LABELS[question.option_type]}
                          </span>
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
                        onClick={() => handleDelete(question.question_id)} // FIX 2: use wrapped handler that toggles isSubmitting
                        disabled={isSubmitting}
                        className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all hover:scale-105 disabled:opacity-50"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>

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
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            This question expects a{" "}
                            {OPTION_TYPE_LABELS[
                              question.option_type
                            ]?.toLowerCase()}{" "}
                            response from the user.
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

        {/* Add/Edit Question Drawer */}
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
            {/* Course Field */}
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

            {/* Question Field */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                name="question_text"
                value={formData.question_text}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                  placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 resize-none
                  ${
                    errors.question_text
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                  }`}
                placeholder="Enter the question (e.g., How do you feel today?)"
              />
              {errors.question_text && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.question_text}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Tip: Make your question clear and specific for better responses
              </p>
            </div>

            {/* Option Type Field */}
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

            {/* Form submission errors */}
            {errors.submit && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errors.submit}
                </p>
              </div>
            )}

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
