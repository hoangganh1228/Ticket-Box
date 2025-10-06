export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto">
      {children}
    </main>
  );
}