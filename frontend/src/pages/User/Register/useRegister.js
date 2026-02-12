import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUserAPI } from "@/store/feature/auth";
import { clearError } from "@/store/feature/auth/authSlice";

const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, registerSuccess } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Optional fields - default to null/empty
  const [contactNumber, setContactNumber] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  const [localError, setLocalError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLocalError(null);
    setPasswordError(null);
    dispatch(clearError());

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    // Only send non-empty optional fields
    const registrationData = {
      name,
      email,
      password,
      contact_number: contactNumber.trim() || null,
      dob: dob || null,
      gender: gender || null,
      profile_picture_url: profilePictureUrl || null,
    };

    dispatch(registerUserAPI(registrationData));
  };

  useEffect(() => {
    if (registerSuccess) {
      // Redirect after 2 seconds
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [registerSuccess, navigate]);

  return {
    // Required fields
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    
    // Optional fields
    contactNumber,
    setContactNumber,
    dob,
    setDob,
    gender,
    setGender,
    profilePictureUrl,
    setProfilePictureUrl,
    
    // State
    error: localError || error,
    passwordError,
    passwordStrength,
    loading: isLoading,
    registerSuccess,
    handleRegister,
    validatePassword
  };
};

export default useRegister;