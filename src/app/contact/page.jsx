"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
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

  const form = useRef();

  useEffect(() => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const { user_message, user_email, user_name } = formData;
    setIsFormValid(
      user_message.trim().length > 0 &&
        user_name.trim().length > 0 &&
        isValidEmail(user_email),
    );
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const sendEmail = useCallback(
    (e) => {
      e.preventDefault();
      if (!isFormValid) return;

      setError(false);
      setSuccess(false);

      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_SERVICE_ID,
          process.env.NEXT_PUBLIC_TEMPLATE_ID,
          form.current,
          process.env.NEXT_PUBLIC_PUBLIC_KEY,
        )
        .then(
          () => {
            setSuccess(true);
            form.current.reset();
            setFormData({
              user_message: "",
              user_email: "",
              user_name: "",
            });
          },
          () => {
            setError(true);
          },
        );
    },
    [isFormValid],
  );

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
    [text],
  );

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
                Something went wrong!
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
