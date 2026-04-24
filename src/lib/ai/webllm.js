// Thin wrapper around @mlc-ai/web-llm that:
//   1. Loads a model with progress reporting.
//   2. Streams chat completions and yields sentence chunks so
//      the TTS layer can start speaking before the LLM is done.
//
// We stream the raw deltas AND a sentence-level stream — the caller
// picks whichever it needs (UI wants tokens, TTS wants full sentences).

let _engine = null;
let _modelId = null;

export async function initWebLLM({ modelId, onProgress }) {
  if (_engine && _modelId === modelId) return _engine;

  // Dynamic import so the 40MB+ wasm runtime only loads client-side.
  const { CreateMLCEngine } = await import("@mlc-ai/web-llm");

  _engine = await CreateMLCEngine(modelId, {
    initProgressCallback: (r) => {
      // r = { progress, timeElapsed, text }
      onProgress?.({
        progress: r.progress ?? 0,
        text: r.text || "Loading model…",
      });
    },
  });
  _modelId = modelId;
  return _engine;
}

export function getEngine() {
  return _engine;
}

// Splits a running text buffer at the last sentence boundary.
// Returns [completedSentences, leftoverTail].
function splitSentences(buffer) {
  // Match .!? or a newline, followed by optional closing quote/bracket then a space/EOL.
  const re = /([.!?…]+["')\]]?)(\s+|$)/g;
  let lastEnd = 0;
  const out = [];
  let m;
  while ((m = re.exec(buffer)) !== null) {
    const end = m.index + m[1].length;
    const sentence = buffer.slice(lastEnd, end).trim();
    if (sentence.length > 0) out.push(sentence);
    lastEnd = end + (m[2] ? m[2].length : 0);
  }
  return [out, buffer.slice(lastEnd)];
}

/**
 * Stream a chat reply.
 *
 * @param {object} opts
 * @param {Array<{role:'system'|'user'|'assistant', content:string}>} opts.messages
 * @param {(token:string)=>void}   [opts.onToken]     fired per delta (for typing UI)
 * @param {(sentence:string)=>void}[opts.onSentence]  fired once per complete sentence (for TTS)
 * @param {AbortSignal}            [opts.signal]
 * @returns {Promise<string>} the full assistant message
 */
export async function streamChat({ messages, onToken, onSentence, signal }) {
  if (!_engine) throw new Error("WebLLM engine not initialised");

  const stream = await _engine.chat.completions.create({
    messages,
    stream: true,
    temperature: 0.6,
    max_tokens: 400,
  });

  let full = "";
  let pending = "";

  for await (const chunk of stream) {
    if (signal?.aborted) {
      try {
        await _engine.interruptGenerate();
      } catch (_e) {
        // engine may already be idle
      }
      break;
    }
    const delta = chunk.choices?.[0]?.delta?.content || "";
    if (!delta) continue;
    full += delta;
    pending += delta;
    onToken?.(delta);

    const [sentences, tail] = splitSentences(pending);
    if (sentences.length) {
      pending = tail;
      for (const s of sentences) onSentence?.(s);
    }
  }

  // Flush any trailing fragment as a final "sentence".
  const tail = pending.trim();
  if (tail.length) onSentence?.(tail);

  return full;
}

export async function unloadWebLLM() {
  try {
    await _engine?.unload?.();
  } catch (_e) {
    // ignore
  }
  _engine = null;
  _modelId = null;
}
