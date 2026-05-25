import React, { useState } from "react";
import {
  ChevronDown,
  Check,
  CreditCard,
  Clock,
  User,
  RefreshCw,
  AlertCircle,
  Shield,
  XCircle,
  DollarSign,
} from "lucide-react";
import subscriptionSections from "./subscriptionSections";

// Rich text renderer with bold, lists, and formatting
const RichTextContent = ({ content }) => {
  const lines = content.split("\n").filter((line) => line.trim());

  const parseInline = (text) => {
    // Parse bold **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <span key={match.index} className="font-semibold text-slate-900">
          {match[1]}
        </span>,
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length ? parts : text;
  };

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Handle bullet points
        if (trimmed.startsWith("•")) {
          const bulletContent = trimmed.substring(1).trim();
          return (
            <div key={idx} className="flex gap-3">
              <span className="text-emerald-600 font-bold flex-shrink-0 mt-0.5">
                •
              </span>
              <p className="text-slate-700 leading-relaxed flex-1">
                {parseInline(bulletContent)}
              </p>
            </div>
          );
        }

        // Handle numbered lists (1., 2., etc.)
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex gap-3">
              <span className="text-emerald-600 font-semibold flex-shrink-0 min-w-[24px]">
                {numberedMatch[1]}.
              </span>
              <p className="text-slate-700 leading-relaxed flex-1">
                {parseInline(numberedMatch[2])}
              </p>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-slate-700 leading-relaxed">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export default function SubscriptionTerms() {
  const [expandedSections, setExpandedSections] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedNoRefund, setAcceptedNoRefund] = useState(false);
  const [acceptedSharing, setAcceptedSharing] = useState(false);

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAllAccepted = acceptedTerms && acceptedNoRefund && acceptedSharing;
  const expandedCount = Object.values(expandedSections).filter(Boolean).length;
  const totalSections = subscriptionSections.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-transparent opacity-50"></div>
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <CreditCard size={28} className="text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Subscription Terms
              </h1>
            </div>
            <p className="text-lg text-slate-600">
              These Subscription Terms govern all subscription-based access and
              paid digital services offered through{" "}
              <span className="font-bold text-emerald-600">BrahmaLYF</span>
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Last updated: {"01/01/2026 "}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Current Plan Card */}
        <div className="mb-8 rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wide">
                  Current Plan
                </p>
                <h2 className="text-3xl font-bold text-slate-900">
                  ₹3000{" "}
                  <span className="text-lg font-normal text-slate-500">
                    / year
                  </span>
                </h2>
              </div>
            </div>
            <div className="bg-emerald-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-emerald-700 font-medium">
                Best Value • Annual Subscription
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-4 pt-4 border-t border-emerald-100">
            This pricing is subject to change in the future at our sole
            discretion. Any revised pricing shall apply to future purchases
            unless otherwise expressly stated.
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4 mb-12">
          {subscriptionSections.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  {section.icon === "plan" && (
                    <CreditCard
                      size={18}
                      className="text-emerald-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "access" && (
                    <Clock
                      size={18}
                      className="text-emerald-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "user" && (
                    <User
                      size={18}
                      className="text-emerald-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "renewal" && (
                    <RefreshCw
                      size={18}
                      className="text-emerald-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "policy" && (
                    <Shield
                      size={18}
                      className="text-emerald-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "warning" && (
                    <AlertCircle
                      size={18}
                      className="text-emerald-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "suspension" && (
                    <XCircle
                      size={18}
                      className="text-emerald-500 flex-shrink-0"
                    />
                  )}
                  {!section.icon && (
                    <AlertCircle
                      size={18}
                      className="text-emerald-500 flex-shrink-0"
                    />
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
