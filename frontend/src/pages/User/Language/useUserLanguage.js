import { updateUserLanguageAPI } from "@/store/feature/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useUserLanguage = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.user);
  const userId = useSelector((state) => state.auth.user?.user_id);

  return {
    language: userId?.language || localStorage.getItem("lang") || "en",
  };
};

export default useUserLanguage;
