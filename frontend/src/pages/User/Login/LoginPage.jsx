import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { contactAPI } from "@/store/feature/user";
import { toast } from "react-toastify";
import { motion, useInView } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Clock,
  ShieldCheck,
  BellOff,
  Mail,
  User,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Radio,
} from "lucide-react";

/* ─── utility ───────────────────────────────────────────────────────────── */
const cls = (...c) => c.filter(Boolean).join(" ");

/* ─── theme map (matches your existing system) ─────────────────────────── */
const themeColors = {
  dark: {
    bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
    pageBg: "bg-[#0e0d0c]",
    text: "text-gray-100",
    mutedText: "text-gray-400",
    subtleText: "text-gray-500",
    accent: "from-purple-600 to-pink-500",
    accentText:
      "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
    inputBg: "bg-gray-800/50 border-gray-700",
    cardBg: "bg-gray-800/30 backdrop-blur-sm border border-gray-700",
    placeholder: "placeholder-gray-500",
    divider: "bg-gray-700",
    featureBg: "bg-gray-800/40",
    linearBg:
      "bg-gradient-to-r from-purple-900/20 via-pink-900/10 to-gray-900/20",

    /* component-level tokens */
    eyebrowBorder: "border-purple-500/30",
    eyebrowBg: "bg-purple-500/10",
    eyebrowText: "text-purple-400",
    eyebrowDot: "bg-purple-400",

    trustIcon: "bg-gray-800 text-purple-400",
    chIcon:
      "border-gray-700 bg-gray-800 text-gray-400 group-hover:border-purple-500/40 group-hover:text-purple-400",
    chLink: "text-gray-300 hover:text-purple-400",

    inputWrap:
      "border-gray-700 bg-gray-800/50 focus-within:border-purple-500/70 focus-within:ring-2 focus-within:ring-purple-500/15 hover:border-gray-600",
    inputDisabled: "border-gray-700/50 bg-gray-800/30 cursor-not-allowed",
    inputText: "text-gray-100 placeholder:text-gray-500 disabled:text-gray-500",
    inputIcon: "text-gray-500",
    prefilledCheck: "text-gray-600",

    textareaBase:
      "border-gray-700 bg-gray-800/50 focus-within:border-purple-500/70 focus-within:ring-2 focus-within:ring-purple-500/15 hover:border-gray-600",
    textareaText: "text-gray-100 placeholder:text-gray-500",
    charCount: "text-gray-600",

    btn: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-[0_4px_24px_-6px_rgba(168,85,247,0.5)]",
    btnDisabled:
      "from-purple-600/50 to-pink-500/50 text-white/60 cursor-not-allowed",
    finePrint: "text-gray-600",
    finePrintLink: "hover:text-gray-400",

    card: "bg-gray-800/30 backdrop-blur-sm border border-gray-700 shadow-[0_8px_48px_-12px_rgba(0,0,0,0.7)]",
    successIcon: "bg-purple-500/15 text-purple-400",
    successTitle: "text-gray-100",
    successBody: "text-gray-400",
  },
  light: {
    bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
    pageBg: "bg-[#f5f3f0]",
    text: "text-gray-900",
    mutedText: "text-gray-600",
    subtleText: "text-gray-400",
    accent: "from-purple-500 to-pink-400",
    accentText:
      "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
    inputBg: "bg-white border-gray-300",
    cardBg: "bg-white/70 backdrop-blur-sm border border-gray-200",
    placeholder: "placeholder-gray-400",
    divider: "bg-gray-300",
    featureBg: "bg-white/80",
    linearBg: "bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50",

    eyebrowBorder: "border-purple-400/40",
    eyebrowBg: "bg-purple-50",
    eyebrowText: "text-purple-700",
    eyebrowDot: "bg-purple-500",

    trustIcon: "bg-gray-100 text-purple-600",
    chIcon:
      "border-gray-200 bg-white text-gray-500 group-hover:border-purple-400/40 group-hover:text-purple-600",
    chLink: "text-gray-600 hover:text-purple-700",

    inputWrap:
      "border-gray-300 bg-white focus-within:border-purple-400/80 focus-within:ring-2 focus-within:ring-purple-400/15 hover:border-gray-400",
    inputDisabled: "border-gray-200 bg-gray-100 cursor-not-allowed",
    inputText: "text-gray-900 placeholder:text-gray-400 disabled:text-gray-400",
    inputIcon: "text-gray-400",
    prefilledCheck: "text-gray-400",

    textareaBase:
      "border-gray-300 bg-white focus-within:border-purple-400/80 focus-within:ring-2 focus-within:ring-purple-400/15 hover:border-gray-400",
    textareaText: "text-gray-900 placeholder:text-gray-400",
    charCount: "text-gray-400",

    btn: "bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-400 hover:to-pink-300 text-white shadow-[0_4px_24px_-6px_rgba(168,85,247,0.4)]",
    btnDisabled:
      "from-purple-400/50 to-pink-400/50 text-white/60 cursor-not-allowed",
    finePrint: "text-gray-400",
    finePrintLink: "hover:text-gray-600",

    card: "bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]",
    successIcon: "bg-purple-50 text-purple-600",
    successTitle: "text-gray-900",
    successBody: "text-gray-500",
  },
};

