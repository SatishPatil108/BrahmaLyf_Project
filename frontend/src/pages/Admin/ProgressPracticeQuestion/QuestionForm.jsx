import React from "react";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import CustomButton from "@/components/CustomButton";
import { AlertCircle, CheckCircle, PlusCircle } from "lucide-react";

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

export default QuestionForm;
