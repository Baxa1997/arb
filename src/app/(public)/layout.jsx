import PublicNavbar from '@/components/layout/PublicNavbar';

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicNavbar />
      <main className="pt-[72px]">
        {children}
      </main>
    </>
  );
}
