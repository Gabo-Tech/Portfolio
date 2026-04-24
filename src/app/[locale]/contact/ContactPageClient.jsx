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
const CONTACT_IMAGE_URLS = CustomersLogos.map((logo) =>
  logo.src.startsWith("/") ? logo.src : `/${logo.src}`,
);
const ContactPageClient = () => {
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
        isValidEmail(user_email),
    );
  }, [formData]);
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);
  const sendEmail = useCallback(
    (e) => {
      e.preventDefault();
      if (!isFormValid) return;
      const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
      if (!serviceId || !templateId || !publicKey) {
        console.error(
          "[contact] Missing EmailJS env vars. Define NEXT_PUBLIC_SERVICE_ID, NEXT_PUBLIC_TEMPLATE_ID and NEXT_PUBLIC_PUBLIC_KEY in .env.local (dev) or fly.toml build args (prod).",
        );
        setError(true);
        return;
      }
      setError(false);
      setSuccess(false);
      emailjs
        .sendForm(serviceId, templateId, form.current, {
          publicKey,
        })
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
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 0,
          }}
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
  if (showLoader) {
    return <Loader />;
  }
  return (
    <div className="page-gradient relative flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden">
      <motion.div
        className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
        initial={false}
        animate={{
          y: "0%",
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        aria-busy={false}
      >
        <div className="mx-auto min-h-0 w-full min-w-0 max-w-full flex-1 overflow-y-auto overflow-x-clip [overscroll-behavior-y:contain] [scrollbar-gutter:stable]">
          <div className="mx-auto grid w-full max-w-screen-3xl min-h-0 grid-cols-1 items-stretch gap-10 pt-4 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pb-6 text-stone-100 min-[400px]:gap-12 min-[400px]:pl-[max(1rem,env(safe-area-inset-left,0px))] min-[400px]:pr-[max(1rem,env(safe-area-inset-right,0px))] sm:gap-12 sm:pt-6 md:pt-2 md:pl-[max(1.5rem,env(safe-area-inset-left,0px))] md:pr-[max(1.5rem,env(safe-area-inset-right,0px))] lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-4 lg:pt-4 xl:gap-20 xl:px-6 2xl:gap-24 2xl:px-8 3xl:px-10 4xl:px-12">
            <motion.div
              className="flex w-full min-w-0 max-w-2xl flex-col items-center justify-center gap-4 self-center text-center min-[500px]:gap-5 min-[500px]:max-w-none lg:max-w-lg lg:min-h-0 lg:justify-start lg:justify-items-start lg:self-stretch lg:pt-2 2xl:pt-4"
              {...getFadeInUpProps(!!reducedMotion, 0.06)}
            >
              <p className="max-w-lg text-balance text-base font-normal font-sans leading-relaxed text-stone-400 min-[500px]:text-lg 2xl:text-xl">
                {t("availability")}
              </p>
              <a
                href="mailto:sendmessage@gabo.email"
                className="min-h-11 w-full max-w-sm break-words text-center text-sm font-sans font-normal text-sky-400/90 underline-offset-4 transition hover:text-sky-300 hover:underline min-[500px]:text-base 2xl:text-lg"
              >
                {t("secondaryCta")}
              </a>
              <div className="flex w-full min-w-0 flex-col items-center justify-center gap-3 min-[400px]:flex-row min-[400px]:gap-5 min-[500px]:gap-7 sm:gap-8 md:gap-9 lg:justify-center lg:gap-10 2xl:gap-10">
                <div className="min-h-[1.15em] w-full min-w-0 text-center font-display font-semibold leading-[1.12] tracking-tight [font-size:clamp(2.125rem,5.2vw+0.75rem,4.5rem)] min-[500px]:text-6xl min-[500px]:leading-[1.05] md:text-7xl 2xl:text-8xl 3xl:[font-size:4.5rem]">
                  {memoizedText}
                </div>
                <div
                  className="select-none leading-none [font-size:clamp(1.625rem,3.5vw+0.75rem,3.25rem)] min-[500px]:text-5xl min-[500px]:leading-none md:text-6xl 2xl:text-7xl 3xl:text-8xl"
                  role="img"
                  aria-label={t("smilingEmoji")}
                >
                  😊
                </div>
              </div>
            </motion.div>
            <motion.div
              className="flex w-full min-w-0 max-w-3xl flex-col self-center lg:max-w-none lg:self-stretch 2xl:pl-2"
              {...getFadeInUpProps(!!reducedMotion, 0.14)}
            >
              <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-2xl border-2 border-stone-500/30 bg-stone-900/40 px-4 py-6 text-stone-200 shadow-lg min-[500px]:gap-7 min-[500px]:px-6 min-[500px]:py-8 sm:max-w-2xl sm:gap-8 sm:px-7 sm:py-9 sm:text-lg md:gap-8 md:px-8 md:py-9 lg:mx-0 lg:max-w-none lg:px-8 lg:py-10 2xl:px-10 2xl:py-11 font-sans font-normal 3xl:px-12">
                <motion.a
                  href={RESUME_PATH}
                  download
                  className="btn-primary !inline-flex !min-h-12 w-full !px-4 !py-3.5 !text-base [touch-action:manipulation] min-[500px]:!w-auto min-[500px]:!self-center min-[500px]:!px-10 min-[500px]:!text-lg 2xl:!px-12 2xl:!text-xl"
                  whileHover={
                    reducedMotion
                      ? undefined
                      : {
                          scale: 1.04,
                        }
                  }
                  whileTap={
                    reducedMotion
                      ? undefined
                      : {
                          scale: 0.98,
                        }
                  }
                >
                  {t("downloadResume")}
                </motion.a>
                <motion.form
                  onSubmit={sendEmail}
                  ref={form}
                  className="flex min-w-0 flex-col gap-6 min-[500px]:gap-7 sm:gap-8"
                >
                  <label
                    className="text-base font-medium text-stone-300 min-[500px]:text-lg md:text-xl 2xl:text-2xl"
                    htmlFor="user_message"
                  >
                    {t("dearGabo")}
                  </label>
                  <textarea
                    id="user_message"
                    rows={8}
                    className="w-full min-h-36 min-w-0 rounded-none bg-transparent border-b-2 border-b-stone-500 text-base leading-relaxed outline-none [field-sizing:content] resize-y focus:border-sky-500/70 min-[500px]:min-h-40 min-[500px]:text-lg sm:min-h-40 sm:leading-relaxed md:min-h-40 md:text-xl 2xl:text-2xl"
                    name="user_message"
                    value={formData.user_message}
                    onChange={handleInputChange}
                  />
                  <label
                    className="text-base font-medium text-stone-300 min-[500px]:text-lg md:text-xl 2xl:text-2xl"
                    htmlFor="user_email"
                  >
                    {t("myMail")}
                  </label>
                  <input
                    id="user_email"
                    name="user_email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    className="w-full min-w-0 min-h-11 bg-transparent border-b-2 border-b-stone-500 py-2 text-base outline-none [touch-action:manipulation] focus:border-sky-500/70 min-[500px]:py-2.5 min-[500px]:text-lg md:py-3 md:text-xl 2xl:text-2xl"
                    value={formData.user_email}
                    onChange={handleInputChange}
                  />
                  <label
                    className="text-base font-medium text-stone-300 min-[500px]:text-lg md:text-xl 2xl:text-2xl"
                    htmlFor="user_name"
                  >
                    {t("yourName")}
                  </label>
                  <input
                    id="user_name"
                    name="user_name"
                    type="text"
                    autoComplete="name"
                    className="w-full min-w-0 min-h-11 bg-transparent border-b-2 border-b-stone-500 py-2 text-base outline-none focus:border-sky-500/70 min-[500px]:py-2.5 min-[500px]:text-lg md:py-3 md:text-xl 2xl:text-2xl"
                    value={formData.user_name}
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-stone-400 min-[500px]:text-base md:text-lg 2xl:text-xl">
                    {t("regards")}
                  </p>
                  <motion.button
                    type="submit"
                    whileHover={
                      !isFormValid || reducedMotion
                        ? undefined
                        : {
                            scale: 1.02,
                            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.8)",
                          }
                    }
                    whileTap={
                      !isFormValid || reducedMotion
                        ? undefined
                        : {
                            scale: 0.99,
                          }
                    }
                    disabled={!isFormValid}
                    className={`min-h-12 w-full max-w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-display text-base font-semibold [touch-action:manipulation] sm:min-h-14 sm:gap-3 sm:px-5 sm:py-4 sm:text-lg md:text-xl 2xl:py-5 2xl:text-2xl ${success ? "bg-emerald-500/90 text-white" : error ? "bg-red-600/90 text-white" : "bg-sky-500 text-white border border-sky-400/40"} ${!isFormValid ? "cursor-not-allowed opacity-50" : ""} flex flex-wrap sm:flex-nowrap`}
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
                    <span className="text-sm font-semibold text-red-500 [overflow-wrap:anywhere] min-[500px]:text-base">
                      {t("formError")}
                    </span>
                  )}
                </motion.form>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="relative z-20 w-full min-w-0 max-w-full shrink-0 border-t border-stone-700/40 bg-stone-950/95 shadow-[0_-4px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm [padding-bottom:env(safe-area-inset-bottom,0px)] [padding-left:max(0px,env(safe-area-inset-left,0px))] [padding-right:max(0px,env(safe-area-inset-right,0px))]"
        {...getFadeInUpProps(!!reducedMotion, 0.32)}
      >
        <BrandCarousel
          logos={CustomersLogos}
          type="p"
          className="!px-0 !py-2.5 sm:!py-3 min-[1000px]:!py-4 2xl:!py-5 3xl:!py-6"
        />
      </motion.div>
    </div>
  );
};
export default ContactPageClient;
