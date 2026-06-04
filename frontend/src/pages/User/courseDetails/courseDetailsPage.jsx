import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  Calendar,
  Award,
  Shield,
  ChevronRight,
  BookOpen,
  Users,
  Target,
  Eye,
  Wrench,
  List,
  Quote,
  Home,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "@/contexts/ThemeContext";
import { useYouTubeEmbedUrl } from "@/hooks/useYouTubeEmbedUrl";
import useCourseDetailsPage from "./useCourseDetailsPage";

import {
  fetchShowPracticeQuestionsAPI,
  fetchShowToolsQuestionsAPI,
} from "@/store/feature/user";

import { clearUserError } from "@/store/feature/user/userSlice";
import ToolsForm from "./ToolsForm";
import TasksForm from "./TasksForm";

import { getThemeStyles } from "@/components/GetThemeStyles/themeStyles";
import {
  staggerContainer,
  scaleOnHover,
} from "@/components/Animations/animations";

import useScrollSpy from "@/hooks/useScrollSpy";
import useToast from "@/hooks/useToast";
import useGridPatternStyles from "@/hooks/useGridPatternStyles";

import TabsNavigation from "@/components/TabsNavigation/TabsNavigation";
import EnrollmentCard from "./EnrollmentCard";
import CourseDetailsSidebar from "./CourseDetailsSidebar";
import {
  SectionHeader,
  StatCard,
  ReviewCard,
  ProseSection,
  CourseDetailsSkeleton,
} from "./CourseUIPrimitives";
import useShowPracticeDetails from "./useShowPracticeDetails";

// ─── Static data (defined outside component to avoid re-creation) ─────────────

const TABS = [
  { id: "overview", label: "Overview", icon: <Eye className="w-4 h-4" /> },
  {
    id: "target-audience",
    label: "Target Audience",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "learning-outcomes",
    label: "Learning Outcomes",
    icon: <Target className="w-4 h-4" />,
  },
  {
    id: "curriculum",
    label: "Curriculum",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "todays-practice",
    label: "Today's Practice",
    icon: <Wrench className="w-4 h-4" />,
  },
  {
    id: "todays-tools",
    label: "Today's Tools",
    icon: <List className="w-4 h-4" />,
  },
];

