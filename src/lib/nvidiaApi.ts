/**
 * Unified NVIDIA NIM API caller (Backward-compatible adapter).
 * Delegated to the universal multi-provider engine in `src/lib/aiProviderApi.ts`.
 */

import {
  aiFetch,
  aiStream,
  type AiMessage,
  type AiFetchOptions,
  type AiStreamCallbacks,
} from "./aiProviderApi";
import type { AiProviderId } from "../types/AppTypes";

export type NvidiaMessage = AiMessage;

export interface NvidiaFetchOptions extends Omit<AiFetchOptions, "provider"> {
  provider?: AiProviderId;
}

export type NvidiaStreamCallbacks = AiStreamCallbacks;

/**
 * Backward-compatible nvidiaFetch caller.
 * Delegates to the universal aiFetch engine.
 */
export async function nvidiaFetch(opts: NvidiaFetchOptions): Promise<Response> {
  return aiFetch({
    ...opts,
    provider: opts.provider || "nvidia",
  });
}

/**
 * Backward-compatible nvidiaStream caller.
 * Delegates to the universal aiStream engine.
 */
export async function nvidiaStream(
  opts: Omit<NvidiaFetchOptions, "stream">,
  callbacks?: NvidiaStreamCallbacks
): Promise<string> {
  return aiStream(
    {
      ...opts,
      provider: opts.provider || "nvidia",
    },
    callbacks
  );
}

export * from "./aiProviderApi";
