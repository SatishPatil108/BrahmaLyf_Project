import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  SquarePen,
  Trash2,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  X,
  Edit,
  List,
  ChevronRight,
  Filter,
} from "lucide-react";
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import useProgressMessageDetails from "./useProgressMessageDetails";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import { cleanHtml } from "@/components/RichTextEditor/cleanHtml";

// Component for View Message Details
const ViewMessageDrawer = ({ isOpen, onClose, message }) => {
  if (!message) return null;

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Message Details
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Full progress message information
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Message Header */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg mt-1 font-bold text-gray-500 dark:text-gray-400">
                  Week {message.week_no}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Themes */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
            Themes
          </h5>
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: message.themes }} />
          </div>
        </div>

        {/* Weekly Target */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
            Weekly Target
          </h5>
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: message.weekly_target }} />
          </div>
        </div>

        {/* Outcomes */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
            Outcomes
          </h5>
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: message.outcomes }} />
          </div>
        </div>

        {/* Completed Messages */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
            Completed Messages
          </h5>
          <div className="prose dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: message.completed_messages }}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
            Metadata
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Week Number
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Week {message.week_no}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

// Form Fields Component
const FormFields = ({
  messageData,
  errors,
  isEditing,
  isSubmitting,
  handleRichTextChange,
  handleWeekChange,
  resetForm,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Themes */}
    <div>
      <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
        Theme <span className="text-red-500">*</span>
      </label>
      <RichTextEditor
        value={messageData.themes}
        onChange={handleRichTextChange("themes")}
        placeholder="Enter the main themes for this week (e.g., मन ओळखणं, त्यात अडकून न जाणं, आणि observer mode सुरू करणं)"
        error={!!errors.themes}
        minHeight="150px"
      />
      {errors.themes && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errors.themes}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Tip: Describe the key topics covered this week (10-5000 characters)
      </p>
    </div>

    {/* Weekly Target */}
    <div>
      <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
        Weekly Target <span className="text-red-500">*</span>
      </label>
      <RichTextEditor
        value={messageData.weekly_target}
        onChange={handleRichTextChange("weekly_target")}
        placeholder="What should students achieve by the end of this week? (e.g., या आठवड्यात user ने विचार, भावना, mood, fear, inner noise यांच्यात हरवण्यापेक्षा 'हे माझ्या मनात चाललं आहे' असं notice करायला सुरुवात करावी.)"
        error={!!errors.weekly_target}
        minHeight="150px"
      />
      {errors.weekly_target && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errors.weekly_target}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Tip: Set clear, measurable goals for the week (5-5000 characters)
      </p>
    </div>

    {/* Outcomes */}
    <div>
      <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
        Outcomes <span className="text-red-500">*</span>
      </label>
      <RichTextEditor
        value={messageData.outcomes}
        onChange={handleRichTextChange("outcomes")}
        placeholder="What specific outcomes will students achieve by the end of this week?"
        error={!!errors.outcomes}
        minHeight="150px"
      />
      {errors.outcomes && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errors.outcomes}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Tip: List the learning outcomes and deliverables (5-5000 characters)
      </p>
    </div>

    {/* Completed Messages */}
    <div>
      <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
        Completed Messages <span className="text-red-500">*</span>
      </label>
      <RichTextEditor
        value={messageData.completed_messages}
        onChange={handleRichTextChange("completed_messages")}
        placeholder="What messages or feedback have been completed this week?"
        error={!!errors.completed_messages}
        minHeight="150px"
      />
      {errors.completed_messages && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errors.completed_messages}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Tip: Summarize completed progress messages and feedback (5-5000
        characters)
      </p>
    </div>

    {/* Week */}
    <div>
      <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
        Week <span className="text-red-500">*</span>
      </label>
      <select
        name="week_no"
        value={messageData.week_no}
        onChange={handleWeekChange}
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

    {/* Action Buttons */}
    <div className="sticky bottom-0 pt-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 -mx-6 px-6">
      <div className="flex justify-end gap-3">
        <CustomButton
          type="button"
          variant="outline"
          onClick={resetForm}
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
              {isEditing ? "Update Message" : "Create Message"}
            </>
          )}
        </CustomButton>
      </div>
    </div>
  </form>
);