const COURSE_HIGHLIGHTS = (duration) => [
  {
    icon: <Clock className="w-5 h-5" />,
    label: "Duration",
    value: duration ?? "10h 30m",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    label: "Access",
    value: "Lifetime",
  },
  {
    icon: <Award className="w-5 h-5" />,
    label: "Certificate",
    value: "Included",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    label: "Skill Level",
    value: "All Levels",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const CourseDetailsPage = () => {
  const { videoId, subdomain_name, courseId } = useParams();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const weekNo = 1;

  // Inject global grid-pattern CSS once
  useGridPatternStyles();

  // Memoised theme styles – only recomputed when theme changes
  const styles = useMemo(() => getThemeStyles(theme), [theme]);

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    coach,
    course,
    loading,
    error,
    handleEnroll,
    enrolling,
    allCoursesFeedback,
  } = useCourseDetailsPage(videoId);

  const { taskQuestions, toolQuestions } = useShowPracticeDetails(
    courseId,
    weekNo,
  );

  // ── Toast ─────────────────────────────────────────────────────────────────
  const { toast, showToast } = useToast();

  // ── Scroll spy ────────────────────────────────────────────────────────────
  const sectionsRef = useRef({});
  const [activeSection, setActiveSection] = useScrollSpy(TABS, sectionsRef);

  const scrollToSection = useCallback(
    (sectionId) => {
      setActiveSection(sectionId);
      const el = sectionsRef.current[sectionId];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [setActiveSection],
  );

  // ── Navigation helpers ────────────────────────────────────────────────────
  const clearAndGo = useCallback(
    (fn) => () => {
      dispatch(clearUserError());
      fn();
    },
    [dispatch],
  );
  const handleHome = clearAndGo(() => navigate("/"));
  const handleCategories = clearAndGo(() => navigate("/categories"));
  const handleDomain = clearAndGo(() => navigate(-2));
  const handleBack = clearAndGo(() => navigate(-1));

  // ── Misc ──────────────────────────────────────────────────────────────────
  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const { getYouTubeEmbedUrl } = useYouTubeEmbedUrl({
    fallbackUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    addPlayerParams: false,
  });

  const subdomainName = subdomain_name ?? coach?.subdomain_name ?? "";

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading) return <CourseDetailsSkeleton />;

  if (error || !coach || !course) {
    return (
      <div
        className={`min-h-screen ${styles.pageBg} flex items-center justify-center`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${styles.statIconBg}`}
          >
            <BookOpen className={`w-10 h-10 ${styles.textMuted}`} />
          </div>
          <h2 className={`text-2xl font-bold ${styles.textPrimary} mb-2`}>
            Course Not Found
          </h2>
          <p className={styles.textSecondary}>
            The requested course could not be found. Please check the URL or
            browse our other courses.
          </p>
          <Link
            to="/courses"
            className={`inline-flex items-center gap-2 mt-6 px-6 py-3 ${styles.ctaButton} text-white font-semibold rounded-xl transition-all duration-300`}
          >
            Browse Courses
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${styles.pageBg}`}>
      {/* Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-lg"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className={`relative overflow-hidden ${styles.heroBg}`}>
        <div className={`absolute inset-0 ${styles.heroGrid} opacity-30`} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm flex-wrap list-none p-0 m-0">
              {[
                {
                  label: <Home className="w-4 h-4" />,
                  onClick: handleHome,
                  ariaLabel: "Home",
                },
                {
                  label: "Categories",
                  onClick: handleCategories,
                  ariaLabel: "Categories",
                },
                {
                  label: coach?.domain_name,
                  onClick: handleDomain,
                  ariaLabel: coach?.domain_name,
                },
                {
                  label: subdomainName,
                  onClick: handleBack,
                  ariaLabel: subdomainName,
                },
              ].map(({ label, onClick, ariaLabel }, idx) => (
                <React.Fragment key={ariaLabel}>
                  {idx > 0 && (
                    <li aria-hidden="true">
                      <ChevronRight
                        className={`w-3 h-3 ${styles.breadcrumbChevron}`}
                      />
                    </li>
                  )}
                  <li>
                    <motion.button
                      whileHover={{ x: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClick}
                      aria-label={
                        typeof ariaLabel === "string" ? ariaLabel : undefined
                      }
                      className={`transition-colors duration-200 ${styles.breadcrumbBase}`}
                    >
                      {label}
                    </motion.button>
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${styles.textPrimary}`}
              >
                {course.course_name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ProseSection
                  html={course.curriculum_description}
                  styles={styles}
                />
              </motion.div>

              {coach.video_url && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl bg-black"
                >
                  <div className="relative aspect-video">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={getYouTubeEmbedUrl(coach.video_url)}
                      title={course.course_name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              )}

              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {COURSE_HIGHLIGHTS(course.duration).map((h, i) => (
                  <StatCard key={i} {...h} styles={styles} />
                ))}
              </motion.div>
            </div>

            {/* Right column – enrolment card */}
            <EnrollmentCard
              course={course}
              enrolling={enrolling}
              onEnroll={handleEnroll}
              formatDate={formatDate}
              showToast={showToast}
              styles={styles}
            />
          </div>
        </div>
      </section>

      {/* ── Sticky tabs ───────────────────────────────────────────────────── */}
      <TabsNavigation
        tabs={TABS}
        activeSection={activeSection}
        onTabClick={scrollToSection}
        theme={theme}
        styles={styles}
      />

      {/* ── Content sections ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {/* Helper to wrap each section consistently */}
            {[
              {
                id: "overview",
                header: {
                  icon: <Eye className="w-6 h-6" />,
                  title: "Course Overview",
                  subtitle: "Everything you need to know about this course",
                  bg: styles.sectionHeaderBg.overview,
                  ic: styles.sectionHeaderIcon.overview,
                },
                content: (
                  <ProseSection
                    html={course.curriculum_description}
                    styles={styles}
                  />
                ),
              },
              {
                id: "target-audience",
                header: {
                  icon: <Users className="w-6 h-6" />,
                  title: "Who This Course Is For",
                  subtitle:
                    "Perfect for individuals looking to develop essential skills",
                  bg: styles.sectionHeaderBg.audience,
                  ic: styles.sectionHeaderIcon.audience,
                },
                content: (
                  <ProseSection html={course.target_audience} styles={styles} />
                ),
              },
              {
                id: "learning-outcomes",
                header: {
                  icon: <Target className="w-6 h-6" />,
                  title: "What You'll Learn",
                  subtitle: "Key skills and knowledge you'll gain",
                  bg: styles.sectionHeaderBg.outcomes,
                  ic: styles.sectionHeaderIcon.outcomes,
                },
                content: (
                  <ProseSection
                    html={course.learning_outcomes}
                    styles={styles}
                  />
                ),
              },
              {
                id: "curriculum",
                header: {
                  icon: <BookOpen className="w-6 h-6" />,
                  title: "Course Curriculum",
                  subtitle: "Detailed breakdown of course content",
                  bg: styles.sectionHeaderBg.curriculum,
                  ic: styles.sectionHeaderIcon.curriculum,
                },
                content: (
                  <ProseSection
                    html={course.curriculum_description}
                    styles={styles}
                  />
                ),
              },
              {
                id: "todays-practice",
                header: {
                  icon: <Wrench className="w-6 h-6" />,
                  title: "Practice & Resources",
                  subtitle: "Hands-on exercises to reinforce your learning",
                  bg: styles.sectionHeaderBg.practice,
                  ic: styles.sectionHeaderIcon.practice,
                },
                content: (
                  <TasksForm
                    courseId={courseId}
                    weekNo={weekNo}
                    taskQuestions={taskQuestions}
                  />
                ),
              },
              {
                id: "todays-tools",
                header: {
                  icon: <List className="w-6 h-6" />,
                  title: "Tools & Resources",
                  subtitle: "Essential tools and software for this course",
                  bg: styles.sectionHeaderBg.tools,
                  ic: styles.sectionHeaderIcon.tools,
                },
                content: (
                  <ToolsForm
                    courseId={courseId}
                    weekNo={weekNo}
                    toolQuestions={toolQuestions}
                  />
                ),
              },
            ].map(({ id, header, content }) => (
              <section
                key={id}
                ref={(el) => (sectionsRef.current[id] = el)}
                id={`section-${id}`}
                role="tabpanel"
                aria-labelledby={id}
                className="scroll-mt-24"
              >
                <div
                  className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-6 md:p-8 transition-all duration-300 ${styles.cardHover}`}
                >
                  <SectionHeader
                    icon={header.icon}
                    title={header.title}
                    subtitle={header.subtitle}
                    iconBgClass={header.bg}
                    iconColorClass={header.ic}
                    styles={styles}
                  />
                  {content}
                </div>
              </section>
            ))}

            {/* Reviews */}
            {allCoursesFeedback?.length > 0 && (
              <section className="scroll-mt-24">
                <div
                  className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-6 md:p-8 transition-all duration-300 ${styles.cardHover}`}
                >
                  <SectionHeader
                    icon={<Quote className="w-6 h-6" />}
                    title="Student Reviews"
                    subtitle={`${allCoursesFeedback.length} ${allCoursesFeedback.length === 1 ? "review" : "reviews"} from our students`}
                    iconBgClass={styles.sectionHeaderBg.reviews}
                    iconColorClass={styles.sectionHeaderIcon.reviews}
                    styles={styles}
                  />
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {allCoursesFeedback.map((fb, idx) => (
                      <ReviewCard
                        key={fb.feedback_id ?? idx}
                        feedback={fb}
                        formatDate={formatDate}
                        styles={styles}
                      />
                    ))}
                  </motion.div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside aria-label="Course details">
            <CourseDetailsSidebar
              coach={coach}
              course={course}
              formatDate={formatDate}
              styles={styles}
            />
          </aside>
        </div>
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        aria-label="Enroll call to action"
        className={`relative overflow-hidden ${styles.bottomCtaBg} mt-12`}
      >
        <div
          className={`absolute inset-0 ${styles.heroGrid} opacity-10`}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Ready to Start Your Learning Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-indigo-100 mb-8"
          >
            Join thousands of students who have transformed their skills with
            this course
          </motion.p>
          <motion.button
            {...scaleOnHover}
            onClick={handleEnroll}
            disabled={enrolling}
            aria-busy={enrolling}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="relative z-10">
              {enrolling ? (
                <>
                  <span
                    aria-hidden="true"
                    className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin inline-block mr-2"
                  />
                  Enrolling…
                </>
              ) : (
                <>
                  Enroll Now
                  <ChevronRight
                    aria-hidden="true"
                    className="w-5 h-5 inline-block ml-2 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </>
              )}
            </span>
            {!enrolling && (
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
            )}
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default CourseDetailsPage;
