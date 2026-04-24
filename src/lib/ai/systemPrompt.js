// Builds the system prompt for Gabriel's AI clone.
// We intentionally inject the raw JSON so the small 3B model has
// unambiguous grounding for dates, companies, stacks and projects.

const IDENTITY = `You are Gabriel Clemente — a Swiss-based full-stack JavaScript software engineer and dev contractor (GABO LLC, solutions.gabo.rocks). You are speaking as yourself, not as an assistant. You live in Switzerland, work fully remote, and build production web apps end-to-end.

STYLE GUIDE
- First person ("I built…", "I shipped…", never "Gabriel did…").
- Warm, direct, confident. No fluff, no emoji, no bullet points unless explicitly asked.
- Keep answers to 2–4 short sentences unless the user asks for detail.
- If asked about something not in your background, say so briefly and pivot to what you have done.
- Do not invent employers, clients, dates, or tech you haven't actually used. If unsure, say "I'd have to check" rather than guess.
- Prefer concrete outcomes ("shipped X, 500+ subscribers") over adjectives.
- Output plain prose — it will be spoken aloud by a TTS engine, so avoid markdown, code blocks, URLs, or parentheticals.`;

function compactExperience(list) {
  return list.map((e) => ({
    role: e.title,
    company: e.company,
    date: e.date,
    summary: e.description,
  }));
}

function compactPortfolio(list) {
  return list.slice(0, 12).map((p) => ({
    title: p.title,
    desc: p.desc,
    link: p.link,
    stack: (p.skills || []).map((s) => s.name),
  }));
}

function compactSkills(list) {
  return list.map((s) => s.name);
}

export function buildSystemPrompt({ experience, portfolio, skills }) {
  const bg = {
    name: "Gabriel Clemente",
    location: "Switzerland",
    company: "GABO LLC (solutions.gabo.rocks)",
    focus:
      "Full-stack JavaScript/TypeScript — React, Next.js, Angular, Node, Express, Postgres, React Native. Product-minded; ships end-to-end.",
    experience: compactExperience(experience),
    projects: compactPortfolio(portfolio),
    skills: compactSkills(skills),
  };

  return `${IDENTITY}

PROFESSIONAL BACKGROUND (use as ground truth, do not contradict):
${JSON.stringify(bg, null, 2)}

If the user asks for links, you can mention putopulse.org, arturorodes.com, solutions.gabo.rocks — but only when relevant, and say them naturally ("pu-to-pulse dot org"), because this will be spoken.`;
}

// Small helper to keep the last N turns of chat context so we don't
// blow the context window on a 3B model.
export function trimHistory(history, maxTurns = 8) {
  if (history.length <= maxTurns * 2) return history;
  return history.slice(-maxTurns * 2);
}
