import React, { useState } from "react";
import {
  ChevronDown,
  Shield,
  AlertCircle,
  Stethoscope,
  BookOpen,
  UserCheck,
  TrendingUp,
  HeartHandshake,
  Users,
  Ban,
} from "lucide-react";
import coachingSections from "./coachingSections";
import RichTextContent from "@/components/RichTextContent/RichTextContent";
import { useTheme } from "@/contexts/ThemeContext";

export default function CoachingDisclaimer() {
  const [expandedSections, setExpandedSections] = useState({});

  const { theme } = useTheme();

  const themeColors = {
    dark: {
      pageBg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      headerBg: "bg-gray-900 border-gray-700",
      headerOverlay: "from-amber-900/20 to-transparent opacity-50",
      headingText: "text-gray-100",
      bodyText: "text-gray-300",
      mutedText: "text-gray-500",
      // Intro card
      cardBg: "bg-gray-800/50 border-gray-700",
      cardIconBg: "bg-amber-900/30",
      cardIconColor: "text-amber-400",
      cardBody: "text-gray-300",
      // Accordion
      accordionBg: "bg-gray-800/40 border-gray-700",
      accordionBtnHover: "hover:bg-gray-700/50",
      accordionTitle: "text-gray-100",
      accordionIcon: "text-amber-400",
      accordionChevron: "text-gray-500",
      accordionChevronActive: "text-amber-400",
      accordionContentBg: "bg-gray-900/40",
      accordionDivider: "border-gray-700",
      richText:
        "text-white [&_strong]:text-purple-500 [&_li]:text-white [&_li]:marker:text-amber-500 [&_strong]:!text-amber-500 [&_p]:text-white [&_span]:text-white [&_li]:text-white [&_strong]:!text-amber-500 [&_b]:!text-amber-500",
    },
    light: {
      pageBg: "bg-gradient-to-br from-slate-50 via-white to-slate-50",
      headerBg: "bg-white border-slate-200 shadow-sm",
      headerOverlay: "from-amber-50 to-transparent opacity-50",
      headingText: "text-slate-900",
      bodyText: "text-slate-600",
      mutedText: "text-slate-500",
      // Intro card
      cardBg: "bg-white border-slate-200",
      cardIconBg: "bg-amber-100",
      cardIconColor: "text-amber-600",
      cardBody: "text-slate-700",
      // Accordion
      accordionBg: "bg-white border-slate-200",
      accordionBtnHover: "hover:bg-slate-50",
      accordionTitle: "text-slate-900",
      accordionIcon: "text-amber-500",
      accordionChevron: "text-slate-500",
      accordionChevronActive: "text-amber-600",
      accordionContentBg: "bg-slate-50",
      accordionDivider: "border-slate-200",
      richText:
        "[&_strong]:text-amber-600 [&_a]:text-amber-600 [&_a:hover]:text-amber-800",
    },
  };

  const c = themeColors[theme] || themeColors.light;

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const iconMap = {
    coaching: Users,
    medical: Stethoscope,
    education: BookOpen,
    responsibility: UserCheck,
    outcome: TrendingUp,
    help: HeartHandshake,
    testimonial: Users,
    age: Ban,
  };

  return (
    <div className={`min-h-screen ${c.pageBg}`}>
      {/* Header */}
      <div className={`relative overflow-hidden border-b ${c.headerBg}`}>
        <div
          className={`absolute inset-0 bg-gradient-to-r ${c.headerOverlay}`}
        ></div>
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 ${c.cardIconBg} rounded-xl`}>
                <Shield size={28} className={c.cardIconColor} />
              </div>
              <h1
                className={`text-2xl lg:text-4xl font-bold tracking-tight ${c.headingText}`}
              >
                Coaching Disclaimer
              </h1>
            </div>
            <p className={`text-lg ${c.bodyText}`}>
              Important information about our coaching services and limitations
            </p>
            <p className={`text-sm ${c.mutedText} mt-2`}>
              Last updated: {"01/01/2026 "}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction Card */}
        <div
          className={`mb-10 rounded-xl border ${c.cardBg} p-6 shadow-sm sm:p-8`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 ${c.cardIconBg} rounded-lg`}>
              <BookOpen size={22} className={c.cardIconColor} />
            </div>
            <div>
              <p className={`${c.cardBody} leading-relaxed`}>
                The content, services, tools, videos, audios, sessions, and
                materials available on BrahmaLYF are intended for educational,
                self-development, awareness, and coaching/guidance purposes
                only.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4 mb-12">
          {coachingSections.map((section) => {
            const IconComponent = iconMap[section.icon] || AlertCircle;
            return (
              <div
                key={section.id}
                className={`overflow-hidden rounded-xl border ${c.accordionBg} shadow-sm transition-all hover:shadow-md`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between text-left ${c.accordionBtnHover} transition-colors`}
                >
                  <div className="flex items-center gap-3 pr-4">
                    <IconComponent
                      size={18}
                      className={`${c.accordionIcon} flex-shrink-0`}
                    />
                    <h3 className={`text-lg font-semibold ${c.accordionTitle}`}>
                      {section.title}
                    </h3>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 transition-transform duration-300 ${
                      expandedSections[section.id]
                        ? `rotate-180 ${c.accordionChevronActive}`
                        : c.accordionChevron
                    }`}
                  />
                </button>

                {expandedSections[section.id] && (
                  <div
                    className={`border-t ${c.accordionDivider} ${c.accordionContentBg} px-6 py-4 sm:px-8 sm:py-6`}
                  >
                    <RichTextContent
                      content={section.content}
                      className={c.richText}
                      bulletClassName="text-amber-500"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className={`text-center text-sm ${c.mutedText} mb-6`}>
        <p>
          BrahmaLYF / Brahma Life School is a brand owned and operated by
          Markets and Clients.
        </p>
      </div>
      </main>
    </div>
  );
}
