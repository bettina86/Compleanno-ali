import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FortyThing } from '../types';
import { Sparkles, CheckCircle2, Trophy, Flame, PartyPopper, X, Award } from 'lucide-react';
import { triggerConfettiBurst, triggerFloatingEmoji } from '../utils/confetti';

interface FortyThingsSectionProps {
  items: FortyThing[];
}

export const FortyThingsSection: React.FC<FortyThingsSectionProps> = ({ items }) => {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const handleToggleItem = (item: FortyThing, e: React.MouseEvent<HTMLDivElement>) => {
    const isChecked = checkedIds.includes(item.id);
    let newChecked: number[];

    if (isChecked) {
      newChecked = checkedIds.filter((id) => id !== item.id);
    } else {
      newChecked = [...checkedIds, item.id];
      triggerFloatingEmoji(item.icon, e.clientX, e.clientY);

      // If all 40 checked, celebrate!
      if (newChecked.length === items.length) {
        triggerConfettiBurst();
        setShowRewardModal(true);
      }
    }

    setCheckedIds(newChecked);
  };

  const handleSelectAll = () => {
    if (checkedIds.length === items.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(items.map((i) => i.id));
      triggerConfettiBurst();
      setShowRewardModal(true);
    }
  };

  const progressPercent = Math.round((checkedIds.length / items.length) * 100);

  return (
    <section id="40cose" className="py-24 px-4 sm:px-6 relative bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12 frosted-card p-8 rounded-3xl border border-white/60 shadow-xl backdrop-blur-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full frosted-pill text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-amber-900" />
            Edizione 40 Anni
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">
            40 cose da festeggiare 🥂
          </h2>
          <p className="text-slate-900 font-bold text-lg mt-3 max-w-xl mx-auto">
            Clicca sugli elementi per celebrarli uno ad uno e sbloccare il trofeo finale!
          </p>

          {/* Progress Tracker Bar */}
          <div className="mt-8 max-w-md mx-auto frosted-pill p-4 rounded-2xl border border-white/70 shadow-md">
            <div className="flex items-center justify-between text-xs font-black text-slate-900 mb-2">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-900" />
                Progresso Celebrazione
              </span>
              <span className="text-slate-900 font-black text-sm">
                {checkedIds.length} / {items.length} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-white/40 rounded-full overflow-hidden border border-white/50">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-3">
              <button
                onClick={handleSelectAll}
                className="text-xs font-black text-slate-900 hover:text-amber-900 bg-white/60 hover:bg-white px-3 py-1 rounded-full border border-white/80 transition-all cursor-pointer shadow-sm"
              >
                {checkedIds.length === items.length ? 'Deseleziona tutti' : 'Seleziona tutti ✨'}
              </button>

              {checkedIds.length === items.length && (
                <button
                  onClick={() => {
                    triggerConfettiBurst();
                    setShowRewardModal(true);
                  }}
                  className="text-xs font-black text-emerald-950 bg-emerald-200 hover:bg-emerald-300 px-3 py-1 rounded-full border border-emerald-300 transition-all cursor-pointer animate-pulse"
                >
                  🏆 Apri Trofeo!
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 40 Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {items.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            const isLast = item.id === 40;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                onClick={(e) => handleToggleItem(item, e)}
                className={`p-4 rounded-2xl cursor-pointer select-none transition-all duration-300 relative overflow-hidden flex flex-col justify-between border backdrop-blur-xl ${
                  isLast
                    ? 'col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 text-white shadow-xl hover:scale-[1.01] border-white/80'
                    : isChecked
                    ? 'bg-emerald-400/40 border-emerald-300 text-emerald-950 shadow-md font-extrabold'
                    : 'frosted-card hover:bg-white/50 border-white/60 text-slate-900 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Number Badge & Icon */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-black text-xs px-2.5 py-1 rounded-lg ${
                      isLast
                        ? 'bg-white/30 text-white'
                        : isChecked
                        ? 'bg-emerald-200/80 text-emerald-950'
                        : 'bg-white/40 text-slate-900'
                    }`}
                  >
                    {String(item.id).padStart(2, '0')}
                  </span>
                  <span className="text-2xl">{item.icon}</span>
                </div>

                {/* Title */}
                <div>
                  <h3
                    className={`font-black leading-tight ${
                      isLast ? 'text-xl sm:text-2xl text-white' : 'text-sm sm:text-base text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p
                      className={`text-xs mt-1 leading-snug line-clamp-2 ${
                        isLast
                          ? 'text-white/90 font-medium text-sm'
                          : isChecked
                          ? 'text-emerald-950 font-bold'
                          : 'text-slate-800 font-semibold'
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* Checkmark Indicator */}
                {isChecked && !isLast && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-950 fill-emerald-100" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 40/40 Celebration Reward Modal */}
      <AnimatePresence>
        {showRewardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-amber-100 via-white to-pink-100 border-4 border-amber-300 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
            >
              <button
                onClick={() => setShowRewardModal(false)}
                className="absolute top-4 right-4 text-slate-600 hover:text-slate-900 p-2 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 text-slate-950 mx-auto flex items-center justify-center shadow-xl mb-4 border-4 border-white animate-bounce">
                <Trophy className="w-10 h-10 fill-current" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-black text-xs uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" /> Trofeo Sbloccato!
              </span>

              <h3 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                Campione/ssa dei 40 Anni! 👑
              </h3>

              <p className="text-slate-800 font-bold text-sm leading-relaxed mb-6">
                Hai spuntato tutti i 40 traguardi e ricordi speciali! Sei ufficialmente la leggenda di questa giornata indimenticabile! 🥂🎉
              </p>

              <button
                onClick={() => {
                  triggerConfettiBurst();
                  setShowRewardModal(false);
                }}
                className="w-full py-3 px-6 rounded-2xl bg-slate-900 text-white font-black text-base shadow-lg hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <PartyPopper className="w-5 h-5 text-amber-400" />
                Festeggia ancora! 🎉
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
