import Image from "next/image";
import Link from "next/link";
import { getSession } from '@auth0/nextjs-auth0';

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            FastBreak
            <span className="text-blue-600"> Dashboard</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your comprehensive source for Charlotte Hornets player statistics and insights.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              {session ? (
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/api/auth/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Player Statistics</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Comprehensive stats including points, rebounds, assists, and shooting percentages.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Performance Analytics</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Visual insights with charts and graphs showing player performance trends.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Team Overview</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get a complete picture of the Charlotte Hornets roster and team statistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
