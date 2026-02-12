import React from "react";
import { useParams } from "react-router-dom";
import useCoachProfile from "./useCoachProfile";
import CoachesInfoPage from "../coachesInfo";
import { useTheme } from "@/contexts/ThemeContext";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const CoachProfile = () => {
  const { coachId } = useParams();
  const { coachProfile, loading, error } = useCoachProfile(coachId);
  const { theme } = useTheme();

  if (loading || !coachProfile)
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading coach profile...</p>
        </div>
      </div>
    );

  if (error) {
    const errorMessage =
      typeof error === "string" ? error : error?.message || "Something went wrong";
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Error</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Main Profile Card */}
        <div className={`rounded-2xl shadow-xl overflow-hidden mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="md:flex">
            {/* Left Column - Image */}
            <div className="md:w-1/3 p-8 flex flex-col items-center justify-center">
              {coachProfile.profile_image_url && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-25"></div>
                  <img
                    src={`${BASE_URL}${coachProfile.profile_image_url}`}
                    alt={coachProfile.name}
                    className="relative w-48 h-48 md:w-56 md:h-56 object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  />
                </div>
              )}
              
              {/* Contact Info - Mobile only */}
              <div className="mt-6 md:hidden space-y-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>📧</span>
                  <a 
                    href={`mailto:${coachProfile.email}`}
                    className={`text-sm ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} transition-colors`}
                  >
                    {coachProfile.email}
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>📞</span>
                  <a 
                    href={`tel:${coachProfile.contact_number}`}
                    className={`text-sm ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} transition-colors`}
                  >
                    {coachProfile.contact_number}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="md:w-2/3 p-6 md:p-8">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {coachProfile.name}
                    </h1>
                    <p className={`text-lg md:text-xl mt-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      {coachProfile.professional_title}
                    </p>
                  </div>
                  
                  {/* Contact Info - Desktop only */}
                  <div className="hidden md:block space-y-3 mt-4 md:mt-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>📧</span>
                      </div>
                      <div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                        <a 
                          href={`mailto:${coachProfile.email}`}
                          className={`font-medium ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} transition-colors`}
                        >
                          {coachProfile.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>📞</span>
                      </div>
                      <div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Contact</p>
                        <a 
                          href={`tel:${coachProfile.contact_number}`}
                          className={`font-medium ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} transition-colors`}
                        >
                          {coachProfile.contact_number}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <span className="font-semibold">Experience:</span>
                  <span>{coachProfile.experience}</span>
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  About {coachProfile.name.split(' ')[0]}
                </h2>
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {coachProfile.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coaches Info Section */}
        <div className={`rounded-2xl shadow-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-center`}>
            Courses & Specializations
          </h2>
          <CoachesInfoPage coachId={coachId} />
        </div>
      </div>
    </div>
  );
};

export default CoachProfile;