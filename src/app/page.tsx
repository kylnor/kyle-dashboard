export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Kyle Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to your modern Next.js 14 dashboard
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Getting Started
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Edit src/app/page.tsx to customize this dashboard
            </p>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View Docs →
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Components
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Build reusable components in src/components
            </p>
            <span className="text-primary-600 font-medium">Learn More →</span>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Data Fetching
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Use SWR for efficient data fetching and caching
            </p>
            <a
              href="https://swr.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Explore SWR →
            </a>
          </div>
        </div>

        <section className="mt-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-lg mb-6 opacity-90">
            Your Next.js 14 dashboard is set up with TypeScript, TailwindCSS, and SWR.
            Start building amazing features!
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
              Add New Page
            </button>
            <button className="bg-primary-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-900 transition">
              View Components
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
