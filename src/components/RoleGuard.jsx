'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/Spinner';

const HOME = {
  super_admin: '/admin',
  teacher: '/dashboard/students',
  student: '/student/dashboard',
};

/**
 * Wrap a route-group layout to enforce that the logged-in user has `role`.
 * Initializes auth, shows a loader while resolving, redirects on mismatch.
 */
export default function RoleGuard({ role, children }) {
  const { profile, loading, initialized, init } = useAuthStore();
  const router = useRouter();

  useEffect(() => { if (!initialized) init(); }, [initialized, init]);

  useEffect(() => {
    if (!initialized || loading) return;
    if (!profile) { router.replace('/login'); return; }
    if (profile.role !== role) { router.replace(HOME[profile.role] ?? '/login'); }
  }, [initialized, loading, profile, role, router]);

  if (!initialized || loading || !profile || profile.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <Spinner />
      </div>
    );
  }
  return children;
}
