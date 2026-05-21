import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Check,
  Moon,
  Sun,
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
} from "lucide-react";
import privacySections from "./privacySections";
import RichTextContent from "@/components/RichTextContent/RichTextContent";

export default function PrivacyPolicy() {
  const [expandedSections, setExpandedSections] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState(false);
  const [acceptedDataTransfer, setAcceptedDataTransfer] = useState(false);

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAllAccepted =
    acceptedPrivacy && acceptedCookies && acceptedDataTransfer;
  const expandedCount = Object.values(expandedSections).filter(Boolean).length;
  const totalSections = privacySections.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-transparent opacity-50"></div>
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                <Shield
                  size={28}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Privacy Policy
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Your privacy is important to us. Learn how we collect, use, and
              protect your data.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Last updated:{" "} {"01/01/2026 "}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction Card */}
        <div className="mb-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm sm:p-8 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Lock size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                Our Commitment to Your Privacy
              </h2>
              <p className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                At{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  BrahmaLYF
                </span>
                , we are committed to protecting your personal information and
                your right to privacy. This Privacy Policy explains how
                BrahmaLYF, operated by{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  Markets and Clients
                </span>
                (“we”, “our”, “us”), collects, uses, stores, and protects your
                information when you use{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  brahmalyf.com.
                </span>{" "}
                By using the Platform, you agree to this Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4 mb-12">
          {privacySections.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 shadow-sm transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  {section.icon === "data" && (
                    <Database
                      size={18}
                      className="text-blue-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "cookies" && (
                    <Globe size={18} className="text-blue-500 flex-shrink-0" />
                  )}
                  {section.icon === "security" && (
                    <Shield size={18} className="text-blue-500 flex-shrink-0" />
                  )}
                  {!section.icon && (
                    <Eye size={18} className="text-blue-500 flex-shrink-0" />
                  )}
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {section.title}
                  </h3>
                </div>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
                    expandedSections[section.id] ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections[section.id] && (
                <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 px-6 py-4 sm:px-8 sm:py-6">
                  <RichTextContent content={section.content} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Acceptance Checkboxes */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 p-6 shadow-sm sm:p-8 mb-8">
          <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
            Your Privacy Choices
          </h2>

          <div className="space-y-5">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                I have read and agree to the{" "}
                <span className="font-semibold">Privacy Policy</span> outlined
                above
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedCookies}
                onChange={(e) => setAcceptedCookies(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                I understand and accept the use of{" "}
                <span className="font-semibold">
                  cookies and tracking technologies
                </span>{" "}
                as described
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedDataTransfer}
                onChange={(e) => setAcceptedDataTransfer(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                I acknowledge that my data may be transferred and processed in
                accordance with this policy
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
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-[0.98]"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
            }`}
          >
            <Check size={20} />
            Accept Privacy Policy
          </button>

          <button className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-8 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Decline
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-10 mb-25 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-6 text-center">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            By accepting this Privacy Policy, you consent to our collection,
            use, and disclosure of your personal information as described.
          </p>
        </div>
      </main>
    </div>
  );
}
