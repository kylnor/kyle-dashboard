import { NextResponse } from 'next/server'
import type { DashboardStats } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Fetch data from both APIs in parallel
    const [todoistResponse, githubResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/todoist/overview`, {
        next: { revalidate: 300 },
      }),
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/github/activity`, {
        next: { revalidate: 300 },
      }),
    ])

    const todoist = todoistResponse.ok ? await todoistResponse.json() : null
    const github = githubResponse.ok ? await githubResponse.json() : null

    // Calculate commits today
    const today = new Date().toISOString().split('T')[0]
    const commitsToday = github?.recent_commits?.filter(
      (c: any) => c.author.date.split('T')[0] === today
    ).length || 0

    // Calculate productivity score (0-100)
    // Formula: Balance between tasks and code
    const tasksScore = Math.min((todoist?.today_count || 0) * 5, 50) // Max 50 points
    const commitsScore = Math.min(commitsToday * 10, 50) // Max 50 points
    const productivityScore = tasksScore + commitsScore

    const stats: DashboardStats = {
      todoist: {
        overdue: todoist?.overdue_count || 0,
        today: todoist?.today_count || 0,
        total_active: todoist?.total_active || 0,
      },
      github: {
        commits_today: commitsToday,
        active_repos: github?.active_repos?.length || 0,
        total_contributions: github?.total_commits || 0,
      },
      productivity: {
        tasks_completed_today: 0, // Would need completed tasks API
        commits_today: commitsToday,
        score: productivityScore,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
