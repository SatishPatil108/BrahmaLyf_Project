import { useTheme } from "@/contexts/ThemeContext";
import React from "react";

const themes = {
  light: {
    bg: "bg-gradient-to-br from-[#f5f3f0] to-[#ede8e2]",
    cardBg: "bg-white",
    border: "border-gray-100",
    topBar: "from-indigo-500 via-purple-500 to-pink-500",
    iconBg: "from-indigo-100 to-purple-100",
    iconColor: "text-indigo-600",
    title: "from-indigo-600 to-purple-600",
    textPrimary: "text-gray-700",
    textSecondary: "text-gray-800",
    bullet: "text-indigo-500",
    noteBg: "bg-amber-50",
    noteBorder: "border-amber-400",
    noteText: "text-gray-800",
    footer: "text-gray-400",
    shadow: "shadow-xl",
    hoverEffect: "hover:shadow-2xl hover:-translate-y-1",
  },
  dark: {
    bg: "bg-gradient-to-br from-[#0e0d0c] to-[#1a1816]",
    cardBg: "bg-gray-800",
    border: "border-gray-700",
    topBar: "from-blue-500 via-purple-500 to-pink-500",
    iconBg: "from-gray-700 to-gray-600",
    iconColor: "text-blue-400",
    title: "from-blue-400 to-purple-400",
    textPrimary: "text-gray-300",
    textSecondary: "text-gray-200",
    bullet: "text-purple-400",
    noteBg: "bg-yellow-900/30",
    noteBorder: "border-yellow-600",
    noteText: "text-gray-200",
    footer: "text-gray-600",
    shadow: "shadow-xl shadow-black/30",
    hoverEffect: "hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1",
  },
  nature: {
    bg: "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50",
    cardBg: "bg-white",
    border: "border-gray-100",
    topBar: "from-green-600 via-emerald-600 to-teal-600",
    iconBg: "from-green-100 to-emerald-100",
    iconColor: "text-green-600",
    title: "from-green-600 to-emerald-600",
    textPrimary: "text-gray-700",
    textSecondary: "text-gray-800",
    bullet: "text-emerald-500",
    noteBg: "bg-orange-50",
    noteBorder: "border-orange-400",
    noteText: "text-gray-800",
    footer: "text-gray-400",
    shadow: "shadow-xl",
    hoverEffect: "hover:shadow-2xl hover:-translate-y-1",
  },
  ocean: {
    bg: "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50",
    cardBg: "bg-white",
    border: "border-gray-100",
    topBar: "from-cyan-600 via-blue-600 to-indigo-600",
    iconBg: "from-cyan-100 to-blue-100",
    iconColor: "text-cyan-600",
    title: "from-cyan-600 to-blue-600",
    textPrimary: "text-gray-700",
    textSecondary: "text-gray-800",
    bullet: "text-blue-500",
    noteBg: "bg-amber-50",
    noteBorder: "border-amber-400",
    noteText: "text-gray-800",
    footer: "text-gray-400",
    shadow: "shadow-xl",
    hoverEffect: "hover:shadow-2xl hover:-translate-y-1",
  },
  sunset: {
    bg: "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50",
    cardBg: "bg-white",
    border: "border-gray-100",
    topBar: "from-orange-500 via-red-500 to-pink-500",
    iconBg: "from-orange-100 to-red-100",
    iconColor: "text-orange-600",
    title: "from-orange-600 to-red-600",
    textPrimary: "text-gray-700",
    textSecondary: "text-gray-800",
    bullet: "text-red-500",
    noteBg: "bg-yellow-50",
    noteBorder: "border-yellow-400",
    noteText: "text-gray-800",
    footer: "text-gray-400",
    shadow: "shadow-xl",
    hoverEffect: "hover:shadow-2xl hover:-translate-y-1",
  },
};

const benefits = [
  "स्वतःचं मन जास्त चांगलं समजायला लागेल",
  "stress, overthinking, anxiety हाताळण्यासाठी रोजच्या आयुष्यात वापरता येतील अशी practical tools मिळतील",
  "emotions आणि relationships मध्ये शांतपणे respond करता येईल",
  "self-worth आणि confidence वाढेल",
  "sleep focus, phone habits सुधारतील",
  "आयुष्याच्या pressure मध्येही स्वतःला पुन्हा balance मध्ये आणण्याची सवय तयार होईल",
];

const Icon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const BenefitItem = ({ text, bulletColor }) => (
  <li className="flex items-start gap-3 group">
    <span
      className={`${bulletColor} mt-0.5 transition-transform duration-200 group-hover:scale-110`}
    >
      ✦
    </span>
    <span className="leading-relaxed">{text}</span>
  </li>
);

const NoteBox = ({ theme }) => (
  <div
    className={`mt-8 p-5 ${theme.noteBg} border-l-4 ${theme.noteBorder} rounded-r-xl transition-all duration-300`}
  >
    <div className="flex gap-3">
      <span className="text-2xl">💫</span>
      <div>
        <p className={`${theme.textSecondary} font-medium`}>
          “Problem नाहीशा होतील” असं नाही;
        </p>
        <p className={`${theme.textPrimary} mt-2 leading-relaxed`}>
          पण problem आली तरी मन शांत ठेवून, योग्य विचार करून, स्वतःला सावरून
          पुढे जाण्याची ताकद आपल्यामध्ये तयार होईल.
        </p>
      </div>
    </div>
  </div>
);

const EmpowermentCard = () => {
  const { theme } = useTheme();
  const t = themes[theme] ?? themes.light;

  return (
    <div
      className={`min-h-screen ${t.bg} flex items-center justify-center p-4 transition-all duration-500`}
    >
      <div className="max-w-2xl w-full">
        {/* Card */}
        <div
          className={`relative ${t.cardBg} rounded-2xl ${t.shadow} overflow-hidden transition-all duration-300 ${t.hoverEffect}`}
        >
          {/* Top Bar */}
          <div className={`h-1.5 bg-gradient-to-r ${t.topBar}`} />

          <div className="p-8 md:p-10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${t.iconBg} rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 hover:rotate-3`}
              >
                <Icon className={`w-8 h-8 ${t.iconColor}`} />
              </div>
            </div>

            {/* Title */}
            <h2
              className={`text-2xl md:text-3xl font-bold text-center bg-gradient-to-r ${t.title} bg-clip-text text-transparent mb-6`}
            >
              तुमच्या आत्म-विकासाचा प्रवास
            </h2>

            {/* Description */}
            <p className={`text-center ${t.textPrimary} mb-6`}>
              हा program पूर्ण केल्यानंतर तुम्हाला
            </p>

            {/* Benefits List */}
            <ul className={`space-y-3 ${t.textPrimary}`}>
              {benefits.map((benefit, index) => (
                <BenefitItem
                  key={index}
                  text={benefit}
                  bulletColor={t.bullet}
                />
              ))}
            </ul>

            {/* Note Box */}
            <NoteBox theme={t} />
          </div>
        </div>

        {/* Footer */}
        <p
          className={`text-center ${t.footer} text-sm mt-6 transition-all duration-300`}
        >
          🌱 तुमच्या आत्म-विकासाच्या प्रवासासाठी शुभेच्छा
        </p>
      </div>
    </div>
  );
};

export default EmpowermentCard;
