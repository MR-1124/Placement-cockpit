/**
 * Speech Engine for Voice Interviewer Mode
 * Wraps Web Speech API (SpeechRecognition / webkitSpeechRecognition) for Speech-to-Text
 * and window.speechSynthesis for Text-to-Speech playback.
 */

// Typing for Web Speech API
interface IWindowSpeechRecognition extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class SpeechRecognitionEngine {
  private recognition: any = null;
  private isListening: boolean = false;

  public isSupported(): boolean {
    if (typeof window === "undefined") return false;
    const win = window as unknown as IWindowSpeechRecognition;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public start(
    onInterim: (transcript: string) => void,
    onFinal: (transcript: string) => void,
    onError: (errorMessage: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.isSupported()) {
      onError("Speech Recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.");
      return false;
    }

    try {
      this.stop(); // Stop any existing session
      const win = window as unknown as IWindowSpeechRecognition;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();

      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      let finalAccumulated = "";

      this.recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalAccumulated += (finalAccumulated ? " " : "") + transcript.trim();
            onFinal(finalAccumulated);
          } else {
            interim += transcript;
          }
        }
        if (interim) {
          onInterim((finalAccumulated ? finalAccumulated + " " : "") + interim);
        }
      };

      this.recognition.onerror = (event: any) => {
        let msg = "Microphone recognition error.";
        if (event.error === "not-allowed") {
          msg = "Microphone access denied. Please allow microphone permissions in browser settings.";
        } else if (event.error === "no-speech") {
          msg = "No speech detected. Please speak clearly into your microphone.";
        } else if (event.error === "audio-capture") {
          msg = "No microphone hardware detected.";
        } else if (event.error === "network") {
          msg = "Network error during speech recognition.";
        }
        this.isListening = false;
        onError(msg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      this.isListening = false;
      onError(err?.message || "Failed to initialize microphone.");
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Safe fallback
      }
    }
    this.isListening = false;
  }

  public abort(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // Safe fallback
      }
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export class SpeechSynthesisEngine {
  private isSpeaking: boolean = false;

  public isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) return [];
    return window.speechSynthesis.getVoices();
  }

  /**
   * Filter out markdown code blocks, bracket tags, URLs, and formatting
   * to ensure speech reads smoothly and naturally.
   */
  public stripMarkdownAndTags(text: string): string {
    if (!text) return "";
    let cleaned = text;

    // Remove thinking block tags <think>...</think>
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");

    // Remove markdown code blocks ```lang ... ```
    cleaned = cleaned.replace(/```[\s\S]*?```/g, " [code snippet omitted] ");

    // Remove bracketed internal AI status tags e.g. [PHASE_TRANSITION: ...]
    cleaned = cleaned.replace(/\[[A-Z_]+(?::[^\]]*)?\]/g, "");

    // Remove inline code blocks `code`
    cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

    // Remove markdown links [text](url) -> text
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Remove URLs
    cleaned = cleaned.replace(/https?:\/\/\S+/g, "");

    // Remove Markdown headers (# Header)
    cleaned = cleaned.replace(/^#+\s+/gm, "");

    // Remove bullet point markers (*, -, 1.)
    cleaned = cleaned.replace(/^[\s*•\-]+(?=\S)/gm, "");
    cleaned = cleaned.replace(/^\d+\.\s+/gm, "");

    // Remove bold/italics markers
    cleaned = cleaned.replace(/[*_]{1,3}/g, "");

    // Collapse multiple whitespace
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return cleaned;
  }

  public speak(
    rawText: string,
    options?: {
      rate?: number;
      pitch?: number;
      voiceIndex?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    }
  ): void {
    if (!this.isSupported()) return;

    this.stop(); // Abort previous speech

    const cleanText = this.stripMarkdownAndTags(rawText);
    if (!cleanText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = options?.rate ?? 1.0;
      utterance.pitch = options?.pitch ?? 1.0;

      const voices = this.getVoices();
      if (voices.length > 0) {
        if (typeof options?.voiceIndex === "number" && voices[options.voiceIndex]) {
          utterance.voice = voices[options.voiceIndex];
        } else {
          // Prefer natural English voice if available
          const naturalVoice = voices.find(
            v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel"))
          ) || voices.find(v => v.lang.startsWith("en"));
          if (naturalVoice) {
            utterance.voice = naturalVoice;
          }
        }
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (options?.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (options?.onEnd) options.onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (options?.onError) options.onError();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
    }
  }

  public stop(): void {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe fallback
      }
    }
    this.isSpeaking = false;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speechRecognitionEngine = new SpeechRecognitionEngine();
export const speechSynthesisEngine = new SpeechSynthesisEngine();
