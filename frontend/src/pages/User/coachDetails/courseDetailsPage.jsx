import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Play,
  Star,
  GraduationCap,
  Target,
  BookOpen,
  Users,
  Quote,
  Clock,
  Calendar,
  CheckCircle,
  ChevronRight,
  Award,
  Shield,
  Bookmark,
  Share2,
} from "lucide-react";
import useCourseDetailsPage from "./useCourseDetailsPage";
import { useTheme } from "@/contexts/ThemeContext";
import { useYouTubeEmbedUrl } from "@/hooks/useYouTubeEmbedUrl";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const CourseDetailsPage = () => {
  const { videoId } = useParams();
  const {
    coach,
    course,
    loading,
    error,
    handleEnroll,
    enrolling,
    allCoursesFeedback,
  } = useCourseDetailsPage(videoId);

  const { theme } = useTheme(); // dark/light
  const [activeSection, setActiveSection] = useState("overview");

  const { getYouTubeEmbedUrl } = useYouTubeEmbedUrl({
    fallbackUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    addPlayerParams: false,
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Theme-based styles
  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#030712' : '#ffffff',
    color: theme === 'dark' ? '#f9fafb' : '#111827',
    transition: 'background-color 0.3s, color 0.3s'
  };

  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    color: theme === 'dark' ? '#f9fafb' : '#111827'
  };

  const textSecondaryStyle = {
    color: theme === 'dark' ? '#9ca3af' : '#6b7280'
  };

  const textPrimaryStyle = {
    color: theme === 'dark' ? '#f9fafb' : '#111827'
  };

  const buttonStyle = {
    background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
    color: '#ffffff'
  };

  const buttonHoverStyle = {
    background: 'linear-gradient(to right, #1d4ed8, #1e40af)'
  };

  // Course highlights
  const courseHighlights = [
    {
      icon: <Clock className="w-4 h-4" />,
      label: "Duration",
      value: course?.duration || "10h 30m",
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Access",
      value: "Lifetime",
    },
    {
      icon: <Award className="w-4 h-4" />,
      label: "Certificate",
      value: "Included",
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: "Skill Level",
      value: "All Levels",
    },
  ];

  if (loading) {
    return (
      <div style={containerStyle} className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-12 h-12 rounded-full border-4" style={{
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
              }}></div>
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-lg font-medium" style={textPrimaryStyle}>
              Loading course details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!coach || !course) {
    return (
      <div style={containerStyle} className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6' }}>
              <BookOpen className="w-8 h-8" style={{
                color: theme === 'dark' ? '#9ca3af' : '#6b7280'
              }} />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={textPrimaryStyle}>
              Course Not Found
            </h2>
            <p style={textSecondaryStyle}>
              The requested course could not be found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-6 relative">
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link
                to="/"
                style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563'
                }}
                className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-4 h-4" style={{
                color: theme === 'dark' ? '#9ca3af' : '#9ca3af'
              }} />
              <Link
                to="/courses"
                style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563'
                }}
                className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                Courses
              </Link>
              <ChevronRight className="w-4 h-4" style={{
                color: theme === 'dark' ? '#9ca3af' : '#9ca3af'
              }} />
              <span className="font-medium" style={{
                color: theme === 'dark' ? '#93c5fd' : '#1d4ed8'
              }}>
                {coach?.domain_name}
              </span>
              <ChevronRight className="w-4 h-4" style={{
                color: theme === 'dark' ? '#9ca3af' : '#9ca3af'
              }} />
              <span className="font-medium" style={textPrimaryStyle}>
                {coach?.subdomain_name}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Video & Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
                    backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : '#dbeafe',
                    color: theme === 'dark' ? '#93c5fd' : '#1e40af'
                  }}>
                    {coach?.subdomain_name}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={textPrimaryStyle}>
                  {course?.course_name}
                </h1>

                <p className="text-lg mb-6" style={{
                  color: theme === 'dark' ? '#d1d5db' : '#374151'
                }}>
                  {course?.curriculum_description}
                </p>
              </div>

              {/* Video Player */}
              {coach?.video_url && (
                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      className="w-full h-full"
                      src={getYouTubeEmbedUrl(coach.video_url)}
                      title={course?.course_name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Course Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {courseHighlights.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border shadow-sm"
                    style={cardStyle}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg" style={{
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6'
                      }}>
                        {React.cloneElement(item.icon, {
                          className: "w-4 h-4",
                          style: {
                            color: theme === 'dark' ? '#93c5fd' : '#2563eb'
                          }
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm" style={textSecondaryStyle}>
                        {item.label}
                      </p>
                      <p className="font-semibold" style={textPrimaryStyle}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Enrollment Card */}
            <div className="space-y-6">
              <div className="sticky top-6 rounded-2xl p-6 shadow-xl border"
                style={cardStyle}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={textPrimaryStyle}>
                    Enroll Now
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg transition-colors" style={{
                      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                      backgroundColor: theme === 'dark' ? 'transparent' : 'transparent'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg transition-colors" style={{
                      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                      backgroundColor: theme === 'dark' ? 'transparent' : 'transparent'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg border" style={{
                    borderColor: theme === 'dark' ? '#1e3a8a' : '#93c5fd',
                    backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe'
                  }}>
                    <Calendar className="w-5 h-5" style={{
                      color: theme === 'dark' ? '#93c5fd' : '#2563eb'
                    }} />
                    <div>
                      <p className="text-sm" style={{
                        color: theme === 'dark' ? '#93c5fd' : '#1d4ed8'
                      }}>
                        Created on
                      </p>
                      <p className="font-medium" style={{
                        color: theme === 'dark' ? '#bfdbfe' : '#1e40af'
                      }}>
                        {formatDate(course?.created_on)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                      <span className="text-sm" style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151'
                      }}>
                        Certificate of Completion
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                      <span className="text-sm" style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151'
                      }}>
                        Lifetime Access
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                      <span className="text-sm" style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151'
                      }}>
                        Mobile & Tablet Friendly
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-4 rounded-xl font-bold transition-all duration-300 text-white shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    if (!enrolling) e.currentTarget.style.background = buttonHoverStyle.background;
                  }}
                  onMouseLeave={(e) => {
                    if (!enrolling) e.currentTarget.style.background = buttonStyle.background;
                  }}
                >
                  {enrolling ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Enrolling...
                    </span>
                  ) : (
                    "Enroll Now"
                  )}
                </button>
              </div>

              {/* Coach Card */}
              <div className="rounded-2xl p-6 border shadow-sm"
                style={cardStyle}>
                <h3 className="text-lg font-bold mb-4" style={textPrimaryStyle}>
                  Meet Your Instructor
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full blur" style={{
                      background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                      opacity: theme === 'dark' ? 0.3 : 0.2
                    }}></div>
                    <img
                      src={`${BASE_URL}${coach?.profile_image}`}
                      alt={coach?.coach_name}
                      className="relative w-100 rounded-full object-cover border-2"
                      style={{
                        borderColor: theme === 'dark' ? '#111827' : '#ffffff'
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold" style={textPrimaryStyle}>
                      {coach?.coach_name}
                    </h4>
                    <p className="text-sm mb-1" style={{
                      color: theme === 'dark' ? '#93c5fd' : '#2563eb'
                    }}>
                      {coach?.professional_title}
                    </p>
                    <p className="text-xs line-clamp-2" style={textSecondaryStyle}>
                      {coach?.bio}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/coach/${coach?.coach_id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm transition-colors"
                  style={{
                    color: theme === 'dark' ? '#93c5fd' : '#2563eb'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme === 'dark' ? '#bfdbfe' : '#1e40af'}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme === 'dark' ? '#93c5fd' : '#2563eb'}
                >
                  View full profile
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details Sections */}
      <div className="max-w-7xl mx-auto px-4 pb-16 py-2">
        {/* Navigation Tabs */}
        <div className="mb-8 py-4 w-full">
          <div
            className="grid grid-cols-2 sm:grid-cols-4 border-b"
            style={{
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
            }}
          >
            {[
              "overview",
              "target-audience",
              "learning-outcomes",
              "curriculum",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                className={`
          px-2 sm:px-4 lg:px-6 
          py-3 sm:py-3.5 
          font-medium text-xs sm:text-sm lg:text-base
          transition-all duration-200
          flex items-center justify-center text-center
          ${activeSection === tab
                    ? "border-b-2 shadow-sm"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
        `}
                style={
                  activeSection === tab
                    ? {
                      color: theme === 'dark' ? '#93c5fd' : '#2563eb',
                      borderColor: theme === 'dark' ? '#93c5fd' : '#2563eb',
                      backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff'
                    }
                    : {
                      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                      backgroundColor: 'transparent'
                    }
                }
                onMouseEnter={(e) => {
                  if (activeSection !== tab) {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
                    e.currentTarget.style.color = theme === 'dark' ? '#e5e7eb' : '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== tab) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme === 'dark' ? '#9ca3af' : '#6b7280';
                  }
                }}
              >
                {tab === "target-audience" ? (
                  <>
                    <span className="hidden sm:inline">Target Audience</span>
                    <span className="inline sm:hidden">Audience</span>
                  </>
                ) : tab === "learning-outcomes" ? (
                  <>
                    <span className="hidden sm:inline">Learning Outcomes</span>
                    <span className="inline sm:hidden">Outcomes</span>
                  </>
                ) : (
                  tab.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeSection === "overview" && (
              <div className="rounded-2xl p-6 border shadow-sm"
                style={cardStyle}>
                <h2 className="text-2xl font-bold mb-4" style={textPrimaryStyle}>
                  Course Overview
                </h2>
                <p className="leading-relaxed" style={{
                  color: theme === 'dark' ? '#d1d5db' : '#374151'
                }}>
                  {course?.curriculum_description}
                </p>
              </div>
            )}

            {activeSection === "target-audience" && (
              <div className="rounded-2xl p-6 border shadow-sm"
                style={cardStyle}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : '#dbeafe'
                  }}>
                    <Users className="w-6 h-6" style={{
                      color: theme === 'dark' ? '#93c5fd' : '#2563eb'
                    }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={textPrimaryStyle}>
                      Who This Course Is For
                    </h2>
                    <p style={textSecondaryStyle}>
                      Perfect for individuals looking to develop essential
                      skills
                    </p>
                  </div>
                </div>

                <p className="leading-relaxed whitespace-pre-line" style={{
                  color: theme === 'dark' ? '#d1d5db' : '#374151'
                }}>
                  {course?.target_audience}
                </p>
              </div>
            )}

            {activeSection === "learning-outcomes" && (
              <div className="rounded-2xl p-6 border shadow-sm"
                style={cardStyle}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : '#d1fae5'
                  }}>
                    <Target className="w-6 h-6" style={{
                      color: theme === 'dark' ? '#86efac' : '#10b981'
                    }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={textPrimaryStyle}>
                      What You'll Learn
                    </h2>
                    <p style={textSecondaryStyle}>
                      Key skills and knowledge you'll gain from this course
                    </p>
                  </div>
                </div>

                <p className="leading-relaxed whitespace-pre-line" style={{
                  color: theme === 'dark' ? '#d1d5db' : '#374151'
                }}>
                  {course?.learning_outcomes}
                </p>
              </div>
            )}

            {activeSection === "curriculum" && (
              <div className="rounded-2xl p-6 border shadow-sm"
                style={cardStyle}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.3)' : '#f3e8ff'
                  }}>
                    <BookOpen className="w-6 h-6" style={{
                      color: theme === 'dark' ? '#d8b4fe' : '#9333ea'
                    }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={textPrimaryStyle}>
                      Course Curriculum
                    </h2>
                    <p style={textSecondaryStyle}>
                      Detailed breakdown of course content
                    </p>
                  </div>
                </div>

                <p className="leading-relaxed whitespace-pre-line" style={{
                  color: theme === 'dark' ? '#d1d5db' : '#374151'
                }}>
                  {course?.curriculum_description}
                </p>
              </div>
            )}

            {/* Student Reviews */}
            {allCoursesFeedback && allCoursesFeedback.length > 0 && (
              <div className="rounded-2xl p-6 mt-8 border shadow-sm"
                style={cardStyle}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    backgroundColor: theme === 'dark' ? 'rgba(250, 204, 21, 0.3)' : '#fef3c7'
                  }}>
                    <Quote className="w-6 h-6" style={{
                      color: theme === 'dark' ? '#fde047' : '#eab308'
                    }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={textPrimaryStyle}>
                      Student Reviews
                    </h2>
                    <p style={textSecondaryStyle}>
                      What our students say about this course
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {allCoursesFeedback.map((feedback, index) => (
                    <div
                      key={feedback.feedback_id || index}
                      className="p-5 rounded-xl border hover:shadow-md transition-shadow"
                      style={{
                        backgroundColor: cardStyle.backgroundColor,
                        borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = theme === 'dark'
                          ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                          : '0 4px 6px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4"
                            style={{
                              fill: i < feedback.rating
                                ? '#fbbf24'
                                : theme === 'dark' ? '#4b5563' : '#d1d5db',
                              color: i < feedback.rating
                                ? '#fbbf24'
                                : theme === 'dark' ? '#4b5563' : '#d1d5db'
                            }}
                          />
                        ))}
                        <span className="text-sm font-medium ml-2" style={{
                          color: theme === 'dark' ? '#d1d5db' : '#374151'
                        }}>
                          {feedback.rating}.0
                        </span>
                      </div>

                      <p className="mb-4 italic" style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151'
                      }}>
                        "{feedback.comments}"
                      </p>

                      <div className="flex items-center gap-3">
                        <img
                          src={`${BASE_URL}${feedback.profile_picture_url}`}
                          alt={feedback.user_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium" style={textPrimaryStyle}>
                            {feedback.user_name}
                          </p>
                          <p className="text-sm" style={textSecondaryStyle}>
                            {formatDate(feedback.created_on)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Course Stats */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6 border shadow-sm"
              style={cardStyle}>
              <h3 className="text-lg font-bold mb-4" style={textPrimaryStyle}>
                Course Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b" style={{
                  borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
                }}>
                  <span style={textSecondaryStyle}>Domain</span>
                  <span className="font-medium" style={textPrimaryStyle}>
                    {coach?.domain_name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" style={{
                  borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
                }}>
                  <span style={textSecondaryStyle}>Subdomain</span>
                  <span className="font-medium" style={textPrimaryStyle}>
                    {coach?.subdomain_name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" style={{
                  borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
                }}>
                  <span style={textSecondaryStyle}>Duration</span>
                  <span className="font-medium" style={textPrimaryStyle}>
                    {course?.duration}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span style={textSecondaryStyle}>Last Updated</span>
                  <span className="font-medium" style={textPrimaryStyle}>
                    {formatDate(course?.created_on)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-12 border-t" style={{
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb'
      }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={textPrimaryStyle}>
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg mb-8" style={{
            color: theme === 'dark' ? '#d1d5db' : '#374151'
          }}>
            Join thousands of students who have transformed their skills with
            this course
          </p>
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="px-8 py-4 rounded-xl font-bold transition-all duration-300 text-white shadow-lg hover:shadow-xl text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            style={buttonStyle}
            onMouseEnter={(e) => {
              if (!enrolling) e.currentTarget.style.background = buttonHoverStyle.background;
            }}
            onMouseLeave={(e) => {
              if (!enrolling) e.currentTarget.style.background = buttonStyle.background;
            }}
          >
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;