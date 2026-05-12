'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MOCK_DATA = [
  { name: 'Asilbek', completed: 12, total: 18, score: 88 },
  { name: 'Nilufar', completed: 15, total: 18, score: 94 },
  { name: 'Sardor', completed: 8, total: 18, score: 72 },
  { name: 'Malika', completed: 17, total: 18, score: 97 },
  { name: 'Jamshid', completed: 10, total: 18, score: 78 },
  { name: 'Zulfiya', completed: 6, total: 18, score: 65 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} className="text-sm" style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}{p.name === 'Ball' ? '%' : ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Progress Analitikasi</h1>
        <p className="text-white/50 mt-1">Talabalar faoliyati va natijalari</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "O'rt. Ball", value: '82%', icon: '🏆', color: '#10b981' },
          { label: 'Tugatganlar', value: '18/24', icon: '✅', color: '#6366f1' },
          { label: 'Faol talabalar', value: '20', icon: '👥', color: '#f59e0b' },
          { label: "Bu haftadagi o'sish", value: '+4%', icon: '📈', color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} className="bg-[#141d2e] border border-white/6 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
              {s.icon}
            </div>
            <div className="text-2xl font-extrabold text-white">{s.value}</div>
            <div className="text-sm text-white/45 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#141d2e] border border-white/6 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6">Talabalar Natijalari</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={MOCK_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
            <Bar dataKey="completed" name="Tugatilgan" fill="#10b981" radius={[6,6,0,0]} />
            <Bar dataKey="score" name="Ball" fill="#6366f1" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div className="bg-[#141d2e] border border-white/6 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="font-bold text-white">Reytinglar</h2>
        </div>
        {MOCK_DATA
          .sort((a, b) => b.score - a.score)
          .map((s, i) => (
            <div key={s.name} className="flex items-center gap-4 px-5 py-3.5 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-white/10 text-white/60' : 'bg-white/5 text-white/40'}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white text-sm">{s.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${(s.completed / s.total) * 100}%` }} />
                  </div>
                  <span className="text-xs text-white/40">{s.completed}/{s.total} dars</span>
                </div>
              </div>
              <div className="text-lg font-extrabold" style={{ color: s.score >= 90 ? '#10b981' : s.score >= 75 ? '#f59e0b' : '#ef4444' }}>
                {s.score}%
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
