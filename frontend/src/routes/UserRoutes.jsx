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
import CourseDetailsPage from "@/pages/User/courseDetails";
import CoachProfile from "@/pages/User/coachProfile";
import GetAllCoaches from "@/pages/User/getAllCoaches";
import Header from "@/components/header/Header";
import { Login } from "@/pages/User/Login";
import Register from "@/pages/User/Register";
import { Contact, Homepage } from "@/pages/User/Homepage";
import { CourseList } from "@/pages/User/courses";
import EnrolledCourses from "@/pages/User/myCourses";
import EnrolledCourseDetails from "@/pages/User/enrolledCourseDetails";
import Footer from "@/components/footer/Footer";
import UserLoggedOut from "@/pages/User/userLoggedOut";
import BannerImage from "@/pages/User/Homepage/components/bannerImages/BannerImage";
import Categories from "@/pages/User/Homepage/components/getAllCategories/Categories";
import SubCategories from "@/pages/User/Homepage/components/getAllSubCategories/SubCategories";
import MusicPlayer from "@/pages/User/Music/PlayerBar";
import ForgotPassword from "@/pages/User/forgotPassword/ForgotPassword";
import ChangePassword from "@/pages/User/changePassword/ChangePassword";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import ViewProfile from "@/pages/User/viewProfile/ViewProfile";
import EditProfile from "@/pages/User/editProfile/EditProfile";
import DailyShorts from "@/pages/User/Homepage/components/getAllDailyshorts/DailyShorts";
import ShortVideoPlayer from "@/pages/User/Video/ShortVideoPlayer";
import PersonalNotes from "@/pages/User/Notes/PersonalNotes";
import TermsAndConditions from "@/pages/User/FooterLinks/Terms&condition/Termsandconditions";
import PrivacyPolicy from "@/pages/User/FooterLinks/Privacy/PrivacyPolicy";
import RefundCancellationPolicy from "@/pages/User/FooterLinks/RefundCancellationPolicy/RefundCancellationPolicy";
import SubscriptionTerms from "@/pages/User/FooterLinks/SubscriptionTerms/SubscriptionTerms";
import CoachingDisclaimer from "@/pages/User/FooterLinks/Coaching Disclaimar/CoachingDisclaimer";
import CopyrightNotice from "@/pages/User/FooterLinks/CopyrightNotice/CopyrightNotice";
import FreeTrial from "@/pages/User/Homepage/components/FAQsSections/FreeTrial";
import CourseCartDetails from "@/pages/User/PaymentDetails/CourseCartDetails";
import MusicDetails from "@/pages/User/Homepage/components/getAllMusicList/MusicDetails";

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
          <Route path="/contact" element={<Contact />} />
          <Route path="/categories" element={<CourseList />} />
          <Route
            path="/categories/subcategories/:domain_name"
            element={<SubCategoriesPage />}
          />
          <Route path="/musics" element={<MusicDetails />} />
          <Route path="/music/:musicId" element={<MusicPlayer />} />
          <Route path="/short-video" element={<DailyShorts />} />

          <Route
            path="/short-video/:shortVideoId"
            element={<ShortVideoPlayer />}
          />
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
          />
          <Route path="/coach/:coachId" element={<CoachProfile />} />
          <Route path="/coaches" element={<GetAllCoaches />} />
          <Route path="/my-courses" element={<EnrolledCourses />} />
          <Route
            path="/enrolled-course/:courseId"
            element={<EnrolledCourseDetails />}
          />

          <Route path="/cart/details" element={<CourseCartDetails />} />

          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/trial-resources" element={<FreeTrial />} />
          <Route path="/notes" element={<PersonalNotes />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route
            path="/refund-cancellation-policy"
            element={<RefundCancellationPolicy />}
          />
          <Route path="/subscription-terms" element={<SubscriptionTerms />} />
          <Route path="/coaching-disclaimer" element={<CoachingDisclaimer />} />
          <Route path="/copyright" element={<CopyrightNotice />} />
        </Routes>

        {/* Spacer for mobile bottom navigation */}
        <div className="lg:hidden h-16" />
      </main>

      {/* Footer — hidden on mobile */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      
    </div>
  );
};

export default UserRoutes;
