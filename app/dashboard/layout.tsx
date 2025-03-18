import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0';
import ThemeToggle from '@/components/ThemeToggle';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-2xl font-bold fastbreak-gradient bg-clip-text text-transparent">
                  FastBreak
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-current text-current inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  style={{ borderColor: 'var(--primary)', color: 'var(--foreground)' }}
                >
                  Dashboard
                </Link>
                <Link
                  href="/players"
                  className="border-transparent hover:text-current inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  style={{ color: 'var(--secondary)', borderColor: 'var(--card-border)' }}
                >
                  Players
                </Link>
                <Link
                  href="/games"
                  className="border-transparent hover:text-current inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  style={{ color: 'var(--secondary)', borderColor: 'var(--card-border)' }}
                >
                  Games
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <ThemeToggle />
              <span style={{ color: 'var(--foreground)' }} className="mr-4">Hi, {session?.user?.name}</span>
              <Link 
                href="/api/auth/logout" 
                className="px-4 py-2 rounded transition-colors"
                style={{ backgroundColor: 'var(--error)', color: 'white' }}
              >
                Log out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="py-8 fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 