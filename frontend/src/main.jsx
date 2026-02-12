import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { ThemeProvider } from "./contexts/ThemeContext";

const root = createRoot(document.getElementById("root"));

root.render(
  // <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  // </StrictMode>
);
