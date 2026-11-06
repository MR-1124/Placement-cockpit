import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  aiFetch,
  AI_PROVIDERS,
  pingProvider,
} from "./aiProviderApi";

describe("aiProviderApi multi-provider engine", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exports provider catalogs with complete metadata and recommended models", () => {
    expect(AI_PROVIDERS.nvidia).toBeDefined();
    expect(AI_PROVIDERS.groq).toBeDefined();
    expect(AI_PROVIDERS.openai).toBeDefined();
    expect(AI_PROVIDERS.anthropic).toBeDefined();
    expect(AI_PROVIDERS.gemini).toBeDefined();
    expect(AI_PROVIDERS.openrouter).toBeDefined();
    expect(AI_PROVIDERS.custom).toBeDefined();

    expect(AI_PROVIDERS.groq.defaultModel).toBe("llama-3.3-70b-versatile");
    expect(AI_PROVIDERS.anthropic.defaultModel).toBe("claude-3-5-sonnet-20241022");
    expect(AI_PROVIDERS.openai.defaultModel).toBe("gpt-4o-mini");
  });

  it("formats Anthropic requests with top-level system parameter and x-api-key header", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          content: [{ text: "Hello from Claude" }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const res = await aiFetch({
      provider: "anthropic",
      apiKey: "sk-ant-test-key",
      modelName: "claude-3-5-sonnet-20241022",
      messages: [
        { role: "system", content: "You are a helpful mentor." },
        { role: "user", content: "Explain binary search." },
      ],
    });

    expect(res.ok).toBe(true);
    expect(fetchSpy).toHaveBeenCalled();

    const [calledUrl, calledInit] = fetchSpy.mock.calls[0];
    expect(calledUrl).toBe("/api-anthropic/v1/messages");
    expect(calledInit?.headers).toMatchObject({
      "x-api-key": "sk-ant-test-key",
      "anthropic-version": "2023-06-01",
    });

    const parsedBody = JSON.parse(calledInit?.body as string);
    expect(parsedBody.system).toBe("You are a helpful mentor.");
    expect(parsedBody.messages).toEqual([
      { role: "user", content: "Explain binary search." },
    ]);
  });

  it("formats OpenAI and Groq requests with standard Bearer authorization", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "OK" } }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const res = await aiFetch({
      provider: "groq",
      apiKey: "gsk_test123",
      modelName: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "ping" }],
    });

    expect(res.ok).toBe(true);
    const [calledUrl, calledInit] = fetchSpy.mock.calls[0];
    expect(calledUrl).toBe("/api-groq/v1/chat/completions");
    expect(calledInit?.headers).toMatchObject({
      Authorization: "Bearer gsk_test123",
    });

    const parsedBody = JSON.parse(calledInit?.body as string);
    expect(parsedBody.model).toBe("llama-3.3-70b-versatile");
    expect(parsedBody.messages).toEqual([{ role: "user", content: "ping" }]);
  });

  it("falls back to direct URL if proxy endpoint fails", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      // First attempt (proxy) fails with 404
      .mockResolvedValueOnce(new Response("Not Found", { status: 404 }))
      // Second attempt (direct HTTPS) succeeds
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ choices: [{ message: { content: "Fallback success" } }] }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );

    const res = await aiFetch({
      provider: "groq",
      apiKey: "gsk_test",
      modelName: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "test" }],
    });

    expect(res.ok).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[0][0]).toBe("/api-groq/v1/chat/completions");
    expect(fetchSpy.mock.calls[1][0]).toBe("https://api.groq.com/openai/v1/chat/completions");
  });

  it("correctly pings provider and returns latency", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({ choices: [{ message: { content: "OK" } }] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const pingResult = await pingProvider("openai", "sk-test-key");
    expect(pingResult.success).toBe(true);
    expect(pingResult.message).toContain("Connected successfully");
    expect(typeof pingResult.latencyMs).toBe("number");
  });
});
