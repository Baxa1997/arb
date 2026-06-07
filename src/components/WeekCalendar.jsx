'use client';
import { useState } from 'react';

const DAYS = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'];

function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date;
}
function fmt(d) { return d.toISOString().slice(0, 10); }

/**
 * events: [{ date: 'YYYY-MM-DD', label, type }]
 * type controls the pill color (homework | lesson).
 */
export default function WeekCalendar({ events = [] }) {
  const [offset, setOffset] = useState(0);
  const base = startOfWeek(new Date());
  base.setDate(base.getDate() + offset * 7);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    return d;
  });

  const todayStr = fmt(new Date());
  const eventsByDay = (key) => events.filter(e => e.date === key);

  const monthLabel = base.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-cream-50 border border-brand-700/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-brand-700 capitalize">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => setOffset(o => o - 1)} className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-brand-500/10 text-brand-700 flex items-center justify-center">‹</button>
          <button onClick={() => setOffset(0)} className="px-3 h-8 rounded-lg bg-cream-100 hover:bg-brand-500/10 text-brand-700 text-xs font-semibold">Bugun</button>
          <button onClick={() => setOffset(o => o + 1)} className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-brand-500/10 text-brand-700 flex items-center justify-center">›</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const key = fmt(d);
          const isToday = key === todayStr;
          const dayEvents = eventsByDay(key);
          return (
            <div key={key} className={`min-h-[96px] rounded-xl border p-2 ${isToday ? 'border-brand-500/40 bg-brand-500/5' : 'border-brand-700/10 bg-cream-100'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-brand-700/45 uppercase">{DAYS[i]}</span>
                <span className={`text-xs font-bold ${isToday ? 'text-brand-600' : 'text-brand-700/70'}`}>{d.getDate()}</span>
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((e, idx) => (
                  <div key={idx} className={`text-[10px] leading-tight px-1.5 py-1 rounded-md truncate ${
                    e.type === 'lesson' ? 'bg-amber-500/15 text-amber-700' : 'bg-brand-500/15 text-brand-600'
                  }`} title={e.label}>
                    {e.label}
                  </div>
                ))}
                {dayEvents.length > 3 && <div className="text-[10px] text-brand-700/40 px-1">+{dayEvents.length - 3}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
