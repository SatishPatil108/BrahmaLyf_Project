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
import { useTheme } from "@/contexts/ThemeContext";

export default function TermsAndConditions() {
  const [expandedSections, setExpandedSections] = useState({});
  const [acceptedTC, setAcceptedTC] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const { theme } = useTheme();

  const themeColors = {
    dark: {
      pageBg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      headerBg: "bg-gray-900 border-gray-700",
      tagBg: "bg-purple-900/30 text-purple-400 hover:bg-purple-900/50",
      headerOverlay: "from-purple-900/20 to-transparent opacity-50",
      headingText: "text-gray-100",
      bodyText: "text-gray-300",
      mutedText: "text-gray-500",
      // Intro card
      cardBg: "bg-gray-800/50 border-gray-700",
      cardIconBg: "bg-purple-900/30",
      cardIconColor: "text-purple-400",
      cardBody: "text-gray-300",
      cardDivider: "border-gray-700",
      introBg: "bg-gray-800/50 border-gray-700",
      // Bullet dots
      dotColor: "bg-purple-500",
      dotText: "text-gray-400",
      // Accordion
      accordionBg: "bg-gray-800/40 border-gray-700",
      accordionBtnHover: "hover:bg-gray-700/50",
      accordionTitle: "text-gray-100",
      accordionIcon: "text-purple-400",
      accordionChevron: "text-gray-500",
      accordionChevronActive: "text-purple-400",
      accordionContentBg: "bg-gray-900/40",
      accordionDivider: "border-gray-700",
      richText:
        "text-white [&_p]:text-white [&_span]:text-white [&_li]:text-white [&_strong]:!text-purple-500 [&_b]:!text-purple-500",
    },
    light: {
      pageBg: "bg-gradient-to-br from-slate-50 via-white to-slate-50",
      headerBg: "bg-white border-slate-200 shadow-sm",
      headerOverlay: "from-purple-50 to-transparent opacity-50",
      headingText: "text-slate-900",
      bodyText: "text-slate-600",
      mutedText: "text-slate-500",
      // Intro card
      cardBg: "bg-white border-slate-200",
      cardIconBg: "bg-purple-100",
      cardIconColor: "text-purple-600",
      cardBody: "text-slate-700",
      cardDivider: "border-slate-100",
      // Bullet dots
      dotColor: "bg-purple-400",
      dotText: "text-slate-600",
      // Accordion
      accordionBg: "bg-white border-slate-200",
      accordionBtnHover: "hover:bg-slate-50",
      accordionTitle: "text-slate-900",
      accordionIcon: "text-purple-500",
      accordionChevron: "text-slate-500",
      accordionChevronActive: "text-purple-600",
      accordionContentBg: "bg-slate-50",
      accordionDivider: "border-slate-200",
      richText:
        "[&_strong]:text-slate-900 [&_a]:text-purple-600 [&_a:hover]:text-purple-800",
    },
  };

  const c = themeColors[theme] || themeColors.light;

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
    <div className={`min-h-screen ${c.pageBg}`}>
      {/* Header */}
      <div className={`relative overflow-hidden border-b ${c.headerBg}`}>
        <div
          className={`absolute inset-0 bg-gradient-to-r ${c.headerOverlay}`}
        ></div>
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <div className={`p-2 ${c.cardIconBg} rounded-xl shrink-0`}>
                <Shield
                  size={24}
                  className={`sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${c.cardIconColor}`}
                />
              </div>

              <h1
                className={`text-3xl font-bold tracking-tight leading-tight ${c.headingText}
        sm:text-4xl lg:text-5xl xl:text-6xl`}
              >
                Terms and Conditions
              </h1>
            </div>

            <p
              className={`mt-4 text-sm sm:text-base lg:text-lg ${c.mutedText} max-w-2xl mx-auto px-2`}
            >
              Please read these terms carefully before using BrahmaLYF
            </p>

            <div
              className={`mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm ${c.mutedText}`}
            >
              <span className="flex items-center gap-1.5 text-center">
                <AlertCircle size={14} className="shrink-0" />
                Last updated: {"01/01/2026 "}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction Card */}
        <div className={`mb-10 rounded-2xl border ${c.cardBg} overflow-hidden`}>
          <div className={`${c.cardHeaderBg} px-6 py-5 sm:px-8 border-b`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 ${c.cardIconBg} rounded-xl`}>
                <AlertCircle size={20} className={c.cardIconColor} />
              </div>
              <h2 className={`text-xl font-semibold ${c.headingText}`}>
                Agreement Overview
              </h2>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <p className={`mb-4 ${c.bodyText} leading-relaxed`}>
              Welcome to{" "}
              <span className={`font-bold ${c.headingText} text-purple-500`}>BrahmaLYF</span>{" "}
              ("Platform", "we", "our", "us"). These Terms & Conditions / Terms
              of Use ("Terms") govern your access to and use of{" "}
              <span className={`font-bold ${c.headingText}`}>
                brahmalyf.com
              </span>
              , including all content, subscriptions, programs, videos, audios,
              tools, live sessions, digital features, and related services
              offered through the Platform.
            </p>
            <div className={`mb-4 p-5 ${c.introBg} rounded-xl border`}>
              <p className={`${c.bodyText} leading-relaxed font-medium mb-3`}>
                By accessing, browsing, registering on, purchasing from, or
                using BrahmaLYF, you agree to be bound by these Terms, along
                with our:
              </p>
              <div className="flex flex-wrap gap-2">
                {policyLinks.map((policy) => (
                  <Link key={policy.path} to={policy.path}>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${c.tagBg}`}
                    >
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
          {sections.map((section) => (
            <div
              key={section.id}
              className={`overflow-hidden rounded-xl border ${c.accordionBg} shadow-sm transition-all`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between text-left ${c.accordionBtnHover} transition-colors`}
              >
                <div className="flex items-center gap-3 pr-4">
                  <div className={c.accordionIcon}>
                    {getSectionIcon(section.title)}
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-semibold ${c.accordionTitle}`}
                  >
                    {section.title}
                  </h3>
                </div>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 transition-all duration-300 ${
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
                    bulletClassName="text-purple-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`text-center text-sm ${c.mutedText} mb-6`}>
          <p>BrahmaLYF / Brahma Life School is a brand owned and operated by Markets and Clients.</p>
        </div>
      </main>
    </div>
  );
}
