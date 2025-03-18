import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0';
import ThemeToggle from '@/components/ThemeToggle';

export default async function GamesLayout({
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
                <Link href="/dashboard" className="flex items-center group">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-200">
                  FastBreak Insights
                  </span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-transparent hover:text-current inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  style={{ color: 'var(--secondary)', borderColor: 'var(--card-border)' }}
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
                  className="border-current text-current inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  style={{ borderColor: 'var(--primary)', color: 'var(--foreground)' }}
                >
                  Games
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <ThemeToggle />
              <Link 
                href="/api/auth/logout" 
                className="px-4 py-2 rounded transition-colors"
                style={{ backgroundColor: 'var(--error)', color: 'white' }}
                onClick={() => {
                  // Add any additional logout logic here if needed
                }}
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