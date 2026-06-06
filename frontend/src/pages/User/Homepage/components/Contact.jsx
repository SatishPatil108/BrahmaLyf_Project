import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { contactAPI } from "@/store/feature/user";
import { toast } from "react-toastify";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { Icon, Mail, SendHorizonal, User, Verified } from "lucide-react";

/* ─── utils ────────────────────────────────────────────────────────────── */
const cls = (...c) => c.filter(Boolean).join(" ");

/* ─── trust signals data ──────────────────────────────────────────────── */
const TRUST_SIGNALS = [
  { icon: "Clock", label: "Reply within 24 hours", color: "purple" },
  { icon: "Shield", label: "Your data stays private", color: "emerald" },
  { icon: "Sparkles", label: "No spam, ever", color: "purple" },
];

/* ─── field component ─────────────────────────────────────────────────── */
const Field = React.memo(({ label, id, error, children, required }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cls(
          "text-xs font-semibold tracking-wide uppercase transition-colors duration-200",
          isDark ? "text-gray-400" : "text-gray-500",
        )}
      >
        {label}
        {required && <span className="text-purple-500 ml-0.5">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

/* ─── input wrapper ───────────────────────────────────────────────────── */
const InputWrapper = React.memo(({ children, error, disabled }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={cls(
        "relative flex items-center rounded-xl transition-all duration-200",
        error
          ? "ring-2 ring-red-500/40 border-red-500/40"
          : disabled
            ? "opacity-60 cursor-not-allowed"
            : "focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500/40 hover:border-gray-400 dark:hover:border-gray-600",
        isDark
          ? "bg-gray-900/40 border border-gray-700"
          : "bg-white border border-gray-200 shadow-sm",
        disabled && (isDark ? "bg-gray-800/20" : "bg-gray-50"),
      )}
    >
      {children}
    </div>
  );
});

/* ─── spinner component ───────────────────────────────────────────────── */
const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeOpacity="0.25"
      strokeWidth="2"
    />
    <path
      d="M8 2a6 6 0 016 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* ─── success state ───────────────────────────────────────────────────── */
const SuccessState = React.memo(({ isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center justify-center gap-6 py-12 text-center"
    role="status"
    aria-live="polite"
  >
    <div
      className={cls(
        "w-20 h-20 rounded-2xl flex items-center justify-center",
        isDark
          ? "bg-gradient-to-br from-purple-500/20 to-orange-500/20 text-purple-400"
          : "bg-gradient-to-br from-purple-100 to-orange-100 text-purple-600",
      )}
    >
      <Icons.Check />
    </div>
    <div className="space-y-2">
      <h3
        className={cls(
          "text-2xl font-bold",
          isDark ? "text-white" : "text-gray-900",
        )}
      >
        Message received ✨
      </h3>
      <p
        className={cls(
          "text-sm max-w-xs",
          isDark ? "text-gray-400" : "text-gray-600",
        )}
      >
        Thanks for reaching out! Our team will get back to you within 24 hours.
      </p>
    </div>
  </motion.div>
));

/* ─── CSS animation for gradient ──────────────────────────────────────── */
const gradientAnimationStyle = `
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .animate-gradient {
    background-size: 200% auto;
    animation: gradientShift 3s ease infinite;
  }
`;

/* ─── main component ──────────────────────────────────────────────────── */
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [touched, setTouched] = useState({});
  const { user } = useSelector((s) => s.auth);
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isDark = theme === "dark";

  // Inject CSS animation
  useEffect(() => {
    const styleId = "gradient-animation";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = gradientAnimationStyle;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  // Pre-fill from user
  useEffect(() => {
    if (user && status === "idle") {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user, status]);

  // Real-time validation
  const validateField = useCallback((name, value) => {
    switch (name) {
      case "name":
        return !value.trim() ? "Name is required" : null;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email";
        return null;
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10)
          return "Message must be at least 10 characters";
        if (value.trim().length > 500)
          return "Message cannot exceed 500 characters";
        return null;
      default:
        return null;
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  }, [form, validateField]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    setStatus("loading");
    const toastId = toast.loading("Sending your message...");

    try {
      await dispatch(contactAPI(form));
      toast.update(toastId, {
        render: "Message sent — we'll be in touch soon!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      setStatus("success");
      setForm((prev) => ({ ...prev, message: "" }));
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      toast.update(toastId, {
        render: error?.message || "Something went wrong. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      setStatus("idle");
    }
  };

  const inputBase = cls(
    "w-full bg-transparent px-4 py-3 text-[15px] outline-none transition-colors duration-200",
    isDark
      ? "text-white placeholder:text-gray-600"
      : "text-gray-900 placeholder:text-gray-400",
    "disabled:cursor-not-allowed",
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div
      className={cls(
        "min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 transition-colors duration-300",
        isDark
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50",
      )}
    >
      <motion.div
        ref={sectionRef}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="w-full max-w-6xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* LEFT COLUMN - Context */}
          <motion.div
            variants={itemVariants}
            className="lg:sticky lg:top-24 space-y-8"
          >
            {/* Badge */}
            <div>
              <span
                className={cls(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border",
                  isDark
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                    : "bg-purple-100 border-purple-300 text-purple-700",
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                We're listening
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                <span className={isDark ? "text-white" : "text-gray-900"}>
                  Let's start a
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-500 to-pink-500  bg-clip-text text-transparent">
                  conversation
                </span>
              </h1>
              <p
                className={cls(
                  "text-base leading-relaxed",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                Whether you're scaling your business or seeking guidance — we're
                here to help you succeed.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px w-16 bg-gradient-to-r from-purple-500/50 to-transparent" />

            {/* Trust Signals */}
            <div className="space-y-4">
              <h3
                className={cls(
                  "text-xs font-semibold uppercase tracking-wider",
                  isDark ? "text-gray-500" : "text-gray-400",
                )}
              >
                Why choose us
              </h3>
              <div className="grid gap-3">
                {TRUST_SIGNALS.map((signal, idx) => {
                  return (
                    <motion.div
                      key={signal.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 group cursor-default"
                    >
                      <div
                        className={cls(
                          "p-2 rounded-lg transition-all duration-300 group-hover:scale-105",
                          isDark
                            ? "bg-gray-800 text-purple-400 group-hover:bg-gray-700"
                            : "bg-gray-100 text-purple-600 group-hover:bg-gray-200",
                        )}
                      >
                      </div>
                      <span
                        className={cls(
                          "text-sm",
                          isDark ? "text-gray-300" : "text-gray-700",
                        )}
                      >
                        {signal.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-16 bg-gradient-to-r from-purple-500/50 to-transparent" />

            {/* Direct Contact */}
            <div className="space-y-3">
              <h3
                className={cls(
                  "text-xs font-semibold uppercase tracking-wider",
                  isDark ? "text-gray-500" : "text-gray-400",
                )}
              >
                Or reach us directly
              </h3>
              <a
                href="mailto:support@brahmayf.com"
                className="group inline-flex items-center gap-3 text-sm transition-all duration-200 hover:translate-x-1"
              >
                <div
                  className={cls(
                    "p-2 rounded-lg transition-all duration-200",
                    isDark
                      ? "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-purple-400"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-purple-600",
                  )}
                >
                  <Mail />
                </div>
                <span
                  className={cls(isDark ? "text-gray-300" : "text-gray-700")}
                >
                  support@brahmayf.com
                </span>
              </a>
            </div>
          </motion.div>

          {/* RIGHT COLUMN - Form */}
          <motion.div variants={itemVariants}>
            <div
              className={cls(
                "rounded-2xl p-6 sm:p-8 transition-all duration-300",
                isDark
                  ? "bg-gray-900/80 backdrop-blur-sm border border-gray-800 shadow-2xl"
                  : "bg-white border border-gray-200 shadow-xl",
              )}
            >
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <SuccessState isDark={isDark} />
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name Field */}
                      <Field
                        label="Your name"
                        id="name"
                        error={errors.name}
                        required
                      >
                        <InputWrapper
                          disabled={!!user?.name}
                          error={errors.name}
                        >
                          <span className="pl-4 text-gray-400">
                            <User />
                          </span>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={!!user?.name}
                            className={inputBase}
                            required
                            aria-invalid={!!errors.name}
                          />
                          {user?.name && (
                            <span
                              className="pr-3 text-purple-500"
                              title="Pre-filled from your account"
                            >
                              <Verified />
                            </span>
                          )}
                        </InputWrapper>
                      </Field>

                      {/* Email Field */}
                      <Field
                        label="Email address"
                        id="email"
                        error={errors.email}
                        required
                      >
                        <InputWrapper
                          disabled={!!user?.email}
                          error={errors.email}
                        >
                          <span className="pl-4 text-gray-400">
                            <Mail />
                          </span>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="hello@company.com"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={!!user?.email}
                            className={inputBase}
                            required
                            aria-invalid={!!errors.email}
                          />
                          {user?.email && (
                            <span
                              className="pr-3 text-purple-500"
                              title="Pre-filled from your account"
                            >
                              <Verified />
                            </span>
                          )}
                        </InputWrapper>
                      </Field>
                    </div>

                    {/* Message Field */}
                    <Field
                      label="Message"
                      id="message"
                      error={errors.message}
                      required
                    >
                      <div
                        className={cls(
                          "relative rounded-xl transition-all duration-200",
                          errors.message
                            ? "ring-2 ring-red-500/40 border-red-500/40"
                            : "focus-within:ring-2 focus-within:ring-purple-500/20",
                          isDark
                            ? "bg-gray-900/40 border border-gray-700"
                            : "bg-white border border-gray-200",
                        )}
                      >
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          placeholder="Tell us what you're working on, what questions you have, or how we can support you..."
                          value={form.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={cls(inputBase, "resize-none")}
                          required
                          aria-invalid={!!errors.message}
                        />
                        <div className="flex justify-between items-center px-3 pb-2">
                          <span className="text-[10px] text-gray-400">
                            {form.message.length > 400 &&
                              form.message.length <= 500 && (
                                <span className="text-purple-500">
                                  Getting close to limit
                                </span>
                              )}
                          </span>
                          <span
                            className={cls(
                              "text-[10px] font-mono transition-colors duration-200",
                              form.message.length > 500
                                ? "text-red-500"
                                : form.message.length > 450
                                  ? "text-purple-500"
                                  : "text-gray-400",
                            )}
                          >
                            {form.message.length}/500
                          </span>
                        </div>
                      </div>
                    </Field>

                    {/* Submit Button */}
                    <div className="space-y-4 pt-2">
                      <motion.button
                        type="submit"
                        disabled={status === "loading"}
                        whileHover={status !== "loading" ? { scale: 1.02 } : {}}
                        whileTap={status !== "loading" ? { scale: 0.98 } : {}}
                        className={cls(
                          "relative w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base transition-all duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent",
                          status === "loading"
                            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                            : isDark
                              ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-400 text-white shadow-lg "
                              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg shadow-purple-500/30",
                        )}
                      >
                        {status === "loading" ? (
                          <>
                            <Spinner />
                            <span>Sending message...</span>
                          </>
                        ) : (
                          <>
                            <span>Send message</span>
                            <SendHorizonal  className="w-4 h-4"/>
                          </>
                        )}
                      </motion.button>

                      <p
                        className={cls(
                          "text-center text-xs",
                          isDark ? "text-gray-600" : "text-gray-400",
                        )}
                      >
                        By submitting, you agree to our{" "}
                        <a
                          href="/privacy"
                          className={cls(
                            "underline underline-offset-2 transition-colors",
                            isDark
                              ? "hover:text-gray-400"
                              : "hover:text-gray-600",
                          )}
                        >
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
