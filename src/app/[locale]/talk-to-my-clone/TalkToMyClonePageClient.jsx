"use client";

// Client island. Dynamically imports AvatarChat (which in turn
// dynamically imports TalkingAvatar) so nothing touches SSR.

import dynamic from "next/dynamic";
import { useState } from "react";

const AvatarChat = dynamic(() => import("@/components/avatar/AvatarChat"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center text-slate-400">
      Loading AI clone…
    </div>
  ),
});

export default function TalkToMyClonePageClient({ resumeData }) {
  const [started, setStarted] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100 py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80 mb-2">
            Experiment · 100% in-browser
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Talk to Gabriel&apos;s AI clone
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
            A real-time 3D avatar powered by{" "}
            <span className="text-slate-200">WebLLM</span> (local language
            model), <span className="text-slate-200">HeadTTS</span> (neural
            speech) and <span className="text-slate-200">TalkingHead</span>{" "}
            (lip-sync). It knows my resume, projects and stack. Ask it anything
            — the first load pulls ~2 GB of models, after that it runs fully
            offline on your GPU.
          </p>
        </header>

        {!started ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 sm:p-10 text-center">
            <h2 className="text-xl font-medium mb-2">Heads-up before you start</h2>
            <ul className="text-sm text-slate-400 space-y-1 max-w-xl mx-auto text-left mb-6 list-disc list-inside">
              <li>Desktop Chrome or Edge with WebGPU works best.</li>
              <li>First load downloads a ~1.5–2 GB model (cached afterwards).</li>
              <li>
                Mic access is optional — you can also type. Nothing is sent to a
                server.
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="inline-flex items-center justify-center px-6 h-12 rounded-full bg-amber-400 text-slate-900 font-medium hover:bg-amber-300 transition-colors"
            >
              Start conversation
            </button>
          </div>
        ) : (
          <AvatarChat resumeData={resumeData} />
        )}

        <footer className="mt-10 text-xs text-slate-500">
          Built with Next.js, React Three Fiber, @mlc-ai/web-llm, HeadTTS and
          met4citizen/TalkingHead. Source on GitHub.
        </footer>
      </div>
    </main>
  );
}
