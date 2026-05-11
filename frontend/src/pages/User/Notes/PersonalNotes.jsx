import React, { useState, useEffect } from "react";
import {
  Plus,
  SquarePen,
  Trash2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  BookOpen,
} from "lucide-react";

import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";

import { useDispatch } from "react-redux";
import usePagination from "@/hooks";
import useUserNotes from "./useUserNotes";
import {
  deleteUserNotesAPI,
  fetchUserNotesAPI,
  postUserNotesAPI,
  updateUserNotesAPI,
} from "@/store/feature/user";
import Pagination from "@/components/Pagination/Pagination";
import { useTheme } from "@/contexts/ThemeContext";

const PersonalNotes = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { pageNo, pageSize, setPageNo } = usePagination(1, 5);
  const { userNotesDetails, loading, error } = useUserNotes(pageNo, pageSize);
  const notesList = userNotesDetails?.notes || [];

  const [openIndex, setOpenIndex] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, user_note: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const clearMessage = () => setActionMessage(null);

  // Theme colors configuration
  const themeColors = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      text: "text-gray-100",
      mutedText: "text-gray-400",
      accent: "from-purple-600 to-pink-500",
      accentText:
        "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
      cardBg: "bg-gray-800/50 backdrop-blur-sm border border-gray-700",
      cardHover: "hover:shadow-lg hover:shadow-purple-900/20",
      border: "border-gray-700",
      inputBg: "bg-gray-800",
      inputBorder: "border-gray-700",
      inputFocus: "focus:ring-purple-500",
      buttonPrimary:
        "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
      buttonOutline: "border-gray-600 text-gray-300 hover:bg-gray-800",
      emptyStateBg: "bg-gray-800/30",
      emptyStateBorder: "border-gray-700",
      iconBg: "bg-gray-800",
      successBg: "bg-green-900/20",
      successBorder: "border-green-800",
      successText: "text-green-400",
      errorBg: "bg-red-900/20",
      errorBorder: "border-red-800",
      errorText: "text-red-400",
      noteItemBg: "bg-gray-800",
      noteItemBorder: "border-gray-700",
      noteItemHover: "hover:shadow-md hover:shadow-purple-900/20",
      expandBorder: "border-gray-700",
      drawerBg: "bg-gray-900",
      drawerBorder: "border-gray-700",
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      text: "text-gray-900",
      mutedText: "text-gray-600",
      accent: "from-purple-500 to-pink-400",
      accentText:
        "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
      cardBg: "bg-white/70 backdrop-blur-sm border border-gray-200",
      cardHover: "hover:shadow-lg hover:shadow-purple-500/10",
      border: "border-gray-200",
      inputBg: "bg-white",
      inputBorder: "border-gray-300",
      inputFocus: "focus:ring-purple-500",
      buttonPrimary:
        "bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500",
      buttonOutline: "border-gray-300 text-gray-700 hover:bg-gray-50",
      emptyStateBg: "bg-white",
      emptyStateBorder: "border-gray-300",
      iconBg: "bg-white",
      successBg: "bg-green-50",
      successBorder: "border-green-200",
      successText: "text-green-700",
      errorBg: "bg-red-50",
      errorBorder: "border-red-200",
      errorText: "text-red-700",
      noteItemBg: "bg-white",
      noteItemBorder: "border-gray-200",
      noteItemHover: "hover:shadow-md hover:shadow-purple-500/10",
      expandBorder: "border-gray-100",
      drawerBg: "bg-white",
      drawerBorder: "border-gray-200",
    },
  };

  const colors = themeColors[theme] || themeColors.light;

  const handleAddUserNotes = () => {
    setIsEditing(false);
    setFormData({ user_note: "" });
    setIsDrawerOpen(true);
    clearMessage();
  };

  const resetForm = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setErrors({});
    clearMessage();
  };

  const handleEditUserNotes = (note) => {
    setIsEditing(true);
    setErrors({});
    setFormData({ id: note.id, user_note: note.user_note });
    setIsDrawerOpen(true);
    clearMessage();
  };

  const handleDeleteUserNotes = async (id, note) => {
    if (window.confirm(`Are you sure you want to delete "${note}"?`)) {
      setIsSubmitting(true);
      try {
        await dispatch(deleteUserNotesAPI(id)).unwrap();
        setActionMessage({
          type: "success",
          text: "User Note deleted successfully",
          details: `"${note}" has been removed`,
        });
        dispatch(fetchUserNotesAPI({ pageNo, pageSize }));
      } catch (error) {
        setActionMessage({
          type: "error",
          text: "Failed to delete user Note",
          details: error.message || "Please try again",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_note.trim()) {
      newErrors.user_note = "Note is required";
    } else if (formData.user_note.length < 10) {
      newErrors.user_note = "Note should be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessage();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await dispatch(
          updateUserNotesAPI({
            noteId: formData.id,
            notesData: { user_note: formData.user_note },
          }),
        ).unwrap();
        setActionMessage({
          type: "success",
          text: "User Note updated successfully",
          details: "Your changes have been saved",
        });
      } else {
        await dispatch(
          postUserNotesAPI({ user_note: formData.user_note }),
        ).unwrap();
        setActionMessage({
          type: "success",
          text: "User Note added successfully",
          details: "New user Note has been created",
        });
      }
      setFormData({ id: null, user_note: "" });
      dispatch(fetchUserNotesAPI({ pageNo, pageSize }));
      setIsDrawerOpen(false);
    } catch (error) {
      setActionMessage({
        type: "error",
        text: isEditing
          ? "Failed to update User Note"
          : "Failed to add User Note",
        details: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    dispatch(fetchUserNotesAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  useEffect(() => {
    if (!actionMessage) return;

    const timer = setTimeout(() => {
      setActionMessage(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [actionMessage]);

  return (
    <div
      className={`${colors.bg} min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${colors.text}`}>
                Create Your Own Notes
              </h1>
              <p className={`text-sm ${colors.mutedText}`}>
                Manage your own notes
              </p>
            </div>
          </div>
          <CustomButton
            onClick={handleAddUserNotes}
            variant="primary"
            className={`flex items-center gap-2 ${colors.buttonPrimary}`}
          >
            <Plus className="w-4 h-4" />
            Add New Note
          </CustomButton>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              actionMessage.type === "success"
                ? `${colors.successBg} border ${colors.successBorder}`
                : `${colors.errorBg} border ${colors.errorBorder}`
            }`}
          >
            {actionMessage.type === "success" ? (
              <CheckCircle className={`w-5 h-5 ${colors.successText}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${colors.errorText}`} />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  actionMessage.type === "success"
                    ? colors.successText
                    : colors.errorText
                }`}
              >
                {actionMessage.text}
              </p>
              {actionMessage.details && (
                <p className={`text-sm ${colors.mutedText} mt-1`}>
                  {actionMessage.details}
                </p>
              )}
            </div>
            <button
              onClick={clearMessage}
              className={`${colors.mutedText} hover:${colors.text} transition-colors`}
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-4">
              <div
                className={`w-12 h-12 rounded-full border-4 ${colors.border}`}
              ></div>
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
            </div>
            <p className={`text-lg font-medium ${colors.mutedText}`}>
              Loading notes...
            </p>
            <p className={`text-sm ${colors.mutedText} mt-2`}>
              Please wait while we fetch your notes
            </p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className={`w-16 h-16 rounded-full ${colors.errorBg} flex items-center justify-center mb-4`}
            >
              <AlertCircle className={`w-8 h-8 ${colors.errorText}`} />
            </div>
            <h2 className={`text-xl font-semibold ${colors.text} mb-2`}>
              Failed to Load Notes
            </h2>
            <p className={`${colors.mutedText} text-center max-w-md mb-4`}>
              {error.message || "An error occurred while loading notes"}
            </p>
            <CustomButton
              variant="outline"
              onClick={() => window.location.reload()}
              className={colors.buttonOutline}
            >
              Retry
            </CustomButton>
          </div>
        ) : notesList.length === 0 ? (
          /* Empty State */
          <div
            className={`text-center py-16 border-2 border-dashed ${colors.emptyStateBorder} rounded-2xl ${colors.emptyStateBg}`}
          >
            <HelpCircle
              className={`w-16 h-16 ${colors.mutedText} mx-auto mb-4`}
            />
            <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
              No Notes Found
            </h3>
            <p className={`${colors.mutedText} mb-6`}>
              Get started by adding your first note
            </p>
            <CustomButton
              onClick={handleAddUserNotes}
              variant="primary"
              className={`mx-auto ${colors.buttonPrimary}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add your First Note
            </CustomButton>
          </div>
        ) : (
          /* Notes List */
          <>
            <div className="space-y-4">
              {notesList.map((note, index) => (
                <div
                  key={note.id}
                  className={`${colors.noteItemBg} rounded-xl border ${colors.noteItemBorder} shadow-sm transition-all duration-300 ${colors.noteItemHover}`}
                >
                  <div className="flex items-start justify-between p-5">
                    <button
                      onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                      className="flex-1 text-left flex items-start gap-3 group"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${colors.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 border ${colors.border}`}
                      >
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {index + 1}
                        </span>
                      </div>
                      <p
                        className={`flex-1 font-medium text-left transition-colors line-clamp-2 ${
                          openIndex === index
                            ? "text-purple-600 dark:text-purple-400"
                            : `${colors.text} group-hover:text-purple-600 dark:group-hover:text-purple-400`
                        }`}
                      >
                        {note.user_note}
                      </p>
                    </button>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditUserNotes(note)}
                        className={`p-2 rounded-lg ${colors.iconBg} hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors border ${colors.border}`}
                        title="Edit Note"
                      >
                        <SquarePen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteUserNotes(note.id, note.user_note)
                        }
                        disabled={isSubmitting}
                        className={`p-2 rounded-lg ${colors.iconBg} hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 border ${colors.border}`}
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded note body */}
                  {openIndex === index && (
                    <div
                      className={`px-5 pb-5 pt-2 border-t ${colors.expandBorder}`}
                    >
                      <p
                        className={`${colors.mutedText} leading-relaxed whitespace-pre-wrap`}
                      >
                        {note.user_note}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {userNotesDetails.total_pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pageNo}
                  totalPages={userNotesDetails.total_pages}
                  onPageChange={setPageNo}
                />
              </div>
            )}
          </>
        )}

        {/* Add/Edit Drawer */}
        <CustomDrawer
          isOpen={isDrawerOpen}
          onClose={resetForm}
          title={isEditing ? "Edit Note" : "Add New Note"}
          className={colors.drawerBg}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block font-medium mb-2 ${colors.text}`}>
                Your Note
              </label>
              <textarea
                name="user_note"
                value={formData.user_note}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm ${colors.text} ${colors.inputBg}
                  placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200
                  ${
                    errors.user_note
                      ? `border-red-300 dark:border-red-700 focus:ring-red-500 ${colors.errorBg}`
                      : `${colors.inputBorder} focus:ring-purple-500 focus:border-transparent`
                  }`}
                placeholder="Write your note here"
              />
              {errors.user_note && (
                <p
                  className={`mt-2 text-sm ${colors.errorText} flex items-center gap-1`}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.user_note}
                </p>
              )}
            </div>

            {errors.submit && (
              <div
                className={`p-4 rounded-lg ${colors.errorBg} border ${colors.errorBorder}`}
              >
                <p className={`${colors.errorText} flex items-center gap-2`}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errors.submit}
                </p>
              </div>
            )}

            <div
              className={`sticky bottom-0 pt-6 ${colors.drawerBg} border-t ${colors.drawerBorder} -mx-4 px-4`}
            >
              <div className="flex justify-end gap-3">
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className={colors.buttonOutline}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className={`min-w-[120px] ${colors.buttonPrimary}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isEditing ? "Update Note" : "Create Note"}
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

export default PersonalNotes;
