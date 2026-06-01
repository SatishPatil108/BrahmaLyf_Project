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
import { useTheme } from "@/contexts/ThemeContext";
import RichTextContent from "@/components/RichTextContent/RichTextContent";

export default function SubscriptionTerms() {
  const [expandedSections, setExpandedSections] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedNoRefund, setAcceptedNoRefund] = useState(false);
  const [acceptedSharing, setAcceptedSharing] = useState(false);

  const { theme } = useTheme();

  const themeColors = {
    dark: {
      // Page
      pageBg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      // Header
      headerBg: "bg-gray-900 border-gray-700",
      headerOverlay: "from-emerald-600/10 via-teal-500/5 to-transparent",
      headingText: "text-gray-100",
      bodyText: "text-gray-300",
      mutedText: "text-gray-500",
      accentText: "text-emerald-400",
      // Plan card
      planCardBg: "bg-gray-800/60 border-gray-700",
      planCardInner: "bg-emerald-900/30",
      planIconBg: "bg-emerald-700",
      planBadgeBg: "bg-emerald-900/50 text-emerald-300",
      planDivider: "border-gray-700",
      planPrice: "text-gray-100",
      planPriceSub: "text-gray-400",
      // Accordion
      accordionBg: "bg-gray-800/40 border-gray-700",
      accordionBtnHover: "hover:bg-gray-700/40",
      accordionTitle: "text-gray-100",
      accordionIcon: "text-emerald-400",
      accordionChevron: "text-gray-500",
      accordionChevronActive: "text-emerald-400",
      accordionContentBg: "bg-gray-900/50",
      accordionDivider: "border-gray-700",
      // RichText overrides
      richText:
        "text-white [&_p]:text-white [&_span]:text-white [&_li]:text-white [&_strong]:!text-green-500 [&_b]:!text-green-500",
    },
    light: {
      // Page
      pageBg: "bg-gradient-to-br from-slate-50 via-white to-slate-50",
      // Header
      headerBg: "bg-white border-slate-200 shadow-sm",
      headerOverlay: "from-emerald-50 to-transparent opacity-50",
      headingText: "text-slate-900",
      bodyText: "text-slate-600",
      mutedText: "text-slate-500",
      accentText: "text-emerald-600",
      // Plan card
      planCardBg: "bg-white border-2 border-emerald-200",
      planCardInner: "bg-gradient-to-r from-emerald-50 to-white",
      planIconBg: "bg-emerald-600",
      planBadgeBg: "bg-emerald-100 text-emerald-700",
      planDivider: "border-emerald-100",
      planPrice: "text-slate-900",
      planPriceSub: "text-slate-500",
      // Accordion
      accordionBg: "bg-white border-slate-200",
      accordionBtnHover: "hover:bg-slate-50",
      accordionTitle: "text-slate-900",
      accordionIcon: "text-emerald-500",
      accordionChevron: "text-slate-500",
      accordionChevronActive: "text-emerald-600",
      accordionContentBg: "bg-slate-50",
      accordionDivider: "border-slate-200",
      // RichText — light inherits naturally
      richText:
        "[&_strong]:text-slate-900 [&_a]:text-emerald-600 [&_a:hover]:text-emerald-800",
    },
  };

  const c = themeColors[theme] || themeColors.light;

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const iconMap = {
    plan: CreditCard,
    access: Clock,
    user: User,
    renewal: RefreshCw,
    policy: Shield,
    warning: AlertCircle,
    suspension: XCircle,
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
              <div className={`p-2 ${c.planCardInner} rounded-xl`}>
                <CreditCard size={28} className={c.accordionIcon} />
              </div>
              <h1
                className={`text-3xl font-bold tracking-tight ${c.headingText} sm:text-4xl`}
              >
                Subscription Terms
              </h1>
            </div>
            <p className={`text-lg ${c.bodyText}`}>
              These Subscription Terms govern all subscription-based access and
              paid digital services offered through{" "}
              <span className={`font-bold ${c.accentText}`}>BrahmaLYF</span>
            </p>
            <p className={`text-sm ${c.mutedText} mt-2`}>
              Last updated: {"01/01/2026 "}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Current Plan Card */}
        <div
          className={`mb-8 rounded-xl border ${c.planCardBg} p-6 shadow-sm sm:p-8`}
        >
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${c.planCardInner} rounded-lg p-4`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 ${c.planIconBg} rounded-lg`}>
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <p
                  className={`text-sm ${c.accentText} font-semibold uppercase tracking-wide`}
                >
                  Current Plan
                </p>
                <h2 className={`text-3xl font-bold ${c.planPrice}`}>
                  ₹3000{" "}
                  <span className={`text-lg font-normal ${c.planPriceSub}`}>
                    / year
                  </span>
                </h2>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg ${c.planBadgeBg}`}>
              <p className="text-sm font-medium">
                Best Value • Annual Subscription
              </p>
            </div>
          </div>
          <p
            className={`text-sm ${c.mutedText} mt-4 pt-4 border-t ${c.planDivider}`}
          >
            This pricing is subject to change in the future at our sole
            discretion. Any revised pricing shall apply to future purchases
            unless otherwise expressly stated.
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4 mb-12">
          {subscriptionSections.map((section) => {
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
                      bulletClassName="text-green-500"
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
