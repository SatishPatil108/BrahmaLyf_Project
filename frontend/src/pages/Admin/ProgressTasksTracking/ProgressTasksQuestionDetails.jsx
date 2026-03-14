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
  PlusCircle,
  Eye,
  List,
  ChevronRight,
  Filter,
} from "lucide-react";
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import useProgressTaskDetails from "./useProgressTaskDetails";
import { cleanHtml } from "@/components/RichTextEditor/cleanHtml";
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

// Question Form Component
const QuestionForm = ({
  formData,
  errors,
  isEditing,
  isSubmitting,
  handleRichTextChange,
  handleChange,
  handleOptionChange,
  addOption,
  removeOption,
  onCancel,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    {/* Question */}
    <div>
      <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
        Question <span className="text-red-500">*</span>
      </label>
      <RichTextEditor
        value={formData.question_text}
        onChange={handleRichTextChange("question_text")}
        placeholder="Enter the question (e.g., How do you feel today?)"
        error={!!errors.question_text}
        minHeight="150px"
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
        className={`w-full px-4 py-3 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer ${
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
        <option value={6}>📊 Progress Bar</option>
      </select>
      {errors.option_type && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errors.option_type}
        </p>
      )}
    </div>

    {/* Dynamic Options */}
    {OPTION_TYPES_WITH_OPTIONS.includes(Number(formData.option_type)) && (
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
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className={`flex-1 px-4 py-2.5 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
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
            className="mt-3 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
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
            className={`w-full px-4 py-3 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer ${
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
            className={`w-full px-4 py-3 rounded-xl border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer ${
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
      <div className="flex justify-end gap-3">
        <CustomButton
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </CustomButton>
        <CustomButton
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
);

// View Question Drawer
const ViewQuestionDrawer = ({ isOpen, onClose, question }) => {
  if (!question) return null;

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Question Details
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Full question information
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <BadgeQuestionMarkIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3"
                dangerouslySetInnerHTML={{ __html: question.question_text }}
              />
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                  {OPTION_TYPE_ICONS[question.option_type]}
                  {OPTION_TYPE_LABELS[question.option_type]}
                </span>
                {OPTION_TYPES_WITH_OPTIONS.includes(question.option_type) &&
                  question.options?.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                      📋 {question.options.length} options
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
            Answer Type Information
          </h5>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Response Format
              </p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {OPTION_TYPE_LABELS[question.option_type]}
              </p>
            </div>
            {OPTION_TYPES_WITH_OPTIONS.includes(question.option_type) && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Available Options
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {question.options?.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-medium flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {opt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {question.option_type === 6 && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <span className="text-lg">📊</span>
                  Users can set a value from 0% to 100% using +/− controls
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
            Metadata
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Week Number
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Week {question.week_no}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Day Number
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Day {question.day_no}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

// Main Component - Pure Drawer Based with Smooth Transitions
const ProgressTasksQuestionDetails = ({ isOpen, onClose }) => {
  const [weekNo, setWeekNo] = useState(1);
  const [dayNo, setDayNo] = useState(1);
  const { courseId } = useParams();

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

  const questions = progressTasksQuestions?.questions || [];

  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: null,
    question_text: "",
    option_type: "",
    week_no: weekNo,
    day_no: dayNo,
    options: ["", ""],
  });

  // Update form data when week/day changes
  useEffect(() => {
    if (!isEditing) {
      setFormData((prev) => ({ ...prev, week_no: weekNo, day_no: dayNo }));
    }
  }, [weekNo, dayNo, isEditing]);

  // Handlers
  const handleRichTextChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
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
    if (formData.options.length < 10) {
      setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const removeOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setIsFormDrawerOpen(false);
    setIsEditing(false);
    setErrors({});
    clearMessage();
  };

  const openAddQuestionForm = () => {
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
    setIsEditing(true);
    setErrors({});
    setFormData({
      id: question.question_id,
      question_text: question.question_text,
      option_type: question.option_type,
      week_no: question.week_no,
      day_no: question.day_no,
      options: question.options?.length > 0 ? question.options : ["", ""],
    });
    clearMessage();
    setIsFormDrawerOpen(true);
  };

  const openViewDrawer = (question) => {
    setSelectedQuestion(question);
    setIsViewDrawerOpen(true);
  };

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
      console.log(err);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    await handleDeleteQuestion(questionId);
  };

  const handleWeekChange = (newWeek) => {
    setWeekNo(newWeek);
  };

  const handleDayChange = (newDay) => {
    setDayNo(newDay);
  };

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
        {/* Loading State */}
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

        {/* Error State */}
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

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Filter Section */}
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
                    onChange={(e) => handleWeekChange(Number(e.target.value))}
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
                    onChange={(e) => handleDayChange(Number(e.target.value))}
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

            {/* Add Button */}
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

      {/* Nested Form Drawer */}
      <CustomDrawer
        isOpen={isFormDrawerOpen}
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
        {/* Action Message */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
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
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
      </CustomDrawer>

      {/* Nested View Drawer */}
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
