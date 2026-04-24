// Server component. Reads the JSON resume data synchronously at build
// time (or on-demand in dev) and ships it to the client island.

import fs from "node:fs";
import path from "node:path";
import TalkToMyClonePageClient from "./TalkToMyClonePageClient";

export const metadata = {
  title: "Talk to my AI clone — Gabriel Clemente",
  description:
    "A 3D talking AI clone of Gabriel Clemente that answers questions about his experience, running fully in your browser with WebLLM, HeadTTS and TalkingHead.",
};

function readJson(rel) {
  const p = path.join(process.cwd(), "public", "data", rel);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

export default function TalkToMyClonePage() {
  const resumeData = {
    experience: readJson("experience.json"),
    portfolio: readJson("portfolioItems.json"),
    skills: readJson("skills.json"),
  };

  return <TalkToMyClonePageClient resumeData={resumeData} />;
}
