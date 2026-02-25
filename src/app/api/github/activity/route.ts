import { NextResponse } from 'next/server'
import type { GitHubActivity, GitHubCommit, GitHubRepository } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

interface GitHubAPICommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      email: string
      date: string
    }
  }
  html_url: string
}

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN
    const githubUsername = process.env.GITHUB_USERNAME || 'kylnor'

    if (!githubToken) {
      throw new Error('GITHUB_TOKEN not configured')
    }

    const headers = {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github.v3+json',
    }

    // Fetch user repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
      {
        headers,
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    )

    if (!reposResponse.ok) {
      throw new Error('Failed to fetch GitHub repositories')
    }

    const repos: GitHubRepository[] = await reposResponse.json()

    // Get most recently updated repos (top 10)
    const activeRepos = repos
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 10)

    // Fetch recent commits from top 5 active repos
    const recentCommits: GitHubCommit[] = []
    const commitPromises = activeRepos.slice(0, 5).map(async (repo) => {
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?per_page=5`,
          {
            headers,
            next: { revalidate: 300 },
          }
        )
        
        if (commitsResponse.ok) {
          const commits: GitHubAPICommit[] = await commitsResponse.json()
          return commits.map((commit) => ({
            sha: commit.sha,
            message: commit.commit.message.split('\n')[0], // First line only
            author: commit.commit.author,
            html_url: commit.html_url,
            repository: repo.name,
          }))
        }
      } catch (error) {
        console.error(`Error fetching commits for ${repo.name}:`, error)
      }
      return []
    })

    const allCommits = (await Promise.all(commitPromises)).flat()
    recentCommits.push(...allCommits)

    // Sort commits by date
    recentCommits.sort((a, b) => 
      new Date(b.author.date).getTime() - new Date(a.author.date).getTime()
    )

    // Calculate language statistics
    const languageCounts = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1
      }
      return acc
    }, {} as { [key: string]: number })

    const totalLanguageCount = Object.values(languageCounts).reduce((a, b) => a + b, 0)
    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalLanguageCount) * 100),
      }))
      .sort((a, b) => b.count - a.count)

    // Calculate commit frequency (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const commitsByDate = recentCommits.reduce((acc, commit) => {
      const date = commit.author.date.split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as { [date: string]: number })

    const commitFrequency = Object.entries(commitsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Count commits today
    const today = new Date().toISOString().split('T')[0]
    const commitsToday = recentCommits.filter(
      (c) => c.author.date.split('T')[0] === today
    ).length

    const activity: GitHubActivity = {
      total_commits: recentCommits.length,
      total_repos: repos.length,
      languages,
      recent_commits: recentCommits.slice(0, 20),
      active_repos: activeRepos,
      commit_frequency: commitFrequency,
    }

    return NextResponse.json(activity)
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
}
