"use client"
import { useRef, useState } from 'react';

/**
 * Plays the letter's pronunciation recording that the super-admin uploaded
 * (letter.audio). If no recording has been set, the voice is shown as
 * unavailable — we no longer fall back to robotic text-to-speech.
 */
export default function AudioPlayer({ letter }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const src = letter?.audio || null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) { el.pause(); return; }
    el.currentTime = 0;
    el.play().catch(() => setIsPlaying(false));
  };

  if (!src) {
    return (
      <div className="flex items-center gap-4 bg-cream-50 border border-dashed border-brand-700/15 p-4 rounded-2xl w-full max-w-sm">
        <div className="w-14 h-14 rounded-full bg-cream-200 flex items-center justify-center text-brand-700/30">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9l4 4m0-4l-4 4" /></svg>
        </div>
        <div className="flex-1">
          <div className="text-brand-700/60 text-sm font-medium">{letter?.name} talaffuzi</div>
          <div className="text-brand-700/40 text-xs mt-0.5">🔇 Ovoz hali yuklanmagan</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 bg-cream-50 border border-brand-700/10 p-4 rounded-2xl w-full max-w-sm shadow-sm ${isPlaying ? 'playing' : ''}`}>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        onClick={toggle}
        className="w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center shadow-[0_0_15px_rgba(46,125,79,0.3)] hover:scale-105 transition-transform"
        aria-label={isPlaying ? 'Pauza' : 'Eshitish'}
      >
        {isPlaying ? (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
        ) : (
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>

      <div className="flex-1">
        <div className="text-brand-700/60 text-sm font-medium mb-1">{letter.name} harfi talaffuzi</div>
        <div className="flex items-end h-8 gap-1 pl-1">
          <div className="waveform-bar w-1.5 h-4 bg-brand-500 rounded-full"></div>
          <div className="waveform-bar w-1.5 h-8 bg-brand-500 rounded-full"></div>
          <div className="waveform-bar w-1.5 h-3 bg-brand-500 rounded-full"></div>
          <div className="waveform-bar w-1.5 h-6 bg-brand-500 rounded-full"></div>
          <div className="waveform-bar w-1.5 h-5 bg-brand-500 rounded-full opacity-50"></div>
          <div className="waveform-bar w-1.5 h-2 bg-brand-500 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
