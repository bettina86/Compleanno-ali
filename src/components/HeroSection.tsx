import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, PartyPopper, Calendar, Heart, ArrowDown } from 'lucide-react';
import { triggerConfettiBurst, triggerSideCannons } from '../utils/confetti';
import { globalAudioSynth } from '../utils/audioSynth';

interface HeroSectionProps {
  personName: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ personName }) => {
  const handleStartParty = () => {
    // Fire festive confetti
    triggerConfettiBurst();
    setTimeout(() => triggerSideCannons(), 400);

    // Play summer birthday music
    globalAudioSynth.play();

    // Scroll smoothly to Section 1 (La Storia)
    const storyElem = document.getElementById('storia');
    if (storyElem) {
      storyElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 overflow-hidden bg-transparent"
    >
      {/* Decorative Floating Glass Orbs */}
      <div className="absolute top-12 left-10 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-52 h-52 bg-cyan-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 max-w-4xl w-full mx-auto text-center flex flex-col items-center frosted-card p-8 sm:p-14 rounded-3xl border border-white/60 shadow-2xl backdrop-blur-2xl">
        
        {/* Top Summer Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full frosted-pill text-slate-900 font-extrabold text-xs sm:text-sm tracking-wide mb-6 uppercase border border-white/70 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 animate-spin" />
          40 ANNI — SPECIAL EDITION
          <PartyPopper className="w-4 h-4 text-pink-600" />
        </motion.div>

        {/* Huge Animated Number 40 */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.2 }}
          className="relative my-2 select-none"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full animate-pulse" />
          
          <h1 className="relative text-8xl sm:text-9xl md:text-[14rem] font-black tracking-tighter leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
            40
          </h1>

          {/* Floating Crown / Stars */}
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-4 -right-2 sm:top-2 sm:right-4 text-4xl sm:text-6xl drop-shadow-lg"
          >
            👑
          </motion.span>
        </motion.div>

        {/* Date Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 text-slate-900 font-extrabold text-base sm:text-xl md:text-2xl mt-2 tracking-wide drop-shadow-sm"
        >
          <Calendar className="w-5 h-5 text-amber-900" />
          <span>10 AGOSTO 1986</span>
          <span className="text-white font-black">→</span>
          <span className="text-slate-900 font-black">10 AGOSTO 2026</span>
        </motion.div>

        {/* Catchy Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mt-4 mb-8 max-w-2xl px-4 drop-shadow-sm"
        >
          È arrivato il momento di festeggiare! 🎉
        </motion.p>

        {/* Primary Call to Action Button */}
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartParty}
          className="relative group px-8 sm:px-12 py-5 rounded-full frosted-button text-slate-900 font-black text-xl sm:text-2xl shadow-2xl border-2 border-white/80 cursor-pointer flex items-center gap-3"
        >
          <PartyPopper className="w-7 h-7 animate-bounce text-pink-600" />
          <span>INIZIA LA FESTA 🎉</span>
        </motion.button>

        {/* Scroll Indicator */}
        <motion.a
          href="#storia"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          className="mt-12 flex flex-col items-center gap-1 text-slate-900 text-xs font-black uppercase tracking-wider hover:text-white transition-colors"
        >
          <span>Scorri per scoprire</span>
          <ArrowDown className="w-4 h-4 text-slate-900" />
        </motion.a>

      </div>
    </section>
  );
};
