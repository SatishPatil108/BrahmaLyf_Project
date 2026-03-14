import i18n from "@/config/i18n";
import { Globe } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useUserLanguage from "./useUserLanguage";
import { updateUserLanguageAPI } from "@/store/feature/user";

const LanguageSelector = () => {
  const { language, userId } = useUserLanguage();
  const dispatch = useDispatch();

  const savedLang = localStorage.getItem("lang");

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
      localStorage.setItem("lang", language);
    }
  }, [language]);

  const handleChange = (e) => {
    const lang = e.target.value;

    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);

    if (lang !== language) {
      dispatch(updateUserLanguageAPI({ language: lang }));
    }
  };

  return (
    <div className="flex items-center text-gray-300 gap-2 cursor-pointer px-2">
      <Globe className="w-5 h-5 hover:text-gray-100 transition-colors" />

      <select
        onChange={handleChange}
        value={language || "en"}
        className="py-1.5 font-medium text-sm w-12 text-gray-300 bg-gray-900/50 hover:bg-gray-700/50"
      >
        <option value="en">EN</option>
        <option value="hi">HI</option>
        <option value="mr">MR</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
