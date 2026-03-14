import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import useProgressToolsDetails from "./useProgressToolsDetails";
import { useParams } from "react-router-dom";
import { cleanHtml } from "@/components/RichTextEditor/cleanHtml";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";

// Question Form Component
const QuestionForm = ({
  formData,
  errors,
  isEditing,
  isSubmitting,
  handleRichTextChange,
  handleChange,
  onCancel,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    {/* Question */}
    <div>
      <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
        Question (कधी वापरायचा) <span className="text-red-500">*</span>
      </label>
      <RichTextEditor
        value={formData.tools_question}
        onChange={handleRichTextChange("tools_question")}
        placeholder="Enter the tools question"
        error={!!errors.tools_question}
        minHeight="150px"
      />
      {errors.tools_question && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errors.tools_question}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Tip: Make your question clear and specific (3-500 characters)
      </p>
    </div>

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
            <List className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Question Details
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View complete question information
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Question
              </label>
              <p
                className="mt-2 text-gray-900 dark:text-gray-100 text-lg"
                dangerouslySetInnerHTML={{
                  __html: question.tools_question,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Week
                </label>
                <p className="mt-2 text-gray-700 dark:text-gray-300 font-medium">
                  Week {question.week_no}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Day
                </label>
                <p className="mt-2 text-gray-700 dark:text-gray-300 font-medium">
                  Day {question.day_no}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Course
              </label>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {question.course_id || "Not assigned"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

// Main Component - Pure Drawer Based with Smooth Transitions
const ProgressToolsQuestionDetails = ({ isOpen, onClose }) => {
  const [weekNo, setWeekNo] = useState(1);
  const [dayNo, setDayNo] = useState(1);
  const { courseId } = useParams();

  const {
    progressToolsQuestions,
    loading,
    error,
    isSubmitting,
    actionMessage,
    clearMessage,
    addTool,
    updateTool,
    handleDeleteTool,
  } = useProgressToolsDetails(courseId, weekNo, dayNo);

  const tools = progressToolsQuestions?.tools || [];

  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: null,
    tools_question: "",
    week_no: weekNo,
    day_no: dayNo,
  });

  // Update form data when week/day changes
  useEffect(() => {
    if (!isEditing) {
      setFormData((prev) => ({
        ...prev,
        week_no: weekNo,
        day_no: dayNo,
      }));
    }
  }, [weekNo, dayNo, isEditing]);

  const handleRichTextChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["week_no", "day_no"].includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  };

  const openAddQuestionForm = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      tools_question: "",
      week_no: weekNo,
      day_no: dayNo,
    });
    setErrors({});
    clearMessage();
    setIsFormDrawerOpen(true);
  };

  const openEditQuestionForm = (tool) => {
    setIsEditing(true);
    setFormData({
      id: tool.tools_question_id,
      tools_question: tool.tools_question,
      week_no: tool.week_no,
      day_no: tool.day_no,
    });
    setErrors({});
    clearMessage();
    setIsFormDrawerOpen(true);
  };

  const openViewDrawer = (question) => {
    setSelectedQuestion(question);
    setIsViewDrawerOpen(true);
  };

  const resetForm = () => {
    setIsFormDrawerOpen(false);
    setIsEditing(false);
    setErrors({});
    clearMessage();
  };

  // Validation
  const validate = () => {
    const err = {};

    const plainQuestion = cleanHtml(formData.tools_question);

    if (!formData.tools_question.trim()) {
      err.tools_question = "Question is required";
    } else if (plainQuestion.length < 3) {
      err.tools_question = "Minimum 3 characters required";
    }

    if (!formData.week_no) err.week_no = "Week required";
    if (!formData.day_no) err.day_no = "Day required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!courseId) {
      console.error("courseId not found in params");
      return;
    }

    const payload = {
      tools_question: formData.tools_question.trim(),
      week_no: Number(formData.week_no),
      day_no: Number(formData.day_no),
    };

    try {
      if (isEditing) {
        await updateTool(formData.id, courseId, payload);
      } else {
        await addTool(courseId, [payload]);
      }
      resetForm();
    } catch {
      // actionMessage already set inside the hook
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await handleDeleteTool(id);
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
              Please wait while we fetch your questions.
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

        {/* Action Message */}
        {actionMessage && !loading && !error && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 ${
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
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
                      text-gray-700 dark:text-gray-300 text-sm font-medium shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all duration-200"
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
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
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
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Showing questions for Week {weekNo}, Day {dayNo}
              </div>
            </div>

            {/* Add New Question Button */}
            <CustomButton
              onClick={openAddQuestionForm}
              variant="primary"
              className="w-full relative group overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Add New Question
            </CustomButton>

            {/* Questions List */}
            {tools.length === 0 ? (
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
                {tools.map((tool, index) => (
                  <div
                    key={tool.tools_question_id || index}
                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => openViewDrawer(tool)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                              Q{index + 1}
                            </span>
                          </div>
                          <h4
                            className="text-gray-800 dark:text-gray-200 font-medium"
                            dangerouslySetInnerHTML={{
                              __html: tool.tools_question,
                            }}
                          />
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>Week {tool.week_no}</span>
                            <span>•</span>
                            <span>Day {tool.day_no}</span>
                            {tool.course_id && (
                              <>
                                <span>•</span>
                                <span>Course ID: {tool.course_id}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditQuestionForm(tool);
                            }}
                            className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
                            title="Edit Question"
                          >
                            <SquarePen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(tool.tools_question_id);
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
                  ? "Update your progress tracking question"
                  : "Create a new progress tracking question"}
              </p>
            </div>
          </div>
        }
      >
        <QuestionForm
          formData={formData}
          errors={errors}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          handleRichTextChange={handleRichTextChange}
          handleChange={handleChange}
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

export default ProgressToolsQuestionDetails;
