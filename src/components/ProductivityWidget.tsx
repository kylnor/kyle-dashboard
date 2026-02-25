'use client'

import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import type { DashboardStats } from '@/types/dashboard'

export default function ProductivityWidget() {
  const { data, error, isLoading } = useSWR<DashboardStats>(
    '/api/stats',
    fetcher,
    { refreshInterval: 300000 } // Refresh every 5 minutes
  )

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Productivity Metrics</h2>
        <p className="text-red-500">Failed to load productivity data</p>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Productivity Metrics
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return '🔥 On fire!'
    if (score >= 50) return '💪 Good momentum'
    if (score >= 30) return '⚡ Getting started'
    return '☕ Time to focus'
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📊 Productivity Score</h2>
        <div className="text-right">
          <div className={`text-5xl font-bold ${getScoreColor(data.productivity.score)}`}>
            {data.productivity.score}
          </div>
          <div className="text-sm opacity-90">out of 100</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xl font-semibold mb-2">
          {getScoreMessage(data.productivity.score)}
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${data.productivity.score}%` }}
          />
        </div>
      </div>

      {/* Today's Activity Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <div className="text-3xl font-bold">{data.github.commits_today}</div>
          <div className="text-sm opacity-90">Commits Today</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <div className="text-3xl font-bold">{data.todoist.today}</div>
          <div className="text-sm opacity-90">Tasks Due Today</div>
        </div>
      </div>

      {/* Combined Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded">
          <span className="text-sm font-medium">Active GitHub Repos</span>
          <span className="text-lg font-bold">{data.github.active_repos}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded">
          <span className="text-sm font-medium">Total Active Tasks</span>
          <span className="text-lg font-bold">{data.todoist.total_active}</span>
        </div>
        {data.todoist.overdue > 0 && (
          <div className="flex items-center justify-between p-3 bg-red-500/30 backdrop-blur rounded border-l-4 border-red-300">
            <span className="text-sm font-medium">⚠️ Overdue Tasks</span>
            <span className="text-lg font-bold">{data.todoist.overdue}</span>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h3 className="text-sm font-semibold mb-3 opacity-90">Quick Insights</h3>
        <div className="space-y-2 text-sm">
          {data.productivity.commits_today === 0 && (
            <div className="flex items-start gap-2">
              <span>💻</span>
              <span>No commits yet today - time to code?</span>
            </div>
          )}
          {data.todoist.overdue > 5 && (
            <div className="flex items-start gap-2">
              <span>📋</span>
              <span>High overdue count - consider task prioritization</span>
            </div>
          )}
          {data.productivity.commits_today > 0 && data.todoist.today === 0 && (
            <div className="flex items-start gap-2">
              <span>✅</span>
              <span>Strong coding day! All today's tasks complete</span>
            </div>
          )}
          {data.github.commits_today >= 5 && (
            <div className="flex items-start gap-2">
              <span>🚀</span>
              <span>High commit velocity today - great momentum!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
