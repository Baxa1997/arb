'use client';
import { create } from 'zustand';

// Shared query for the dashboard toolbar search row. The list pages
// (students / homework / lessons) read `q` to filter; the layout clears it
// on route change so a query doesn't leak between sections.
export const useDashSearch = create((set) => ({
  q: '',
  setQ: (q) => set({ q }),
  clear: () => set({ q: '' }),
}));
