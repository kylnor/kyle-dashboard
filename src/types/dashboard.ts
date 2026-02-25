// Todoist Types
export interface TodoistTask {
  id: string
  content: string
  description: string
  project_id: string
  project_name?: string
  section_id?: string
  due?: {
    date: string
    is_recurring: boolean
    datetime?: string
    string?: string
    timezone?: string
  }
  priority: number
  is_completed: boolean
  created_at: string
  labels: string[]
}

export interface TodoistProject {
  id: string
  name: string
  color: string
  parent_id?: string
  order: number
  comment_count: number
  is_shared: boolean
  is_favorite: boolean
  is_inbox_project: boolean
  view_style: string
}

export interface TodoistOverview {
  overdue_count: number
  today_count: number
  upcoming_count: number
  total_active: number
  by_project: {
    project_id: string
    project_name: string
    task_count: number
    overdue_count: number
  }[]
  by_priority: {
    priority: number
    count: number
  }[]
  overdue_tasks: TodoistTask[]
}

// GitHub Types
export interface GitHubCommit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
  }
  html_url: string
  repository: string
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description?: string
  language?: string
  languages?: { [key: string]: number }
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  updated_at: string
  created_at: string
  html_url: string
  private: boolean
}

export interface GitHubActivity {
  total_commits: number
  total_repos: number
  languages: {
    name: string
    count: number
    percentage: number
  }[]
  recent_commits: GitHubCommit[]
  active_repos: GitHubRepository[]
  commit_frequency: {
    date: string
    count: number
  }[]
}

// Dashboard Stats
export interface DashboardStats {
  todoist: {
    overdue: number
    today: number
    total_active: number
  }
  github: {
    commits_today: number
    active_repos: number
    total_contributions: number
  }
  productivity: {
    tasks_completed_today: number
    commits_today: number
    score: number
  }
}
