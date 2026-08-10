import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types';
import { Camera, Maximize2, X, MapPin, Calendar, Image as ImageIcon, Plus } from 'lucide-react';

interface PhotoGallerySectionProps {
  photos: PhotoItem[];
  onOpenUploader?: () => void;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
  onOpenUploader,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  return (
    <section id="foto" className="py-24 px-4 sm:px-6 relative bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16 frosted-card p-8 rounded-3xl border border-white/60 shadow-xl backdrop-blur-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full frosted-pill text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-3">
            <Camera className="w-4 h-4 text-amber-900" />
            Galleria dei Ricordi
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">
            I momenti più belli 📸
          </h2>
          <p className="text-slate-900 font-bold text-lg mt-3 max-w-xl mx-auto">
            Sfoglia i ricordi in formato Polaroid moderna. Clicca su una foto per ingrandirla a tutto schermo!
          </p>
        </div>

        {/* Masonry / Grid Polaroid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => setSelectedPhoto(photo)}
              className="polaroid-card rounded-2xl cursor-pointer group relative flex flex-col justify-between border border-white/80"
            >
              {/* Photo Image Box */}
              <div className="overflow-hidden rounded-xl bg-slate-100 aspect-4/3 relative">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-5 h-5 text-pink-600" />
                  </div>
                </div>
              </div>

              {/* Polaroid Handwritten Style Caption */}
              <div className="mt-3 px-2 min-h-[1.5rem]">
                {photo.caption && photo.caption.trim() !== '' && (
                  <p className="font-bold text-slate-900 text-base leading-snug group-hover:text-pink-600 transition-colors">
                    {photo.caption}
                  </p>
                )}
                {(photo.year?.trim() || photo.location?.trim()) ? (
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mt-2">
                    {photo.year && photo.year.trim() !== '' ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-pink-500" />
                        {photo.year}
                      </span>
                    ) : <span />}
                    {photo.location && photo.location.trim() !== '' && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {photo.location}
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add/Upload Photos Button Notice */}
        {onOpenUploader && (
          <div className="mt-12 text-center">
            <button
              onClick={onOpenUploader}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full frosted-button text-slate-900 font-extrabold text-sm border border-white/70 shadow-lg"
            >
              <Plus className="w-4 h-4 text-pink-600" />
              <span>Aggiungi o Sostituisci Foto Personali</span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Fullscreen Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="max-h-[75vh] w-auto object-contain mx-auto"
                />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
                <div>
                  {selectedPhoto.caption && selectedPhoto.caption.trim() !== '' && (
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {selectedPhoto.caption}
                    </h3>
                  )}
                  {(selectedPhoto.year?.trim() || selectedPhoto.location?.trim()) ? (
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mt-1">
                      {selectedPhoto.year && selectedPhoto.year.trim() !== '' && <span>🗓️ {selectedPhoto.year}</span>}
                      {selectedPhoto.location && selectedPhoto.location.trim() !== '' && <span>📍 {selectedPhoto.location}</span>}
                    </div>
                  ) : null}
                </div>

                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 w-fit">
                  Fotografia originale
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
