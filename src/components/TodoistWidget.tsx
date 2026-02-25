'use client'

import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import type { TodoistOverview } from '@/types/dashboard'

export default function TodoistWidget() {
  const { data, error, isLoading } = useSWR<TodoistOverview>(
    '/api/todoist/overview',
    fetcher,
    { refreshInterval: 300000 } // Refresh every 5 minutes
  )

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Todoist Overview</h2>
        <p className="text-red-500">Failed to load Todoist data</p>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Todoist Overview</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return 'bg-red-500'
      case 3: return 'bg-orange-500'
      case 2: return 'bg-blue-500'
      default: return 'bg-gray-400'
    }
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return 'P1 (Urgent)'
      case 3: return 'P2 (High)'
      case 2: return 'P3 (Medium)'
      default: return 'P4 (Low)'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📋 Todoist Overview</h2>
        <a
          href="https://todoist.com/app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Open Todoist →
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
          <div className="text-3xl font-bold text-red-600">{data.overdue_count}</div>
          <div className="text-sm text-red-700 dark:text-red-300">Overdue</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-600">{data.today_count}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Due Today</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">{data.upcoming_count}</div>
          <div className="text-sm text-green-700 dark:text-green-300">Upcoming</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500">
          <div className="text-3xl font-bold text-purple-600">{data.total_active}</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Total Active</div>
        </div>
      </div>

      {/* Projects Breakdown */}
      {data.by_project.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Tasks by Project
          </h3>
          <div className="space-y-2">
            {data.by_project.slice(0, 5).map((project) => (
              <div key={project.project_id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {project.project_name}
                    </span>
                    {project.overdue_count > 0 && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {project.overdue_count} overdue
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-lg font-bold text-primary-600">{project.task_count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Distribution */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Priority Distribution
        </h3>
        <div className="space-y-2">
          {data.by_priority
            .filter((p) => p.count > 0)
            .sort((a, b) => b.priority - a.priority)
            .map((priority) => (
              <div key={priority.priority} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority.priority)}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                  {getPriorityLabel(priority.priority)}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {priority.count}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Overdue Tasks Preview */}
      {data.overdue_tasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            Overdue Tasks
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.overdue_tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 bg-red-50 dark:bg-red-900/10 rounded border-l-2 border-red-500"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {task.content}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Due: {task.due?.date || 'No date'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
