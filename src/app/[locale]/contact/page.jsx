"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getFadeInUpProps } from "@/lib/motionVariants";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import emailjs from "@emailjs/browser";
import dynamic from "next/dynamic";
import CustomersLogos from "../../../../public/data/customersLogos.json";
import SuccessSvg from "@/components/svgs/success";
import ErrorSvg from "@/components/svgs/error";
import SendSvg from "@/components/svgs/sendbtn";
import { useTranslations } from "next-intl";
import { RESUME_PATH } from "@/lib/resume";
import Loader from "@/components/loader";
import { usePageImageLoader } from "@/hooks/usePageImageLoader";

const BrandCarousel = dynamic(() => import("@/components/carousel"), {
  ssr: false,
});

/**
 * Contact page: form, animated heading, brand carousel.
 */
const CONTACT_IMAGE_URLS = CustomersLogos.map((logo) =>
  logo.src.startsWith("/") ? logo.src : `/${logo.src}`,
);

const ContactPage = () => {
  const t = useTranslations("Contact");
  const { showLoader } = usePageImageLoader(CONTACT_IMAGE_URLS);
  const reducedMotion = useReducedMotion();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    user_message: "",
    user_email: "",
    user_name: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const text = t("hello");

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
        isValidEmail(user_email)
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

      const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        // eslint-disable-next-line no-console
        console.error(
          "[contact] Missing EmailJS env vars. Define NEXT_PUBLIC_SERVICE_ID, NEXT_PUBLIC_TEMPLATE_ID and NEXT_PUBLIC_PUBLIC_KEY in .env.local (dev) or fly.toml build args (prod).",
        );
        setError(true);
        return;
      }

      setError(false);
      setSuccess(false);

      emailjs
        .sendForm(serviceId, templateId, form.current, { publicKey })
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
          (err) => {
            // eslint-disable-next-line no-console
            console.error("[contact] EmailJS sendForm failed:", err);
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
    [text]
  );

  return (
    <div className="relative flex w-full flex-col page-gradient">
      {showLoader && <Loader />}
      <motion.div
        className="flex w-full flex-col"
        initial={{ y: "-200vh", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 1 }}
        aria-busy={showLoader}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-stretch gap-10 px-4 py-4 pb-28 text-stone-100 sm:gap-11 sm:px-6 sm:py-5 sm:pb-32 md:px-10 lg:max-w-[88rem] lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-16 lg:px-12 lg:py-4 lg:pb-40 xl:gap-20 xl:pb-44 xl:px-16 2xl:px-20">
        <motion.div
          className="flex w-full min-w-0 flex-col items-center justify-center gap-4 self-center font-display font-semibold lg:max-w-lg lg:min-h-0 lg:self-stretch"
          {...getFadeInUpProps(!!reducedMotion, 0.06)}
        >
          <p className="max-w-lg text-center text-base font-normal font-sans leading-relaxed text-stone-400 [text-wrap:balance] sm:text-lg">
            {t("availability")}
          </p>
          <a
            href="mailto:sendmessage@gabo.email"
            className="text-center text-sm font-sans font-normal text-sky-400/90 underline-offset-4 transition hover:text-sky-300 hover:underline sm:text-base"
          >
            {t("secondaryCta")}
          </a>
        <div className="flex w-full min-w-0 flex-col items-center justify-center gap-5 text-6xl sm:flex-row sm:gap-9 sm:text-7xl md:text-8xl">
          <div className="min-h-[1.2em] text-center tracking-tight sm:text-left lg:text-center">
            {memoizedText}
          </div>
          <div
            className="flex select-none text-5xl sm:text-6xl md:text-7xl"
            role="img"
            aria-label={t("smilingEmoji")}
          >
            😊
          </div>
        </div>
        </motion.div>
        <motion.div
          className="flex w-full min-w-0 flex-col self-start"
          {...getFadeInUpProps(!!reducedMotion, 0.14)}
        >
          <div className="flex flex-col gap-8 rounded-2xl border-2 border-stone-500/30 bg-stone-900/40 px-8 py-8 text-xl text-stone-200 shadow-lg sm:gap-9 sm:px-11 sm:py-11 sm:text-2xl lg:px-12 lg:py-12 font-sans font-normal">
          <motion.a
            href={RESUME_PATH}
            download
            className="btn-primary w-full !py-4 !text-lg sm:!self-center sm:!px-12 sm:!text-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {t("downloadResume")}
          </motion.a>
          <motion.form
            onSubmit={sendEmail}
            ref={form}
            className="flex flex-col gap-8 sm:gap-9"
          >
            <label
              className="text-lg font-medium text-stone-300 sm:text-xl"
              htmlFor="user_message"
            >
              {t("dearGabo")}
            </label>
            <textarea
              id="user_message"
              rows={8}
              className="w-full min-h-[9rem] bg-transparent border-b-2 border-b-stone-500 text-xl outline-none [field-sizing:content] resize-y focus:border-sky-500/70 sm:min-h-[10rem] sm:text-2xl"
              name="user_message"
              value={formData.user_message}
              onChange={handleInputChange}
            />
            <label
              className="text-lg font-medium text-stone-300 sm:text-xl"
              htmlFor="user_email"
            >
              {t("myMail")}
            </label>
            <input
              id="user_email"
              name="user_email"
              type="text"
              className="w-full bg-transparent border-b-2 border-b-stone-500 py-2 text-xl outline-none focus:border-sky-500/70 sm:py-2.5 sm:text-2xl"
              value={formData.user_email}
              onChange={handleInputChange}
            />
            <label
              className="text-lg font-medium text-stone-300 sm:text-xl"
              htmlFor="user_name"
            >
              {t("yourName")}
            </label>
            <input
              id="user_name"
              name="user_name"
              type="text"
              className="w-full bg-transparent border-b-2 border-b-stone-500 py-2 text-xl outline-none focus:border-sky-500/70 sm:py-2.5 sm:text-2xl"
              value={formData.user_name}
              onChange={handleInputChange}
            />
            <p className="text-lg text-stone-400 sm:text-xl">{t("regards")}</p>
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.8)",
              }}
              whileTap={{ scale: 0.9 }}
              disabled={!isFormValid}
              className={`rounded-xl font-display text-xl font-semibold p-6 flex items-center justify-center gap-3 sm:text-2xl ${
                success
                  ? "bg-emerald-500/90 text-white"
                  : error
                    ? "bg-red-600/90 text-white"
                    : "bg-sky-500 text-white border border-sky-400/40"
              } ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {success ? (
                <>
                  {t("sentSuccess")}
                  <SuccessSvg />
                </>
              ) : error ? (
                <>
                  {t("tryAgain")}
                  <ErrorSvg />
                </>
              ) : (
                <>
                  {t("send")}
                  <SendSvg />
                </>
              )}
            </motion.button>
            {error && (
              <span className="text-red-600 font-semibold">
                {t("formError")}
              </span>
            )}
          </motion.form>
          </div>
        </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-30 w-full border-t border-stone-700/40 bg-stone-950/95 shadow-[0_-4px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm [padding-bottom:env(safe-area-inset-bottom)]"
        {...getFadeInUpProps(!!reducedMotion, 0.32)}
      >
        <BrandCarousel
          logos={CustomersLogos}
          type="p"
          className="!py-2.5 sm:!py-3 lg:!py-5 xl:!py-6"
        />
      </motion.div>
    </div>
  );
};

export default ContactPage;
