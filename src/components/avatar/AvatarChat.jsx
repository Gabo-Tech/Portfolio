"use client";

// AvatarChat — the brain of the page.
//
// Orchestration on submit:
//   1. Push user message into history.
//   2. streamChat() from WebLLM with { onToken, onSentence }.
//      - onToken  -> append to live "assistant typing" bubble (UI).
//      - onSentence -> enqueue TTS synthesis for that sentence.
//   3. A background TTS pump takes sentences one-by-one, synthesises
//      them with HeadTTS and calls TalkingAvatar.speakAudio() so lip
//      sync is perfectly aligned with the audio.
//   4. If HeadTTS is unavailable, we fall back to TalkingHead's own
//      speakText() (uses built-in audio-amplitude lip-sync).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { initWebLLM, streamChat, unloadWebLLM } from "@/lib/ai/webllm";
import { initHeadTTS, synthesize } from "@/lib/ai/headtts";
import { createWebSpeechRecogniser, isWebSpeechAvailable } from "@/lib/ai/stt";
import { detectCapabilities, MODEL_BY_TIER } from "@/lib/ai/device";
import { buildSystemPrompt, trimHistory } from "@/lib/ai/systemPrompt";

const TalkingAvatar = dynamic(() => import("./TalkingAvatar"), { ssr: false });

const MicIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z" fill={active ? "currentColor" : "none"} />
    <path d="M19 10a7 7 0 0 1-14 0M12 17v4M8 21h8" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

