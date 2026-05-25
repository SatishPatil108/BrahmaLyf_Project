import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Check,
  Moon,
  Sun,
  Shield,
  RefreshCw,
  Clock,
  CreditCard,
  AlertCircle,
  XCircle,
} from "lucide-react";
import refundSections from "./refundSections";
import RichTextContent from "@/components/RichTextContent/RichTextContent";
export default function RefundCancellationPolicy() {
  const [expandedSections, setExpandedSections] = useState({});
  const [acceptedRefund, setAcceptedRefund] = useState(false);
  const [acceptedCancellation, setAcceptedCancellation] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAllAccepted = acceptedRefund && acceptedCancellation && acceptedTerms;
  const expandedCount = Object.values(expandedSections).filter(Boolean).length;
  const totalSections = refundSections.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 dark:from-orange-950/30 to-transparent opacity-50"></div>
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                <RefreshCw
                  size={28}
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>
              <h1 className="lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-2xl">
                Refund & Cancellation Policy
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Clear guidelines about refunds, cancellations, and your consumer
              rights
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Last updated: {"01/01/2026 "}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction Card */}
        <div className="mb-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm sm:p-8 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Shield
                size={22}
                className="text-orange-600 dark:text-orange-400"
              />
            </div>
            <div>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                Our Refund Commitment
              </h2>
              <p className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                At{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  BrahmaLYF
                </span>
                , we strive to ensure your complete satisfaction with our
                services. This Refund & Cancellation Policy outlines the terms
                under which you may cancel your subscription or request a refund
                for our services.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Please read this policy carefully before making any purchase. By
                subscribing to or purchasing any of our services, you agree to
                be bound by this Refund & Cancellation Policy.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4 mb-12">
          {refundSections.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 shadow-sm transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  {section.icon === "refund" && (
                    <RefreshCw
                      size={18}
                      className="text-orange-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "cancellation" && (
                    <XCircle
                      size={18}
                      className="text-orange-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "payment" && (
                    <CreditCard
                      size={18}
                      className="text-orange-500 flex-shrink-0"
                    />
                  )}
                  {section.icon === "time" && (
                    <Clock
                      size={18}
                      className="text-orange-500 flex-shrink-0"
                    />
                  )}
                  {!section.icon && (
                    <AlertCircle
                      size={18}
                      className="text-orange-500 flex-shrink-0"
                    />
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
      </main>
    </div>
  );
}
