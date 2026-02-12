import React, { useEffect, useState } from "react";
import { LucideMail, UserCircle2, MessageCircle, Send, Sparkles } from 'lucide-react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { contactAPI } from "@/store/feature/user";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, message: "" });
    }
  }, [user]);

  // Theme colors
  const themeColors = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      text: "text-gray-100",
      mutedText: "text-gray-400",
      accent: "from-purple-600 to-pink-500",
      accentText: "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
      inputBg: "bg-gray-800/50 border-gray-700",
      placeholder: "placeholder-gray-500",
      disabledBg: "bg-gray-800/30",
      cardBg: "bg-gray-800/30 backdrop-blur-sm"
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      text: "text-gray-900",
      mutedText: "text-gray-600",
      accent: "from-purple-500 to-pink-400",
      accentText: "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
      inputBg: "bg-white border-gray-300",
      placeholder: "placeholder-gray-400",
      disabledBg: "bg-gray-100",
      cardBg: "bg-white/70 backdrop-blur-sm"
    }
  };

  const colors = themeColors[theme] || themeColors.light;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Submitting message...");

    dispatch(contactAPI(form))
      .then(() => {
        toast.update(toastId, {
          render: "Message sent successfully 🎉",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch(() => {
        toast.update(toastId, {
          render: "Failed to submit the message!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });

    setForm({ name: user?.name || "", email: user?.email || "", message: "" });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-300 ${colors.bg}`}>
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${colors.accent}`}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${colors.text}`}
          >
            <span className={colors.accentText}>Get In Touch</span>
          </motion.h1>

          <p className={`text-base sm:text-lg max-w-xl mx-auto ${colors.mutedText}`}>
            We're here to help! Whether you're a coach or a student, send us a message and we'll get back to you soon.
          </p>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className={`rounded-2xl p-6 sm:p-8 lg:p-10 ${colors.cardBg} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${colors.text}`}>
                  Your Name
                </label>
                <div className={`flex items-center rounded-xl ${colors.inputBg} border px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                  <UserCircle2 className={`w-5 h-5 ${colors.mutedText} mr-3`} />
                  <input
                    placeholder="Enter your name"
                    className={`w-full bg-transparent outline-none ${colors.text} ${colors.placeholder} ${user?.name ? 'cursor-not-allowed' : ''}`}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={!user?.name ? handleChange : undefined}
                    disabled={!!user?.name}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${colors.text}`}>
                  Email Address
                </label>
                <div className={`flex items-center rounded-xl ${colors.inputBg} border px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                  <LucideMail className={`w-5 h-5 ${colors.mutedText} mr-3`} />
                  <input
                    placeholder="Enter your email"
                    className={`w-full bg-transparent outline-none ${colors.text} ${colors.placeholder} ${user?.email ? 'cursor-not-allowed' : ''}`}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={!user?.email ? handleChange : undefined}
                    disabled={!!user?.email}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${colors.text}`}>
                Your Message
              </label>
              <div className={`relative rounded-xl ${colors.inputBg} border focus-within:ring-2 focus-within:ring-purple-500 transition-all`}>
                <MessageCircle className={`absolute left-4 top-4 w-5 h-5 ${colors.mutedText}`} />
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Tell us how we can help you..."
                  className={`w-full pl-12 pr-4 py-4 bg-transparent outline-none ${colors.text} ${colors.placeholder} rounded-xl resize-none`}
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full py-4 px-6 bg-gradient-to-r ${colors.accent} text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-3`}
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Contact Info */}
        <div className="mt-10 text-center">
          <p className={`text-sm ${colors.mutedText}`}>
            We typically respond within 24 hours. You can also reach us at{" "}
            <span className={`font-medium ${colors.accentText}`}>support@brahmayf.com</span>
          </p>
        </div>
      </motion.section>
    </div>
  );
}

export default Contact;