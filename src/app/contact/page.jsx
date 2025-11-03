"use client";

import { motion } from "framer-motion";
import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import emailjs from "@emailjs/browser";
import dynamic from "next/dynamic";
import CustomersLogos from "../../../public/data/customersLogos";
import SuccessSvg from "@/components/svgs/success";
import ErrorSvg from "@/components/svgs/error";
import SendSvg from "@/components/svgs/sendbtn";

const BrandCarousel = dynamic(() => import("../../components/carousel"), {
  ssr: false,
});

/**
 * ContactPage Component
 * Displays the contact page with a form, animated text, and brand carousel.
 */
const ContactPage = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    user_message: "",
    user_email: "",
    user_name: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const text = "Say Hello! ";

  const form = useRef<HTMLFormElement>(null);

  // ──────────────────────────────────────────────────────────────
  // 1. Log env variables on mount (check if Fly injected them)
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    console.log("🔑 EMAILJS ENV VARS (client-side):");
    console.log("   SERVICE_ID :", process.env.NEXT_PUBLIC_SERVICE_ID);
    console.log("   TEMPLATE_ID:", process.env.NEXT_PUBLIC_TEMPLATE_ID);
    console.log("   PUBLIC_KEY :", process.env.NEXT_PUBLIC_PUBLIC_KEY);

    if (
      !process.env.NEXT_PUBLIC_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_PUBLIC_KEY
    ) {
      console.error("❌ ONE OR MORE EMAILJS ENV VARS ARE MISSING!");
    } else {
      console.log("✅ All EmailJS env vars are present.");
    }
  }, []);

  // ──────────────────────────────────────────────────────────────
  // 2. Form validation
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const { user_message, user_email, user_name } = formData;
    const valid =
      user_message.trim().length > 0 &&
      user_name.trim().length > 0 &&
      isValidEmail(user_email);

    setIsFormValid(valid);
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ──────────────────────────────────────────────────────────────
  // 3. Send email with full logging
  // ──────────────────────────────────────────────────────────────
  const sendEmail = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      console.log("📤 SEND EMAIL CALLED");
      console.log("   Form valid:", isFormValid);
      if (!isFormValid) {
        console.warn("🚫 Form not valid – aborting send.");
        return;
      }

      // Reset UI
      setError(false);
      setSuccess(false);

      // Log payload before sending
      console.log("📋 FORM PAYLOAD (from DOM):");
      const formEl = form.current;
      if (formEl) {
        const formDataObj = new FormData(formEl);
        for (const [key, val] of formDataObj.entries()) {
          console.log(`   ${key}:`, val);
        }
      }

      // Log EmailJS config
      console.log("⚙️ EMAILJS CONFIG:");
      console.log("   Service ID :", process.env.NEXT_PUBLIC_SERVICE_ID);
      console.log("   Template ID:", process.env.NEXT_PUBLIC_TEMPLATE_ID);
      console.log("   Public Key :", process.env.NEXT_PUBLIC_PUBLIC_KEY);

      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_SERVICE_ID!,
          process.env.NEXT_PUBLIC_TEMPLATE_ID!,
          form.current!,
          process.env.NEXT_PUBLIC_PUBLIC_KEY!
        )
        .then(
          (result) => {
            console.log("✅ EMAILJS SUCCESS:", result);
            setSuccess(true);
            formEl?.reset();
            setFormData({
              user_message: "",
              user_email: "",
              user_name: "",
            });
          },
          (err) => {
            console.error("❌ EMAILJS ERROR:", err);
            console.error("   Status:", err.status);
            console.error("   Text  :", err.text);
            setError(true);
          }
        )
        .catch((catchErr) => {
          console.error("💥 EMAILJS UNCAUGHT ERROR:", catchErr);
          setError(true);
        });
    },
    [isFormValid]
  );

  // ──────────────────────────────────────────────────────────────
  // 4. Animated text
  // ──────────────────────────────────────────────────────────────
  const memoizedText = useMemo(
    () =>
      text.split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        >
          {letter}
        </motion.span>
      )),
    []
  );

  // ──────────────────────────────────────────────────────────────
  // 5. Render
  // ──────────────────────────────────────────────────────────────
  return (
    <motion.div
      className="relative min-h-screen bg-gradient-to-b from-blue-950 to-red-950 h-auto"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col h-auto min-h-screen text-white font-extrabold lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 items-center">
        {/* TEXT CONTAINER */}
        <div className="flex-grow lg:flex-grow-0 lg:w-1/2 flex flex-col md:flex-row items-center justify-center text-6xl">
          <div>{memoizedText}</div>
          <div className="p-8" role="img" aria-label="smiling emoji">
            😊
          </div>
        </div>

        {/* FORM CONTAINER */}
        <motion.div
          animate={{
            y: ["30px", "0px", "30px"],
            transition: {
              duration: 10,
              ease: "easeInOut",
              repeat: Infinity,
            },
          }}
          className="lg:mb-14 lg:mt-14 py-8 w-full lg:w-1/2 bg-white bg-opacity-10 rounded-xl text-xl flex flex-col gap-8 justify-center px-10 lg:px-24"
        >
          <motion.a
            href="./Gabriel Clemente - Full Stack JavaScript Software Engineer - Resume.pdf"
            download
            className="self-center mb-8 p-4 bg-opacity-50 bg-gradient-to-b from-blue-950 to-red-950 text-white rounded-lg font-bold transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Download My Resume
          </motion.a>

          <motion.form
            onSubmit={sendEmail}
            ref={form}
            className="flex flex-col gap-8 justify-center"
          >
            <label htmlFor="user_message">Dear GABO, YOU ROCK!</label>
            <textarea
              id="user_message"
              rows={6}
              className="bg-transparent border-b-2 border-b-white outline-none resize-none"
              name="user_message"
              value={formData.user_message}
              onChange={handleInputChange}
            />

            <label htmlFor="user_email">My mail address is:</label>
            <input
              id="user_email"
              name="user_email"
              type="text"
              className="bg-transparent border-b-2 border-b-white outline-none"
              value={formData.user_email}
              onChange={handleInputChange}
            />

            <label htmlFor="user_name">
              You can call me... (What&rsquo;s your name?)
            </label>
            <input
              id="user_name"
              name="user_name"
              type="text"
              className="bg-transparent border-b-2 border-b-white outline-none"
              value={formData.user_name}
              onChange={handleInputChange}
            />

            <label>Regards</label>

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.8)",
              }}
              whileTap={{ scale: 0.9 }}
              disabled={!isFormValid}
              className={`rounded font-semibold p-4 flex items-center justify-center gap-2 ${
                success
                  ? "bg-green-300 text-green-900"
                  : error
                  ? "bg-red-300 text-red-900"
                  : "bg-purple-200 text-gray-600"
              } ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {success ? (
                <>
                  Sent Successfully
                  <SuccessSvg />
                </>
              ) : error ? (
                <>
                  Try Again
                  <ErrorSvg />
                </>
              ) : (
                <>
                  Send
                  <SendSvg />
                </>
              )}
            </motion.button>

            {error && (
              <span className="text-red-600 font-semibold">
                Something went wrong! Check console for details.
              </span>
            )}
          </motion.form>
        </motion.div>
      </div>

      <div className="mt-8 lg:mt-0 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:mb-20">
        <BrandCarousel logos={CustomersLogos} type="p" />
      </div>
    </motion.div>
  );
};

export default ContactPage;
