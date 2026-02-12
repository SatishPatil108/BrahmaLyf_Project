import { useTheme } from "@/contexts/ThemeContext";
import { useRef, useState } from "react";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
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
        subscribeToNewsletterAPI(txtEmail.current.value)
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

  const linkSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Our Mission", path: "/mission" },
        { name: "Careers", path: "/careers" },
        { name: "Blog", path: "/blog" },
      ],
    },
    {
      title: "Courses",
      links: [
        { name: "All Courses", path: "/courses" },
        { name: "New Arrivals", path: "/courses/new" },
        { name: "Popular", path: "/courses/popular" },
        { name: "Free Resources", path: "/resources" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "FAQs", path: "/faqs" },
        { name: "Contact Us", path: "/contact" },
        { name: "Privacy Policy", path: "/privacy" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  const contactInfo = [
    { icon: Mail, text: "support@brahmayf.com" },
    { icon: Phone, text: "+1 (555) 123-4567" },
    { icon: MapPin, text: "123 Wellness St, Mindful City" },
  ];

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
    },
  };

  const colors = themeColors[theme] || themeColors.light;

  return {
    theme,
    currentYear,
    txtEmail,
    handleSubmit,
    linkSections,
    socialLinks,
    contactInfo,
    colors,
    responseObj,
  };
};
export default useFooter;
