import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Heart, Brain, Target, Sparkles, ArrowRight } from "lucide-react";
import { clearUserError } from "@/store/feature/user/userSlice";
import Footer from "@/components/footer/Footer";
import { motion } from "framer-motion";

function About() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const handleExploreClick = () => {
    dispatch(clearUserError());
    navigate("/categories");
  };

  // Theme colors
  const themeColors = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      text: "text-gray-100",
      mutedText: "text-gray-400",
      accent: "from-purple-600 to-pink-500",
      accentText: "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
      cardBg: "bg-gray-800/50 backdrop-blur-sm border border-gray-700",
      border: "border-gray-700"
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      text: "text-gray-900",
      mutedText: "text-gray-600",
      accent: "from-purple-500 to-pink-400",
      accentText: "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
      cardBg: "bg-white/70 backdrop-blur-sm border border-gray-200",
      border: "border-gray-200"
    }
  };

  const colors = themeColors[theme] || themeColors.light;

  const highlights = [
    {
      icon: Heart,
      title: "Heart",
      description: "We put compassion and care into everything we create. Every course is designed with your personal growth in mind.",
      color: "text-pink-500"
    },
    {
      icon: Brain,
      title: "Science",
      description: "Our programs are backed by research and proven strategies, ensuring results that last and transform your daily life.",
      color: "text-purple-500"
    },
    {
      icon: Target,
      title: "Results",
      description: "We measure success by the transformation in your life — empowering you to achieve mental clarity, focus, and purpose.",
      color: "text-teal-500"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  return (
    <>
      <div className={`min-h-screen transition-colors duration-300 ${colors.bg}`}>
        {/* Hero Section */}
        <motion.section
          className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div 
              className="flex justify-center mb-6"
              variants={itemVariants}
            >
              <motion.div
                className={`p-3 rounded-xl bg-gradient-to-r ${colors.accent}`}
                variants={iconVariants}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>

            <motion.h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${colors.text}`}
              variants={itemVariants}
            >
              <span className={colors.accentText}>Our Mission</span>
            </motion.h1>

            <motion.p
              className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${colors.mutedText}`}
              variants={itemVariants}
            >
              At{" "}
              <span className={`font-semibold ${colors.accentText}`}>
                BrahmaLYF
              </span>
              , we believe everyone has the power to grow, heal, and transform. Our
              platform connects you with world-class coaches and programs that empower you
              to reach your highest potential.
            </motion.p>
          </div>
        </motion.section>

        {/* Highlights Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Mobile: Simple fade in */}
            <div className="grid grid-cols-1 md:hidden gap-6">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl ${colors.cardBg}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className={`p-3 rounded-xl w-fit mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${colors.text}`}>
                    {item.title}
                  </h3>
                  <p className={`text-base leading-relaxed ${colors.mutedText}`}>
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Desktop: Cards stack then separate */}
            <div className="hidden md:block relative">
              <div className="grid grid-cols-3 gap-6 lg:gap-8">
                {highlights.map((item, index) => {
                  // Calculate initial position (all cards start at center position)
                  const centerIndex = 1;
                  const initialX = (centerIndex - index) * 100; // percentage
                  
                  return (
                    <motion.div
                      key={index}
                      className={`p-6 rounded-2xl ${colors.cardBg} col-span-1`}
                      initial={{
                        opacity: 0,
                        x: `${initialX}%`,
                        scale: 0.9,
                        zIndex: 3 - index,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        zIndex: 10,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + index * 0.15,
                        ease: [0.43, 0.13, 0.23, 0.96],
                      }}
                      viewport={{ once: true, amount: 0.2 }}
                      whileHover={{
                        scale: 1.05,
                        y: -8,
                        zIndex: 30,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <div className={`p-3 rounded-xl w-fit mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <h3 className={`text-xl font-bold mb-3 ${colors.text}`}>
                        {item.title}
                      </h3>
                      <p className={`text-base leading-relaxed ${colors.mutedText}`}>
                        {item.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <motion.section
          className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className={`text-3xl sm:text-4xl font-bold mb-6 ${colors.accentText}`}
              variants={itemVariants}
            >
              Why We Started BrahmaLYF
            </motion.h2>
            <motion.div
              className={`relative pl-6 sm:pl-8 border-l-2 ${theme === 'dark' ? 'border-purple-500' : 'border-purple-400'}`}
              variants={itemVariants}
            >
              <p className={`text-lg sm:text-xl leading-relaxed text-left ${colors.mutedText}`}>
                Our journey began with a vision — to create a safe space where people
                can discover life-changing insights and connect with mentors who truly
                care. We've helped thousands find their path, break through mental
                barriers, and live their fullest lives. And we're just getting
                started.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className={`p-8 sm:p-12 rounded-3xl ${colors.cardBg}`}
              variants={itemVariants}
            >
              <motion.h3
                className={`text-2xl sm:text-3xl font-semibold mb-6 ${colors.text}`}
                variants={itemVariants}
              >
                Ready to Begin Your Journey?
              </motion.h3>
              <motion.p
                className={`text-base sm:text-lg mb-8 ${colors.mutedText}`}
                variants={itemVariants}
              >
                Join thousands who have transformed their lives with BrahmaLYF
              </motion.p>
              <motion.button
                onClick={handleExploreClick}
                className={`px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r ${colors.accent} text-white rounded-full font-bold text-base sm:text-lg shadow-lg flex items-center gap-3 mx-auto group`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <span>Explore Our Courses</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* footer for mobile only */}
        <div className="block lg:hidden">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default About;