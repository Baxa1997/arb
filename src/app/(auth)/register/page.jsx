'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'teacher' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Ro'yxatdan o'tish uchun Supabase ulangan bo'lishi kerak. Demo uchun /login ga o'ting.");
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="bg-[#111827] border border-white/8 rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <span className="font-arabic text-5xl text-[#10b981] drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">اقرأ</span>
          <h1 className="text-2xl font-extrabold text-white mt-3">Ro'yxatdan o'tish</h1>
          <p className="text-white/50 text-sm mt-1">Yangi hisob yarating</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {['teacher', 'student'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setForm(f => ({ ...f, role }))}
                className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  form.role === role
                    ? role === 'teacher'
                      ? 'bg-[#10b981]/15 border-[#10b981]/30 text-[#10b981]'
                      : 'bg-[#6366f1]/15 border-[#6366f1]/30 text-[#6366f1]'
                    : 'bg-white/4 border-white/10 text-white/50 hover:bg-white/8'
                }`}
              >
                {role === 'teacher' ? "🏫 O'qituvchi" : '🎓 Talaba'}
              </button>
            ))}
          </div>

          {[
            { key: 'name', label: 'Ism Familiya', type: 'text', placeholder: 'Alisher Navoiy' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
            { key: 'password', label: 'Parol', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                required
                className="w-full bg-[#0a0f1a] border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 focus:border-[#10b981]/50 transition-all"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all mt-2"
          >
            Ro'yxatdan o'tish
          </button>
        </form>

        <p className="text-center text-sm text-white/35 mt-6">
          Hisobingiz bormi?{' '}
          <Link href="/login" className="text-[#10b981] font-semibold hover:underline">
            Kirish
          </Link>
        </p>
      </div>
      <p className="text-center text-xs text-white/25 mt-5">
        <Link href="/" className="hover:text-white/50 transition-colors">← Bosh sahifaga qaytish</Link>
      </p>
    </div>
  );
}
