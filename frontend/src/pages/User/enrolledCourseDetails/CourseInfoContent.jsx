import { GraduationCap, Target, Users } from "lucide-react";
import React from "react";

const CourseInfoContent = ({ enrolledCourseDetails, textColor, theme }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"
            }`}
          >
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className={`font-bold ${textColor.primary}`}>
            Learning Outcomes
          </h4>
        </div>
        <p
          className={`text-sm ${textColor.secondary}`}
          dangerouslySetInnerHTML={{
            __html: enrolledCourseDetails.learning_outcomes,
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              theme === "dark" ? "bg-green-900/30" : "bg-green-100"
            }`}
          >
            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h4 className={`font-bold ${textColor.primary}`}>
            Target Audience
          </h4>
        </div>
        <p className={`text-sm ${textColor.secondary}`}>
          {enrolledCourseDetails.target_audience}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              theme === "dark" ? "bg-purple-900/30" : "bg-purple-100"
            }`}
          >
            <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className={`font-bold ${textColor.primary}`}>
            Course Overview
          </h4>
        </div>
        <p
          className={`text-sm ${textColor.secondary}`}
          dangerouslySetInnerHTML={{
            __html: enrolledCourseDetails.curriculum_description,
          }}
        />
      </div>
    </div>
  );
};

export default CourseInfoContent;