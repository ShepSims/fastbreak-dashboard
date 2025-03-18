import Link from "next/link";
import { getSession } from '@auth0/nextjs-auth0';

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="w-16 h-16">

            </div>
          </div>
          <h1 className="text-5xl font-bold sm:text-6xl md:text-7xl mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">FastBreak</span>
            <span className="text-gray-900"> Insights</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your comprehensive source for NBA player statistics and insights.
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center">
            <div className="rounded-md shadow">
              {session ? (
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/api/auth/login"
                  className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="px-6 py-8">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Player Statistics</h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Access comprehensive stats including points, rebounds, assists, and shooting percentages for all NBA players.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="px-6 py-8">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Performance Analytics</h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Gain visual insights with charts and graphs showing player performance trends throughout the season.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="px-6 py-8">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Team Overview</h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Get a complete picture of any NBA team roster and detailed statistics throughout the season.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="px-6 py-8">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Advanced Metrics</h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Dive into advanced metrics like PER, Win Shares, and Box Plus/Minus to evaluate player efficiency and impact.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="px-6 py-8">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-md bg-red-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18V3H3zm16 16H5V5h14v14z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Historical Data</h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Explore historical data and trends to understand how the game has evolved over the years.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="px-6 py-8">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-md bg-yellow-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Player Comparisons</h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Compare players across different eras and teams to see how they stack up against each other.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
