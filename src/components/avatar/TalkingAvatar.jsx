"use client";

// TalkingAvatar — mounts met4citizen/TalkingHead into a div and exposes
// an imperative API to the parent via ref:
//
//   ref.current.speakAudio({ audio, words, wtimes, wdurations, visemes, vtimes, vdurations })
//   ref.current.speakText(text)
//   ref.current.stopSpeaking()
//   ref.current.setMood('happy' | 'neutral' | ...)
//
// TalkingHead manages its own Three.js scene/renderer. We deliberately
// do NOT wrap it in @react-three/fiber's <Canvas> — that would create a
// second renderer on top of TH's, waste GPU, and break lip-sync timing.
// R3F is great, but this library owns the scene.

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// Loaded from esm.sh so the library can resolve its own `three` build
// without clashing with the portfolio's three@0.169.
const TALKINGHEAD_ESM =
  "https://esm.sh/gh/met4citizen/TalkingHead/modules/talkinghead.mjs";

const DEFAULT_AVATAR_URL = "/models/646d9dcdc8a5f5bddbfac913.glb";

const TalkingAvatar = forwardRef(function TalkingAvatar(
  {
    avatarUrl = DEFAULT_AVATAR_URL,
    mood = "neutral",
    lipsyncLang = "en",
    onReady,
    onProgress,
    onError,
  },
  ref,
) {
  const containerRef = useRef(null);
  const headRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error

  // Imperative API for the parent.
  useImperativeHandle(
    ref,
    () => ({
      async speakAudio(payload, opts, onSubtitles) {
        if (!headRef.current) return;
        try {
          await headRef.current.speakAudio(payload, opts || {}, onSubtitles);
        } catch (e) {
          onError?.(e);
        }
      },
      async speakText(text, opts) {
        if (!headRef.current) return;
        try {
          await headRef.current.speakText(text, opts || {});
        } catch (e) {
          onError?.(e);
        }
      },
      stopSpeaking() {
        try {
          headRef.current?.stopSpeaking?.();
        } catch (_e) {
          // non-critical — ignore if nothing is speaking
        }
      },
      setMood(m) {
        try {
          headRef.current?.setMood?.(m);
        } catch (_e) {
          // mood is cosmetic; swallow errors
        }
      },
      start() {
        headRef.current?.start?.();
      },
      stop() {
        headRef.current?.stop?.();
      },
      instance: () => headRef.current,
    }),
    [onError],
  );

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!containerRef.current) return;
      setStatus("loading");
      onProgress?.({ progress: 0, text: "Loading avatar runtime…" });

      try {
        const mod = await import(/* webpackIgnore: true */ TALKINGHEAD_ESM);
        const TalkingHead = mod.TalkingHead || mod.default;
        if (cancelled) return;

        const head = new TalkingHead(containerRef.current, {
          ttsEndpoint: null, // we drive TTS ourselves via speakAudio()
          lipsyncModules: ["en", "fi"], // default lip-sync phoneme mappers
          cameraView: "upper",
          cameraRotateEnable: false,
          cameraPanEnable: false,
          cameraZoomEnable: false,
          avatarMood: mood,
        });
        headRef.current = head;

        await head.showAvatar(
          {
            url: avatarUrl,
            body: "M",
            avatarMood: mood,
            lipsyncLang,
          },
          (ev) => {
            if (!ev || !ev.lengthComputable) return;
            const p = ev.loaded / ev.total;
            onProgress?.({
              progress: p,
              text: `Loading avatar… ${(p * 100).toFixed(0)}%`,
            });
          },
        );

        if (cancelled) {
          head.stop?.();
          return;
        }

        head.start?.();
        setStatus("ready");
        onProgress?.({ progress: 1, text: "Avatar ready" });
        onReady?.(head);
      } catch (e) {
        console.error("[TalkingAvatar] init failed", e);
        setStatus("error");
        onError?.(e);
      }
    }

    boot();

    return () => {
      cancelled = true;
      try {
        headRef.current?.stop?.();
      } catch (_e) {
        // cleanup — ignore
      }
      headRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarUrl]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
        aria-label="Gabriel's 3D avatar"
      />
      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-300 text-sm">
          {status === "error" ? (
            <span>Avatar failed to load</span>
          ) : (
            <span className="animate-pulse">Booting avatar…</span>
          )}
        </div>
      )}
    </div>
  );
});

export default TalkingAvatar;
