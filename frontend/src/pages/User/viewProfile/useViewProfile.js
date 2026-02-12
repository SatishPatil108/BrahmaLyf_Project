import { useSelector } from "react-redux";

const useViewProfile = () => {
  const { user, isLoading, error } = useSelector((state) => state.auth);

  return {
    userDetails: user,
    isLoading,
    error
  };
};

export default useViewProfile;