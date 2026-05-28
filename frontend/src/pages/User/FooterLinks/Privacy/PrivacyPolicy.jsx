import React, { useState } from "react";
import { ChevronDown, Shield, Lock, Eye, Database, Globe } from "lucide-react";
import privacySections from "./privacySections";
import RichTextContent from "@/components/RichTextContent/RichTextContent";
import { useTheme } from "@/contexts/ThemeContext";

export default function PrivacyPolicy() {
  const [expandedSections, setExpandedSections] = useState({});

  const { theme } = useTheme();

  const themeColors = {
    dark: {
      pageBg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      headerBg: "bg-gray-900/80 border-gray-700 backdrop-blur-sm",
      headerOverlay: "from-blue-900/20 to-transparent opacity-50",
      headingText: "text-gray-100",
      bodyText: "text-gray-300",
      mutedText: "text-gray-500",

      // Intro card
      cardBg: "bg-gray-800/50 border-gray-700 backdrop-blur-sm",
      cardIconBg: "bg-blue-900/30",
      cardIconColor: "text-blue-400",
      cardHeading: "text-gray-100",
      cardBody: "text-gray-300",
      cardBrand: "font-semibold text-blue-500",
      // Accordion
      accordionBg: "bg-gray-800/30 border-gray-700",
      accordionBtnHover: "hover:bg-gray-700/50",
      accordionTitle: "text-gray-100",
      accordionIcon: "text-blue-400",
      accordionChevron: "text-gray-500",
      accordionChevronActive: "text-blue-400",
      accordionContentBg: "bg-gray-900/30",
      accordionDivider: "border-gray-700",
      richText:
        "text-white [&_strong]:text-blue-500  [&_p]:text-white [&_span]:text-white [&_strong]:text-slate-900 [&_a]:text-blue-600 [&_a:hover]:text-blue-800 [&_strong]:!text-blue-500 [&_b]:!text-purple-500",
    },
    light: {
      pageBg: "bg-gradient-to-br from-slate-50 via-white to-slate-50",
      headerBg: "bg-white/80 border-slate-200 backdrop-blur-sm shadow-sm",
      headerOverlay: "from-blue-50 to-transparent opacity-50",
      headingText: "text-slate-900",
      bodyText: "text-slate-600",
      mutedText: "text-slate-500",

      // Intro card
      cardBg: "bg-white border-slate-200",
      cardIconBg: "bg-blue-100",
      cardIconColor: "text-blue-600",
      cardHeading: "text-slate-900",
      cardBody: "text-slate-700",
      cardBrand: "text-slate-900 font-semibold ",
      // Accordion
      accordionBg: "bg-white border-slate-200",
      accordionBtnHover: "hover:bg-slate-50",
      accordionTitle: "text-blue-900",
      accordionIcon: "text-blue-500",
      accordionChevron: "text-slate-500",
      accordionChevronActive: "text-blue-600",
      accordionContentBg: "bg-slate-50",
      accordionDivider: "border-slate-200",
      richText:
        "[&_strong]:text-slate-900 [&_a]:text-blue-600 [&_a:hover]:text-blue-800 [&_strong]:!text-blue-500 [&_b]:!text-purple-500",
    },
  };

  const c = themeColors[theme] || themeColors.light;

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const iconMap = {
    data: Database,
    cookies: Globe,
    security: Shield,
  };

  return (
    <div className={`min-h-screen ${c.pageBg} transition-colors duration-300`}>
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
                className={`text-3xl font-bold tracking-tight ${c.headingText} sm:text-4xl`}
              >
                Privacy Policy
              </h1>
            </div>
            <p className={`text-lg ${c.bodyText}`}>
              Your privacy is important to us. Learn how we collect, use, and
              protect your data.
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
          className={`mb-12 rounded-xl border ${c.cardBg} p-6 shadow-sm sm:p-8`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 ${c.cardIconBg} rounded-lg`}>
              <Lock size={22} className={c.cardIconColor} />
            </div>
            <div>
              <h2 className={`mb-3 text-xl font-semibold ${c.cardHeading}`}>
                Our Commitment to Your Privacy
              </h2>
              <p className={`mb-3 ${c.cardBody} leading-relaxed`}>
                At <span className={c.cardBrand}>BrahmaLYF</span>, we are
                committed to protecting your personal information and your right
                to privacy. This Privacy Policy explains how BrahmaLYF, operated
                by <span className={c.cardBrand}>Markets and Clients</span>{" "}
                ("we", "our", "us"), collects, uses, stores, and protects your
                information when you use{" "}
                <span className={c.cardBrand}>brahmalyf.com.</span> By using the
                Platform, you agree to this Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4 mb-12">
          {privacySections.map((section) => {
            const IconComponent = iconMap[section.icon] || Eye;
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
                    className={` flex-shrink-0 transition-transform duration-300 ${
                      expandedSections[section.id]
                        ? `rotate-180 ${c.accordionChevronActive}`
                        : c.accordionChevron
                    }`}
                  />
                </button>

                {expandedSections[section.id] && (
                  <div
                    className={`border-t ${c.accordionDivider}  ${c.accordionContentBg} px-6 py-4 sm:px-8 sm:py-6`}
                  >
                    <RichTextContent content={section.content} 
                      className={c.richText}
                      bulletClassName="text-blue-400"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
