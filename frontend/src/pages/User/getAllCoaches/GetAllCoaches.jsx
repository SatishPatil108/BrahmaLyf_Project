import React, { useState } from "react";
import useGetAllCoaches from "./useGetAllCoaches";
import { ArrowRight, Users, Sparkles, Star, Award, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Pagination from "@/components/Pagination/Pagination";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import usePagination from "@/hooks";

const GetAllCoaches = () => {
  const { theme } = useTheme();
  const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1, 6);
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

  const { coachesDetails, isLoading, error } = useGetAllCoaches(pageNo, pageSize);
  const coaches = coachesDetails?.coaches || [];
  const navigate = useNavigate();

  // Theme-based styles
  const themeStyles = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      card: "bg-gray-800/50 border-gray-700",
      cardHover: "hover:bg-gray-800/70 hover:border-purple-500",
      text: {
        primary: "text-gray-100",
        secondary: "text-gray-300",
        tertiary: "text-gray-400",
        accent: "text-purple-400"
      },
      gradient: {
        primary: "from-purple-600 to-pink-600",
        secondary: "from-teal-500 to-blue-600",
        accent: "from-orange-500 to-yellow-500"
      },
      button: {
        primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
        secondary: "bg-gray-700 hover:bg-gray-600 text-gray-300"
      },
      loading: "bg-gray-800 text-gray-300",
      emptyState: "bg-gray-800/30 border-gray-700 text-gray-300"
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      card: "bg-white/50 border-gray-200",
      cardHover: "hover:bg-white/70 hover:border-purple-500",
      text: {
        primary: "text-gray-900",
        secondary: "text-gray-600",
        tertiary: "text-gray-500",
        accent: "text-purple-600"
      },
      gradient: {
        primary: "from-purple-500 to-pink-500",
        secondary: "from-teal-400 to-blue-500",
        accent: "from-orange-400 to-yellow-400"
      },
      button: {
        primary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700"
      },
      loading: "bg-white text-gray-600",
      emptyState: "bg-gray-50 border-gray-200 text-gray-600"
    }
  };

  const styles = themeStyles[theme];

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${styles.bg}`}>
        <div className="text-center">
          <div className="relative mb-6">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${styles.gradient.primary} opacity-20 animate-pulse`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className={`w-10 h-10 ${styles.text.accent} animate-pulse`} />
            </div>
          </div>
          <p className={`text-lg font-medium ${styles.text.secondary} animate-pulse`}>
            Discovering our expert guides...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${styles.bg}`}>
        <div className={`max-w-md w-full p-8 rounded-2xl ${styles.emptyState} border text-center`}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${styles.text.primary}`}>Unable to Load Coaches</h3>
          <p className={`text-sm mb-6 ${styles.text.secondary}`}>
            {error?.message || "Something went wrong while loading coaches."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105 ${styles.button.secondary}`}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105 ${styles.button.primary}`}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!coaches || coaches.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${styles.bg}`}>
        <div className={`max-w-md w-full p-8 rounded-2xl ${styles.emptyState} border text-center`}>
          <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${styles.gradient.primary} flex items-center justify-center mx-auto mb-6`}>
            <Users className="w-10 h-10 text-white" />
          </div>
          <h3 className={`text-2xl font-bold mb-3 ${styles.text.primary}`}>No Coaches Found</h3>
          <p className={`text-base mb-6 ${styles.text.secondary}`}>
            We're expanding our team of expert coaches. Check back soon!
          </p>
          <button
            onClick={() => navigate('/')}
            className={`px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 ${styles.button.primary}`}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${styles.bg}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
        <div className={`absolute bottom-1/4 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 ${theme === 'dark' ? 'bg-pink-600' : 'bg-pink-300'}`}></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-4">
            <Sparkles className={`w-8 h-8 sm:w-12 sm:h-12 animate-pulse ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-500'}`} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
              Our Expert Guides
            </span>
          </h1>

          <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto ${styles.text.secondary} font-light leading-relaxed`}>
            Learn from world-class mentors, innovators, and thought leaders dedicated to your transformation journey.
          </p>

          {/* Stats Overview */}
          <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className={`p-4 rounded-2xl border ${styles.card} transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${styles.text.primary}`}>{coachesDetails.total_records || coaches.length}</p>
                  <p className={`text-sm ${styles.text.secondary}`}>Expert Coaches</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${styles.card} transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${styles.text.primary}`}>
                    {coaches.filter(c => c.experience > 10).length}+
                  </p>
                  <p className={`text-sm ${styles.text.secondary}`}>10+ Years Experience</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${styles.card} transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${styles.text.primary}`}>
                    {Math.round(coaches.reduce((acc, c) => acc + (c.rating || 4.5), 0) / coaches.length)}+
                  </p>
                  <p className={`text-sm ${styles.text.secondary}`}>Avg Rating</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${styles.card} transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${styles.text.primary}`}>
                    {new Set(coaches.map(c => c.expertise_domain || 'General')).size}
                  </p>
                  <p className={`text-sm ${styles.text.secondary}`}>Expertise Domains</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {coaches.map((coach, index) => (
            <div
              key={coach.coach_id}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border cursor-pointer transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl ${styles.card} ${styles.cardHover} animate-fadeInUp`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => {
                dispatch(clearUserError());
                navigate(`/coach/${coach.coach_id}`);
              }}
            >
              {/* Coach Image */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={`${BASE_URL}${coach.profile_image_url}`}
                  alt={coach.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Experience Badge */}
                {coach.experience_years && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    {coach.experience_years}+ Years
                  </div>
                )}
              </div>

              {/* Coach Info */}
              <div className="flex-grow py-3 mx-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 group-hover:text-purple-500 transition-colors ${styles.text.primary}`}>
                      {coach.name}
                    </h3>
                    {coach.expertise_domain && (
                      <p className={`text-sm font-medium ${styles.text.accent}`}>
                        {coach.expertise_domain}
                      </p>
                    )}
                  </div>

                  {coach.rating && (
                    <div className="flex items-center gap-1 bg-gray-800/20 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className={`text-sm font-bold ${styles.text.primary}`}>
                        {coach.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <p className={`text-sm sm:text-base mb-6 line-clamp-3 ${styles.text.secondary}`}>
                  {coach.bio || `${coach.name} is an experienced mentor with proven expertise in guiding individuals toward their personal and professional goals.`}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {coach.total_students && (
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${styles.text.primary}`}>
                        {coach.total_students > 1000
                          ? `${(coach.total_students / 1000).toFixed(1)}k`
                          : coach.total_students}
                      </p>
                      <p className={`text-xs ${styles.text.tertiary}`}>Students</p>
                    </div>
                  )}

                  {coach.total_courses && (
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${styles.text.primary}`}>{coach.total_courses}</p>
                      <p className={`text-xs ${styles.text.tertiary}`}>Programs</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed Bottom Action Button */}
              <div className="mt-auto p-5 mx-6 border-t border-gray-400 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${styles.text.accent}`}>
                    View Profile
                  </span>
                  <div className={`p-2 rounded-full bg-gradient-to-r ${styles.gradient.primary} group-hover:scale-110 transition-transform duration-300`}>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {coachesDetails.total_pages > 1 && (
          <div className="mt-8 sm:mt-12">
            <Pagination
              currentPage={coachesDetails.current_page || 1}
              totalPages={coachesDetails.total_pages || 1}
              onPageChange={(page) => setPageNo(page)}
              currentPageSize={pageSize}
              onPageSizeChange={setPageSize}
              showPageSize={true}
            />
          </div>
        )}

        {/* CTA Section */}
        <div className={`mt-12 sm:mt-16 p-6 sm:p-8 lg:p-12 rounded-3xl border text-center ${styles.card}`}>
          <h3 className={`text-2xl sm:text-3xl font-bold mb-4 ${styles.text.primary}`}>
            Ready to Transform Your Life?
          </h3>
          <p className={`text-base sm:text-lg mb-6 ${styles.text.secondary} max-w-2xl mx-auto`}>
            Join thousands who have accelerated their growth with our expert coaches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/categories')}
              className={`px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 ${styles.button.primary}`}
            >
              Explore Programs
            </button>
            <button
              onClick={() => navigate('/')}
              className={`px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 ${styles.button.secondary}`}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllCoaches;