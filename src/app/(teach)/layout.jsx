'use client';
import RoleGuard from '@/components/RoleGuard';

// Full-screen, distraction-free shell for the teaching view. No sidebar —
// the lesson takes the whole page so the teacher can present it.
export default function TeachLayout({ children }) {
  return (
    <RoleGuard role="teacher">
      <div className="min-h-screen bg-cream-100">{children}</div>
    </RoleGuard>
  );
}
