/* eslint-env browser, es2020 */
// HeadTTS wrapper.
//
// HeadTTS (https://github.com/met4citizen/HeadTTS) is a Kokoro-based
// neural TTS shipped as ESM-on-GitHub. We load it via esm.sh so it can
// resolve its own transformers.js + onnxruntime-web deps without
// polluting the rest of the app.
//
// The library returns an object compatible with TalkingHead.speakAudio:
//   { audio, words, wtimes, wdurations, visemes, vtimes, vdurations }
//
// If HeadTTS fails to load (e.g. no WebGPU/wasm on the device) we fall
// back to window.speechSynthesis with no viseme data — TalkingHead's
// built-in speakText also works in that case.

const HEADTTS_ESM = "https://esm.sh/gh/met4citizen/HeadTTS/modules/headtts-client.mjs";

let _client = null;
let _ready = null;

export async function initHeadTTS({ onProgress, voice = "af_bella" } = {}) {
  if (_client) return _client;
  if (_ready) return _ready;

  _ready = (async () => {
    onProgress?.({ progress: 0, text: "Loading TTS runtime…" });
    // Dynamic import – only executes in the browser.
    const mod = await import(/* webpackIgnore: true */ HEADTTS_ESM);
    const HeadTTS = mod.HeadTTS || mod.default;

    const client = new HeadTTS({
      // Kokoro-82M is small and voice-rich; runs on WebGPU or wasm.
      model: "onnx-community/Kokoro-82M-v1.0-ONNX",
      dtype: "q8",
      device: "webgpu", // falls back internally to "wasm" if unavailable
      voice,
      onProgress: (r) => {
        onProgress?.({
          progress: r?.progress ?? 0,
          text: r?.status || "Loading TTS…",
        });
      },
    });

    await client.ready?.();
    _client = client;
    return client;
  })();

  try {
    return await _ready;
  } catch (e) {
    _ready = null;
    throw e;
  }
}

/**
 * Synthesize a single sentence. Returns the TalkingHead-compatible payload.
 * @param {string} text
 * @param {object} [opts] { voice, speed, lang }
 */
export async function synthesize(text, opts = {}) {
  if (!_client) throw new Error("HeadTTS not initialised");
  // The client returns { audio:Float32Array, sampleRate, words, wtimes,
  // wdurations, visemes, vtimes, vdurations }
  const out = await _client.synthesize(text, {
    voice: opts.voice,
    speed: opts.speed ?? 1.0,
    lang: opts.lang ?? "en-us",
  });
  return out;
}

// Browser SpeechSynthesis fallback — no visemes, but TalkingHead will
// animate jaw from audio amplitude instead.
export function speakWithBrowserTTS(text, { voiceName, rate = 1 } = {}) {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    if (voiceName) {
      const v = window.speechSynthesis.getVoices().find((v) => v.name === voiceName);
      if (v) u.voice = v;
    }
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}
