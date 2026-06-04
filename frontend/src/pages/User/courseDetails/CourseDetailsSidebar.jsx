import React from "react";

const CourseDetailsSidebar = ({ coach, course, formatDate, styles }) => (
  <div
    className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-6 sticky top-24 transition-all duration-300 ${styles.cardHover}`}
  >
    <h3 className={`text-lg font-bold ${styles.textPrimary} mb-4`}>
      Course Details
    </h3>

    <dl className="space-y-3">
      {[
        { label: "Domain", value: coach?.domain_name },
        { label: "Subdomain", value: coach?.subdomain_name },
        { label: "Duration", value: course?.duration },
        { label: "Last Updated", value: formatDate(course?.created_on) },
      ].map(({ label, value }) => (
        <div
          key={label}
          className={`flex justify-between items-center py-3 border-b last:border-b-0 ${styles.divider}`}
        >
          <dt className={styles.textSecondary}>{label}</dt>
          <dd className={`font-medium ${styles.textPrimary}`}>
            {value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

export default CourseDetailsSidebar;
