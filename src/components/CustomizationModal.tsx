import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BirthdayConfig, PhotoItem, WishMessage } from '../types';
import { X, Settings, Image as ImageIcon, Music, User, MessageSquare, Trash2, Plus, Download, Upload, RefreshCw, Edit3, Check, MapPin, Calendar } from 'lucide-react';
import { triggerConfettiBurst } from '../utils/confetti';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onSaveConfig: (newConfig: BirthdayConfig) => void;
  onResetDefaults: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'photos' | 'song' | 'messages'>('general');
  const [personName, setPersonName] = useState(config.personName);
  const [songTitle, setSongTitle] = useState(config.customSongTitle);
  const [songUrl, setSongUrl] = useState(config.customSongUrl || '');
  const [photos, setPhotos] = useState<PhotoItem[]>(config.photos);
  const [messages, setMessages] = useState<WishMessage[]>(config.messages);

  // New photo input fields
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoYear, setNewPhotoYear] = useState('');
  const [newPhotoLocation, setNewPhotoLocation] = useState('');

  // Editing existing photo state
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editLocation, setEditLocation] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setPersonName(config.personName);
      setSongTitle(config.customSongTitle);
      setSongUrl(config.customSongUrl || '');
      setPhotos(config.photos || []);
      setMessages(config.messages || []);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const newP: PhotoItem = {
      id: `custom_p_${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim(),
      year: newPhotoYear.trim() || undefined,
      location: newPhotoLocation.trim() || undefined,
      aspectRatio: 'landscape',
    };
    setPhotos([newP, ...photos]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewPhotoYear('');
    setNewPhotoLocation('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          const newP: PhotoItem = {
            id: `custom_p_${Date.now()}`,
            url: base64,
            caption: newPhotoCaption.trim() || file.name.replace(/\.[^/.]+$/, ''),
            year: newPhotoYear.trim() || undefined,
            location: newPhotoLocation.trim() || undefined,
            aspectRatio: 'landscape',
          };
          setPhotos([newP, ...photos]);
          setNewPhotoCaption('');
          setNewPhotoYear('');
          setNewPhotoLocation('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReplacePhotoFile = (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setPhotos(photos.map(p => p.id === photoId ? { ...p, url: base64 } : p));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEditPhoto = (photo: PhotoItem) => {
    setEditingPhotoId(photo.id);
    setEditCaption(photo.caption || '');
    setEditYear(photo.year || '');
    setEditLocation(photo.location || '');
  };

  const handleSaveEditPhoto = (photoId: string) => {
    setPhotos(
      photos.map((p) => {
        if (p.id === photoId) {
          return {
            ...p,
            caption: editCaption.trim(),
            year: editYear.trim() || undefined,
            location: editLocation.trim() || undefined,
          };
        }
        return p;
      })
    );
    setEditingPhotoId(null);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const handleClearAllPhotos = () => {
    if (window.confirm('Sei sicuro di voler svuotare tutta la galleria foto? Potrai aggiungerne di nuove.')) {
      setPhotos([]);
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleSave = () => {
    const updated: BirthdayConfig = {
      ...config,
      personName,
      customSongTitle: songTitle,
      customSongUrl: songUrl,
      photos,
      messages,
    };
    onSaveConfig(updated);
    triggerConfettiBurst();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xl flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="frosted-card rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-white/70 backdrop-blur-2xl text-slate-900"
        >
          {/* Header */}
          <div className="p-6 bg-slate-900/90 backdrop-blur-md text-white flex items-center justify-between border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl">Personalizza la Sorpresa ⚙️</h3>
                <p className="text-xs text-slate-300">
                  Modifica nome, fotografie, canzone e messaggi di auguri
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors border border-white/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-3">
            {[
              { id: 'general', label: 'Nome & Dettagli', icon: User },
              { id: 'photos', label: 'Fotografie', icon: ImageIcon },
              { id: 'song', label: 'Canzone', icon: Music },
              { id: 'messages', label: 'Messaggi', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
                    activeTab === tab.id
                      ? 'bg-white border-pink-500 text-pink-600 shadow-sm'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nome Festeggiato/a
                  </label>
                  <input
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder="Es. Marco, Elena, Alessandro..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 text-base focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Questo nome verrà personalizzato nei messaggi di benvenuto e negli inviti.
                  </p>
                </div>
              </div>
            )}

            {/* Photos Settings */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                {/* Add Photo Form Section */}
                <div className="p-4 rounded-2xl bg-white/50 border border-white/80 shadow-sm space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-pink-600" />
                    <span>Aggiungi una Nuova Foto</span>
                  </h4>

                  {/* Optional Metadata Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                        Didascalia / Titolo (Opzionale)
                      </label>
                      <input
                        type="text"
                        placeholder="Es. Festa in spiaggia"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                        Luogo (Opzionale)
                      </label>
                      <input
                        type="text"
                        placeholder="Es. Sardegna, Roma"
                        value={newPhotoLocation}
                        onChange={(e) => setNewPhotoLocation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                        Anno / Album (Opzionale)
                      </label>
                      <input
                        type="text"
                        placeholder="Es. 2022, Estate 2016"
                        value={newPhotoYear}
                        onChange={(e) => setNewPhotoYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  {/* Upload Options */}
                  <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* File upload button */}
                    <div className="flex-1">
                      <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                        1. Carica Immagine dal Dispositivo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full text-xs font-semibold text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-pink-500 file:text-white hover:file:bg-pink-600 cursor-pointer"
                      />
                    </div>

                    <div className="hidden sm:block text-xs font-bold text-slate-400 self-center mt-3">
                      OPPURE
                    </div>

                    {/* URL upload button */}
                    <div className="flex-1">
                      <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                        2. Aggiungi tramite Link URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://immagine.jpg..."
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleAddPhoto}
                          disabled={!newPhotoUrl.trim()}
                          className="px-3 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" /> Aggiungi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo List & Editor */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-slate-700" />
                      <span>Foto in Galleria ({photos.length})</span>
                    </h4>

                    {photos.length > 0 && (
                      <button
                        onClick={handleClearAllPhotos}
                        className="text-xs font-extrabold text-rose-600 hover:text-rose-800 flex items-center gap-1 hover:underline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Svuota tutta la galleria</span>
                      </button>
                    )}
                  </div>

                  {photos.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-500">
                      <ImageIcon className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="font-extrabold text-sm">La galleria è vuota</p>
                      <p className="text-xs text-slate-400 mt-1">Carica o aggiungi le tue foto personali usando i campi in alto.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {photos.map((p) => {
                        const isEditing = editingPhotoId === p.id;
                        return (
                          <div
                            key={p.id}
                            className="p-3 rounded-2xl border border-slate-200 bg-white/80 shadow-sm flex flex-col justify-between space-y-3"
                          >
                            <div className="flex gap-3">
                              {/* Thumbnail */}
                              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative group">
                                <img
                                  src={p.url}
                                  alt={p.caption || 'Foto'}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Details or Edit Form */}
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                {isEditing ? (
                                  <div className="space-y-1.5 text-xs">
                                    <input
                                      type="text"
                                      value={editCaption}
                                      onChange={(e) => setEditCaption(e.target.value)}
                                      placeholder="Didascalia (facoltativa)"
                                      className="w-full px-2 py-1 rounded-lg border border-slate-300 font-bold text-slate-800"
                                    />
                                    <div className="grid grid-cols-2 gap-1">
                                      <input
                                        type="text"
                                        value={editLocation}
                                        onChange={(e) => setEditLocation(e.target.value)}
                                        placeholder="Luogo"
                                        className="w-full px-2 py-1 rounded-lg border border-slate-300 text-[11px]"
                                      />
                                      <input
                                        type="text"
                                        value={editYear}
                                        onChange={(e) => setEditYear(e.target.value)}
                                        placeholder="Anno/Album"
                                        className="w-full px-2 py-1 rounded-lg border border-slate-300 text-[11px]"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 pt-1">
                                      <button
                                        onClick={() => handleSaveEditPhoto(p.id)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-sm"
                                      >
                                        <Check className="w-3 h-3" /> Salva
                                      </button>
                                      <button
                                        onClick={() => setEditingPhotoId(null)}
                                        className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-extrabold text-[11px]"
                                      >
                                        Annulla
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="font-extrabold text-sm text-slate-900 truncate">
                                      {p.caption || <span className="italic text-slate-400 font-normal">(Nessuna didascalia)</span>}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mt-1">
                                      {p.year ? (
                                        <span className="flex items-center gap-1 text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                                          <Calendar className="w-3 h-3" /> {p.year}
                                        </span>
                                      ) : null}
                                      {p.location ? (
                                        <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                                          <MapPin className="w-3 h-3" /> {p.location}
                                        </span>
                                      ) : null}
                                      {!p.year && !p.location && (
                                        <span className="text-[10px] text-slate-400 italic">Dettagli opzionali non impostati</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Card Actions */}
                            {!isEditing && (
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                {/* Replace Photo Input */}
                                <label
                                  htmlFor={`replace-file-${p.id}`}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs cursor-pointer flex items-center gap-1 transition-colors"
                                >
                                  <Upload className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Sostituisci Immagine</span>
                                </label>
                                <input
                                  type="file"
                                  id={`replace-file-${p.id}`}
                                  accept="image/*"
                                  onChange={(e) => handleReplacePhotoFile(p.id, e)}
                                  className="hidden"
                                />

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleStartEditPhoto(p)}
                                    title="Modifica Didascalia, Luogo o Anno"
                                    className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePhoto(p.id)}
                                    title="Elimina foto"
                                    className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Song Settings */}
            {activeTab === 'song' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Titolo della Canzone
                  </label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Carica File MP3 dal Computer
                  </label>
                  <input
                    type="file"
                    accept="audio/*, .mp3, .wav, .m4a"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64 = event.target?.result as string;
                          if (base64) {
                            setSongUrl(base64);
                            if (!songTitle || songTitle === 'Buon compleanno!') {
                              setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
                            }
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs font-semibold text-slate-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer border border-slate-200 rounded-xl p-2 bg-slate-50"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Puoi caricare un qualsiasi file audio MP3 dal tuo dispositivo per farlo riprodurre direttamente nel sito.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    OPPURE Incolla URL File Audio MP3
                  </label>
                  <input
                    type="url"
                    value={songUrl.startsWith('data:audio') ? '' : songUrl}
                    onChange={(e) => setSongUrl(e.target.value)}
                    placeholder="Es. https://esempio.it/canzone.mp3"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                  {songUrl.startsWith('data:audio') && (
                    <p className="text-xs text-emerald-700 font-extrabold mt-1 flex items-center gap-1">
                      ✓ File MP3 caricato in memoria!
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Di default viene riprodotta la musica di compleanno integrata.
                  </p>
                </div>
              </div>
            )}

            {/* Messages Settings */}
            {activeTab === 'messages' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900">
                  Gestisci Messaggi Guestbook ({messages.length})
                </h4>
                <div className="space-y-2">
                  {messages.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {m.emoji} {m.author} ({m.relation})
                        </div>
                        <div className="text-xs text-slate-600 line-clamp-1">
                          {m.message}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onResetDefaults}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                title="Ripristina alle impostazioni predefinite"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ personName, customSongTitle: songTitle, customSongUrl: songUrl, photos, messages }, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `compleanno-config-backup.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors border border-indigo-200"
                title="Scarica i dati delle foto e messaggi in un file per il backup"
              >
                <Download className="w-3.5 h-3.5" /> Esporta Backup
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                Salva Modifiche 🎉
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
