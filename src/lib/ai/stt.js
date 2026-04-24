// Speech-to-Text.
//
// Primary:   Web Speech API (SpeechRecognition / webkitSpeechRecognition)
//            - zero download, lowest latency, works in Chrome/Edge/Safari
// Secondary: whisper-web via @xenova/transformers (lazy, optional)
//            - used on-demand when the user opts in for "high accuracy"

export function isWebSpeechAvailable() {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Create a continuous Web Speech recogniser.
 * Returns a controller with .start()/.stop() and event callbacks.
 */
export function createWebSpeechRecogniser({
  lang = "en-US",
  onPartial,
  onFinal,
  onError,
  onEnd,
} = {}) {
  if (!isWebSpeechAvailable()) return null;

  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new Rec();
  rec.lang = lang;
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 1;

  let finalText = "";

  rec.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    if (interim) onPartial?.(interim);
    if (finalText) onFinal?.(finalText.trim());
  };
  rec.onerror = (e) => onError?.(e.error || "speech-error");
  rec.onend = () => onEnd?.();

  return {
    start: () => {
      finalText = "";
      try {
        rec.start();
      } catch (err) {
        onError?.(String(err));
      }
    },
    stop: () => {
      try {
        rec.stop();
      } catch (_e) {
        // already stopped
      }
    },
    abort: () => {
      try {
        rec.abort();
      } catch (_e) {
        // already aborted
      }
    },
  };
}

// Optional high-accuracy Whisper fallback. Only imported on demand.
let _whisperPipe = null;
export async function transcribeWithWhisper(audioFloat32, sampleRate = 16000, onProgress) {
  if (!_whisperPipe) {
    const { pipeline } = await import("@xenova/transformers");
    _whisperPipe = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en", {
      progress_callback: (r) => onProgress?.(r),
    });
  }
  const out = await _whisperPipe(audioFloat32, { sampling_rate: sampleRate });
  return (out?.text || "").trim();
}
