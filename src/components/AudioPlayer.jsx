"use client"
import { useState } from 'react';
export default function AudioPlayer({ letter }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (isPlaying) return;
    
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(letter.ar);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex items-center gap-4 bg-[#141d2e] border border-white/5 p-4 rounded-2xl w-full max-w-sm ${isPlaying ? 'playing' : ''}`}>
      <button 
        onClick={playAudio}
        disabled={isPlaying}
        className="w-14 h-14 rounded-full bg-[#10b981] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
      >
        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </button>
      
      <div className="flex-1">
        <div className="text-white/60 text-sm font-medium mb-1">{letter.name} harfi talaffuzi</div>
        <div className="flex items-end h-8 gap-1 pl-1">
          <div className="waveform-bar w-1.5 h-4 bg-[#10b981] rounded-full"></div>
          <div className="waveform-bar w-1.5 h-8 bg-[#10b981] rounded-full"></div>
          <div className="waveform-bar w-1.5 h-3 bg-[#10b981] rounded-full"></div>
          <div className="waveform-bar w-1.5 h-6 bg-[#10b981] rounded-full"></div>
          <div className="waveform-bar w-1.5 h-5 bg-[#10b981] rounded-full opacity-50"></div>
          <div className="waveform-bar w-1.5 h-2 bg-[#10b981] rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
