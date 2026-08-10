import React, { useState, useEffect } from 'react';
import { BirthdayConfig, WishMessage } from './types';
import { DEFAULT_CONFIG } from './data/defaultConfig';
import { globalAudioSynth } from './utils/audioSynth';

import { LightParticleBackground } from './components/LightParticleBackground';
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { TimelineSection } from './components/TimelineSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { FortyThingsSection } from './components/FortyThingsSection';
import { SongSection } from './components/SongSection';
import { GuestbookSection } from './components/GuestbookSection';
import { CountdownSection } from './components/CountdownSection';
import { FinalSection } from './components/FinalSection';
import { CustomizationModal } from './components/CustomizationModal';

const LOCAL_STORAGE_KEY = 'birthday_40_special_edition_config';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: BirthdayConfig = JSON.parse(saved);
        // Clean out old fake sample messages if present
        const fakeIds = new Set(['m1', 'm2', 'm3', 'm4']);
        const cleanedMessages = (parsed.messages || []).filter(
          (m) =>
            !fakeIds.has(m.id) &&
            m.author !== 'I tuoi amici di sempre' &&
            m.author !== 'La tua famiglia' &&
            m.author !== 'La banda dell\'estate' &&
            m.author !== 'Un caro amico'
        );
        // If no message left or no Elisabetta message, ensure default Elisabetta message is present
        if (cleanedMessages.length === 0) {
          cleanedMessages.push(...DEFAULT_CONFIG.messages);
        }
        return {
          ...parsed,
          messages: cleanedMessages,
        };
      }
    } catch (e) {
      console.warn('Could not load stored config', e);
    }
    return DEFAULT_CONFIG;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Could not save config to localStorage', e);
    }

    if (config.customSongUrl) {
      globalAudioSynth.setCustomUrl(config.customSongUrl);
    }
  }, [config]);

  const handleSaveConfig = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setIsSettingsOpen(false);
  };

  const handleAddMessage = (newMessage: WishMessage) => {
    setConfig((prev) => ({
      ...prev,
      messages: [newMessage, ...prev.messages],
    }));
  };

  const handleDeleteMessage = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      messages: prev.messages.filter((m) => m.id !== id),
    }));
  };

  return (
    <div className="relative min-h-screen font-sans bg-[#FFFDF9] text-slate-800 antialiased selection:bg-pink-500 selection:text-white">
      {/* Background Animated Bokeh Particle Canvas */}
      <LightParticleBackground />

      {/* Floating Header */}
      <HeaderNav
        personName={config.personName}
        targetDate={config.targetDate}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Homepage / Hero */}
        <HeroSection personName={config.personName} />

        {/* Sezione 1 — La Storia */}
        <TimelineSection timeline={config.timeline} />

        {/* Sezione 2 — Le Foto */}
        <PhotoGallerySection
          photos={config.photos}
          onOpenUploader={() => setIsSettingsOpen(true)}
        />

        {/* Sezione 3 — 40 Cose da Festeggiare */}
        <FortyThingsSection items={config.fortyThings} />

        {/* Sezione 4 — La Canzone */}
        <SongSection
          customSongTitle={config.customSongTitle}
          personName={config.personName}
        />

        {/* Sezione 5 — Messaggi di Auguri */}
        <GuestbookSection
          messages={config.messages}
          onAddMessage={handleAddMessage}
          onDeleteMessage={handleDeleteMessage}
          personName={config.personName}
        />

        {/* Sezione 6 — Countdown */}
        <CountdownSection targetDateStr={config.targetDate} />

        {/* Finale */}
        <FinalSection personName={config.personName} />
      </main>

      {/* Customization Drawer / Modal */}
      <CustomizationModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
