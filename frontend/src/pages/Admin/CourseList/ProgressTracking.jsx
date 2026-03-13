import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

const OPTION_TYPES = [
  { value: 1, label: "Text" },
  { value: 2, label: "Radio Buttons" },
  { value: 3, label: "Dropdown" },
  { value: 4, label: "Multiple Select" },
  { value: 5, label: "Rating Scale" },
];

const emptyQuestion = () => ({
  question_text: "",
  option_type: "",
  week_no: "",
  day_no: "",
});

const validateItem = (item) => {
  const errors = {};

  if (!item.question_text?.trim())
    errors.question_text = "Question text is required";
  else if (item.question_text.trim().length < 10)
    errors.question_text = "Question text must be at least 10 characters";

  if (!item.option_type)
    errors.option_type = "Option type is required";
  else if (![1, 2, 3, 4, 5].includes(Number(item.option_type)))
    errors.option_type = "Please select a valid option type";

  if (!item.week_no?.toString().trim())
    errors.week_no = "Week number is required";
  else if (isNaN(item.week_no) || item.week_no < 1 || item.week_no > 52)
    errors.week_no = "Week must be between 1 and 52";

  if (!item.day_no?.toString().trim())
    errors.day_no = "Day number is required";
  else if (isNaN(item.day_no) || item.day_no < 1 || item.day_no > 7)
    errors.day_no = "Day must be between 1 and 7";

  return errors;
};

const ProgressTracking = ({
  progressTracking = [],
  setProgressTracking = () => {},
  formErrors: parentErrors = {},
}) => {
  const [localTracking, setLocalTracking] = useState(
    progressTracking.length ? progressTracking : [emptyQuestion()]
  );
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync with parent
  useEffect(() => {
    if (progressTracking.length) {
      setLocalTracking(progressTracking);
    }
  }, []);

  // Sync parent errors
  useEffect(() => {
    if (parentErrors && Object.keys(parentErrors).length > 0) {
      setFormErrors(parentErrors);
      // Mark all fields as touched to show errors
      const allTouched = {};
      localTracking.forEach((_, i) => {
        allTouched[i] = {
          question_text: true,
          option_type: true,
          week_no: true,
          day_no: true,
        };
      });
      setTouched(allTouched);
    }
  }, [parentErrors]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...localTracking];
    updated[index] = { ...updated[index], [name]: value };
    setLocalTracking(updated);
    setProgressTracking(updated);

    // Clear error on change
    if (formErrors[index]?.[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [index]: { ...prev[index], [name]: "" },
      }));
    }
  };

  const handleBlur = (index, field) => {
    setTouched((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: true },
    }));
    const errors = validateItem(localTracking[index]);
    if (errors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [index]: { ...prev[index], [field]: errors[field] },
      }));
    }
  };

  const validateAll = () => {
    const allErrors = {};
    let hasErrors = false;
    localTracking.forEach((item, i) => {
      const err = validateItem(item);
      if (Object.keys(err).length) {
        allErrors[i] = err;
        hasErrors = true;
      }
    });
    setFormErrors(allErrors);
    // Mark all as touched
    const allTouched = {};
    localTracking.forEach((_, i) => {
      allTouched[i] = { question_text: true, option_type: true, week_no: true, day_no: true };
    });
    setTouched(allTouched);
    return !hasErrors;
  };

  const handleAdd = () => {
    if (!validateAll()) return;
    const updated = [...localTracking, emptyQuestion()];
    setLocalTracking(updated);
    setProgressTracking(updated);
    setFormErrors((p) => ({ ...p, [updated.length - 1]: {} }));
    setTouched((p) => ({ ...p, [updated.length - 1]: {} }));
  };

  const handleRemove = (index) => {
    if (localTracking.length <= 1) return;
    const updated = localTracking.filter((_, i) => i !== index);
    setLocalTracking(updated);
    setProgressTracking(updated);
    // Re-index errors and touched
    const newErrors = {};
    const newTouched = {};
    updated.forEach((_, i) => {
      newErrors[i] = formErrors[i >= index ? i + 1 : i] || {};
      newTouched[i] = touched[i >= index ? i + 1 : i] || {};
    });
    setFormErrors(newErrors);
    setTouched(newTouched);
  };

  const getError = (index, field) =>
    touched[index]?.[field] ? formErrors[index]?.[field] : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Progress Tracking Questions
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {localTracking.length} question{localTracking.length !== 1 ? "s" : ""}
        </span>
      </div>

      {localTracking.map((item, index) => (
        <div
          key={index}
          data-curriculum-index={index}
          className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4 bg-white dark:bg-gray-900"
        >
          {/* Question Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Question #{index + 1}
            </h3>
            {localTracking.length > 1 && (
              <button
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                title="Remove question"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {/* Question Text */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question Text <span className="text-red-500">*</span>
            </label>
            <textarea
              name="question_text"
              placeholder="Enter your progress tracking question..."
              value={item.question_text}
              onChange={(e) => handleChange(index, e)}
              onBlur={() => handleBlur(index, "question_text")}
              rows={3}
              className={`w-full border rounded-lg p-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                getError(index, "question_text")
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {getError(index, "question_text") && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {getError(index, "question_text")}
              </p>
            )}
          </div>

          {/* Option Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Answer Type <span className="text-red-500">*</span>
            </label>
            <select
              name="option_type"
              value={item.option_type}
              onChange={(e) => handleChange(index, e)}
              onBlur={() => handleBlur(index, "option_type")}
              className={`w-full border rounded-lg p-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                getError(index, "option_type")
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="">Select answer type</option>
              {OPTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {getError(index, "option_type") && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {getError(index, "option_type")}
              </p>
            )}
          </div>

          {/* Week No & Day No side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Week No <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="week_no"
                placeholder="e.g. 1"
                min={1}
                max={52}
                value={item.week_no}
                onChange={(e) => handleChange(index, e)}
                onBlur={() => handleBlur(index, "week_no")}
                className={`w-full border rounded-lg p-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  getError(index, "week_no")
                    ? "border-red-400 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {getError(index, "week_no") && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {getError(index, "week_no")}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Day No <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="day_no"
                placeholder="1 - 7"
                min={1}
                max={7}
                value={item.day_no}
                onChange={(e) => handleChange(index, e)}
                onBlur={() => handleBlur(index, "day_no")}
                className={`w-full border rounded-lg p-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  getError(index, "day_no")
                    ? "border-red-400 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {getError(index, "day_no") && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {getError(index, "day_no")}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add Question Button */}
      <button
        onClick={handleAdd}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        <Plus size={18} />
        Add Question
      </button>
    </div>
  );
};

export default ProgressTracking;