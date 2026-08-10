import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WishMessage } from '../types';
import { MessageSquareHeart, Send, Heart, Sparkles, User, Share2, Trash2 } from 'lucide-react';
import { triggerConfettiBurst, triggerFloatingEmoji } from '../utils/confetti';

interface GuestbookSectionProps {
  messages: WishMessage[];
  onAddMessage: (msg: WishMessage) => void;
  onDeleteMessage?: (id: string) => void;
  personName: string;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  messages,
  onAddMessage,
  onDeleteMessage,
  personName,
}) => {
  const [author, setAuthor] = useState('');
  const [relation, setRelation] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎉');

  const emojis = ['🎉', '❤️', '🥂', '⭐', '🎈', '🎂', '🥳', '🚀', '🎁', '👑'];

  const cardStyles = [
    'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300 text-amber-950',
    'bg-gradient-to-br from-rose-100 to-pink-200 border-pink-300 text-pink-950',
    'bg-gradient-to-br from-cyan-100 to-blue-200 border-blue-300 text-blue-950',
    'bg-gradient-to-br from-emerald-100 to-teal-200 border-emerald-300 text-emerald-950',
    'bg-gradient-to-br from-purple-100 to-indigo-200 border-purple-300 text-purple-950',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !messageText.trim()) return;

    const randomStyle = cardStyles[Math.floor(Math.random() * cardStyles.length)];

    const newMsg: WishMessage = {
      id: `msg_${Date.now()}`,
      author: author.trim(),
      relation: relation.trim() || 'Amico/a',
      message: messageText.trim(),
      date: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
      bgColor: randomStyle,
      emoji: selectedEmoji,
    };

    onAddMessage(newMsg);
    triggerConfettiBurst();

    setAuthor('');
    setRelation('');
    setMessageText('');
  };

  const handleShareOnWhatsApp = () => {
    const text = `🎉 Ciao! Sto lasciando un messaggio di auguri per il 40° COMPLEANNO di ${personName}! Scrivi anche tu il tuo augurio speciale qui:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="auguri" className="py-24 px-4 sm:px-6 relative bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 frosted-card p-8 rounded-3xl border border-white/60 shadow-xl backdrop-blur-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full frosted-pill text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-3">
            <MessageSquareHeart className="w-4 h-4 text-amber-900" />
            Guestbook Digitale
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">
            Messaggi di Auguri 💌
          </h2>
          <p className="text-slate-900 font-bold text-lg mt-3 max-w-xl mx-auto">
            Lascia un pensiero affettuoso o divertente. I messaggi rimarranno salvati per sempre in questo libro dei ricordi!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form to leave a message */}
          <div className="lg:col-span-5 frosted-card p-6 sm:p-8 rounded-3xl shadow-xl border border-white/70 relative backdrop-blur-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2 drop-shadow-sm">
              <span>Scrivi un messaggio</span>
              <Sparkles className="w-5 h-5 text-amber-900" />
            </h3>
            <p className="text-xs text-slate-900 font-extrabold mb-6">
              Lascia i tuoi auguri speciali per il festeggiato/a
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                  Il tuo nome *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-700 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Es. Marco, Maria, I colleghi..."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-sm text-slate-900 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                  Chi sei? (Opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. Amico/a di infanzia, Cugino, Collega..."
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-sm text-slate-900 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                  Scegli un Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((e) => (
                    <button
                      type="button"
                      key={e}
                      onClick={() => setSelectedEmoji(e)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform border border-white/50 ${
                        selectedEmoji === e
                          ? 'bg-slate-900 text-white scale-110 shadow-md'
                          : 'bg-white/40 hover:bg-white/60 text-slate-900'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                  Messaggio di auguri *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Scrivi qui i tuoi auguri speciali..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-sm text-slate-900 placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl frosted-button text-slate-900 font-black text-sm shadow-lg border border-white/80 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4 text-pink-600" />
                <span>Pubblica Messaggio 🎉</span>
              </button>
            </form>

            {/* Invite via WhatsApp button */}
            <div className="mt-6 pt-4 border-t border-white/40 text-center">
              <button
                onClick={handleShareOnWhatsApp}
                className="text-xs font-black text-slate-900 hover:text-amber-900 inline-flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                Invita amici a lasciare un augurio su WhatsApp
              </button>
            </div>
          </div>

          {/* Right Column: Grid of Wish Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="p-6 rounded-3xl frosted-card border border-white/70 shadow-lg relative flex flex-col justify-between backdrop-blur-2xl text-slate-900"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-black text-base leading-tight drop-shadow-sm">
                        {msg.author}
                      </h4>
                      {msg.relation && (
                        <span className="text-xs font-extrabold text-slate-900/80">
                          {msg.relation}
                        </span>
                      )}
                    </div>
                    <span className="text-3xl select-none">{msg.emoji || '❤️'}</span>
                  </div>

                  <p className="font-bold text-sm leading-relaxed mb-4 whitespace-pre-line text-slate-900">
                    “{msg.message}”
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-900/70">
                    {onDeleteMessage && (
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        title="Rimuovi messaggio"
                        className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-100/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span className="ml-auto">{msg.date}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
