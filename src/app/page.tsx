import Header from '@/components/Header'
import ProductivityWidget from '@/components/ProductivityWidget'
import TodoistWidget from '@/components/TodoistWidget'
import GitHubWidget from '@/components/GitHubWidget'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          title="Kyle's Dashboard" 
          subtitle="Your productivity command center"
        />

        {/* Hero Stats - Productivity Widget */}
        <div className="mb-8">
          <ProductivityWidget />
        </div>

        {/* Two Column Layout for Todoist and GitHub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TodoistWidget />
          <GitHubWidget />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Last updated: {new Date().toLocaleString('en-US', { 
            timeZone: 'America/Denver',
            dateStyle: 'full',
            timeStyle: 'short'
          })} MST</p>
          <p className="mt-2">
            Data refreshes automatically every 5 minutes
          </p>
        </footer>
      </div>
    </main>
  )
}
