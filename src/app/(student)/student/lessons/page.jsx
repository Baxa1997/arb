'use client';

const MOCK_LESSONS = [
  { id: 1, title: 'Alif — Birinchi Harf', class: "Arabic 101", status: 'completed', score: 100, date: '2026-05-01' },
  { id: 2, title: 'Baa, Taa, Thaa Harflari', class: "Arabic 101", status: 'in_progress', score: null, date: '2026-05-03' },
  { id: 3, title: 'Qalqala Qoidasi', class: 'Tajvid Kursi', status: 'not_started', score: null, date: '2026-05-05' },
];

const STATUS_STYLES = {
  completed: { label: 'Tugatildi', bg: 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/25' },
  in_progress: { label: 'Davom etmoqda', bg: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/25' },
  not_started: { label: 'Boshlanmadi', bg: 'bg-white/6 text-white/45 border-white/10' },
};

export default function StudentLessonsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Darslarim</h1>
        <p className="text-white/50 mt-1">O'qituvchi tomonidan tayinlangan darslar</p>
      </div>

      <div className="space-y-3">
        {MOCK_LESSONS.map(lesson => {
          const s = STATUS_STYLES[lesson.status];
          return (
            <div key={lesson.id}
              className="bg-[#141d2e] border border-white/6 rounded-2xl p-5 flex items-center gap-5 hover:border-white/12 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#111827] flex items-center justify-center text-2xl border border-white/5 flex-shrink-0">
                {lesson.status === 'completed' ? '✅' : lesson.status === 'in_progress' ? '▶️' : '📚'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate">{lesson.title}</h3>
                <p className="text-sm text-white/45 mt-0.5">{lesson.class} · {lesson.date}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {lesson.score !== null && (
                  <span className="text-lg font-extrabold text-[#10b981]">{lesson.score}%</span>
                )}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${s.bg}`}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
