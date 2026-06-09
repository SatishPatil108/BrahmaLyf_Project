import { GraduationCap, Target, Users } from "lucide-react";
import React from "react";

const InfoCard = ({
  icon: Icon,
  iconBgClass,
  iconColorClass,
  title,
  content,
  textColor,
}) => (
  <div className="space-y-3 p-4 border border-slate-300 rounded-lg dark:border-slate-700 transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-600">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${iconBgClass}`}>
        <Icon className={`w-5 h-5 ${iconColorClass}`} />
      </div>
      <h4 className={`font-bold ${textColor.primary}`}>{title}</h4>
    </div>

    {typeof content === "string" && content.includes("<") ? (
      <p
        className={`text-sm ${textColor.secondary}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    ) : (
      <p className={`text-sm ${textColor.secondary}`}>{content}</p>
    )}
  </div>
);

const courseInfoItems = (details, theme) => [
  {
    id: "outcomes",
    icon: Target,
    title: "Learning Outcomes",
    content: details.learning_outcomes,
    iconBgClass: theme === "dark" ? "bg-blue-900/30" : "bg-blue-100",
    iconColorClass: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "audience",
    icon: Users,
    title: "Target Audience",
    content: details.target_audience,
    iconBgClass: theme === "dark" ? "bg-green-900/30" : "bg-green-100",
    iconColorClass: "text-green-600 dark:text-green-400",
  },
  {
    id: "overview",
    icon: GraduationCap,
    title: "Course Overview",
    content: details.curriculum_description,
    iconBgClass: theme === "dark" ? "bg-purple-900/30" : "bg-purple-100",
    iconColorClass: "text-purple-600 dark:text-purple-400",
  },
];

const CourseInfoContent = ({ enrolledCourseDetails, textColor, theme }) => {
  const items = courseInfoItems(enrolledCourseDetails, theme);

  return (
    <div className="grid md:grid-rows-3 gap-6">
      {items.map((item) => (
        <InfoCard
          key={item.id}
          icon={item.icon}
          iconBgClass={item.iconBgClass}
          iconColorClass={item.iconColorClass}
          title={item.title}
          content={item.content}
          textColor={textColor}
        />
      ))}
    </div>
  );
};

export default CourseInfoContent;