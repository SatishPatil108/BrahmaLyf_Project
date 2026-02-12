import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./feature/auth";
import { userReducer } from "./feature/user";
import { adminReducer } from "./feature/admin";

// Create a placeholder reducer for now
const placeholderReducer = (state = {}, action) => {
  return state;
};

const rootReducer = combineReducers({
  app: placeholderReducer,
   auth: authReducer,
   user:userReducer,
   admin:adminReducer
});

export default rootReducer;
