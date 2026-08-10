import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Disc, Sparkles } from 'lucide-react';
import { globalAudioSynth } from '../utils/audioSynth';
import { triggerConfettiBurst } from '../utils/confetti';

interface SongSectionProps {
  customSongTitle?: string;
  personName: string;
}

export const SongSection: React.FC<SongSectionProps> = ({
  customSongTitle = 'La canzone dei 40 (Summer Birthday Mix)',
  personName,
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
      <div className="absolute inset-0 opacity-30 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full border border-white/40 animate-ping" />
        <div className="w-[400px] h-[400px] rounded-full border border-white/60 animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Badge Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full frosted-pill text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-4 border border-white/60">
          <Music className="w-4 h-4 text-amber-900" />
          Colonna Sonora Ufficiale
        </div>

        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2 drop-shadow-sm">
          La canzone dei 40 🎶
        </h2>

        <p className="text-slate-900 font-black text-lg sm:text-2xl mb-10 flex items-center justify-center gap-2 drop-shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-300" />
          Premi play e alza il volume! 🔊
        </p>

        {/* Music Player Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="frosted-card border border-white/70 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto text-left flex flex-col md:flex-row items-center gap-8 backdrop-blur-2xl"
        >
          {/* Animated Spinning Vinyl Disk */}
          <div className="relative shrink-0">
            <div
              className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-slate-900 border-4 border-white/80 shadow-2xl flex items-center justify-center relative overflow-hidden transition-transform duration-1000 ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            >
              {/* Vinyl Groove Rings */}
              <div className="absolute inset-2 rounded-full border border-slate-800" />
              <div className="absolute inset-6 rounded-full border border-slate-800" />
              <div className="absolute inset-10 rounded-full border border-slate-800" />
              
              {/* Center Vinyl Label */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-inner">
                40
              </div>
            </div>

            {/* Play Badge Overlay */}
            <button
              onClick={handleTogglePlay}
              className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full frosted-button text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-white/80"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
          </div>

          {/* Song Details & Controls */}
          <div className="flex-1 w-full">
            <span className="text-xs font-black uppercase tracking-widest text-slate-900">
              In riproduzione
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 leading-snug drop-shadow-sm">
              {customSongTitle}
            </h3>
            <p className="text-sm font-bold text-slate-800 mt-1">
              Dedicata a {personName} per i suoi fantastici 40 anni! 🎂
            </p>

            {/* Equalizer Bars Animation */}
            <div className="flex items-end gap-1.5 h-8 my-4">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`w-full bg-slate-900 rounded-t-sm transition-all ${
                    isPlaying ? 'animate-pulse' : 'h-1 opacity-40'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (i * 17) % 100)}%` : '4px',
                    animationDelay: `${(i % 5) * 0.15}s`,
                  }}
                />
              ))}
            </div>

            {/* Timeline Bar */}
            <div className="w-full">
              <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden border border-white/50">
                <div
                  className="h-full bg-slate-900 transition-all duration-300"
                  style={{ width: `${(progress / duration) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-900 mt-1 font-extrabold">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleTogglePlay}
                className="px-5 py-2.5 rounded-full frosted-button text-slate-900 font-extrabold text-xs sm:text-sm shadow-md border border-white/70 flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> Pausa
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Play Musica
                  </>
                )}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-slate-900 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
