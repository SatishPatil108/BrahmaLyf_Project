import React, { useState } from "react";
import {
  ChevronDown,
  Check,
  Shield,
  FileText,
  Eye,
  AlertCircle,
  BookOpen,
  Users,
  Lock,
  CreditCard,
  RefreshCw,
  Ban,
  Globe,
  TrendingUp,
  Scale,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import sections from "./sections";
import RichTextContent from "@/components/RichTextContent/RichTextContent";
import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  const [expandedSections, setExpandedSections] = useState({});
  const [acceptedTC, setAcceptedTC] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAllAccepted = acceptedTC && acceptedPrivacy;
  const expandedCount = Object.values(expandedSections).filter(Boolean).length;
  const totalSections = sections.length;

  const policyLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    {
      name: "Refund / Cancellation Policy",
      path: "/refund cancellation policy",
    },
    { name: "Subscription Terms", path: "/subscription terms" },
    { name: "Coaching Disclaimer", path: "/coaching disclaimer" },
    { name: "Copyright / IP Notice", path: "/copyright" },
  ];

  // Get icon for each section based on title
  const getSectionIcon = (title) => {
    if (title.includes("About")) return <BookOpen size={18} />;
    if (title.includes("Eligibility")) return <Users size={18} />;
    if (title.includes("Account")) return <Lock size={18} />;
    if (title.includes("Permitted")) return <Shield size={18} />;
    if (title.includes("Platform Content")) return <FileText size={18} />;
    if (title.includes("Pricing")) return <CreditCard size={18} />;
    if (title.includes("Payment")) return <CreditCard size={18} />;
    if (title.includes("No Refund")) return <Ban size={18} />;
    if (title.includes("Subscription")) return <RefreshCw size={18} />;
    if (title.includes("Intellectual")) return <Shield size={18} />;
    if (title.includes("Prohibited")) return <Ban size={18} />;
    if (title.includes("Suspension")) return <AlertCircle size={18} />;
    if (title.includes("Third-Party")) return <Globe size={18} />;
    if (title.includes("No Guaranteed")) return <TrendingUp size={18} />;
    if (title.includes("Disclaimer")) return <AlertCircle size={18} />;
    if (title.includes("Limitation")) return <Scale size={18} />;
    if (title.includes("Privacy")) return <Eye size={18} />;
    if (title.includes("Governing")) return <Scale size={18} />;
    if (title.includes("Contact")) return <Mail size={18} />;
    return <FileText size={18} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-blue-500/5 to-transparent"></div>
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-6">
              <Shield size={34} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Terms and Conditions
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Please read these terms carefully before using BrahmaLYF
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <AlertCircle size={14} />
                Last updated: {"01/01/2026 "}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction Card */}
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 sm:px-8 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <AlertCircle size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Agreement Overview
              </h2>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <p className="mb-4 text-slate-700 leading-relaxed">
              Welcome to{" "}
              <span className="font-bold text-slate-900">BrahmaLYF</span>{" "}
              ("Platform", "we", "our", "us"). These Terms & Conditions / Terms
              of Use ("Terms") govern your access to and use of{" "}
              <span className="font-bold text-slate-900">brahmalyf.com</span>,
              including all content, subscriptions, programs, videos, audios,
              tools, live sessions, digital features, and related services
              offered through the Platform.
            </p>
            <div className="mb-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-700 leading-relaxed font-medium mb-3">
                By accessing, browsing, registering on, purchasing from, or
                using BrahmaLYF, you agree to be bound by these Terms, along
                with our:
              </p>
              <div className="flex flex-wrap gap-2">
                {policyLinks.map((policy) => (
                  <Link key={policy.path} to={policy.path}>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 hover:text-blue-800 transition-colors cursor-pointer">
                      {policy.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3 mb-12">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="group rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-5 py-4 sm:px-7 sm:py-5 flex items-center justify-between text-left transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3 pr-4">
                  <div className="text-blue-500">
                    {getSectionIcon(section.title)}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    {section.title}
                  </h3>
                </div>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-slate-400 transition-all duration-300 ${
                    expandedSections[section.id]
                      ? "rotate-180 text-blue-600"
                      : ""
                  }`}
                />
              </button>

              {expandedSections[section.id] && (
                <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-5 sm:px-7 sm:py-6">
                  <RichTextContent content={section.content} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Acceptance Section */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-5 sm:px-8 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Check size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Your Agreement
              </h2>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="space-y-5">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedTC}
                  onChange={(e) => setAcceptedTC(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600  cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed">
                  I have read and agree to the{" "}
                  <span className="font-semibold text-blue-600">
                    Terms and Conditions
                  </span>{" "}
                  outlined above
                </span>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600  cursor-pointer"
                />
                <span className="text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed">
                  I understand and accept our{" "}
                  <span className="font-semibold text-blue-600">
                    Privacy Policy
                  </span>{" "}
                  and data handling practices
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4  bottom-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-lg">
          <button
            disabled={!isAllAccepted}
            className={`flex-1 rounded-xl px-8 py-4 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              isAllAccepted
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Check size={20} />
            Accept & Continue
          </button>

          <button className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
            Decline
          </button>
        </div>

        {/* Contact Info Footer */}
        <div className="mt-8 mb-24 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Mail size={16} className="text-blue-400" />
              <span>brahma.lyf@gmail.com</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-600"></div>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin size={16} className="text-blue-400" />
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            By clicking "Accept & Continue," you agree to our complete Terms and
            Conditions. Please ensure you have read and understood all sections
            before proceeding.
          </p>
        </div>
      </main>
    </div>
  );
}
