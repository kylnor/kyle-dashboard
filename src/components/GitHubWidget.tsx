'use client'

import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import type { GitHubActivity } from '@/types/dashboard'

export default function GitHubWidget() {
  const { data, error, isLoading } = useSWR<GitHubActivity>(
    '/api/github/activity',
    fetcher,
    { refreshInterval: 300000 } // Refresh every 5 minutes
  )

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-red-600">GitHub Activity</h2>
        <p className="text-red-500">Failed to load GitHub data</p>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">GitHub Activity</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      TypeScript: 'bg-blue-600',
      JavaScript: 'bg-yellow-500',
      Python: 'bg-green-600',
      Java: 'bg-red-600',
      HTML: 'bg-orange-500',
      CSS: 'bg-purple-500',
      Go: 'bg-cyan-500',
    }
    return colors[language] || 'bg-gray-500'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">💻 GitHub Activity</h2>
        <a
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'kylnor'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View Profile →
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="text-3xl font-bold">{data.total_commits}</div>
          <div className="text-sm opacity-90">Recent Commits</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="text-3xl font-bold">{data.total_repos}</div>
          <div className="text-sm opacity-90">Repositories</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="text-3xl font-bold">{data.active_repos.length}</div>
          <div className="text-sm opacity-90">Active Repos</div>
        </div>
      </div>

      {/* Language Distribution */}
      {data.languages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Language Distribution
          </h3>
          <div className="space-y-3">
            {data.languages.slice(0, 5).map((lang) => (
              <div key={lang.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(lang.name)}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {lang.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {lang.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${getLanguageColor(lang.name)} h-2 rounded-full transition-all`}
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Repositories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Most Active Repositories
        </h3>
        <div className="space-y-2">
          {data.active_repos.slice(0, 5).map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {repo.name}
                    </span>
                    {repo.private && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Private
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
                        {repo.language}
                      </span>
                    )}
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🔱 {repo.forks_count}</span>
                    {repo.open_issues_count > 0 && (
                      <span>⚠️ {repo.open_issues_count} issues</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-4">
                  {formatDate(repo.updated_at)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Commits */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Recent Commits
        </h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {data.recent_commits.slice(0, 10).map((commit) => (
            <a
              key={commit.sha}
              href={commit.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                    {commit.message}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                      {commit.sha.substring(0, 7)}
                    </span>
                    <span>→</span>
                    <span className="font-medium">{commit.repository}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-4">
                  {formatDate(commit.author.date)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
