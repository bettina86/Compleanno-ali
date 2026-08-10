import React from 'react';
import { motion } from 'motion/react';
import { TimelineItem } from '../types';
import { Sparkles, Calendar, Award, Crown, Compass, Smile, Baby } from 'lucide-react';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby':
        return <Baby className="w-6 h-6 text-white" />;
      case 'Smile':
        return <Smile className="w-6 h-6 text-white" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-white" />;
      case 'Award':
        return <Award className="w-6 h-6 text-white" />;
      case 'Crown':
      default:
        return <Crown className="w-6 h-6 text-white" />;
    }
  };

  return (
    <section id="storia" className="py-24 px-4 sm:px-6 relative bg-transparent">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 frosted-card p-8 rounded-3xl border border-white/60 shadow-xl backdrop-blur-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full frosted-pill text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-3">
            <Calendar className="w-4 h-4 text-amber-900" />
            1986 — 2026
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">
            40 anni di storia 📖
          </h2>
          <p className="text-slate-900 font-bold text-lg mt-3 max-w-xl mx-auto">
            Un viaggio straordinario attraverso quattro decenni memorabili, fatti di crescita, avventure e momenti felici.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1.5 bg-white/60 backdrop-blur-md rounded-full -translate-x-1/2 shadow-sm" />

          <div className="space-y-12">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge Node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} shadow-lg flex items-center justify-center ring-4 ring-white/80 transition-transform hover:scale-110`}
                    >
                      {getIcon(item.iconName)}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="ml-16 md:ml-0 md:w-1/2 md:px-8 w-full">
                    <div className="p-6 sm:p-8 rounded-3xl frosted-card border border-white/60 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group relative overflow-hidden backdrop-blur-2xl">
                      {/* Accent Corner Glow */}
                      <div
                        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${item.color} opacity-20 rounded-bl-full pointer-events-none`}
                      />

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl font-black text-slate-900 drop-shadow-sm">
                          {item.year}
                        </span>
                        {item.badge && (
                          <span className="text-xs font-extrabold px-3 py-1 rounded-full frosted-pill border border-white/60 text-slate-900 shadow-sm">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 group-hover:text-amber-900 transition-colors drop-shadow-sm">
                        {item.title}
                      </h3>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-900/80 mb-3">
                        {item.tagline}
                      </p>

                      <p className="text-slate-900 font-semibold text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
