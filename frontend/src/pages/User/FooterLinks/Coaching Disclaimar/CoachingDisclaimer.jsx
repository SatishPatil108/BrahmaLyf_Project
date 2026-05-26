import React, { useState } from "react";
import {
  ChevronDown,
  Check,
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
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [acceptedResponsibility, setAcceptedResponsibility] = useState(false);
  const [acceptedAgeRestriction, setAcceptedAgeRestriction] = useState(false);

  const { theme } = useTheme();

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAllAccepted =
    acceptedDisclaimer && acceptedResponsibility && acceptedAgeRestriction;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-transparent opacity-50"></div>
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Shield size={28} className="text-amber-600" />
              </div>
              <h1 className="lg:text-4xl font-bold tracking-tight text-slate-900 text-2xl">
                Coaching Disclaimer
              </h1>
            </div>
            <p className="text-lg text-slate-600">
              Important information about our coaching services and limitations
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Last updated: {"01/01/2026 "}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction Card */}
        <div className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <BookOpen size={22} className="text-amber-600" />
            </div>
            <div>
              <p className="text-slate-700 leading-relaxed">
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
          {coachingSections.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  {section.icon === "coaching" && (
                    <Users size={18} className="text-amber-500 flex-shrink-0" />
                  )}
                  {section.icon === "medical" && (
                    <Stethoscope
                      size={18}
                      className="text-amber-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "education" && (
                    <BookOpen
                      size={18}
                      className="text-amber-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "responsibility" && (
                    <UserCheck
                      size={18}
                      className="text-amber-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "outcome" && (
                    <TrendingUp
                      size={18}
                      className="text-amber-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "help" && (
                    <HeartHandshake
                      size={18}
                      className="text-amber-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "testimonial" && (
                    <Users size={18} className="text-amber-500 flex-shrink-0" />
                  )}
                  {section.icon === "age" && (
                    <Ban size={18} className="text-amber-500 flex-shrink-0" />
                  )}
                  <h3 className="text-lg font-semibold text-slate-900">
                    {section.title}
                  </h3>
                </div>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-slate-500 transition-transform duration-300 ${
                    expandedSections[section.id] ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections[section.id] && (
                <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8 sm:py-6">
                  <RichTextContent content={section.content} />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
