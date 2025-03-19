'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import ThemeToggle from '@/components/ThemeToggle';

export default function PlayersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error, isLoading } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
                  className="border-current text-current inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  style={{ borderColor: 'var(--primary)', color: 'var(--foreground)' }}
                >
                  Players
                </Link>
                {/* <Link
                  href="/games"
                  className="border-transparent hover:text-current inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  style={{ color: 'var(--secondary)', borderColor: 'var(--card-border)' }}
                >
                  Games
                </Link> */}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md"
                style={{ color: 'var(--foreground)' }}
                aria-label="Main menu"
                aria-expanded="false"
              >
                <svg 
                  className="h-6 w-6" 
                  stroke="currentColor" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  ) : (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  )}
                </svg>
              </button>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <ThemeToggle />
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
        
        {/* Mobile menu, toggle classes based on menu state */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1" style={{ borderTop: '1px solid var(--card-border)' }}>
            <Link
              href="/dashboard"
              className="block py-2 px-4 text-base font-medium"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/players"
              className="block py-2 px-4 text-base font-medium"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Players
            </Link>
            <div className="flex items-center justify-between px-4 py-2">
              <ThemeToggle />
              <Link 
                href="/api/auth/logout" 
                className="px-4 py-2 rounded transition-colors"
                style={{ backgroundColor: 'var(--error)', color: 'white' }}
                onClick={() => setIsMobileMenuOpen(false)}
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