import React, { useState, useEffect } from "react";
import {
    Plus, SquarePen, Trash2, AlertCircle, CheckCircle, HelpCircle, BookOpen
} from "lucide-react";

import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";

import { useDispatch } from "react-redux";
import usePagination from "@/hooks";
import useUserNotes from "./useUserNotes";
import { deleteUserNotesAPI, fetchUserNotesAPI, postUserNotesAPI, updateUserNotesAPI } from "@/store/feature/user";
import Pagination from "@/components/Pagination/Pagination";
import { useTheme } from "@/contexts/ThemeContext";


const PersonalNotes = () => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const { pageNo, pageSize, setPageNo } = usePagination(1, 5);
    const { userNotesDetails, loading, error } = useUserNotes(pageNo, pageSize);
    const notesList = userNotesDetails.notes;


    const [openIndex, setOpenIndex] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, user_note: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    const clearMessage = () => setActionMessage(null);

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
                    type: 'success',
                    text: 'User Note deleted successfully',
                    details: `"${note}" has been removed`
                });
                dispatch(fetchUserNotesAPI({ pageNo, pageSize }));
            } catch (error) {
                setActionMessage({
                    type: 'error',
                    text: 'Failed to delete user Note',
                    details: error.message || 'Please try again'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
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
                    })
                ).unwrap();
                setActionMessage({
                    type: 'success',
                    text: 'User Note updated successfully',
                    details: 'Your changes have been saved'
                });
            } else {
                // await dispatch(postUserNotesAPI(formData)).unwrap();
                await dispatch(postUserNotesAPI({ user_note: formData.user_note })).unwrap();
                setActionMessage({
                    type: 'success',
                    text: 'User Note added successfully',
                    details: 'New user Note has been created'
                });
            }
            setFormData({ id: null, user_note: "" });
            dispatch(fetchUserNotesAPI({ pageNo, pageSize }));
            setIsDrawerOpen(false);
        } catch (error) {
            setActionMessage({
                type: 'error',
                text: isEditing ? 'Failed to update User Note' : 'Failed to add User Note',
                details: error.message || 'Please try again'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        dispatch(fetchUserNotesAPI({ pageNo, pageSize }));
    }, [dispatch, pageNo, pageSize]);

    return (
        // ✅ theme applied as data-theme attribute — Tailwind dark: classes do the rest
        <div data-theme={theme} className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Create Your Own Notes
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage your own notes
                            </p>
                        </div>
                    </div>
                    <CustomButton
                        onClick={handleAddUserNotes}
                        variant="primary"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Note
                    </CustomButton>
                </div>

                {/* Action Message */}
                {actionMessage && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        actionMessage.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}>
                        {actionMessage.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                        <div className="flex-1">
                            <p className={`font-medium ${
                                actionMessage.type === 'success'
                                    ? 'text-green-700 dark:text-green-400'
                                    : 'text-red-700 dark:text-red-400'
                            }`}>
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
                            ✕
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative mb-4">
                            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                            Loading notes...
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            Please wait while we fetch your notes
                        </p>
                    </div>

                /* Error State */
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Failed to Load Notes
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                            {error.message || "An error occurred while loading notes"}
                        </p>
                        <CustomButton variant="outline" onClick={() => window.location.reload()}>
                            Retry
                        </CustomButton>
                    </div>

                /* Empty State */
                ) : notesList.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800">
                        <HelpCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No Notes Found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Get started by adding your first note
                        </p>
                        <CustomButton onClick={handleAddUserNotes} variant="primary" className="mx-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Add your First Note
                        </CustomButton>
                    </div>

                /* Notes List */
                ) : (
                    <>
                        <div className="space-y-4">
                            {notesList.map((note, index) => (
                                <div
                                    key={note.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between p-5">
                                        <button
                                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                            className="flex-1 text-left flex items-start gap-3 group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <p className={`flex-1 font-medium text-left transition-colors line-clamp-2 ${
                                                openIndex === index
                                                    ? 'text-indigo-600 dark:text-indigo-400'
                                                    : 'text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                                            }`}>
                                                {note.user_note}
                                            </p>
                                        </button>

                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => handleEditUserNotes(note)}
                                                className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                                title="Edit Note"
                                            >
                                                <SquarePen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUserNotes(note.id, note.user_note)}
                                                disabled={isSubmitting}
                                                className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                                                title="Delete Note"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded note body */}
                                    {openIndex === index && (
                                        <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
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
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                                Your Note
                            </label>
                            <textarea
                                name="user_note"
                                value={formData.user_note}
                                onChange={handleChange}
                                rows={5}
                                className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                                    placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200
                                    ${errors.user_note
                                        ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                                        : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                                    }`}
                                placeholder="Write your note here"
                            />
                            {errors.user_note && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {errors.user_note}
                                </p>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {errors.submit}
                                </p>
                            </div>
                        )}

                        <div className="sticky bottom-0 pt-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 -mx-4 px-4">
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
                                    className="min-w-[120px]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            {isEditing ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            {isEditing ? 'Update Note' : 'Create Note'}
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