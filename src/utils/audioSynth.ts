// Web Audio Synthesizer for "Tanti Auguri a Te" (Happy Birthday)
// Produces a warm, classic music-box melody with gentle harmonies.

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

  // Standard "Tanti Auguri a Te" melody in C major (Hz)
  private melodyNotes = [
    // Phrase 1: "Tanti auguri a te"
    392.00, 392.00, 440.00, 392.00, 523.25, 493.88,
    // Phrase 2: "Tanti auguri a te"
    392.00, 392.00, 440.00, 392.00, 587.33, 523.25,
    // Phrase 3: "Tanti auguri felici"
    392.00, 392.00, 783.99, 659.25, 523.25, 493.88, 440.00,
    // Phrase 4: "Tanti auguri a te!"
    698.46, 698.46, 659.25, 523.25, 587.33, 523.25,
  ];

  // Harmonies (Chords for music box feel)
  private chordNotes = [
    [261.63, 329.63], [261.63, 329.63], [261.63, 329.63], [261.63, 329.63], [261.63, 329.63], [293.66, 392.00],
    [293.66, 392.00], [293.66, 392.00], [293.66, 392.00], [293.66, 392.00], [293.66, 392.00], [261.63, 329.63],
    [261.63, 329.63], [261.63, 329.63], [349.23, 440.00], [349.23, 440.00], [261.63, 329.63], [261.63, 329.63], [349.23, 440.00],
    [349.23, 440.00], [349.23, 440.00], [261.63, 329.63], [261.63, 329.63], [293.66, 392.00], [261.63, 329.63],
  ];

  private noteDurations = [
    0.35, 0.25, 0.6, 0.6, 0.6, 1.2,
    0.35, 0.25, 0.6, 0.6, 0.6, 1.2,
    0.35, 0.25, 0.6, 0.6, 0.6, 0.6, 1.2,
    0.35, 0.25, 0.6, 0.6, 0.6, 1.5,
  ];

  public setCallbacks(
    onStateChange: (playing: boolean) => void,
    onTimeUpdate?: (currentTime: number, duration: number) => void
  ) {
    this.onStateChange = onStateChange;
    this.onTimeUpdate = onTimeUpdate;
  }

  public setCustomUrl(url: string) {
    if (this.customUrl !== url) {
      if (this.isPlaying) {
        this.pause();
      }
      this.customUrl = url;
      if (this.customAudio) {
        this.customAudio.pause();
        this.customAudio = null;
      }
    }
  }

  public async play() {
    if (this.customUrl && this.customUrl.trim() !== '') {
      let playableUrl = this.customUrl.trim();

      // If Suno link passed, attempt audio stream
      const sunoMatch = playableUrl.match(/suno\.com\/(?:s|song|embed)\/([a-zA-Z0-9_-]+)/i);
      if (sunoMatch) {
        const id = sunoMatch[1];
        playableUrl = `https://cdn1.suno.ai/${id}.mp3`;
      }

      if (!this.customAudio || this.customAudio.src !== playableUrl) {
        if (this.customAudio) {
          this.customAudio.pause();
        }
        this.customAudio = new Audio(playableUrl);
        this.customAudio.volume = this.volume;
        this.customAudio.onended = () => {
          this.isPlaying = false;
          this.onStateChange?.(false);
        };
        this.customAudio.ontimeupdate = () => {
          if (this.customAudio && this.onTimeUpdate) {
            this.onTimeUpdate(
              this.customAudio.currentTime,
              this.customAudio.duration || 60
            );
          }
        };
        this.customAudio.onerror = () => {
          console.warn('Audio URL failed to load, falling back to birthday music box');
          this.playSynthFallback();
        };
      }

      try {
        await this.customAudio.play();
        this.isPlaying = true;
        this.onStateChange?.(true);
        return;
      } catch (err) {
        console.warn('Custom audio playback error, launching music box', err);
        this.playSynthFallback();
        return;
      }
    }

    this.playSynthFallback();
  }

  private async playSynthFallback() {
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
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
    const chord = this.chordNotes[this.currentStep] || [];

    // Main music box chime
    this.playChime(freq, dur, 0.3);

    // Subtle chord harmony
    chord.forEach((cNote) => {
      this.playChime(cNote, dur, 0.1);
    });

    // Notify progress
    const totalDuration = this.noteDurations.reduce((a, b) => a + b, 0);
    const elapsed = this.noteDurations.slice(0, this.currentStep).reduce((a, b) => a + b, 0);
    this.onTimeUpdate?.(elapsed, totalDuration);

    this.currentStep = (this.currentStep + 1) % this.melodyNotes.length;

    this.timerId = window.setTimeout(() => {
      this.scheduleNextNote();
    }, dur * 1000);
  }

  private playChime(freq: number, duration: number, gainLevel: number) {
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // Pure bell / music box tone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    const now = this.audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainLevel * this.volume, now + 0.02);
    // Exponential ring-down
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.5);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration * 1.5);
  }
}

export const globalAudioSynth = new BirthdaySongSynth();

