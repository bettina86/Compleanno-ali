import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Sparkles, Upload } from 'lucide-react';
import { globalAudioSynth } from '../utils/audioSynth';
import { triggerConfettiBurst } from '../utils/confetti';

interface SongSectionProps {
  customSongTitle?: string;
  customSongUrl?: string;
  personName: string;
  onUpdateSong?: (title: string, url: string) => void;
}

export const SongSection: React.FC<SongSectionProps> = ({
  customSongTitle = 'Buon compleanno!',
  customSongUrl,
  personName,
  onUpdateSong,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    globalAudioSynth.setCallbacks(
      (playing) => setIsPlaying(playing),
      (currTime, dur) => {
        setProgress(currTime);
        if (dur) setDuration(dur);
      }
    );
  }, []);

  // Sync custom URL to global synth
  useEffect(() => {
    if (customSongUrl) {
      globalAudioSynth.setCustomUrl(customSongUrl);
    } else {
      globalAudioSynth.setCustomUrl('');
    }
  }, [customSongUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          const songName = file.name.replace(/\.[^/.]+$/, '');
          onUpdateSong?.(songName, base64);
          globalAudioSynth.setCustomUrl(base64);
          triggerConfettiBurst();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTogglePlay = () => {
    globalAudioSynth.togglePlay();
    if (!isPlaying) {
      triggerConfettiBurst();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    globalAudioSynth.setVolume(val);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section id="canzone" className="py-24 px-4 sm:px-6 relative bg-transparent text-slate-900 overflow-hidden">
      {/* Background Decorative Sound Waves */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full border border-white/40 animate-ping" />
        <div className="w-[400px] h-[400px] rounded-full border border-white/60 animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Badge Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full frosted-pill text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-4 border border-white/60 shadow-sm">
          <Music className="w-4 h-4 text-amber-900" />
          Musica Speciale
        </div>

        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2 drop-shadow-sm">
          Buon compleanno! 🎶
        </h2>

        <p className="text-slate-900 font-black text-lg sm:text-xl mb-8 flex items-center justify-center gap-2 drop-shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-300" />
          Premi play per ascoltare la canzone! 🔊
        </p>

        {/* Clean Audio Player Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="frosted-card border border-white/80 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-xl mx-auto text-center backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Main Big Play / Pause Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pausa' : 'Riproduci canzone'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-pink-400 text-slate-950 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer border-4 border-white group relative"
            >
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-25 group-hover:opacity-40" />
              {isPlaying ? (
                <Pause className="w-12 h-12 sm:w-14 sm:h-14 fill-current drop-shadow" />
              ) : (
                <Play className="w-12 h-12 sm:w-14 sm:h-14 fill-current ml-1.5 drop-shadow" />
              )}
            </button>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug drop-shadow-sm mb-1">
            {customSongTitle || 'Buon compleanno!'}
          </h3>
          <p className="text-sm sm:text-base font-extrabold text-slate-800 mb-6">
            Dedicata ad {personName} per i suoi fantastici 40 anni! 🎂🎉
          </p>

          {/* Equalizer Bars Animation */}
          <div className="flex items-end justify-center gap-1.5 h-10 my-4 max-w-md mx-auto px-4">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-full bg-slate-900 rounded-t-sm transition-all ${
                  isPlaying ? 'animate-pulse' : 'h-1.5 opacity-30'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(20, (i * 19 + 25) % 100)}%` : '6px',
                  animationDelay: `${(i % 6) * 0.12}s`,
                }}
              />
            ))}
          </div>

          {/* Timeline Bar */}
          <div className="w-full max-w-md mx-auto mt-4">
            <div className="w-full h-2.5 bg-white/50 rounded-full overflow-hidden border border-white/60">
              <div
                className="h-full bg-slate-900 transition-all duration-300"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-900 mt-1.5 font-black">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Bottom Volume Controls & MP3 File Uploader */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-900/10 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 sm:w-24 accent-slate-900 cursor-pointer"
              />
            </div>

            <label
              htmlFor="song-file-input"
              className="text-xs font-black text-slate-900 hover:text-slate-950 flex items-center gap-1.5 bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-white/90 transition-all shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-900" />
              <span>Carica file MP3</span>
              <input
                id="song-file-input"
                type="file"
                accept="audio/*, .mp3, .wav, .m4a"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


