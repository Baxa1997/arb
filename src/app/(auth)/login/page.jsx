'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { signIn, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const fillDemo = (role) => {
    setEmail(role === 'teacher' ? 'teacher@demo.com' : 'student@demo.com');
    setPassword('demo1234');
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      {/* Card */}
      <div className="bg-[#111827] border border-white/8 rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-arabic text-5xl text-[#10b981] drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">اقرأ</span>
          <h1 className="text-2xl font-extrabold text-white mt-3">Xush kelibsiz</h1>
          <p className="text-white/50 text-sm mt-1">Hisobingizga kiring</p>
        </div>

        {/* Demo shortcuts */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => fillDemo('teacher')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#10b981]/20 bg-[#10b981]/8 text-[#10b981] text-xs font-bold hover:bg-[#10b981]/15 transition-all"
          >
            🏫 O'qituvchi demo
          </button>
          <button
            type="button"
            onClick={() => fillDemo('student')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#6366f1]/20 bg-[#6366f1]/8 text-[#6366f1] text-xs font-bold hover:bg-[#6366f1]/15 transition-all"
          >
            🎓 Talaba demo
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-white/30 font-medium">yoki qo'lda kiriting</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full bg-[#0a0f1a] border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 focus:border-[#10b981]/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Parol</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0a0f1a] border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 focus:border-[#10b981]/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
              >
                {showPass
                  ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                }
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Kirilmoqda...
              </span>
            ) : 'Kirish'}
          </button>
        </form>

        <p className="text-center text-sm text-white/35 mt-6">
          Hisobingiz yo'qmi?{' '}
          <Link href="/register" className="text-[#10b981] font-semibold hover:underline">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>

      <p className="text-center text-xs text-white/25 mt-5">
        <Link href="/" className="hover:text-white/50 transition-colors">← Bosh sahifaga qaytish</Link>
      </p>
    </div>
  );
}
