import React from 'react';
import { motion } from 'motion/react';
import { PartyPopper, Heart, Sparkles, Share2, Calendar } from 'lucide-react';
import { triggerConfettiBurst, triggerSideCannons } from '../utils/confetti';

interface FinalSectionProps {
  personName: string;
}

export const FinalSection: React.FC<FinalSectionProps> = ({ personName }) => {
  const handleMoreConfetti = () => {
    triggerConfettiBurst();
    setTimeout(() => triggerSideCannons(), 300);
  };

  const handleShare = () => {
    const text = `🎉 BUON 40° COMPLEANNO! Guarda la sorpresa di compleanno speciale qui:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="relative min-h-[90vh] py-24 px-4 sm:px-6 flex flex-col items-center justify-center text-center bg-transparent text-slate-900 overflow-hidden">
      {/* Decorative Floating Bokeh Effects */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center frosted-card p-8 sm:p-14 rounded-3xl border border-white/70 shadow-2xl backdrop-blur-2xl">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full frosted-pill border border-white/60 text-slate-900 font-black text-xs sm:text-sm uppercase tracking-wider mb-8"
        >
          <Sparkles className="w-4 h-4 text-amber-900 fill-amber-900" />
          EDIZIONE SPECIALE 40 ANNI
          <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />
        </motion.div>

        {/* Large Birthday Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
        >
          BUON 40° COMPLEANNO! 🎂
        </motion.h2>

        {/* Date Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 text-2xl sm:text-4xl font-black text-slate-900 mt-6 tracking-wide drop-shadow-sm"
        >
          <Calendar className="w-8 h-8 text-amber-900" />
          <span>10 AGOSTO 2026</span>
        </motion.div>

        {/* Heartfelt Quote Phrase */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl sm:text-3xl font-extrabold max-w-2xl mt-8 mb-12 text-slate-900 leading-relaxed drop-shadow-sm px-4"
        >
          “Che questo sia solo l'inizio di un altro fantastico capitolo.” ✨
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={handleMoreConfetti}
            className="px-8 py-4 sm:px-10 sm:py-5 rounded-full frosted-button text-slate-900 font-black text-lg sm:text-2xl shadow-2xl transition-all flex items-center gap-3 cursor-pointer border border-white/80"
          >
            <PartyPopper className="w-7 h-7 text-pink-600 animate-bounce" />
            <span>🎉 ANCORA AUGURI!</span>
          </button>

          <button
            onClick={handleShare}
            className="px-6 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base sm:text-lg shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-white/40"
          >
            <Share2 className="w-5 h-5" />
            <span>Condividi su WhatsApp</span>
          </button>
        </motion.div>

        {/* Footer info */}
        <div className="mt-16 text-xs text-slate-900 font-black tracking-wide">
          Realizzato con tanto affetto per il 40° compleanno • 10 Agosto 1986 - 2026
        </div>
      </div>
    </section>
  );
};
