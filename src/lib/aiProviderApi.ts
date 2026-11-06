/**
 * Enterprise Multi-Provider AI Engine for Placement Cockpit.
 *
 * Supports:
 *  - NVIDIA NIM (Default baseline, free microservices)
 *  - Groq (Ultra-low latency inference)
 *  - OpenAI (GPT-4o, GPT-4o-mini, o1/o3-mini)
 *  - Anthropic (Claude 3.5 Sonnet, Claude 3.5 Haiku)
 *  - Google Gemini (Gemini 2.0 Flash, Gemini 1.5 Pro)
 *  - OpenRouter (Unified aggregator with 200+ models)
 *  - Custom / Local (Ollama, vLLM, LM Studio, Together AI)
 */

import type { AiProviderId } from "../types/AppTypes";

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description?: string;
  badge?: "Recommended" | "Reasoning" | "Fast" | "Free" | "Vision";
}

export interface ProviderMeta {
  id: AiProviderId;
  name: string;
  shortName: string;
  badgeColor: string;
  website: string;
  keyPlaceholder: string;
  keyPrefix?: string;
  defaultModel: string;
  proxyUrl: string;
  directUrl: string;
  models: ModelOption[];
  requiresBaseUrl?: boolean;
}

export const AI_PROVIDERS: Record<AiProviderId, ProviderMeta> = {
  nvidia: {
    id: "nvidia",
    name: "NVIDIA NIM",
    shortName: "NVIDIA",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    website: "https://build.nvidia.com",
    keyPlaceholder: "nvapi-...",
    keyPrefix: "nvapi-",
    defaultModel: "meta/llama-3.3-70b-instruct",
    proxyUrl: "/api-nvidia/v1/chat/completions",
    directUrl: "https://integrate.api.nvidia.com/v1/chat/completions",
    models: [
      { id: "meta/llama-3.3-70b-instruct", name: "Llama 3.3 70B", description: "State-of-the-art open weights", badge: "Recommended" },
      { id: "deepseek-ai/deepseek-r1", name: "DeepSeek R1", description: "Deep reasoning & math logic", badge: "Reasoning" },
      { id: "meta/llama-3.1-70b-instruct", name: "Llama 3.1 70B", description: "Reliable general instruction" },
      { id: "meta/llama-3.1-405b-instruct", name: "Llama 3.1 405B", description: "Maximum capability model" },
      { id: "nvidia/llama-3.1-nemotron-70b-instruct", name: "Nemotron 70B", description: "NVIDIA enterprise aligned" },
      { id: "mistralai/mixtral-8x22b-instruct-v0.1", name: "Mixtral 8x22B", description: "MoE reasoning" },
    ],
  },
  groq: {
    id: "groq",
    name: "Groq LPU",
    shortName: "GROQ",
    badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    website: "https://console.groq.com",
    keyPlaceholder: "gsk_...",
    keyPrefix: "gsk_",
    defaultModel: "llama-3.3-70b-versatile",
    proxyUrl: "/api-groq/v1/chat/completions",
    directUrl: "https://api.groq.com/openai/v1/chat/completions",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile", description: "500+ tokens/sec, ideal for mock interview", badge: "Recommended" },
      { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill 70B", description: "High-speed reasoning engine", badge: "Reasoning" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", description: "Instantaneous sub-100ms response", badge: "Fast" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B 32k", description: "Balanced MoE long context" },
    ],
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    shortName: "OPENAI",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    website: "https://platform.openai.com/api-keys",
    keyPlaceholder: "sk-proj-...",
    keyPrefix: "sk-",
    defaultModel: "gpt-4o-mini",
    proxyUrl: "/api-openai/v1/chat/completions",
    directUrl: "https://api.openai.com/v1/chat/completions",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Affordable, fast, intelligent", badge: "Recommended" },
      { id: "gpt-4o", name: "GPT-4o (Omni)", description: "Flagship intelligence & coding", badge: "Vision" },
      { id: "o3-mini", name: "o3-mini (Reasoning)", description: "Next-gen competitive reasoning", badge: "Reasoning" },
      { id: "o1-mini", name: "o1-mini", description: "Stem & algorithm reasoning", badge: "Reasoning" },
    ],
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    shortName: "CLAUDE",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    website: "https://console.anthropic.com",
    keyPlaceholder: "sk-ant-...",
    keyPrefix: "sk-ant-",
    defaultModel: "claude-3-5-sonnet-20241022",
    proxyUrl: "/api-anthropic/v1/messages",
    directUrl: "https://api.anthropic.com/v1/messages",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", description: "World-class coding & architectural precision", badge: "Recommended" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", description: "Ultra-fast response with high IQ", badge: "Fast" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus", description: "Deep complex reasoning" },
    ],
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    shortName: "GEMINI",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    website: "https://aistudio.google.com/app/apikey",
    keyPlaceholder: "AIzaSy...",
    defaultModel: "gemini-2.0-flash",
    proxyUrl: "/api-gemini/v1beta/openai/chat/completions",
    directUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Next-gen multimodal speed & 1M context", badge: "Recommended" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Deep 2M token context & complex problem solving" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Lightweight fast assistant", badge: "Fast" },
    ],
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    shortName: "OPENROUTER",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    website: "https://openrouter.ai/keys",
    keyPlaceholder: "sk-or-v1-...",
    keyPrefix: "sk-or-",
    defaultModel: "meta-llama/llama-3.3-70b-instruct",
    proxyUrl: "/api-openrouter/v1/chat/completions",
    directUrl: "https://openrouter.ai/api/v1/chat/completions",
    models: [
      { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B Instruct", description: "Open weight leader", badge: "Recommended" },
      { id: "deepseek/deepseek-r1", name: "DeepSeek R1", description: "Open reasoning powerhouse", badge: "Reasoning" },
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", description: "Anthropic via OpenRouter" },
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)", description: "Free tier on OpenRouter", badge: "Free" },
      { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", description: "OpenAI via OpenRouter" },
    ],
  },
  custom: {
    id: "custom",
    name: "Custom / Local Endpoint",
    shortName: "CUSTOM",
    badgeColor: "bg-slate-500/10 text-slate-300 border-slate-500/30",
    website: "http://localhost:11434",
    keyPlaceholder: "Optional or custom token...",
    defaultModel: "llama3:latest",
    proxyUrl: "",
    directUrl: "http://localhost:11434/v1/chat/completions",
    models: [
      { id: "llama3:latest", name: "Ollama Llama 3", description: "Local Ollama host (port 11434)" },
      { id: "qwen2.5-coder:latest", name: "Qwen 2.5 Coder", description: "Local specialized coding model" },
      { id: "deepseek-r1:latest", name: "DeepSeek R1 Local", description: "Local reasoning" },
    ],
    requiresBaseUrl: true,
  },
};

