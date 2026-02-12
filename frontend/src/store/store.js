import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import rootReducer from "./rootReducer.js";

const middlewares = [];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
});

export default store;
