import React, { useState, useEffect } from "react";

import { ChevronDown, ChevronUp, Plus, SquarePen, Trash2, AlertCircle, CheckCircle, HelpCircle, Loader2, BadgeQuestionMarkIcon } from "lucide-react";

import { useDispatch } from "react-redux";

import useProgressTrackingQuestionsDetails from "./useProgressTrackingQuestionsDetails";
import { fetchProgressTrackingQuestionsAPI } from "@/store/feature/admin";
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";


const ProgressTrackingQuestionDetails = () => {
  const dispatch = useDispatch();

  const [weekNo, setWeekNo] = useState(1);
  const [dayNo, setDayNo] = useState(1);
  const [activeType, setActiveType] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


  const {
    progressTrackingQuestionsDetails,
    loading,
    error,
    isSubmitting,
    actionMessage,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    clearMessage,
  } = useProgressTrackingQuestionsDetails(weekNo, dayNo);

  const questionsList = progressTrackingQuestionsDetails?.questions ?? [];

  const toggleQuestion = (index) => setOpenIndex(openIndex === index ? null : index);



  // useEffect(() => {
  //   // dispatch(fetchProgressTrackingQuestionsAPI({ weekNo, dayNo }));
  // }, [dispatch, weekNo, dayNo]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <BadgeQuestionMarkIcon className="w-9 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Progress tracking Questions
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage the progress tracking questions and option types for each week and day. You can add, edit, or delete questions to keep your content up-to-date.
              </p>
            </div>
          </div>

          <CustomButton
            onClick={addQuestion}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Question
          </CustomButton>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${actionMessage.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${actionMessage.type === 'success'
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
              Loading tracking questions...
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
              Failed to Load progress tracking questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
              {error.message || "An error occurred while loading progress tracking questions. Please try again."}
            </p>
            <CustomButton
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </CustomButton>
          </div>
        ) : questionsList.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900">
            <HelpCircle className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Progress tracking questions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by adding your first progress tracking question
            </p>
            <CustomButton
              onClick={addQuestion}
              variant="primary"
              className="mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Question
            </CustomButton>
          </div>
        ) : (
          <>
            {/* Question List */}
            <div className="space-y-4">
              {questionsList.map((que, index) => (
                <div
                  key={que.id}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between p-5">
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="flex-1 text-left flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          Q{index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-left">
                          {que.question}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {openIndex === index ? (
                            <>
                              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                Hide option types
                              </span>
                              <ChevronUp className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                            </>
                          ) : (
                            <>
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                View option types
                              </span>
                              <ChevronDown className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                            </>
                          )}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => updateQuestion(que)}
                        className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                        title="Edit Question"
                      >
                        <SquarePen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(que.id, que.question)}
                        disabled={isSubmitting}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                        title="Delete Question and its options"
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
                            {que.options.map((opt, idx) => (
                              <span key={idx} className="block">
                                {opt}
                              </span>
                            ))}
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

       
         
      </div>
    </div>
  );
};

export default ProgressTrackingQuestionDetails;