export interface AiFetchOptions {
  provider?: AiProviderId;
  apiKey: string;
  modelName: string;
  messages: AiMessage[];
  /** @default 0.4 */
  temperature?: number;
  /** @default 4096 */
  maxTokens?: number;
  /** When true the response body is an SSE stream. @default false */
  stream?: boolean;
  signal?: AbortSignal;
  customBaseUrl?: string;
}

export interface AiStreamCallbacks {
  onStatus?: (status: string) => void;
  onDelta?: (combinedText: string, contentDelta?: string, reasoningDelta?: string) => void;
}

/**
 * Universal multi-provider AI fetcher.
 * Automatically adapts request body and headers for Anthropic, OpenAI, Groq, Gemini, OpenRouter, and NVIDIA NIM.
 * Employs proxy-first dual-layer routing with fallback to direct HTTPS.
 */
export async function aiFetch(opts: AiFetchOptions): Promise<Response> {
  const providerId: AiProviderId = opts.provider || "nvidia";
  const providerMeta = AI_PROVIDERS[providerId] || AI_PROVIDERS.nvidia;

  const {
    apiKey,
    modelName = providerMeta.defaultModel,
    messages,
    temperature = 0.4,
    maxTokens = 4096,
    stream = false,
    signal,
    customBaseUrl,
  } = opts;

  // 1. Build Provider-Specific Request Body & Headers
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  let bodyJson: Record<string, any> = {};

  if (providerId === "anthropic") {
    // Anthropic Messages API:
    // System prompt must be passed as top-level 'system' field, not inside messages array.
    const systemMessages = messages.filter((m) => m.role === "system");
    const nonSystemMessages = messages.filter((m) => m.role !== "system");

    headers = {
      ...headers,
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    };

    bodyJson = {
      model: modelName,
      max_tokens: maxTokens,
      messages: nonSystemMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      ...(systemMessages.length > 0 && {
        system: systemMessages.map((m) => m.content).join("\n\n"),
      }),
      ...(stream && { stream: true }),
    };
  } else {
    // OpenAI Compatible Format (Groq, OpenAI, Gemini, OpenRouter, NVIDIA, Custom)
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    if (providerId === "openrouter") {
      headers["HTTP-Referer"] = "https://placement-cockpit.local";
      headers["X-Title"] = "Placement Cockpit";
    }

    bodyJson = {
      model: modelName,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature,
      max_tokens: maxTokens,
      ...(stream && { stream: true }),
    };
  }

  const payload = JSON.stringify(bodyJson);

  // 2. Determine Endpoint URLs (Proxy vs Direct)
  let primaryUrl = providerMeta.proxyUrl;
  let fallbackUrl = providerMeta.directUrl;

  if (providerId === "custom") {
    const base = customBaseUrl ? customBaseUrl.replace(/\/+$/, "") : "http://localhost:11434/v1";
    primaryUrl = base.endsWith("/chat/completions") ? base : `${base}/chat/completions`;
    fallbackUrl = primaryUrl;
  }

  const tryFetch = async (url: string): Promise<Response> => {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: payload,
      ...(signal && { signal }),
    });

    if (!res.ok) {
      let errorMsg = `HTTP ${res.status}`;
      try {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const errData = await res.clone().json().catch(() => null);
          if (errData) {
            errorMsg =
              errData.error?.message ||
              errData.message ||
              errData.detail ||
              JSON.stringify(errData);
          }
        } else {
          const text = await res.clone().text().catch(() => "");
          if (text) errorMsg = text.slice(0, 200);
        }
      } catch {
        // Fallback to HTTP status
      }
      throw new Error(`[${providerMeta.name}] ${errorMsg}`);
    }

    return res;
  };

  let lastError: unknown = null;

  // Try Layer 1: Local / Netlify Proxy (solves browser CORS)
  if (primaryUrl && primaryUrl.startsWith("/")) {
    try {
      return await tryFetch(primaryUrl);
    } catch (err: any) {
      if (err.name === "AbortError") throw err;
      lastError = err;
    }
  }

  // Try Layer 2: Direct Provider HTTPS Endpoint
  try {
    return await tryFetch(fallbackUrl);
  } catch (err: any) {
    if (err.name === "AbortError") throw err;
    lastError = err;
  }

  throw (
    lastError ||
    new Error(`Failed to connect to ${providerMeta.name} after all connection attempts.`)
  );
}

