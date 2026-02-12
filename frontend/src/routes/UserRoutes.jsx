import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import SubCategoriesPage from "@/pages/User/subCategories";
import CoachesInfoPage from "@/pages/User/coachesInfo";
import CourseDetailsPage from "@/pages/User/coachDetails";
import CoachProfile from "@/pages/User/coachProfile";
import GetAllCoaches from "@/pages/User/getAllCoaches";
import Header from "@/components/header/Header";
import { Login } from "@/pages/User/Login";
import Register from "@/pages/User/Register";
import { About, Contact, Homepage } from "@/pages/User/Homepage";
import { CourseList } from "@/pages/User/courses";
import EnrolledCourses from "@/pages/User/myCourses";
import EnrolledCourseDetails from "@/pages/User/enrolledCourseDetails";
import Footer from "@/components/footer/Footer";
import UserLoggedOut from "@/pages/User/userLoggedOut";
import MusicList from "@/pages/User/Homepage/components/getAllMusicList/MusicList";
import BannerImage from "@/pages/User/Homepage/components/bannerImages.jsx/BannerImage";
import Categories from "@/pages/User/Homepage/components/getAllCategories/Categories";
import SubCategories from "@/pages/User/Homepage/components/getAllSubCategories/SubCategories";
import FAQPage from "@/pages/User/Homepage/components/FAQsSections/FAQPage";
import MusicPlayer from "@/pages/User/Music/MusicPlayer";
import ForgotPassword from "@/pages/User/forgotPassword/ForgotPassword";
import ChangePassword from "@/pages/User/changePassword/ChangePassword";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import ViewProfile from "@/pages/User/viewProfile/ViewProfile";
import EditProfile from "@/pages/User/editProfile/EditProfile";

const UserRoutes = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // State for scroll visibility
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);

  // Check if user can go back (has history in our site)
  const canGoBack = window.history.length > 1;

  // Listen to scroll and route changes
  useEffect(() => {
    // Check for back button visibility based on current location
    // Exclude certain pages where back button shouldn't show
    const excludedPaths = ["/", "/login", "/register"];
    setShowBackButton(canGoBack && !excludedPaths.includes(location.pathname));

    // Handle scroll visibility
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, canGoBack]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content fills remaining space */}
      <main className="grow">
        <Routes>
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/categories" element={<CourseList />} />
          <Route
            path="/categories/subcategories/:domain_name"
            element={<SubCategoriesPage />}
          />
          <Route path="/musics" element={<MusicList />} />
          <Route path="/music/:musicId" element={<MusicPlayer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/logout" element={<UserLoggedOut />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/categories/courses/:subdomain_name"
            element={<CoachesInfoPage />}
          />
          <Route
            path="/course-details/:videoId"
            element={<CourseDetailsPage />}
          />{" "}
          <Route path="/coach/:coachId" element={<CoachProfile />} />
          <Route path="/coaches" element={<GetAllCoaches />} />
          <Route path="/my-courses" element={<EnrolledCourses />} />
          <Route
            path="/enrolled-course/:courseId"
            element={<EnrolledCourseDetails />}
          />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/faqs" element={<FAQPage />} />
        </Routes>

        {/* Spacer for mobile bottom navigation */}
        <div className="lg:hidden h-16" />
      </main>

      {/* Footer — hidden on mobile */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      {/* Floating Action Buttons - Stacked vertically */}
      <div className="fixed bottom-19 lg:bottom-6 right-0 lg:right-6 flex flex-col gap-2 z-50">
        {/* Scroll to Top Button - shows when scrolled */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`p-2.5 lg:p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              theme === "dark"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                : "bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white"
            }`}
            aria-label="Scroll to top"
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 rotate-90" />
          </button>
        )}

        {/* Back Button - shows when there's history and not on excluded pages */}
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className={`p-2.5 lg:p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              theme === "dark"
                ? "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white"
                : "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 border border-gray-300"
            }`}
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserRoutes;
