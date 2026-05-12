export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12">
      {/* Ambient */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#10b981]/8 blur-[120px] pointer-events-none" />
      {children}
    </div>
  );
}
