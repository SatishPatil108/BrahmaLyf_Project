import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useCourseList from "./useCourseList";
import usePagination from "@/hooks/usePagination";
import CustomDrawer from "@/components/CustomDrawer";
import CustomButton from "@/components/CustomButton";
import CourseStepper from "./CourseStepper";
import { fetchCoachesDropdownAPI } from "@/store/feature/admin";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "@/components/Pagination/Pagination";
import {
  Plus,
  BookOpen,
  Clock,
  Users,
  Target,
  AlertCircle,
  Calendar,
  ChevronRight,
  Eye
} from "lucide-react";

const CourseList = () => {
  const location = useLocation();
  const {
    pageNo,
    pageSize,
    setPageNo,
    setPageSize
  } = usePagination(1, 6);

  const { coursesDetails, loading, error } = useCourseList(pageNo, pageSize);
  const courses = coursesDetails.courses || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { coachesList = [], coachesLoading = false } = useSelector(
    (state) => state.admin || {}
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useEffect(() => {
    if (location.state && location.state.mode === 'create') {
      handleAddCourse();
    }
  }, [location.state]);
  // Navigate to Course Details
  const handleCourseClick = (courseId) => navigate(`${courseId}`);

  // Open Add Course Drawer
  const handleAddCourse = () => {
    dispatch(fetchCoachesDropdownAPI());
    setIsDrawerOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Course Catalog
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and explore all available courses
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {coursesDetails.total_courses || 0}
              </span> courses total
            </div>
            <CustomButton
              onClick={handleAddCourse}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Course
            </CustomButton>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Fetching course data from the server
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-8 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
                  Failed to Load Courses
                </h3>
                <p className="text-red-600 dark:text-red-500">
                  {error.message || "An error occurred while loading courses"}
                </p>
                <CustomButton
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </CustomButton>
              </div>
            </div>
          </div>
        )}

        {/* Course Cards */}
        {!loading && !error && courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.course_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleCourseClick(course.course_id)}
                >
                  <div className="space-y-4">
                    {/* Course Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                            {course.domain_name || 'Course'}
                          </span>
                          {course.subdomain_name && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {course.subdomain_name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {course.course_name}
                          </h2>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>

                    {/* Course Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      {course.coach_name && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.coach_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(course.created_on)}</span>
                      </div>
                    </div>

                    {/* Target Audience */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Target Audience
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {course.target_audience}
                      </p>
                    </div>

                    {/* Course Description */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Course Overview
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                        {course.curriculum_description}
                      </p>
                    </div>

                    {/* Course Stats */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600 dark:text-gray-400">
                            Modules: <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {course.module_count || 0}
                            </span>
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            Videos: <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {course.video_count || 0}
                            </span>
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {course.course_id}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={pageNo}
                totalPages={coursesDetails.total_pages || 1}
                onPageChange={setPageNo}
                currentPageSize={pageSize} // Optional: current page size
                onPageSizeChange={setPageSize} // Optional: function to change page size
                pageSizeOptions={[5,10, 20, 50, 100]} // Options for page size
                showPageNumbers={true}
                showInfo={true}
                showPageSize={true} // Control visibility of page size selector
                size="medium"
              />
            </div>

            {/* Results Info */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Showing {courses.length} of {coursesDetails.total_records || 0} courses
            </div>
          </>
        ) : (
          !loading && !error && (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-800">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Courses Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Get started by creating your first course. Add content, videos, and curriculum to help users learn.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <CustomButton
                  onClick={handleAddCourse}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create First Course
                </CustomButton>
                <CustomButton
                  variant="outline"
                  onClick={() => navigate('/admin/coaches')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add Coaches First
                </CustomButton>
              </div>
            </div>
          )
        )}

        {/* Quick Stats */}
        {/* {!loading && !error && courses.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Course Catalog Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {coursesDetails.total_courses || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Courses
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {courses.reduce((sum, course) => sum + (course.module_count || 0), 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Modules
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {courses.reduce((sum, course) => sum + (course.video_count || 0), 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Videos
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {new Set(courses.map(course => course.coach_name).filter(Boolean)).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Coaches
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Drawer for Add Course */}
      <AnimatePresence>
        {isDrawerOpen && (
          <CustomDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            title="Create New Course"
            footer={null}
            width="800px"
          >
            <CourseStepper
              onClose={() => setIsDrawerOpen(false)}
              coaches={coachesList}
              coachesLoading={coachesLoading}
              course={null}
            />
          </CustomDrawer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseList;