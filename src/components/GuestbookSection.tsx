import React from 'react';
import { WishMessage } from '../types';
import { MessageSquareHeart } from 'lucide-react';

interface GuestbookSectionProps {
  messages: WishMessage[];
  onAddMessage: (msg: WishMessage) => void;
  onDeleteMessage?: (id: string) => void;
  personName: string;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  personName,
}) => {
  return (
    <section id="auguri" className="py-24 px-4 sm:px-6 relative bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Intestazione */}
        <div className="text-center mb-10 frosted-card p-8 rounded-3xl border border-white/60 shadow-xl backdrop-blur-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full frosted-pill text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-3">
            <MessageSquareHeart className="w-4 h-4 text-amber-900" />
            Guestbook Digitale
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">
            Messaggi di Auguri 💌
          </h2>
          <p className="text-slate-900 font-bold text-lg mt-3 max-w-xl mx-auto">
            Lascia un pensiero affettuoso o divertente per i 40 anni di {personName}. I messaggi appariranno in tempo reale sulla nostra bacheca!
          </p>
        </div>

        {/* Contenitore Padlet */}
        <div className="frosted-card p-2 sm:p-4 rounded-3xl shadow-xl border border-white/70 relative backdrop-blur-2xl w-full h-[700px] overflow-hidden">
          
          <iframe 
            src="https://padlet.com/betteli2/auguri-gpnushqxnbb2c1n1" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ borderRadius: '1rem' }} 
            allow="camera;microphone;geolocation"
          ></iframe>

        </div>
      </div>
    </section>
  );
};
