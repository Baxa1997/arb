'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { progressQueries } from '@/lib/queries';
import { isSupabaseConfigured } from '@/lib/supabase-client';

/**
 * Student letter-unlock state.
 * Returns a map { [letterId]: 'locked' | 'current' | 'done' } plus helpers.
 * Letters with no row are treated as 'locked'.
 */
export function useProgress(studentIdArg) {
  const { profile } = useAuthStore();
  const studentId = studentIdArg ?? profile?.id;
  const [map, setMap] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!studentId || !isSupabaseConfigured) { setLoading(false); return; }
    try {
      const m = await progressQueries.getProgressMap(studentId);
      // Letter 1 is the default current lesson if nothing seeded yet.
      if (Object.keys(m).length === 0) m[1] = 'current';
      setMap(m);
    } catch {
      setMap({ 1: 'current' });
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { refresh(); }, [refresh]);

  const statusOf = (letterId) => map[letterId] ?? 'locked';
  const isUnlocked = (letterId) => statusOf(letterId) !== 'locked';
  const doneCount = Object.values(map).filter(s => s === 'done').length;
  const currentLetterId = Object.entries(map).find(([, s]) => s === 'current')?.[0];

  return { map, statusOf, isUnlocked, doneCount, currentLetterId: currentLetterId ? Number(currentLetterId) : null, loading, refresh };
}
