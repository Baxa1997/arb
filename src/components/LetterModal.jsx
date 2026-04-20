"use client"
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AudioPlayer from './AudioPlayer';
import QuizBlock from './QuizBlock';

export default function LetterModal({ letter, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (letter) {
      document.body.classList.add('modal-open');
      setActiveTab(0);
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [letter]);

  if (!mounted || !letter) return null;

  const tabs = [
    { id: 0, icon: '🎙️', label: 'Talaffuz' },
    { id: 1, icon: '🔤', label: 'Shakllar' },
    { id: 2, icon: '🫁', label: 'Maxraj' },
    { id: 3, icon: '📋', label: 'Qoidalar' },
    { id: 4, icon: '🧪', label: 'Test' }
  ];

  const content = (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0a0f1a]/80 backdrop-blur-md cursor-pointer"
        />
        
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#111827] border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 md:p-8 border-b border-white/5 bg-[#141d2e]">
            <div className="flex items-center gap-6">
              <div className="font-arabic text-7xl text-white drop-shadow-md bg-gradient-to-br from-[#10b981] to-[#10b981]/20 bg-clip-text text-transparent">
                {letter.ar}
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">{letter.name}</h2>
                <div className="flex gap-2">
                  <span className="bg-[#111827] border border-white/10 text-white/70 px-3 py-1 rounded-full text-xs font-medium">
                    {letter.id}-harf
                  </span>
                  <span className="bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#6366f1] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                    {letter.type} harfi
                  </span>
                  <span className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {letter.group} guruh
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Tabs Nav */}
          <div className="flex overflow-x-auto border-b border-white/5 bg-[#141d2e]/50 px-6 backdrop-blur-sm scrollbar-hide">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 py-4 px-4 whitespace-nowrap border-b-2 transition-all font-medium ${
                   activeTab === tab.id 
                    ? 'border-[#10b981] text-[#10b981]' 
                    : 'border-transparent text-white/50 hover:text-white/80 hover:border-white/20'
                 }`}
               >
                 <span className="text-lg">{tab.icon}</span>
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Tab Content Area */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#111827]">
             {activeTab === 0 && (
                <div className="space-y-8 animate-fade-in-up">
                   {/* Video Placeholder */}
                   <div className="relative w-full h-48 md:h-64 bg-[#141d2e] rounded-3xl border border-white/5 overflow-hidden group flex items-center justify-center cursor-pointer hover:border-[#10b981]/30 transition-colors">
                      <div className="absolute inset-0 flex items-center justify-center select-none opacity-5 pointer-events-none overflow-hidden">
                        <span className="font-arabic text-[300px] text-white">{letter.ar}</span>
                      </div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#10b981] group-hover:text-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                           <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <span className="font-medium text-white/80">Video darsni ko'rish — {letter.name}</span>
                      </div>
                   </div>

                   <AudioPlayer letter={letter} />

                   {/* Modes Cards */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-[#141d2e] border border-white/5 rounded-3xl p-6 text-center relative overflow-hidden">
                         <div className="absolute top-0 inset-x-0 h-1 bg-[#10b981]"></div>
                         <h4 className="text-white/60 font-medium mb-6">Harakatli Holatda</h4>
                         <div className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 px-4 py-2 rounded-xl text-sm font-bold w-max mx-auto mb-6">
                            {letter.harakatliSifat}
                         </div>
                         <div className="flex justify-center gap-6 md:gap-8 font-arabic text-6xl text-white drop-shadow-md" dir="rtl">
                            <span className="hover:text-[#10b981] transition-colors">{letter.forms.alohida}َ</span>
                            <span className="hover:text-[#10b981] transition-colors">{letter.forms.alohida}ِ</span>
                            <span className="hover:text-[#10b981] transition-colors">{letter.forms.alohida}ُ</span>
                         </div>
                      </div>

                      <div className="bg-[#141d2e] border border-white/5 rounded-3xl p-6 text-center relative overflow-hidden">
                         <div className="absolute top-0 inset-x-0 h-1 bg-red-500"></div>
                         <h4 className="text-white/60 font-medium mb-6">Sukunli Holatda</h4>
                         <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-bold w-max mx-auto mb-6">
                            {letter.sukunliSifat}
                         </div>
                         <div className="flex justify-center gap-6 md:gap-8 font-arabic text-6xl text-white drop-shadow-md" dir="rtl">
                            <span className="hover:text-red-400 transition-colors">{letter.forms.alohida}ْأَ</span>
                            <span className="hover:text-red-400 transition-colors">{letter.forms.alohida}ْإِ</span>
                            <span className="hover:text-red-400 transition-colors">{letter.forms.alohida}ْأُ</span>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 1 && (
               <div className="animate-fade-in-up">
                 <div className="bg-[#141d2e] rounded-3xl border border-white/5 overflow-hidden">
                    <table className="w-full text-center" dir="rtl">
                       <thead>
                         <tr className="bg-[#111827] border-b border-white/5 text-white/50 text-sm">
                           <th className="py-4">Alohida</th>
                           <th className="py-4">Boshida</th>
                           <th className="py-4">O'rtasida</th>
                           <th className="py-4">Oxirida</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr>
                            <td className="py-8 border-l border-white/5 text-6xl font-arabic text-white group"><span className="hover:text-[#10b981] transition-colors cursor-default drop-shadow-md">{letter.forms.alohida}</span></td>
                            <td className="py-8 border-l border-white/5 text-6xl font-arabic text-white group"><span className="hover:text-[#10b981] transition-colors cursor-default drop-shadow-md">{letter.forms.boshida}</span></td>
                            <td className="py-8 border-l border-white/5 text-6xl font-arabic text-white group"><span className="hover:text-[#10b981] transition-colors cursor-default drop-shadow-md">{letter.forms.ortasida}</span></td>
                            <td className="py-8 text-6xl font-arabic text-white group"><span className="hover:text-[#10b981] transition-colors cursor-default drop-shadow-md">{letter.forms.oxirida}</span></td>
                         </tr>
                       </tbody>
                    </table>
                 </div>
                 <div className="mt-6 flex gap-3 text-[#10b981] bg-[#10b981]/10 p-4 rounded-2xl border border-[#10b981]/20">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium text-sm md:text-base leading-relaxed">{letter.formNote}</p>
                 </div>
               </div>
             )}

             {activeTab === 2 && (
               <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-[#10b981]/20 to-[#141d2e] border border-[#10b981]/30 rounded-3xl p-6 shadow-inner relative overflow-hidden">
                     <div className="absolute top-4 right-4 bg-[#10b981] text-white px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        Maxraj Mintaqasi
                     </div>
                     <p className="text-xl md:text-2xl font-bold text-white mt-8 leading-snug drop-shadow-sm">
                        📍 {letter.makhraj}
                     </p>
                     
                     <div className="mt-8 bg-[#111827] rounded-2xl p-4 border border-white/5">
                        <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Guruh Doselari</div>
                        <h4 className="text-white font-bold text-lg">{letter.makhrajGroup}</h4>
                        <p className="text-white/60 text-sm mb-4 leading-relaxed mt-1">{letter.makhrajGroupDesc}</p>
                        <div className="flex gap-2">
                           {letter.makhrajGroupLetters.map((l, i) => (
                             <span key={i} className="font-arabic text-3xl bg-[#141d2e] w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 text-[#f59e0b] shadow-sm">
                               {l}
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#141d2e] border border-white/5 rounded-3xl flex items-center justify-center p-8 relative shadow-inner">
                     <svg viewBox="0 0 200 250" className="w-full max-w-[250px] drop-shadow-2xl" stroke="currentColor" fill="none">
                        <defs>
                          <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                          </linearGradient>
                        </defs>
                        <path d="M 60 20 C 60 20, 10 50, 10 100 C 10 150, 30 180, 50 240 L 150 240 C 190 180, 190 120, 150 70 L 120 20 Z" fill="url(#skin)" stroke="#334155" strokeWidth="2" opacity="0.8"/>
                        <path d="M 50 80 Q 70 70 100 85 Q 110 95 90 100 Q 70 100 50 80 Z" fill="#64748b" opacity="0.3"/>
                        <path d="M 50 110 Q 70 100 100 100 Q 120 100 130 130" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" opacity="0.4"/>
                        <rect x="44" y="110" width="6" height="10" fill="#ffffff" stroke="#94a3b8" opacity="0.5"/>
                        <rect x="44" y="125" width="6" height="10" fill="#ffffff" stroke="#94a3b8" opacity="0.5"/>
                        <path d="M 50 130 Q 90 120 120 140 Q 130 170 130 200 L 90 200 Q 70 160 50 130 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2" opacity="0.6"/>
                        <path d="M 130 130 Q 150 160 140 240 M 90 200 Q 100 220 95 240" stroke="#0ea5e9" strokeWidth="6" opacity="0.3"/>
                        
                        {/* Dynamic Indicator */}
                        <g transform={`translate(${letter.makhrajX}, ${letter.makhrajY})`}>
                          <circle cx="0" cy="0" r="15" fill="#10b981" opacity="0.2" className="animate-ping" />
                          <circle cx="0" cy="0" r="6" fill="#10b981" />
                          <circle cx="0" cy="0" r="2" fill="#ffffff" />
                        </g>
                     </svg>
                  </div>
               </div>
             )}

             {activeTab === 3 && (
               <div className="animate-fade-in-up space-y-4">
                  {letter.rules.length > 0 ? (
                    letter.rules.map((rule, idx) => {
                      let colorClass = 'border-[#10b981] bg-[#10b981]/5 text-[#10b981]';
                      if(rule.color === 'yellow') colorClass = 'border-[#f59e0b] bg-[#f59e0b]/5 text-[#f59e0b]';
                      if(rule.color === 'purple') colorClass = 'border-[#6366f1] bg-[#6366f1]/5 text-[#6366f1]';

                      return (
                        <div key={idx} className={`flex items-start gap-4 p-5 rounded-2xl border-l-4 border-y border-r border-[#141d2e] ${colorClass.split(' ')[0]} bg-[#141d2e]`}>
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${colorClass.split(' ')[1]} border border-white/5`}>
                             {rule.icon}
                           </div>
                           <div>
                             <h4 className="text-white font-bold text-lg mb-1">{rule.title}</h4>
                             <p className="text-white/70 leading-relaxed text-sm md:text-base">{rule.desc}</p>
                           </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-white/50 text-center p-8 bg-[#141d2e] rounded-3xl">Maxsus qoidalar kiritilmagan.</div>
                  )}
               </div>
             )}

             {activeTab === 4 && (
               <div className="animate-fade-in-up">
                  <QuizBlock letter={letter} />
               </div>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(content, document.getElementById('modal-root'));
}
