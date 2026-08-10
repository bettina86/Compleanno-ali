import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Timer, PartyPopper, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import { triggerConfettiBurst } from '../utils/confetti';

interface CountdownSectionProps {
  targetDateStr?: string; // "2026-08-10"
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({
  targetDateStr = '2026-08-10',
}) => {
  // Mode override for interactive testing
  const [modeOverride, setModeOverride] = useState<'auto' | 'today' | 'after'>('auto');

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    status: 'before' | 'today' | 'after';
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'before',
  });

  useEffect(() => {
    const calculateTime = () => {
      if (modeOverride === 'today') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'today' });
        return;
      }
      if (modeOverride === 'after') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'after' });
        return;
      }

      const now = new Date();

      // Check year, month, day for Aug 10, 2026
      const targetStart = new Date(`${targetDateStr}T00:00:00`);
      const targetEnd = new Date(`${targetDateStr}T23:59:59`);

      if (now >= targetStart && now <= targetEnd) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'today' });
        return;
      }

      if (now > targetEnd) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'after' });
        return;
      }

      // Before target date
      const diff = targetStart.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, status: 'before' });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr, modeOverride]);

  return (
    <section id="countdown" className="py-20 px-4 sm:px-6 relative bg-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full frosted-pill text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-4 border border-white/60">
          <Timer className="w-4 h-4 text-amber-900" />
          Il Conto Alla Rovescia
        </div>

        {/* Dynamic Display based on Date */}
        {timeLeft.status === 'today' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 sm:p-12 rounded-3xl frosted-card text-slate-900 shadow-2xl relative overflow-hidden backdrop-blur-2xl border border-white/70"
          >
            <div className="absolute top-2 right-4 text-6xl opacity-20">🎉</div>
            <PartyPopper className="w-16 h-16 mx-auto mb-4 animate-bounce text-pink-600" />
            <h2 className="text-5xl sm:text-7xl font-black tracking-tight drop-shadow-sm">
              OGGI SI FESTEGGIA! 🎉
            </h2>
            <p className="text-xl sm:text-2xl font-extrabold mt-4 text-amber-950">
              10 AGOSTO 2026 — Buon 40° Compleanno!
            </p>
          </motion.div>
        )}

        {timeLeft.status === 'after' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 sm:p-12 rounded-3xl frosted-card text-slate-900 shadow-2xl relative overflow-hidden backdrop-blur-2xl border border-white/70"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-4 animate-pulse text-amber-900" />
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-sm">
              LA FESTA È APPENA INIZIATA! 🚀
            </h2>
            <p className="text-xl sm:text-2xl font-extrabold mt-4 text-slate-900">
              Il capitolo dei 40 anni è appena iniziato: si festeggia per tutto l'anno!
            </p>
          </motion.div>
        )}

        {timeLeft.status === 'before' && (
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-2 drop-shadow-sm">
              Manca pochissimo al grande giorno! ⏳
            </h2>
            <p className="text-slate-900 font-extrabold text-base sm:text-lg mb-8">
              Conto alla rovescia ufficiale verso il 10 AGOSTO 2026
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { label: 'Giorni', value: timeLeft.days, color: 'from-amber-400 to-orange-500' },
                { label: 'Ore', value: timeLeft.hours, color: 'from-pink-500 to-rose-500' },
                { label: 'Minuti', value: timeLeft.minutes, color: 'from-purple-500 to-indigo-600' },
                { label: 'Secondi', value: timeLeft.seconds, color: 'from-cyan-400 to-blue-600' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 rounded-3xl frosted-card shadow-xl border border-white/70 text-slate-900 flex flex-col items-center justify-center relative overflow-hidden group backdrop-blur-2xl"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.color}`}
                  />
                  <span className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-sm">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 mt-2">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tester simulation bar */}
        <div className="mt-8 pt-4 border-t border-white/40 inline-flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-900">
          <span>Simula data:</span>
          <button
            onClick={() => setModeOverride('auto')}
            className={`px-3 py-1 rounded-full transition-colors border border-white/50 ${
              modeOverride === 'auto'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white/40 hover:bg-white/60 text-slate-900'
            }`}
          >
            Auto (Reale)
          </button>
          <button
            onClick={() => {
              setModeOverride('today');
              triggerConfettiBurst();
            }}
            className={`px-3 py-1 rounded-full transition-colors border border-white/50 ${
              modeOverride === 'today'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white/40 hover:bg-white/60 text-slate-900'
            }`}
          >
            10 Agosto 2026 (Oggi)
          </button>
          <button
            onClick={() => setModeOverride('after')}
            className={`px-3 py-1 rounded-full transition-colors border border-white/50 ${
              modeOverride === 'after'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white/40 hover:bg-white/60 text-slate-900'
            }`}
          >
            Dopo il 10 Agosto
          </button>
        </div>
      </div>
    </section>
  );
};
