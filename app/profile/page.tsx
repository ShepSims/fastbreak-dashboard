'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log('[Profile Page] Raw User Data:', JSON.stringify(user, null, 2));
    console.log('[Profile Page] Loading State:', isLoading);
    console.log('[Profile Page] Error State:', error);
    
    // Check if we're actually logged in
    if (!isLoading && !user) {
      console.log('[Profile Page] No user data - redirecting to login');
      router.push('/auth/login');
    }
  }, [user, isLoading, error, router]);

  if (isLoading) {
    console.log('[Profile Page] Currently loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    console.error('[Profile Page] Error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
          <p className="text-gray-600 mb-4">We couldn&apos;t load your profile information. Please try again.</p>
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Logging In Again
            </Link>
            <div className="mt-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('[Profile Page] No user data available');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to FastBreak Dashboard</h1>
          <p className="text-gray-600 mb-8">Please log in to view your profile</p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  console.log('[Profile Page] Rendering user profile:', JSON.stringify(user, null, 2));
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4">
            {user.picture && (
              <Image
                src={user.picture}
                alt={user.name || "Profile picture"}
                className="h-16 w-16 rounded-full"
                width={64}
                height={64}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              {user.sub && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.sub}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 