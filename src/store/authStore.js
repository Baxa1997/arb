import { create } from 'zustand';
import { isSupabaseConfigured, supabase } from '@/lib/supabase-client';

const DEMO_USERS = {
  'teacher@demo.com': { id: 'demo-teacher', email: 'teacher@demo.com', role: 'teacher', full_name: "O'qituvchi Demo" },
  'student@demo.com': { id: 'demo-student', email: 'student@demo.com', role: 'student', full_name: 'Talaba Demo' },
};
const DEMO_PASSWORD = 'demo1234';

function setCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function getCookieValue(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,
  initialized: false,

  init: async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('user_profiles').select('*').eq('id', session.user.id).single();
          set({ user: session.user, profile, loading: false, initialized: true });
        } else {
          set({ loading: false, initialized: true });
        }
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const { data: profile } = await supabase
              .from('user_profiles').select('*').eq('id', session.user.id).single();
            set({ user: session.user, profile });
          } else {
            set({ user: null, profile: null });
          }
        });
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
        set({ user, profile, loading: false });
        return profile;
      } catch (e) {
        set({ error: e.message, loading: false });
        return null;
      }
    } else {
      // Demo mode
      await new Promise(r => setTimeout(r, 500));
      const demoProfile = DEMO_USERS[email];
      if (!demoProfile || password !== DEMO_PASSWORD) {
        set({ error: "Parol noto'g'ri. Demo: teacher@demo.com / demo1234", loading: false });
        return null;
      }
      try {
        // Set cookie so middleware can read it
        setCookie('arb_demo_role', demoProfile.role);
        localStorage.setItem('arb_demo_user', JSON.stringify(demoProfile));
      } catch {/* ignore */}
      set({ user: { id: demoProfile.id, email }, profile: demoProfile, loading: false });
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
    set({ user: null, profile: null });
  },
}));
