/**
 * Cybernetic Audio Telemetry Engine
 * Pure Web Audio API synthesized procedural sound effects.
 * Zero external audio files required. Zero latency.
 */

class AudioTelemetryEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.3;

  constructor() {
    // Read initial settings from localStorage if available
    try {
      const savedSettings = localStorage.getItem("placement_prep_state");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.settings) {
          if (typeof parsed.settings.soundEnabled === "boolean") {
            this.isMuted = !parsed.settings.soundEnabled;
          }
          if (typeof parsed.settings.soundVolume === "number") {
            this.volume = Math.max(0, Math.min(1, parsed.settings.soundVolume));
          }
        }
      }
    } catch {
      // Use defaults
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Tactile micro-click for buttons and tabs
   */
  public click() {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // AudioContext safe fallback
    }
  }

  /**
   * Satisfying harmonic dual-tone chirp for habit and checkbox toggles
   */
  public check() {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      // 523Hz (C5) jumping to 880Hz (A5)
      osc1.frequency.setValueAtTime(523, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.07);

      osc2.frequency.setValueAtTime(1046, now);
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.07);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.09);
      osc2.stop(now + 0.09);
    } catch {
      // Safe fallback
    }
  }

  /**
   * Resonant pentatonic chime for streak increments and goal milestones
   */
  public streak() {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // C5, E5, G5 triad notes
      const notes = [523.25, 659.25, 783.99];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(this.volume * 0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {
      // Safe fallback
    }
  }

  /**
   * Heroic ascending arpeggio fanfare on level-up or badge unlock
   */
  public levelUp() {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // D4, G4, B4, D5, G5
      const freqs = [293.66, 392.00, 493.88, 587.33, 783.99, 1046.50];
      const now = ctx.currentTime;

      freqs.forEach((freq, idx) => {
        const start = now + idx * 0.055;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === freqs.length - 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, start);

        const duration = idx === freqs.length - 1 ? 0.6 : 0.25;
        gain.gain.setValueAtTime(this.volume * 0.38, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + duration + 0.01);
      });
    } catch {
      // Safe fallback
    }
  }

  /**
   * Soft dual-beep alert for focus timers and interview transitions
   */
  public alert() {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [0, 0.12].forEach(delay => {
        const start = now + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(740, start);

        gain.gain.setValueAtTime(this.volume * 0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.09);
      });
    } catch {
      // Safe fallback
    }
  }

  /**
   * Sonar radar pulse when AI response payload begins streaming
   */
  public sonar() {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);

      gain.gain.setValueAtTime(this.volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Safe fallback
    }
  }
}

export const audioTelemetry = new AudioTelemetryEngine();
