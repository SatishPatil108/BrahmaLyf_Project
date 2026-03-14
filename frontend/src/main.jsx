import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { ThemeProvider } from "./contexts/ThemeContext";
import i18n from "./config/i18n";

const root = createRoot(document.getElementById("root"));
const savedLang = localStorage.getItem("lang") || "en";
i18n.changeLanguage(savedLang);


root.render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>,
);
