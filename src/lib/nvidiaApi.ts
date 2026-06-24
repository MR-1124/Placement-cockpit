/**
 * Arch Debt #14 fix: Unified NVIDIA NIM API caller.
 *
 * The 3-layer fallback logic was copy-pasted in:
 *  - InterviewSimulatorView.tsx → getInterviewerResponse  (streaming)
 *  - InterviewSimulatorView.tsx → triggerEvaluationFlow   (non-streaming)
 *  - App.tsx → handleSendMessage                          (streaming)
 *
 * This module extracts it into a single well-typed utility so callers
 * can focus on business logic, not retry boilerplate.
 */

const PROXY_URL = "/api-nvidia/v1/chat/completions";
const DIRECT_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_MODEL = "meta/llama-3.1-70b-instruct";

export interface NvidiaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface NvidiaFetchOptions {
  apiKey: string;
  modelName: string;
  messages: NvidiaMessage[];
  /** @default 0.4 */
  temperature?: number;
  /** @default 1000 */
  maxTokens?: number;
  /** When true the response body is an SSE text/event-stream. @default false */
  stream?: boolean;
  /** Optional AbortSignal for cancellation. */
  signal?: AbortSignal;
}

/**
 * Three-layer fallback NIM fetch:
 *  1. Local Vite / Netlify proxy  (/api-nvidia) with configured model
 *  2. Direct NIM HTTPS endpoint   with configured model
 *  3. Direct NIM HTTPS endpoint   with default fallback model
 *
 * Throws if all three layers fail.  Propagates AbortError immediately so
 * callers can catch it separately.
 */
export async function nvidiaFetch(opts: NvidiaFetchOptions): Promise<Response> {
  const {
    apiKey,
    modelName,
    messages,
    temperature = 0.4,
    maxTokens = 1000,
    stream = false,
    signal,
  } = opts;

  const buildBody = (model: string) =>
    JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      ...(stream && { stream: true }),
    });

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  let response: Response | null = null;
  let lastError: unknown = null;

  /** Internal helper — tries one endpoint and handles non-2xx as thrown errors. */
  const tryFetch = async (url: string, model: string): Promise<Response> => {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: buildBody(model),
      ...(signal && { signal }),
    });

    if (!res.ok) {
      // Try to extract a human-readable error from JSON body
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const errJson = await res.clone().json().catch(() => null);
        if (errJson) {
          throw new Error(
            errJson?.error?.message || errJson?.message || `HTTP ${res.status}`
          );
        }
      }
      throw new Error(`HTTP ${res.status} from ${url}`);
    }

    return res;
  };

  // Layer 1: proxy with configured model
  try {
    response = await tryFetch(PROXY_URL, modelName);
    return response;
  } catch (err: any) {
    if (err.name === "AbortError") throw err;
    lastError = err;
  }

  // Layer 2: direct NIM with configured model
  try {
    response = await tryFetch(DIRECT_URL, modelName);
    return response;
  } catch (err: any) {
    if (err.name === "AbortError") throw err;
    lastError = err;
  }

  // Layer 3: direct NIM with default fallback model (skipped if already default)
  if (modelName !== DEFAULT_MODEL) {
    try {
      response = await tryFetch(DIRECT_URL, DEFAULT_MODEL);
      return response;
    } catch (err: any) {
      if (err.name === "AbortError") throw err;
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to connect to NVIDIA NIM API after all retries.");
}
