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
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
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

        {/* Warning Box */}
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">
                Important Warning
              </h3>
              <p className="text-sm text-red-700">
                Unauthorized use, reproduction, or distribution of our
                intellectual property may result in legal action. All content is
                protected under copyright laws.
              </p>
            </div>
          </div>
        </div>

        {/* Acceptance Checkboxes */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 mb-8">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            Your Acknowledgment
          </h2>

          <div className="space-y-5">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedOwnership}
                onChange={(e) => setAcceptedOwnership(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                I acknowledge that all content on BrahmaLYF is the{" "}
                <span className="font-semibold">intellectual property</span> of
                BrahmaLYF and its licensors
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedLicense}
                onChange={(e) => setAcceptedLicense(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                I understand that I am granted a{" "}
                <span className="font-semibold">
                  limited, personal, non-commercial license
                </span>{" "}
                for private use only
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedProhibited}
                onChange={(e) => setAcceptedProhibited(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                I agree not to{" "}
                <span className="font-semibold">
                  copy, share, distribute, or reproduce
                </span>{" "}
                any content without written permission
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            disabled={!isAllAccepted}
            className={`flex-1 rounded-xl px-8 py-3.5 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              isAllAccepted
                ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl active:scale-[0.98]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Check size={20} />I Accept & Agree
          </button>

          <button className="flex-1 rounded-xl border border-slate-300 bg-white px-8 py-3.5 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Decline
          </button>
        </div>

        {/* Contact Card */}
        <div className="mt-10 mb-24 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  Report Copyright Infringement
                </p>
                <p className="text-slate-600 text-sm">
                  To report suspected unauthorized use of our content
                </p>
              </div>
            </div>
            <a
              href="mailto:brahma.lyf@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <Mail size={16} />
              brahma.lyf@gmail.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
