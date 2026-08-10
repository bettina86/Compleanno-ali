import React, { useState, useEffect } from 'react';
import { Music, Share2, Settings, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { globalAudioSynth } from '../utils/audioSynth';
import { triggerConfettiBurst } from '../utils/confetti';

interface HeaderNavProps {
  personName: string;
  onOpenSettings: () => void;
  targetDate: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  personName,
  onOpenSettings,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    globalAudioSynth.setCallbacks((playing) => {
      setIsPlaying(playing);
    });

    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMusic = () => {
    globalAudioSynth.togglePlay();
  };

  const handleShareWhatsApp = () => {
    triggerConfettiBurst();
    const shareText = `🎉 Vieni a festeggiare il 40° COMPLEANNO di ${personName}! 🥳\nScopri la sorpresa speciale, le foto, la musica e lascia il tuo messaggio qui:\n${window.location.href}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-lg py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Title */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-slate-900 font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
            40
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base leading-tight drop-shadow-sm">
              40 ANNI — SPECIAL EDITION
            </span>
            <span className="text-xs text-slate-900 font-bold flex items-center gap-1 drop-shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-300" />
              10 Agosto 1986 → 2026
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-extrabold text-slate-900">
          <a href="#storia" className="hover:text-amber-300 transition-colors drop-shadow-sm">
            La Storia
          </a>
          <a href="#foto" className="hover:text-amber-300 transition-colors drop-shadow-sm">
            Le Foto
          </a>
          <a href="#40cose" className="hover:text-amber-300 transition-colors drop-shadow-sm">
            40 Cose
          </a>
          <a href="#canzone" className="hover:text-amber-300 transition-colors drop-shadow-sm">
            La Canzone
          </a>
          <a href="#auguri" className="hover:text-amber-300 transition-colors drop-shadow-sm">
            Messaggi
          </a>
          <a href="#countdown" className="hover:text-amber-300 transition-colors drop-shadow-sm">
            Countdown
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle button with soundwave indicator */}
          <button
            onClick={handleToggleMusic}
            title={isPlaying ? 'Pausa musica' : 'Riproduci musica'}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all frosted-button ${
              isPlaying
                ? 'bg-rose-500/80 text-white border-white/60 shadow-lg'
                : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
            }`}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span className="hidden sm:inline">Musica In Corso</span>
                <div className="flex items-end gap-0.5 h-4 px-1">
                  <div className="w-0.5 bg-white rounded-full animate-bar-1" />
                  <div className="w-0.5 bg-white rounded-full animate-bar-2" />
                  <div className="w-0.5 bg-white rounded-full animate-bar-3" />
                  <div className="w-0.5 bg-white rounded-full animate-bar-4" />
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <Music className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Attiva Musica 🎵</span>
              </>
            )}
          </button>

          {/* Share on WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            title="Condividi su WhatsApp con amici"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500/90 hover:bg-emerald-600/90 text-white border border-white/40 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline">Condividi</span>
          </button>

          {/* Customization Settings Modal Trigger */}
          <button
            onClick={onOpenSettings}
            title="Personalizza foto, nome e dettagli"
            className="p-2 rounded-full bg-white/40 hover:bg-white/60 text-slate-900 border border-white/50 transition-colors backdrop-blur-md"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
