export default function LetterCard({ letter, onClick, isLearned }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full bg-[#141d2e] border border-white/10 rounded-2xl p-3 md:p-4 text-center transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:border-[#10b981]/50 ${
        isLearned ? 'border-[#10b981]/30' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold bg-[#111827] text-white/50 px-2 py-0.5 rounded-md border border-white/5">
          {letter.id}
        </span>
        <div className={`w-2.5 h-2.5 rounded-full shadow-sm transition-colors ${
          isLearned ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-white/10'
        }`}></div>
      </div>
      
      {/* Drop shadow on hover applied via standard text shadow utility in tailwind or custom class */}
      <div className="font-arabic text-5xl md:text-6xl mb-2 text-white drop-shadow-md group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)] transition-all">
        {letter.ar}
      </div>
      
      <div className="text-base font-bold text-[#f59e0b] tracking-wider mb-2">
        {letter.name}
      </div>
      
      <div className="flex flex-wrap justify-center gap-1.5">
        {letter.type === 'quyosh' ? (
           <span className="text-[10px] tracking-wide bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">☀️ Quyosh</span>
        ) : (
           <span className="text-[10px] tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">🌙 Oy</span>
        )}
        {!letter.connects && (
           <span className="text-[10px] tracking-wide bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 px-2 py-0.5 rounded-full whitespace-nowrap">⛓️ Ulanmaydigan</span>
        )}
      </div>
    </button>
  );
}
