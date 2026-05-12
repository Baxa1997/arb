'use client';
import Link from 'next/link';

const MOCK_STATS = [
  { label: 'Jami Sinflar', value: '3', icon: '🏫', color: '#10b981', change: '+1 bu oy' },
  { label: 'Jami Talabalar', value: '24', icon: '🎓', color: '#6366f1', change: '+5 bu hafta' },
  { label: 'Darslar', value: '18', icon: '📚', color: '#f59e0b', change: '6 ta yangi' },
  { label: 'O\'rt. Ball', value: '82%', icon: '📊', color: '#3b82f6', change: '+4% o\'sish' },
];

const MOCK_CLASSES = [
  { id: 1, name: "Arabic 101 — Boshlang'ich", students: 10, lessons: 7, progress: 68 },
  { id: 2, name: "Arabic 201 — O'rta", students: 8, lessons: 5, progress: 42 },
  { id: 3, name: "Tajvid Kursi", students: 6, lessons: 6, progress: 55 },
];

const MOCK_ACTIVITY = [
  { text: "Asilbek 'Alif' darsini tugatdi", time: "5 daqiqa oldin", icon: '✅' },
  { text: "Nilufar uy ishini topshirdi", time: "23 daqiqa oldin", icon: '📝' },
  { text: "Jamshid 'Baa' testida 100% oldi", time: "1 soat oldin", icon: '🏆' },
  { text: "Sardor platformaga kirdi", time: "2 soat oldin", icon: '👋' },
  { text: "Yangi dars qo'shildi: 'Taa harfi'", time: "kecha", icon: '📚' },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-white/50 mt-1">Xush kelibsiz! Bugungi holat:</p>
        </div>
        <Link
          href="/dashboard/classes"
          className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
        >
          + Yangi Sinf
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((s, i) => (
          <div key={i} className="bg-[#141d2e] border border-white/6 rounded-2xl p-5 hover:border-white/12 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                {s.icon}
              </div>
              <span className="text-xs font-medium text-white/35">{s.change}</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{s.value}</div>
            <div className="text-sm text-white/50 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Classes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Sinflarim</h2>
            <Link href="/dashboard/classes" className="text-sm text-[#10b981] hover:underline font-medium">Barchasi →</Link>
          </div>
          <div className="space-y-3">
            {MOCK_CLASSES.map(cls => (
              <Link
                key={cls.id}
                href={`/dashboard/classes/${cls.id}`}
                className="block bg-[#141d2e] border border-white/6 rounded-2xl p-5 hover:border-[#10b981]/25 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-white group-hover:text-[#10b981] transition-colors">{cls.name}</div>
                    <div className="text-sm text-white/45 mt-0.5">{cls.students} talaba · {cls.lessons} dars</div>
                  </div>
                  <span className="text-lg font-extrabold text-[#10b981]">{cls.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full transition-all duration-700"
                    style={{ width: `${cls.progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Faollik</h2>
          <div className="bg-[#141d2e] border border-white/6 rounded-2xl p-4 space-y-3">
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-base flex-shrink-0">{a.icon}</div>
                <div>
                  <p className="text-sm text-white/80 leading-snug">{a.text}</p>
                  <p className="text-xs text-white/35 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/lessons/new', icon: '📚', label: 'Yangi Dars', desc: 'Yangi dars yarating', color: '#f59e0b' },
          { href: '/dashboard/homework', icon: '📝', label: 'Uy Ishi Berish', desc: 'Topshiriq yarating', color: '#6366f1' },
          { href: '/dashboard/progress', icon: '📊', label: 'Hisobotlar', desc: "Progress ko'rish", color: '#3b82f6' },
        ].map(q => (
          <Link key={q.href} href={q.href}
            className="bg-[#141d2e] border border-white/6 rounded-2xl p-5 hover:border-white/12 hover:-translate-y-0.5 transition-all group flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${q.color}15`, border: `1px solid ${q.color}25` }}>
              {q.icon}
            </div>
            <div>
              <div className="font-bold text-white group-hover:text-white/90">{q.label}</div>
              <div className="text-xs text-white/45">{q.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
