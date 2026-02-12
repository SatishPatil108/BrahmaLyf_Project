import useSubCategoriesPage from '@/pages/User/subCategories/useSubCategoriesPage';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { clearUserError } from '@/store/feature/user/userSlice';
import { useDispatch } from 'react-redux';
import { useTheme } from "@/contexts/ThemeContext";
import { BookOpen, TrendingUp, ChevronRight } from 'lucide-react';

const SubCategories = ({ category, isFirst }) => {
  const { theme } = useTheme();
  const { subdomainsDetails, loading, error } = useSubCategoriesPage(category.domain_id);
  const subdomains = subdomainsDetails?.subdomains || [];
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;
  const navigate = useNavigate();

  const handleSubcategoryClick = (subcategory) => {
    dispatch(clearUserError());
    navigate(`/categories/courses/${subcategory.subdomain_name}`, {
      state: { subdomainId: subcategory.subdomain_id }
    });
  };

  // Difficulty level styling
  const getDifficultyStyle = (level) => {
    const styles = {
      1: { // Beginner
        text: 'Beginner',
        color: theme === 'dark' ? 'text-green-400' : 'text-green-600',
        bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
        border: theme === 'dark' ? 'border-green-800' : 'border-green-200'
      },
      2: { // Intermediate
        text: 'Intermediate',
        color: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
        bg: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50',
        border: theme === 'dark' ? 'border-yellow-800' : 'border-yellow-200'
      },
      3: { // Advanced
        text: 'Advanced',
        color: theme === 'dark' ? 'text-red-400' : 'text-red-600',
        bg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50',
        border: theme === 'dark' ? 'border-red-800' : 'border-red-200'
      }
    };
    return styles[level] || styles[1];
  };

  // Loading state
  if (loading) {
    return (
      <div className={`mt-6 mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className={`h-8 w-64 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg mb-6 animate-pulse`}></div>
        <div className="flex overflow-x-auto scroll-smooth gap-4 pb-4 px-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-[280px] sm:w-[300px] flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-2xl overflow-hidden`}>
              <div className={`h-40 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className="p-4">
                <div className={`h-5 w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-3 animate-pulse`}></div>
                <div className={`h-4 w-1/2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`mt-6 mb-8 p-4 rounded-xl ${theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
        <p className={`text-center ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
          Failed to load subcategories
        </p>
      </div>
    );
  }

  return (
    <div className={`mt-8 mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Category Header */}
      {!isFirst && (
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <BookOpen className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>

            <h4 className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {category.domain_name}
            </h4>

            {/* ⬇️ Badge moved here */}
            {subdomains.length > 0 && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark'
                ? 'bg-purple-900/30 text-purple-300'
                : 'bg-purple-50 text-purple-700'
                }`}>
                {subdomains.length} {subdomains.length === 1 ? "Course" : "Courses"}
              </div>
            )}
          </div>
        </div>
      )}


      {/* No Subcategories Message */}
      {!subdomains?.length && !loading && (
        <div className={`py-8 px-6 rounded-xl text-center ${theme === 'dark'
          ? 'bg-gray-800/50 border border-gray-700'
          : 'bg-gray-50 border border-gray-200'}`}>
          <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <BookOpen className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`} />
          </div>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No subcategories available currently.
          </p>
        </div>
      )}

      {/* Subcategory Cards - Responsive Grid */}
      {subdomains && subdomains.length > 0 && (
        <div className="mt-6">
          {/* Mobile: Horizontal Scroll */}
          <div className="lg:hidden overflow-x-auto scroll-smooth scrollbar-hide pb-6 -mx-4 px-4">
            <div className="flex gap-4">
              {subdomains.map((subcategory) => {
                const difficulty = getDifficultyStyle(subcategory.progressive_difficulty);
                return (
                  <motion.div
                    key={subcategory.subdomain_id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className={`w-[340px] flex-shrink-0 cursor-pointer snap-start rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg ${theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 hover:border-purple-600'
                      : 'bg-white border-gray-200 hover:border-purple-300'
                      }`}
                  >
                    {/* Image Container */}
                    <div className={`h-40 overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <img
                        src={`${BASE_URL}${subcategory.subdomain_thumbnail}`}
                        alt={subcategory.subdomain_name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/300x160/${theme === 'dark' ? '374151' : 'f3f4f6'}/9ca3af?text=${encodeURIComponent(subcategory.subdomain_name)}`;
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className={`text-base font-semibold mb-2 line-clamp-1 ${theme === 'dark'
                        ? 'text-white group-hover:text-purple-300'
                        : 'text-gray-800 group-hover:text-purple-600'
                        }`}>
                        {subcategory.subdomain_name}
                      </h3>

                      <div className="flex items-center justify-between mt-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficulty.bg} ${difficulty.color} ${difficulty.border}`}>
                          {difficulty.text}
                        </span>
                        <ChevronRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden lg:block w-full px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 lg:gap-10">
              {subdomains.map((subcategory) => {
                const difficulty = getDifficultyStyle(subcategory.progressive_difficulty);
                return (
                  <motion.div
                    key={subcategory.subdomain_id}
                    whileHover={{ y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className={`cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl group w-full min-w-[280px] lg:min-w-[330px] xl:min-w-[350px]
                      ${theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700 hover:border-purple-500'
                        : 'bg-white border-gray-200 hover:border-purple-300'
                      }`}
                  >
                    {/* Image Container */}
                    <div className={`h-48 lg:h-52 xl:h-56 overflow-hidden relative ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <img
                        src={`${BASE_URL}${subcategory.subdomain_thumbnail}`}
                        alt={subcategory.subdomain_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/500x300/${theme === 'dark' ? '374151' : 'f3f4f6'}/9ca3af?text=${encodeURIComponent(subcategory.subdomain_name)}`;
                        }}
                      />
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-500'}`}></div>
                    </div>

                    {/* Content */}
                    <div className="p-5 lg:p-6 xl:p-7">
                      <div className="flex items-start justify-between mb-3 lg:mb-4">
                        <h3 className={`text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[75%] lg:max-w-[80%] ${theme === 'dark' ? 'text-white group-hover:text-purple-300' : 'text-gray-800 group-hover:text-purple-600'}`} title={subcategory.subdomain_name}
                        >
                          {subcategory.subdomain_name}
                        </h3>
                        <TrendingUp className={`w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium border ${difficulty.bg} ${difficulty.color} ${difficulty.border} whitespace-nowrap`}>
                          {difficulty.text} Level
                        </span>
                        <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                          <span className={`text-xs lg:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Explore
                          </span>
                          <ChevronRight className={`w-4 h-4 lg:w-5 lg:h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} group-hover:translate-x-1 transition-transform`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategories;