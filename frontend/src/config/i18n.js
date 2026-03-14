import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// translations
const resources = {
  en: {
    translation: {
      search: {
        placeholder: "Search here...",
      },
      buttons: {
        submit: "Submit",
        cancel: "Cancel",
      },
    },
  },
  hi: {
    translation: {
      search: {
        placeholder: "यहाँ खोजें...",
      },
      buttons: {
        submit: "प्रस्तुत करना",
        cancel: "रद्द करें",
      },
    },
  },
  mr: {
    translation: {
      search: {
        placeholder: "इथे शोधा...",
      },
      buttons: {
        submit: "सबमिट करा",
        cancel: "रद्द करा",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "en", // persist
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
