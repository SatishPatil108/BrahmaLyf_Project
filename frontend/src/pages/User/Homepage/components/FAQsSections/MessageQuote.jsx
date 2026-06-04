import { useTheme } from "@/contexts/ThemeContext";
import React, { createContext, useContext, useState } from "react";

const themes = {
  light: {
    bgGradient: "bg-[#f5f3f0]",
    cardBg: "bg-white",
    topBarGradient: "from-indigo-500 via-purple-500 to-pink-500",
    iconBg: "from-indigo-100 to-purple-100",
    iconColor: "text-indigo-600",
    titleGradient: "from-indigo-600 to-purple-600",
    textPrimary: "text-gray-700",
    textSecondary: "text-gray-800",
    bulletColor: "text-indigo-500",
    noteBg: "bg-amber-50",
    noteBorder: "border-amber-400",
    noteText: "text-gray-800",
    footerText: "text-gray-400",
    shadow: "shadow-2xl",
    hoverShadow: "hover:shadow-3xl",
  },
  dark: {
    bgGradient: "bg-[#0e0d0c]",
    cardBg: "bg-gray-800",
    topBarGradient: "from-blue-500 via-purple-500 to-pink-500",
    iconBg: "from-gray-700 to-gray-600",
    iconColor: "text-blue-400",
    titleGradient: "from-blue-400 to-purple-400",
    textPrimary: "text-gray-300",
    textSecondary: "text-gray-200",
    bulletColor: "text-purple-400",
    noteBg: "bg-yellow-900/30",
    noteBorder: "border-yellow-600",
    noteText: "text-gray-200",
    footerText: "text-gray-500",
    shadow: "shadow-2xl shadow-gray-900/50",
    hoverShadow: "hover:shadow-3xl",
  },
  nature: {
    bgGradient: "from-green-50 via-emerald-50 to-teal-50",
    cardBg: "bg-white",
    topBarGradient: "from-green-600 via-emerald-600 to-teal-600",
    iconBg: "from-green-100 to-emerald-100",
    iconColor: "text-green-600",
    titleGradient: "from-green-600 to-emerald-600",
    textPrimary: "text-gray-700",
    textSecondary: "text-gray-800",
    bulletColor: "text-emerald-500",
    noteBg: "bg-orange-50",
    noteBorder: "border-orange-400",
    noteText: "text-gray-800",
    footerText: "text-gray-400",
    shadow: "shadow-2xl",
    hoverShadow: "hover:shadow-3xl",
  },
  ocean: {
    bgGradient: "from-cyan-50 via-blue-50 to-indigo-50",
    cardBg: "bg-white",
    topBarGradient: "from-cyan-600 via-blue-600 to-indigo-600",
    iconBg: "from-cyan-100 to-blue-100",
    iconColor: "text-cyan-600",
    titleGradient: "from-cyan-600 to-blue-600",
    textPrimary: "text-gray-700",
    textSecondary: "text-gray-800",
    bulletColor: "text-blue-500",
    noteBg: "bg-amber-50",
    noteBorder: "border-amber-400",
    noteText: "text-gray-800",
    footerText: "text-gray-400",
    shadow: "shadow-2xl",
    hoverShadow: "hover:shadow-3xl",
  },
  sunset: {
    bgGradient: "from-orange-50 via-red-50 to-pink-50",
    cardBg: "bg-white",
    topBarGradient: "from-orange-500 via-red-500 to-pink-500",
    iconBg: "from-orange-100 to-red-100",
    iconColor: "text-orange-600",
    titleGradient: "from-orange-600 to-red-600",
    textPrimary: "text-gray-700",
    textSecondary: "text-gray-800",
    bulletColor: "text-red-500",
    noteBg: "bg-yellow-50",
    noteBorder: "border-yellow-400",
    noteText: "text-gray-800",
    footerText: "text-gray-400",
    shadow: "shadow-2xl",
    hoverShadow: "hover:shadow-3xl",
  },
};

// Main Component
const EmpowermentCard = () => {
  const { theme } = useTheme();
  const t = themes[theme] ?? themes.light;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${t.bgGradient} flex items-center justify-center p-4 transition-all duration-500`}
    >
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div
          className={`relative ${t.cardBg} rounded-3xl ${t.shadow} overflow-hidden transform transition-all duration-300 hover:scale-105 ${t.hoverShadow}`}
        >
          {/* Decorative Top Bar */}
          <div
            className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${t.topBarGradient}`}
          ></div>

          {/* Content */}
          <div className="p-8 md:p-10">
            {/* Header Icon */}
            <div className="flex justify-center mb-6">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${t.iconBg} rounded-2xl flex items-center justify-center transform rotate-6 shadow-md`}
              >
                <svg
                  className={`w-8 h-8 ${t.iconColor}`}
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
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2
                  className={`text-2xl md:text-3xl font-bold text-center bg-gradient-to-r ${t.titleGradient} bg-clip-text text-transparent`}
                >
                  तुमच्या आत्म-विकासाचा प्रवास
                </h2>

                <div className={`space-y-3 ${t.textPrimary} leading-relaxed`}>
                  <p className="text-center">
                    हा program पूर्ण केल्यानंतर तुम्हाला
                  </p>

                  <ul className="space-y-2 ml-4">
                    {[
                      "स्वतःचं मन जास्त चांगलं समजायला लागेल",
                      "stress, overthinking, anxiety हाताळण्यासाठी रोजच्या आयुष्यात वापरता येतील अशी practical tools मिळतील",
                      "emotions आणि relationships मध्ये शांतपणे respond करता येईल",
                      "self-worth आणि confidence वाढेल",
                      "sleep focus, phone habits सुधारतील",
                      "आयुष्याच्या pressure मध्येही स्वतःला पुन्हा balance मध्ये आणण्याची सवय तयार होईल",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className={`${t.bulletColor} mt-1`}>✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Important Note Box */}
              <div
                className={`mt-8 p-5 ${t.noteBg} border-l-4 ${t.noteBorder} rounded-r-xl transition-all duration-300`}
              >
                <div className="flex gap-3">
                  <span className="text-2xl">💫</span>
                  <div>
                    <p className={`${t.textSecondary} font-medium`}>
                      “Problem नाहीशा होतील” असं नाही;
                    </p>
                    <p className={`${t.textPrimary} mt-2`}>
                      पण problem आली तरी मन शांत ठेवून, योग्य विचार करून,
                      स्वतःला सावरून पुढे जाण्याची ताकद आपल्यामध्ये तयार होईल.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Footer Text */}
        <p
          className={`text-center ${t.footerText} text-sm mt-6 transition-all duration-300`}
        >
          🌱 तुमच्या आत्म-विकासाच्या प्रवासासाठी शुभेच्छा
        </p>
      </div>
    </div>
  );
};

export default EmpowermentCard;
