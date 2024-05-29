"use client";

import { motion, useInView, useScroll } from "framer-motion";
import { useRef, useMemo } from "react";
import Image from "next/image";
import HoverSkill from "@/components/hoverSkill";
import TimelineList from "@/components/timeline/timelineList";
import Brain from "@/components/svgs/brain";
import SignatureSvg from "@/components/svgs/signature";
import ScrollSvg from "@/components/svgs/scroll";
import skillsData from "../../../public/data/skills.json";
import experienceData from "../../../public/data/experience.json";

/**
 * AboutPage Component
 * Displays the about page with biography, skills, and experience sections.
 */
const AboutPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const skillRef = useRef(null);
  const isSkillRefInView = useInView(skillRef, { margin: "-100px" });

  const experienceRef = useRef(null);
  const isExperienceRefInView = useInView(experienceRef, { margin: "-100px" });

  const memoizedSkills = useMemo(
    () =>
      skillsData.map((skill, index) => (
        <HoverSkill key={index}>
          {{
            children: skill.name,
            hoverBgColor: skill.hoverColor,
            hoverTextColor: skill.hoverTextColor,
          }}
        </HoverSkill>
      )),
    []
  );

  return (
    <motion.div
      className="h-full"
      initial={{ x: "-200vh" }}
      animate={{ x: "0%" }}
      transition={{ duration: 1 }}
    >
      <div
        className="h-full overflow-scroll text-white lg:flex"
        ref={containerRef}
      >
        <div className="p-4 sm:p-8 md:p-12 lg:p-20 xl:p-48 flex flex-col gap-24 md:gap-32 lg:gap-48 xl:gap-64 lg:w-2/3 lg:pt-0 lg:pr-0 xl:w-1/2">
          <div className="flex flex-col gap-12 items-center justify-center">
            {/* PROFILE IMAGE */}
            <Image
              src="/images/profilepic.jpg"
              alt="Profile Picture"
              width={112}
              height={112}
              className="w-28 h-28 rounded-full items-center object-cover"
              loading="lazy"
            />
            <h1 className="font-bold text-2xl">BIOGRAPHY</h1>
            <p className="text-lg">
              Hello! I&#39;m Gabriel Clemente, a passionate and dedicated
              Full-Stack JavaScript Software Engineer with a strong background
              in both front-end and back-end development. My professional
              journey has been defined by a relentless pursuit of excellence in
              web development, coupled with a drive to continually learn and
              master new technologies. I am a firm believer in the power of
              continuous learning and adaptability. If I don&#39;t know
              something, I make it a point to learn it. My approach to software
              engineering is rooted in a passion for creating efficient,
              scalable, and secure web applications. I am always excited to take
              on new challenges and leverage my skills to deliver exceptional
              results. Feel free to explore my GitHub profile to see my projects
              and contributions. You can reach out to me at
              sendmessage@gabo.email. Let&#39;s connect and create something
              amazing together!
            </p>
            <blockquote className="italic">
              Any fool can write code that a computer can understand. Good
              programmers write code that humans can understand. – Martin Fowler
            </blockquote>
            <blockquote className="italic">
              If I don&#39;t know it, I&#39;ll learn it – Gabriel Clemente
            </blockquote>
            <div className="self-end">
              <SignatureSvg />
            </div>
            <ScrollSvg />
          </div>
          <div className="flex flex-col gap-12 justify-center" ref={skillRef}>
            <motion.h1
              initial={{ x: "-300px" }}
              animate={isSkillRefInView ? { x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="font-bold text-2xl"
            >
              SKILLS
            </motion.h1>
            <motion.div
              initial={{ x: "-300px" }}
              animate={isSkillRefInView ? { x: 0 } : {}}
              className="flex gap-4 flex-wrap"
            >
              {memoizedSkills}
            </motion.div>
            <div className="flex justify-center">
              <ScrollSvg />
            </div>
          </div>
          <div
            className="flex flex-col gap-12 justify-center pb-48"
            ref={experienceRef}
          >
            <motion.h1
              initial={{ x: "-300px" }}
              animate={isExperienceRefInView ? { x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="font-bold text-2xl"
            >
              EXPERIENCE
            </motion.h1>
            <TimelineList
              experiences={experienceData}
              isInView={isExperienceRefInView}
            />
          </div>
        </div>
        <div className="hidden lg:block w-1/3 sticky top-0 z-30 xl:w-1/2">
          <Brain scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage;
