// Device capability detection for the talking-clone page.
// We use this to pick a sensible WebLLM model and to gracefully
// downgrade to text-only mode on machines that cannot run a 3B model.

export async function detectCapabilities() {
  if (typeof window === "undefined") {
    return {
      webgpu: false,
      webgl: false,
      deviceMemoryGB: 0,
      cores: 0,
      mobile: false,
      tier: "unsupported",
    };
  }

  const mobile =
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && window.innerWidth < 900);

  const deviceMemoryGB = navigator.deviceMemory || 4; // Safari hides it, assume 4
  const cores = navigator.hardwareConcurrency || 4;

  let webgpu = false;
  try {
    if ("gpu" in navigator) {
      const adapter = await navigator.gpu.requestAdapter();
      webgpu = !!adapter;
    }
  } catch {
    webgpu = false;
  }

  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }

  // Tiering policy:
  //   high   -> 3B model, full avatar + neural TTS
  //   medium -> 1.5B model, full avatar + neural TTS
  //   low    -> avatar + browser SpeechSynthesis (no WebLLM)
  //   text   -> chat only, no avatar, no LLM (SSR-free fallback)
  let tier = "text";
  if (webgpu && deviceMemoryGB >= 8 && cores >= 8 && !mobile) tier = "high";
  else if (webgpu && deviceMemoryGB >= 6) tier = "medium";
  else if (webgl) tier = "low";

  return { webgpu, webgl, deviceMemoryGB, cores, mobile, tier };
}

// WebLLM model choices per tier. These ids ship with @mlc-ai/web-llm's
// prebuiltAppConfig — see https://github.com/mlc-ai/web-llm#model-list
export const MODEL_BY_TIER = {
  high: "Llama-3.2-3B-Instruct-q4f16_1-MLC",
  medium: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
  low: null, // no WebLLM on low-tier devices
  text: null,
  unsupported: null,
};