/* ─── trust items ───────────────────────────────────────────────────────── */
const TRUST = [
  { Icon: Clock, label: "Reply within 24 hours" },
  { Icon: ShieldCheck, label: "Your data stays private" },
  { Icon: BellOff, label: "No spam, ever" },
];

/* ─── channel ───────────────────────────────────────────────────────────── */
const CHANNELS = [
  {
    href: "mailto:support@brahmayf.com",
    Icon: Mail,
    value: "support@brahmayf.com",
  },
];

/* ─── sub-components ─────────────────────────────────────────────────────── */
function Field({ label, id, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[12px] font-semibold tracking-[0.1em] uppercase select-none text-gray-400"
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          role="alert"
          className="text-[12px] text-red-400 mt-0.5 flex items-center gap-1"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function InputWrap({ disabled, c, children }) {
  return (
    <div
      className={cls(
        "group relative flex items-center rounded-xl border transition-all duration-200",
        disabled ? c.inputDisabled : c.inputWrap,
      )}
    >
      {children}
    </div>
  );
}

function Spinner() {
  return <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />;
}

/* ─── success state ─────────────────────────────────────────────────────── */
function SuccessState({ c }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center gap-5 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div
        className={cls(
          "w-16 h-16 rounded-2xl flex items-center justify-center",
          c.successIcon,
        )}
      >
        <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
      </div>
      <div>
        <h2
          className={cls("text-xl font-semibold mb-1.5", c.successTitle)}
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Message received
        </h2>
        <p
          className={cls("text-[14px] leading-relaxed max-w-xs", c.successBody)}
        >
          We'll get back to you within 24 hours. Keep an eye on your inbox.
        </p>
      </div>
    </motion.div>
  );
}

/* ─── main ───────────────────────────────────────────────────────────────── */
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const { user } = useSelector((s) => s.auth);
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const c = themeColors[theme] || themeColors.light;

  useEffect(() => {
    if (user)
      setForm((f) => ({
        ...f,
        name: user.name || "",
        email: user.email || "",
      }));
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10)
      e.message = "Message is too short";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus("loading");
    const toastId = toast.loading("Sending your message…");
    try {
      await dispatch(contactAPI(form));
      toast.update(toastId, {
        render: "Message sent — we'll be in touch soon!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      setStatus("success");
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        message: "",
      });
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      toast.update(toastId, {
        render: "Something went wrong. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      setStatus("idle");
    }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  /* base input class */
  const inputCls = cls(
    "w-full bg-transparent px-4 py-3 text-[15px] outline-none",
    c.inputText,
  );

  return (
    <div
      className={cls(
        "min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20",
        c.bg,
      )}
    >
      {/* subtle grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        ref={sectionRef}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="w-full max-w-5xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12 items-start">
          {/* ── LEFT panel ──────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            className="lg:sticky lg:top-24 flex flex-col gap-8"
          >
            <div>
              {/* eyebrow */}
              <span
                className={cls(
                  "inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase",
                  "px-3 py-1.5 rounded-full border mb-5",
                  c.eyebrowBorder,
                  c.eyebrowBg,
                  c.eyebrowText,
                )}
              >
                <Radio
                  className={cls("w-3 h-3", c.eyebrowDot)}
                  aria-hidden="true"
                />
                We're listening
              </span>

              <h1
                className={cls(
                  "font-serif text-4xl sm:text-5xl leading-[1.1] tracking-tight mb-4",
                  c.text,
                )}
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Let's start a<br />
                <span className={c.accentText}>conversation</span>
              </h1>

              <p
                className={cls(
                  "text-[15px] leading-relaxed max-w-sm",
                  c.mutedText,
                )}
              >
                Whether you're a coach growing your practice or a student
                looking for guidance — we're here and happy to help.
              </p>
            </div>

            <div className={cls("h-px w-16", c.divider)} />

            {/* trust signals */}
            <ul className="flex flex-col gap-3" aria-label="Contact promises">
              {TRUST.map(({ Icon, label }) => (
                <li
                  key={label}
                  className={cls(
                    "flex items-center gap-3 text-[14px]",
                    c.mutedText,
                  )}
                >
                  <span
                    className={cls(
                      "flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0",
                      c.trustIcon,
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className={cls("h-px w-16", c.divider)} />

            {/* direct channel */}
            <div>
              <p
                className={cls(
                  "text-[12px] font-semibold tracking-[0.1em] uppercase mb-3",
                  c.subtleText,
                )}
              >
                Or reach us directly
              </p>
              {CHANNELS.map(({ href, Icon, value }) => (
                <a
                  key={value}
                  href={href}
                  className={cls(
                    "group inline-flex items-center gap-2.5 text-[14px] font-medium transition-colors duration-150",
                    c.chLink,
                  )}
                >
                  <span
                    className={cls(
                      "flex items-center justify-center w-8 h-8 rounded-lg border transition-colors duration-150",
                      c.chIcon,
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  {value}
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: form card ──────────────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <div className={cls("rounded-2xl p-6 sm:p-8 lg:p-9", c.card)}>
              {status === "success" ? (
                <SuccessState c={c} />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Contact form"
                  className="flex flex-col gap-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <Field
                      label="Your name"
                      id="contact-name"
                      error={errors.name}
                    >
                      <InputWrap disabled={!!user?.name} c={c}>
                        <span
                          className={cls("pl-4 flex-shrink-0", c.inputIcon)}
                          aria-hidden="true"
                        >
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          autoComplete="name"
                          placeholder="Alex Johnson"
                          value={form.name}
                          onChange={!user?.name ? handleChange : undefined}
                          disabled={!!user?.name}
                          required
                          aria-required="true"
                          aria-invalid={!!errors.name}
                          className={inputCls}
                        />
                        {user?.name && (
                          <span
                            className={cls(
                              "pr-3 flex-shrink-0",
                              c.prefilledCheck,
                            )}
                            aria-label="Pre-filled from your account"
                            title="Pre-filled from your account"
                          >
                            <CheckCircle2
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </InputWrap>
                    </Field>

                    {/* Email */}
                    <Field
                      label="Email address"
                      id="contact-email"
                      error={errors.email}
                    >
                      <InputWrap disabled={!!user?.email} c={c}>
                        <span
                          className={cls("pl-4 flex-shrink-0", c.inputIcon)}
                          aria-hidden="true"
                        >
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          autoComplete="email"
                          placeholder="alex@example.com"
                          value={form.email}
                          onChange={!user?.email ? handleChange : undefined}
                          disabled={!!user?.email}
                          required
                          aria-required="true"
                          aria-invalid={!!errors.email}
                          className={inputCls}
                        />
                        {user?.email && (
                          <span
                            className={cls(
                              "pr-3 flex-shrink-0",
                              c.prefilledCheck,
                            )}
                          >
                            <CheckCircle2
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </InputWrap>
                    </Field>
                  </div>

                  {/* Message */}
                  <Field
                    label="How can we help?"
                    id="contact-message"
                    error={errors.message}
                  >
                    <div
                      className={cls(
                        "relative rounded-xl border transition-all duration-200",
                        errors.message
                          ? "border-red-500/60 ring-2 ring-red-500/10"
                          : c.textareaBase,
                      )}
                    >
                      <MessageSquare
                        className={cls(
                          "absolute left-4 top-4 w-4 h-4",
                          c.inputIcon,
                        )}
                        aria-hidden="true"
                      />
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={6}
                        placeholder="Tell us what you're working on, what questions you have, or how we can support you…"
                        value={form.message}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.message}
                        className={cls(
                          "w-full pl-11 pr-4 py-3.5 text-[15px] leading-relaxed bg-transparent outline-none resize-none rounded-xl",
                          c.textareaText,
                        )}
                      />
                      <div
                        aria-live="polite"
                        aria-atomic="true"
                        className={cls(
                          "absolute bottom-3 right-3 text-[11px] tabular-nums select-none",
                          form.message.length > 460
                            ? "text-red-400"
                            : c.charCount,
                        )}
                      >
                        {form.message.length}/500
                      </div>
                    </div>
                  </Field>

                  {/* CTA */}
                  <div className="pt-1">
                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      whileHover={status !== "loading" ? { scale: 1.015 } : {}}
                      whileTap={status !== "loading" ? { scale: 0.985 } : {}}
                      aria-busy={status === "loading"}
                      className={cls(
                        "relative w-full flex items-center justify-center gap-2.5",
                        "px-6 py-4 rounded-xl font-semibold text-[15px] tracking-wide",
                        "transition-all duration-200 overflow-hidden",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
                        "bg-gradient-to-r",
                        status === "loading" ? c.btnDisabled : c.btn,
                      )}
                    >
                      {/* shimmer */}
                      {status !== "loading" && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                        />
                      )}
                      {status === "loading" ? (
                        <>
                          <Spinner />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </>
                      )}
                    </motion.button>

                    <p
                      className={cls(
                        "mt-3 text-center text-[12px]",
                        c.finePrint,
                      )}
                    >
                      By submitting you agree to our{" "}
                      <a
                        href="/privacy"
                        className={cls(
                          "underline underline-offset-2 transition-colors",
                          c.finePrintLink,
                        )}
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
