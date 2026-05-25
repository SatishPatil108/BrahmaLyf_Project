import React, { useState } from "react";
import {
  ChevronDown,
  Check,
  Copyright,
  Shield,
  FileText,
  Ban,
  AlertCircle,
  Flag,
  Mail,
  Lock,
  Users,
} from "lucide-react";
import RichTextContent from "@/components/RichTextContent/RichTextContent";
import copyrightSections from "./copyrightSections";

export default function CopyrightNotice() {
  const [expandedSections, setExpandedSections] = useState({});
  const [acceptedOwnership, setAcceptedOwnership] = useState(false);
  const [acceptedLicense, setAcceptedLicense] = useState(false);
  const [acceptedProhibited, setAcceptedProhibited] = useState(false);

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAllAccepted =
    acceptedOwnership && acceptedLicense && acceptedProhibited;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-50"></div>
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Copyright size={28} className="text-purple-600" />
              </div>
              <h1 className="lg:text-3xl font-bold tracking-tight text-slate-900 text-2xl">
                Copyright & IP Notice
              </h1>
            </div>
            <p className="text-lg text-slate-600">
              Understanding your rights and obligations regarding our
              intellectual property
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText size={22} className="text-purple-600" />
            </div>
            <div>
              <p className="text-slate-700 leading-relaxed mb-3">
                All content and materials available on BrahmaLYF, including but
                not limited to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>videos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>audio recordings</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>scripts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>written content</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>exercises</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>worksheets</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>graphics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>logos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>designs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>layouts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>names & taglines</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>program structures</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>proprietary methods</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed mt-4 pt-3 border-t border-slate-100">
                are the intellectual property of BrahmaLYF and/or its
                owner/licensors, unless otherwise stated.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4 mb-12">
          {copyrightSections.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  {section.icon === "ownership" && (
                    <Shield
                      size={18}
                      className="text-purple-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "license" && (
                    <Lock size={18} className="text-purple-500 flex-shrink-0" />
                  )}
                  {section.icon === "prohibited" && (
                    <Ban size={18} className="text-purple-500 flex-shrink-0" />
                  )}
                  {section.icon === "brand" && (
                    <Users
                      size={18}
                      className="text-purple-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "consequences" && (
                    <AlertCircle
                      size={18}
                      className="text-purple-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "reporting" && (
                    <Flag size={18} className="text-purple-500 flex-shrink-0" />
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
