import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for Supabase tables
export interface TodoistTask {
  id: string
  content: string
  description: string
  project_id: string
  project_name?: string
  due_date?: string
  priority: number
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface GitHubCommit {
  sha: string
  message: string
  author_name: string
  author_email: string
  committed_date: string
  repository: string
  url: string
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description?: string
  language?: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  updated_at: string
  html_url: string
  private: boolean
}
