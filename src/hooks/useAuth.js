'use client';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, profile, loading, error, initialized, init, login, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) {
      init();
    }
  }, [initialized, init]);

  const signIn = async (email, password) => {
    const prof = await login(email, password);
    if (prof) {
      const dest = prof.role === 'super_admin' ? '/admin'
                 : prof.role === 'teacher'     ? '/dashboard'
                 :                               '/student/dashboard';
      router.push(dest);
    }
  };

  const signOut = async () => {
    await logout();
    router.push('/');
  };

  return { user, profile, loading, error, signIn, signOut };
}