// Main Component - Pure Drawer Based with Smooth Transitions
const ProgressMessageDetails = ({ isOpen, onClose }) => {
  const [weekNo, setWeekNo] = useState(1);
  const { courseId } = useParams();

  const {
    messages,
    loading,
    error,
    isSubmitting,
    actionMessage,
    clearMessage,
    addMessage,
    updateMessage,
    handleDeleteMessage,
  } = useProgressMessageDetails(courseId, weekNo);

  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [messageData, setMessageData] = useState({
    id: null,
    week_no: weekNo,
    themes: "",
    weekly_target: "",
    outcomes: "",
    completed_messages: "",
    outcome_order: 1,
  });

  // Update form data when week changes
  useEffect(() => {
    if (!isEditing) {
      setMessageData((prev) => ({
        ...prev,
        week_no: weekNo,
      }));
    }
  }, [weekNo, isEditing]);

  // Generic Rich Text Editor Change Handler
  const handleRichTextChange = (field) => (value) => {
    setMessageData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleWeekChange = (e) => {
    const { name, value } = e.target;
    setMessageData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const resetForm = () => {
    setIsFormDrawerOpen(false);
    setIsEditing(false);
    setErrors({});
    clearMessage();
  };

  const openAddMessageForm = () => {
    setIsEditing(false);
    setMessageData({
      id: null,
      week_no: weekNo,
      themes: "",
      weekly_target: "",
      outcomes: "",
      completed_messages: "",
      outcome_order: messages.length + 1,
    });
    setErrors({});
    clearMessage();
    setIsFormDrawerOpen(true);
  };

  const openEditMessageForm = (message) => {
    setIsEditing(true);
    setErrors({});
    setMessageData({
      id: message.message_id,
      week_no: message.week_no,
      themes: message.themes,
      weekly_target: message.weekly_target,
      outcomes: message.outcomes,
      completed_messages: message.completed_messages,
      outcome_order: message.outcome_order || 1,
    });
    clearMessage();
    setIsFormDrawerOpen(true);
  };

  const openViewDrawer = (message) => {
    setSelectedMessage(message);
    setIsViewDrawerOpen(true);
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    const plainThemes = cleanHtml(messageData.themes);
    if (!messageData.themes?.trim()) {
      newErrors.themes = "Themes is required";
    } else if (plainThemes.length < 10) {
      newErrors.themes = "Themes should be at least 10 characters";
    } else if (plainThemes.length > 5000) {
      newErrors.themes = "Themes should not exceed 5000 characters";
    }

    const plainWeeklyTarget = cleanHtml(messageData.weekly_target);
    if (!messageData.weekly_target?.trim()) {
      newErrors.weekly_target = "Weekly target is required";
    } else if (plainWeeklyTarget.length < 5) {
      newErrors.weekly_target = "Weekly target should be at least 5 characters";
    } else if (plainWeeklyTarget.length > 5000) {
      newErrors.weekly_target =
        "Weekly target should not exceed 5000 characters";
    }

    const plainOutcomes = cleanHtml(messageData.outcomes);
    if (!messageData.outcomes?.trim()) {
      newErrors.outcomes = "Outcomes is required";
    } else if (plainOutcomes.length < 5) {
      newErrors.outcomes = "Outcomes should be at least 5 characters";
    } else if (plainOutcomes.length > 5000) {
      newErrors.outcomes = "Outcomes should not exceed 5000 characters";
    }

    const plainCompletedMessages = cleanHtml(messageData.completed_messages);
    if (!messageData.completed_messages?.trim()) {
      newErrors.completed_messages = "Completed messages is required";
    } else if (plainCompletedMessages.length < 5) {
      newErrors.completed_messages =
        "Completed messages should be at least 5 characters";
    } else if (plainCompletedMessages.length > 5000) {
      newErrors.completed_messages =
        "Completed messages should not exceed 5000 characters";
    }

    if (!messageData.week_no) {
      newErrors.week_no = "Week number is required";
    } else if (messageData.week_no < 1 || messageData.week_no > 52) {
      newErrors.week_no = "Week must be between 1 and 52";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!courseId) {
      console.error("courseId not found in params");
      return;
    }

    const payload = {
      week_no: Number(messageData.week_no),
      themes: messageData.themes.trim(),
      weekly_target: messageData.weekly_target.trim(),
      outcomes: messageData.outcomes.trim(),
      completed_messages: messageData.completed_messages.trim(),
      outcome_order: 1,
    };

    try {
      if (isEditing) {
        await updateMessage(messageData.id, courseId, payload);
      } else {
        await addMessage(courseId, [payload]);
      }
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete
  const handleDelete = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    await handleDeleteMessage(messageId);
  };

  const handleWeekFilterChange = (newWeek) => {
    setWeekNo(newWeek);
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
              Progress Messages
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage weekly progress messages for your course
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
              Loading Messages...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Please wait while we fetch your messages
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Failed to Load Messages
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
                  Filter Messages
                </span>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Week
                </label>
                <select
                  value={weekNo}
                  onChange={(e) =>
                    handleWeekFilterChange(Number(e.target.value))
                  }
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
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Showing messages for Week {weekNo}
              </div>
            </div>

            {/* Add New Message Button */}
            <CustomButton
              onClick={openAddMessageForm}
              variant="primary"
              className="w-full relative group overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Add New Message
            </CustomButton>

            {/* Messages List */}
            {messages.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No messages found
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  No messages available for Week {weekNo}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Click the button above to add your first message
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={message.message_id || index}
                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => openViewDrawer(message)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                              #{index + 1}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Week {message.week_no}
                            </span>
                          </div>
                          <h4
                            className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2"
                            dangerouslySetInnerHTML={{ __html: message.themes }}
                          />
                          <div
                            className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1"
                            dangerouslySetInnerHTML={{
                              __html: message.weekly_target,
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditMessageForm(message);
                            }}
                            className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
                            title="Edit Message"
                          >
                            <SquarePen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(message.message_id);
                            }}
                            disabled={isSubmitting}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all disabled:opacity-50"
                            title="Delete Message"
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
                {isEditing
                  ? "Edit Progress Message"
                  : "Add New Progress Message"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isEditing
                  ? "Update weekly progress message details"
                  : "Create a new weekly progress tracking message"}
              </p>
            </div>
          </div>
        }
      >
        {/* Action Message inside form */}
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

        <FormFields
          messageData={messageData}
          errors={errors}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          handleRichTextChange={handleRichTextChange}
          handleWeekChange={handleWeekChange}
          resetForm={resetForm}
          handleSubmit={handleSubmit}
        />
      </CustomDrawer>

      {/* Nested View Drawer */}
      <ViewMessageDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setSelectedMessage(null);
          setIsViewDrawerOpen(false);
        }}
        message={selectedMessage}
      />
    </CustomDrawer>
  );
};

export default ProgressMessageDetails;
