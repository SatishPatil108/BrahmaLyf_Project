import { useTheme } from "@/contexts/ThemeContext";
import { useMemo, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  Send,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { subscribeToNewsletterAPI } from "@/store/feature/user";

const useFooter = () => {
  const txtEmail = useRef();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const [responseObj, setResponseObj] = useState({
    res: null,
    loading: false,
    error: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!txtEmail.current?.value || responseObj.loading) return;

    setResponseObj({
      loading: true,
      res: null,
      error: null,
    });

    try {
      const res = await dispatch(
        subscribeToNewsletterAPI(txtEmail.current.value),
      ).unwrap();

      setResponseObj({
        loading: false,
        res,
        error: null,
      });

      txtEmail.current.value = "";
    } catch (err) {
      setResponseObj({
        loading: false,
        res: null,
        error: err?.message || "Something went wrong",
      });
    }
  };

  const linkSections = useMemo(() => [
    {
      title: "Company",
      links: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/trial-resources" },
        { name: "Contact", path: "/contact" },
        { name: "Categories", path: "/categories" },
      ],
    },

    {
      title: "Legal",
      links: [
        { name: "Terms", path: "/terms" },
        { name: "Privacy", path: "/privacy" },
        { name: "Refund", path: "/refund-cancellation-policy" },
        { name: "Subscription", path: "/subscription-terms" },
        { name: "Disclaimer", path: "/coaching-disclaimer" },
      ],
    },
  ]);

  // Theme colors
  const themeColors = {
    dark: {
      bg: "bg-gray-900",
      border: "border-gray-800",
      cardBg: "bg-gray-800/80",
      text: "text-gray-100",
      mutedText: "text-gray-400",
      accent: "from-purple-600 to-pink-500",
      accentText:
        "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
      hoverText: "hover:text-purple-300",
      inputBg: "bg-gray-800 border-gray-700",
      bottomBg: "bg-gray-900",
      socialBg: "bg-gray-800 hover:bg-purple-900/40",
      socialText: "text-gray-400 hover:text-purple-300",
      footerBg: "bg-gray-900",
      footerBorder: "border-gray-800",
      headingText: "text-white",
      linkText: "text-gray-400",
      linkHover: "hover:text-purple-400",
      descriptionText: "text-gray-400",
      newsletterText: "text-gray-300",
      inputPlaceholder: "placeholder-gray-500",
      inputFocus: "ring-purple-400",
      buttonBg: "bg-purple-600 hover:bg-purple-700",
      buttonText: "text-white",
      copyrightText: "text-gray-500",
      poweredByText: "text-gray-500",
    },
    light: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      cardBg: "bg-white",
      text: "text-gray-900",
      mutedText: "text-gray-600",
      accent: "from-purple-500 to-pink-400",
      accentText:
        "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
      hoverText: "hover:text-purple-600",
      inputBg: "bg-white border-gray-300",
      bottomBg: "bg-gray-50",
      socialBg: "bg-gray-100 hover:bg-purple-100",
      socialText: "text-gray-600 hover:text-purple-600",
      footerBg: "from-gray-50 to-white",
      footerBorder: "border-gray-200",
      headingText: "text-gray-900",
      linkText: "text-gray-600",
      linkHover: "hover:text-purple-600",
      descriptionText: "text-gray-600",
      newsletterText: "text-gray-700",
      inputPlaceholder: "placeholder-gray-400",
      inputFocus: "ring-purple-500",
      buttonBg: "bg-purple-500 hover:bg-purple-600",
      buttonText: "text-white",
      copyrightText: "text-gray-500",
      poweredByText: "text-gray-500",
    },
  };

  const colors = themeColors[theme] || themeColors.light;

  return {
    theme,
    currentYear,
    txtEmail,
    handleSubmit,
    linkSections,
    colors,
    responseObj,
    setResponseObj,
  };
};
export default useFooter;