function ProgressBar({ label, value }) {
  const pct = Math.max(0, Math.min(1, value || 0)) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span className="truncate">{label}</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-300 to-orange-400 transition-[width] duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AvatarChat({ resumeData }) {
  const avatarRef = useRef(null);
  const ttsQueueRef = useRef([]);        // sentences waiting to be spoken
  const ttsPumpingRef = useRef(false);   // pump loop lock
  const abortRef = useRef(null);

  const [caps, setCaps] = useState(null);
  const [llmProgress, setLlmProgress] = useState({ progress: 0, text: "Idle" });
  const [ttsProgress, setTtsProgress] = useState({ progress: 0, text: "Idle" });
  const [avatarProgress, setAvatarProgress] = useState({ progress: 0, text: "Idle" });
  const [llmReady, setLlmReady] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  const [avatarReady, setAvatarReady] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey — I'm Gabriel. This is my talking clone running entirely in your browser. Ask me about my experience, projects, or the stack I use.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const systemPrompt = useMemo(
    () => buildSystemPrompt(resumeData),
    [resumeData],
  );

  // 1. Detect device tier on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const c = await detectCapabilities();
      if (!cancelled) setCaps(c);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Boot WebLLM + HeadTTS in parallel once we know the tier.
  useEffect(() => {
    if (!caps) return;
    let cancelled = false;

    const modelId = MODEL_BY_TIER[caps.tier];

    (async () => {
      // -- WebLLM -------------------------------------------------------
      if (modelId) {
        try {
          await initWebLLM({
            modelId,
            onProgress: (p) => !cancelled && setLlmProgress(p),
          });
          if (!cancelled) {
            setLlmReady(true);
            setLlmProgress({ progress: 1, text: "LLM ready" });
          }
        } catch (e) {
          console.error("WebLLM init failed", e);
          if (!cancelled) setError("Local LLM could not start on this device.");
        }
      } else {
        setLlmProgress({ progress: 1, text: "LLM disabled (low-end device)" });
      }

      // -- HeadTTS ------------------------------------------------------
      if (caps.tier === "high" || caps.tier === "medium") {
        try {
          await initHeadTTS({
            onProgress: (p) => !cancelled && setTtsProgress(p),
          });
          if (!cancelled) {
            setTtsReady(true);
            setTtsProgress({ progress: 1, text: "TTS ready" });
          }
        } catch (e) {
          console.warn("HeadTTS failed, falling back to speakText", e);
          if (!cancelled)
            setTtsProgress({ progress: 1, text: "TTS fallback (browser)" });
        }
      } else {
        setTtsProgress({ progress: 1, text: "TTS fallback (browser)" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [caps]);

  // Unload on unmount to free GPU memory.
  useEffect(() => {
    return () => {
      unloadWebLLM().catch(() => {});
    };
  }, []);

  // ---------------------------------------------------------------------
  // TTS pump: takes sentences off the queue, synthesises them, and hands
  // the audio + visemes to TalkingHead.speakAudio for perfect lip-sync.
  // ---------------------------------------------------------------------
  const pumpTTS = useCallback(async () => {
    if (ttsPumpingRef.current) return;
    ttsPumpingRef.current = true;
    try {
      while (ttsQueueRef.current.length) {
        const sentence = ttsQueueRef.current.shift();
        if (!sentence) continue;

        if (ttsReady) {
          try {
            const out = await synthesize(sentence);
            // HeadTTS returns sampleRate-based audio; TalkingHead's
            // speakAudio accepts an AudioBuffer OR a typed-array payload.
            await avatarRef.current?.speakAudio({
              audio: out.audio,
              sampleRate: out.sampleRate,
              words: out.words,
              wtimes: out.wtimes,
              wdurations: out.wdurations,
              visemes: out.visemes,
              vtimes: out.vtimes,
              vdurations: out.vdurations,
            });
            continue;
          } catch (e) {
            console.warn("HeadTTS synth failed, falling back", e);
          }
        }
        // Fallback: let TalkingHead do its own TTS+lip-sync.
        await avatarRef.current?.speakText(sentence);
      }
    } finally {
      ttsPumpingRef.current = false;
    }
  }, [ttsReady]);

  const enqueueSentence = useCallback(
    (s) => {
      if (!s) return;
      ttsQueueRef.current.push(s);
      pumpTTS();
    },
    [pumpTTS],
  );

  // ---------------------------------------------------------------------
  // Submit handler
  // ---------------------------------------------------------------------
  const send = useCallback(
    async (text) => {
      const trimmed = (text ?? input).trim();
      if (!trimmed || thinking) return;

      setError(null);
      setInput("");
      setThinking(true);

      const nextHistory = [
        ...messages,
        { role: "user", content: trimmed },
        { role: "assistant", content: "" },
      ];
      setMessages(nextHistory);

      // Abort any previous speaking.
      avatarRef.current?.stopSpeaking();
      ttsQueueRef.current = [];

      const abort = new AbortController();
      abortRef.current = abort;

      const llmMessages = [
        { role: "system", content: systemPrompt },
        ...trimHistory(
          nextHistory
            .slice(0, -1) // drop the empty assistant placeholder
            .map((m) => ({ role: m.role, content: m.content })),
        ),
      ];

      try {
        if (!llmReady) {
          // Text-only graceful fallback: canned reply.
          const reply =
            "The local language model hasn't finished loading (or isn't supported on this device). Once it's ready, I'll answer properly.";
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: reply };
            return copy;
          });
          enqueueSentence(reply);
          return;
        }

        await streamChat({
          messages: llmMessages,
          signal: abort.signal,
          onToken: (tok) => {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              copy[copy.length - 1] = {
                ...last,
                content: (last.content || "") + tok,
              };
              return copy;
            });
          },
          onSentence: (sentence) => {
            enqueueSentence(sentence);
          },
        });
      } catch (e) {
        console.error(e);
        setError(String(e?.message || e));
      } finally {
        setThinking(false);
        abortRef.current = null;
      }
    },
    [input, thinking, messages, systemPrompt, llmReady, enqueueSentence],
  );

  // ---------------------------------------------------------------------
  // Speech-to-text (Web Speech API)
  // ---------------------------------------------------------------------
  const recogniserRef = useRef(null);
  const sttSupported = isWebSpeechAvailable();

  const toggleMic = useCallback(() => {
    if (!sttSupported) {
      setError("Voice input isn't supported in this browser.");
      return;
    }
    if (listening) {
      recogniserRef.current?.stop();
      return;
    }
    setListening(true);
    recogniserRef.current = createWebSpeechRecogniser({
      lang: "en-US",
      onPartial: (t) => setInput(t),
      onFinal: (t) => {
        setListening(false);
        setInput("");
        send(t);
      },
      onError: (err) => {
        setListening(false);
        setError(`Mic error: ${err}`);
      },
      onEnd: () => setListening(false),
    });
    recogniserRef.current?.start();
  }, [listening, send, sttSupported]);

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------
  const unsupported = caps && caps.tier === "unsupported";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
      {/* Avatar pane */}
      <div className="lg:col-span-3">
        <div className="aspect-[3/4] lg:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
          {caps?.webgl ? (
            <TalkingAvatar
              ref={avatarRef}
              onReady={() => setAvatarReady(true)}
              onProgress={(p) => setAvatarProgress(p)}
              onError={(e) =>
                setError(`Avatar error: ${e?.message || String(e)}`)
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm p-6 text-center">
              WebGL isn&apos;t available on this device — showing text chat only.
            </div>
          )}
        </div>

        {/* Loading bars */}
        <div className="mt-4 space-y-2">
          <ProgressBar
            label={avatarReady ? "Avatar loaded" : avatarProgress.text}
            value={avatarProgress.progress}
          />
          <ProgressBar
            label={llmReady ? "LLM loaded" : llmProgress.text}
            value={llmProgress.progress}
          />
          <ProgressBar
            label={ttsReady ? "TTS loaded" : ttsProgress.text}
            value={ttsProgress.progress}
          />
          {caps && (
            <p className="text-xs text-slate-500">
              Tier: <span className="text-slate-300">{caps.tier}</span> · WebGPU:{" "}
              {caps.webgpu ? "yes" : "no"} · {caps.cores} cores ·{" "}
              {caps.deviceMemoryGB} GB RAM
            </p>
          )}
        </div>
      </div>

      {/* Chat pane */}
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur p-4 min-h-[500px] lg:min-h-0 lg:h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-amber-300/90 text-slate-900 ml-auto max-w-[85%]"
                  : "bg-slate-800 text-slate-100 mr-auto max-w-[90%]"
              }`}
            >
              {m.content ||
                (thinking && i === messages.length - 1 ? (
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:300ms]" />
                  </span>
                ) : null)}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-2 text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* Input row */}
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <button
            type="button"
            onClick={toggleMic}
            disabled={unsupported || !sttSupported}
            className={`shrink-0 h-11 w-11 rounded-full flex items-center justify-center border transition-colors ${
              listening
                ? "bg-red-500 text-white border-red-500 animate-pulse"
                : "bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500 disabled:opacity-40"
            }`}
            aria-label={listening ? "Stop listening" : "Start voice input"}
            title={sttSupported ? "Voice input" : "Voice input not supported"}
          >
            <MicIcon active={listening} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              listening ? "Listening…" : "Ask Gabriel about his experience…"
            }
            disabled={thinking}
            className="flex-1 h-11 rounded-full bg-slate-900 border border-slate-700 focus:border-amber-400 focus:outline-none px-4 text-sm text-slate-100 placeholder:text-slate-500 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={thinking || !input.trim()}
            className="shrink-0 h-11 w-11 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400"
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </form>

        <p className="mt-2 text-[11px] text-slate-500">
          Runs fully in your browser after first download. No data leaves the device.
        </p>
      </div>
    </div>
  );
}
