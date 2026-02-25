import { NextResponse } from 'next/server'
import type { TodoistOverview, TodoistTask } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const todoistToken = process.env.TODOIST_API_TOKEN

    if (!todoistToken) {
      throw new Error('TODOIST_API_TOKEN not configured')
    }

    // Fetch tasks from Todoist API
    const tasksResponse = await fetch('https://api.todoist.com/rest/v2/tasks', {
      headers: {
        Authorization: `Bearer ${todoistToken}`,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!tasksResponse.ok) {
      throw new Error('Failed to fetch Todoist tasks')
    }

    const tasks: TodoistTask[] = await tasksResponse.json()

    // Fetch projects for names
    const projectsResponse = await fetch('https://api.todoist.com/rest/v2/projects', {
      headers: {
        Authorization: `Bearer ${todoistToken}`,
      },
      next: { revalidate: 300 },
    })

    const projects = projectsResponse.ok ? await projectsResponse.json() : []
    const projectMap = new Map(projects.map((p: any) => [p.id, p.name]))

    // Calculate overview statistics
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    const overdueTasks = tasks.filter((task) => {
      if (!task.due?.date) return false
      return task.due.date < today
    })

    const todayTasks = tasks.filter((task) => {
      if (!task.due?.date) return false
      return task.due.date === today
    })

    const upcomingTasks = tasks.filter((task) => {
      if (!task.due?.date) return false
      return task.due.date > today
    })

    // Group by project
    const byProject = Array.from(
      tasks.reduce((acc, task) => {
        const projectId = task.project_id
        const projectName = projectMap.get(projectId) || 'Inbox'
        
        if (!acc.has(projectId)) {
          acc.set(projectId, {
            project_id: projectId,
            project_name: projectName,
            task_count: 0,
            overdue_count: 0,
          })
        }

        const project = acc.get(projectId)!
        project.task_count++
        
        if (task.due?.date && task.due.date < today) {
          project.overdue_count++
        }

        return acc
      }, new Map()).values()
    ).sort((a, b) => b.task_count - a.task_count)

    // Group by priority
    const byPriority = [1, 2, 3, 4].map((priority) => ({
      priority,
      count: tasks.filter((t) => t.priority === priority).length,
    }))

    const overview: TodoistOverview = {
      overdue_count: overdueTasks.length,
      today_count: todayTasks.length,
      upcoming_count: upcomingTasks.length,
      total_active: tasks.length,
      by_project: byProject,
      by_priority: byPriority,
      overdue_tasks: overdueTasks.slice(0, 10), // Top 10 overdue
    }

    return NextResponse.json(overview)
  } catch (error) {
    console.error('Todoist API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Todoist data' },
      { status: 500 }
    )
  }
}
