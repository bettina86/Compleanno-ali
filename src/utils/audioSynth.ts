// Web Audio Synthesizer for "La Canzone dei 40"
// Produces a bright, festive summer birthday tune with upbeat tempo, bassline, and chime chords.

class BirthdaySongSynth {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.8;
  private currentStep: number = 0;
  private timerId: number | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private onStateChange: ((playing: boolean) => void) | null = null;
  private onTimeUpdate: ((currentTime: number, duration: number) => void) | null = null;
  private customUrl: string = '';

  // Happy Birthday + Summer Pop Synth Melody sequence
  // Frequencies in Hz
  private melodyNotes = [
    261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy birthday to you
    261.63, 261.63, 293.66, 261.63, 392.00, 349.23, // Happy birthday to you
    261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, // Happy birthday dear 40
    466.16, 466.16, 440.00, 349.23, 392.00, 349.23, // Happy birthday to you!
    // Summer Pop Bridge
    349.23, 392.00, 440.00, 523.25, 587.33, 523.25, 440.00, 392.00,
  ];

  private noteDurations = [
    0.3, 0.3, 0.6, 0.6, 0.6, 1.2,
    0.3, 0.3, 0.6, 0.6, 0.6, 1.2,
    0.3, 0.3, 0.6, 0.6, 0.6, 0.6, 1.2,
    0.3, 0.3, 0.6, 0.6, 0.6, 1.2,
    0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.8,
  ];

  public setCallbacks(
    onStateChange: (playing: boolean) => void,
    onTimeUpdate?: (currentTime: number, duration: number) => void
  ) {
    this.onStateChange = onStateChange;
    this.onTimeUpdate = onTimeUpdate;
  }

  public setCustomUrl(url: string) {
    this.customUrl = url;
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
  }

  public async play() {
    if (this.customUrl && this.customUrl.trim() !== '') {
      if (!this.customAudio) {
        this.customAudio = new Audio(this.customUrl);
        this.customAudio.volume = this.volume;
        this.customAudio.onended = () => {
          this.isPlaying = false;
          this.onStateChange?.(false);
        };
        this.customAudio.ontimeupdate = () => {
          if (this.customAudio && this.onTimeUpdate) {
            this.onTimeUpdate(this.customAudio.currentTime, this.customAudio.duration || 60);
          }
        };
      }
      try {
        await this.customAudio.play();
        this.isPlaying = true;
        this.onStateChange?.(true);
        return;
      } catch (err) {
        console.warn('Custom audio play error, falling back to synth', err);
      }
    }

    // Synth fallback / native audio synth
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }

    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.isPlaying = true;
    this.onStateChange?.(true);
    this.scheduleNextNote();
  }

  public pause() {
    this.isPlaying = false;
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.onStateChange?.(false);
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setVolume(val: number) {
    this.volume = val;
    if (this.customAudio) {
      this.customAudio.volume = val;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private scheduleNextNote() {
    if (!this.isPlaying || !this.audioCtx) return;

    const freq = this.melodyNotes[this.currentStep];
    const dur = this.noteDurations[this.currentStep] || 0.5;

    // Play chime sound
    this.playTone(freq, dur);
    // Play warm bass root
    this.playBassTone(freq / 2, dur);

    // Notify time update
    const totalDuration = this.noteDurations.reduce((a, b) => a + b, 0);
    const elapsed = this.noteDurations.slice(0, this.currentStep).reduce((a, b) => a + b, 0);
    this.onTimeUpdate?.(elapsed, totalDuration);

    this.currentStep = (this.currentStep + 1) % this.melodyNotes.length;

    this.timerId = window.setTimeout(() => {
      this.scheduleNextNote();
    }, dur * 1000);
  }

  private playTone(freq: number, duration: number) {
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    const now = this.audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25 * this.volume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  private playBassTone(freq: number, duration: number) {
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    const now = this.audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15 * this.volume, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.9);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const globalAudioSynth = new BirthdaySongSynth();
