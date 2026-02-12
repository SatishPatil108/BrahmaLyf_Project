import React from "react";
import { useAdminDashboard } from "./useAdminDashboard";
import {
  Users,
  BookOpen,
  UserCheck,
  Activity,
  TrendingUp,
  LogOut,
  Code,
  Star,
  LayoutDashboard,
  Calendar,
  Target,
  BarChart3,
  ArrowUpRight,
  Eye,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserCountGraph from "./UserCountGraph";
import CustomButton from "@/components/CustomButton";

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, onClick }) => {
  const Card = (
    <div className={`
      bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800
      transition-all duration-300 hover:shadow-lg
      ${onClick ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700' : ''}
      flex flex-col justify-between h-full
    `}>
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color.bg} dark:${color.darkBg} flex items-center justify-center`}>
          <Icon size={24} className={color.icon} />
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${trend.value > 0
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
            <ArrowUpRight className={`w-3 h-3 ${trend.value > 0 ? '' : 'rotate-90'}`} />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {value ?? 0}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        {onClick && (
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {Card}
      </button>
    );
  }

  return Card;
};


function AdminDashboard() {
  const { user, handleLogout, dashboardData, loading, error } = useAdminDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-500 mb-4"></div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Loading dashboard data...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Preparing your analytics and statistics
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Failed to Load Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
          {error.message || "An error occurred while loading dashboard data"}
        </p>
        <CustomButton
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Retry
        </CustomButton>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: dashboardData?.total_users,
      icon: Users,
      color: {
        icon: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100",
        darkBg: "bg-blue-900/20"
      },
      trend: { value: 12, label: "vs last month" },
      subtitle: "Registered users"
    },
    {
      title: "Active Users",
      value: dashboardData?.active_users_month,
      icon: Activity,
      color: {
        icon: "text-green-600 dark:text-green-400",
        bg: "bg-green-100",
        darkBg: "bg-green-900/20"
      },
      trend: { value: 8, label: "currently online" },
      subtitle: "This month"
    },
    {
      title: "New Signups",
      value: dashboardData?.new_signups_week,
      icon: TrendingUp,
      color: {
        icon: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100",
        darkBg: "bg-amber-900/20"
      },
      trend: { value: 24, label: "vs last week" },
      subtitle: "Past 7 days"
    },
    {
      title: "Total Courses",
      value: dashboardData?.total_courses,
      icon: BookOpen,
      color: {
        icon: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100",
        darkBg: "bg-purple-900/20"
      },
      onClick: () => navigate("/admin/courses"),
      subtitle: "Published courses"
    },
    {
      title: "Registered Coaches",
      value: dashboardData?.total_coaches,
      icon: UserCheck,
      color: {
        icon: "text-pink-600 dark:text-pink-400",
        bg: "bg-pink-100",
        darkBg: "bg-pink-900/20"
      },
      onClick: () => navigate("/admin/coaches"),
      subtitle: "Active coaches"
    },
    {
      title: "Total Domains",
      value: dashboardData?.total_domains,
      icon: Code,
      color: {
        icon: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-100",
        darkBg: "bg-gray-900/20"
      },
      onClick: () => navigate("/admin/domains"),
      subtitle: "Learning domains"
    },
  ];

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Welcome back, {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <span className="font-semibold text-white">
                    {(user?.name || "A").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Stats Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Key metrics and statistics at a glance
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: Just now
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {statCards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>
        </section>

        {/* Charts & Top Courses Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <UserCountGraph />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Platform Health
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    System performance metrics
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">99.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">248ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Active Sessions</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">API Requests</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">1.2k/min</span>
                </div>
              </div>
            </div> */}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <CustomButton
                  onClick={() => navigate("/admin/courses", { state: { mode: 'create' } })}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Create New Course
                </CustomButton>
                <CustomButton
                  onClick={() => navigate("/admin/coaches", { state: { mode: 'create' } })}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Add New Coach
                </CustomButton>
                {/* <CustomButton
                  onClick={() => navigate("/admin/users")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </CustomButton> */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Courses Section */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Top Performing Courses
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on enrollment and engagement metrics
              </p>
            </div>
            <CustomButton
              onClick={() => navigate("/admin/courses")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View All Courses
            </CustomButton>
          </div>

          {dashboardData?.top_courses?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.top_courses.map((course, index) => (
                <div
                  key={course.course_id}
                  onClick={() => navigate(`/admin/courses/${course.course_id}`)}
                  className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {course.course_name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {course.domain_name || 'General'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Enrollments</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {course.total_enrollments}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {course.completion_rate || '68%'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Avg Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {course.avg_rating || '4.8'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-500">
                        Coach: {course.coach_name || 'N/A'}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Course Data Available
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Course performance metrics will appear here
              </p>
              <CustomButton
                onClick={() => navigate("/admin/courses")}
                variant="outline"
              >
                Browse Courses
              </CustomButton>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;