/**
 * Universal multi-provider streaming caller.
 * Handles SSE streams for OpenAI, Anthropic, Groq, Gemini, OpenRouter, and NVIDIA NIM,
 * seamlessly extracting <think> reasoning tags and content deltas.
 */
export async function aiStream(
  opts: Omit<AiFetchOptions, "stream">,
  callbacks?: AiStreamCallbacks
): Promise<string> {
  const providerId: AiProviderId = opts.provider || "nvidia";
  const providerMeta = AI_PROVIDERS[providerId] || AI_PROVIDERS.nvidia;

  callbacks?.onStatus?.(`Connecting to ${providerMeta.name}...`);

  const response = await aiFetch({
    ...opts,
    stream: true,
  });

  callbacks?.onStatus?.("Receiving stream payload...");

  const contentType = response.headers.get("content-type") || "";
  let accumulatedContent = "";
  let accumulatedReasoning = "";

  if (contentType.includes("text/event-stream") && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === "data: [DONE]") continue;

        // 1. Anthropic SSE Event Format
        if (providerId === "anthropic") {
          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.type === "content_block_delta" && data.delta?.text) {
                accumulatedContent += data.delta.text;
                callbacks?.onStatus?.("Responding...");
                callbacks?.onDelta?.(accumulatedContent, data.delta.text);
              }
            } catch {
              // Ignore partial chunk parsing
            }
          }
          continue;
        }

        // 2. OpenAI / Groq / Gemini / OpenRouter / NVIDIA SSE Format
        if (trimmed.startsWith("data: ")) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const delta = parsed.choices?.[0]?.delta;

            if (delta) {
              if (delta.reasoning_content) {
                accumulatedReasoning += delta.reasoning_content;
                callbacks?.onStatus?.("Thinking...");
              } else if (delta.content) {
                accumulatedContent += delta.content;
                callbacks?.onStatus?.("Responding...");
              }

              let responseText = "";
              if (accumulatedReasoning) {
                responseText += `<think>\n${accumulatedReasoning}\n</think>\n`;
              }
              responseText += accumulatedContent;
              callbacks?.onDelta?.(responseText, delta.content, delta.reasoning_content);
            }
          } catch {
            // Ignore partial chunk parsing
          }
        }
      }
    }
  } else {
    // Non-streaming fallback response parsing
    const data = await response.json();
    if (providerId === "anthropic") {
      accumulatedContent = data.content?.[0]?.text || "";
    } else {
      const msg = data.choices?.[0]?.message;
      if (msg) {
        accumulatedReasoning = msg.reasoning_content || "";
        accumulatedContent = msg.content || "";
      }
    }
  }

  let finalReply = "";
  if (accumulatedReasoning && (!accumulatedContent || !accumulatedContent.includes("<think>"))) {
    finalReply += `<think>\n${accumulatedReasoning}\n</think>\n`;
  }
  finalReply += accumulatedContent || "No response received.";

  return finalReply;
}

/**
 * Diagnostic ping to test provider credentials and connectivity.
 */
export async function pingProvider(
  provider: AiProviderId,
  apiKey: string,
  customBaseUrl?: string
): Promise<{ success: boolean; latencyMs?: number; message: string }> {
  const meta = AI_PROVIDERS[provider] || AI_PROVIDERS.nvidia;
  const start = performance.now();

  try {
    const res = await aiFetch({
      provider,
      apiKey,
      modelName: meta.defaultModel,
      messages: [{ role: "user", content: "Reply with the word 'OK'." }],
      maxTokens: 5,
      temperature: 0,
      customBaseUrl,
    });

    const elapsed = Math.round(performance.now() - start);

    if (res.ok) {
      return {
        success: true,
        latencyMs: elapsed,
        message: `Connected successfully (${elapsed}ms latency)!`,
      };
    } else {
      return {
        success: false,
        message: `HTTP error: ${res.status} ${res.statusText}`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to reach provider endpoint.",
    };
  }
}
