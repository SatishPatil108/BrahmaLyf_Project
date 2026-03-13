import CustomDrawer from "@/components/CustomDrawer";
import { BadgeQuestionMarkIcon, Eye } from "lucide-react";

const ViewQuestionDrawer = ({ isOpen, onClose, question }) => {
  if (!question) return null;

  const OPTION_TYPE_ICONS = {
    1: "📝",
    2: "🔘",
    3: "📋",
    4: "✅",
    5: "⭐",
    6: "📊",
  };

  const OPTION_TYPE_LABELS = {
    1: "Text",
    2: "Radio Buttons",
    3: "Dropdown",
    4: "Multiple Select",
    5: "Rating",
    6: "Progress Bar",
  };
  
  const OPTION_TYPES_WITH_OPTIONS = [2, 3, 4];

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
        {/* Question Content */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <BadgeQuestionMarkIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {question.question_text}
              </h4>
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

        {/* Answer Type Details */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
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
                  {question.options?.map((opt, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-medium flex items-center justify-center">
                        {optIndex + 1}
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

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Expected Response
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                This question expects a{" "}
                {OPTION_TYPE_LABELS[question.option_type]?.toLowerCase()}{" "}
                response from the user.
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
            Question Metadata
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
            {question.course_id && (
              <div className="col-span-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Associated Course ID
                </p>
                <p className="text-gray-900 dark:text-gray-100 font-mono">
                  {question.course_id}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

export default ViewQuestionDrawer;
