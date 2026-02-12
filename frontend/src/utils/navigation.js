import { clearAdminError } from "@/store/feature/admin/adminSlice";
import { clearError } from "@/store/feature/auth/authSlice";
import { clearUserError } from "@/store/feature/user/userSlice";

let navigator;
let reduxDispatch;

export const setNavigator = (navFunc) => {
  navigator = navFunc;
};

export const setDispatch = (dispatchFunc) => {
  reduxDispatch = dispatchFunc;
};

export const navigateTo = (path) => {
  if (reduxDispatch) {
    reduxDispatch(clearAdminError());
    reduxDispatch(clearUserError());
    reduxDispatch(clearError());
  }

  if (navigator) {
    navigator(path);
  }
};
