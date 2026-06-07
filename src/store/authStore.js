import { create } from 'zustand';
import { isSupabaseConfigured, supabase } from '@/lib/supabase-client';

const DEMO_USERS = {
  'admin@demo.com':   { id: 'demo-admin',   email: 'admin@demo.com',   role: 'super_admin', full_name: 'Super Admin Demo' },
  'teacher@demo.com': { id: 'demo-teacher', email: 'teacher@demo.com', role: 'teacher',     full_name: "O'qituvchi Demo" },
  'student@demo.com': { id: 'demo-student', email: 'student@demo.com', role: 'student',     full_name: 'Talaba Demo' },
};
const DEMO_PASSWORD = 'demo1234';

// Lightweight session cookie so the middleware can gate routes. The Supabase
// JS client keeps the real session in localStorage (not cookies), so we set
// our own cookie here for both demo and Supabase modes.
const SESSION_COOKIE = 'aec_session';

function setCookie(name, value, days = 30) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}
function deleteCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
function getCookieValue(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Module-level guard so we register the auth listener only once even if several
// route-group layouts mount RoleGuard during the same load.
let authListenerBound = false;

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,
  initialized: false,

  // Fetch the user_profiles row for a signed-in user. Kept separate so the
  // onAuthStateChange callback can call it AFTER releasing the auth lock.
  loadProfile: async (user) => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles').select('*').eq('id', user.id).single();
      setCookie(SESSION_COOKIE, profile?.role ?? '1');
      set({ user, profile, loading: false, initialized: true });
    } catch {
      set({ user, profile: null, loading: false, initialized: true });
    }
  },

  init: async () => {
    if (isSupabaseConfigured && supabase) {
      // IMPORTANT: never `await` a supabase data call directly inside the
      // onAuthStateChange callback — supabase-js holds an internal auth lock
      // for the duration of the callback, and querying from within it
      // deadlocks every later request until a manual refresh. We defer the
      // profile fetch with setTimeout(0) so the lock is released first.
      if (!authListenerBound) {
        authListenerBound = true;
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setCookie(SESSION_COOKIE, '1');
            setTimeout(() => { get().loadProfile(session.user); }, 0);
          } else {
            deleteCookie(SESSION_COOKIE);
            set({ user: null, profile: null, loading: false, initialized: true });
          }
        });
      }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await get().loadProfile(session.user);
        } else {
          deleteCookie(SESSION_COOKIE);
          set({ loading: false, initialized: true });
        }
      } catch {
        set({ loading: false, initialized: true });
      }
    } else {
      // Demo mode — restore from cookie + localStorage
      try {
        const role = getCookieValue('arb_demo_role');
        const stored = localStorage.getItem('arb_demo_user');
        if (role && stored) {
          const profile = JSON.parse(stored);
          setCookie(SESSION_COOKIE, profile.role);
          set({ user: { id: profile.id, email: profile.email }, profile, loading: false, initialized: true });
          return;
        }
      } catch {/* ignore */}
      set({ loading: false, initialized: true });
    }
  },

  login: async (email, password) => {
    set({ error: null, loading: true });
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { set({ error: error.message, loading: false }); return null; }
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
        setCookie(SESSION_COOKIE, profile?.role ?? '1');
        set({ user, profile, loading: false, initialized: true });
        return profile;
      } catch (e) {
        set({ error: e.message, loading: false });
        return null;
      }
    } else {
      // Demo mode
      await new Promise(r => setTimeout(r, 400));
      const demoProfile = DEMO_USERS[email.trim().toLowerCase()];
      if (!demoProfile || password !== DEMO_PASSWORD) {
        set({ error: "Email yoki parol noto'g'ri. Demo: admin@demo.com / teacher@demo.com / student@demo.com — parol: demo1234", loading: false });
        return null;
      }
      try {
        setCookie('arb_demo_role', demoProfile.role);
        setCookie(SESSION_COOKIE, demoProfile.role);
        localStorage.setItem('arb_demo_user', JSON.stringify(demoProfile));
      } catch {/* ignore */}
      set({ user: { id: demoProfile.id, email }, profile: demoProfile, loading: false, initialized: true });
      return demoProfile;
    }
  },

  logout: async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      try {
        deleteCookie('arb_demo_role');
        localStorage.removeItem('arb_demo_user');
      } catch {/* ignore */}
    }
    deleteCookie(SESSION_COOKIE);
    set({ user: null, profile: null });
  },
}));
