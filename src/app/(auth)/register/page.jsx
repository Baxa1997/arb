import { redirect } from 'next/navigation';

// Public self-registration is disabled — accounts are created by the
// super-admin (teachers) and teachers (students).
export default function RegisterPage() {
  redirect('/login');
}
