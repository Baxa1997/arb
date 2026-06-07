import Link from 'next/link';

// status: 'locked' | 'current' | 'done'
export default function LetterCard({ letter, status = 'locked' }) {
  const locked = status === 'locked';
  const done = status === 'done';
  const current = status === 'current';

  const inner = (
    <>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold bg-cream-100 text-brand-700/50 px-2 py-0.5 rounded-md border border-brand-700/10">
          {letter.id}
        </span>
        {done && <span className="text-brand-500 text-sm">✓</span>}
        {current && <span className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(46,125,79,0.6)] animate-pulse" />}
        {locked && <span className="text-brand-700/30 text-sm">🔒</span>}
      </div>

      <div className={`font-arabic text-5xl md:text-6xl mb-2 transition-all ${locked ? 'text-brand-700/25' : 'text-brand-700 group-hover:text-brand-600'}`}>
        {letter.ar}
      </div>

      <div className={`text-base font-bold tracking-wider mb-2 ${locked ? 'text-brand-700/30' : 'text-amber-700'}`}>
        {letter.name}
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {letter.type === 'quyosh'
          ? <span className="text-[10px] tracking-wide bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">☀️ Quyosh</span>
          : <span className="text-[10px] tracking-wide bg-brand-500/10 text-brand-600 border border-brand-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">🌙 Oy</span>}
      </div>
    </>
  );

  const base = `group relative w-full bg-cream-50 border rounded-2xl p-3 md:p-4 text-center transition-all duration-300 block`;
  const stateCls = locked
    ? 'border-brand-700/10 opacity-70 cursor-not-allowed'
    : `border-brand-700/10 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(46,125,79,0.15)] hover:border-brand-500/50 ${current ? 'ring-2 ring-brand-500/40' : ''} ${done ? 'border-brand-500/30' : ''}`;

  if (locked) {
    return <div className={`${base} ${stateCls}`} aria-disabled>{inner}</div>;
  }

  return (
    <Link href={`/student/lessons/${letter.id}`} className={`${base} ${stateCls}`}>
      {inner}
    </Link>
  );
}
