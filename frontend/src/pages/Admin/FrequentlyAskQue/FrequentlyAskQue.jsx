import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus, SquarePen, Trash2, AlertCircle, CheckCircle, HelpCircle, Loader2 } from "lucide-react";
import useFrequentlyAskQue from "./useFrequentlyAskQue";
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import { useDispatch } from "react-redux";
import {
  addNewFAQAPI,
  deleteFAQAPI,
  fetchFAQsAPI,
  updateFAQAPI,
} from "@/store/feature/admin";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination/Pagination";

// Color configuration
const COLORS = {
  primary: {
    light: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    dark: { bg: "bg-indigo-900/20", text: "text-indigo-400", border: "border-indigo-800" },
    icon: "text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-600 to-purple-600"
  },
  danger: {
    light: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    dark: { bg: "bg-red-900/20", text: "text-red-400", border: "border-red-800" },
    icon: "text-red-600 dark:text-red-400"
  },
  success: {
    light: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    dark: { bg: "bg-green-900/20", text: "text-green-400", border: "border-green-800" },
    icon: "text-green-600 dark:text-green-400"
  },
  warning: {
    light: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    dark: { bg: "bg-amber-900/20", text: "text-amber-400", border: "border-amber-800" },
    icon: "text-amber-600 dark:text-amber-400"
  }
};

const FrequentlyAskQue = () => {
  const dispatch = useDispatch();
  const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1, 5);
  const { faqsDetails, loading, error } = useFrequentlyAskQue(pageNo, pageSize);
  const faqList = faqsDetails.faqs;
  
  const [openIndex, setOpenIndex] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, question: "", answer: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const clearMessage = () => setActionMessage(null);

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  const handleAddFAQ = () => {
    setIsEditing(false);
    setFormData({ question: "", answer: "" });
    setIsDrawerOpen(true);
    clearMessage();
  };

  const resetForm = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setErrors({});
    clearMessage();
  };

  const handleEditFAQ = (faq) => {
    setIsEditing(true);
    setErrors({});
    setFormData({ id: faq.id, question: faq.question, answer: faq.answer });
    setIsDrawerOpen(true);
    clearMessage();
  };

  const handleDeleteFAQ = async (id, question) => {
    if (window.confirm(`Are you sure you want to delete "${question}"?`)) {
      setIsSubmitting(true);
      try {
        await dispatch(deleteFAQAPI(id)).unwrap();
        setActionMessage({
          type: 'success',
          text: 'FAQ deleted successfully',
          details: `"${question}" has been removed`
        });
        dispatch(fetchFAQsAPI({ pageNo, pageSize }));
      } catch (error) {
        setActionMessage({
          type: 'error',
          text: 'Failed to delete FAQ',
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
    let isValid = true;
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
      isValid = false;
    } else if (formData.question.length < 10) {
      newErrors.question = "Question should be at least 10 characters";
      isValid = false;
    }

    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
      isValid = false;
    } else if (formData.answer.length < 20) {
      newErrors.answer = "Answer should be at least 20 characters";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessage();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await dispatch(
          updateFAQAPI({
            faqId: formData.id,
            faqData: { question: formData.question, answer: formData.answer },
          })
        ).unwrap();
        
        setActionMessage({
          type: 'success',
          text: 'FAQ updated successfully',
          details: 'Your changes have been saved'
        });
      } else {
        await dispatch(addNewFAQAPI(formData)).unwrap();
        
        setActionMessage({
          type: 'success',
          text: 'FAQ added successfully',
          details: 'New FAQ has been created'
        });
      }
      
      setFormData({ id: null, question: "", answer: "" });
      dispatch(fetchFAQsAPI({ pageNo, pageSize }));
      setIsDrawerOpen(false);
    } catch (error) {
      setActionMessage({
        type: 'error',
        text: isEditing ? 'Failed to update FAQ' : 'Failed to add FAQ',
        details: error.message || 'Please try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    dispatch(fetchFAQsAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Frequently Asked Questions
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage common questions and answers
              </p>
            </div>
          </div>
          
          <CustomButton
            onClick={handleAddFAQ}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New FAQ
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

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-4">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Loading FAQs...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Please wait while we fetch your questions
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load FAQs
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
              {error.message || "An error occurred while loading FAQs"}
            </p>
            <CustomButton 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Retry
            </CustomButton>
          </div>
        ) : faqList.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900">
            <HelpCircle className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No FAQs Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by adding your first frequently asked question
            </p>
            <CustomButton
              onClick={handleAddFAQ}
              variant="primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First FAQ
            </CustomButton>
          </div>
        ) : (
          <>
            {/* FAQ List */}
            <div className="space-y-4">
              {faqList.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between p-5">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="flex-1 text-left flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          Q{index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-left">
                          {faq.question}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {openIndex === index ? (
                            <>
                              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                Hide answer
                              </span>
                              <ChevronUp className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                            </>
                          ) : (
                            <>
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                View answer
                              </span>
                              <ChevronDown className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditFAQ(faq)}
                        className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                        title="Edit FAQ"
                      >
                        <SquarePen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id, faq.question)}
                        disabled={isSubmitting}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                  
                  {openIndex === index && (
                    <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            A
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {faqsDetails.total_pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pageNo}
                  totalPages={faqsDetails.total_pages}
                  onPageChange={setPageNo}
                />
              </div>
            )}
          </>
        )}

        {/* Add/Edit FAQ Drawer */}
        <CustomDrawer
          isOpen={isDrawerOpen}
          onClose={resetForm}
          title={isEditing ? "Edit FAQ" : "Add New FAQ"}
          subtitle={isEditing ? "Update question and answer below" : "Create a new frequently asked question"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Field */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Question *
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                  placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.question
                    ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                  }`}
                placeholder="Enter the question (e.g., How do I reset my password?)"
              />
              {errors.question && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.question}
                </p>
              )}
            </div>

            {/* Answer Field */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Answer *
              </label>
              <textarea
                name="answer"
                rows={5}
                value={formData.answer}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                  placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.answer
                    ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                  }`}
                placeholder="Enter the detailed answer..."
              />
              {errors.answer && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.answer}
                </p>
              )}
            </div>

            {/* Form submission errors */}
            {errors.submit && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Save Button */}
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
                      {isEditing ? 'Update FAQ' : 'Create FAQ'}
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

export default FrequentlyAskQue;